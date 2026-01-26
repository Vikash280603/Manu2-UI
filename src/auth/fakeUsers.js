// src/auth/fakeUsers.js
// This file contains FAKE / HARDCODED user data.
// Purpose of this file:
// 1. Simulate backend users during development
// 2. Allow login functionality WITHOUT a real server
// 3. Help understand authentication & role-based access
// -------------------- USER DATA STRUCTURE --------------------
// Each user object contains:
// - name     : Display name of the user
// - email    : Used as login identifier
// - password : Used for demo authentication
// - role     : Controls access & redirection in the app

export const users = [

  // -------------------- PRODUCT MANAGER --------------------
  {
    name: "Product Manager",            // User's display name
    email: "product@company.com",        // Login email
    password: "product123",              // Demo password (INSECURE)
    role: "product_bom_manager"           // Role used for routing & permissions
  },


  // -------------------- INVENTORY MANAGER --------------------
  {
    name: "Inventory Manager",
    email: "inventory@company.com",
    password: "inventory123",
    role: "inventory_manager"
  },


  // -------------------- QUALITY CONTROL USER --------------------
  {
    name: "Quality Control",
    email: "quality@company.com",
    password: "qc123",
    role: "qc_manager"
  },


  // -------------------- PRODUCTION SCHEDULER --------------------
  {
    name: "Production Scheduler",
    email: "scheduler@company.com",      // Normalized email casing
    password: "scheduler123",
    role: "production_scheduler"          // Consistent lowercase role naming
  },


  // -------------------- SECOND QC USER --------------------
  // Example of multiple users having the same role
  {
    name: "Quality Control",
    email: "quality1@company.com",
    password: "qc123",
    role: "qc_manager"
  },


  // -------------------- ADMIN USER --------------------
  {
    name: "Admin",
    email: "admin@company.com",
    password: "admin123",
    role: "admin"
  }
];


// -------------------- REAL WORLD NOTE --------------------
// In production:
// - Users come from a backend API
// - Passwords are HASHED (bcrypt, argon2)
// - Authentication uses JWT / OAuth
// - Roles are validated server-side
