// ============================================================
// CONSTANT: Storage key for Work Orders
// SYNTAX: const WORKORDER_KEY = "manutrack_workorders_v2";
// 
// LOGIC:
//   - String that identifies where work orders are stored
//   - "v2" indicates version 2 (if we update format, we can use v3, v4, etc.)
//
// REASON: 
//   - We use the same key every time to access the same data
//   - Prevents accidentally creating multiple storage locations
//   - Makes it easy to find and update storage if needed
//   - Consistent naming convention for all storage keys
//
// EXAMPLE:
//   If we want to store customer orders and product inventory:
//   - "manutrack_orders_v2"
//   - "manutrack_inventory_v2"
//   - "manutrack_workorders_v2" (this one)
// ============================================================
const WORKORDER_KEY = "manutrack_workorders_v2";

// ============================================================
// FUNCTION 1: getWorkOrders
// FUNCTION SYNTAX: export const getWorkOrders = () => ...
// 
// LOGIC BREAKDOWN:
//   - localStorage.getItem(WORKORDER_KEY) = retrieve data from browser storage
//   - JSON.parse(...) = convert text format to JavaScript array/object
//   - || [] = if nothing found (undefined), use empty array instead
//
// HOW IT WORKS:
//   1. Look in browser storage for key "manutrack_workorders_v2"
//   2. If found → convert from text to JavaScript object → return it
//   3. If NOT found → return empty array [] (fresh start)
//
// RETURN VALUE:
//   - Array of work order objects
//   - Empty array [] if no work orders exist yet
//
// EXAMPLE OUTPUT:
//   [
//     { id: "uuid-123", productId: 1, status: "PENDING", qty: 10 },
//     { id: "uuid-456", productId: 2, status: "IN_PROGRESS", qty: 5 }
//   ]
//   OR if nothing stored:
//   []
//
// REASON:
//   - Read/retrieve all work orders from storage
//   - We need this to display work orders on the screen
//   - Called whenever we need to show or work with work orders
//
// USAGE EXAMPLE:
//   const allOrders = getWorkOrders();
//   console.log(allOrders); // Shows all stored work orders
// ============================================================
export const getWorkOrders = () =>
  JSON.parse(localStorage.getItem(WORKORDER_KEY)) || [];

// ============================================================
// FUNCTION 2: saveWorkOrders
// FUNCTION SYNTAX: export const saveWorkOrders = (orders) => ...
// PARAMETER:
//   - orders = array of work order objects to save
//
// LOGIC BREAKDOWN:
//   - JSON.stringify(orders) = convert JavaScript array to text format
//   - localStorage.setItem(KEY, VALUE) = save to browser storage
//   - KEY = "manutrack_workorders_v2" (where to save)
//   - VALUE = text version of the orders array
//
// HOW IT WORKS:
//   1. Take the orders array (JavaScript objects)
//   2. Convert to text format (JSON string)
//   3. Save in browser storage under the key
//
// WHAT IT SAVES:
//   Input (JavaScript):
//   [
//     { id: "uuid-123", productId: 1, status: "PENDING", qty: 10 },
//     { id: "uuid-456", productId: 2, status: "IN_PROGRESS", qty: 5 }
//   ]
//
//   Becomes (Text/JSON):
//   '[{"id":"uuid-123","productId":1,"status":"PENDING","qty":10},
//     {"id":"uuid-456","productId":2,"status":"IN_PROGRESS","qty":5}]'
//
// REASON:
//   - Save/persist work orders to browser storage
//   - Browser storage only accepts text format
//   - JSON.stringify converts objects to text
//   - Data persists even after closing browser
//
// USAGE EXAMPLE:
//   const newOrder = { id: "uuid-789", productId: 3, status: "PENDING", qty: 15 };
//   const currentOrders = getWorkOrders();
//   currentOrders.push(newOrder); // Add new order
//   saveWorkOrders(currentOrders); // Save to storage
// ============================================================
export const saveWorkOrders = (orders) =>
  localStorage.setItem(WORKORDER_KEY, JSON.stringify(orders));

// ============================================================
// FUNCTION 3: generateWorkOrderId
// FUNCTION SYNTAX: export const generateWorkOrderId = () => ...
//
// LOGIC BREAKDOWN:
//   - crypto.randomUUID() = generates a unique ID
//   - Returns a random string that is virtually impossible to duplicate
//   - UUID = Universally Unique Identifier
//
// WHAT IS crypto.randomUUID()?
//   - crypto = built-in JavaScript security object
//   - randomUUID() = generates a random UUID (Version 4)
//   - UUID format: "123e4567-e89b-12d3-a456-426614174000"
//
// HOW IT WORKS:
//   Each time you call this function, it creates a new random ID:
//   - Call 1: "a1b2c3d4-e5f6-47g8-h9i0-j1k2l3m4n5o6"
//   - Call 2: "z9y8x7w6-v5u4-t3s2-r1q0-p0o9n8m7l6k5"
//   - Call 3: "f5g6h7i8-j9k0-l1m2-n3o4-p5q6r7s8t9u0"
//
// WHY GUARANTEED UNIQUE?
//   - Uses random algorithms + timestamp + machine info
//   - Probability of collision is astronomically small (1 in billions)
//   - Standard UUID v4 format ensures uniqueness
//
// RETURN VALUE:
//   - String in format: "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx"
//   - Example: "550e8400-e29b-41d4-a716-446655440000"
//
// REASON:
//   - Each work order needs a unique ID
//   - We can't use sequential numbers (1, 2, 3) because:
//     * Multiple users might create orders simultaneously
//     * Previous orders deleted might leave gaps
//   - UUID ensures no conflicts or duplicates
//
// USAGE EXAMPLE:
//   const newWorkOrderId = generateWorkOrderId();
//   // Returns something like: "f47ac10b-58cc-4372-a567-0e02b2c3d479"
//   
//   const newOrder = {
//     id: newWorkOrderId,
//     productId: 1,
//     quantity: 50,
//     status: "PENDING"
//   };
// ============================================================
export const generateWorkOrderId = () =>
  crypto.randomUUID();

// ============================================================
// HOW THESE 3 FUNCTIONS WORK TOGETHER:
// ============================================================
//
// SCENARIO: Creating and saving a new work order
//
// STEP 1: Generate unique ID
//   const orderId = generateWorkOrderId();
//   // Returns: "3fa85f64-5717-4562-b3fc-2c963f66afa6"
//
// STEP 2: Create new order object
//   const newOrder = {
//     id: orderId,
//     productId: 1,
//     quantity: 100,
//     status: "PENDING",
//     createdAt: new Date()
//   };
//
// STEP 3: Get existing orders from storage
//   const existingOrders = getWorkOrders();
//   // Returns: [] (if first time) or [...existing orders]
//
// STEP 4: Add new order to list
//   existingOrders.push(newOrder);
//
// STEP 5: Save updated list back to storage
//   saveWorkOrders(existingOrders);
//
// FLOW DIAGRAM:
//   generateWorkOrderId() ─→ Create new work order
//                             │
//                             ↓
//   getWorkOrders() ─→ Get all existing orders
//                       │
//                       ├→ Add new order to list
//                       │
//                       ↓
//   saveWorkOrders() ─→ Save updated list to browser storage
//
// ============================================================

// ============================================================
// WHY BROWSER STORAGE (localStorage)?
// ============================================================
//
// ADVANTAGES:
//   ✅ Data persists after browser closes
//   ✅ Simple to use (just strings in/out)
//   ✅ No server needed (works offline)
//   ✅ Fast access (stored on user's computer)
//
// DISADVANTAGES:
//   ❌ Limited size (usually 5-10MB max)
//   ❌ Only stores text (need JSON.stringify/parse)
//   ❌ Not shared between different browsers
//   ❌ User can delete it anytime
//
// WHEN TO USE:
//   ✅ Temporary app data
//   ✅ User preferences
//   ✅ Demo/prototype applications
//   ✅ Offline-first apps
//
// WHEN NOT TO USE:
//   ❌ Sensitive data (passwords, tokens)
//   ❌ Large datasets (database)
//   ❌ Data that needs to sync across devices
//   ❌ Production apps with real users
//
// ============================================================

// ============================================================
// TECHNICAL NOTES:
// ============================================================
//
// JSON.stringify():
//   - Converts: { id: 1, name: "Order" }
//   - To:       '{"id":1,"name":"Order"}'
//
// JSON.parse():
//   - Converts: '{"id":1,"name":"Order"}'
//   - To:       { id: 1, name: "Order" }
//
// || Operator (OR):
//   - If left side is falsy (null, undefined, false, "", 0)
//   - Returns right side instead
//   - Example: null || [] returns []
//             "data" || [] returns "data"
//
// crypto.randomUUID():
//   - Available in modern browsers and Node.js
//   - Returns RFC 4122 version 4 UUID
//   - Cryptographically secure random generation
//
// ============================================================