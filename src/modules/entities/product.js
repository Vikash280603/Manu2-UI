// Product.js
// This file contains a hardcoded list of products.
// It is used as mock (fake) data instead of fetching from a backend or database.
// `products` is an array of objects.
// Each object represents ONE product.
export const products = [

  // Product 1
  {
    // Unique identifier for the product
    // Used for keys in React lists and for identifying products
    id: 1,

    // Name of the product 
    name: "Hammer",

    // Category helps group similar products
    // Useful for filtering and reporting
    category: "Mechanical",

    // Status indicates whether the product is usable or not
    // "ACTIVE" usually means available/visible in the system
    status: "ACTIVE"
  },

  {
    id: 2,
    name: "Wrench",
    category: "Mechanical",
    status: "ACTIVE"
  },

  {
    id: 3,
    name: "Screwdriver",
    category: "Electrical",
    status: "ACTIVE"
  },

  {
    id: 4,
    name: "Drill",
    category: "Electrical",
    status: "ACTIVE"
  },

  {
    id: 5,
    name: "Saw",
    category: "Packaging",
    status: "ACTIVE"
  },

  {
    id: 6,
    name: "Pliers",
    category: "Packaging",
    status: "ACTIVE"
  },

  {
    id: 7,
    name: "Chisel",
    category: "Construction",
    status: "ACTIVE"
  },

  {
    id: 8,
    name: "Clamp",
    category: "Construction",
    status: "ACTIVE"
  },

  {
    id: 9,
    name: "Spanner",
    category: "Tools",
    status: "ACTIVE"
  },

  {
    id: 10,
    name: "File",
    category: "Tools",
    status: "ACTIVE"
  },

  {
    id: 11,
    name: "Tape Measure",
    category: "Measurement",
    status: "ACTIVE"
  },

  {
    id: 12,
    name: "Level",
    category: "Measurement",
    status: "ACTIVE"
  },

  {
    id: 13,
    name: "Socket",
    category: "Hardware",
    status: "ACTIVE"
  },

  {
    id: 14,
    name: "Ratchet",
    category: "Hardware",
    status: "ACTIVE"
  },

  {
    id: 15,
    name: "Vice",
    category: "Workshop",
    status: "ACTIVE"
  },

  {
    id: 16,
    name: "Brush",
    category: "Workshop",
    status: "ACTIVE"
  },

  {
    id: 17,
    name: "Roller",
    category: "Painting",
    status: "ACTIVE"
  },

  {
    id: 18,
    name: "Bucket",
    category: "Painting",
    status: "ACTIVE"
  },

  {
    id: 19,
    name: "Ladder",
    category: "Safety",
    status: "ACTIVE"
  },

  {
    id: 20,
    name: "Trowel",
    category: "Safety",
    status: "ACTIVE"
  }
];
