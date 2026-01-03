const WORKORDER_KEY = "manutrack_workorders_v2";

export const getWorkOrders = () =>
  JSON.parse(localStorage.getItem(WORKORDER_KEY)) || [];

export const saveWorkOrders = (orders) =>
  localStorage.setItem(WORKORDER_KEY, JSON.stringify(orders));

export const generateWorkOrderId = () =>
  crypto.randomUUID(); // ✅ GUARANTEED UNIQUE
