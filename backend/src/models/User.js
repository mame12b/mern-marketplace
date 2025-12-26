import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const addressSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    addressLine1: { type: String, required: true },
    addressLine2: { type: String },
    city: { type: String, required: true },
    state: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
}, { _id: false });

const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, match: /^\S+@\S+\.\S+$/ },
    password: { type: String, required: true, minlength: 6 },
    phone: { type: String, trim: true },
    avatar: { type: String },
    role: { type: String, enum: ['buyer', 'seller', 'admin'], default: 'buyer' },  
    addresses: [addressSchema],
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }],
    cart: [{ 
        product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true, min: 1 },
   
       addedAt: { type: Date, default: Date.now }
    }], 
    emailVerified: { type: Boolean, default: false },
    emailVerificationToken: { type: String },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
    accountStatus: { type: String, enum: ['active', 'suspended', 'deactivated'], default: 'active' },
    lastLogin: { type: Date },
    shopName: { type: String },
    shopDescription: { type: String },
    shopLogo: { type: String },
    sellerRating: { type: Number, min: 0, max: 5, default: 0 },
    totalSales: { type: Number, default: 0 },
    // Seller Application Fee
    sellerApplicationFeePaid: { type: Boolean, default: false },
    sellerApplicationFeeAmount: { type: Number, default: 50 }, // $50 application fee
    sellerApplicationFeePaidAt: { type: Date },
    sellerApplicationFeeTransactionId: { type: String },
    sellerApplicationStatus: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Method to compare password
userSchema.methods.comparePassword = function(candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

// Method to generate JWT
userSchema.methods.generateJWT = function() {
    if (!process.env.JWT_SECRET) 
        throw new Error("JWT_SECRET is not defined in environment variables");
    return jwt.sign(
        { id: this._id, role: this.role },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRE || '7d' }
    );
};
//   generate refresh token
userSchema.methods.generateRefreshToken = function() {
    if (!process.env.JWT_REFRESH_SECRET) 
        throw new Error("JWT_REFRESH_SECRET is not defined in environment variables");
    return jwt.sign(
        { id: this._id },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: process.env.JWT_REFRESH_EXPIRE || '30d' }
    );
};
// generate email verification token
userSchema.methods.generateEmailVerificationToken = function() {
    const token = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    this.emailVerificationToken = token;
    return token;
};

export default mongoose.model('User', userSchema);
