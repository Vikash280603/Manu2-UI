// This file defines a ROUTE GUARD component.
// Purpose of ProtectedRoute:
// 1. Prevent unauthenticated users from accessing private pages
// 2. Redirect users to the Login page if they are not logged in
// 3. Allow access ONLY when a valid user session exists
import { Navigate } from 'react-router-dom';


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
  // Retrieve the logged-in user from localStorage
  // localStorage stores data as STRING, so we use JSON.parse
  // If no user is found, this will return null
  const user = JSON.parse(localStorage.getItem("loggedInUser"));


  // -------------------- UNAUTHORIZED ACCESS --------------------
  // If user does NOT exist:
  // - Redirect immediately to /login
  // - replace={true} prevents user from going back using browser back button
  if (!user) {
    return <Navigate to="/login" replace />;
  }


  // -------------------- AUTHORIZED ACCESS --------------------
  // If user exists:
  // - Render the protected component(s)
  // - `children` represents whatever is wrapped inside ProtectedRoute
  return children;
};


// Export so it can be used in App.jsx routing
export default ProtectedRoute;
