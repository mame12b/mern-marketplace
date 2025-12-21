import { Link } from 'react-router-dom';
import { FaStar, FaHeart, FaRegHeart, FaShoppingCart  } from 'react-icons/fa';
import PropTypes from 'prop-types';
import Card from '../common/Card';
import Button from '../common/Button';


const ProductCard = ({ product, onToggleWishlist,isInWishlist, onAddToCart }) => {
    const { _id, title, price, comparePrice, images, rating, reviewCount, stock } = product;
    const  discount = comparePrice ? Math.round(((comparePrice - price) / comparePrice) * 100) : 0;
    const imageUrl = images?.[0]?.url ||  'https://via.placeholder.com/150';

    return (
        <Card padding ={false } className='group'>
            <div className='relative overflow-hidden'>
                <Link to ={`/product/${_id}`}>
                    <img
                        src={imageUrl}
                        alt={title}
                        className='w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300'
                    />
                </Link>
                {discount > 0 && (
                    <div className='absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded'>
                        {discount}% OFF
                    </div>
                )}
                {stock === 0 && (
                    <div className='absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white text-lg font-bold'>
                        <span className='bg-white text-gray-800 px-4 py-2 rounded-md font-semibold'>  
                        Out of Stock
                        </span>
                    </div>
                )}

                <button
                    onClick={() => onToggleWishlist?.(product)}
                    className='absolute top-2 right-2 p-2 bg-white rounded-full shadow hover:bg-gray-100 transition-colors '>

                    {isInWishlist ? (
                        <FaHeart className='text-red-500' />
                    ) : (
                        <FaRegHeart className='text-gray-500' />
                    )}
                </button>
            </div>
            <div className='p-4 flex flex-col justify-between flex-grow'>
                <Link to ={`/product/${_id}`}>
                    <h3 className='font-semibold text-lg mb-2 line-clamp-2 hover:text-primary-600 transition-colors'>

                        {title}
                    </h3>
                    </Link>

                    <div className='flex items-center mb-2'>
                        <div className='flex items-center text-yellow-400 mr-2'>
                            {[...Array(5)].map((_, index) => (
                            <FaStar 
                                key={index}
                                className= {`text-sm ${index < Math.floor(rating) ? 'text-yellow-400 ' : 'text-gray-300'

                                }`} 
                                />
                            ))}
                        </div>
                            <span className='text-gray-600 text-sm ml-1'>
                                ({reviewCount})
                                </span>
                        </div>
                    
                    <div className='flex items-baseline gap-2 mb-3'>
                        <span className='text-xl font-bold text-gray-900'>${price.toFixed(2)}</span>
                        {comparePrice > price && (
                            <span className='text-sm text-gray-500 line-through'>
                                ${comparePrice.toFixed(2)}
                                </span>
                        )} 
                    </div>

                    <Button
                        onClick = {() => onAddToCart?.(product)}
                        disabled={stock === 0}
                        fullWidth
                        variant='primary'
                        size='small'
                    >
                        <FaShoppingCart />
                        {stock === 0 ? ' Out of Stock' : ' Add to Cart'}
                    </Button>
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