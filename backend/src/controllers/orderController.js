import Order from '../models/Order.js';
import User from '../models/User.js';
import Product from '../models/Product.js';
import { ErrorResponse } from '../middleware/error.middleware.js';

//  create new order
// POST /api/orders
// Private
export const createOrder = async (req, res, next) => {
    try {
        const {
            items,
            shippingAddress,
            billingAddress,
            paymentMethod,
            couponCode
        } = req.body;

        if (!items || items.length === 0) {
            return next(new ErrorResponse("Order must contain at least one item", 400));
        }
        // validate products and calculate total amount
        let subtotal = 0;
        const orderItems = [];

        for (const item of items) {
            const product = await Product.findById(item.product);
            if (!product) {
                return next(new ErrorResponse(`Product not found: ${item.product}`, 404));
            }
            if (product.status !== 'active') {
                return next(new ErrorResponse(`Product ${product.title} is not available for sale`, 400));
            }
            if (item.quantity > product.stock) {
                return next(new ErrorResponse(`Insufficient stock for product: ${product.title}`, 400));
            }

            orderItems.push({
                product: product._id,
                title: product.title,
                image: product.images[0]?.url || '',
                quantity: item.quantity,
                price: product.price,
                variant: item.variant || null,
            });

            subtotal += product.price * item.quantity;
        }

        // calculate tax, shipping, discount
        const tax = subtotal * 0.05; // example 10% tax
        const shippingCost = subtotal >= 50 ? 0 : 10; // flat rate shipping
        let discount = 0; // implement coupon logic as needed

        const totalAmount = subtotal + tax + shippingCost - discount;

        // create order
        const order = await Order.create({
            buyer: req.user.id,
            items: orderItems,
            subtotal,
            tax,
            shippingCost,
            discount,
            totalAmount,
            shippingAddress,
            billingAddress: billingAddress || shippingAddress,
            paymentMethod,
            couponCode,
            statusHistory: [{
                 status: 'pending', 
                 notes: 'Order created',
                 updatedAt: new Date() 
                }]
        });

        // update product stock and sales
        for(const item of items) {
            await Product.findByIdAndUpdate(item.product, {
                $inc: { 
                    stock: -item.quantity, 
                    sales: item.quantity 
                }
            });
        }
        // clear user's cart
        await User.findByIdAndUpdate(req.user.id, { $set: { cart: [] } });

        res.status(201).json({
            success: true,
            message: "Order created successfully",
            data: order
        });     
    } catch (error) {
        next(error); 
    }
};
//  get all orders for user
// GET /api/orders
// Private
export const getMyOrders = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const startIndex = (page - 1) * limit;

        const total = await Order.countDocuments({ buyer: req.user.id });
        
        const orders = await Order.find({ buyer: req.user.id })
        .sort('-createdAt')
        .skip(startIndex)
        .limit(limit)
        .populate('items.product', 'title images');

        res.status(200).json({
            success: true,
            count: orders.length,
            total,
            data: orders
        });
    } catch (error) {
        next(error);
    }
};

// get single order by ID
// GET /api/orders/:id
// Private
export const getOrder = async (req, res, next) => {
    try {
        const order = await Order.findById(req.params.id)
        .populate('buyer', 'firstName lastName email phone')
        .populate('items.product', 'title images seller');

        if (!order) {
            return next(new ErrorResponse("Order not found", 404));
        }

        // make sure user owns the order or is seller/admin
        if (order.buyer._id.toString() !== req.user.id &&
         req.user.role === 'admin') {
            
            // check if user is seller of any product in the order
            const isSeller = order.items.some(item => 
                item.product.seller.toString() === req.user.id
            );

            if (!isSeller) {
                return next(new ErrorResponse("Not authorized to view this order", 403));
            }
        }
        res.status(200).json({
            success: true,
            data: order
        });
    } catch (error) {
        next(error);
    }
};

// update order status (admin/seller)
// PUT /api/orders/:id/status
// Private
export const updateOrderStatus = async (req, res, next) => {
    try {
        const { status, notes, trackingNumber, carrier } = req.body;
        const order = await Order.findById(req.params.id)
        .populate('items.product', 'seller');

        if (!order) {
            return next(new ErrorResponse("Order not found", 404));
        }

        // check authorization
        if (req.user.role !== 'admin') {
            const isSeller = order.items.some(item =>  
                item.product.seller.toString() === req.user.id
            );

            if (!isSeller) {
                return next(new ErrorResponse("Not authorized to update this order", 403));
            }
        }
        //  validate status transition as needed
        const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
        if (!validStatuses.includes(status)) {
            return next(new ErrorResponse("Invalid order status", 400));
        }
        
        order.status = status;
        if (trackingNumber) order.trackingNumber = trackingNumber;
        if (carrier) order.carrier = carrier;

        if(status === 'delivered') {
            order.deliveredAt = new Date();
        }
        order.statusHistory.push({
            status,
            notes: notes || '',
            updatedAt: new Date()
        });

        await order.save();

        res.status(200).json({
            success: true,
            message: "Order status updated successfully",
            data: order
        });
    } catch (error) {
        next(error);
    }
};

// cancel order
// PUT /api/orders/:id/cancel
// Private
export const cancelOrder = async (req, res, next) => {
    try {
        const { reason } = req.body;
        const order = await Order.findById(req.params.id);

        if (!order) {
            return next(new ErrorResponse("Order not found", 404));
        }

        // only buyer can cancel their order
        if (order.buyer.toString() !== req.user.id) {
            return next(new ErrorResponse("Not authorized to cancel this order", 403));
        }

        //  can only cancel if pending or confirmed
        if (!['pending', 'confirmed'].includes(order.status)) {
            return next(new ErrorResponse("Order cannot be cancelled at this stage", 400));
        }
        order.status = 'cancelled';
        order.cancelledAt = new Date();
        order.cancelReason = reason || '';
        order.statusHistory.push({
            status: 'cancelled',
            notes: reason || 'Order cancelled by buyer',
            updatedAt: new Date()
        });
        
        await order.save();

        res.status(200).json({
            success: true,
            message: "Order cancelled successfully",
            data: order
        });
    } catch (error) {
        next(error);
    }
};

// get seller orders
// GET /api/orders/seller/my-orders
// Private (seller)
export const getSellerOrders = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const startIndex = (page - 1) * limit;

        // find all orders that contain products from this seller
        const orders = await Order.find({
            'items.product': { 
                $in: await Product.find({ seller: req.user.id }).distinct('_id') 
            }
        })
        .sort('-createdAt')
        .skip(startIndex)
        .limit(limit)
        .populate('buyer', 'firstName lastName email')
        .populate('items.product', 'title images');

        const total = await Order.countDocuments({
            'items.product': { 
                $in: await Product.find({ seller: req.user.id }).distinct('_id') 
            }
        });

        res.status(200).json({
            success: true,
            count: orders.length,
            total,
            data: orders
        });
    } catch (error) {
        next(error);
    }
};  
//  get all orders (admin)
// GET /api/orders/admin/all
// Private (admin)
export const getAllOrders = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const startIndex = (page - 1) * limit;

        let query = {};

        // filtering by status
        if (req.query.status) {
            query.status = req.query.status;
        }

        // filtering by date range
        if (req.query.startDate || req.query.endDate) {
            query.createdAt = {};
            if (req.query.startDate) query.createdAt.$gte = new Date(req.query.startDate);
            if (req.query.endDate) query.createdAt.$lte = new Date(req.query.endDate);
        }

        const total = await Order.countDocuments(query);
        
        const orders = await Order.find(query)
        .sort('-createdAt')
        .skip(startIndex)
        .limit(limit)
        .populate('buyer', 'firstName lastName email')
        .populate('items.product', 'title images');

        // calculate statistics
        const stats = await Order.aggregate([
            { $match: query },
            { 
                $group: {
                _id: null,
                totalSales: { $sum: "$totalAmount" },
                totalOrders: { $sum: 1 },
                averageOrderValue: { $avg: "$totalAmount" }
            }
        }
    ]);

        res.status(200).json({
            success: true,
            count: orders.length,
            total,
            statistics: stats[0] || { totalSales: 0, totalOrders: 0, averageOrderValue: 0 },
            data: orders
        });
    } catch (error) {
        next(error);
    }
}; 
//  get order statistics 
// GET /api/orders/stats
// Private (seller/admin)
export const getOrderStats = async (req, res, next) => {
    try {
        let matchStage = {};

        if (req.user.role === 'seller') {
            const sellerProductIds = await Product.find({ seller: req.user.id }).distinct('_id');
            matchStage = { 'items.product': { $in: sellerProductIds } };
        }

        const stats = await Order.aggregate([
            { $match: matchStage },
            { 
                $group: {
                    _id: '$status',
                    count: { $sum: 1 },
                    totalSales: { $sum: '$totalAmount' }
                }
            }
        ]);
        const recentOrders = await Order.find(matchStage)
        .sort('-createdAt')
        .limit(5)
        .populate('buyer', 'firstName lastName ')
        .populate('items.product', 'title ');

        res.status(200).json({
            success: true,
            data: {
                stats,
                recentOrders
            }
        });
    } catch (error) {
        next(error);
    }
};