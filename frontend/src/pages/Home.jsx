import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaShippingFast, FaLock, FaUndo, FaHeadset } from "react-icons/fa";
import { getProducts } from "../redux/slices/productsSlice";
import { addToCart } from "../redux/slices/cartSlice";
import ProductCard from "../components/product/ProductCard";
import Loading from "../components/common/Loading";
import Button from "../components/common/Button";
import { toast } from "react-toastify";


const Home = () => {
  const dispatch = useDispatch();
  const {
    items: products = [],
    loading: isLoading,
    

  } = useSelector((state) => state.products || {});
  const { user } = useSelector((state) => state.auth);

    useEffect(() => {
       dispatch(getProducts());
    },  [dispatch]);

  const handleAddToCart = (product) => {
    if (!user) {
      toast.error("Please login to add items to cart");
      return;
    }
    dispatch(addToCart({productId: product._id, quantity: 1}));
    toast.success("Product added to cart");
  };

  const features = [
    {
      icon: <FaShippingFast size={30} />,
      title: "Free Shipping",
      description: "On all orders over $50",
    },
    {
      icon: <FaLock size={30} />,
      title: "Secure Payment",
      description: "100% secure payment",
    },
    {
      icon: <FaUndo size={30} />,
      title: "Easy Returns",
      description: "30-day return policy",
    },
    {
      icon: <FaHeadset size={30} />,
      title: "24/7 Support",
      description: "We're here to help",
    },
  ];

  return (
    <div className="bg-gray-50">
        {/* Hero Section */}
    <section className="relative bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white overflow-hidden">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute transform rotate-45 -top-24 -right-24 w-96 h-96 bg-white rounded-full"></div>
          <div className="absolute transform -rotate-45 -bottom-24 -left-24 w-96 h-96 bg-white rounded-full"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 py-24 md:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold mb-6 leading-tight">
              Discover Amazing
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-orange-400">
                Products & Deals
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-10 max-w-2xl mx-auto">
              Your one-stop marketplace for quality products, great prices, and exceptional service
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link 
                to="/products"
                className="inline-flex items-center justify-center bg-white text-blue-700 px-8 py-4 rounded-xl font-bold text-lg shadow-2xl hover:shadow-xl hover:bg-blue-50 transform hover:scale-105 transition-all duration-200"
              >
                Shop Now
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Link>
              {user && user.role === 'buyer' ? (
                <Link 
                  to="/seller/apply"
                  className="inline-flex items-center justify-center bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-blue-700 transform hover:scale-105 transition-all duration-200"
                >
                  Become a Seller
                </Link>
              ) : !user && (
                <Link 
                  to="/register"
                  className="inline-flex items-center justify-center bg-transparent border-2 border-white text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-blue-700 transform hover:scale-105 transition-all duration-200"
                >
                  Sign Up Free
                </Link>
              )}
            </div>
          </div>
        </div>
    </section>

    {/* Features Section */}
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} 
              className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 text-center border border-gray-100">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>


    {/* Featured Products Section */} 
    <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
              Featured Products
            </h2>
            <p className="text-lg text-gray-600 mb-6">Discover our handpicked selection of top products</p>
            <Link to="/products">
              <Button variant="primary" size="large" className="shadow-lg hover:shadow-xl">
                View All Products
              </Button>
            </Link>
          </div>
        {isLoading ? (
            <div className="flex justify-center">
            <Loading  size="lg" />
            </div>
        ) :  products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            {products.map((product) => (
                <ProductCard
                key={product._id}
                product={product}
                onAddToCart={() => handleAddToCart(product)}
                />
            ))}
            </div>
        ) : (
            <div className ="text-center py-12">
                <p className="text-gray-600">No products available.</p>
            </div>
        )}
        </div>
    </section>

    {/* Categories Section */}
    <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">Shop by Category</h2>
              <p className="text-lg text-gray-600">Explore our wide range of product categories</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: "Electronics", icon: "📱", color: "from-blue-500 to-blue-600" },
              { name: "Fashion", icon: "👗", color: "from-pink-500 to-rose-600" },
              { name: "Home & Garden", icon: "🏡", color: "from-green-500 to-emerald-600" },
              { name: "Sports", icon: "⚽", color: "from-orange-500 to-red-600" }
            ].map((category) => (
                <Link
                key={category.name}
                to={`/products?category=${category.name.toLowerCase().replace(/ & /g, "-").replace(/ /g, "-")}`}
                className="group relative bg-white p-8 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 overflow-hidden"
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${category.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`}></div>
                  <div className="relative text-center">
                    <div className="text-5xl mb-4">{category.icon}</div>
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">{category.name}</h3>
                  </div>
                </Link>
            ))}
            </div>
        </div>
    </section>

    {/* CTA Section */}
    <section className="relative py-24 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full" style={{backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px'}}></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-6">Start Selling Today!</h2>
          <p className="text-xl md:text-2xl mb-10 max-w-2xl mx-auto text-blue-100">
            Join thousands of successful sellers and grow your business with our platform
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/register">
              <button className="inline-flex items-center bg-white text-blue-600 px-10 py-4 rounded-xl font-bold text-lg shadow-2xl hover:shadow-xl hover:bg-gray-100 transform hover:scale-105 transition-all duration-200">
                Become a Seller
                <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </Link>
            <Link to="/products">
              <button className="inline-flex items-center bg-transparent border-2 border-white text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-white hover:text-blue-600 transform hover:scale-105 transition-all duration-200">
                Browse Products
              </button>
            </Link>
          </div>
        </div>
    </section>
    </div>
  );
};
export default Home;
                    
    