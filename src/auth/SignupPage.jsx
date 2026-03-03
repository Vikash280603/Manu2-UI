// src/auth/SignupPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  IconButton,
  InputAdornment,
  CircularProgress
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { roles } from "./roles";
import { signup } from "./authApi";
 
// -------------------- EMAIL VALIDATION --------------------
// Email must be in valid format: user@domain.extension
// Checks for:
// - Valid characters before @
// - @ symbol present
// - Valid domain name
// - Valid extension (at least 2 characters)
const EMAIL_REGEX = /^[a-zA-Z0-9._%-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
 
// -------------------- PASSWORD VALIDATION --------------------
// Password must meet these criteria:
// - At least 8 characters long
// - At least one uppercase letter (A-Z)
// - At least one lowercase letter (a-z)
// - At least one digit (0-9)
// - At least one special character (!@#$%^&*(),.?":{}|<>)
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;
 
const PASSWORD_REQUIREMENTS = [
  "At least 8 characters",
  "One uppercase letter",
  "One lowercase letter",
  "One number",
  "One special character (!@#$%^&* etc.)"
];

//--------------------Name Validation--------------------
// Name must be at least 2 characters long and contain only letters and spaces
const NAME_REGEX = /^[a-zA-Z\s]{2,}$/;

function SignupPage() {
  const navigate = useNavigate();
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
 
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
 
  // -------------------- VALIDATION STATE --------------------
  // Track validation errors separately for better UX
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [nameError, setNameError] = useState("");
 
  // -------------------- VALIDATE EMAIL --------------------
  const validateEmail = (emailValue) => {
    if (!emailValue) {
      return "Email is required";
    }
    
    if (!EMAIL_REGEX.test(emailValue)) {
      return "Please enter a valid email address";
    }
    
    return "";
  };
 
  // -------------------- VALIDATE PASSWORD --------------------
  const validatePassword = (pwd) => {
    if (!pwd) {
      return "Password is required";
    }
    
    if (!PASSWORD_REGEX.test(pwd)) {
      return "Password does not meet requirements";
    }
    
    return "";
  };

  //---------------------- VALIDATE NAME --------------------
  const validateName = (nameValue) => {
    if (!nameValue) {
      return "Name is required";
    }
    if (!NAME_REGEX.test(nameValue)) {
      return "Name must be at least 2 characters and contain only letters and spaces";
    }

    return "";
  };

 
  // -------------------- HANDLE NAME CHANGE --------------------
  const handleNameChange = (e) => {
    setName(e.target.value);
    const nameErr = validateName(e.target.value);
    setNameError(nameErr);
  };

  // -------------------- HANDLE EMAIL CHANGE --------------------
  // Clear email error when user starts typing
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    const emailErr= validateEmail(e.target.value);
    setEmailError(emailErr);
  };
 
  // -------------------- HANDLE PASSWORD CHANGE --------------------
  // Clear password error when user starts typing
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    const passwordErr = validatePassword(e.target.value);
    setPasswordError(passwordErr);
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError(""); // Clear previous errors

    if (emailError || passwordError || nameError) {
      setLoading(false);
      return;
    }

    setLoading(true); // Show loading spinner

    try {
      // Call the backend API
      await signup({name, email, password, role});
      
      // Show success message
      setSuccess("Account created! Redirecting to login...");
      
      // Redirect to login page after 1.5 seconds
      setTimeout(() => navigate("/login"), 1500);
    } catch (err) {
      setError(err.message);
      setLoading(false); // Hide loading spinner on error
    }
  };
 
  return (
    <Container
      maxWidth="xs"
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center"
      }}
    >
      <Box
        sx={{
          p: 4,
          borderRadius: 3,
          boxShadow: 3,
          bgcolor: "white"
        }}
      >
        <Typography
          variant="h4"
          align="center"
          gutterBottom
          sx={{ fontWeight: 700, color: "#1976d2" }}
        >
          Sign Up
        </Typography>
 
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}
 
        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}
 
        <form onSubmit={handleSignup}>
          <TextField
            label="Name"
            fullWidth
            required
            margin="normal"
            value={name}
            onChange={handleNameChange}
            disabled={loading}
            error={!!nameError}
            helperText={nameError}
          />
 
          {/* -------------------- EMAIL FIELD WITH VALIDATION -------------------- */}
            <TextField
              label="Email"
              type="email"
              fullWidth
              required
              margin="normal"
              value={email}
              autoComplete="username"
              onChange={handleEmailChange}
              disabled={loading}
              error={!!emailError}
              helperText={emailError || "Example: user@example.com"}
            />
 
          {/* -------------------- PASSWORD FIELD WITH VALIDATION -------------------- */}
            <TextField
              label="Password"
              type={showPassword ? "text" : "password"}
              fullWidth
              required
              margin="normal"
              value={password}
              autoComplete="new-password"
              onChange={handlePasswordChange}
              disabled={loading}
              error={!!passwordError}
              helperText={passwordError}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPassword(!showPassword)}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />

            {/* -------------------- PASSWORD REQUIREMENTS DISPLAY -------------------- */}
            {/* Show requirements when password field is focused or has error */}
            {(password || passwordError) && (
              <Box sx={{ mt: 1, mb: 2, p: 2, bgcolor: "#f5f5f5", borderRadius: 2 }}>
                <Typography variant="caption" sx={{ fontWeight: 600, display: "block", mb: 1 }}>
                  Password Requirements:
                </Typography>
                {PASSWORD_REQUIREMENTS.map((req, index) => (
                  <Typography
                    key={index}
                    variant="caption"
                    sx={{ display: "block", color: "text.secondary" }}
                  >
                    • {req}
                  </Typography>
                ))}
              </Box>
            )}
 
          <FormControl fullWidth required margin="normal" sx={{ mt: 2 }}>
            <InputLabel>Role</InputLabel>
            <Select
              label="Role"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              disabled={loading}
            >
              {roles.map(role => (
                <MenuItem key={role.value} value={role.value}>
                  {role.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
 
          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            size="large"
            disabled={loading}
            sx={{ mt: 2, fontWeight: 600 }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "Sign Up"}
          </Button>
 
          <Box sx={{ mt: 2, textAlign: "center" }}>
            <Typography variant="body2">
              Already have an account?{" "}
              <Button
                variant="text"
                color="primary"
                onClick={() => navigate("/login")}
                disabled={loading}
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
 
export default SignupPage;