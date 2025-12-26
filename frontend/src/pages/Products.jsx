import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { getProducts } from "../redux/slices/productsSlice";
import ProductCard from "../components/product/ProductCard";
import Loading from "../components/common/Loading";
import Button from "../components/common/Button";
import BackButton from "../components/common/BackButton";


const Products = () => { 
    const dispatch = useDispatch();
    const [searchParams] = useSearchParams();

    const search = searchParams.get("search") || "";

    const {  items: products, loading, error  } = useSelector((state) => state.products 
);

    useEffect(() => { 
        dispatch(getProducts({ search })); 
    }, [dispatch, search]);

    


return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <BackButton to="/" />
        
        {/* Page Header */}
        <div className="mb-10">
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-3">
            {search ? 'Search Results' : 'All Products'}
          </h1>
          {search && (
            <p className="text-lg text-gray-600">
              Showing results for <span className="font-bold text-blue-600">"{search}"</span>
            </p>
          )}
          {!loading && products.length > 0 && (
            <p className="text-gray-600 mt-2">
              {products.length} {products.length === 1 ? 'product' : 'products'} found
            </p>
          )}
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex flex-col items-center justify-center py-32">
            <Loading size="lg" />
            <p className="text-gray-600 mt-4 text-lg">Loading amazing products...</p>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-xl p-12 text-center max-w-md mx-auto">
            <div className="text-6xl mb-4">⚠️</div>
            <h3 className="text-xl font-bold text-red-800 mb-2">Oops! Something went wrong</h3>
            <p className="text-red-600 mb-6">{error}</p>
            <Button 
              onClick={() => dispatch(getProducts({ search }))}
              variant="danger"
              className="shadow-lg"
            >
              Try Again
            </Button>
          </div>
        )}

        {/* Products Grid */}
        {!loading && !error && products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && products.length === 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-16 text-center max-w-2xl mx-auto">
            <div className="text-8xl mb-6">🔍</div>
            <h3 className="text-3xl font-bold text-gray-900 mb-4">No Products Found</h3>
            <p className="text-gray-600 text-lg mb-8">
              {search 
                ? `We couldn't find any products matching "${search}". Try a different search term.`
                : "No products available at the moment. Check back soon!"}
            </p>
            <div className="flex gap-4 justify-center">
              <Button to="/" variant="primary" className="shadow-lg">
                Back to Home
              </Button>
              {search && (
                <Button 
                  to="/products" 
                  variant="outline"
                  onClick={() => window.location.href = '/products'}
                >
                  View All Products
                </Button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
