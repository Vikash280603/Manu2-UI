import { useState } from 'react'
// FIX 1: Correct spelling (BrowserRouter) and match the alias (as Router)
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css'

import HomePage from './HomePage';
import LoginPage from './auth/LoginPage';
import SignupPage from './auth/SignupPage';

// import AddProduct from './modules/product-bom/pages/AddProduct';

// import Inventory from './modules/Inventory/Pages/InventoryList';

// import QualityCheckList from './modules/QualityControl/QualityCheckList';
import ProtectedRoute from './auth/ProtectedRoutes';
import ProductRoutes from './routes/productRoutes';
// import InventoryList from './modules/Inventory/Pages/InventoryList';
import InventoryRoutes from './routes/inventoryRoutes';
import WorkOrderRoutes from './routes/workOrderRoutes';
import WorkOrderList from './modules/ProductionScheduling/pages/WorkOrderList';
import QualityRoutes from './routes/QualityRoutes';
import AnalyticsRoutes from './routes/AnalyticRoutes';
// import WorkOrderList from './modules/ProductionScheduling/pages/WorkOrderList';





function App() {

  return (
    // FIX 2: Now this matches the import name "Router"
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />         
      {/* Product Routes */}
        <Route path="/products/*" element={
          <ProtectedRoute>
            <ProductRoutes />
          </ProtectedRoute>
        }/>
        {/* Inventory Routes */}
         <Route path="/inventory/*" element={
          <ProtectedRoute>
            <InventoryRoutes/>
          </ProtectedRoute>
        }/>

        {/* Work Order Routes */} 
         <Route path="/workorder/*" element={
          <ProtectedRoute>
            <WorkOrderRoutes/>
          </ProtectedRoute>
        }/>

        {/* Quality Check Routes */} 
         <Route path="/Quality/*" element={
          <ProtectedRoute>
            <QualityRoutes/>
          </ProtectedRoute>
        }/>

        {/* Analytics*/} 
         <Route path="/Analytics/*" element={
          <ProtectedRoute>
            <AnalyticsRoutes/>
          </ProtectedRoute>
        }/>


        
      </Routes>

    </Router>
  )
}

export default App