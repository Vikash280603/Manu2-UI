// src/api/qualityCheckApi.js
// All API calls for Quality Control

import api from '../../../auth/authApi';

// ==================== QUALITY CHECK API CALLS ====================

// GET /api/qualitycheck
export const getAllQualityChecks = async () => {
try {
const response = await api.get('/qualitycheck');
return response.data;
} catch (error) {
const message = error.response?.data?.message || 'Failed to fetch quality checks';
throw new Error(message);
}
};

// GET /api/qualitycheck/{id}
export const getQualityCheckById = async (qcId) => {
try {
const response = await api.get(`/qualitycheck/${qcId}`);
return response.data;
} catch (error) {
const message = error.response?.data?.message || 'Failed to fetch quality check';
throw new Error(message);
}
};

// GET /api/qualitycheck/workorder/{workOrderId}
export const getQualityCheckByWorkOrderId = async (workOrderId) => {
try {
const response = await api.get(`/qualitycheck/workorder/${workOrderId}`);
return response.data;
} catch (error) {
const message = error.response?.data?.message || 'Failed to fetch quality check for work order';
throw new Error(message);
}
};

// GET /api/qualitycheck/result/{result}
export const getQualityChecksByResult = async (result) => {
try {
const response = await api.get(`/qualitycheck/result/${result}`);
return response.data;
} catch (error) {
const message = error.response?.data?.message || 'Failed to fetch quality checks by result';
throw new Error(message);
}
};

// POST /api/qualitycheck
// Body: { workOrderId, acceptedQty, remarks }
export const createQualityCheck = async (qualityCheckData) => {
try {
const response = await api.post('/qualitycheck', qualityCheckData);
return response.data;
} catch (error) {
const message = error.response?.data?.message || 'Failed to create quality check';
throw new Error(message);
}
};

// DELETE /api/qualitycheck/{id}
export const deleteQualityCheck = async (qcId) => {
try {
const response = await api.delete(`/qualitycheck/${qcId}`);
return response.data;
} catch (error) {
const message = error.response?.data?.message || 'Failed to delete quality check';
throw new Error(message);
}
};
