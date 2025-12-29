import Coupon from '../models/Coupon.js';
import { ErrorResponse } from '../middleware/error.middleware.js';

// @desc    Create a new coupon
// @route   POST /api/coupons
// @access  Admin/Seller
export const createCoupon = async (req, res, next) => {
    try {
        const coupon = await Coupon.create({
            ...req.body,
            createdBy: req.user.id,
        });

        res.status(201).json({
            success: true,
            message: 'Coupon created successfully',
            data: coupon,
        });
    } catch (error) {
        if (error.code === 11000) {
            return next(new ErrorResponse('Coupon code already exists', 400));
        }
        next(error);
    }
};

// @desc    Get all coupons
// @route   GET /api/coupons
// @access  Admin/Seller
export const getCoupons = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const query = {};
        
        // Filter by admin/seller
        if (req.user.role !== 'admin') {
            query.createdBy = req.user.id;
        }

        if (req.query.isActive) {
            query.isActive = req.query.isActive === 'true';
        }

        const coupons = await Coupon.find(query)
            .populate('createdBy', 'firstName lastName email')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Coupon.countDocuments(query);

        res.status(200).json({
            success: true,
            count: coupons.length,
            total,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            data: coupons,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get single coupon
// @route   GET /api/coupons/:id
// @access  Admin/Seller
export const getCoupon = async (req, res, next) => {
    try {
        const coupon = await Coupon.findById(req.params.id)
            .populate('createdBy', 'firstName lastName email')
            .populate('applicableCategories', 'name')
            .populate('applicableProducts', 'title price')
            .populate('excludedProducts', 'title');

        if (!coupon) {
            return next(new ErrorResponse('Coupon not found', 404));
        }

        // Check ownership for sellers
        if (req.user.role === 'seller' && coupon.createdBy._id.toString() !== req.user.id) {
            return next(new ErrorResponse('Not authorized to access this coupon', 403));
        }

        res.status(200).json({
            success: true,
            data: coupon,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Validate and apply coupon
// @route   POST /api/coupons/validate
// @access  Private
export const validateCoupon = async (req, res, next) => {
    try {
        const { code, orderAmount, products } = req.body;

        const coupon = await Coupon.findOne({ code: code.toUpperCase() });

        if (!coupon) {
            return next(new ErrorResponse('Invalid coupon code', 400));
        }

        // Check if coupon is valid
        if (!coupon.isValid()) {
            return next(new ErrorResponse('This coupon is expired or inactive', 400));
        }

        // Check if user can use coupon
        if (!coupon.canUserUse(req.user.id)) {
            return next(new ErrorResponse('You have exceeded the usage limit for this coupon', 400));
        }

        // Check minimum purchase amount
        if (orderAmount < coupon.minPurchaseAmount) {
            return next(
                new ErrorResponse(
                    `Minimum purchase amount of $${coupon.minPurchaseAmount} required`,
                    400
                )
            );
        }

        // Check applicable products/categories
        if (products && (coupon.applicableProducts.length > 0 || coupon.applicableCategories.length > 0)) {
            const productIds = products.map(p => p.toString());
            
            // Check if any product is excluded
            const hasExcluded = coupon.excludedProducts.some(id => 
                productIds.includes(id.toString())
            );
            if (hasExcluded) {
                return next(new ErrorResponse('Some products in your cart are excluded from this coupon', 400));
            }

            // Check if products match applicable ones
            if (coupon.applicableProducts.length > 0) {
                const hasApplicable = coupon.applicableProducts.some(id => 
                    productIds.includes(id.toString())
                );
                if (!hasApplicable) {
                    return next(new ErrorResponse('This coupon is not applicable to the products in your cart', 400));
                }
            }
        }

        // Calculate discount
        const discount = coupon.calculateDiscount(orderAmount);

        res.status(200).json({
            success: true,
            data: {
                couponId: coupon._id,
                code: coupon.code,
                discount,
                finalAmount: orderAmount - discount,
            },
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update coupon
// @route   PUT /api/coupons/:id
// @access  Admin/Seller
export const updateCoupon = async (req, res, next) => {
    try {
        let coupon = await Coupon.findById(req.params.id);

        if (!coupon) {
            return next(new ErrorResponse('Coupon not found', 404));
        }

        // Check ownership for sellers
        if (req.user.role === 'seller' && coupon.createdBy.toString() !== req.user.id) {
            return next(new ErrorResponse('Not authorized to update this coupon', 403));
        }

        coupon = await Coupon.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        res.status(200).json({
            success: true,
            message: 'Coupon updated successfully',
            data: coupon,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete coupon
// @route   DELETE /api/coupons/:id
// @access  Admin/Seller
export const deleteCoupon = async (req, res, next) => {
    try {
        const coupon = await Coupon.findById(req.params.id);

        if (!coupon) {
            return next(new ErrorResponse('Coupon not found', 404));
        }

        // Check ownership for sellers
        if (req.user.role === 'seller' && coupon.createdBy.toString() !== req.user.id) {
            return next(new ErrorResponse('Not authorized to delete this coupon', 403));
        }

        await coupon.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Coupon deleted successfully',
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Mark coupon as used
// @route   POST /api/coupons/:id/use
// @access  Private (internal use)
export const useCoupon = async (req, res, next) => {
    try {
        const coupon = await Coupon.findById(req.params.id);

        if (!coupon) {
            return next(new ErrorResponse('Coupon not found', 404));
        }

        // Increment usage count
        coupon.usedCount += 1;

        // Update user usage
        const userUsage = coupon.usedBy.find(u => u.user.toString() === req.user.id);
        if (userUsage) {
            userUsage.usageCount += 1;
            userUsage.lastUsed = new Date();
        } else {
            coupon.usedBy.push({
                user: req.user.id,
                usageCount: 1,
                lastUsed: new Date(),
            });
        }

        await coupon.save();

        res.status(200).json({
            success: true,
            message: 'Coupon marked as used',
        });
    } catch (error) {
        next(error);
    }
};
