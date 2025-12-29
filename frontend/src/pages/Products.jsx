import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { toast } from 'react-toastify';
import productService from "../services/productService";
import ProductCard from "../components/product/ProductCard";
import ProductFilters from "../components/product/ProductFilters";
import Loading from "../components/common/Loading";
import Button from "../components/common/Button";
import BackButton from "../components/common/BackButton";


const Products = () => { 
    const [searchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState([]);
    const [filters, setFilters] = useState({});

    const search = searchParams.get("search") || "";

    useEffect(() => { 
        fetchProducts();
        fetchCategories();
    }, [search, filters]);

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const params = {
                ...filters,
                search: search || filters.search,
            };
            const response = await productService.getProducts(params);
            setProducts(response.data);
        } catch (error) {
            toast.error('Failed to fetch products');
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await productService.getCategories();
            setCategories(response.data || []);
        } catch (error) {
            console.error('Failed to fetch categories');
        }
    };

    const handleFilterChange = (newFilters) => {
        setFilters(newFilters);
    };

    


return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <BackButton to="/" />
        
        {/* Page Header */}
        <div className="mb-8">
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

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <ProductFilters onFilterChange={handleFilterChange} categories={categories} />
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {/* Loading */}
            {loading && (
              <div className="flex flex-col items-center justify-center py-32">
                <Loading size="lg" />
                <p className="text-gray-600 mt-4 text-lg">Loading products...</p>
              </div>
            )}

            {/* Products Grid */}
            {!loading && products.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}

            {/* Empty State */}
            {!loading && products.length === 0 && (
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
      </div>
    </div>
  );
};

export default Products;
