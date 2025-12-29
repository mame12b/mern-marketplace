import Category from "../models/Category.js";
import Product from "../models/Product.js";
import { ErrorResponse } from "../middleware/error.middleware.js";

// get all categories
export const getCategories = async (req, res, next) => {
    try {
        const query = { isActive: true };

        // get only parent categories if specified
        if (req.query.parent === 'null') {
            query.parentCategory = null;

        } else if (req.query.parent) {
            query.parentCategory = req.query.parent;
        }

        const categories = await Category.find(query)
        .sort('order name')
        .populate('parentCategory', 'name slug');

        // get subcategories for each category
        const categoriesWithSubcategories = await Promise.all(
            categories.map(async (category) => {
            const subcategories = await Category.find({ 
                parentCategory: category._id, 
                isActive: true 
            })
            .sort('order name');


            return {
                ...category.toObject(),
                subcategories,
            };
        }))
        
        res.status(200).json({
            success: true,
            count: categories.length,
            data: categoriesWithSubcategories,
        });
    }
    catch (error) {
        next(error);
    }
};
// get single category
//  @route  GET /api/categories/:id
//  @access public
export const getCategory = async (req, res, next) => {
    try {
        const category = await Category.findById(req.params.id)
        .populate('parent', 'name slug');

        if (!category) {
            return next(new ErrorResponse('Category not found', 404));
        }
        
        // get subcategories
        const subcategories = await Category.find({ 
            parent: category._id, 
            isActive: true 
        });

        //  get product count 
        const productCount = await Product.countDocuments({ 
            category: category._id, 
            isActive: true 
        });

        res.status(200).json({
            success: true,
            data: {
                ...category.toObject(),
                subcategories,
                productCount,
            },
        });
    }
    catch (error) {
        next(error);
    }
}; 

// get categories by slug  
//  @route  GET /api/categories/slug/:slug
//  @access public
export const getCategoryBySlug = async (req, res, next) => {
    try {
        const category = await Category.findOne({ slug: req.params.slug })
        .populate('parent', 'name slug');

        if (!category) {
            return next(new ErrorResponse('Category not found', 404));
        }

        // get subcategories
        const subcategories = await Category.find({ 
            parent: category._id, 
            isActive: true 
        });

        //  get product count 
        const productCount = await Product.countDocuments({ 
            category: category._id, 
            status: 'active'
        });

        res.status(200).json({
            success: true,
            data: {
                ...category.toObject(),
                subcategories,
                productCount,
            },
        });
    }
    catch (error) {
        next(error);
    }
};

//  create  category 
//  @route  POST /api/categories
//  @access private/admin
export const createCategory = async (req, res, next) => {
    try {
        const category = await Category.create(req.body);

        res.status(201).json({
            success: true,
            message: 'Category created successfully',
            data: category,
        }); 
    }
    catch (error) {
        next(error);
    }
};

// update category  
//  @route  PUT /api/categories/:id
//  @access private/admin
export const updateCategory = async (req, res, next) => {
    try {
        let category = await Category.findById(req.params.id);

        if (!category) {
            return next(new ErrorResponse('Category not found', 404));
        }

        //  don't allow changing parent to itself or  it's descendants
        if (req.body.parent) {
            if (req.body.parent === req.params.id) {
                return next(new ErrorResponse('Category cannot be its own parent', 400));
            }

            //  check if new parent is a decentdant
            const isDescendant = await checkIfDescendant(req.params.id, req.body.parent);
            if (isDescendant) {
                return next(new ErrorResponse('Category cannot be assigned to its descendant', 400));
            }
        }

            category = await Category.findByIdAndUpdate(
                req.params.id,
                 req.body, 
                 { new: true, runValidators: true }
            );

            res.status(200).json({
                success: true,
                message: 'Category updated successfully',
                data: category,
            });
        } catch (error) {
        next(error);
    }
};

// delete category
//  @route  DELETE /api/categories/:id
//  @access private/admin
export const deleteCategory = async (req, res, next) => {
    try {
        const category = await Category.findById(req.params.id);

        if (!category) {
            return next(new ErrorResponse('Category not found', 404));
        }

        // check if category has subcategories
        const subcategories = await Category.countDocuments({ parent: category._id });
        if (subcategories > 0) {
            return next(new ErrorResponse('Category has subcategories. Delete or reassign them first.', 400));
        }


        // check if category has products
        const products = await Product.countDocuments({ category: req.params.id });
        if (products > 0) {
            return next(new ErrorResponse('Category has products. Delete or reassign them first.', 400));
        }

        await category.remove();

        res.status(200).json({
            success: true,
            message: 'Category deleted successfully',
        });
    }
    catch (error) {
        next(error);
    }
};

// get category tree
//  @route  GET /api/categories/tree
//  @access public
export const getCategoryTree = async (req, res, next) => {
    try {
        // fetch all categories
        const categories = await Category.find({ isActive: true });

        // build tree structure
        const categorryMap = {};
        const tree = [];
        
        // Create a map of categories
        categories.forEach(cat => {
            categorryMap[cat._id] = { 
                ...cat.toObject(), 
                children: [] 
            };
        });

        // build the tree
        categories.forEach(cat => {
            if (cat.parent) {
                if (categorryMap[cat.parent]) {
                    categorryMap[cat.parent].children.push(categorryMap[cat._id]);
                }
            } else {
                tree.push(categorryMap[cat._id]);
            }
        });
        
        // sort by order 
        const sortByOrder = (arr) => {
            arr.sort((a, b) => a.order - b.order);
            arr.forEach(item => {
                if (item.children.length > 0) {
                    sortByOrder(item.children);
                }
            });
        };
        sortByOrder(tree);

        res.status(200).json({
            success: true,
            data: tree,
        }); 
    }
    catch (error) {
        next(error);
    }
};
// get popular categories
//  @route  GET /api/categories/popular
//  @access public
export const getPopularCategories = async (req, res, next) => {
    try {

        const limit = parseInt(req.query.limit, 10) || 10;

        // get categories with most products
        const categories = await Product.aggregate([    
            { $match: { isActive: true } },
            { $group: { _id: "$category", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: limit },
             ]);

             const categoryIds = categories.map(cat => cat._id);
             const categoryDetails = await Category.find({ 
                _id: { $in: categoryIds },
                isActive: true 
            }); 

            const result = categories.map(c => {
                const details = categoryDetails.find(d => d._id.toString() === c._id.toString());
                return {
                    ...details.toObject(),
                    productCount: c.count,
                };
            });
            
        res.status(200).json({
            success: true,
            data: result,
        });
    } catch (error) {
        next(error);
    }
};

// helper function to check if a category is a descendant
async function checkIfDescendant(categoryId, potentialParentId) {
    const category = await Category.findById(potentialParentId);

    if (!category) return false;
    if (category.parent) return false;
    if (category.parent.toString() === categoryId) return true;

    return await checkIfDescendant(categoryId, category.parent);
};