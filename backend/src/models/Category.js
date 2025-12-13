import  mongoose  from "mongoose";

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true,
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    description: {
        type: String,
        maxlength: 500,
    },
    parentCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        default: null,
    },
    image: String,
    icon: String,
    order: {
        type: Number,
        default: 0,
    },
    isActive: {
        type: Boolean,
        default: true,
    }
}, { timestamps: true });

// create slug from name before saving
categorySchema.pre('save', function(next) {
    if (this.isModified('name') && !this.slug) {
        this.slug = this.name
        .toLowerCase()
        .replace(/ /g, '-')
        .replace(/[^\w-]+/g, '');
    }
    next();
});

const Category = mongoose.model('Category', categorySchema);

export default Category;