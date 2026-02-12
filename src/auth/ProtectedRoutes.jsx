// src/auth/ProtectedRoutes.jsx
// This file defines a ROUTE GUARD component with JWT validation.
// Purpose of ProtectedRoute:
// 1. Prevent unauthenticated users from accessing private pages
// 2. Check if JWT token is valid and not expired
// 3. Redirect to Login if token is missing or expired
// 4. Allow access ONLY when a valid user session exists
 
import { Navigate } from 'react-router-dom';
import { getCurrentUser, isTokenExpired, logout } from './authApi';
 
// -------------------- PROTECTED ROUTE COMPONENT --------------------
// ProtectedRoute is a WRAPPER component
// It wraps around pages/components that should be protected
//
// Example usage:
// <ProtectedRoute>
//   <Dashboard />
// </ProtectedRoute>
 
const ProtectedRoute = ({ children }) => {
 
  // -------------------- AUTH CHECK --------------------
  // Retrieve the logged-in user from localStorage using our helper function
  const user = getCurrentUser();
 
  // -------------------- UNAUTHORIZED ACCESS (NO USER) --------------------
  // If user does NOT exist:
  // - Redirect immediately to /login
  // - replace={true} prevents user from going back using browser back button
  if (!user || !user.token) {
    return <Navigate to="/login" replace />;
  }
 
  // -------------------- TOKEN EXPIRATION CHECK --------------------
  // Check if the JWT token is expired
  // If expired:
  // - Clear localStorage
  // - Redirect to login
  if (isTokenExpired(user.token)) {
    logout(); // Clear localStorage
    return <Navigate to="/login" replace />;
  }
 
  // -------------------- AUTHORIZED ACCESS --------------------
  // If user exists AND token is valid:
  // - Render the protected component(s)
  // - `children` represents whatever is wrapped inside ProtectedRoute
  return children;
};
 
// Export so it can be used in App.jsx routing
export default ProtectedRoute;