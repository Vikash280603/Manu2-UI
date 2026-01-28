import { boms } from "../../entities/bom";
import { products } from "../../entities/product";

const locations = ["Chennai", "Coimbatore", "Bangalore", "Hyderabad"];

export const generateInventory = () => {
  return products.map((product, index) => {
    // Get materials (BOM) for this product
    const productBoms = boms.filter((b) => b.id === product.id);

    return {
      // Unique ID for this inventory (starts at 1)
      inventoryId: index + 1,

      // Links to the product
      productId: product.id,

      // Rotate through locations (Chennai → Coimbatore → Bangalore → Hyderabad)
      location: locations[index % locations.length],

      // List of materials with quantities
      materials: productBoms.map((bom) => ({
        materialName: bom.materialName,

        // Current stock quantity (10-59 units)
        availableQty: Math.floor(Math.random() * 50) + 10,

        // Reorder threshold (5-19 units)
        thresholdQty: Math.floor(Math.random() * 15) + 5
      }))
    };
  });
};