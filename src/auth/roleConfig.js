// src/auth/roleConfig.js
// Centralized role configuration - Single Source of Truth
 
export const ROLES = {
  ADMIN: "admin",
  PRODUCT_BOM_MANAGER: "product_bom_manager",
  INVENTORY_MANAGER: "inventory_manager",
  PRODUCTION_SCHEDULER: "production_scheduler",
  QC_MANAGER: "qc_manager"
};
 
// Role to home page mapping
export const ROLE_HOME_PAGES = {
  [ROLES.ADMIN]: "/analytics",
  [ROLES.PRODUCT_BOM_MANAGER]: "/products",
  [ROLES.INVENTORY_MANAGER]: "/inventory",
  [ROLES.PRODUCTION_SCHEDULER]: "/workorder",
  [ROLES.QC_MANAGER]: "/quality"
};
 
// Route permissions - who can access what
export const ROUTE_PERMISSIONS = {
  "/analytics": [ROLES.ADMIN],
  "/products": [ROLES.ADMIN, ROLES.PRODUCT_BOM_MANAGER],
  "/inventory": [ROLES.ADMIN, ROLES.INVENTORY_MANAGER],
  "/workorder": [ROLES.ADMIN, ROLES.PRODUCTION_SCHEDULER],
  "/quality": [ROLES.ADMIN, ROLES.QC_MANAGER, ROLES.PRODUCTION_SCHEDULER]
};
 
// Helper function to get user's home page
export const getUserHomePage = (role) => {
  return ROLE_HOME_PAGES[role] || "/login";
};