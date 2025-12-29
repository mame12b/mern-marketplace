import { useState } from 'react';
import { FaFilter, FaTimes } from 'react-icons/fa';

const ProductFilters = ({ onFilterChange, categories = [] }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [filters, setFilters] = useState({
        search: '',
        category: '',
        minPrice: '',
        maxPrice: '',
        minRating: '',
        brand: '',
        inStock: false,
        featured: false,
        sort: '-createdAt',
    });

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        const newFilters = {
            ...filters,
            [name]: type === 'checkbox' ? checked : value,
        };
        setFilters(newFilters);
        onFilterChange(newFilters);
    };

    const handleReset = () => {
        const resetFilters = {
            search: '',
            category: '',
            minPrice: '',
            maxPrice: '',
            minRating: '',
            brand: '',
            inStock: false,
            featured: false,
            sort: '-createdAt',
        };
        setFilters(resetFilters);
        onFilterChange(resetFilters);
    };

    return (
        <div className="bg-white rounded-lg shadow-md">
            {/* Mobile Filter Toggle */}
            <div className="lg:hidden p-4 border-b">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="flex items-center justify-between w-full text-gray-700 font-semibold"
                >
                    <span className="flex items-center gap-2">
                        <FaFilter />
                        Filters
                    </span>
                    {isOpen ? <FaTimes /> : <FaFilter />}
                </button>
            </div>

            {/* Filters */}
            <div className={`p-4 space-y-4 ${isOpen ? 'block' : 'hidden lg:block'}`}>
                {/* Search */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Search
                    </label>
                    <input
                        type="text"
                        name="search"
                        value={filters.search}
                        onChange={handleChange}
                        placeholder="Search products..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                {/* Category */}
                {categories.length > 0 && (
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Category
                        </label>
                        <select
                            name="category"
                            value={filters.category}
                            onChange={handleChange}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        >
                            <option value="">All Categories</option>
                            {categories.map((cat) => (
                                <option key={cat._id} value={cat._id}>
                                    {cat.name}
                                </option>
                            ))}
                        </select>
                    </div>
                )}

                {/* Price Range */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Price Range
                    </label>
                    <div className="flex gap-2">
                        <input
                            type="number"
                            name="minPrice"
                            value={filters.minPrice}
                            onChange={handleChange}
                            placeholder="Min"
                            min="0"
                            className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <input
                            type="number"
                            name="maxPrice"
                            value={filters.maxPrice}
                            onChange={handleChange}
                            placeholder="Max"
                            min="0"
                            className="w-1/2 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                </div>

                {/* Rating */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Minimum Rating
                    </label>
                    <select
                        name="minRating"
                        value={filters.minRating}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="">All Ratings</option>
                        <option value="4">4★ & above</option>
                        <option value="3">3★ & above</option>
                        <option value="2">2★ & above</option>
                        <option value="1">1★ & above</option>
                    </select>
                </div>

                {/* Brand */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Brand
                    </label>
                    <input
                        type="text"
                        name="brand"
                        value={filters.brand}
                        onChange={handleChange}
                        placeholder="Enter brand name"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                </div>

                {/* Checkboxes */}
                <div className="space-y-2">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            name="inStock"
                            checked={filters.inStock}
                            onChange={handleChange}
                            className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                        />
                        <span className="text-sm text-gray-700">In Stock Only</span>
                    </label>

                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            name="featured"
                            checked={filters.featured}
                            onChange={handleChange}
                            className="w-4 h-4 text-indigo-600 rounded focus:ring-indigo-500"
                        />
                        <span className="text-sm text-gray-700">Featured Products</span>
                    </label>
                </div>

                {/* Sort */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Sort By
                    </label>
                    <select
                        name="sort"
                        value={filters.sort}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                        <option value="-createdAt">Newest First</option>
                        <option value="createdAt">Oldest First</option>
                        <option value="price">Price: Low to High</option>
                        <option value="-price">Price: High to Low</option>
                        <option value="-rating">Highest Rated</option>
                        <option value="-views">Most Popular</option>
                        <option value="title">Name: A to Z</option>
                        <option value="-title">Name: Z to A</option>
                    </select>
                </div>

                {/* Reset Button */}
                <button
                    onClick={handleReset}
                    className="w-full bg-gray-200 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-300 transition font-medium"
                >
                    Reset Filters
                </button>
            </div>
        </div>
    );
};

export default ProductFilters;