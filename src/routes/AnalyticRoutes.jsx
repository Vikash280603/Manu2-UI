// src/modules/product-bom/ProductRoutes.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AnalyticsDashboard from '../modules/Analytics/pages/AnalyticsDashboard';
import ReportList from '../modules/Analytics/pages/ReportList';



const AnalyticsRoutes = () => {
  return (
    <Routes>
      {/* Matches: /workorder */}
      <Route index element={<AnalyticsDashboard/>} />

      {/* Matches: /workorder/create */}
      <Route path="report" element={<ReportList/>} />
    </Routes>
  );
};

export default AnalyticsRoutes;