// src/modules/Inventory/InventoryRoutes.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';

// Page imports
// Make sure these paths match exactly where your files are located



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


      {/* 3. (Optional) The Edit Route
        Matches: /inventory/:id/edit
        The :id is a dynamic parameter you can grab inside the component using useParams()
      */}
      {/* <Route path=":id/edit" element={<EditInventory />} /> */}

    </Routes>
  );
};

export default InventoryRoutes;