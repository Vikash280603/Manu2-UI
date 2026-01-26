// src/HomePage.jsx
// This file defines the HOME / LANDING PAGE of the application.
// Purpose of this page:
// 1. Show the brand (ManuTrack)
// 2. Explain what the app does (manufacturing management)
// 3. Guide the user to Login or Signup

// -------------------- IMPORTS --------------------

// React is required to create a React component
import React from "react";

// useNavigate is a React Router hook
// It allows us to programmatically change pages (navigation)
// Example: navigate("/login") -> redirects user to login page
import { useNavigate } from "react-router-dom";

// Material UI components used to build layout and UI
// These are pre-built, styled components
import {
  Box,        // Generic container (like a div, but powerful with styling)
  Typography,// Used for text (headings, paragraphs)
  Button,    // Clickable buttons
  AppBar,    // Top navigation bar
  Toolbar,   // Content wrapper inside AppBar
  Container, // Centers content with max-width
  Stack      // Simplifies flex layouts (row/column spacing)
} from "@mui/material";

// Icon component from Material UI Icons
// Used only for visual branding (optional but improves UI)
import FactoryIcon from '@mui/icons-material/Factory';


// -------------------- HOME PAGE COMPONENT --------------------
// Functional component = JavaScript function returning JSX
function HomePage() {

  // useNavigate returns a function
  // We store it in `navigate` to use later
  const navigate = useNavigate();

  return (
    // Box is used as the ROOT container
    // sx prop = Material UI styling system (CSS-in-JS)
    <Box
      sx={{
        // Makes the page take full screen height
        minHeight: "100vh",

        // Background gradient for modern UI look
        background: "linear-gradient(135deg, #f5f6fa 0%, #e1eafc 100%)",

        // Flexbox layout
        display: "flex",
        flexDirection: "column", // Stack elements vertically
      }}
    >

      {/* -------------------- TOP NAVIGATION BAR -------------------- */}
      {/* AppBar creates a fixed/relative top header */}
      <AppBar
        position="static"      // Stays at the top, scrolls with page
        color="transparent"    // Removes default blue background
        elevation={20}           // Add shadow for better look
        sx={{ pt: 1 }}           // Padding-top
      >
        <Toolbar>

          {/* App Icon (Branding) */}
          <FactoryIcon sx={{ mr: 1, color: "#1976d2" }} />

          {/* App Name / Logo Text */}
          <Typography
            variant="h6"       // Predefined heading style
            component="div"    // Renders as a div in HTML
            sx={{
              flexGrow: 1,       // Pushes login button to the right
              color: "#333",
              fontWeight: 'bold'
            }}
          >
            ManuTrack
          </Typography>

          {/* Login Button (Top Right) */}
          {/* onClick triggers navigation to /login */}
          <Button color="primary" onClick={() => navigate("/login")}> 
            Login
          </Button>
        </Toolbar>
      </AppBar>


      {/* -------------------- HERO SECTION -------------------- */}
      {/* Container centers content and limits width */}
      <Container
        maxWidth="md"                // Medium width layout
        sx={{
          flexGrow: 1,                // Takes remaining vertical space
          display: 'flex',
          alignItems: 'center',       // Vertical centering
          justifyContent: 'center'    // Horizontal centering
        }}
      >
        <Box sx={{ textAlign: "center", py: 8 }}>

          {/* Main Heading */}
          <Typography
            variant="h2"             // Large headline text
            component="h1"           // Semantic HTML heading
            sx={{
              fontWeight: 800,
              color: "#1a202c",
              mb: 2,                  // Margin-bottom
              letterSpacing: "-0.5px"
            }}
          >
            Smart Manufacturing <br />
            {/* Highlighted text */}
            <span style={{ color: "#1976d2" }}>Made Simple</span>
          </Typography>

          {/* Subtitle / Description */}
          <Typography
            variant="h5"
            color="text.secondary"   // MUI predefined gray color
            sx={{
              mb: 5,
              maxWidth: "600px",
              mx: "auto",            // Centers horizontally
              lineHeight: 1.6
            }}
          >
            Streamline your production, manage inventory, and track quality in one unified dashboard.
          </Typography>

          {/* -------------------- ACTION BUTTONS -------------------- */}
          {/* Stack makes horizontal layout with spacing */}
          <Stack
            direction="row"          // Horizontal alignment
            spacing={2}               // Space between buttons
            justifyContent="center"
          >
            {/* Primary CTA Button */}
            <Button
              variant="contained"    // Filled button
              size="large"
              onClick={() => navigate("/login")}
              sx={{
                px: 4,
                py: 1.5,
                fontSize: "1.1rem",
                borderRadius: "8px"
              }}
            >
              Get Started
            </Button>

            {/* Secondary CTA Button */}
            <Button
              variant="outlined"     // Border-only button
              size="large"
              onClick={() => navigate("/signup")}
              sx={{
                px: 4,
                py: 1.5,
                fontSize: "1.1rem",
                borderRadius: "8px"
              }}
            >
              Create Account
            </Button>
          </Stack>

        </Box>
      </Container>
    </Box>
  );
}

// Export so it can be used in routing (App.jsx)
export default HomePage;
