// src/api/productApi.js  
// This file contains ALL API calls for Products and BOMs  
// Uses the axios instance from authApi.js (which already includes JWT token)  
  
import  api  from "../../../auth/authApi"
  
// -------------------- BASE URL --------------------  
// Using relative paths since we're importing from authApi  
// The base URL is already set to http://localhost:5134/api  
  
// ==================== PRODUCT API CALLS ====================  
  
// -------------------- GET ALL PRODUCTS --------------------  
// GET /api/products?searchTerm=hammer  
// Returns: Array of ProductDto  
export const getAllProducts = async (searchTerm = '') => {  
  try {  
    const params = searchTerm ? { searchTerm } : {};  
    const response = await api.get('/products', { params });  
    return response.data;  
  } catch (error) {  
    const message = error.response?.data?.message || 'Failed to fetch products';  
    throw new Error(message);  
  }  
};  
  
// -------------------- GET PRODUCT BY ID --------------------  
// GET /api/products/5  
// Returns: ProductDto (includes BOMs)  
export const getProductById = async (id) => {  
  try {  
    const response = await api.get(`/products/${id}`);  
    // console.log("Fetched product:", response.data);   // Debug log
    return response.data;  
  } catch (error) {  
    const message = error.response?.data?.message || 'Failed to fetch product';  
    throw new Error(message);  
  }  
};  
  
// -------------------- CREATE PRODUCT --------------------  
// POST /api/products  
// Body: { name, category, status }  
// Returns: ProductDto  
export const createProduct = async (productData) => {  
  try {  
    const response = await api.post('/products', productData);  
    return response.data;  
  } catch (error) {  
    const message = error.response?.data?.message || 'Failed to create product';  
    throw new Error(message);  
  }  
};  
  
// -------------------- UPDATE PRODUCT --------------------  
// PUT /api/products/5  
// Body: { name?, category?, status? }  
// Returns: ProductDto  
export const updateProduct = async (id, productData) => {  
  try {  
    const response = await api.put(`/products/${id}`, productData);  
    return response.data;  
  } catch (error) {  
    const message = error.response?.data?.message || 'Failed to update product';  
    throw new Error(message);  
  }  
};  
  
// -------------------- DELETE PRODUCT --------------------  
// DELETE /api/products/5  
// Returns: { message: "Product deleted successfully" }  
export const deleteProduct = async (id) => {  
  try {  
    const response = await api.delete(`/products/${id}`);  
    return response.data;  
  } catch (error) {  
    const message = error.response?.data?.message || 'Failed to delete product';  
    throw new Error(message);  
  }  
};  
  
// ==================== BOM API CALLS ====================  
  
// -------------------- GET BOMs FOR PRODUCT --------------------  
// GET /api/products/5/boms  
// Returns: Array of BOMDto  
export const getBOMsByProductId = async (productId) => {  
  try {  
    const response = await api.get(`/products/${productId}/boms`);  
    return response.data;  
  } catch (error) {  
    const message = error.response?.data?.message || 'Failed to fetch BOMs';  
    throw new Error(message);  
  }  
};  
  
// -------------------- CREATE BOM --------------------  
// POST /api/products/5/boms  
// Body: { materialName, quantity }  
// Returns: BOMDto  
export const createBOM = async (productId, bomData) => {  
  try {  
    const response = await api.post(`/products/${productId}/boms`, bomData);  
    return response.data;  
  } catch (error) {  
    const message = error.response?.data?.message || 'Failed to create BOM';  
    throw new Error(message);  
  }  
};  
  
// -------------------- UPDATE BOM --------------------  
// PUT /api/products/boms/10  
// Body: { materialName?, quantity? }  
// Returns: BOMDto  
export const updateBOM = async (bomId, bomData) => {  
  try {  
    const response = await api.put(`/products/boms/${bomId}`, bomData);  
    return response.data;  
  } catch (error) {  
    const message = error.response?.data?.message || 'Failed to update BOM';  
    throw new Error(message);  
  }  
};  
  
// -------------------- DELETE BOM --------------------  
// DELETE /api/products/boms/10  
// Returns: { message: "BOM deleted successfully" }  
export const deleteBOM = async (bomId) => {  
  try {  
    const response = await api.delete(`/products/boms/${bomId}`);  
    return response.data;  
  } catch (error) {  
    const message = error.response?.data?.message || 'Failed to delete BOM';  
    throw new Error(message);  
  }  
};  
  
// -------------------- REPLACE ALL BOMs --------------------  
// PUT /api/products/5/boms/replace  
// Body: [{ materialName, quantity }, { materialName, quantity }, ...]  
// Returns: Array of BOMDto  
export const replaceBOMs = async (productId, bomsArray) => {  
  try {  
    const response = await api.put(`/products/${productId}/boms/replace`, bomsArray);  
    return response.data;  
  } catch (error) {  
    const message = error.response?.data?.message || 'Failed to replace BOMs';  
    throw new Error(message);  
  }  
};