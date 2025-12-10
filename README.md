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