import { Link } from 'react-router-dom';
import { FaStar, FaHeart, FaRegHeart, FaShoppingCart } from 'react-icons/fa';
import PropTypes from 'prop-types';
import Card from '../common/Card';
import Button from '../common/Button';

const ProductCard = ({ product, onToggleWishlist, isInWishlist, onAddToCart }) => {
    const { _id, title, price, comparePrice, images, rating, reviewCount, stock } = product;
    const discount = comparePrice ? Math.round(((comparePrice - price) / comparePrice) * 100) : 0;
    const imageUrl = images?.[0]?.url || 'https://via.placeholder.com/300x300?text=No+Image';

    return (
        <Card padding={false} className='group hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-100'>
            <div className='relative overflow-hidden rounded-t-lg'>
                <Link to={`/products/${_id}`}>
                    <div className='relative h-64 bg-gray-100'>
                        <img
                            src={imageUrl}
                            alt={title}
                            className='w-full h-full object-cover group-hover:scale-110 transition-transform duration-500'
                        />
                        <div className='absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
                    </div>
                </Link>
                {discount > 0 && (
                    <div className='absolute top-3 left-3 bg-gradient-to-r from-red-500 to-pink-600 text-white text-sm font-bold px-3 py-1.5 rounded-full shadow-lg'>
                        -{discount}%
                    </div>
                )}
                {stock === 0 && (
                    <div className='absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center backdrop-blur-sm'>
                        <span className='bg-white text-gray-800 px-6 py-3 rounded-lg font-bold text-lg shadow-xl'>
                            Out of Stock
                        </span>
                    </div>
                )}

                <button
                    onClick={() => onToggleWishlist?.(product)}
                    className='absolute top-3 right-3 p-3 bg-white rounded-full shadow-lg hover:shadow-xl hover:scale-110 transition-all duration-200 backdrop-blur-sm bg-opacity-90'
                >
                    {isInWishlist ? (
                        <FaHeart className='text-red-500 text-lg' />
                    ) : (
                        <FaRegHeart className='text-gray-600 text-lg' />
                    )}
                </button>
            </div>
            <div className='p-5 flex flex-col justify-between flex-grow bg-white'>
                <div>
                    <Link to={`/products/${_id}`}>
                        <h3 className='font-bold text-lg mb-3 line-clamp-2 hover:text-blue-600 transition-colors leading-tight text-gray-900'>
                            {title}
                        </h3>
                    </Link>

                    <div className='flex items-center mb-3'>
                        <div className='flex items-center mr-2'>
                            {[...Array(5)].map((_, index) => (
                                <FaStar
                                    key={index}
                                    className={`text-base ${index < Math.floor(rating) ? 'text-yellow-400' : 'text-gray-300'}`}
                                />
                            ))}
                        </div>
                        <span className='text-gray-500 text-sm font-medium'>
                            ({reviewCount || 0})
                        </span>
                    </div>
                </div>

                <div>
                    <div className='flex items-center gap-3 mb-4'>
                        <span className='text-2xl font-extrabold text-gray-900'>${price?.toFixed(2)}</span>
                        {comparePrice > price && (
                            <div className='flex flex-col'>
                                <span className='text-sm text-gray-400 line-through'>
                                    ${comparePrice?.toFixed(2)}
                                </span>
                            </div>
                        )}
                    </div>

                    <Button
                        onClick={() => onAddToCart?.(product)}
                        disabled={stock === 0}
                        fullWidth
                        variant='primary'
                        size='medium'
                        className='font-semibold shadow-md hover:shadow-lg'
                    >
                        <FaShoppingCart className='mr-2' />
                        {stock === 0 ? 'Out of Stock' : 'Add to Cart'}
                    </Button>
                </div>
            </div>
        </Card>
    );
};

ProductCard.propTypes = {
    product: PropTypes.shape({
        _id: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        price: PropTypes.number.isRequired,
        comparePrice: PropTypes.number,
        images: PropTypes.arrayOf(PropTypes.object),
        rating: PropTypes.number,
        reviewCount: PropTypes.number,
        stock: PropTypes.number.isRequired,
    }).isRequired,
    onToggleWishlist: PropTypes.func,
    isInWishlist: PropTypes.bool,
    onAddToCart: PropTypes.func,
};

export default ProductCard;