// App.jsx
// This file is the ROOT component of the React application.
// Its main responsibility is to:
// 1. Setup routing (URL -> Page mapping)
// 2. Protect private routes (pages that require login)

// -------------------- IMPORTS --------------------

// BrowserRouter provides routing capability to the app
// We rename it as `Router` just for cleaner JSX usage
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import { Toaster } from 'react-hot-toast';

// -------------------- PUBLIC PAGES --------------------
// These pages can be accessed without login
import HomePage from './HomePage';
import LoginPage from './auth/LoginPage';
import SignupPage from './auth/SignupPage';

// -------------------- AUTH & ROUTE GUARDS --------------------
// ProtectedRoute is a wrapper component
// It checks whether the user is authenticated
// If NOT logged in -> redirect to login page
// If logged in -> allow access to the requested route
import ProtectedRoute from './auth/ProtectedRoutes';

// -------------------- FEATURE ROUTES --------------------
// Each module has its own route file
// This keeps App.jsx clean and scalable
import ProductRoutes from './routes/productRoutes';
import InventoryRoutes from './routes/inventoryRoutes';
import WorkOrderRoutes from './routes/workOrderRoutes';
import QualityRoutes from './routes/QualityRoutes';
import AnalyticsRoutes from './routes/AnalyticRoutes';


// -------------------- APP COMPONENT --------------------
// This is a FUNCTIONAL COMPONENT
// Functional components are simple JavaScript functions
// that return JSX (HTML-like syntax)
function App() {

  return (
    // Router must wrap the entire app
    // It listens to URL changes and renders matching routes
    <Router>
      

      {/* Routes acts as a container for all Route components */}
      <Routes>

        {/* ----------- PUBLIC ROUTES ----------- */}
        {/* These routes do NOT require authentication */}

        {/* Home page -> http://localhost:5173/ */}
        <Route path="/" element={<HomePage />} />

        {/* Login page -> http://localhost:5173/login */}
        <Route path="/login" element={<LoginPage />} />

        {/* Signup page -> http://localhost:5173/signup */}
        <Route path="/signup" element={<SignupPage />} />


        {/* ----------- PROTECTED ROUTES ----------- */}
        {/* These routes require the user to be logged in */}
        {/* ProtectedRoute acts like a security guard */}

        {/* Product Module */}
        <Route
          path="/products/*"
          element={
            <ProtectedRoute>
              <ProductRoutes />
            </ProtectedRoute>
          }
        />

        {/* Inventory Module */}
        <Route
          path="/inventory/*"
          element={
            <ProtectedRoute>
              <InventoryRoutes />
            </ProtectedRoute>
          }
        />

        {/* Work Order Module */}
        <Route
          path="/workorder/*"
          element={
            <ProtectedRoute>
              <WorkOrderRoutes />
            </ProtectedRoute>
          }
        />

        {/* Quality Control Module */}
        <Route
          path="/quality/*"
          element={
            <ProtectedRoute>
              <QualityRoutes />
            </ProtectedRoute>
          }
        />

        {/* Analytics Module */}
        <Route
          path="/analytics/*"
          element={
            <ProtectedRoute>
              <AnalyticsRoutes />
            </ProtectedRoute>
          }
        />

      </Routes>
    </Router>
  );
}

// Export App so it can be used in main.jsx
export default App;
