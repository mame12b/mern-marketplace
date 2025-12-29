import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import { ErrorResponse } from '../middleware/error.middleware.js';

// @desc    Get seller analytics
// @route   GET /api/analytics/seller
// @access  Private/Seller
export const getSellerAnalytics = async (req, res, next) => {
    try {
        const sellerId = req.user.id;
        const { period = '30' } = req.query; // days
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - parseInt(period));

        // Get seller's products
        const products = await Product.find({ seller: sellerId });
        const productIds = products.map(p => p._id);

        // Get orders containing seller's products
        const orders = await Order.find({
            'items.product': { $in: productIds },
            createdAt: { $gte: startDate },
        });

        // Calculate total revenue
        const totalRevenue = orders.reduce((sum, order) => {
            const sellerItems = order.items.filter(item => 
                productIds.some(id => id.toString() === item.product.toString())
            );
            const orderRevenue = sellerItems.reduce((itemSum, item) => 
                itemSum + (item.price * item.quantity), 0
            );
            return sum + orderRevenue;
        }, 0);

        // Calculate total orders
        const totalOrders = orders.length;

        // Get total products
        const totalProducts = products.length;

        // Get active products
        const activeProducts = products.filter(p => p.status === 'active').length;

        // Get top selling products
        const topProducts = await Order.aggregate([
            { $match: { createdAt: { $gte: startDate } } },
            { $unwind: '$items' },
            { $match: { 'items.product': { $in: productIds } } },
            {
                $group: {
                    _id: '$items.product',
                    totalSold: { $sum: '$items.quantity' },
                    revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
                }
            },
            { $sort: { totalSold: -1 } },
            { $limit: 5 },
            {
                $lookup: {
                    from: 'products',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'product',
                }
            },
            { $unwind: '$product' },
            {
                $project: {
                    title: '$product.title',
                    totalSold: 1,
                    revenue: 1,
                    image: { $arrayElemAt: ['$product.images', 0] },
                }
            }
        ]);

        // Revenue over time (daily for last period)
        const revenueOverTime = await Order.aggregate([
            { $match: { createdAt: { $gte: startDate } } },
            { $unwind: '$items' },
            { $match: { 'items.product': { $in: productIds } } },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                    revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
                    orders: { $sum: 1 },
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // Order status breakdown
        const ordersByStatus = await Order.aggregate([
            { $match: { 'items.product': { $in: productIds }, createdAt: { $gte: startDate } } },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);

        // Get low stock products
        const lowStockProducts = products.filter(p => p.stock > 0 && p.stock < 10);

        res.status(200).json({
            success: true,
            data: {
                overview: {
                    totalRevenue,
                    totalOrders,
                    totalProducts,
                    activeProducts,
                    lowStockCount: lowStockProducts.length,
                },
                topProducts,
                revenueOverTime,
                ordersByStatus,
                lowStockProducts: lowStockProducts.map(p => ({
                    _id: p._id,
                    title: p.title,
                    stock: p.stock,
                    image: p.images[0],
                })),
            },
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get admin analytics
// @route   GET /api/analytics/admin
// @access  Private/Admin
export const getAdminAnalytics = async (req, res, next) => {
    try {
        const { period = '30' } = req.query;
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - parseInt(period));

        // Total users by role
        const userStats = await User.aggregate([
            {
                $group: {
                    _id: '$role',
                    count: { $sum: 1 }
                }
            }
        ]);

        // Total revenue
        const revenueStats = await Order.aggregate([
            { $match: { createdAt: { $gte: startDate } } },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: '$totalAmount' },
                    totalOrders: { $sum: 1 },
                    averageOrderValue: { $avg: '$totalAmount' }
                }
            }
        ]);

        // Orders by status
        const ordersByStatus = await Order.aggregate([
            { $match: { createdAt: { $gte: startDate } } },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);

        // Revenue over time
        const revenueOverTime = await Order.aggregate([
            { $match: { createdAt: { $gte: startDate } } },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                    revenue: { $sum: '$totalAmount' },
                    orders: { $sum: 1 },
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // Top sellers
        const topSellers = await Order.aggregate([
            { $match: { createdAt: { $gte: startDate } } },
            { $unwind: '$items' },
            {
                $lookup: {
                    from: 'products',
                    localField: 'items.product',
                    foreignField: '_id',
                    as: 'product'
                }
            },
            { $unwind: '$product' },
            {
                $group: {
                    _id: '$product.seller',
                    totalRevenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
                    totalOrders: { $sum: 1 },
                }
            },
            { $sort: { totalRevenue: -1 } },
            { $limit: 10 },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'seller'
                }
            },
            { $unwind: '$seller' },
            {
                $project: {
                    sellerName: { $concat: ['$seller.firstName', ' ', '$seller.lastName'] },
                    shopName: '$seller.shopName',
                    totalRevenue: 1,
                    totalOrders: 1,
                }
            }
        ]);

        // Top products
        const topProducts = await Order.aggregate([
            { $match: { createdAt: { $gte: startDate } } },
            { $unwind: '$items' },
            {
                $group: {
                    _id: '$items.product',
                    totalSold: { $sum: '$items.quantity' },
                    revenue: { $sum: { $multiply: ['$items.price', '$items.quantity'] } },
                }
            },
            { $sort: { revenue: -1 } },
            { $limit: 10 },
            {
                $lookup: {
                    from: 'products',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'product'
                }
            },
            { $unwind: '$product' },
            {
                $project: {
                    title: '$product.title',
                    totalSold: 1,
                    revenue: 1,
                    image: { $arrayElemAt: ['$product.images', 0] },
                }
            }
        ]);

        // Product stats
        const productStats = await Product.aggregate([
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);

        // New users over time
        const newUsersOverTime = await User.aggregate([
            { $match: { createdAt: { $gte: startDate } } },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        res.status(200).json({
            success: true,
            data: {
                overview: {
                    ...revenueStats[0],
                    totalUsers: userStats.reduce((sum, stat) => sum + stat.count, 0),
                },
                userStats,
                ordersByStatus,
                productStats,
                revenueOverTime,
                newUsersOverTime,
                topSellers,
                topProducts,
            },
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get buyer analytics
// @route   GET /api/analytics/buyer
// @access  Private
export const getBuyerAnalytics = async (req, res, next) => {
    try {
        const buyerId = req.user.id;
        const { period = '30' } = req.query;
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - parseInt(period));

        const orders = await Order.find({
            buyer: buyerId,
            createdAt: { $gte: startDate }
        });

        const totalSpent = orders.reduce((sum, order) => sum + order.totalAmount, 0);
        const totalOrders = orders.length;

        // Orders by status
        const ordersByStatus = orders.reduce((acc, order) => {
            acc[order.status] = (acc[order.status] || 0) + 1;
            return acc;
        }, {});

        // Spending over time
        const spendingOverTime = await Order.aggregate([
            { $match: { buyer: buyerId, createdAt: { $gte: startDate } } },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                    amount: { $sum: '$totalAmount' },
                }
            },
            { $sort: { _id: 1 } }
        ]);

        res.status(200).json({
            success: true,
            data: {
                overview: {
                    totalSpent,
                    totalOrders,
                    averageOrderValue: totalOrders > 0 ? totalSpent / totalOrders : 0,
                },
                ordersByStatus,
                spendingOverTime,
            },
        });
    } catch (error) {
        next(error);
    }
};
