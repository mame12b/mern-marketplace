import mongoose from "mongoose";

const orderItemsSchema = new mongoose.Schema({
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
    },
    title:  String,
    image: String, 
    quantity: {
        type: Number,
        required: true,
        min: 1,
    },
    price: {
        type: Number,
        required: true,
        min: 0,
    },
    variant: {
        name: String,
        value: String,
    }
});
const orderSchema = new mongoose.Schema({
    orderNumber: {
        type: String,
        required: true,
        unique: true,
    },
    buyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    tax: {
        type: Number,
        default: 0,
    },
    shippingCost: {
        type: Number,
        default: 0,
    },
    discount: {
        type: Number,
        default: 0,
    },
    totalAmount: {
        type: Number,
        required: true,
},
shippingAddress: {
        fullName: { type: String, required: true },
        phone: { type: String, required: true },
        addressLine1: { type: String, required: true },
        addressLine2: { type: String },
        city: { type: String, required: true },
        state: { type: String, required: true },
        postalCode: { type: String, required: true },
        country: { type: String, required: true },
    },
    billingAddress: {
        fullName: { type: String, required: true },
        phone: { type: String, required: true },
        addressLine1: { type: String, required: true },
        addressLine2: { type: String },
        city: { type: String, required: true },
        state: { type: String, required: true },
        postalCode: { type: String, required: true },
        country: { type: String, required: true },
    },
    status: {
        type: String,
        enum: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'],
        default: 'pending',
    },
    paymentMethod: {
        type: String,
        enum: ['credit_card', 'paypal', 'bank_transfer', 'cash_on_delivery'],
        required: true,
    },
    paymentStatus: {
        type: String,
        enum: ['pending', 'paid', 'failed', 'refunded'],
        default: 'pending',
    },
    paymentIntent: String,
    transactionId: String,
    trackingNumber: String,
    carrier: String,
    estimatedDelivery: Date,
    deliveredAt: Date,
    cancelledAt: Date,
    cancelReason: String,
    notes: String,
    couponCode: String,
    statusHistory: [{
        status: String,
        date: { type: Date, default: Date.now },
        notes: String,
    }]
}, { timestamps: true });

//  generate order number before saving
orderSchema.pre('save', async function (next) {
    if (!this.orderNumber) {
        const date = new Date();
        const year = date.getFullYear().toString().slice(-2);
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const count = await this.constructor.countDocuments();
        this.orderNumber = `ORD${year}${month}${(count + 1).toString().padStart(6, '0')}`;
    }
    next();
});

//  Indexes
orderSchema.index({ buyer: 1, createdAt: -1 });
orderSchema.index({ orderNumber: 1 });
orderSchema.index({ status: 1 });

export default mongoose.model("Order", orderSchema);


