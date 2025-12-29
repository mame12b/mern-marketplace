import { useState } from 'react';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import wishlistService from '../../services/wishlistService';

const WishlistButton = ({ productId, isInWishlist: initialState = false, onToggle }) => {
    const [isInWishlist, setIsInWishlist] = useState(initialState);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleToggle = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        const token = localStorage.getItem('token');
        if (!token) {
            toast.info('Please login to add to wishlist');
            navigate('/login');
            return;
        }

        setLoading(true);
        try {
            await wishlistService.toggleWishlist(productId, isInWishlist);
            setIsInWishlist(!isInWishlist);
            toast.success(isInWishlist ? 'Removed from wishlist' : 'Added to wishlist');
            if (onToggle) {
                onToggle(!isInWishlist);
            }
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update wishlist');
        } finally {
            setLoading(false);
        }
    };

    return (
        <button
            onClick={handleToggle}
            disabled={loading}
            className={`p-2 rounded-full transition ${
                isInWishlist
                    ? 'bg-red-100 text-red-600 hover:bg-red-200'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            } ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            title={isInWishlist ? 'Remove from wishlist' : 'Add to wishlist'}
        >
            {isInWishlist ? (
                <FaHeart className="text-lg" />
            ) : (
                <FaRegHeart className="text-lg" />
            )}
        </button>
    );
};

export default WishlistButton;
