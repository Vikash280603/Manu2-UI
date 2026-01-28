// ============================================================
// FUNCTION: calculateMetrics
// FUNCTION SYNTAX: export const calculateMetrics = (qualityList) => { ... }
//
// PURPOSE: Calculate quality metrics from inspection data
// REASON: Convert raw quality check data into meaningful statistics
//
// PARAMETER:
//   - qualityList = array of quality check objects from localStorage
//     Each object contains:
//     {
//       qcId: "QC-123",
//       acceptedQty: 95,      ← Units that passed inspection
//       rejectedQty: 5,       ← Units that failed inspection
//       successRate: 95,
//       result: "PASS"
//     }
// ============================================================
export const calculateMetrics = (qualityList) => {
  // ============================================================
  // VARIABLE 1: totalAccepted
  // SYNTAX: let totalAccepted = 0;
  // LOGIC: Counter to sum all accepted units from all inspections
  // REASON: Need total units that passed across all quality checks
  // ============================================================
  let totalAccepted = 0;

  // ============================================================
  // VARIABLE 2: totalRejected
  // SYNTAX: let totalRejected = 0;
  // LOGIC: Counter to sum all rejected units from all inspections
  // REASON: Need total units that failed across all quality checks
  // ============================================================
  let totalRejected = 0;

  // ============================================================
  // LOOP: forEach through all quality checks
  // SYNTAX: qualityList.forEach(qc => { ... })
  //
  // LOGIC:
  //   - forEach = run code for each quality check in list
  //   - qc = current quality check object
  //   - += = add to running total (accumulate)
  //
  // WHAT HAPPENS:
  //   For each quality inspection:
  //   1. Add its accepted units to totalAccepted
  //   2. Add its rejected units to totalRejected
  //
  // EXAMPLE:
  //   qualityList = [
  //     { acceptedQty: 95, rejectedQty: 5 },
  //     { acceptedQty: 90, rejectedQty: 10 },
  //     { acceptedQty: 92, rejectedQty: 8 }
  //   ]
  //
  //   After loop:
  //   totalAccepted = 95 + 90 + 92 = 277
  //   totalRejected = 5 + 10 + 8 = 23
  //
  // REASON: Aggregate all inspection results into totals
  // ============================================================
  qualityList.forEach(qc => {
    // Add this inspection's accepted quantity to running total
    totalAccepted += qc.acceptedQty;

    // Add this inspection's rejected quantity to running total
    totalRejected += qc.rejectedQty;
  });

  // ============================================================
  // CALCULATED VALUE 1: totalInspected
  // SYNTAX: const totalInspected = totalAccepted + totalRejected;
  //
  // LOGIC:
  //   - All units inspected = accepted units + rejected units
  //   - Every unit was either accepted OR rejected
  //   - Nothing was left uninspected
  //
  // EXAMPLE:
  //   totalAccepted = 277
  //   totalRejected = 23
  //   totalInspected = 277 + 23 = 300 total units
  //
  // REASON: Know total number of units that went through inspection
  // ============================================================
  const totalInspected = totalAccepted + totalRejected;

  // ============================================================
  // CALCULATED VALUE 2: successRate
  // SYNTAX: const successRate = totalInspected
  //   ? ((totalAccepted / totalInspected) * 100).toFixed(1)
  //   : 0;
  //
  // LOGIC BREAKDOWN:
  //   - totalInspected ? ... : 0
  //     * Ternary operator: if/else in one line
  //     * If totalInspected is truthy (> 0): calculate percentage
  //     * If totalInspected is falsy (= 0): return 0 (avoid division by zero)
  //
  //   - (totalAccepted / totalInspected) * 100
  //     * Divide accepted by total = ratio (0 to 1)
  //     * Multiply by 100 = convert to percentage
  //     * Example: (277 / 300) * 100 = 92.333...
  //
  //   - .toFixed(1)
  //     * Round to 1 decimal place
  //     * Example: 92.333... becomes "92.3"
  //     * Returns string (not number)
  //
  // EXAMPLE CALCULATIONS:
  //   Scenario 1: All passed
  //     totalAccepted = 100, totalInspected = 100
  //     successRate = (100/100) * 100 = 100.0%
  //
  //   Scenario 2: Half passed
  //     totalAccepted = 150, totalInspected = 300
  //     successRate = (150/300) * 100 = 50.0%
  //
  //   Scenario 3: Most passed
  //     totalAccepted = 277, totalInspected = 300
  //     successRate = (277/300) * 100 = 92.3%
  //
  //   Scenario 4: No inspections done (edge case)
  //     totalInspected = 0
  //     successRate = 0 (prevent division by zero error)
  //
  // WHY TERNARY OPERATOR?
  //   - Prevents "division by zero" error
  //   - If no inspections, success rate should be 0 (or undefined)
  //   - Can't divide 0/0, must handle separately
  //
  // REASON: Calculate quality success percentage across all inspections
  // ============================================================
  const successRate = totalInspected
    ? ((totalAccepted / totalInspected) * 100).toFixed(1)
    : 0;

  // ============================================================
  // CALCULATED VALUE 3: failureRate
  // SYNTAX: const failureRate = totalInspected
  //   ? ((totalRejected / totalInspected) * 100).toFixed(1)
  //   : 0;
  //
  // LOGIC BREAKDOWN:
  //   - Same as successRate, but uses rejected units
  //   - (totalRejected / totalInspected) * 100
  //   - Example: (23 / 300) * 100 = 7.666...
  //   - .toFixed(1) = "7.7"
  //
  // INTERESTING FACT:
  //   successRate + failureRate should = 100 (approximately)
  //   Example: 92.3% + 7.7% = 100%
  //
  // EXAMPLE CALCULATIONS:
  //   Scenario 1: All passed
  //     totalRejected = 0, totalInspected = 100
  //     failureRate = (0/100) * 100 = 0.0%
  //
  //   Scenario 2: Half failed
  //     totalRejected = 150, totalInspected = 300
  //     failureRate = (150/300) * 100 = 50.0%
  //
  //   Scenario 3: Most passed (few failed)
  //     totalRejected = 23, totalInspected = 300
  //     failureRate = (23/300) * 100 = 7.7%
  //
  //   Scenario 4: No inspections done (edge case)
  //     totalInspected = 0
  //     failureRate = 0 (prevent division by zero error)
  //
  // REASON: Calculate quality failure percentage across all inspections
  // ============================================================
  const failureRate = totalInspected
    ? ((totalRejected / totalInspected) * 100).toFixed(1)
    : 0;

  // ============================================================
  // RETURN: Object with all calculated metrics
  // SYNTAX: return { totalInspected, totalAccepted, ... };
  //
  // WHAT IS RETURNED:
  //   {
  //     totalInspected: 300,      ← Total units inspected
  //     totalAccepted: 277,       ← Units that passed
  //     totalRejected: 23,        ← Units that failed
  //     successRate: "92.3",      ← Percentage that passed (string)
  //     failureRate: "7.7"        ← Percentage that failed (string)
  //   }
  //
  // EXAMPLE COMPLETE EXECUTION:
  //
  //   INPUT:
  //   qualityList = [
  //     { acceptedQty: 95, rejectedQty: 5 },   ← QC Check 1
  //     { acceptedQty: 90, rejectedQty: 10 },  ← QC Check 2
  //     { acceptedQty: 92, rejectedQty: 8 }    ← QC Check 3
  //   ]
  //
  //   EXECUTION:
  //   1. totalAccepted = 0
  //   2. totalRejected = 0
  //   3. Loop through qualityList:
  //      - Check 1: totalAccepted = 95, totalRejected = 5
  //      - Check 2: totalAccepted = 185, totalRejected = 15
  //      - Check 3: totalAccepted = 277, totalRejected = 23
  //   4. totalInspected = 277 + 23 = 300
  //   5. successRate = (277/300)*100 = 92.333... → "92.3"
  //   6. failureRate = (23/300)*100 = 7.666... → "7.7"
  //   7. Return metrics object
  //
  //   OUTPUT:
  //   {
  //     totalInspected: 300,
  //     totalAccepted: 277,
  //     totalRejected: 23,
  //     successRate: "92.3",
  //     failureRate: "7.7"
  //   }
  //
  // WHERE IS THIS USED?
  //   - AnalyticsDashboard.jsx (displays metrics)
  //   - Report generation (stores metrics in report)
  //   - Quality statistics
  //
  // REASON: Return all calculated metrics for dashboard and reporting
  // ============================================================
  return {
    totalInspected,    // Total units inspected
    totalAccepted,     // Units that passed inspection
    totalRejected,     // Units that failed inspection
    successRate,       // Percentage passed (string with 1 decimal)
    failureRate        // Percentage failed (string with 1 decimal)
  };
};

// ============================================================
// EDGE CASES HANDLED:
// ============================================================
//
// EDGE CASE 1: Empty quality list
//   Input: qualityList = []
//   
//   totalAccepted = 0
//   totalRejected = 0
//   totalInspected = 0
//   
//   successRate = 0 (ternary operator prevents division by zero)
//   failureRate = 0 (ternary operator prevents division by zero)
//   
//   Output: { totalInspected: 0, totalAccepted: 0, totalRejected: 0, successRate: 0, failureRate: 0 }
//
// EDGE CASE 2: All units accepted
//   Input: qualityList = [
//     { acceptedQty: 100, rejectedQty: 0 }
//   ]
//   
//   totalAccepted = 100
//   totalRejected = 0
//   totalInspected = 100
//   
//   successRate = (100/100)*100 = 100.0%
//   failureRate = (0/100)*100 = 0.0%
//   
//   Output: { totalInspected: 100, totalAccepted: 100, totalRejected: 0, successRate: "100.0", failureRate: "0.0" }
//
// EDGE CASE 3: All units rejected
//   Input: qualityList = [
//     { acceptedQty: 0, rejectedQty: 100 }
//   ]
//   
//   totalAccepted = 0
//   totalRejected = 100
//   totalInspected = 100
//   
//   successRate = (0/100)*100 = 0.0%
//   failureRate = (100/100)*100 = 100.0%
//   
//   Output: { totalInspected: 100, totalAccepted: 0, totalRejected: 100, successRate: "0.0", failureRate: "100.0" }
//
// ============================================================

// ============================================================
// MATHEMATICAL PROPERTIES:
// ============================================================
//
// Property 1: Sum of rates equals 100
//   successRate + failureRate ≈ 100
//   Example: 92.3 + 7.7 = 100.0
//
// Property 2: Inverse relationship
//   As successRate increases, failureRate decreases
//   As successRate decreases, failureRate increases
//
// Property 3: Neutral point
//   When successRate = 50, failureRate = 50 (worst case)
//   When successRate = 100, failureRate = 0 (best case)
//   When successRate = 0, failureRate = 100 (unacceptable)
//
// ============================================================

// ============================================================
// DATA TYPE NOTES:
// ============================================================
//
// Return types:
//   totalInspected: number (integer)
//     Example: 300
//
//   totalAccepted: number (integer)
//     Example: 277
//
//   totalRejected: number (integer)
//     Example: 23
//
//   successRate: string OR number (0 if no inspections)
//     When inspections exist: "92.3" (string with 1 decimal)
//     When no inspections: 0 (number)
//     Note: This inconsistency could be improved
//     Better: always return string "0.0" or always return number
//
//   failureRate: string OR number (0 if no inspections)
//     When inspections exist: "7.7" (string with 1 decimal)
//     When no inspections: 0 (number)
//     Same inconsistency as successRate
//
// Why strings? 
//   .toFixed(1) returns string, not number
//   "92.3" is string
//   If you need number: parseFloat(successRate)
//
// ============================================================

// ============================================================
// USAGE EXAMPLES IN COMPONENTS:
// ============================================================
//
// Example 1: AnalyticsDashboard.jsx
//   const qualityData = JSON.parse(localStorage.getItem(QUALITY_KEY)) || [];
//   const metrics = calculateMetrics(qualityData);
//   
//   // Now use metrics:
//   console.log(metrics.successRate);  // "92.3"
//   console.log(metrics.failureRate);  // "7.7"
//   
//   // Display on dashboard:
//   <Typography>{metrics.successRate}%</Typography>
//
// Example 2: Report generation
//   const newReport = {
//     reportId: generateReportId(),
//     metrics: calculateMetrics(qualityList),  // Pass metrics directly
//     generatedDate: new Date().toISOString()
//   };
//
// Example 3: Statistics calculation
//   const allReports = getReports();
//   const avgSuccess = allReports.reduce((sum, r) => 
//     sum + parseFloat(r.metrics.successRate), 0
//   ) / allReports.length;
//   // Need parseFloat() because successRate is string
//
// ============================================================