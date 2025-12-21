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
    <div>
        {/* Hero Section */}
    <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">

        {/* <div className="container mx-auto px-4 text-center"> */}
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold">
          Welcome to <span className="text-yellow-300">ShopEase</span>
            </h1>

            <p className="mt-4 text-lg text-blue-100 max-w-xl mx-auto">Your one-stop shop for all your needs</p>

            <div className="mt-8">
            <Link 
            to="/products"
            className="inline-block bg-white text-blue-700 px-8 py-3 round-xl font-semibold shadow-lg hover:bg-gray-100 transition"
            
            >
          
            Shop Now
            </Link>
        </div>
     </div>
    </section>

    {/* Features  */}
 {features.map((feature, index) => (
  <div key={index} 
  className="bg-gray-50 rounded-2xl p-8 shadow-sm hover:shadow-lg transition transform hover:-translate-y-1 text-center">
    <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-blue-600">
      {feature.icon}   
      
      {/* ✅ ONLY THIS */}
    </div>
    <h3 className="text-lg font-semibold text-gray-900">{feature.title}</h3>
    <p className="mt-2 text-sm text-gray-600">{feature.description}</p>
  </div>
))}


    {/* Featured Products Section */} 
    <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 items-center mb-12">

            <h2 className="text-3xl font-bold">Featured Products</h2>
            <Link to="/products">
            <Button variant="primary">View All Products</Button>
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

    {/* categories Section */}
    <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
            <h2 className="text-center text-3xl font-bold mb-8">Categories</h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Categories content goes here */}
            {["Electronics", "Fashion", "Home & Garden", "Sports"].map((category) => (
                <Link
                key={category}
                to={`/products?category=${category.toLowerCase().replace(/ & /g, "-").replace(/ /g, "-")}`}
                className="bg-white p-6 rounded-lg shadow text-center hover:shadow-lg transition"
                >
                <h3 className="text-xl font-semibold">{category}</h3>
                </Link>
            ))}
            </div>
        </div>
    </section>

    {/* CTA Section */}
    <section className="py-16 bg-primary-600 text-white">
        <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to start shopping?</h2>
        <p className="text-lg mb-8">Explore our wide range of products and enjoy exclusive deals.</p>
        <Link to="/register">
            <Button variant="secondary" size="lg">Become a Seller</Button>
        </Link>
        </div>
    </section>
    </div>
  );
};
export default Home;
                    
    