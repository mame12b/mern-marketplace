import express from "express";
import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
    {
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        rating: {
            type: Number,
            required: true,
            min: 1,
            max: 5,
        },
        title: {
            type: String,
            trim: true,
            maxlength: 100,
        },
        comment: {
            type: String,
            required: [true, 'Comment is required'],
            maxlength: 1000,
        },
        images : [{
            url: String,
            public_id: String,
        }],
        verifiedPurchase: {
            type: Boolean,
            default: false,
        },
        helpful: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        }],
        status: {
            type: String,
            enum: ['pending', 'approved', 'rejected'],
            default: 'pending',
        },
    },
    { timestamps: true }
);

// Prevent duplicate reviews by the same user on the same product
reviewSchema.index({ product: 1, user: 1 }, { unique: true });

reviewSchema.post('save', async function () {
    const Review = this.constructor;
    const stats = await Review.aggregate([
        { $match: { product: this.product, status: 'approved' } },
        {
            $group: {
                _id: '$product',
                avgRating: { $avg: '$rating' },
                count: { $sum: 1 },
            },
        }
    ]);

    if (stats.length > 0) {
        await mongoose.model('Product').findByIdAndUpdate(this.product, {
           rating: Math.round(stats[0].avgRating * 10) / 10,
            reviewCount: stats[0].count,
        });
    }
});

export default mongoose.model('Review', reviewSchema);
