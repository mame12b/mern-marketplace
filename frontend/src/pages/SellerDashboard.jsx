import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { FaBox, FaChartLine, FaDollarSign, FaStar, FaPlus, FaClipboardList } from 'react-icons/fa';
import BackButton from '../components/common/BackButton';
import Card from '../components/common/Card';

const SellerDashboard = () => {
    const { user } = useSelector((state) => state.auth);

    const stats = [
        {
            title: 'Total Products',
            value: '0',
            icon: <FaBox className="text-4xl text-blue-600" />,
            change: '+5%',
            color: 'bg-blue-50'
        },
        {
            title: 'Total Sales',
            value: '$0',
            icon: <FaDollarSign className="text-4xl text-green-600" />,
            change: '+12%',
            color: 'bg-green-50'
        },
        {
            title: 'Total Orders',
            value: '0',
            icon: <FaClipboardList className="text-4xl text-yellow-600" />,
            change: '+8%',
            color: 'bg-yellow-50'
        },
        {
            title: 'Average Rating',
            value: user?.sellerRating?.toFixed(1) || '0.0',
            icon: <FaStar className="text-4xl text-purple-600" />,
            change: 'N/A',
            color: 'bg-purple-50'
        },
    ];

    const quickActions = [
        { icon: FaPlus, title: 'Add Product', link: '/seller/products/new', color: 'text-blue-600' },
        { icon: FaBox, title: 'My Products', link: '/seller/products', color: 'text-green-600' },
        { icon: FaClipboardList, title: 'My Orders', link: '/seller/orders', color: 'text-yellow-600' },
        { icon: FaChartLine, title: 'Analytics', link: '/seller/analytics', color: 'text-purple-600' },
    ];

    return (
        <div className="container mx-auto px-4 py-8">
            <BackButton />
            
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Seller Dashboard</h1>
                <p className="text-gray-600 mt-2">Welcome back, {user?.firstName}! Manage your store.</p>
                {user?.shopName && (
                    <p className="text-lg font-semibold text-blue-600 mt-1">{user.shopName}</p>
                )}
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, index) => (
                    <Card key={index} className={`${stat.color}`}>
                        <div className="flex items-center justify-between mb-4">
                            <div>{stat.icon}</div>
                            <span className="text-sm font-semibold text-green-600">{stat.change}</span>
                        </div>
                        <p className="text-gray-600 text-sm font-medium">{stat.title}</p>
                        <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                    </Card>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {quickActions.map((action, index) => (
                        <Link key={index} to={action.link} className="block">
                            <Card className="hover:shadow-lg transition-shadow text-center py-6">
                                <action.icon className={`text-3xl ${action.color} mx-auto mb-3`} />
                                <h3 className="font-semibold text-gray-900">{action.title}</h3>
                            </Card>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Recent Orders</h2>
                    <Card>
                        <div className="text-center py-8 text-gray-500">
                            <p>No recent orders</p>
                            <Link to="/seller/products/new" className="text-blue-600 hover:underline mt-2 inline-block">
                                Add your first product
                            </Link>
                        </div>
                    </Card>
                </div>

                <div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Top Products</h2>
                    <Card>
                        <div className="text-center py-8 text-gray-500">
                            <p>No products yet</p>
                        </div>
                    </Card>
                </div>
            </div>
        </div>
    );
}; 

export default SellerDashboard;