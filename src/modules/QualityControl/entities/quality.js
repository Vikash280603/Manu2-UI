const QUALITY_KEY = "manutrack_quality_v1";

export const getQualityChecks = () =>
  JSON.parse(localStorage.getItem(QUALITY_KEY)) || [];

export const saveQualityChecks = (data) =>
  localStorage.setItem(QUALITY_KEY, JSON.stringify(data));

export const generateQcId = () =>
  `QC-${Date.now()}`;
