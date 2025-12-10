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
  InputAdornment
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { roles } from "./roles";
import { users } from "./fakeUsers"; // import hardcoded user array

function SignupPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: ""
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Simulate save to "database"
  const handleSignup = (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    // Validation: all fields required
    if (!form.name || !form.email || !form.password || !form.role) {
      setError("Please fill in all fields.");
      return;
    }
    // Check if user already exists
    const allUsers = JSON.parse(localStorage.getItem("allUsers") || "[]").concat(users);
    if (allUsers.some(u => u.email === form.email.trim())) {
      setError("Email is already registered.");
      return;
    }

    // Save new user to localStorage
    const newUser = { ...form };
    const updatedUsers = [...allUsers, newUser];
    localStorage.setItem("allUsers", JSON.stringify(updatedUsers));

    setSuccess("Account created! You can now login.");
    // Optionally, redirect to login after a short delay:
    setTimeout(() => {
      navigate("/login");
    }, 1500);
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
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <TextField
            label="Email"
            type="email"
            fullWidth
            required
            margin="normal"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            autoComplete="username"
          />
          <TextField
            label="Password"
            type={showPassword ? "text" : "password"}
            fullWidth
            required
            margin="normal"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            autoComplete="new-password"
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
          <FormControl
            fullWidth
            required
            margin="normal"
            sx={{ mt: 2 }}
          >
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

          <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2, fontWeight: 600 }}
            size="large"
          >
            Sign Up
          </Button>
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

export default SignupPage;