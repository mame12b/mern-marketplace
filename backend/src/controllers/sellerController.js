import User from "../models/User.js";
import { ErrorResponse } from "../middleware/error.middleware.js";

// @desc    Apply to become a seller (pay application fee)
// @route   POST /api/seller/apply
// @access  Private
export const applyForSeller = async (req, res, next) => {
    try {
        const { paymentMethod, transactionId } = req.body;

        // Check if user already paid
        if (req.user.sellerApplicationFeePaid) {
            return next(new ErrorResponse("You have already paid the seller application fee", 400));
        }

        // Validate payment details
        if (!paymentMethod || !transactionId) {
            return next(new ErrorResponse("Payment method and transaction ID are required", 400));
        }

        // Update user record
        const user = await User.findById(req.user.id);
        
        user.role = 'seller';
        user.sellerApplicationFeePaid = true;
        user.sellerApplicationFeePaidAt = Date.now();
        user.sellerApplicationFeeTransactionId = transactionId;
        user.sellerApplicationStatus = 'approved';

        await user.save();

        res.status(200).json({
            success: true,
            message: "Seller application fee paid successfully. You can now post products!",
            user: {
                id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                role: user.role,
                sellerApplicationFeePaid: user.sellerApplicationFeePaid,
                sellerApplicationStatus: user.sellerApplicationStatus
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get seller application status
// @route   GET /api/seller/application-status
// @access  Private
export const getSellerApplicationStatus = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.id).select('-password');

        res.status(200).json({
            success: true,
            data: {
                role: user.role,
                sellerApplicationFeePaid: user.sellerApplicationFeePaid,
                sellerApplicationFeeAmount: user.sellerApplicationFeeAmount,
                sellerApplicationFeePaidAt: user.sellerApplicationFeePaidAt,
                sellerApplicationStatus: user.sellerApplicationStatus
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Update seller shop info
// @route   PUT /api/seller/shop
// @access  Private (Seller only)
export const updateShopInfo = async (req, res, next) => {
    try {
        const { shopName, shopDescription, shopLogo } = req.body;

        if (req.user.role !== 'seller') {
            return next(new ErrorResponse("Only sellers can update shop information", 403));
        }

        const user = await User.findByIdAndUpdate(
            req.user.id,
            {
                shopName,
                shopDescription,
                shopLogo
            },
            { new: true, runValidators: true }
        ).select('-password');

        res.status(200).json({
            success: true,
            message: "Shop information updated successfully",
            data: user
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get seller dashboard stats
// @route   GET /api/seller/dashboard-stats
// @access  Private (Seller only)
export const getSellerDashboardStats = async (req, res, next) => {
    try {
        if (req.user.role !== 'seller') {
            return next(new ErrorResponse("Only sellers can access dashboard stats", 403));
        }

        const user = await User.findById(req.user.id);

        // You can expand this to include product stats, order stats, etc.
        const stats = {
            totalSales: user.totalSales || 0,
            sellerRating: user.sellerRating || 0,
            shopName: user.shopName,
            shopDescription: user.shopDescription,
            sellerApplicationFeePaid: user.sellerApplicationFeePaid,
            sellerApplicationStatus: user.sellerApplicationStatus
        };

        res.status(200).json({
            success: true,
            data: stats
        });
    } catch (error) {
        next(error);
    }
};
