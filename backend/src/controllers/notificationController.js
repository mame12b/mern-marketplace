import Notification from '../models/Notification.js';
import { ErrorResponse } from '../middleware/error.middleware.js';

// @desc    Get all notifications for user
// @route   GET /api/notifications
// @access  Private
export const getNotifications = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 20;
        const skip = (page - 1) * limit;

        const query = { recipient: req.user.id };
        
        if (req.query.isRead !== undefined) {
            query.isRead = req.query.isRead === 'true';
        }

        const notifications = await Notification.find(query)
            .populate('sender', 'firstName lastName avatar')
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Notification.countDocuments(query);
        const unreadCount = await Notification.countDocuments({
            recipient: req.user.id,
            isRead: false,
        });

        res.status(200).json({
            success: true,
            count: notifications.length,
            total,
            unreadCount,
            totalPages: Math.ceil(total / limit),
            currentPage: page,
            data: notifications,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
export const markAsRead = async (req, res, next) => {
    try {
        const notification = await Notification.findById(req.params.id);

        if (!notification) {
            return next(new ErrorResponse('Notification not found', 404));
        }

        if (notification.recipient.toString() !== req.user.id) {
            return next(new ErrorResponse('Not authorized', 403));
        }

        notification.isRead = true;
        notification.readAt = new Date();
        await notification.save();

        res.status(200).json({
            success: true,
            data: notification,
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private
export const markAllAsRead = async (req, res, next) => {
    try {
        await Notification.updateMany(
            { recipient: req.user.id, isRead: false },
            { isRead: true, readAt: new Date() }
        );

        res.status(200).json({
            success: true,
            message: 'All notifications marked as read',
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Delete notification
// @route   DELETE /api/notifications/:id
// @access  Private
export const deleteNotification = async (req, res, next) => {
    try {
        const notification = await Notification.findById(req.params.id);

        if (!notification) {
            return next(new ErrorResponse('Notification not found', 404));
        }

        if (notification.recipient.toString() !== req.user.id) {
            return next(new ErrorResponse('Not authorized', 403));
        }

        await notification.deleteOne();

        res.status(200).json({
            success: true,
            message: 'Notification deleted successfully',
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Create notification (internal use)
// @route   POST /api/notifications
// @access  Private
export const createNotification = async (notificationData) => {
    try {
        const notification = await Notification.create(notificationData);
        return notification;
    } catch (error) {
        console.error('Error creating notification:', error);
        return null;
    }
};

// Helper function to send notification via Socket.IO
export const sendNotification = async (io, recipientId, notification) => {
    if (io) {
        io.to(recipientId.toString()).emit('notification', notification);
    }
};
