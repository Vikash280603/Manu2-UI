src/
│
├── auth/                   # Common login/sign up folder (shared across modules)
│   ├── LoginPage.jsx       #High -1
│   ├── SignupPage.jsx      # as frontend is Created first we will concentrate on this later 
│   ├── AuthProvider.jsx    # Handles context + role-based routing
│   └── authApi.js          # after frontend
│
├── modules/                # All app modules, one per subfolder (e.g., Module 1)
│   └── product-bom/        # Module 1: Product & BOM Management
│       ├── pages/          # Top-level pages for routing
│       │   ├── ProductList.jsx # show all prod actions like search, filter, edit, delete, view BOM.
│       │   ├── AddProduct.jsx  #Form to create a new product
│       │   ├── EditProduct.jsx #Form to edit existing product details 
│       │   ├── BOMList.jsx      #Shows Bill of Materials for a selected product 
│       │   └── AddBOM.jsx       
│       │
│       ├── components/     # Reusable UI components in this module
│       │   ├── ProductTable.jsx
│       │   ├── ProductForm.jsx
│       │   ├── BOMTable.jsx
│       │   └── BOMForm.jsx
│       │
│       ├── api/            # API calls for Products & BOM ---------Later
│       │   ├── productApi.js
│       │   └── bomApi.js
│       │
│       ├── utils/          # Utility functions/constants for API names, mapping, etc.----- Later
│       │   ├── apiNames.js
│       │   └── formatters.js
│       │
│       ├── hooks/          # Custom React hooks for this module
│       │   ├── useProducts.js
│       │   └── useBoms.js
│       │
│       └── types/          # TypeScript types or PropTypes . Later
│           ├── product.d.ts
│           └── bom.d.ts
│
├── routes/                 # App-wide routes including module-redirect logic . Later 
│   └── AppRoutes.jsx
│
├── constants/              # App-level constants for roles, routes, etc. -----  2
│   └── roles.js
│
├── App.jsx                 # Main React app setup
├── index.jsx
└── ...

# Testing the updates once again
## Another updates

-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------





src/
│
├── auth/                                  # Common authentication logic/pages
│   ├── LoginPage.jsx
│   ├── SignupPage.jsx
│   ├── authApi.js
│   └── AuthProvider.jsx                   # Context for user, role, auth state, etc.
│
├── layout/                                # Layouts (Navbar, Sidebar, App shell)
│   ├── MainLayout.jsx                     # Main layout for app (includes Navbar/Sidebar)
│   ├── Navbar.jsx                         # Top nav bar (with module/dashboard links)
│   └── Sidebar.jsx                        # Sidebar (optional; for module/module switching)
│
├── modules/                               # All business logic modules organized here
│   ├── product-bom/
│   │   ├── pages/
│   │   │   └── ProductList.jsx            # Main page (landing page) after Product BOM login
│   │   ├── components/
│   │   ├── api/
│   │   ├── utils/
│   │   ├── hooks/
│   │   └── types/
│   │
│   ├── inventory/
│   │   ├── pages/
│   │   │   └── InventoryList.jsx          # Main page for Inventory Management
│   │   ├── components/
│   │   ├── api/
│   │   ├── utils/
│   │   ├── hooks/
│   │   └── types/
│   │
│   ├── quality/
│   │   ├── pages/
│   │   │   └── QualityCheckList.jsx       # Main QC landing page
│   │   ├── components/
│   │   ├── api/
│   │   ├── utils/
│   │   ├── hooks/
│   │   └── types/
│   │
│   └── dashboard/
│       ├── pages/
│       │   └── Dashboard.jsx              # Analytics & reports main page
│       ├── components/
│       ├── api/
│       ├── utils/
│       ├── hooks/
│       └── types/
│
├── HomePage.jsx                           # Public home/landing page (`/`)
│
├── routes/
│   └── AppRoutes.jsx                      # All route definitions, role-based redirects
│
├── constants/
│   ├── roles.js                           # Role definitions/role-access logic
│   └── routePaths.js                      # Central route path constants (improves refactoring)
│
├── utils/                                 # Shared utilities (formatting, validation)
│   └── common.js
│
├── context/                               # Additional React context providers if needed
│   └── UserContext.jsx
│
├── App.jsx                                # Root of app: wraps in providers, sets up Layouts/Routing
├── index.jsx                              # Entry point
└── styles/                                # App-wide/global styles
    └── main.css