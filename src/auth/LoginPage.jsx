import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  Alert,
  InputAdornment,
  IconButton,
  CircularProgress
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { login } from "./authApi";

// Role-based redirects
const roleRedirects = {
  product_bom_manager: "/products",
  inventory_manager: "/inventory",
  qc_manager: "/quality",
  dashboard_user: "/analytics",
  admin: "/analytics",
  production_scheduler: "/workorder"
};

function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    try {
      const user = await login({ email, password });
      localStorage.setItem("loggedInUser", JSON.stringify(user));
      const redirectPath = roleRedirects[user.role] || "/";
      navigate(redirectPath);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Loading Overlay - Full Page */}
      {loading && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            bgcolor: "rgba(0, 0, 0, 0.6)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 9999,
            backdropFilter: "blur(5px)"
          }}
        >
          <Box sx={{ textAlign: "center" }}>
            <img
              src="/loading.gif"
              alt="Loading..."
              style={{
                width: "300px",
                height: "300px",
                marginBottom: "20px"
              }}
            />
            <Typography variant="h6" sx={{ color: "white", fontWeight: 600 }}>
              Logging in...
            </Typography>
          </Box>
        </Box>
      )}

      {/* Login Form */}
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
            Login
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleLogin}>
            <TextField
              label="Email"
              type="email"
              fullWidth
              required
              margin="normal"
              value={email}
              autoComplete="username"
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />

            <TextField
              label="Password"
              type={showPassword ? "text" : "password"}
              fullWidth
              required
              margin="normal"
              value={password}
              autoComplete="current-password"
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
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

            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              size="large"
              disabled={loading}
              sx={{ mt: 2, fontWeight: 600 }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : "Log In"}
            </Button>

            <Box sx={{ mt: 2, textAlign: "center" }}>
              <Typography variant="body2">
                Don&apos;t have an account?{" "}
                <Button
                  variant="text"
                  color="primary"
                  onClick={() => navigate("/signup")}
                  disabled={loading}
                  sx={{ textTransform: "none", fontWeight: 600, fontSize: "1rem" }}
                >
                  Sign Up
                </Button>
              </Typography>
            </Box>
          </form>
        </Box>
      </Container>
    </>
  );
}

export default LoginPage;