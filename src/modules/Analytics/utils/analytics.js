


// src/utils/analytics.js
// Utility function to calculate metrics from quality checks

/**
 * Calculates aggregate quality metrics from quality check data
 * @param {Array} qualityList - Array of quality check objects
 * @returns {Object} Calculated metrics
 */
export const calculateMetrics = (qualityList) => {
  let totalAccepted = 0;
  let totalRejected = 0;

  // Aggregate totals from all quality checks
  qualityList.forEach(qc => {
    totalAccepted += qc.acceptedQty;
    totalRejected += qc.rejectedQty;
  });

  const totalInspected = totalAccepted + totalRejected;

  // Calculate rates (avoid division by zero)
  const successRate = totalInspected > 0
    ? parseFloat(((totalAccepted / totalInspected) * 100).toFixed(1))
    : 0;

  const failureRate = totalInspected > 0
    ? parseFloat(((totalRejected / totalInspected) * 100).toFixed(1))
    : 0;

  return {
    totalInspected,
    totalAccepted,
    totalRejected,
    successRate,    // Number: 95.5
    failureRate,    // Number: 4.5
    totalChecks: qualityList.length,
    passed: qualityList.filter(q => q.result === "PASS").length,
    failed: qualityList.filter(q => q.result === "FAIL").length
  };
};


