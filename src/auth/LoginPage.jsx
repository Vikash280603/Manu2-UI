// src/auth/LoginPage.jsx
// This file defines the LOGIN PAGE of the application.
// Purpose of this page:
// 1. Collect user credentials (email + password)
// 2. Validate the user (demo using fake users)
// 3. Save login state
// 4. Redirect user based on their role

// -------------------- IMPORTS --------------------

// React and useState hook
// useState allows us to store and update component-level data
import React, { useState } from "react";

// useNavigate is used for programmatic navigation
// Example: navigate("/products") redirects the user
import { useNavigate } from "react-router-dom";

// Material UI components for layout, forms, and feedback
import {
  Container,     // Centers content and limits width
  Typography,    // Displays text (headings, paragraphs)
  TextField,     // Input fields (email, password)
  Button,        // Clickable button
  Box,           // Flexible layout container
  Alert,         // Error / warning messages
  InputAdornment,// Allows icons inside input fields
  IconButton     // Clickable icon button
} from "@mui/material";

// Icons used for password visibility toggle
import { Visibility, VisibilityOff } from "@mui/icons-material";

// Fake user data (used ONLY for demo/testing purposes)
// In real applications, this comes from a backend API
import { users } from "./fakeUsers";


// -------------------- ROLE BASED REDIRECTION --------------------
// Maps user roles to their landing pages
// After login, user is redirected based on role
const roleRedirects = {
  product_bom_manager: "/products",
  inventory_manager: "/inventory",
  qc_manager: "/quality",
  dashboard_user: "/dashboard",
  admin: "/analytics",
  production_scheduler: "/workorder"
};


// -------------------- LOGIN PAGE COMPONENT --------------------
function LoginPage() {

  // navigate() lets us redirect the user after login
  const navigate = useNavigate();

  // -------------------- STATE VARIABLES --------------------
  // These store user input and UI state

  const [email, setEmail] = useState("");        // Stores email input
  const [password, setPassword] = useState("");  // Stores password input
  const [error, setError] = useState("");        // Stores error message
  const [showPassword, setShowPassword] = useState(false); // Toggles password visibility


  // -------------------- LOGIN HANDLER --------------------
  // This function runs when the form is submitted
  const handleLogin = (e) => {

    // Prevents browser page reload (default form behavior)
    e.preventDefault();

    // Clear any previous error
    setError("");

    // -------------------- USER VALIDATION --------------------
    // Search for a matching user in fakeUsers array
    // trim() removes accidental spaces in email input
    const localStorageUsers = JSON.parse(localStorage.getItem("allUsers")) || [];
    const combinedUsers = [...users, ...localStorageUsers];
    const user = combinedUsers.find(
      (u) => u.email === email.trim() && u.password === password
    );

    if (user) {
      // -------------------- SUCCESS CASE --------------------

      // Save logged-in user in localStorage
      localStorage.setItem("loggedInUser", JSON.stringify(user));

      // Redirect user to role-specific page
      navigate(roleRedirects[user.role] || "/");

    } else {
      // -------------------- FAILURE CASE --------------------

      // Show error message if credentials are invalid
      setError("Invalid email or password");
    }
  };


  // -------------------- UI RENDER --------------------
  return (
    // Container centers the login card on screen
    <Container
      maxWidth="xs"             // Small width layout
      sx={{
        minHeight: "100vh",     // Full screen height
        display: "flex",
        flexDirection: "column",
        justifyContent: "center" // Vertical centering
      }}
    >

      {/* Login Card */}
      <Box
        sx={{
          p: 4,                 // Padding
          borderRadius: 3,      // Rounded corners
          boxShadow: 3,         // Shadow effect
          bgcolor: "white"     // Card background
        }}
      >

        {/* Page Title */}
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          sx={{ fontWeight: 700, color: "#1976d2" }}
        >
          Login
        </Typography>

        {/* Error Message */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* -------------------- LOGIN FORM -------------------- */}
        <form onSubmit={handleLogin}>

          {/* Email Input */}
          <TextField
            label="Email"
            type="email"               // Email validation
            fullWidth
            required                    // HTML required validation
            margin="normal"
            value={email}
            autoComplete="username"    // Browser autofill hint
            onChange={(e) => setEmail(e.target.value)}
          />

          {/* Password Input */}
          <TextField
            label="Password"
            type={showPassword ? "text" : "password"} // Toggle visibility
            fullWidth
            required
            margin="normal"
            value={password}
            autoComplete="current-password"
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                    aria-label="toggle password visibility"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />

          {/* Submit Button */}
          <Button
            type="submit"              // Triggers form submit
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            sx={{ mt: 2, fontWeight: 600 }}
          >
            Log In
          </Button>

          {/* Signup Redirect */}
          <Box sx={{ mt: 2, textAlign: "center" }}>
            <Typography variant="body2">
              Don&apos;t have an account?{" "}
              <Button
                variant="text"
                color="primary"
                onClick={() => navigate("/signup")}
                sx={{ textTransform: "none", fontWeight: 600, fontSize: "1rem" }}
              >
                Sign Up
              </Button>
            </Typography>
          </Box>

        </form>
      </Box>
    </Container>
  );
}

// Export so App.jsx can use this page in routing
export default LoginPage;
