import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {useSelector, useDispatch} from "react-redux";
import { FaShoppingCart, FaUser, FaHeart, FaSearch, FaBars, FaTimes } from "react-icons/fa";

import { logout } from "../../redux/slices/authSlice";
import { toast } from "react-toastify"


export const Navbar = () => {
    const [mobleMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { user } = useSelector((state) => state.auth);
    const { itemCount } = useSelector((state) => state.cart);

    const handleLogout = () => {
        dispatch(logout());
        toast.success("Logged out successfully");
        navigate("/");
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/products?search=${searchQuery}`);
        }
    };

    return (
        <nav className="bg-white shadow-md sticky top-0 z-50">
            {/* Top Bar */}
            <div className="bg-primary-600 text-white text-sm">
            <div className="container mx-auto px-4 py-3 flex items-center justify-between">

                <span>Free Shipping on Orders Over $50!</span>
                <div className="flex items-center gap-4">
                    <Link to="/help" className="hover:text-primary-300">Help</Link>
                    <Link to="/track-order" className="hover:text-primary-300">Track Order</Link>

                    </div>
                    </div>
                </div>
            {/* Main Navbar */}
            <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="text-2xl font-bold text-primary-600">
                    Marketplace
                </Link>

                {/* Search Bar */}
                <form onSubmit={handleSearchSubmit} className="flex-grow mx-4 hidden md:flex">
                    <div className="relative w-full">
                    <input 
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search products..."
                        className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg pl-10 focus:outline-none focus:ring-2 focus:ring-primary-600"/>

                        <button
                            type="submit"
                            className="absolute left-0 top-0 mt-2 ml-3 text-gray-500 hover:text-primary-600">
                            <FaSearch  className= 'text-xl'/>
                        </button>
                    </div>
                </form>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-6">
                    <Link to="/products" className="relative hover:text-primary-600 transition-colors">
                        Products
                    </Link>

                    {user ? (
                        <>
                            <Link 
                                  to="/wishlist" 
                                className="relative hover:text-primary-600 transition-colors">
                                    <FaHeart className="text-xl"/>
                                    </Link>

                            <Link 
                                to="/cart" 
                                className="relative hover:text-primary-600 transition-colors">
                                <FaShoppingCart className="text-xl"/>
                                {itemCount > 0 && (
                                    <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs rounded-full px-1">
                                        {itemCount}
                                    </span>
                                )}
                            </Link>

                            <div className="relative group">
                                <button className="flex items-center gap-2 hover:text-primary-600 transition-colors">
                                    <FaUser className="text-xl"/>
                                    <span>{user.firstName}</span>
                                </button>

                                {/* dropdown menu  */}
                                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity z-10">
                                    <Link 
                                        to="/profile" 
                                        className="block px-4 py-2 hover:bg-gray-100">
                                        Profile
                                    </Link>
                                    <Link 
                                        to="/orders" 
                                        className="block px-4 py-2 hover:bg-gray-100">
                                        Orders
                                    </Link>

                                    {user.role === 'seller' && (
                                        <Link 
                                            to="/seller/dashboard" 
                                            className="block px-4 py-2 hover:bg-gray-100">
                                            Seller Dashboard
                                        </Link>
                                    ) }
                                    {user.role === 'admin' && (
                                        <Link 
                                            to="/admin/dashboard" 
                                            className="block px-4 py-2 hover:bg-gray-100">
                                            Admin Dashboard
                                        </Link>
                                    ) }

                                    <button 
                                        onClick={handleLogout} 
                                        className="block w-full text-left px-4 py-2 hover:bg-gray-100">
                                        Logout
                                    </button>
                                </div>
                            </div>
                        </>
                    ) : (
                        <>
                            <Link 
                                to="/login" 
                                className="hover:text-primary-600 transition-colors">
                                Login
                            </Link>
                            <Link 
                                to="/register" 
                                className="hover:text-primary-600 transition-colors">
                                Register
                            </Link>
                        </>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <button 
                onClick={()=> setMobileMenuOpen(!mobleMenuOpen)  }
                className="md:hidden text-primary-600 focus:outline-none">
                    {mobleMenuOpen ? <FaTimes className="text-2xl"/> : <FaBars className="text-2xl"/>}
                </button>
            </div>

            {/* mobile search */}
            <form onSubmit={handleSearchSubmit} className= "px-4 pb-4 md:hidden ">
                <div className="relative w-f">
                    <input 
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search products..."
                        className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg pl-10 focus:outline-none focus:ring-2 focus:ring-primary-600"/>
                    <button
                        type="submit"
                        className="absolute left-0 top-0 mt-2 ml-3 text-gray-500 hover:text-primary-600">
                        <FaSearch className="text-xl"/>
                    </button>
                </div>
            </form>

            {/* Mobile Menu */}
            {mobleMenuOpen && (
                <div className="md:hidden px-4 pb-4 space-y-4">
                    <Link to="/products" className="block hover:text-primary-600 transition-colors">
                        Products
                    </Link>

                    {user ? (
                        <>
                            <Link 
                                to="/cart" 
                                className="block hover:text-primary-600 transition-colors">
                                    onClick= {() => setMobileMenuOpen(false)}

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

