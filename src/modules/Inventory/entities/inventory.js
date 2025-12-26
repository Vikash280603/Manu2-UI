
import { boms } from "../../entities/bom";
import { products } from "../../entities/product";

 
const locations = ["Chennai", "Coimbatore", "Bangalore", "Hyderabad"];
 
export const generateInventory = () => {
  return products.map((product, index) => {
    const productBoms = boms.filter((b) => b.id === product.id);
 
    return {
      inventoryId: index + 1,
      productId: product.id,
      location: locations[index % locations.length],
      materials: productBoms.map((bom) => ({
        materialName: bom.materialName,
        availableQty: Math.floor(Math.random() * 50) + 10,
        thresholdQty: Math.floor(Math.random() * 15) + 5
      }))
    };
  });
};
 