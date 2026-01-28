// ============================================================
// CONSTANT: Storage key for Quality Checks
// SYNTAX: const QUALITY_KEY = "manutrack_quality_v1";
//
// LOGIC:
//   - String that uniquely identifies where quality check data is stored
//   - "v1" indicates version 1 (can upgrade to v2, v3, etc. later)
//
// REASON:
//   - localStorage uses key-value pairs to store data
//   - We use the same key consistently to access the same storage location
//   - "manutrack_quality_v1" is specific and won't conflict with other keys
//   - Easy to find and update if data format changes in future
//
// NAMING CONVENTION:
//   - "manutrack_" = app prefix (all app storage starts with this)
//   - "quality" = feature name (what data is stored)
//   - "v1" = version (easier upgrades: v2, v3, etc.)
//
// SIMILAR KEYS IN APP:
//   - "manutrack_workorders_v2" (work order storage)
//   - "manutrack_inventory_v2" (inventory storage)
//   - "manutrack_quality_v1" (this one)
// ============================================================
const QUALITY_KEY = "manutrack_quality_v1";

// ============================================================
// FUNCTION 1: getQualityChecks
// FUNCTION SYNTAX: export const getQualityChecks = () => ...
//
// LOGIC BREAKDOWN:
//   - localStorage.getItem(QUALITY_KEY) = retrieve data from browser storage
//   - JSON.parse(...) = convert text format back to JavaScript objects
//   - || [] = if nothing found (undefined), return empty array
//
// HOW IT WORKS STEP BY STEP:
//   1. Look in browser storage for key "manutrack_quality_v1"
//   2. If found:
//      - Get the text/JSON data
//      - JSON.parse() converts it to JavaScript objects
//      - Return the array of quality checks
//   3. If NOT found (returns undefined):
//      - The || [] operator kicks in
//      - Return empty array [] instead
//
// RETURN VALUE:
//   - Array of quality check objects
//   - Empty array [] if no checks exist yet
//
// EXAMPLE OUTPUT:
//   [
//     {
//       qcId: "QC-1704067200000",
//       workOrderId: "uuid-123",
//       productId: 1,
//       inspectionDate: "2024-01-01",
//       status: "PASS",
//       notes: "All checks passed"
//     },
//     {
//       qcId: "QC-1704067300000",
//       workOrderId: "uuid-456",
//       productId: 2,
//       inspectionDate: "2024-01-02",
//       status: "FAIL",
//       notes: "Dimension mismatch"
//     }
//   ]
//   OR if first time:
//   []
//
// WHAT IS JSON.parse()?
//   - Input (text): '[{"id":1,"name":"Check1"},{"id":2,"name":"Check2"}]'
//   - Output (objects): [{id: 1, name: "Check1"}, {id: 2, name: "Check2"}]
//   - Converts text format to usable JavaScript objects
//
// REASON:
//   - Read/retrieve all quality checks from storage
//   - Needed to display quality checks on the page
//   - Called whenever we need to view or work with QC data
//
// USAGE EXAMPLE:
//   const allChecks = getQualityChecks();
//   console.log(allChecks); // Shows all stored quality checks
//   console.log(allChecks.length); // How many checks total
//   const passedChecks = allChecks.filter(c => c.status === "PASS");
// ============================================================
export const getQualityChecks = () =>
  JSON.parse(localStorage.getItem(QUALITY_KEY)) || [];

// ============================================================
// FUNCTION 2: saveQualityChecks
// FUNCTION SYNTAX: export const saveQualityChecks = (data) => ...
// PARAMETER:
//   - data = array of quality check objects to save
//
// LOGIC BREAKDOWN:
//   - JSON.stringify(data) = convert JavaScript objects to text format
//   - localStorage.setItem(KEY, VALUE) = save to browser storage
//   - KEY = "manutrack_quality_v1" (where to save)
//   - VALUE = text version of the quality checks
//
// HOW IT WORKS STEP BY STEP:
//   1. Take the data array (JavaScript objects)
//   2. Convert to text format using JSON.stringify()
//   3. Save in browser storage under the key
//   4. Data persists even if browser is closed
//
// WHAT IS JSON.stringify()?
//   - Input (objects):
//     [{id: 1, status: "PASS"}, {id: 2, status: "FAIL"}]
//   - Output (text):
//     '[{"id":1,"status":"PASS"},{"id":2,"status":"FAIL"}]'
//   - Converts JavaScript objects to text for storage
//
// EXAMPLE INPUT:
//   [
//     {
//       qcId: "QC-1704067200000",
//       workOrderId: "uuid-123",
//       status: "PASS",
//       notes: "All dimensions correct"
//     },
//     {
//       qcId: "QC-1704067300000",
//       workOrderId: "uuid-456",
//       status: "FAIL",
//       notes: "Weight exceeded limit"
//     }
//   ]
//
// BECOMES (stored as text):
//   '[{"qcId":"QC-1704067200000","workOrderId":"uuid-123",...},...]]'
//
// WHY STRINGIFY?
//   - Browser storage only accepts text
//   - JSON is a standard text format for data
//   - Can be read by any language/system
//   - Compact and efficient
//
// REASON:
//   - Save/persist quality checks to browser storage
//   - Data survives page refresh and browser restart
//   - Must convert objects to text first (JSON.stringify)
//   - Called after creating, updating, or deleting QC records
//
// USAGE EXAMPLE:
//   // Create a new quality check
//   const newCheck = {
//     qcId: generateQcId(),
//     workOrderId: "uuid-789",
//     productId: 3,
//     status: "PASS",
//     notes: "Inspection passed all tests"
//   };
//
//   // Get existing checks
//   const currentChecks = getQualityChecks();
//
//   // Add new check to list
//   currentChecks.push(newCheck);
//
//   // Save updated list back to storage
//   saveQualityChecks(currentChecks);
// ============================================================
export const saveQualityChecks = (data) =>
  localStorage.setItem(QUALITY_KEY, JSON.stringify(data));

// ============================================================
// FUNCTION 3: generateQcId
// FUNCTION SYNTAX: export const generateQcId = () => ...
//
// LOGIC BREAKDOWN:
//   - Date.now() = gets current time in milliseconds since Jan 1, 1970
//   - Template string: `QC-${...}` = creates string like "QC-1704067200000"
//   - Each call gets a different timestamp, so unique IDs
//
// WHAT IS Date.now()?
//   - Returns number of milliseconds since 1970-01-01 00:00:00 UTC
//   - Example: 1704067200000 (represents a specific moment in time)
//   - Increases by ~1000 every second
//   - Never repeats (each call gets larger number)
//
// HOW IT WORKS:
//   Call 1 (at 10:30:45 AM): Date.now() = 1704067245123
//     → Returns: "QC-1704067245123"
//   Call 2 (at 10:30:46 AM): Date.now() = 1704067246456
//     → Returns: "QC-1704067246456"
//   Call 3 (at 10:30:47 AM): Date.now() = 1704067247789
//     → Returns: "QC-1704067247789"
//
// WHY GUARANTEED UNIQUE?
//   - Time only moves forward (never goes backward)
//   - Even if you call function twice in same millisecond (extremely rare)
//   - Computer time is fast enough to generate different values
//   - Much faster than UUID but still unique for QC records
//
// RETURN VALUE:
//   - String in format: "QC-{timestamp}"
//   - Example: "QC-1704067245123"
//   - 13 digits for timestamp, very specific to exact moment
//
// ADVANTAGES OF Date.now() FOR IDs:
//   ✅ Simple and fast
//   ✅ Human-readable (can extract timestamp)
//   ✅ Sortable (later checks have higher numbers)
//   ✅ No conflicts (time never goes backward)
//
// DISADVANTAGES:
//   ❌ Not completely random (predictable pattern)
//   ❌ Could have conflicts if 2+ checks created in same millisecond
//   ❌ Time-dependent (relies on system clock)
//
// WHEN TO USE Date.now():
//   ✅ For QC checks (always at different times)
//   ✅ When speed matters (faster than UUID)
//   ✅ When you want sortable IDs
//
// WHEN NOT TO USE:
//   ❌ Security-sensitive data (too predictable)
//   ❌ Offline apps (system time can be changed)
//   ❌ Distributed systems (multiple computers)
//
// REASON:
//   - Each quality check needs a unique ID
//   - Date-based IDs work well for QC (sequential in time)
//   - Simpler than crypto.randomUUID()
//   - Still guaranteed unique in typical manufacturing scenario
//
// USAGE EXAMPLE:
//   const qcId1 = generateQcId();
//   // Returns: "QC-1704067245123"
//
//   const qcId2 = generateQcId();
//   // Returns: "QC-1704067246456"
//
//   const newQcRecord = {
//     qcId: generateQcId(), // "QC-1704067247789"
//     workOrderId: "uuid-123",
//     productId: 5,
//     inspectionDate: new Date().toISOString(),
//     status: "PASS",
//     notes: "All parameters within tolerance"
//   };
//
//   // Can extract timestamp from ID if needed:
//   const timestamp = parseInt(qcId.split("-")[1]); // 1704067247789
//   const dateObject = new Date(timestamp); // Convert back to date
// ============================================================
export const generateQcId = () =>
  `QC-${Date.now()}`;

// ============================================================
// HOW THESE 3 FUNCTIONS WORK TOGETHER:
// ============================================================
//
// SCENARIO: Creating a new quality check
//
// STEP 1: Generate unique QC ID
//   const qcId = generateQcId();
//   // Result: "QC-1704067245123"
//
// STEP 2: Create quality check object
//   const newQcCheck = {
//     qcId: qcId,
//     workOrderId: "uuid-456",
//     productId: 2,
//     inspectionDate: "2024-01-01",
//     status: "PASS",
//     notes: "Dimensions correct, finish good"
//   };
//
// STEP 3: Get existing QC checks from storage
//   const existingChecks = getQualityChecks();
//   // Returns: [] (if first time) or [...previous checks]
//
// STEP 4: Add new check to list
//   existingChecks.push(newQcCheck);
//
// STEP 5: Save updated list back to storage
//   saveQualityChecks(existingChecks);
//
// FLOW DIAGRAM:
//   generateQcId() ─→ Create unique ID
//                      │
//                      ↓
//   Create QC object with that ID
//                      │
//                      ↓
//   getQualityChecks() ─→ Get all existing QC records
//                      │
//                      ├→ Add new check to list
//                      │
//                      ↓
//   saveQualityChecks() ─→ Save updated list to browser storage
//
// ============================================================

// ============================================================
// QUALITY CHECK DATA STRUCTURE:
// ============================================================
//
// A typical quality check object looks like:
// {
//   qcId: "QC-1704067245123",           // Unique ID generated by generateQcId()
//   workOrderId: "uuid-456",             // Links to work order
//   productId: 2,                        // Links to product
//   inspectionDate: "2024-01-01",        // When inspection was done
//   status: "PASS" or "FAIL",            // QC result
//   notes: "Description of findings",    // Inspector comments
//   defects: [...],                      // Optional: list of defects found
//   reworkRequired: false                // Optional: needs rework?
// }
//
// ============================================================

// ============================================================
// BROWSER STORAGE LIMITS:
// ============================================================
//
// localStorage size limits:
//   - Chrome: ~10MB
//   - Firefox: ~10MB
//   - Safari: ~5MB
//   - Internet Explorer: ~10MB
//
// Each quality check is roughly:
//   - ~200-300 bytes (including JSON format)
//
// Max checks you can store:
//   - Roughly 30,000-50,000 quality checks
//
// When to use database:
//   - More than 50,000 records
//   - Need to share between devices
//   - Need search/filtering on server
//
// ============================================================

// ============================================================
// COMPARISON: Date.now() vs crypto.randomUUID()
// ============================================================
//
// Date.now() (this file):
//   - Format: "QC-1704067245123"
//   - Sortable: YES (can sort by ID)
//   - Predictable: YES (can guess next ID)
//   - Performance: FAST
//   - Size: 13 digits
//   - Use case: Quality checks, timestamps
//
// crypto.randomUUID() (in workOrders):
//   - Format: "a1b2c3d4-e5f6-4789-a123-456789abcdef"
//   - Sortable: NO (random order)
//   - Predictable: NO (truly random)
//   - Performance: SLOWER
//   - Size: 36 characters
//   - Use case: Work orders, high security needed
//
// ============================================================