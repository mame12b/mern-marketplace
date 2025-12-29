import mongoose from 'mongoose';
import Category from './models/Category.js';
import dotenv from 'dotenv';

dotenv.config();

const categories = [
    {
        name: 'Electronics',
        slug: 'electronics',
        description: 'Electronic devices and gadgets',
        isActive: true,
        order: 1
    },
    {
        name: 'Clothing',
        slug: 'clothing',
        description: 'Fashion and apparel',
        isActive: true,
        order: 2
    },
    {
        name: 'Books',
        slug: 'books',
        description: 'Books and literature',
        isActive: true,
        order: 3
    },
    {
        name: 'Home & Garden',
        slug: 'home-garden',
        description: 'Home and garden products',
        isActive: true,
        order: 4
    },
    {
        name: 'Sports & Outdoors',
        slug: 'sports-outdoors',
        description: 'Sports equipment and outdoor gear',
        isActive: true,
        order: 5
    },
    {
        name: 'Toys & Games',
        slug: 'toys-games',
        description: 'Toys and games for all ages',
        isActive: true,
        order: 6
    },
    {
        name: 'Beauty & Health',
        slug: 'beauty-health',
        description: 'Beauty and health products',
        isActive: true,
        order: 7
    },
    {
        name: 'Automotive',
        slug: 'automotive',
        description: 'Car parts and accessories',
        isActive: true,
        order: 8
    }
];

const seedCategories = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('MongoDB connected...');

        // Clear existing categories
        await Category.deleteMany({});
        console.log('Existing categories cleared.');

        // Insert new categories
        const createdCategories = await Category.insertMany(categories);
        console.log(`${createdCategories.length} categories created successfully!`);

        process.exit(0);
    } catch (error) {
        console.error('Error seeding categories:', error);
        process.exit(1);
    }
};

seedCategories();
