import Review from "../models/Review.js";
import Product from "../models/Product.js";
import Order from "../models/Order.js";
import {ErrorResponse} from "../middleware/error.middleware.js";

//  Add product review
// @route   POST /api/reviews
// @access  Private
export const addReview = async (req, res, next) => {
    try {
        const { product, rating, title, comment, images } = req.body;
        
        // check if product exists
        const productExists = await Product.findById(product);
        if (!productExists) {
            return next(new ErrorResponse('Product not found', 404));
        }

        // check if user has purchased the product
        const hasPurchased = await Order.findOne({
            buyer: req.user._id,
            'items.product': product,
            status: 'delivered',
        });

        //  check if user already reviewed this product
        const existingReview = await Review.findOne({
            product,
            user: req.user._id,
        });

        if (existingReview) {
            return next(new ErrorResponse('You have already reviewed this product', 400));
        }

        const review = await Review.create({
            product,
            user: req.user._id,
            rating,
            title,
            comment,
            images,
            verifiedPurchase: !!hasPurchased,
        });

        await review.populate('user', 'firstName lastName avatar');

        res.status(201).json({ 
            success: true, 
            message: 'Review added successfully',
            data: review 
        });

    } catch (error) {
        next(error);
    }
};

//  get product reviews
// @route   GET /api/reviews/product/:productId
// @access  Public
export const getProductReviews = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const startIndex = (page - 1) * limit;

        // build query 
        let query = {
             product: req.params.productId, 
             status: 'approved' 
            };

            // filter by rating
        if (req.query.rating) {
            query.rating = parseInt(req.query.rating);
        }

        // filter by verified purchase
        if (req.query.verified === 'true') {
            query.verifiedPurchase = true;
        }

        const total = await Review.countDocuments(query);

        // sorting
        let sort = "-createdAt"; // default sort by newest
        if (req.query.sort === 'helpful') {
            sort = '-helpful';
        } else if (req.query.sort === 'rating-high') {
            sort = '-rating';
        } else if (req.query.sort === 'rating-low') {
            sort = 'rating';
        }

        const reviews = await Review.find(query)
            .sort(sort)
            .skip(startIndex)
            .limit(limit)
            .populate('user', 'firstName lastName avatar');

            // get rating distribution
            const ratingStats = await Review.aggregate([
                { $match: { product: productExists._id, status: 'approved' } },
                {
                    $group: {
                        _id: '$rating',
                        count: { $sum: 1 },
                    },
                },
            ]);

            res.status(200).json({ 
                success: true, 
                count: reviews.length,
                total,
                ratingStats,
                data: reviews 
            });

    } catch (error) {
        next(error);
    }
};

// get single review
// @route   GET /api/reviews/:id
// @access  Public
export const getReview = async (req, res, next) => {
    try {
        const review = await Review.findById(req.params.id)
            .populate('user', 'firstName lastName avatar')
            .populate('product', 'name slug');

        if (!review) {
            return next(new ErrorResponse('Review not found', 404));
        }

        res.status(200).json({ 
            success: true, 
            data: review 
        });

    } catch (error) {
        next(error);
    }
};

//  update review
// @route   PUT /api/reviews/:id
// @access  Private
export const updateReview = async (req, res, next) => {
    try {
        let review = await Review.findById(req.params.id);

        if (!review) {
            return next(new ErrorResponse('Review not found', 404));
        }
        
        // only the review owner can update
        if (review.user.toString() !== req.user.id) {
            return next(new ErrorResponse('Not authorized to update this review', 403));
        }
        const { rating, title, comment, images } = req.body;

        review = await Review.findByIdAndUpdate(
            req.params.id,
            { rating, title, comment, images }, 
            { new: true, runValidators: true }
        );

        res.status(200).json({ 
            success: true, 
            message: 'Review updated successfully',
            data: review 
        });

    } catch (error) {
        next(error);
    }
};

//  delete review
// @route   DELETE /api/reviews/:id
// @access  Private
export const deleteReview = async (req, res, next) => {
    try {
        const review = await Review.findById(req.params.id);

        if (!review) {
            return next(new ErrorResponse('Review not found', 404));
        }

        // make sure owns the review or is admin
        if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return next(new ErrorResponse('Not authorized to delete this review', 403));
        }
        await review.remove();

        res.status(200).json({ 
            success: true, 
            message: 'Review deleted successfully' 
        });

    } catch (error) {
        next(error);
    }
};

// marke review as helpful
// @route   POST /api/reviews/:id/helpful
// @access  Private
export const markHelpful = async (req, res, next) => {
    try {
        const review = await Review.findById(req.params.id);

        if (!review) {
            return next(new ErrorResponse('Review not found', 404));
        }

        // check if user already marked as helpful
        if (review.helpful.includes(req.user.id)) {
            // remove from helpful
            review.helpful = review.helpful.filter(
                id => id.toString() !== req.user.id
            );
        } else {
            // add to helpful
            review.helpful.push(req.user.id);
        }

        await review.save();

        res.status(200).json({ 
            success: true, 
            data: {
                helpfulCount: review.helpful.length
            }
        });

    } catch (error) {
        next(error);
    }
};

// user's reviews
// @route   GET /api/reviews/user/my-reviews
// @access  Private
export const getMyReviews = async (req, res, next) => {
    try{
        const reviews = await Review.find({ user: req.user._id })
            .populate('product', 'name slug')
            .sort('-createdAt');

        res.status(200).json({ 
            success: true, 
            count: reviews.length,
            data: reviews 
        });
    } catch (error) {
        next(error);
    }
};

//  moderate reviews (admin)
// @route   PUT /api/reviews/:id/moderate
// @access  Private/Admin
export const moderateReview = async (req, res, next) => {
    try {
        const { status } = req.body;
        
        if (!['approved', 'rejected'].includes(status)) {
            return next(new ErrorResponse('Invalid status value', 400));
        }

        const review = await Review.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true, runValidators: true }
        );

        if (!review) {
            return next(new ErrorResponse('Review not found', 404));
        }

        res.status(200).json({ 
            success: true, 
            message: `Review ${status} successfully`,
            data: review 
        });
    } catch (error) {
        next(error);
    }
};
// pending reviews (admin)
// @route   GET /api/reviews/pending
// @access  Private/Admin
export const getPendingReviews = async (req, res, next) =>{
    try {
        const reviews = await Review.find({ status: 'pending' })
            .populate('user', 'firstName lastName avatar')
            .populate('product', 'name slug')
            .sort('-createdAt');

        res.status(200).json({ 
            success: true, 
            count: reviews.length,
            data: reviews 
        });
    } catch (error) {
        next(error);
    }       
};