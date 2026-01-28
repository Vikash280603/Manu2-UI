import { boms } from "../../entities/bom";
import { products } from "../../entities/product";

// Storage key for work orders
const WORKORDER_KEY = "manutrack_workorders_v2";

// Retrieve all work orders from browser storage
// Returns empty array if no work orders exist
export const getWorkOrders = () =>
  JSON.parse(localStorage.getItem(WORKORDER_KEY)) || [];

// Save work orders to browser storage
// Converts JavaScript array to text format for storage
export const saveWorkOrders = (orders) =>
  localStorage.setItem(WORKORDER_KEY, JSON.stringify(orders));

// Generate a unique ID for each new work order
// Uses crypto.randomUUID() to ensure no duplicates
export const generateWorkOrderId = () =>
  crypto.randomUUID();