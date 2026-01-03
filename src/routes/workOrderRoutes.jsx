// src/modules/product-bom/ProductRoutes.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import WorkOrderList from '../modules/ProductionScheduling/pages/WorkOrderList';
import CreateWorkOrder from '../modules/ProductionScheduling/pages/CreateWorkOrder';



const WorkOrderRoutes = () => {
  return (
    <Routes>
      {/* Matches: /workorder */}
      <Route index element={<WorkOrderList/>} />

      {/* Matches: /workorder/create */}
      <Route path="create" element={<CreateWorkOrder/>} />
    </Routes>
  );
};

export default WorkOrderRoutes;