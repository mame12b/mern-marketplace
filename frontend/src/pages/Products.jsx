import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { getProducts } from "../redux/slices/productsSlice";
import ProductCard from "../components/product/ProductCard";
import Loading from "../components/common/Loading";
import Button from "../components/common/Button";


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
    <div className="container mx-auto px-4 py-8 min-h-[70vh]">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Products</h1>
        {search && (
          <p className="text-gray-600 mt-1">
            Showing results for <span className="font-medium">"{search}"</span>
          </p>
        )}
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex justify-center py-20">
          <Loading size="lg" />
        </div>
      )}

      {/* Error */}
      {error && (
        <div className="text-center py-20">
          <p className="text-red-600 mb-4">{error}</p>
          <Button onClick={() => dispatch(getProducts({ search }))}>
            Retry
          </Button>
        </div>
      )}

      {/* Products Grid */}
      {!loading && !error && products.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && products.length === 0 && (
        <div className="text-center py-20">
          <p className="text-gray-600 text-lg mb-4">
            No products found
          </p>
          <Button to="/">Back to Home</Button>
        </div>
      )}
    </div>
  );
};

export default Products;
