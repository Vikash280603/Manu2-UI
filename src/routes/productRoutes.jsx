// src/modules/product-bom/ProductRoutes.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Page imports
import EditProduct from '../modules/product-bom/pages/EditProduct';
import AddProduct from '../modules/product-bom/pages/AddProduct';
import ProductList from '../modules/product-bom/pages/ProductList';
import EditBOM from '../modules/product-bom/pages/EditBOM'; // Import EditBOM page

const ProductRoutes = () => {
  return (
    <Routes>
      {/* Matches: /products */}
      <Route index element={<ProductList />} />

      {/* Matches: /products/:id/edit */}
      <Route path=":id/edit" element={<EditProduct />} />

      {/* Matches: /products/:id/edit-bom */}
      <Route path=":id/edit-bom" element={<EditBOM />} />

      {/* Matches: /products/add */}
      <Route path="add" element={<AddProduct />} />
    </Routes>
  );
};

export default ProductRoutes;