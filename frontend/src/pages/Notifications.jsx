import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { FaBell, FaCheck, FaTrash } from 'react-icons/fa';
import notificationService from '../services/notificationService';
import Loading from '../components/common/Loading';

const Notifications = () => {
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [filter, setFilter] = useState('all'); // all, unread, read
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchNotifications();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [filter]);

    const fetchNotifications = async () => {
        setLoading(true);
        try {
            const params = {};
            if (filter === 'unread') params.isRead = 'false';
            if (filter === 'read') params.isRead = 'true';

            const response = await notificationService.getNotifications(params);
            setNotifications(response.data);
        } catch  {
            toast.error('Failed to fetch notifications');
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAsRead = async (id) => {
        try {
            await notificationService.markAsRead(id);
            setNotifications(notifications.map(n => 
                n._id === id ? { ...n, isRead: true } : n
            ));
            toast.success('Marked as read');
        } catch  {
            toast.error('Failed to mark as read');
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await notificationService.markAllAsRead();
            setNotifications(notifications.map(n => ({ ...n, isRead: true })));
            toast.success('All notifications marked as read');
        } catch  {
            toast.error('Failed to mark all as read');
        }
    };

    const handleDelete = async (id) => {
        try {
            await notificationService.deleteNotification(id);
            setNotifications(notifications.filter(n => n._id !== id));
            toast.success('Notification deleted');
        } catch  {
            toast.error('Failed to delete notification');
        }
    };

    const handleNotificationClick = (notification) => {
        if (!notification.isRead) {
            handleMarkAsRead(notification._id);
        }
        if (notification.link) {
            navigate(notification.link);
        }
    };

    const getNotificationIcon = (type) => {
        const icons = {
            order_placed: '🛍️',
            order_confirmed: '✅',
            order_shipped: '🚚',
            order_delivered: '📦',
            order_cancelled: '❌',
            product_review: '⭐',
            new_message: '💬',
            price_drop: '💰',
            back_in_stock: '🔔',
            seller_approved: '🎉',
            seller_rejected: '😞',
            payment_success: '💳',
            payment_failed: '⚠️',
            general: '📢'
        };
        return icons[type] || '🔔';
    };

    const getTimeAgo = (date) => {
        const seconds = Math.floor((new Date() - new Date(date)) / 1000);
        if (seconds < 60) return 'Just now';
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        const days = Math.floor(hours / 24);
        if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
        return new Date(date).toLocaleDateString();
    };

    if (loading) {
        return <Loading />;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
                        <FaBell className="text-indigo-600" />
                        Notifications
                    </h1>
                    {notifications.some(n => !n.isRead) && (
                        <button
                            onClick={handleMarkAllAsRead}
                            className="text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-2"
                        >
                            <FaCheck />
                            Mark all as read
                        </button>
                    )}
                </div>

                {/* Filters */}
                <div className="flex gap-2 mb-6">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-4 py-2 rounded-lg font-medium transition ${
                            filter === 'all'
                                ? 'bg-indigo-600 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                    >
                        All
                    </button>
                    <button
                        onClick={() => setFilter('unread')}
                        className={`px-4 py-2 rounded-lg font-medium transition ${
                            filter === 'unread'
                                ? 'bg-indigo-600 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                    >
                        Unread
                    </button>
                    <button
                        onClick={() => setFilter('read')}
                        className={`px-4 py-2 rounded-lg font-medium transition ${
                            filter === 'read'
                                ? 'bg-indigo-600 text-white'
                                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                        }`}
                    >
                        Read
                    </button>
                </div>

                {/* Notifications List */}
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    {notifications.length === 0 ? (
                        <div className="p-16 text-center text-gray-500">
                            <FaBell className="text-6xl mx-auto mb-4 text-gray-300" />
                            <h3 className="text-xl font-semibold text-gray-700 mb-2">
                                No notifications
                            </h3>
                            <p>You're all caught up!</p>
                        </div>
                    ) : (
                        <div className="divide-y divide-gray-100">
                            {notifications.map((notification) => (
                                <div
                                    key={notification._id}
                                    className={`p-4 hover:bg-gray-50 transition ${
                                        !notification.isRead ? 'bg-blue-50' : ''
                                    }`}
                                >
                                    <div className="flex items-start gap-4">
                                        <span className="text-3xl flex-shrink-0">
                                            {getNotificationIcon(notification.type)}
                                        </span>
                                        <div 
                                            className="flex-1 cursor-pointer"
                                            onClick={() => handleNotificationClick(notification)}
                                        >
                                            <div className="flex items-start justify-between mb-1">
                                                <h3 className="font-semibold text-gray-900">
                                                    {notification.title}
                                                    {!notification.isRead && (
                                                        <span className="ml-2 inline-block w-2 h-2 bg-blue-500 rounded-full"></span>
                                                    )}
                                                </h3>
                                            </div>
                                            <p className="text-gray-600 text-sm mb-2">
                                                {notification.message}
                                            </p>
                                            <p className="text-xs text-gray-400">
                                                {getTimeAgo(notification.createdAt)}
                                            </p>
                                        </div>
                                        <div className="flex gap-2">
                                            {!notification.isRead && (
                                                <button
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        handleMarkAsRead(notification._id);
                                                    }}
                                                    className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition"
                                                    title="Mark as read"
                                                >
                                                    <FaCheck />
                                                </button>
                                            )}
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDelete(notification._id);
                                                }}
                                                className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition"
                                                title="Delete"
                                            >
                                                <FaTrash />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Notifications;
