// src/modules/product-bom/ProductRoutes.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Import your actual pages
import EditProduct from '../modules/product-bom/pages/EditProduct';
import AddProduct from '../modules/product-bom/pages/AddProduct';
import ProductList from '../modules/product-bom/pages/ProductList';

// -- PLACEHOLDERS for future pages (Edit/Detail) --
// You can replace these with: import ProductDetail from './pages/ProductDetail';


const ProductRoutes = () => {
  return (
    <Routes>
      {/* path="/" here matches the parent path "/products" 
         So this renders at: http://localhost:5173/products 
      */}
      <Route index element={<ProductList />} />
      
      {/* Matches: http://localhost:5173/products/:id (e.g., /products/101) */}
      <Route path=":id/edit" element={<EditProduct />} />

      {/* Matches: http://localhost:5173/products/edit */}
      <Route path="add" element={<AddProduct />} />
    </Routes>
  );
};

export default ProductRoutes;