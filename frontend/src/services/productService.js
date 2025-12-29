import axios from "../utils/axios";

const API_URL = "/api/products";

// Get all products with optional filters
export const getProducts = async (params = {}) => {
  const response = await axios.get(API_URL, { params });
  return response.data;
};

// Get single product
export const getProduct = async (id) => {
  const response = await axios.get(`${API_URL}/${id}`);
  return response.data;
};

// Get categories
export const getCategories = async () => {
  const response = await axios.get('/api/categories');
  return response.data;
};

// Create product (seller/admin)
export const createProduct = async (productData) => {
  const response = await axios.post(API_URL, productData);
  return response.data;
};

// Update product
export const updateProduct = async (id, productData) => {
  const response = await axios.put(`${API_URL}/${id}`, productData);
  return response.data;
};

// Delete product
export const deleteProduct = async (id) => {
  const response = await axios.delete(`${API_URL}/${id}`);
  return response.data;
};

export default {
  getProducts,
  getProduct,
  getCategories,
  createProduct,
  updateProduct,
  deleteProduct,
};
