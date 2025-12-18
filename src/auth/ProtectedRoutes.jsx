import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  // 1. Retrieve the user from local storage
  const user = JSON.parse(localStorage.getItem("loggedInUser"));

  // 2. If no user exists, redirect immediately to Login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 3. If user exists, render the protected component
  return children;
};

export default ProtectedRoute;