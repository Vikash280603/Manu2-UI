// App.jsx
// This file is the ROOT component of the React application.
// Its main responsibility is to:
// 1. Setup routing (URL -> Page mapping)
// 2. Protect private routes (pages that require login)

// -------------------- IMPORTS --------------------

// BrowserRouter provides routing capability to the app
// We rename it as `Router` just for cleaner JSX usage
import { BrowserRouter as Router, Routes, Route , Navigate} from "react-router-dom";
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

import { getCurrentUser } from './auth/authApi';
import { getUserHomePage, ROUTE_PERMISSIONS } from './auth/roleConfig';


// -------------------- HOME REDIRECT --------------------
// If user is logged in -> redirect to their role-based home page
// If user is NOT logged in -> show HomePage (welcome/intro page)
const HomeRedirect = () => {
  const user = getCurrentUser();
  
  // Logged in users should go to their dashboard
  if (user?.token) {
    return <Navigate to={getUserHomePage(user.role)} replace />;
  }
  
  // Not logged in -> show the welcome/intro HomePage
  return <HomePage />;
};
 
// -------------------- AUTH REDIRECT --------------------
// Prevents logged-in users from accessing login/signup pages
// If already logged in -> redirect to their home page
// If not logged in -> show the requested page (login/signup)
const AuthRedirect = ({ children }) => {
  const user = getCurrentUser();
  
  if (user?.token) {
    return <Navigate to={getUserHomePage(user.role)} replace />;
  }
  
  return children;
};

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
        {/* Home Page - Shows intro/welcome if not logged in, redirects if logged in */}
        <Route path="/" element={<HomeRedirect />} />

        {/* Login page -> http://localhost:5173/login */}
         {/* Login Page - Redirects to dashboard if already logged in */}
        <Route path="/login" element={
          <AuthRedirect>
             <LoginPage />
          </AuthRedirect>
        } />

        {/* Signup page -> http://localhost:5173/signup */}
        {/* Signup Page - Redirects to dashboard if already logged in */}
        <Route path="/signup" element={
          <AuthRedirect>
            <SignupPage />
          </AuthRedirect>
        } />


        {/* ----------- PROTECTED ROUTES ----------- */}
        {/* These routes require the user to be logged in */}
        {/* ProtectedRoute acts like a security guard */}

        {/* Products Module - Admin and Product BOM Managers */}
        <Route path="/products/*" element={
          <ProtectedRoute allowedRoles={ROUTE_PERMISSIONS["/products"]}>
            <ProductRoutes />
          </ProtectedRoute>
        } />

        {/* Inventory Module - Admin and Inventory Managers */}
        <Route path="/inventory/*" element={
          <ProtectedRoute allowedRoles={ROUTE_PERMISSIONS["/inventory"]}>
            <InventoryRoutes />
          </ProtectedRoute>
        } />

        {/* Work Orders Module - Admin and Production Schedulers */}
        <Route path="/workorder/*" element={
          <ProtectedRoute allowedRoles={ROUTE_PERMISSIONS["/workorder"]}>
            <WorkOrderRoutes />
          </ProtectedRoute>
        } />

        {/* Quality Module - Admin and QC Managers */}
        <Route path="/quality/*" element={
          <ProtectedRoute allowedRoles={ROUTE_PERMISSIONS["/quality"]}>
            <QualityRoutes />
          </ProtectedRoute>
        } />

         {/* Analytics Module - Admin and Dashboard Users */}
        <Route path="/analytics/*" element={
          <ProtectedRoute allowedRoles={ROUTE_PERMISSIONS["/analytics"]}>
            <AnalyticsRoutes />
          </ProtectedRoute>
        } />

        {/* -------------------- CATCH ALL -------------------- */}
        {/* Any unknown route redirects to home (which will show HomePage or user dashboard) */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </Router>
  );
}

// Export App so it can be used in main.jsx
export default App;
