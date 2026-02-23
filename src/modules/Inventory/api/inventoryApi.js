// src/api/inventoryApi.js
// All API calls for Inventory module
 
import api from '../../../auth/authApi';
 
// ==================== INVENTORY API CALLS ====================
 
// GET /api/inventory
export const getAllInventories = async () => {
  try {
    const response = await api.get('/inventory');
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to fetch inventories';
    throw new Error(message);
  }
};
 
// GET /api/inventory/5
export const getInventoryById = async (inventoryId) => {
  try {
    const response = await api.get(`/inventory/${inventoryId}`);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to fetch inventory';
    throw new Error(message);
  }
};
 
// GET /api/inventory/product/5
export const getInventoriesByProductId = async (productId) => {
  try {
    const response = await api.get(`/inventory/product/${productId}`);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to fetch inventories for product';
    throw new Error(message);
  }
};
 
// POST /api/inventory
// Body: { productId, location, materials? }
export const createInventory = async (inventoryData) => {
  try {
    const response = await api.post('/inventory', inventoryData);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to create inventory';
    throw new Error(message);
  }
};
 
// PUT /api/inventory/5
export const updateInventory = async (inventoryId, inventoryData) => {
  try {
    const response = await api.put(`/inventory/${inventoryId}`, inventoryData);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to update inventory';
    throw new Error(message);
  }
};
 
// DELETE /api/inventory/5
export const deleteInventory = async (inventoryId) => {
  try {
    const response = await api.delete(`/inventory/${inventoryId}`);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to delete inventory';
    throw new Error(message);
  }
};
 
// ==================== MATERIAL API CALLS ====================
 
// GET /api/inventory/5/materials
export const getMaterialsByInventoryId = async (inventoryId) => {
  try {
    const response = await api.get(`/inventory/${inventoryId}/materials`);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to fetch materials';
    throw new Error(message);
  }
};
 
// POST /api/inventory/5/materials
export const createMaterial = async (inventoryId, materialData) => {
  try {
    const response = await api.post(`/inventory/${inventoryId}/materials`, materialData);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to create material';
    throw new Error(message);
  }
};
 
// PUT /api/inventory/materials/10
export const updateMaterial = async (materialId, materialData) => {
  try {
    const response = await api.put(`/inventory/materials/${materialId}`, materialData);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to update material';
    throw new Error(message);
  }
};
 
// DELETE /api/inventory/materials/10
export const deleteMaterial = async (materialId) => {
  try {
    const response = await api.delete(`/inventory/materials/${materialId}`);
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to delete material';
    throw new Error(message);
  }
};
 
// ==================== SPECIAL API CALLS ====================
 
// GET /api/inventory/lowstock
export const getLowStockMaterials = async () => {
  try {
    const response = await api.get('/inventory/lowstock');
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to fetch low stock materials';
    throw new Error(message);
  }
};
 
// POST /api/inventory/materials/10/adjust
// Body: { delta: 1 } or { delta: -1 }
export const adjustMaterialQuantity = async (materialId, delta) => {
  try {
    const response = await api.post(`/inventory/materials/${materialId}/adjust`, { delta });
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to adjust quantity';
    throw new Error(message);
  }
};
 
// ==================== THRESHOLD UPDATE ====================
// Updates threshold using the generic update endpoint
export const updateMaterialThreshold = async (materialId, thresholdQty) => {
  try {
    const response = await api.put(`/inventory/materials/${materialId}`, { thresholdQty });
    return response.data;
  } catch (error) {
    const message = error.response?.data?.message || 'Failed to update threshold';
    throw new Error(message);
  }
};