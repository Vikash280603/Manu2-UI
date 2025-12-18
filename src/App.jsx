import { useState } from 'react'
// FIX 1: Correct spelling (BrowserRouter) and match the alias (as Router)
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import './App.css'

import HomePage from './HomePage';
import LoginPage from './auth/LoginPage';
import SignupPage from './auth/SignupPage';

import AddProduct from './modules/product-bom/pages/AddProduct';

import Inventory from './modules/Inventory/Pages/InventoryList';
import WorkOrderList from './modules/ProductionScheduling/WorkOrderList';
import QualityCheckList from './modules/QualityControl/QualityCheckList';
import ProtectedRoute from './auth/ProtectedRoutes';
import ProductRoutes from './routes/productRoutes';





function App() {

  return (
    // FIX 2: Now this matches the import name "Router"
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} /> 
        <Route path="/inventory" element={<Inventory/>}/>
        <Route path="/productionscheduling" element={<WorkOrderList/>}/>
        <Route path="/quality-checks" element={<QualityCheckList/>}/>

        <Route path="/products/*" element={<ProtectedRoute>
              <ProductRoutes />
            </ProtectedRoute>

        }/>
      </Routes>

    </Router>
  )
}

export default App