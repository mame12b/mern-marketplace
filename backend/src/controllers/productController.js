import Product from "../models/Product.js";
import { ErrorResponse  } from "../middleware/error.middleware.js";

// get all products
// GET /api/products
// Public
export const getProducts = async (req, res, next) => {
    try {
        // copy req.query 
        const reqQuery = { ...req.query };

        // fields to exclude
        const removeFields = ['select', 'sort', 'page', 'limit'];

        // loop over removeFields and delete them from reqQuery
        removeFields.forEach(param => delete reqQuery[param]);

        // build query 
        let query = { status: 'active' };

        // category filter
        if (reqQuery.category) {
            query.category = reqQuery.category;
        }

        // price filter
        if (reqQuery.minPrice || reqQuery.maxPrice) {
            query.price = {};
            if (reqQuery.minPrice) 
                query.price.$gte = Number(reqQuery.minPrice);
            if (reqQuery.maxPrice) 
                query.price.$lte = Number(reqQuery.maxPrice); 
        }

        //  search functionality
        if (req.query.search) {
            query.$text = { $search: req.query.search };
        }
        // create query 
        let dbQuery = Product.find(query).populate('seller', 'firstName lastName email')
            .populate('category', 'name');

            // select fields
        if (req.query.select) {
            const fields = req.query.select.split(',').join(' ');
            dbQuery = dbQuery.select(fields);
        }

        // sort 
        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ');
            dbQuery = dbQuery.sort(sortBy);
        } else {
            dbQuery = dbQuery.sort('-createdAt');
        }

        // pagination
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 25;
        const startIndex = (page - 1) * limit;
        const endIndex = page * limit;
        const total = await Product.countDocuments(query);

        dbQuery = dbQuery.skip(startIndex).limit(limit);

        // execute query
        const products = await dbQuery;

        // pagination result
        const pagination = {};

        if (endIndex < total) {
            pagination.next = {
                page: page + 1,
                limit
            };
        }

        if (startIndex > 0) {
            pagination.prev = {
                page: page - 1,
                limit
            };
        }

        res.status(200).json({
            success: true,
            count: products.length,
            pagination,
            data: products
        });
    } catch (error) {
        next(error);
    }
};

// get single product
// GET /api/products/:id
// Public
export const getProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id)
            .populate('seller', 'firstName lastName email')
            .populate('category', 'name description');

        if (!product) {
            return next(new ErrorResponse("Product not found", 404));
        }

        // increment view count
        product.views += 1;
        await product.save();

        res.status(200).json({
            success: true,
            data: product
        });
    } catch (error) {
        next(error);
    }
};

// create a product
// POST /api/products
// Private (seller or admin)
export const createProduct = async (req, res, next) => {
    try {
        // only sellers and admins can create products
        if (req.user.role !== 'seller' && req.user.role !== 'admin') {
            return next(new ErrorResponse("Not authorized to create products", 403));
        }

        const product = await Product.create({
            ...req.body,
            seller: req.user.id
        });

        res.status(201).json({
            success: true,
            message: "Product created successfully",
            data: product
        });
    } catch (error) {
        next(error);
    }
};

// update a product
// PUT /api/products/:id
// Private (seller or admin)
export const updateProduct = async (req, res, next) => {
    try {
        let product = await Product.findById(req.params.id);

        if (!product) {
            return next(new ErrorResponse("Product not found", 404));
        }

        // only the seller who created the product or admin can update it
        if (product.seller.toString() !== req.user.id && req.user.role !== 'admin') {
            return next(new ErrorResponse("Not authorized to update this product", 403));
        }
        
        product = await Product.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        }); 

        res.status(200).json({
            success: true,
            message: "Product updated successfully",
            data: product
        });
    } catch (error) {
        next(error);
    }
};

// delete a product
// DELETE /api/products/:id
// Private (seller or admin)
export const deleteProduct = async (req, res, next) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return next(new ErrorResponse("Product not found", 404));
        }

        // only the seller who created the product or admin can delete it
        if (product.seller.toString() !== req.user.id && req.user.role !== 'admin') {
            return next(new ErrorResponse("Not authorized to delete this product", 403));
        }

        await product.remove();

        res.status(200).json({
            success: true,
            message: "Product deleted successfully"
        });
    } catch (error) {
        next(error);
    }
};

// get seller products
// GET /api/products/seller/:my-products
// Private (seller)
export const getMyProducts = async (req, res, next) => {
    try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;

    const total = await Product.countDocuments({ seller: req.user.id });
    const products = await Product.find({ seller: req.user.id })
        .skip(startIndex)
        .limit(limit)
        .sort('-createdAt');

        res.status(200).json({
            success: true,
            count: products.length,
            total,
            data: products
        });
    } catch (error) {
        next(error);
    }
};

