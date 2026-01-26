// bom.js
// Bill of Materials data
// NOTE:
// - BOMID is UNIQUE for every object
// - id = product id (can repeat)
// - Each product has multiple BOM entries

export const boms = [

  // Product 1
  { BOMID: 1, id: 1, materialName: "Steel Head", quantity: 1 },
  { BOMID: 2, id: 1, materialName: "Wooden Handle", quantity: 1 },

  // Product 2
  { BOMID: 3, id: 2, materialName: "Chrome Steel Body", quantity: 1 },
  { BOMID: 4, id: 2, materialName: "Anti-rust Coating", quantity: 1 },

  // Product 3
  { BOMID: 5, id: 3, materialName: "Steel Shaft", quantity: 1 },
  { BOMID: 6, id: 3, materialName: "Plastic Handle", quantity: 1 },

  // Product 4
  { BOMID: 7, id: 4, materialName: "Electric Motor", quantity: 1 },
  { BOMID: 8, id: 4, materialName: "Plastic Casing", quantity: 1 },
  { BOMID: 9, id: 4, materialName: "Copper Wiring", quantity: 20 },

  // Product 5
  { BOMID: 10, id: 5, materialName: "Steel Blade", quantity: 1 },
  { BOMID: 11, id: 5, materialName: "Plastic Handle", quantity: 1 },

  // Product 6
  { BOMID: 12, id: 6, materialName: "Steel Jaws", quantity: 2 },
  { BOMID: 13, id: 6, materialName: "Rubber Grip", quantity: 2 },

  // Product 7
  { BOMID: 14, id: 7, materialName: "Hardened Steel Blade", quantity: 1 },
  { BOMID: 15, id: 7, materialName: "Plastic Handle", quantity: 1 },

  // Product 8
  { BOMID: 16, id: 8, materialName: "Steel Frame", quantity: 1 },
  { BOMID: 17, id: 8, materialName: "Threaded Rod", quantity: 1 },

  // Product 9
  { BOMID: 18, id: 9, materialName: "Alloy Steel Body", quantity: 1 },
  { BOMID: 19, id: 9, materialName: "Chrome Finish", quantity: 1 },

  // Product 10
  { BOMID: 20, id: 10, materialName: "Steel File Plate", quantity: 1 },
  { BOMID: 21, id: 10, materialName: "Rubber Handle", quantity: 1 },

  // Product 11
  { BOMID: 22, id: 11, materialName: "Steel Measuring Tape", quantity: 1 },
  { BOMID: 23, id: 11, materialName: "Plastic Case", quantity: 1 },

  // Product 12
  { BOMID: 24, id: 12, materialName: "Aluminum Frame", quantity: 1 },
  { BOMID: 25, id: 12, materialName: "Bubble Vial", quantity: 2 },

  // Product 13
  { BOMID: 26, id: 13, materialName: "Chrome Vanadium Steel", quantity: 1 },
  { BOMID: 27, id: 13, materialName: "Protective Coating", quantity: 1 },

  // Product 14
  { BOMID: 28, id: 14, materialName: "Steel Handle", quantity: 1 },
  { BOMID: 29, id: 14, materialName: "Ratchet Mechanism", quantity: 1 },

  // Product 15
  { BOMID: 30, id: 15, materialName: "Cast Iron Body", quantity: 1 },
  { BOMID: 31, id: 15, materialName: "Steel Screw Rod", quantity: 1 },

  // Product 16
  { BOMID: 32, id: 16, materialName: "Plastic Handle", quantity: 1 },
  { BOMID: 33, id: 16, materialName: "Nylon Bristles", quantity: 50 },

  // Product 17
  { BOMID: 34, id: 17, materialName: "Roller Frame", quantity: 1 },
  { BOMID: 35, id: 17, materialName: "Foam Roller Pad", quantity: 1 },

  // Product 18
  { BOMID: 36, id: 18, materialName: "Plastic Body", quantity: 1 },
  { BOMID: 37, id: 18, materialName: "Metal Handle", quantity: 1 },

  // Product 19
  { BOMID: 38, id: 19, materialName: "Aluminum Rails", quantity: 2 },
  { BOMID: 39, id: 19, materialName: "Steel Steps", quantity: 10 },

  // Product 20
  { BOMID: 40, id: 20, materialName: "Steel Blade", quantity: 1 },
  { BOMID: 41, id: 20, materialName: "Wooden Handle", quantity: 1 },

];
