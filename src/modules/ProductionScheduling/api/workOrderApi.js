// src/api/workOrderApi.js
// All API calls for Work Orders

import api from '../../../auth/authApi';

// ==================== WORK ORDER API CALLS ====================

// GET /api/workorder
export const getAllWorkOrders = async () => {
try {
const response = await api.get('/workorder');
return response.data;
} catch (error) {
const message = error.response?.data?.message || 'Failed to fetch work orders';
throw new Error(message);
}
};

// GET /api/workorder/{id}
export const getWorkOrderById = async (workOrderId) => {
try {
const response = await api.get(`/workorder/${workOrderId}`);
return response.data;
} catch (error) {
const message = error.response?.data?.message || 'Failed to fetch work order';
throw new Error(message);
}
};

// GET /api/workorder/status/{status}
export const getWorkOrdersByStatus = async (status) => {
try {
const response = await api.get(`/workorder/status/${status}`);
return response.data;
} catch (error) {
const message = error.response?.data?.message || 'Failed to fetch work orders by status';
throw new Error(message);
}
};

// POST /api/workorder
export const createWorkOrder = async (workOrderData) => {
try {
const response = await api.post('/workorder', workOrderData);
return response.data;
} catch (error) {
const message = error.response?.data?.message || 'Failed to create work order';
throw new Error(message);
}
};

// POST /api/workorder/batch
// Body: { order: { productId, quantity, scheduledDate }, batches: 3 }
export const createBatchWorkOrders = async (orderData, batches) => {
try {
const response = await api.post('/workorder/batch', {
order: orderData,
batches: batches
});
return response.data;
} catch (error) {
const message = error.response?.data?.message || 'Failed to create batch work orders';
throw new Error(message);
}
};

// PUT /api/workorder/{id}
export const updateWorkOrder = async (workOrderId, workOrderData) => {
try {
const response = await api.put(`/workorder/${workOrderId}`, workOrderData);
return response.data;
} catch (error) {
const message = error.response?.data?.message || 'Failed to update work order';
throw new Error(message);
}
};

// DELETE /api/workorder/{id}
export const deleteWorkOrder = async (workOrderId) => {
try {
const response = await api.delete(`/workorder/${workOrderId}`);
return response.data;
} catch (error) {
const message = error.response?.data?.message || 'Failed to delete work order';
throw new Error(message);
}
};

// ==================== WORKFLOW API CALLS ====================

// POST /api/workorder/{id}/allocate
export const allocateMaterials = async (workOrderId) => {
try {
const response = await api.post(`/workorder/${workOrderId}/allocate`);
return response.data;
} catch (error) {
const message = error.response?.data?.message || 'Failed to allocate materials';
throw new Error(message);
}
};

// POST /api/workorder/{id}/complete
export const completeWorkOrder = async (workOrderId) => {
try {
const response = await api.post(`/workorder/${workOrderId}/complete`);
return response.data;
} catch (error) {
const message = error.response?.data?.message || 'Failed to complete work order';
throw new Error(message);
}
};

// POST /api/workorder/{id}/approve-quality
export const approveQuality = async (workOrderId) => {
try {
const response = await api.post(`/workorder/${workOrderId}/approve-quality`);
return response.data;
} catch (error) {
const message = error.response?.data?.message || 'Failed to approve quality';
throw new Error(message);
}
};
