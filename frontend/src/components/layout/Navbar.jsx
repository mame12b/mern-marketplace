import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {useSelector, useDispatch} from "react-redux";
import {
    FaShoppingCart, 
    FaUser, 
    FaHeart, 
    FaSearch, 
    FaBars, 
    FaTimes,
    FaShippingFast
} from "react-icons/fa";


import { logout } from "../../redux/slices/authSlice";
import { toast } from "react-toastify"


export const Navbar = () => {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { user } = useSelector((state) => state.auth);
    const { itemCount = 0 } = useSelector((state) => state.cart || {});

    const handleLogout = () => {
        dispatch(logout());
        toast.success("Logged out successfully");
        navigate("/");
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/products?search=${searchQuery}`);
            setMobileMenuOpen(false);
        }
    };

    return (
        <nav className="bg-white shadow-lg border-b border-gray-100 sticky top-0 z-50">

            {/* Top Bar */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm">
                <div className="container mx-auto px-4 py-2 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <span className="flex items-center gap-2">
                            <FaShippingFast className="text-yellow-300" />
                            <span className="font-medium">Free Shipping on Orders Over $50!</span>
                        </span>
                    </div>
                    <div className="flex items-center gap-6">
                        <Link to="/help" className="hover:text-yellow-300 transition-colors font-medium">Help</Link>
                        <Link to="/track-order" className="hover:text-yellow-300 transition-colors font-medium">Track Order</Link>
                        {user && user.role === 'buyer' && (
                            <Link to="/seller/apply" className="hover:text-yellow-300 transition-colors font-medium">
                                🏪 Become a Seller
                            </Link>
                        )}
                    </div>
                </div>
            </div>

            {/* Main Navbar */}
            <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                {/* Logo */}
                <Link to="/" 
                       className="text-2xl md:text-3xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent hover:from-blue-700 hover:to-indigo-700 transition-all">
                    🛒 Marketplace
                </Link>

                {/* Search Bar */}
                <form 
                    onSubmit={handleSearchSubmit} 
                    className="flex-grow mx-8 hidden md:flex max-w-2xl">
                    <div className="relative w-full">
                        <input 
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search for products..."
                            className="w-full px-5 py-3 pr-12 border-2 border-gray-200 rounded-xl pl-12 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-gray-50 hover:bg-white"
                        />
                        <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
                        <button
                            type="submit"
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors font-medium">
                            Search
                        </button>
                    </div>
                </form>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-6">
                    <Link to="/products" className="font-semibold text-gray-700 hover:text-blue-600 transition-colors px-3 py-2 rounded-lg hover:bg-blue-50">
                        Products
                    </Link>

                    {user ? (
                        <>
                            <Link 
                                to="/wishlist" 
                                className="relative hover:text-red-600 transition-colors p-2 hover:bg-red-50 rounded-lg">
                                <FaHeart className="text-2xl"/>
                            </Link>

                            <Link 
                                to="/cart" 
                                className="relative hover:text-blue-600 transition-colors p-2 hover:bg-blue-50 rounded-lg">
                                <FaShoppingCart className="text-2xl"/>
                                {itemCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-pink-600 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center shadow-lg">
                                        {itemCount}
                                    </span>
                                )}
                            </Link>

                            <div className="relative group">
                                <button className="flex items-center gap-2 hover:text-blue-600 transition-colors px-4 py-2 rounded-lg hover:bg-blue-50 font-medium">
                                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                                        {user.firstName?.[0]?.toUpperCase()}
                                    </div>
                                    <span className="hidden lg:block">{user.firstName}</span>
                                </button>
                                <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-100 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                                    <div className="p-4 border-b border-gray-100">
                                        <p className="font-bold text-gray-900">{user.firstName} {user.lastName}</p>
                                        <p className="text-sm text-gray-500">{user.email}</p>
                                    </div>
                                    <Link 
                                        to="/profile" 
                                        className="block px-4 py-3 hover:bg-blue-50 hover:text-blue-600 transition-colors font-medium">
                                        Profile
                                    </Link>
                                    <Link 
                                        to="/orders" 
                                        className="block px-4 py-3 hover:bg-blue-50 hover:text-blue-600 transition-colors font-medium">
                                        Orders
                                    </Link>

                                    {user.role === 'buyer' && (
                                        <Link 
                                            to="/buyer/dashboard" 
                                            className="block px-4 py-3 hover:bg-blue-50 hover:text-blue-600 transition-colors font-medium">
                                            My Dashboard
                                        </Link>
                                    )}

                                    {user.role === 'seller' && (
                                        <Link 
                                            to="/seller/dashboard" 
                                            className="block px-4 py-3 hover:bg-green-50 hover:text-green-600 transition-colors font-medium">
                                            Seller Dashboard
                                        </Link>
                                    )}
                                    
                                    {user.role === 'admin' && (
                                        <Link 
                                            to="/admin/dashboard" 
                                            className="block px-4 py-3 hover:bg-purple-50 hover:text-purple-600 transition-colors font-medium">
                                            Admin Dashboard
                                        </Link>
                                    )}

                                    <div className="border-t border-gray-100"></div>
                                    <button 
                                        onClick={handleLogout} 
                                        className="block w-full text-left px-4 py-3 hover:bg-red-50 hover:text-red-600 transition-colors font-medium text-red-600">
                                        Logout
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <div className="flex items-center gap-3">
                            <Link to="/login">
                                <button className="px-6 py-2.5 font-semibold text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border-2 border-blue-600">
                                    Login
                                </button>
                            </Link>
                            <Link to="/register">
                                <button className="px-6 py-2.5 font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg">
                                    Sign Up
                                </button>
                            </Link>
                        </div>
                    )}
                </div>

                {/* Mobile menu button */}
                <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors">
                    {mobileMenuOpen ? <FaTimes className="text-2xl" /> : <FaBars className="text-2xl" />}
                </button>
            </div>

            {/* Mobile Search */}
            <div className="md:hidden px-4 pb-3">
                <form onSubmit={handleSearchSubmit} className="w-full">
                    <div className="relative">
                        <input 
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search products..."
                            className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-gray-50"/>
                        <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        <button
                            type="submit"
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white px-3 py-1 rounded-lg hover:bg-blue-700 text-sm">
                            Go
                        </button>
                    </div>
                </form>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="md:hidden px-4 pb-4 space-y-4">
                    <Link to="/products" className="block hover:text-primary-600 transition-colors">
                        Products
                    </Link>

                    {user ? (
                        <>
                            <Link 
                                to="/cart" 
                                className="block hover:text-primary-600 transition-colors"
                                onClick= {() => setMobileMenuOpen(false)}>
                                Cart {itemCount > 0 && `(${itemCount})`}
                            </Link>
                            <Link 
                                to="/wishlist" 
                                className="block hover:text-primary-600 transition-colors"
                                onClick= {() => setMobileMenuOpen(false)}>
                                Wishlist
                            </Link>
                            <Link 
                                to="/profile" 
                                className="block hover:text-primary-600 transition-colors"
                                onClick= {() => setMobileMenuOpen(false)}>
                                Profile
                            </Link>
                            <Link 
                                to="/orders" 
                                className="block hover:text-primary-600 transition-colors"
                                onClick= {() => setMobileMenuOpen(false)}>
                                Orders
                            </Link>

                            {user.role === 'buyer' && (
                                <Link 
                                    to="/buyer/dashboard" 
                                    className="block hover:text-primary-600 transition-colors"
                                    onClick= {() => setMobileMenuOpen(false)}>
                                    My Dashboard
                                </Link>
                            )}

                            {user.role === 'seller' && (
                                <Link 
                                    to="/seller/dashboard" 
                                    className="block hover:text-primary-600 transition-colors"
                                    onClick= {() => setMobileMenuOpen(false)}>
                                    Seller Dashboard
                                </Link>
                            )}

                            {user.role === 'admin' && (
                                <Link 
                                    to="/admin/dashboard" 
                                    className="block hover:text-primary-600 transition-colors"
                                    onClick= {() => setMobileMenuOpen(false)}>
                                    Admin Dashboard
                                </Link>
                            )}

                            <button 
                                onClick={() => {
                                    handleLogout();
                                    setMobileMenuOpen(false);
                                }} 
                                className="block w-full text-left hover:text-primary-600 transition-colors">
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link 
                                to="/login" 
                                className="block hover:text-primary-600 transition-colors"
                                onClick= {() => setMobileMenuOpen(false)}>
                                Login
                            </Link>
                            <Link 
                                to="/register" 
                                className="block hover:text-primary-600 transition-colors"
                                onClick= {() => setMobileMenuOpen(false)}>
                                Register
                            </Link>
                        </>
                    )}
                </div>
            )}
        </nav>
    );                            
};
export default Navbar;