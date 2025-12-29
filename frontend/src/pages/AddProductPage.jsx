import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import axios from '../utils/axios';
import productService from '../services/productService';

const AddProductPage = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    title: '',
    description: '',
    price: '',
    stock: '',
    category: '',
    image: [],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");


// Fetch categories on mount
    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await productService.getCategories();
                console.log('Full response:', response);
                console.log('Categories array:', response.data);
                setCategories(response.data || []);
            } catch (err) {
                console.error('Failed to load categories:', err);
                setError("Failed to load categories");
            }
        };
        
        fetchCategories();
    }, []);

  const handleChange = (e) => {
    const { name, value,  } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    setForm(prev => ({ ...prev, image: [...e.target.files] }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      // Send as JSON instead of FormData for now
      const productData = {
        title: form.title,
        description: form.description,
        price: Number(form.price),
        stock: Number(form.stock),
        category: form.category,
      };

      await productService.createProduct(productData);

      toast.success("Product added successfully!");
      setTimeout(() => navigate('/seller/dashboard'), 2000);
    } catch (error) {
      const errorMsg = error.response?.data?.message || "Failed to add product";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

    if(!user || !['admin', "seller"].includes(user.role)){
        return (
          <div className="min-h-screen flex items-center justify-center py-12 px-4">
            <p className='text-red-600 text-center text-lg'>You are not authorized to add products.</p>
          </div>
        );
    }

    return (  
        <div className="min-h-screen bg-gray-50 py-4 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Add New Product</h1>

              {error && <p className="text-red-500 mb-3 p-3 bg-red-50 rounded-lg border border-red-200 text-sm">{error}</p>}
              {success && <p className="text-green-600 mb-3 p-3 bg-green-50 rounded-lg border border-green-200 text-sm">{success}</p>}

              <form onSubmit={handleSubmit} className="space-y-4">

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product Title</label>
                  <input
                    type="text"
                    name="title"
                    placeholder="Enter product title"
                    value={form.title}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    name="description"
                    placeholder="Enter product description"
                    value={form.description}
                    onChange={handleChange}
                    required
                    rows="3"
                    className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none text-sm"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
                    <input
                      type="number"
                      name="price"
                      placeholder="0.00"
                      value={form.price}
                      onChange={handleChange}
                      required
                      min="0"
                      step="0.01"
                      className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
                    <input
                      type="number"
                      name="stock"
                      placeholder="0"
                      value={form.stock}
                      onChange={handleChange}
                      required
                      min="0"
                      className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                  >
                    <option value="">Select a category</option>
                    {categories.map(cat => (
                      <option key={cat._id} value={cat._id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Product Images</label>
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full border border-gray-300 px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm file:mr-3 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  <p className="text-xs text-gray-500 mt-1">You can select multiple images</p>
                </div>

                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed font-medium text-sm shadow-sm"
                  >
                    {loading ? "Saving..." : "Add Product"}
                  </button>
                  <button
                    type="button"
                    onClick={() => navigate(-1)}
                    className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition font-medium text-sm"
                  >
                    Cancel
                  </button>
                </div>

              </form>
            </div>
          </div>
        </div>
    );
};

export default AddProductPage;





