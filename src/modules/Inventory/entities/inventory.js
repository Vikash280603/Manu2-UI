
import { boms } from "../../entities/bom";
import { products } from "../../entities/product";

// ============================================================
// ARRAY: locations (List of warehouse locations)
//   - Array of 4 strings (text values)
// NOTE: We'll rotate through this list (use index % to repeat)
// Example: Product 1 → Chennai, Product 2 → Coimbatore, Product 3 → Bangalore,
//          Product 4 → Hyderabad, Product 5 → Chennai (repeats), etc.
// ============================================================
const locations = ["Chennai", "Coimbatore", "Bangalore", "Hyderabad"];
  
//   - Creates an inventory list for ALL products
//   - For each product, it includes:
//     * Inventory ID (1, 2, 3, etc.)
//     * Product ID (links to product)
//     * Location (which warehouse)
//     * Materials list with quantities
//
// RETURN VALUE: Array of inventory objects
//
// REASON: We need to track inventory (stock) for each product
//         This function generates that data automatically
// ============================================================
export const generateInventory = () => {
  // ========================================================
  // Step 1: Loop through each product
  // SYNTAX: return products.map((product, index) => { ... })
  //
  // PARAMETERS:
  //   - product = current product object from products array
  //   - index = position number (0, 1, 2, 3, ...)
  //             Note: This is used to assign locations
  //
  // LOGIC:
  //   - map() = loop through each product
  //   - For each product, we create an inventory object
  //   - return = the new array with inventory objects
  //
  // REASON: We need to create inventory for EVERY product
  // ========================================================
  return products.map((product, index) => {
    // ======================================================
    // Step 2: Get materials (BOM) for this product
    // SYNTAX: const productBoms = boms.filter((b) => b.id === product.id);
    //
    // LOGIC:
    //   - boms.filter((b) => b.id === product.id)
    //   - filter() = go through all boms and select only matching ones
    //   - (b) = current bom object
    //   - b.id === product.id = check if bom's product ID matches
    //   - === = "equals" (compare two values)
    //   - productBoms = array containing only this product's materials
    //
    // EXAMPLE:
    //   If we have:
    //   - Product ID: 1
    //   - BOMs: [{id: 1, materialName: "Steel"}, 
    //            {id: 1, materialName: "Plastic"},
    //            {id: 2, materialName: "Copper"}]
    //   - After filter: [{id: 1, materialName: "Steel"}, 
    //                     {id: 1, materialName: "Plastic"}]
    //
    // REASON: We only want materials that belong to THIS product
    // ======================================================
    const productBoms = boms.filter((b) => b.id === product.id);

    // ======================================================
    // Step 3: Create inventory object for this product
    // SYNTAX: return { inventoryId: ..., productId: ..., location: ..., materials: ... }
    //
    // LOGIC: Create a new object with 4 properties:
    // ======================================================
    return {
      // Property 1: inventoryId (unique ID for this inventory)
      // SYNTAX: inventoryId: index + 1
      // LOGIC:
      //   - index = position in the products array (starts at 0)
      //   - + 1 = add 1 (because we want to start numbering from 1, not 0)
      //   - Example: 1st product gets ID 1, 2nd gets ID 2, etc.
      // REASON: Each inventory needs a unique number
      inventoryId: index + 1,

      // Property 2: productId (links to the product)
      // SYNTAX: productId: product.id
      // LOGIC:
      //   - product.id = the ID of current product
      //   - We use this to identify which product this inventory belongs to
      // REASON: We need to know which product this inventory is for
      productId: product.id,

      // Property 3: location (warehouse location)
      // SYNTAX: location: locations[index % locations.length]
      //
      // LOGIC EXPLANATION:
      //   - locations[...] = get value from locations array
      //   - index % locations.length = calculate which location to use
      //
      // WHAT IS %? (Modulo operator - remainder after division)
      //   - % = divide and get the remainder
      //   - Example: 5 % 4 = 1 (5 ÷ 4 = 1 remainder 1)
      //   - Example: 8 % 4 = 0 (8 ÷ 4 = 2 remainder 0)
      //   - locations.length = 4 (we have 4 locations)
      //
      // HOW IT WORKS (rotates through locations):
      //   - Product 0: 0 % 4 = 0 → locations[0] → Chennai
      //   - Product 1: 1 % 4 = 1 → locations[1] → Coimbatore
      //   - Product 2: 2 % 4 = 2 → locations[2] → Bangalore
      //   - Product 3: 3 % 4 = 3 → locations[3] → Hyderabad
      //   - Product 4: 4 % 4 = 0 → locations[0] → Chennai (repeats!)
      //   - Product 5: 5 % 4 = 1 → locations[1] → Coimbatore
      //
      // REASON: Distribute products evenly across 4 locations
      location: locations[index % locations.length],

      // Property 4: materials (list of materials with quantities)
      // SYNTAX: materials: productBoms.map((bom) => ({ ... }))
      //
      // LOGIC:
      //   - productBoms.map() = loop through each material for this product
      //   - (bom) = current material object
      //   - For each material, create a new object with:
      //     * materialName
      //     * availableQty (how many we have in stock)
      //     * thresholdQty (minimum quantity before reorder)
      //
      // REASON: Show inventory details for each material
      // ======================================================
      materials: productBoms.map((bom) => ({
        
        // Material name (what material this is)
        // SYNTAX: materialName: bom.materialName
        // LOGIC: Copy the material name from the BOM data
        // REASON: We need to know what material we're tracking
        materialName: bom.materialName,

        // Available Quantity (how many units we currently have)
        // SYNTAX: availableQty: Math.floor(Math.random() * 50) + 10
        //
        // LOGIC BREAKDOWN:
        //   - Math.random() = generates random number between 0 and 1
        //     * Example: 0.734567
        //   - Math.random() * 50 = multiply by 50 (range 0 to 50)
        //     * Example: 0.734567 * 50 = 36.72835
        //   - Math.floor(...) = remove decimal part (round down)
        //     * Example: Math.floor(36.72835) = 36
        //   - + 10 = add 10 (so minimum is 10, maximum is 59)
        //     * Example: 36 + 10 = 46
        //
        // RESULT: Random number between 10 and 59
        //
        // REASON: Generate realistic stock quantities
        //         We add 10 so we always have some minimum stock
        availableQty: Math.floor(Math.random() * 50) + 10,

        // Threshold Quantity (minimum level before we need to reorder)
        // SYNTAX: thresholdQty: Math.floor(Math.random() * 15) + 5
        //
        // LOGIC BREAKDOWN (same as above):
        //   - Math.random() = random number 0 to 1
        //   - Math.random() * 15 = range 0 to 15
        //   - Math.floor(...) = remove decimal (0 to 15)
        //   - + 5 = add 5 (so range is 5 to 19)
        //
        // RESULT: Random number between 5 and 19
        //
        // REASON: Each material has a different reorder threshold
        //         If availableQty drops below this, we need to order more
        thresholdQty: Math.floor(Math.random() * 15) + 5
      }))
    };
  });
};

// ============================================================
// HOW THE WHOLE FUNCTION WORKS (Complete Example):
// ============================================================
// 
// INPUT DATA:
// -----------
// products = [
//   { id: 1, name: "Product A" },
//   { id: 2, name: "Product B" }
// ]
//
// boms = [
//   { id: 1, materialName: "Steel" },
//   { id: 1, materialName: "Plastic" },
//   { id: 2, materialName: "Copper" }
// ]
//
// locations = ["Chennai", "Coimbatore", "Bangalore", "Hyderabad"]
//
// OUTPUT (Example):
// -----------------
// [
//   {
//     inventoryId: 1,
//     productId: 1,
//     location: "Chennai",  (0 % 4 = 0)
//     materials: [
//       {
//         materialName: "Steel",
//         availableQty: 42,  (random between 10-59)
//         thresholdQty: 12   (random between 5-19)
//       },
//       {
//         materialName: "Plastic",
//         availableQty: 35,
//         thresholdQty: 8
//       }
//     ]
//   },
//   {
//     inventoryId: 2,
//     productId: 2,
//     location: "Coimbatore",  (1 % 4 = 1)
//     materials: [
//       {
//         materialName: "Copper",
//         availableQty: 55,
//         thresholdQty: 15
//       }
//     ]
//   }
// ]
//
// KEY TAKEAWAYS:
// ===============
// 1. This function GENERATES sample inventory data automatically
// 2. It uses Math.random() to create realistic varying quantities
// 3. It distributes products across 4 locations evenly (Chennai, Coimbatore, etc.)
// 4. Each product's inventory shows only its materials (using filter)
// 5. availableQty = how much we have now (10-59 units)
// 6. thresholdQty = warning level for reordering (5-19 units)
// 7. If availableQty < thresholdQty, we should reorder!
// ============================================================