const REPORT_KEY = "manutrack_reports_v1";

export const getReports = () =>
  JSON.parse(localStorage.getItem(REPORT_KEY)) || [];

export const saveReports = (reports) =>
  localStorage.setItem(REPORT_KEY, JSON.stringify(reports));

export const generateReportId = () =>
  "RPT-" + Date.now();
