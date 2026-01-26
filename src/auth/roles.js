// src/auth/roles.js
// This file defines ALL USER ROLES used in the application.
// Purpose of this file:
// 1. Centralize role definitions in one place
// 2. Avoid hardcoding role strings across the app
// 3. Provide human‑readable labels for UI components (Dropdowns, Forms)
// 4. Ensure consistency between authentication, routing, and permissions


// -------------------- ROLE DATA STRUCTURE --------------------
// Each role object contains:
// - label : Human‑friendly name (shown in UI)
// - value : Machine‑friendly value (used in logic & routing)
//
// Why separate label & value?
// - label can change for UI/UX reasons
// - value should remain stable for code logic

export const roles = [

  // -------------------- PRODUCT BOM MANAGER --------------------
  {
    label: "Product BOM Manager",     // Display name for dropdowns / UI
    value: "product_bom_manager"      // Used in auth, routing & permissions
  },


  // -------------------- INVENTORY MANAGER --------------------
  {
    label: "Inventory Manager",
    value: "inventory_manager"
  },


  // -------------------- QUALITY CONTROL --------------------
  {
    label: "Quality Control",
    value: "qc_manager"
  },


  // -------------------- DASHBOARD USER --------------------
  {
    label: "Dashboard User",
    value: "dashboard_user"
  },


  // -------------------- ADMIN --------------------
  {
    label: "Admin",
    value: "admin"
  }
];


// -------------------- BEST PRACTICE NOTE --------------------
// In real applications:
// - Roles usually come from backend APIs
// - Permissions are validated server‑side
// - Frontend uses roles only for UI control & navigation
