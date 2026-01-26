// src/auth/SignupPage.jsx
// This file defines the SIGN UP (REGISTRATION) page.
// Purpose of this page:
// 1. Collect new user details (name, email, password, role)
// 2. Perform basic validation on input
// 4. Store user data (demo using localStorage)
// 5. Redirect user to Login after successful signup

// -------------------- IMPORTS --------------------

import React, { useState } from "react";

// useNavigate allows navigation without page reload
import { useNavigate } from "react-router-dom";

// Material UI components for layout, forms, and feedback
import {
  Container,      // Centers the form on the page
  Typography,     // Text (headings, labels)
  TextField,      // Input fields
  Button,         // Action buttons
  Box,            // Layout wrapper
  Alert,          // Success / error messages
  FormControl,    // Wrapper for Select input
  InputLabel,     // Label for Select
  Select,         // Dropdown input
  MenuItem,       // Dropdown options
  IconButton,     // Button for icons
  InputAdornment  // Allows icons inside inputs
} from "@mui/material";

// Icons used to toggle password visibility
import { Visibility, VisibilityOff } from "@mui/icons-material";

// Centralized role definitions (used to populate dropdown)
import { roles } from "./roles";

// Fake users used for demo validation
// This simulates existing users from a backend
import { users } from "./fakeUsers";


// -------------------- SIGNUP PAGE COMPONENT --------------------
function SignupPage() {

  // Used to redirect user after successful signup
  const navigate = useNavigate();

  // -------------------- FORM STATE --------------------
  // Single object to store all input values
  const [form, setForm] = useState({
    name: "",      // User's full name
    email: "",     // Login email
    password: "",  // Plain password (demo only)
    role: ""       // Selected user role
  });

  // UI state variables
  const [showPassword, setShowPassword] = useState(false); // Toggle password visibility
  const [error, setError] = useState("");                 // Error message
  const [success, setSuccess] = useState("");             // Success message


  // -------------------- SIGNUP HANDLER --------------------
  // This function runs when the form is submitted
  const handleSignup = (e) => {

    // Prevent browser refresh on form submit
    e.preventDefault();

    // Reset messages
    setError("");
    setSuccess("");

    // -------------------- VALIDATION --------------------
    // Check if any field is empty
    if (!form.name || !form.email || !form.password || !form.role) {
      setError("Please fill in all fields.");
      return;
    }

    // -------------------- DUPLICATE USER CHECK --------------------
    // Get users already stored in localStorage
    // OR fallback to an empty array
    const storedUsers = JSON.parse(localStorage.getItem("allUsers") || "[]");

    // Combine stored users with fake users
    // This simulates a single database
    const allUsers = [...storedUsers, ...users];

    // Check if email already exists (case-insensitive)
    if (allUsers.some(u => u.email.toLowerCase() === form.email.trim().toLowerCase())) {
      setError("Email is already registered.");
      return;
    }

    // -------------------- SAVE NEW USER --------------------
    // Create new user object
    const newUser = { ...form };

    // Add new user to stored users
    const updatedUsers = [...storedUsers, newUser];

    // Save updated list back to localStorage
    // NOTE: This is ONLY for demo purposes
    localStorage.setItem("allUsers", JSON.stringify(updatedUsers));

    // Show success message
    setSuccess("Account created! You can now login.");

    // Redirect to login page after short delay
    setTimeout(() => {
      navigate("/login");
    }, 1500);
  };


  // -------------------- UI RENDER --------------------
  return (
    // Container centers the signup card on screen
    <Container
      maxWidth="xs"
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center"
      }}
    >

      {/* Signup Card */}
      <Box
        sx={{
          p: 4,
          borderRadius: 3,
          boxShadow: 3,
          bgcolor: "white"
        }}
      >

        {/* Page Title */}
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          sx={{ fontWeight: 700, color: "#1976d2" }}
        >
          Sign Up
        </Typography>

        {/* Error Message */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Success Message */}
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        {/* -------------------- SIGNUP FORM -------------------- */}
        <form onSubmit={handleSignup}>

          {/* Name Input */}
          <TextField
            label="Name"
            fullWidth
            required
            margin="normal"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />

          {/* Email Input */}
          <TextField
            label="Email"
            type="email"
            fullWidth
            required
            margin="normal"
            value={form.email}
            autoComplete="username"
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />

          {/* Password Input */}
          <TextField
            label="Password"
            type={showPassword ? "text" : "password"}
            fullWidth
            required
            margin="normal"
            value={form.password}
            autoComplete="new-password"
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              )
            }}
          />

          {/* Role Selection Dropdown */}
          <FormControl fullWidth required margin="normal" sx={{ mt: 2 }}>
            <InputLabel>Role</InputLabel>
            <Select
              label="Role"
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              {roles.map(role => (
                <MenuItem key={role.value} value={role.value}>
                  {role.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          {/* Submit Button */}
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            sx={{ mt: 2, fontWeight: 600 }}
          >
            Sign Up
          </Button>

          {/* Login Redirect */}
          <Box sx={{ mt: 2, textAlign: "center" }}>
            <Typography variant="body2">
              Already have an account?{" "}
              <Button
                variant="text"
                color="primary"
                onClick={() => navigate("/login")}
                sx={{ textTransform: "none", fontWeight: 600, fontSize: "1rem" }}
              >
                Log In
              </Button>
            </Typography>
          </Box>

        </form>
      </Box>
    </Container>
  );
}

// Export so it can be used in App.jsx routing
export default SignupPage;
