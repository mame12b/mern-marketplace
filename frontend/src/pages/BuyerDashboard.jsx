import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FaShoppingBag, FaHeart, FaUser, FaShoppingCart } from 'react-icons/fa';
import BackButton from '../components/common/BackButton';
import Card from '../components/common/Card';

const BuyerDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const { items: cartItems = [] } = useSelector((state) => state.cart || {});

  const stats = [
    {
      title: 'Total Orders',
      value: '0',
      icon: <FaShoppingBag className="text-4xl text-blue-600" />,
      link: '/orders',
      color: 'bg-blue-50'
    },
    {
      title: 'Wishlist Items',
      value: user?.wishlist?.length || '0',
      icon: <FaHeart className="text-4xl text-red-600" />,
      link: '/wishlist',
      color: 'bg-red-50'
    },
    {
      title: 'Cart Items',
      value: cartItems.length,
      icon: <FaShoppingCart className="text-4xl text-green-600" />,
      link: '/cart',
      color: 'bg-green-50'
    },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <BackButton />
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Buyer Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back, {user?.firstName}!</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {stats.map((stat, index) => (
          <Link key={index} to={stat.link}>
            <Card className={`${stat.color} hover:shadow-lg transition-shadow cursor-pointer`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm font-medium">{stat.title}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                </div>
                <div>{stat.icon}</div>
              </div>
            </Card>
          </Link>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link to="/products" className="block">
            <Card className="hover:shadow-lg transition-shadow text-center py-6">
              <FaShoppingBag className="text-3xl text-blue-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900">Browse Products</h3>
              <p className="text-sm text-gray-600 mt-1">Explore marketplace</p>
            </Card>
          </Link>

          <Link to="/orders" className="block">
            <Card className="hover:shadow-lg transition-shadow text-center py-6">
              <FaShoppingBag className="text-3xl text-green-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900">My Orders</h3>
              <p className="text-sm text-gray-600 mt-1">Track your orders</p>
            </Card>
          </Link>

          <Link to="/wishlist" className="block">
            <Card className="hover:shadow-lg transition-shadow text-center py-6">
              <FaHeart className="text-3xl text-red-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900">Wishlist</h3>
              <p className="text-sm text-gray-600 mt-1">Saved items</p>
            </Card>
          </Link>

          <Link to="/profile" className="block">
            <Card className="hover:shadow-lg transition-shadow text-center py-6">
              <FaUser className="text-3xl text-purple-600 mx-auto mb-3" />
              <h3 className="font-semibold text-gray-900">Profile</h3>
              <p className="text-sm text-gray-600 mt-1">Manage account</p>
            </Card>
          </Link>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Recent Orders</h2>
        <Card>
          <div className="text-center py-8 text-gray-500">
            <p>No orders yet</p>
            <Link to="/products" className="text-blue-600 hover:underline mt-2 inline-block">
              Start shopping
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default BuyerDashboard;
