
// UPDATED AnalyticsDashboard.jsx - Uses real API

import React, { useEffect, useState } from "react";
import {
  Box, Typography, Grid, Card, CardContent, Stack, Button,
  Divider, Paper, Container, Chip, LinearProgress, IconButton,
  alpha, CircularProgress, Alert
} from "@mui/material";

import { PieChart } from "@mui/x-charts/PieChart";
import { useNavigate } from "react-router-dom";

// ✅ CHANGE: Import API functions
import { getAllQualityChecks } from "../../QualityControl/api/qualityCheckApi";
import { calculateMetrics } from "../../Analytics/utils/analytics";

import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AssessmentIcon from '@mui/icons-material/Assessment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import RefreshIcon from '@mui/icons-material/Refresh';
import InventoryIcon from '@mui/icons-material/Inventory';
import WorkIcon from '@mui/icons-material/Work';
import VerifiedIcon from '@mui/icons-material/Verified';
import CategoryIcon from '@mui/icons-material/Category';
import LogoutIcon from '@mui/icons-material/Logout';

const AnalyticsDashboard = () => {
  const navigate = useNavigate();

  // ✅ NEW: State for data
  const [qualityChecks, setQualityChecks] = useState([]);
  const [metrics, setMetrics] = useState(null);
  
  // ✅ NEW: Loading and error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ✅ CHANGE: Load from API and calculate metrics
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");

      const qualityData = await getAllQualityChecks();
      setQualityChecks(qualityData);

      // Calculate metrics from quality checks
      const calculatedMetrics = calculateMetrics(qualityData);
      setMetrics(calculatedMetrics);
    } catch (err) {
      console.error("Failed to load analytics:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ✅ NEW: Refresh function
  const handleRefresh = () => {
    loadData();
  };

  const navItems = [
    { label: "Products", path: "/products", icon: <CategoryIcon /> },
    { label: "Inventory", path: "/inventory", icon: <InventoryIcon /> },
    { label: "WorkOrders", path: "/workorder", icon: <WorkIcon /> },
    { label: "Quality", path: "/quality", icon: <VerifiedIcon /> }
  ];

  // ✅ NEW: Loading state
  if (loading) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center"
        }}
      >
        <CircularProgress size={60} sx={{ color: 'white' }} />
      </Box>
    );
  }
  const { successRate, failureRate } = metrics || {};

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        py: 4
      }}
    >
      <Container maxWidth="xl">
        
        {/* HEADER */}
          <Paper
            elevation={0}
            sx={{
              background: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(10px)",
              borderRadius: 4,
              p: 4,
              mb: 3
            }}
          >
            <Stack
              direction={{ xs: "column", md: "row" }}
              justifyContent="space-between"
              alignItems={{ xs: "flex-start", md: "center" }}
              spacing={2}
            >
              <Stack direction="row" spacing={2} alignItems="center">
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                >
                  <AssessmentIcon sx={{ color: "white", fontSize: 28 }} />
                </Box>
                <Box>
                  <Typography variant="h4" fontWeight="700" color="text.primary">
                    Analytics & Compliance
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Real-time manufacturing insights
                  </Typography>
                </Box>
              </Stack>

              <Stack direction="row" spacing={2}>
                {/* ✅ NEW: Refresh button */}
                <IconButton
                  onClick={handleRefresh}
                  disabled={loading}
                  sx={{
                    background: alpha("#667eea", 0.1),
                    color: "#667eea",
                    "&:hover": { background: alpha("#667eea", 0.2) }
                  }}
                >
                  <RefreshIcon />
                </IconButton>
                <Button
                  variant=""
                  startIcon={<LogoutIcon />}
                  onClick={() => {
                    localStorage.removeItem('loggedInUser'); // Clear user session
                    navigate('/login');
                  }}
                  sx={{
                    bgcolor: '#f39c12',
                    borderRadius: 2,
                    textTransform: "none",
                    textColour: "white",
                    fontWeight: 600,
                    px: 3,
                    boxShadow: "0 4px 20px rgba(102, 126, 234, 0.4)"
                    }}
                >
                  Logout
                </Button>
              </Stack>
            </Stack>
          </Paper>

          {/* ✅ NEW: Error display */}
          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 3 }} onClose={() => setError("")}>
              {error}
            </Alert>
          )}

          {/* QUICK NAVIGATION */}
          <Grid container spacing={2} mb={3}>
            {navItems.map((item) => (
              <Grid item xs={12} sm={6} md={3} key={item.path}>
                <Card
                  sx={{
                    background: "rgba(255, 255, 255, 0.95)",
                    backdropFilter: "blur(10px)",
                    borderRadius: 3,
                    cursor: "pointer",
                    height: "100%",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "0 12px 24px rgba(0,0,0,0.15)"
                    }
                  }}
                  onClick={() => navigate(item.path)}
                >
                  <CardContent>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Box
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: 2,
                          background: alpha("#667eea", 0.1),
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#667eea"
                        }}
                      >
                        {item.icon}
                      </Box>
                      <Typography variant="body1" fontWeight="600">
                        {item.label}
                      </Typography>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

        {/* CONDITIONAL CONTENT - Empty state or Data */}
        {(!metrics || qualityChecks.length === 0) ? (
          // Empty State
          <Container maxWidth="sm">
            <Paper
              elevation={0}
              sx={{
                background: "rgba(255, 255, 255, 0.95)",
                backdropFilter: "blur(10px)",
                borderRadius: 4,
                p: 6,
                textAlign: "center"
              }}
            >
              <Box
                sx={{
                  width: 120,
                  height: 120,
                  borderRadius: "50%",
                  background: alpha("#667eea", 0.1),
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  margin: "0 auto",
                  mb: 3
                }}
              >
                <AssessmentIcon sx={{ fontSize: 64, color: "#667eea" }} />
              </Box>

              <Typography variant="h4" fontWeight="700" mb={2} color="text.primary">
                No Analytics Data Yet
              </Typography>
              <Typography variant="body1" color="text.secondary" mb={4}>
                Complete quality inspections to see analytics and compliance metrics
              </Typography>

              {/* ✅ UPDATED: Two buttons - Quality Checks and Work Orders */}
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2} justifyContent="center">
                <Button
                  variant="contained"
                  onClick={() => navigate("/quality")}
                  sx={{
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    borderRadius: 3,
                    textTransform: "none",
                    fontWeight: 700,
                    px: 4,
                    py: 1.5,
                    flex: 1
                  }}
                >
                  Go to Quality Checks
                </Button>

                {/* ✅ NEW: Button to navigate to Work Orders */}
                <Button
                  variant="outlined"
                  onClick={() => navigate("/workorder")}
                  sx={{
                    borderColor: "#667eea",
                    color: "#667eea",
                    borderRadius: 3,
                    textTransform: "none",
                    fontWeight: 700,
                    px: 4,
                    py: 1.5,
                    flex: 1,
                    "&:hover": {
                      borderColor: "#667eea",
                      backgroundColor: alpha("#667eea", 0.1)
                    }
                  }}
                >
                  View Work Orders
                </Button>
              </Stack>
            </Paper>
          </Container>
        ) : (
          // Data State - Main Analytics
          <Grid container spacing={24}>
            
            {/* SUCCESS RATE CARD */}
            <Grid item xs={12} md={4}>
              <Card
                sx={{
                  background: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
                  borderRadius: 4,
                  height: "100%",
                  width: "170%",
                  position: "relative",
                  overflow: "hidden"
                }}
              >
                <CardContent sx={{ position: "relative", zIndex: 1 }}>
                  <Stack spacing={2}>
                    <Box
                      sx={{
                        width: 56,
                        height: 56,
                        borderRadius: 2,
                        background: "rgba(255, 255, 255, 0.2)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}
                    >
                      <CheckCircleIcon sx={{ color: "white", fontSize: 32 }} />
                    </Box>
                    
                    <Typography variant="h6" color="white" fontWeight="600">
                      Success Rate
                    </Typography>
                    
                    <Typography variant="h2" color="white" fontWeight="800">
                      {successRate}%
                    </Typography>
                    
                    <LinearProgress
                      variant="determinate"
                      value={successRate}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: "rgba(255, 255, 255, 0.3)",
                        "& .MuiLinearProgress-bar": {
                          backgroundColor: "white",
                          borderRadius: 4
                        }
                      }}
                    />
                    
                    <Chip
                      icon={<TrendingUpIcon />}
                      label="Excellent Performance"
                      sx={{
                        background: "rgba(255, 255, 255, 0.2)",
                        color: "white",
                        fontWeight: 600,
                        alignSelf: "flex-start"
                      }}
                    />
                  </Stack>
                </CardContent>
                
                <Box
                  sx={{
                    position: "absolute",
                    bottom: -20,
                    right: -20,
                    width: 150,
                    height: 150,
                    borderRadius: "50%",
                    background: "rgba(255, 255, 255, 0.1)"
                  }}
                />
              </Card>
            </Grid>

            {/* FAILURE RATE CARD */}
            <Grid item xs={12} md={4}>
              <Card
                sx={{
                  background: "linear-gradient(135deg, #ee0979 0%, #ff6a00 100%)",
                  borderRadius: 4,
                  height: "100%",
                  width: "170%",
                  position: "relative",
                  overflow: "hidden"
                }}
              >
                <CardContent sx={{ position: "relative", zIndex: 1 }}>
                  <Stack spacing={2}>
                    <Box
                      sx={{
                        width: 56,
                        height: 56,
                        borderRadius: 2,
                        background: "rgba(255, 255, 255, 0.2)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center"
                      }}
                    >
                      <ErrorIcon sx={{ color: "white", fontSize: 32 }} />
                    </Box>
                    
                    <Typography variant="h6" color="white" fontWeight="600">
                      Failure Rate
                    </Typography>
                    
                    <Typography variant="h2" color="white" fontWeight="800">
                      {failureRate}%
                    </Typography>
                    
                    <LinearProgress
                      variant="determinate"
                      value={failureRate}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: "rgba(255, 255, 255, 0.3)",
                        "& .MuiLinearProgress-bar": {
                          backgroundColor: "white",
                          borderRadius: 4
                        }
                      }}
                    />
                    
                    <Chip
                      label={failureRate <= 10 ? "Within Limits" : "Needs Attention"}
                      sx={{
                        background: "rgba(255, 255, 255, 0.2)",
                        color: "white",
                        fontWeight: 600,
                        alignSelf: "flex-start"
                      }}
                    />
                  </Stack>
                </CardContent>
                
                <Box
                  sx={{
                    position: "absolute",
                    bottom: -20,
                    right: -20,
                    width: 150,
                    height: 150,
                    borderRadius: "50%",
                    background: "rgba(255, 255, 255, 0.1)"
                  }}
                />
              </Card>
            </Grid>

            {/* PIE CHART */}
            <Grid item xs={12} md={4}>
              <Card
                sx={{
                  background: "rgba(255, 255, 255, 0.95)",
                  backdropFilter: "blur(10px)",
                  borderRadius: 4,
                  height: "100%"
                }}
              >
                <CardContent>
                  <Typography variant="h6" fontWeight="700" mb={2} color="text.primary">
                    Quality Distribution
                  </Typography>

                  <PieChart
                    series={[
                      {
                        innerRadius: 60,
                        outerRadius: 100,
                        paddingAngle: 5,
                        cornerRadius: 8,
                        data: [
                          {
                            id: 0,
                            value: successRate,
                            label: "Success",
                            color: "#38ef7d"
                          },
                          {
                            id: 1,
                            value: failureRate,
                            label: "Failure",
                            color: "#ff6a00"
                          }
                        ]
                      }
                    ]}
                    height={240}
                    slotProps={{
                      legend: { hidden: false }
                    }}
                  />
                </CardContent>
              </Card>
            </Grid>

            {/* COMPLIANCE OVERVIEW */}
            <Grid item xs={12} >
              <Card
                sx={{
                  background: "rgba(255, 255, 255, 0.95)",
                  backdropFilter: "blur(10px)",
                  borderRadius: 4,
                  width: "132%",
                  
                }}
              >
                <CardContent>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
                    <Typography variant="h5" fontWeight="700" color="text.primary">
                      Compliance Overview
                    </Typography>
                    <Chip
                      label="Real-time"
                      color="primary"
                      variant="outlined"
                      size="small"
                    />
                  </Stack>

                  <Divider sx={{ mb: 3 }} />

                  <Grid container spacing={10}>
                    
                    <Grid item xs={12} md={6}>
                      <Paper
                        sx={{
                          p: 3,
                          borderRadius: 3,
                          width: "100%",
                          background: alpha("#38ef7d", 0.1),
                          border: `2px solid ${alpha("#38ef7d", 0.3)}`
                        }}
                      >
                        <Stack spacing={1}>
                          <Typography variant="overline" color="text.secondary" fontWeight="600">
                            Success Metrics
                          </Typography>
                          <Typography variant="h4" fontWeight="800" color="#11998e">
                            {successRate}%
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {metrics.passed} of {metrics.totalChecks} inspections passed
                          </Typography>
                        </Stack>
                      </Paper>
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <Paper
                        sx={{
                          p: 3,
                          borderRadius: 3,
                          width: "100%",
                          background: alpha("#ff6a00", 0.1),
                          border: `2px solid ${alpha("#ff6a00", 0.3)}`
                        }}
                      >
                        <Stack spacing={1}>
                          <Typography variant="overline" color="text.secondary" fontWeight="600">
                            Failure Metrics
                          </Typography>
                          <Typography variant="h4" fontWeight="800" color="#ee0979">
                            {failureRate}%
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {metrics.failed} of {metrics.totalChecks} inspections failed
                          </Typography>
                        </Stack>
                      </Paper>
                    </Grid>

                    <Grid item xs={12}>
                      <Paper
                        sx={{
                          p: 3,
                          borderRadius: 3,
                          width: "150%",
                          background: alpha("#667eea", 0.05)
                        }}
                      >
                        <Stack direction="row" justifyContent="space-between" alignItems="center">
                          <Stack>
                            <Typography variant="overline" color="text.secondary" fontWeight="600">
                              Total Units Inspected
                            </Typography>
                            <Typography variant="h6" fontWeight="600" color="text.primary">
                              {metrics.totalInspected.toLocaleString()} units
                            </Typography>
                          
                          <Typography variant="body2" color="text.secondary" sx={{ fontStyle: "italic" }}>
                            Based on {metrics.totalChecks} quality inspection records
                          </Typography>
                          </Stack>
                        </Stack>
                      </Paper>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}
      </Container>
    </Box>
  );
};

export default AnalyticsDashboard;