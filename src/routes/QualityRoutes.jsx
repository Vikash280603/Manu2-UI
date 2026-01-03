// src/modules/product-bom/ProductRoutes.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import QualityCheckList from '../modules/QualityControl/pages/QualityCheckList';
import QualityCreate from '../modules/QualityControl/pages/CreateQuality';



const QualityRoutes = () => {
  return (
    <Routes>
      {/* Matches: /workorder */}
      <Route index element={<QualityCheckList/>} />

      {/* Matches: /workorder/create */}
      <Route path="create/:workOrderId" element={<QualityCreate/>} />
    </Routes>
  );
};

export default QualityRoutes;