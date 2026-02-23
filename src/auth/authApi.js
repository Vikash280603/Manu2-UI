  // src/auth/authApi.js
// This file handles ALL API calls to the ASP.NET backend
// Uses axios for cleaner error handling and automatic JSON parsing
// Includes JWT token management, decoding, expiration checking
 
import axios from "axios";
import { jwtDecode } from "jwt-decode";
 
// -------------------- BASE URL --------------------
// Change this to match your backend port (check your backend terminal)
// Common ports: 5000, 5208, 7000, 7095
const API_BASE = "http://localhost:5134/api";
 
// Create axios instance with default settings
const api = axios.create({
  baseURL: API_BASE,
  headers: {
    "Content-Type": "application/json",
  },
});
 
// -------------------- LOGIN --------------------
// Calls: POST /api/auth/login
// Backend expects: { email, password }
// Backend returns: { token, name, email, role }
export const login = async ({ email, password }) => {
  try {
    const response = await api.post("/auth/login", { email, password });
    
    // response.data contains { token, name, email, role }
    return response.data;
  } catch (error) {
    // Extract error message from backend response
    const message = error.response?.data?.message || "Login failed. Please check your credentials.";
    throw new Error(message);
  }
};
 
// -------------------- SIGNUP --------------------
// Calls: POST /api/auth/signup
// Backend expects: { name, email, password, role }
// Backend returns: { token, name, email, role }
export const signup = async ({ name, email, password, role }) => {
  try {
    const response = await api.post("/auth/signup", { name, email, password, role });
    
    // Return the full response
    return response.data;
  } catch (error) {
    // Extract error message from backend
    const message = error.response?.data?.message || "Signup failed. Please try again.";
    throw new Error(message);
  }
};
 
// -------------------- GET CURRENT USER --------------------
// Retrieves user data from localStorage
export const getCurrentUser = () => {
  const user = localStorage.getItem("loggedInUser");
  if (!user) return null;
  
  try {
    return JSON.parse(user);
  } catch (err) {
    console.error("Failed to parse user from localStorage", err);
    return null;
  }
};
 
// -------------------- DECODE JWT TOKEN --------------------
// Extracts claims (user info) from the JWT token
// Returns: { nameid, email, unique_name, role, exp, iss, aud }
export const decodeToken = (token) => {
  try {
    return jwtDecode(token);
  } catch (err) {
    console.error("Failed to decode token", err);
    return null;
  }
};
 
// -------------------- CHECK TOKEN EXPIRATION --------------------
// Returns true if token is expired, false otherwise
export const isTokenExpired = (token) => {
  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000; // Convert to seconds
    return decoded.exp < currentTime;
  } catch (err) {
    console.error("Failed to check token expiration", err);
    return true; // If decode fails, consider it expired
  }
};
 
// -------------------- LOGOUT --------------------
// Clears user data from localStorage
export const logout = () => {
  localStorage.removeItem("loggedInUser");
};
 
// -------------------- AXIOS REQUEST INTERCEPTOR --------------------
// This automatically adds the JWT token to EVERY request
// So when you build Products/Inventory pages, the token is always sent
api.interceptors.request.use(
  (config) => {
    const user = localStorage.getItem("loggedInUser");
    if (user) {
      try {
        const parsed = JSON.parse(user);
        if (parsed.token) {
          // Check if token is expired before sending
          if (isTokenExpired(parsed.token)) {
            logout();
            window.location.href = "/login";
            return Promise.reject(new Error("Token expired. Please login again."));
          }
          
          // Add token to Authorization header
          config.headers.Authorization = `Bearer ${parsed.token}`;
        }
      } catch (err) {
        console.error("Failed to parse user from localStorage", err);
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
 
// -------------------- AXIOS RESPONSE INTERCEPTOR --------------------
// This handles 401 Unauthorized responses (expired/invalid token)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token is invalid or expired
      logout();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
 
// Export the configured axios instance for use in other modules
export default api;