// src/modules/Inventory/InventoryRoutes.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Page imports
// Make sure these paths match exactly where your files are located


import AddInventory from '../modules/Inventory/Pages/AddInventory'; 
import InventoryList from '../modules/Inventory/Pages/InventoryList';
// import EditInventory from '../modules/Inventory/Pages/EditInventory'; // Uncomment if you create this later

const InventoryRoutes = () => {
  return (
    // We only use <Routes> here. The main <BrowserRouter> should only exist once in App.js
    <Routes>
      
      {/* 1. The Index Route 
        Matches the base parent path (e.g., /inventory).
        Using 'index' tells React: "If there is no extra path, show this."
      */}
      <Route index element={<InventoryList />} />

      {/* 2. The Add Route
        Matches: /inventory/add
        Notice we use "add", not "/add". 
        In nested routes, we don't use the leading slash so it stays relative to the parent.
      */}
      <Route path="add" element={<AddInventory />} />

      {/* 3. (Optional) The Edit Route
        Matches: /inventory/:id/edit
        The :id is a dynamic parameter you can grab inside the component using useParams()
      */}
      {/* <Route path=":id/edit" element={<EditInventory />} /> */}

    </Routes>
  );
};

export default InventoryRoutes;