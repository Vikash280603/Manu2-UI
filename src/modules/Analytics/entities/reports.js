// ============================================================
// CONSTANT: Storage key for Production Reports
// SYNTAX: const REPORT_KEY = "manutrack_reports_v1";
//
// LOGIC:
//   - String that uniquely identifies where reports are stored in localStorage
//   - "v1" = version 1 (allows future upgrades to v2, v3, etc.)
//
// REASON:
//   - localStorage uses key-value pairs
//   - Same key is used to read/write report data consistently
//   - "manutrack_reports_v1" is specific and won't conflict with other keys
//   - Version number helps manage data format changes
//
// NAMING CONVENTION USED THROUGHOUT APP:
//   - "manutrack_workorders_v2"  (work orders)
//   - "manutrack_inventory_v2"   (inventory)
//   - "manutrack_quality_v1"     (quality checks)
//   - "manutrack_reports_v1"     (this one)
//
// WHY VERSION NUMBERS?
//   - If data format changes, can create v2 key
//   - Old data stays in v1, new data in v2
//   - Easy migration path without losing old data
//   - Example: "manutrack_reports_v2" for new format
// ============================================================
const REPORT_KEY = "manutrack_reports_v1";

// ============================================================
// FUNCTION 1: getReports
// FUNCTION SYNTAX: export const getReports = () => ...
//
// LOGIC BREAKDOWN:
//   - localStorage.getItem(REPORT_KEY) = fetch data from browser storage
//   - JSON.parse(...) = convert text/JSON to JavaScript objects
//   - || [] = if nothing found (returns undefined), use empty array
//
// HOW IT WORKS STEP BY STEP:
//   1. Look in browser's localStorage for key "manutrack_reports_v1"
//   2. If found:
//      - Get the text/JSON data stored there
//      - JSON.parse() converts it to JavaScript objects/arrays
//      - Return the array of report objects
//   3. If NOT found (getItem returns null/undefined):
//      - The || [] operator activates
//      - Return empty array [] instead
//
// RETURN VALUE:
//   - Array of report objects
//   - Empty array [] if no reports stored yet
//
// EXAMPLE OUTPUT:
//   [
//     {
//       reportId: "RPT-1704067200000",
//       generatedAt: "2024-01-01T10:30:00Z",
//       title: "Monthly Production Report",
//       totalOrders: 50,
//       completedOrders: 48,
//       passedQc: 45,
//       failedQc: 3,
//       content: {...}
//     },
//     {
//       reportId: "RPT-1704153600000",
//       generatedAt: "2024-01-02T14:15:00Z",
//       title: "Weekly Quality Summary",
//       totalOrders: 25,
//       completedOrders: 25,
//       passedQc: 23,
//       failedQc: 2,
//       content: {...}
//     }
//   ]
//   OR if first time:
//   []
//
// WHAT IS JSON.parse()?
//   - Takes text representation of data
//   - Input (text): '[{"id":"RPT-123","title":"Report"}]'
//   - Output (objects): [{id: "RPT-123", title: "Report"}]
//   - Converts JSON text format to usable JavaScript objects
//
// WHY PARSE IS NECESSARY:
//   - localStorage only stores text/strings
//   - Objects and arrays must be converted to JSON text
//   - JSON.parse() reverses that conversion
//   - Now we can use object properties normally
//
// REASON:
//   - Retrieve/read all production reports from storage
//   - Needed to display reports, filter, analyze, etc.
//   - Called whenever we need to view or work with report data
//   - Essential for report dashboard and listing pages
//
// USAGE EXAMPLES:
//   // Get all reports
//   const allReports = getReports();
//   console.log(allReports);
//   
//   // Count reports
//   const reportCount = getReports().length;
//   
//   // Find specific report by ID
//   const reports = getReports();
//   const report = reports.find(r => r.reportId === "RPT-123");
//   
//   // Filter reports by date
//   const recentReports = getReports().filter(r => 
//     new Date(r.generatedAt) > new Date("2024-01-01")
//   );
//   
//   // Get statistics from reports
//   const totalOrders = getReports().reduce((sum, r) => sum + r.totalOrders, 0);
// ============================================================
export const getReports = () =>
  JSON.parse(localStorage.getItem(REPORT_KEY)) || [];

// ============================================================
// FUNCTION 2: saveReports
// FUNCTION SYNTAX: export const saveReports = (reports) => ...
// PARAMETER:
//   - reports = array of report objects to save to storage
//
// LOGIC BREAKDOWN:
//   - JSON.stringify(reports) = convert JavaScript objects to text format
//   - localStorage.setItem(KEY, VALUE) = save text to browser storage
//   - KEY = "manutrack_reports_v1" (where to save)
//   - VALUE = text version of all reports
//
// HOW IT WORKS STEP BY STEP:
//   1. Take the reports array (JavaScript objects)
//   2. Convert to text/JSON format using JSON.stringify()
//   3. Save in browser localStorage under the key
//   4. Data persists even if browser is closed
//
// WHAT IS JSON.stringify()?
//   - Reverse operation of JSON.parse()
//   - Input (objects):
//     [{reportId: "RPT-123", title: "Report 1"}, 
//      {reportId: "RPT-456", title: "Report 2"}]
//   - Output (text):
//     '[{"reportId":"RPT-123","title":"Report 1"},
//       {"reportId":"RPT-456","title":"Report 2"}]'
//   - Converts JavaScript objects to text for storage
//
// WHY STRINGIFY IS NECESSARY:
//   - localStorage only accepts text/string values
//   - Cannot store objects directly
//   - JSON is standard format for this conversion
//   - Compact and efficient
//   - Human-readable (can view in developer tools)
//
// EXAMPLE INPUT:
//   [
//     {
//       reportId: "RPT-1704067200000",
//       title: "Monthly Report",
//       totalOrders: 50,
//       completedOrders: 48,
//       passedQc: 45,
//       failedQc: 3,
//       generatedAt: "2024-01-01T10:30:00Z"
//     },
//     {
//       reportId: "RPT-1704153600000",
//       title: "Weekly Report",
//       totalOrders: 25,
//       completedOrders: 25,
//       passedQc: 23,
//       failedQc: 2,
//       generatedAt: "2024-01-02T14:15:00Z"
//     }
//   ]
//
// BECOMES (stored as text):
//   '[{"reportId":"RPT-1704067200000","title":"Monthly Report",...},
//     {"reportId":"RPT-1704153600000","title":"Weekly Report",...}]'
//
// REASON:
//   - Save/persist production reports to browser storage
//   - Must convert objects to text first (JSON.stringify)
//   - Data survives page refresh and browser restart
//   - Called after creating, updating, or generating new reports
//
// USAGE EXAMPLES:
//   // Create a new report
//   const newReport = {
//     reportId: generateReportId(),
//     title: "Daily Production Report",
//     generatedAt: new Date().toISOString(),
//     totalOrders: 30,
//     completedOrders: 28,
//     passedQc: 27,
//     failedQc: 1
//   };
//
//   // Get existing reports
//   const currentReports = getReports();
//
//   // Add new report to list
//   currentReports.push(newReport);
//
//   // Save updated list back to storage
//   saveReports(currentReports);
//
//   ---
//
//   // Update an existing report
//   const reports = getReports();
//   const reportToUpdate = reports.find(r => r.reportId === "RPT-123");
//   if (reportToUpdate) {
//     reportToUpdate.title = "Updated Title";
//     saveReports(reports); // Save changes
//   }
//
//   ---
//
//   // Delete a report
//   const reports = getReports();
//   const filtered = reports.filter(r => r.reportId !== "RPT-123");
//   saveReports(filtered); // Save without deleted report
// ============================================================
export const saveReports = (reports) =>
  localStorage.setItem(REPORT_KEY, JSON.stringify(reports));

// ============================================================
// FUNCTION 3: generateReportId
// FUNCTION SYNTAX: export const generateReportId = () => ...
//
// LOGIC BREAKDOWN:
//   - Date.now() = gets current time in milliseconds since Jan 1, 1970
//   - Template string: "RPT-${Date.now()}" = creates string like "RPT-1704067200000"
//   - Each call gets different timestamp, so unique IDs
//
// WHAT IS Date.now()?
//   - Returns milliseconds since Unix epoch (1970-01-01 00:00:00 UTC)
//   - Example: 1704067200000 (represents specific moment in time)
//   - Increases by ~1000 every second
//   - Never repeats (each call gets larger number)
//   - Current time always advances forward
//
// HOW IT WORKS:
//   Call 1 (at 10:30:45 AM): Date.now() = 1704067245123
//     → Returns: "RPT-1704067245123"
//   Call 2 (at 10:30:46 AM): Date.now() = 1704067246456
//     → Returns: "RPT-1704067246456"
//   Call 3 (at 10:30:47 AM): Date.now() = 1704067247789
//     → Returns: "RPT-1704067247789"
//
// WHY GUARANTEED UNIQUE?
//   - Time only moves forward (never goes backward)
//   - Even if called twice in same millisecond (extremely rare)
//   - Computer clock moves fast enough for different values
//   - Much faster than UUID but still unique for reports
//   - In typical scenario, no conflicts possible
//
// RETURN VALUE:
//   - String in format: "RPT-{timestamp}"
//   - Example: "RPT-1704067245123"
//   - 13 digits for timestamp = very specific to exact moment
//
// ID FORMAT BREAKDOWN:
//   "RPT-1704067245123"
//    ^^^  13-digit timestamp
//    └─ Prefix "RPT" = Report identifier
//       Makes it clear this is a Report ID
//
// ADVANTAGES OF Date.now() FOR IDs:
//   ✅ Simple and fast (no complex algorithms)
//   ✅ Human-readable (can see when created)
//   ✅ Sortable (later reports have higher numbers)
//   ✅ No conflicts (time never goes backward)
//   ✅ Stateless (no counter to manage)
//   ✅ Timestamp embedded in ID (useful for filtering by date)
//
// DISADVANTAGES:
//   ❌ Not completely random (predictable pattern)
//   ❌ Could theoretically have conflicts if 2+ reports created in same millisecond
//   ❌ Time-dependent (relies on system clock)
//   ❌ Could be affected if computer time is changed
//
// COMPARISON: Date.now() vs crypto.randomUUID()
//
// Date.now() (used here for reports):
//   - Format: "RPT-1704067245123"
//   - Sortable: YES (can sort by ID)
//   - Predictable: YES (can guess next ID)
//   - Performance: FAST
//   - Use case: Reports, timestamps, audit logs
//
// crypto.randomUUID() (used for work orders):
//   - Format: "uuid-a1b2c3d4-e5f6-4789-a123-456789abcdef"
//   - Sortable: NO (random order)
//   - Predictable: NO (truly random)
//   - Performance: SLOWER
//   - Size: 36 characters
//   - Use case: Work orders, high security
//
// WHEN TO USE Date.now():
//   ✅ For timestamped records (reports, logs, audits)
//   ✅ When speed matters
//   ✅ When you want sortable IDs
//   ✅ Single-user or trusted environment
//
// WHEN NOT TO USE:
//   ❌ Security-sensitive data (too predictable)
//   ❌ Distributed systems (multiple computers)
//   ❌ Offline-first apps (system time can be changed)
//
// REASON:
//   - Each report needs unique ID for identification
//   - Date-based IDs work well for timestamped records
//   - Simpler than crypto.randomUUID()
//   - Still guaranteed unique in manufacturing scenario
//   - Allows easy sorting by creation time
//
// USAGE EXAMPLES:
//   const reportId1 = generateReportId();
//   // Returns: "RPT-1704067245123"
//
//   const reportId2 = generateReportId();
//   // Returns: "RPT-1704067246456"
//
//   const newReport = {
//     reportId: generateReportId(),  // "RPT-1704067247789"
//     title: "Daily Production Summary",
//     generatedAt: new Date().toISOString(),
//     totalWorkOrders: 50,
//     completedOrders: 48,
//     qualityPassRate: 96.5,
//     failedOrders: 2
//   };
//
//   // Extract timestamp from report ID if needed:
//   const reportId = "RPT-1704067247789";
//   const timestamp = parseInt(reportId.split("-")[1]); // 1704067247789
//   const dateCreated = new Date(timestamp); // Convert back to date
//   console.log(dateCreated); // "2024-01-01T10:30:47.789Z"
// ============================================================
export const generateReportId = () =>
  "RPT-" + Date.now();

// ============================================================
// HOW THESE 3 FUNCTIONS WORK TOGETHER:
// ============================================================
//
// SCENARIO: Generate and save a production report
//
// STEP 1: Generate unique report ID
//   const reportId = generateReportId();
//   // Result: "RPT-1704067245123"
//
// STEP 2: Create report object with data
//   const newReport = {
//     reportId: reportId,
//     generatedAt: new Date().toISOString(),
//     title: "Daily Production Report",
//     totalWorkOrders: 50,
//     completedOrders: 48,
//     passedQc: 46,
//     failedQc: 2,
//     summary: "Excellent production day"
//   };
//
// STEP 3: Get existing reports from storage
//   const existingReports = getReports();
//   // Returns: [] (if first time) or [...previous reports]
//
// STEP 4: Add new report to list
//   existingReports.push(newReport);
//   // Now list has: [old report, old report, ..., new report]
//
// STEP 5: Save updated list back to storage
//   saveReports(existingReports);
//   // Data is now persisted in localStorage
//
// COMPLETE FLOW DIAGRAM:
//   generateReportId() ─→ Create unique ID
//                          │
//                          ↓
//   Create report object with that ID
//                          │
//                          ↓
//   getReports() ─→ Get all existing reports from storage
//                          │
//                          ├→ Add new report to list
//                          │
//                          ↓
//   saveReports() ─→ Save updated list back to storage
//                          │
//                          ↓
//   Done! Report is now permanently saved
//
// ============================================================

// ============================================================
// REPORT DATA STRUCTURE:
// ============================================================
//
// A typical production report object looks like:
// {
//   reportId: "RPT-1704067245123",              // Unique ID generated by generateReportId()
//   generatedAt: "2024-01-01T10:30:45.123Z",    // When report was created (ISO format)
//   title: "Daily Production Summary",           // Report name
//   period: {                                    // Time period covered by report
//     startDate: "2024-01-01",
//     endDate: "2024-01-01"
//   },
//   production: {
//     totalWorkOrders: 50,                       // Total orders processed
//     completedOrders: 48,                       // Successfully completed
//     pendingOrders: 2,                          // Still in progress
//     abortedOrders: 0                           // Cancelled orders
//   },
//   quality: {
//     totalQcChecks: 48,                         // Total inspections done
//     passedChecks: 46,                          // Passed quality
//     failedChecks: 2,                           // Failed quality
//     avgSuccessRate: 95.8                       // Overall quality percentage
//   },
//   inventory: {
//     materialsUsed: [                           // Which materials consumed
//       { material: "Steel", qty: 500 },
//       { material: "Plastic", qty: 200 }
//     ],
//     wastePercentage: 2.1                       // Wasted material percentage
//   },
//   efficiency: {
//     efficiencyScore: 96.5,                     // Overall efficiency rating
//     onTimeCompletion: 94.0,                    // Percentage on-time
//     qualityScore: 95.8                         // Quality rating
//   },
//   notes: "Production running smoothly"         // Optional comments
// }
//
// ============================================================

// ============================================================
// BROWSER STORAGE LIMITS:
// ============================================================
//
// localStorage size limits vary by browser:
//   - Chrome: ~10MB
//   - Firefox: ~10MB
//   - Safari: ~5MB
//   - Edge: ~10MB
//
// Each report is roughly:
//   - ~500-800 bytes (including JSON formatting)
//
// Max reports you can typically store:
//   - Roughly 10,000-15,000 reports
//
// When to use database instead:
//   - More than 15,000 reports
//   - Need advanced filtering/searching
//   - Reports needed across multiple devices
//   - Backup and recovery required
//
// ============================================================

// ============================================================
// REPORT GENERATION WORKFLOW:
// ============================================================
//
// 1. USER REQUEST
//    ↓
// 2. COLLECT DATA
//    - Get all work orders
//    - Get all quality checks
//    - Get inventory usage
//    - Calculate statistics
//    ↓
// 3. GENERATE REPORT OBJECT
//    - generateReportId() → Create unique ID
//    - Aggregate all data
//    - Calculate metrics and scores
//    ↓
// 4. SAVE REPORT
//    - getReports() → Get existing reports
//    - Add new report to array
//    - saveReports() → Save to localStorage
//    ↓
// 5. DISPLAY TO USER
//    - Show report on screen
//    - Allow download/export
//
// ============================================================

// ============================================================
// ID EXTRACTION:
// ============================================================
//
// If you need to extract the timestamp from a report ID:
//
//   const reportId = "RPT-1704067245123";
//   
//   // Extract timestamp
//   const timestamp = parseInt(reportId.split("-")[1]);
//   // timestamp = 1704067245123
//   
//   // Convert to date
//   const createdDate = new Date(timestamp);
//   // createdDate = Mon Jan 01 2024 10:30:45 GMT+0000
//   
//   // Format nicely
//   const formatted = createdDate.toLocaleDateString();
//   // formatted = "1/1/2024"
//
// ============================================================