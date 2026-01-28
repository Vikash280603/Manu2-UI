const REPORT_KEY = "manutrack_reports_v1";

/**
 * Retrieves all production reports from localStorage.
 * @returns {Array} Array of report objects or empty array if none found.
 */
export const getReports = () =>
  JSON.parse(localStorage.getItem(REPORT_KEY)) || [];

/**
 * Saves the provided array of reports to localStorage.
 * @param {Array} reports - The array of report objects to persist.
 */
export const saveReports = (reports) =>
  localStorage.setItem(REPORT_KEY, JSON.stringify(reports));

/**
 * Generates a unique report ID based on the current timestamp.
 * @returns {string} Example: "RPT-1704067245123"
 */
export const generateReportId = () => 
  "RPT-" + Date.now() + "-" + Math.random().toString(36).slice(2, 9);