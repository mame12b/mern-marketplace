import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import analyticsService from '../services/analyticsService';
import Loading from '../components/common/Loading';
import { FaDollarSign, FaShoppingBag, FaBox, FaChartLine } from 'react-icons/fa';

const SellerAnalytics = () => {
    const [analytics, setAnalytics] = useState(null);
    const [period, setPeriod] = useState('30');
    const [loading, setLoading] = useState(true);
    

    useEffect(() => {
        fetchAnalytics();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [period]);

    const fetchAnalytics = async () => {
        try {
            const response = await analyticsService.getSellerAnalytics(period);
            setAnalytics(response.data);
        } catch  {
            toast.error('Failed to fetch analytics');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return <Loading />;
    }

    if (!analytics) {
        return <div>No analytics data available</div>;
    }

    const { overview, topProducts, ordersByStatus, lowStockProducts } = analytics;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold text-gray-800">Analytics Dashboard</h1>
                <select
                    value={period}
                    onChange={(e) => setPeriod(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                    <option value="7">Last 7 days</option>
                    <option value="30">Last 30 days</option>
                    <option value="90">Last 90 days</option>
                    <option value="365">Last year</option>
                </select>
            </div>

            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 mb-1">Total Revenue</p>
                            <h3 className="text-2xl font-bold text-gray-900">
                                ${overview.totalRevenue.toFixed(2)}
                            </h3>
                        </div>
                        <div className="bg-green-100 p-3 rounded-full">
                            <FaDollarSign className="text-2xl text-green-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 mb-1">Total Orders</p>
                            <h3 className="text-2xl font-bold text-gray-900">{overview.totalOrders}</h3>
                        </div>
                        <div className="bg-blue-100 p-3 rounded-full">
                            <FaShoppingBag className="text-2xl text-blue-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 mb-1">Total Products</p>
                            <h3 className="text-2xl font-bold text-gray-900">{overview.totalProducts}</h3>
                            <p className="text-xs text-green-600">{overview.activeProducts} active</p>
                        </div>
                        <div className="bg-purple-100 p-3 rounded-full">
                            <FaBox className="text-2xl text-purple-600" />
                        </div>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-sm text-gray-500 mb-1">Low Stock Items</p>
                            <h3 className="text-2xl font-bold text-gray-900">{overview.lowStockCount}</h3>
                        </div>
                        <div className="bg-red-100 p-3 rounded-full">
                            <FaChartLine className="text-2xl text-red-600" />
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Top Products */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Top Selling Products</h2>
                    <div className="space-y-3">
                        {topProducts.length > 0 ? (
                            topProducts.map((product, index) => (
                                <div key={product._id} className="flex items-center gap-3 pb-3 border-b border-gray-100">
                                    <span className="text-lg font-bold text-gray-400">#{index + 1}</span>
                                    <img
                                        src={product.image || '/placeholder.jpg'}
                                        alt={product.title}
                                        className="w-12 h-12 object-cover rounded"
                                    />
                                    <div className="flex-1">
                                        <p className="font-medium text-gray-900 text-sm line-clamp-1">
                                            {product.title}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {product.totalSold} sold • ${product.revenue.toFixed(2)} revenue
                                        </p>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 text-center py-4">No sales data yet</p>
                        )}
                    </div>
                </div>

                {/* Order Status */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Orders by Status</h2>
                    <div className="space-y-3">
                        {ordersByStatus.length > 0 ? (
                            ordersByStatus.map((status) => (
                                <div key={status._id} className="flex items-center justify-between pb-3 border-b border-gray-100">
                                    <span className="text-gray-700 capitalize">{status._id}</span>
                                    <span className="font-semibold text-gray-900">{status.count}</span>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 text-center py-4">No orders yet</p>
                        )}
                    </div>
                </div>
            </div>

            {/* Low Stock Products */}
            {lowStockProducts.length > 0 && (
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-bold text-gray-800 mb-4">Low Stock Alert</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {lowStockProducts.map((product) => (
                            <div key={product._id} className="flex items-center gap-3 p-3 bg-red-50 rounded-lg border border-red-200">
                                <img
                                    src={product.image || '/placeholder.jpg'}
                                    alt={product.title}
                                    className="w-16 h-16 object-cover rounded"
                                />
                                <div className="flex-1">
                                    <p className="font-medium text-gray-900 text-sm line-clamp-1">
                                        {product.title}
                                    </p>
                                    <p className="text-sm text-red-600 font-semibold">
                                        Only {product.stock} left
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default SellerAnalytics;
