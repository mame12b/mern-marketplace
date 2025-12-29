import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import analyticsService from '../services/analyticsService';
import Loading from '../components/common/Loading';
import BackButton from '../components/common/BackButton';
import { FaDollarSign, FaShoppingBag, FaUsers, FaStore } from 'react-icons/fa';

const AdminAnalytics = () => {
  const [analytics, setAnalytics] = useState(null);
  const [period, setPeriod] = useState('30');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalytics();
  }, [period]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const response = await analyticsService.getAdminAnalytics(period);
      setAnalytics(response.data);
    } catch {
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

  const {
    totalRevenue,
    totalOrders,
    totalProducts,
    totalUsers,
    revenueByPeriod,
    topSellers,
    topProducts,
    userStats,
  } = analytics;

  return (
    <div className="container mx-auto px-4 py-8">
      <BackButton />
      
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Admin Analytics</h1>
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
                ${totalRevenue?.toFixed(2) || '0.00'}
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
              <h3 className="text-2xl font-bold text-gray-900">{totalOrders || 0}</h3>
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
              <h3 className="text-2xl font-bold text-gray-900">{totalProducts || 0}</h3>
            </div>
            <div className="bg-purple-100 p-3 rounded-full">
              <FaStore className="text-2xl text-purple-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 mb-1">Total Users</p>
              <h3 className="text-2xl font-bold text-gray-900">{totalUsers || 0}</h3>
              <p className="text-xs text-gray-500 mt-1">
                {userStats?.sellers || 0} sellers • {userStats?.buyers || 0} buyers
              </p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-full">
              <FaUsers className="text-2xl text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Top Sellers */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Top Sellers</h2>
          <div className="space-y-3">
            {topSellers && topSellers.length > 0 ? (
              topSellers.map((seller, index) => (
                <div key={seller._id} className="flex items-center justify-between pb-3 border-b border-gray-100">
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-bold text-gray-400">#{index + 1}</span>
                    <div>
                      <p className="font-medium text-gray-900">{seller.shopName || seller.name}</p>
                      <p className="text-xs text-gray-500">{seller.totalSales} sales</p>
                    </div>
                  </div>
                  <p className="font-semibold text-gray-900">${seller.revenue?.toFixed(2)}</p>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No sales data yet</p>
            )}
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Top Products</h2>
          <div className="space-y-3">
            {topProducts && topProducts.length > 0 ? (
              topProducts.map((product, index) => (
                <div key={product._id} className="flex items-center gap-3 pb-3 border-b border-gray-100">
                  <span className="text-lg font-bold text-gray-400">#{index + 1}</span>
                  <div className="flex-1">
                    <p className="font-medium text-gray-900 text-sm line-clamp-1">{product.title}</p>
                    <p className="text-xs text-gray-500">
                      {product.totalSold} sold • ${product.revenue?.toFixed(2)} revenue
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-4">No sales data yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminAnalytics;
