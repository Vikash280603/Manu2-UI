export const calculateMetrics = (qualityList) => {
  let totalAccepted = 0;
  let totalRejected = 0;

  qualityList.forEach(qc => {
    totalAccepted += qc.acceptedQty;
    totalRejected += qc.rejectedQty;
  });

  const totalInspected = totalAccepted + totalRejected;

  const successRate = totalInspected
    ? ((totalAccepted / totalInspected) * 100).toFixed(1)
    : 0;

  const failureRate = totalInspected
    ? ((totalRejected / totalInspected) * 100).toFixed(1)
    : 0;

  return {
    totalInspected,
    totalAccepted,
    totalRejected,
    successRate,
    failureRate
  };
};
