// src/HomePage.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { 
  Box, 
  Typography, 
  Button, 
  AppBar, 
  Toolbar, 
  Container, 
  Stack 
} from "@mui/material";
import FactoryIcon from '@mui/icons-material/Factory'; // Optional: Adds a nice icon

function HomePage() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f5f6fa 0%, #e1eafc 100%)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* 1. Navigation Bar (Top Header) */}
      <AppBar position="static" color="transparent" elevation={0} sx={{ pt: 1 }}>
        <Toolbar>
          {/* Logo / Brand Name Area */}
          <FactoryIcon sx={{ mr: 1, color: "#1976d2" }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, color: "#333", fontWeight: 'bold' }}>
            ManuTrack
          </Typography>
          
          {/* Top Right Login Button */}
          <Button color="primary" onClick={() => navigate("/login")}>
            Login
          </Button>
        </Toolbar>
      </AppBar>

      {/* 2. Main Hero Content (Centered) */}
      <Container maxWidth="md" sx={{ flexGrow: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Box sx={{ textAlign: "center", py: 8 }}>
          
          {/* Main Headline */}
          <Typography
            variant="h2"
            component="h1"
            sx={{
              fontWeight: 800,
              color: "#1a202c",
              mb: 2,
              letterSpacing: "-0.5px"
            }}
          >
            Smart Manufacturing <br />
            <span style={{ color: "#1976d2" }}>Made Simple</span>
          </Typography>

          {/* Subtitle */}
          <Typography
            variant="h5"
            color="text.secondary"
            sx={{ mb: 5, maxWidth: "600px", mx: "auto", lineHeight: 1.6 }}
          >
            Streamline your production, manage inventory, and track quality in one unified dashboard.
          </Typography>

          {/* Action Buttons */}
          <Stack 
            direction="row" 
            spacing={2} 
            justifyContent="center"
          >
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate("/login")}
              sx={{ px: 4, py: 1.5, fontSize: "1.1rem", borderRadius: "8px" }}
            >
              Get Started
            </Button>
            <Button
              variant="outlined"
              size="large"
              onClick={() => navigate("/signup")}
              sx={{ px: 4, py: 1.5, fontSize: "1.1rem", borderRadius: "8px" }}
            >
              Create Account
            </Button>
          </Stack>

        </Box>
      </Container>
    </Box>
  );
}

export default HomePage;