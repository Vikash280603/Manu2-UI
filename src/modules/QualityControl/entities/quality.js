/**
 * CONSTANTS
 * QUALITY_KEY: LocalStorage key for quality check data. 
 * Versioning (v1) allows for future schema migrations.
 */
const QUALITY_KEY = "manutrack_quality_v1";

/**
 * Retrieves all quality checks from localStorage.
 * Returns an empty array if no data exists.
 */
export const getQualityChecks = () =>
  JSON.parse(localStorage.getItem(QUALITY_KEY)) || [];

/**
 * Persists the quality checks array to localStorage.
 * Converts JS objects to JSON string format.
 */
export const saveQualityChecks = (data) =>
  localStorage.setItem(QUALITY_KEY, JSON.stringify(data));

/**
 * Generates a unique ID based on the current timestamp.
 * Format: QC-1704067245123
 * Benefit: Naturally sortable by creation time.
 */
export const generateQcId = () => `QC-${Date.now()}`;

/**
 * DATA STRUCTURE REFERENCE:
 * {
 * qcId: string,           // Unique ID (QC-timestamp)
 * workOrderId: string,    // Foreign key to Work Order
 * productId: number,      // Foreign key to Product
 * inspectionDate: string, // ISO Date
 * status: "PASS" | "FAIL",
 * notes: string
 * }
 */