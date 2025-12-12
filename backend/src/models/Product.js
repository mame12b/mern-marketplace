import mongoose from "mongoose";

const variantSchema = new mongoose.Schema({
    name: { type: String, required: true },
    value: { type: String, required: true },
    price: { type: Number, },
    stock: { type: Number, default: 0
    },
});

const productSchema = new mongoose.Schema({
    title: {
         type: String,
         required: [true, 'Please provide a title'], trim : true 
    },
    description: {
        type: String, 
        required: [true, 'Please provide a description'],
        maxlength: [5000, 'Description cannot be more than 5000 characters'],
    },
    price: { 
        type: Number, 
        required: [true, 'Please provide a price'],
        min: [0, 'Price cannot be negative'] 
    },
    comparePrice: { 
        type: Number, 
        min: [0, 'Compare price cannot be negative'] 
    },
    seller: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    category: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Category',
        // required: [true, 'Please select a category'] 
    },   
    subcategory: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Subcategory' 
    },
    images: [{ 
        type: String,
        maxlength: 255 }],
        variants: [variantSchema],
    stock: { 
        type: Number, 
        required: [true, 'Please provide stock quantity'],
        min: [0, 'Stock cannot be negative'] ,
        default: 0,
    },
    sku: { 
        type: String, 
        unique: true,
        sparse: true,
    },
    status: { 
        type: String, 
        enum: ['active', 'inactive', 'out-of-stock'], 
        default: 'active' 
    },
    rating: { 
        type: Number, 
        min: 0, 
        max: 5, 
        default: 0
    },
    reviewCount: { 
        type: Number, 
        default: 0 
    },
    tags: [String],
    brand: String,
    weight: Number, // in kg
    dimensions: {
        length: Number,
        width: Number,
        height: Number
    },
    shippingClass: {
        type: String,
        enum: ['standard', 'express', 'overnight'],
        default: 'standard'
    },
    views: { 
        type: Number, 
        default: 0 
    },
    featured: {
        type: Boolean,
        default: false
    },
    // SEO fields
    metaTitle: String,
    metaDescription: String,
    slug: { 
        type: String, 
        unique: true,
        sparse: true,
    },

}, { timestamps: true });

// create slug from title before saving
productSchema.pre('save', function(next) {
    if (this.isModified('title') && !this.slug) {
        this.slug = this.title.
        toLowerCase().
        replace(/[\s\W-]+/g, '-').
        replace(/^-+|-+$/g, '') + '-' + Date.now();
    }
    next();
});

// Indexes for search optimization{
productSchema.index({ title: 'text', description: 'text', tags: 'text' });


// indexes for filtering and sorting
productSchema.index({ price: 1 });
productSchema.index({ category: 1, status: 1 });
productSchema.index({ seller: 1 , status: 1 });
productSchema.index({ status: 1 });
productSchema.index({ createdAt: -1 });

const Product = mongoose.model('Product', productSchema);

export default Product;
    
    
