import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import Review from '../models/Review.js';
import { ErrorResponse } from '../middleware/error.middleware.js';


//  get dashboard statistics
//  @route  /api/admin/dashboard
//  @access private (admin)
export const getDashboardStats = async (req, res, next) => {
    try {
        // get date (default to last 30 days 
        const startDate = req.query.startDate
            ? new Date(req.query.startDate)
            : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
        const endDate = req.query.endDate
            ? new Date(req.query.endDate)
            : new Date();

            //  total counts
        const totalUsers = await User.countDocuments();
        const totalProducts = await Product.countDocuments();
        const totalOrders = await Order.countDocuments();
        const totalReviews = await Review.countDocuments();

        // Active counts
        const activeUsers = await User.countDocuments({ accountStatus: 'active' });
        const activeProducts = await Product.countDocuments({ status: 'active' });
        const pendingOrders = await Order.countDocuments({ status: 'pending' });

        // Revenue statistics
        const revenueStats = await Order.aggregate([
            {
                $match: {
                    status:{$in: ['completed', 'processing', 'shipped', 'delivered'] },
                    createdAt: { $gte: startDate, $lte: endDate }
                }
            },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: '$totalAmount' },
                    averageOrderValue: { $avg: '$totalAmount' },
                    orderCount: { $sum: 1 }
                }
            }
        ]);
        // 
        // daily revenue for chart 
        const dailyRevenue = await Order.aggregate([
            {
                $match: {
                    status:{$in: ['completed', 'processing', 'shipped', 'delivered']},
                    createdAt: { $gte: startDate, $lte: endDate }
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
                    },
                    revenue: { $sum: '$totalAmount' },
                    orders: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 }  // Sort by date ascending
            }
        ]);

        // Top selling products
        const topProducts = await Order.aggregate([
            { $unwind: '$items' },
            {
                $group: {
                    _id: '$items.productId',
                    totalSold: { $sum: '$items.quantity' },
                    revenue: { $sum: { $multiply: ['$items.quantity', '$items.price'] } }
                }
            },
            { $sort: { totalSold: -1 } },
            { $limit: 10 },
        ]);

        const TopProductsDetails = await Product.find({
            _id: { $in: topProducts.map(p => p._id) }
        }).select('title image price');

        const topProductsWithDetails = topProducts.map(p => {
            const details = TopProductsDetails.find(d => d._id.toString() === p._id.toString());
            return {
                ...p,
                product: details
            };
        });

        // user growth
        const userGrowth = await User.aggregate([
            {
                $match: {
                    createdAt: { $gte: startDate, $lte: endDate }
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: "%Y-%m-%d", date: "$createdAt" }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } } // Sort by date ascending
        ]);

        // recent activity
        const recentOrders = await Order.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .populate('buyer', 'firstName lastName email')
            .populate('orderNumber totalAmount status createdAt');
            
        const recentUsers = await User.find()
            .sort({ createdAt: -1 })
            .limit(5)
            .select('firstName lastName email createdAt');

        res.status(200).json({
            success: true,
            data: {
                overview: {
                    totalUsers,
                    activeUsers,
                    totalProducts,
                    activeProducts,
                    totalOrders,
                    pendingOrders,
                    totalReviews
                },
                revenue: revenueStats[0] || {
                totalRevenue: 0, 
                averageOrderValue: 0,
                 orderCount: 0 
                },
                charts: {
                    dailyRevenue,
                    userGrowth
                },  
                topProducts: topProductsWithDetails,
                recentActivity: {
                    orders: recentOrders,
                    recentUsers
                }
            }
        });
    } catch (error) {
        next(new ErrorResponse('Server Error', 500));
    }
        };
 //  get all users
//  @route  /api/admin/users
//  @access private (admin)
export const getAllUsers = async (req, res, next) => { 
    try {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 20;
        const startIndex = (page - 1) * limit;

        let query = {};

        // filter by role
        if (req.query.role) {
            query.role = req.query.role;
        }

        // filter by account status
        if (req.query.status) {
            query.accountStatus = req.query.status;
        }

        // search by name or email  
        if (req.query.search) {
            query.$or = [
                { firstName: { $regex: req.query.search, $options: 'i' } },
                { lastName: { $regex: req.query.search, $options: 'i' } },
                { email: { $regex: req.query.search, $options: 'i' } }
            ];
        }

        const total = await User.countDocuments(query);
        const users = await User.find(query)
            .skip(startIndex)
            .limit(limit)
            .select('-password') // exclude password
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: users.length,
            total,
            data: users
        });
    } catch (error) {
        next(new ErrorResponse('Server Error', 500));
    }
};

//  update user  status
//  @route  /api/admin/users/:id/status
//  @access private (admin)
export const updateUserStatus = async (req, res, next) => {
    try {
        const { accountStatus } = req.body;

        if (!['active', 'suspended', 'deleted'].includes(accountStatus)) {
            return next(new ErrorResponse('Invalid account status', 400));
        }
        
        const user = await User.findByIdAndUpdate(
            req.params.id,
            { accountStatus },
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) {
            return next(new ErrorResponse('User not found', 404));
        }

        res.status(200).json({
            success: true,
            message : 'User account status updated successfully',
            data: user
        });
    } catch (error) {
        next(new ErrorResponse('Server Error', 500));
    }
};

//  get all products with filters 
//  @route  /api/admin/products
//  @access private (admin)
export const getAllProducts = async (req, res, next) => { 
    try {
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 20;
        const startIndex = (page - 1) * limit;

        let query = {};

        // filter by status
        if (req.query.status) {
            query.status = req.query.status;
        }

        // search by title 
        if (req.query.search) {
            query.title = { $regex: req.query.search, $options: 'i' };
        }
        
        const total = await Product.countDocuments(query);
        const products = await Product.find(query)
               .populate('seller', 'firstName lastName shopName ')
               .populate('category', 'name')
               .sort({ createdAt: -1 })
               .skip(startIndex)
               .limit(limit);

        res.status(200).json({
            success: true,
            count: products.length,
            total,
            data: products
        });
    } catch (error) {   
      next (error);  
    }
};

// Approve or reject product
//  @route  /api/admin/products/:id/status
//  @access private (admin)
export const moderateProduct = async (req, res, next) => {
    try {       
        const { status } = req.body;

        if (!['active', 'rejected'].includes(status)) {
            return next(new ErrorResponse('Invalid product status', 400));
        }
        
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true, runValidators: true }
        );
        if (!product) {
            return next(new ErrorResponse('Product not found', 404));
        }

        res.status(200).json({
            success: true,
            message : `Product ${status} successfully`,
            data: product
        });
    } catch (error) {
        next(new ErrorResponse('Server Error', 500));
    }
};
//  get platform analytics
//  @route  /api/admin/analytics
//  @access private (admin)
export const getAnalytics = async (req, res, next) => {
    try {
        const peroird = req.query.period || '30d';
        const startDate = new Date(Date.now() - parseInt(peroird) * 24 * 60 * 60 * 1000);

        // user analytics
        const userByRole = await User.aggregate([
            { $group: { _id: '$role', count: { $sum: 1 } } }
        ]);

        // product analytics
        const productsByCategory = await Product.aggregate([
            { $match: { status: 'active' } },
            { $group: { _id: '$category', count: { $sum: 1 } } },
            {$lookup: {
                 from: 'categories', 
                 localField: '_id', 
                 foreignField: '_id', 
                 as: 'category' 
                } },

            { $unwind: '$category' },
            { $project: {
                 _id: 0,
                 category: '$category.name',
                  count: 1 
                } }

        ]);

        // order analytics
        const ordersByStatus = await Order.aggregate([
            { $group: { _id: '$status', count: { $sum: 1 } } }
        ]);

        //  revenue by month
        const revenueByMonth = await Order.aggregate([
            {
                $match: {
                    status:{$in: ['completed', 'processing', 'shipped', 'delivered']},
                    createdAt: { $gte: startDate }
                }
            },
            {
                $group: {
                    _id: { 
                    $dateToString: { format: "%Y-%m", date: "$createdAt" } },
                    revenue: { $sum: '$totalAmount' },
                    orders: { $sum: 1  }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        res.status(200).json({
            success: true,
            data: {
                users:  userByRole,
                products:  productsByCategory,
                orders:  ordersByStatus,
                revenue:  revenueByMonth
            }
        });
    } catch (error) {
        next(new ErrorResponse('Server Error', 500));
    }
}; 
//  get system settings
//  @route  /api/admin/settings
//  @access private (admin)
export const getSettings = async (req, res, next) => {
    try {
        // this would typically fetch settings from a database or config file
        // for now, return from environment variables
        const settings = {
            siteName: process.env.SITE_NAME || 'Marketplace Platform',
            currency: process.env.CURRENCY || 'AED',
            taxRate: process.env.TAX_RATE || 0.05,
            shippingCost : process.env.SHIPPING_COST || 10.0,
            freeShippingThreshold: process.env.FREE_SHIPPING_THRESHOLD || 100.0,
            maxFileSize: process.env.MAX_FILE_SIZE || 5102410, // kg
            allowedFileTypes: process.env.ALLOWED_FILE_TYPES?.split(',') || ['image/jpeg', 'image/png', 'application/pdf']
        };
        
        res.status(200).json({
            success: true,
            data: settings
        });
    } catch (error) {
        next(new ErrorResponse('Server Error', 500));
    }
};

//  Delete a user
//  @route  /api/admin/users/:id
//  @access private (admin)
export const deleteUser = async (req, res, next) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);

        if (!user) {
            return next(new ErrorResponse('User not found', 404));
        }

        //  don't allow deleting admin accounts
        if (user.role === 'admin') {
            return next(new ErrorResponse('Cannot delete admin accounts', 403));
        }

        await user.remove();

        res.status(200).json({
            success: true,
            message: 'User deleted successfully'
        });
    } catch (error) {
        next(new ErrorResponse('Server Error', 500));
    }
};