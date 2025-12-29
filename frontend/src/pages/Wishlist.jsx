import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaHeart, FaShoppingCart, FaTrash } from 'react-icons/fa';
import wishlistService from '../services/wishlistService';
import cartService from '../services/cartService';
import Loading from '../components/common/Loading';
import Rating from '../components/common/Rating';

const Wishlist = () => {
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchWishlist();
    }, []);

    const fetchWishlist = async () => {
        try {
            const response = await wishlistService.getWishlist();
            setWishlist(response.data);
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to fetch wishlist');
        } finally {
            setLoading(false);
        }
    };

    const handleRemove = async (productId) => {
        try {
            await wishlistService.removeFromWishlist(productId);
            setWishlist(wishlist.filter(item => item._id !== productId));
            toast.success('Removed from wishlist');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to remove from wishlist');
        }
    };

    const handleMoveToCart = async (productId) => {
        try {
            await cartService.addToCart(productId, 1);
            await wishlistService.removeFromWishlist(productId);
            setWishlist(wishlist.filter(item => item._id !== productId));
            toast.success('Moved to cart');
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to move to cart');
        }
    };

    if (loading) {
        return <Loading />;
    }

    if (wishlist.length === 0) {
        return (
            <div className="container mx-auto px-4 py-16">
                <div className="text-center">
                    <FaHeart className="text-6xl text-gray-300 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Your wishlist is empty</h2>
                    <p className="text-gray-600 mb-6">Save items you love for later!</p>
                    <Link 
                        to="/products" 
                        className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition"
                    >
                        Start Shopping
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-3xl font-bold text-gray-800">
                    My Wishlist ({wishlist.length})
                </h1>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {wishlist.map((product) => (
                    <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition relative">
                        <button
                            onClick={() => handleRemove(product._id)}
                            className="absolute top-2 right-2 z-10 bg-white rounded-full p-2 shadow-md hover:bg-red-50 transition"
                            title="Remove from wishlist"
                        >
                            <FaHeart className="text-red-500" />
                        </button>

                        <Link to={`/products/${product._id}`}>
                            <div className="relative h-48 bg-gray-200">
                                {product.images && product.images[0] ? (
                                    <img
                                        src={product.images[0]}
                                        alt={product.title}
                                        className="w-full h-full object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                                        No Image
                                    </div>
                                )}
                                {product.status === 'out-of-stock' && (
                                    <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                                        <span className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold">
                                            Out of Stock
                                        </span>
                                    </div>
                                )}
                            </div>
                        </Link>

                        <div className="p-4">
                            <Link to={`/products/${product._id}`}>
                                <h3 className="font-semibold text-gray-800 mb-1 hover:text-indigo-600 line-clamp-2">
                                    {product.title}
                                </h3>
                            </Link>

                            <div className="flex items-center gap-1 mb-2">
                                <Rating value={product.rating || 0} />
                                <span className="text-sm text-gray-500">
                                    ({product.reviewCount || 0})
                                </span>
                            </div>

                            <div className="flex items-center gap-2 mb-3">
                                <span className="text-xl font-bold text-gray-900">
                                    ${product.price}
                                </span>
                                {product.comparePrice && product.comparePrice > product.price && (
                                    <span className="text-sm text-gray-500 line-through">
                                        ${product.comparePrice}
                                    </span>
                                )}
                            </div>

                            {product.seller && (
                                <p className="text-sm text-gray-500 mb-3">
                                    by {product.seller.shopName || 'Seller'}
                                </p>
                            )}

                            <div className="flex gap-2">
                                {product.stock > 0 ? (
                                    <>
                                        <button
                                            onClick={() => handleMoveToCart(product._id)}
                                            className="flex-1 bg-indigo-600 text-white px-3 py-2 rounded-lg hover:bg-indigo-700 transition text-sm font-medium flex items-center justify-center gap-2"
                                        >
                                            <FaShoppingCart />
                                            Move to Cart
                                        </button>
                                        <button
                                            onClick={() => handleRemove(product._id)}
                                            className="bg-gray-200 text-gray-700 px-3 py-2 rounded-lg hover:bg-gray-300 transition"
                                        >
                                            <FaTrash />
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        disabled
                                        className="flex-1 bg-gray-300 text-gray-600 px-3 py-2 rounded-lg cursor-not-allowed text-sm font-medium"
                                    >
                                        Out of Stock
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Wishlist;
