import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaBell } from 'react-icons/fa';
import notificationService from '../../services/notificationService';
import { io } from 'socket.io-client';

const NotificationBadge = () => {
    const [unreadCount, setUnreadCount] = useState(0);
    const [notifications, setNotifications] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');

    const fetchNotifications = async () => {
        try {
            const response = await notificationService.getNotifications({ 
                limit: 5,
                isRead: false 
            });
            setUnreadCount(response.unreadCount || 0);
            setNotifications(response.data || []);
        } catch (err) {
            console.error('Failed to fetch notifications:', err);
        }
    };

    useEffect(() => {
        fetchNotifications();
        
        // Initialize Socket.IO for real-time notifications
        const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:5000', {
            auth: { token: localStorage.getItem('token') }
        });

        socket.on('connect', () => {
            socket.emit('join', currentUser.id);
        });

        socket.on('notification', (notification) => {
            setNotifications(prev => [notification, ...prev]);
            setUnreadCount(prev => prev + 1);
        });

        return () => {
            socket.disconnect();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const handleMarkAsRead = async (id) => {
        try {
            await notificationService.markAsRead(id);
            setNotifications(notifications.filter(n => n._id !== id));
            setUnreadCount(prev => Math.max(0, prev - 1));
        } catch (err) {
            console.error('Failed to mark as read:', err);
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
        if (minutes < 60) return `${minutes}m ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h ago`;
        const days = Math.floor(hours / 24);
        return `${days}d ago`;
    };

    return (
        <div className="relative">
            <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="relative p-2 text-gray-600 hover:text-gray-900 transition"
            >
                <FaBell className="text-xl" />
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                )}
            </button>

            {/* Dropdown */}
            {showDropdown && (
                <>
                    <div 
                        className="fixed inset-0 z-10" 
                        onClick={() => setShowDropdown(false)}
                    />
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg z-20 max-h-96 overflow-y-auto">
                        <div className="p-4 border-b border-gray-200">
                            <h3 className="font-semibold text-gray-900">Notifications</h3>
                        </div>

                        {notifications.length === 0 ? (
                            <div className="p-8 text-center text-gray-500">
                                <FaBell className="text-4xl mx-auto mb-2 text-gray-300" />
                                <p>No new notifications</p>
                            </div>
                        ) : (
                            <div>
                                {notifications.map((notification) => (
                                    <div
                                        key={notification._id}
                                        className="p-4 border-b border-gray-100 hover:bg-gray-50 transition cursor-pointer"
                                        onClick={() => {
                                            handleMarkAsRead(notification._id);
                                            if (notification.link) {
                                                window.location.href = notification.link;
                                            }
                                        }}
                                    >
                                        <div className="flex items-start gap-3">
                                            <span className="text-2xl flex-shrink-0">
                                                {getNotificationIcon(notification.type)}
                                            </span>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-medium text-gray-900 text-sm">
                                                    {notification.title}
                                                </p>
                                                <p className="text-sm text-gray-600 line-clamp-2">
                                                    {notification.message}
                                                </p>
                                                <p className="text-xs text-gray-400 mt-1">
                                                    {getTimeAgo(notification.createdAt)}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                <Link
                                    to="/notifications"
                                    className="block p-3 text-center text-indigo-600 hover:bg-gray-50 font-medium text-sm"
                                    onClick={() => setShowDropdown(false)}
                                >
                                    View All Notifications
                                </Link>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
};

export default NotificationBadge;
