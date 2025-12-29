import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema({
    code: {
        type: String,
        required: [true, 'Please provide a coupon code'],
        unique: true,
        uppercase: true,
        trim: true,
    },
    description: {
        type: String,
        required: [true, 'Please provide a description'],
    },
    discountType: {
        type: String,
        enum: ['percentage', 'fixed'],
        required: true,
    },
    discountValue: {
        type: Number,
        required: [true, 'Please provide a discount value'],
        min: [0, 'Discount value cannot be negative'],
    },
    minPurchaseAmount: {
        type: Number,
        default: 0,
        min: [0, 'Minimum purchase amount cannot be negative'],
    },
    maxDiscountAmount: {
        type: Number, // For percentage discounts
        min: [0, 'Maximum discount amount cannot be negative'],
    },
    startDate: {
        type: Date,
        required: true,
    },
    expiryDate: {
        type: Date,
        required: true,
    },
    usageLimit: {
        type: Number,
        default: null, // null means unlimited
    },
    usedCount: {
        type: Number,
        default: 0,
    },
    userUsageLimit: {
        type: Number,
        default: 1, // How many times each user can use it
    },
    usedBy: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        usageCount: {
            type: Number,
            default: 0,
        },
        lastUsed: {
            type: Date,
        }
    }],
    applicableCategories: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Category',
    }],
    applicableProducts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
    }],
    excludedProducts: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
    }],
    isActive: {
        type: Boolean,
        default: true,
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
}, { timestamps: true });

// Index for faster queries
couponSchema.index({ code: 1 });
couponSchema.index({ expiryDate: 1 });
couponSchema.index({ isActive: 1 });

// Method to check if coupon is valid
couponSchema.methods.isValid = function() {
    const now = new Date();
    return (
        this.isActive &&
        now >= this.startDate &&
        now <= this.expiryDate &&
        (this.usageLimit === null || this.usedCount < this.usageLimit)
    );
};

// Method to check if user can use coupon
couponSchema.methods.canUserUse = function(userId) {
    const userUsage = this.usedBy.find(u => u.user.toString() === userId.toString());
    if (!userUsage) return true;
    return userUsage.usageCount < this.userUsageLimit;
};

// Method to calculate discount
couponSchema.methods.calculateDiscount = function(orderAmount) {
    if (orderAmount < this.minPurchaseAmount) {
        return 0;
    }

    let discount = 0;
    if (this.discountType === 'percentage') {
        discount = (orderAmount * this.discountValue) / 100;
        if (this.maxDiscountAmount && discount > this.maxDiscountAmount) {
            discount = this.maxDiscountAmount;
        }
    } else {
        discount = this.discountValue;
    }

    return Math.min(discount, orderAmount);
};

export default mongoose.model('Coupon', couponSchema);
