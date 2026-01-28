// ============================================================
// IMPORTS: React hooks and Material-UI components
// ============================================================
import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Stack,
  Button,
  Divider,
  Paper,
  Container,
  Chip,
  LinearProgress,
  IconButton,
  alpha
} from "@mui/material";

// Pie chart component from Material-UI charts library
import { PieChart } from "@mui/x-charts/PieChart";

// React Router hook for navigation
import { useNavigate } from "react-router-dom";

// Material-UI Icons
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AssessmentIcon from '@mui/icons-material/Assessment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import RefreshIcon from '@mui/icons-material/Refresh';
import InventoryIcon from '@mui/icons-material/Inventory';
import WorkIcon from '@mui/icons-material/Work';
import VerifiedIcon from '@mui/icons-material/Verified';
import CategoryIcon from '@mui/icons-material/Category';

// Import report functions
import { getReports, saveReports, generateReportId } from "../entities/reports";

// Import analytics utility function
import { calculateMetrics } from "../utils/analytics";

// ============================================================
// CONSTANT: Storage key for Quality Checks
// SYNTAX: const QUALITY_KEY = "manutrack_quality_v1";
// REASON: Access quality inspection data from localStorage
// ============================================================
const QUALITY_KEY = "manutrack_quality_v1";

// ============================================================
// MAIN COMPONENT: AnalyticsDashboard
// REASON: Show real-time manufacturing metrics and compliance overview
// ============================================================
const AnalyticsDashboard = () => {
  // ============================================================
  // HOOK: useNavigate
  // REASON: Navigate to different pages (products, inventory, etc.)
  // ============================================================
  const navigate = useNavigate();

  // ============================================================
  // STATE: latestReport (Most recent auto-generated report)
  // SYNTAX: const [latestReport, setLatestReport] = useState(null);
  // REASON: Store the latest report data for display
  // ============================================================
  const [latestReport, setLatestReport] = useState(null);

  // ============================================================
  // HOOK: useEffect (Generate and save analytics report on load)
  // 
  // FIX FOR DUPLICATE REPORTS:
  // - Check if a report was already created in the last 5 seconds
  // - Compare metrics of last report with current metrics
  // - Only create NEW report if metrics have changed
  // - This prevents duplicate reports from:
  //   * React Strict Mode (double mounting in dev)
  //   * HMR/Hot reload
  //   * Navigating back to dashboard
  //
  // LOGIC:
  //   STEP 1: Fetch quality check data from localStorage
  //   STEP 2: Calculate metrics from quality data
  //   STEP 3: Get existing reports from storage
  //   STEP 4: Check if we already have a recent report with same metrics
  //   STEP 5: If yes → just display it (don't create new one)
  //   STEP 6: If no → create new report and save it
  //   STEP 7: Update state with latest report
  //
  // REASON: 
  //   - Auto-generate and archive analytics data
  //   - Prevent duplicate reports at same timestamp
  //   - Only create report when metrics actually change
  // ============================================================
  useEffect(() => {
    // STEP 1: Get quality data from storage
    const qualityData = JSON.parse(localStorage.getItem(QUALITY_KEY)) || [];

    // STEP 2: Calculate metrics from quality data
    const metrics = calculateMetrics(qualityData);
    // Returns something like:
    // { successRate: 92.5, failureRate: 7.5, totalChecks: 40, passed: 37, failed: 3 }

    // STEP 3: Get existing reports
    const existing = getReports();
    // Returns: [] or [previous report, previous report, ...]

    // STEP 4: Get the most recent report
    const lastReport = existing.length > 0 ? existing[existing.length - 1] : null;

    // STEP 5: Check if we should create a NEW report or reuse the last one
    // CONDITIONS TO SKIP CREATING NEW REPORT:
    //   1. lastReport exists (there's a previous report)
    //   2. Success rate is identical (no change in data)
    //   3. Failure rate is identical (no change in data)
    //   4. Report was created less than 5 seconds ago (not stale)
    if (
      lastReport &&
      lastReport.metrics.successRate === metrics.successRate &&
      lastReport.metrics.failureRate === metrics.failureRate &&
      (Date.now() - new Date(lastReport.generatedDate).getTime()) < 5000
    ) {
      // Report already exists and is recent → just display it
      // This prevents duplicates when component mounts multiple times
      setLatestReport(lastReport);
      return; // EXIT: Don't create a new report
    }

    // STEP 6: Create NEW report (only if metrics changed or no recent report exists)
    const newReport = {
      reportId: generateReportId(),              // "RPT-1704067245123-a7f9x2"
      generatedDate: new Date().toISOString(),   // Timestamp of when report was created
      metrics                                     // { successRate: 92.5, failureRate: 7.5, ... }
    };

    // STEP 7: Save new report + all existing reports
    saveReports([...existing, newReport]);

    // STEP 8: Update state to display latest report
    setLatestReport(newReport);
  }, []);

  // ============================================================
  // CONDITIONAL RENDER: Show nothing while loading
  // LOGIC: If latestReport hasn't loaded yet, return null
  // REASON: Prevent errors from accessing undefined data
  // ============================================================
  if (!latestReport) return null;

  // ============================================================
  // EXTRACT METRICS: Get success and failure rates from report
  // SYNTAX: const { successRate, failureRate } = latestReport.metrics;
  // REASON: Use these values throughout the component
  // ============================================================
  const { successRate, failureRate } = latestReport.metrics;

  // ============================================================
  // NAVIGATION ITEMS: Quick links to other pages
  // SYNTAX: const navItems = [{ label: ..., path: ..., icon: ... }, ...]
  // REASON: Show navigation cards to jump to different modules
  // ============================================================
  const navItems = [
    { label: "Products", path: "/products", icon: <CategoryIcon /> },
    { label: "Inventory", path: "/inventory", icon: <InventoryIcon /> },
    { label: "Work Orders", path: "/workorder", icon: <WorkIcon /> },
    { label: "Quality", path: "/quality", icon: <VerifiedIcon /> }
  ];

  // ============================================================
  // RETURN: The UI
  // ============================================================
  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        py: 4
      }}
    >
      <Container maxWidth="xl">
        
        {/* ===== HEADER SECTION ===== */}
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
            {/* Title section */}
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

            {/* Control buttons section */}
            <Stack direction="row" spacing={2}>
             
              {/* View Reports button */}
              <Button
                variant="contained"
                startIcon={<AssessmentIcon />}
                onClick={() => navigate("report")}
                sx={{
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  px: 3,
                  py: 1.5,
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 600,
                  boxShadow: "0 4px 20px rgba(102, 126, 234, 0.4)"
                }}
              >
                View Reports
              </Button>
            </Stack>
          </Stack>
        </Paper>

        {/* ===== QUICK NAVIGATION CARDS ===== */}
        <Grid container spacing={2} mb={3}>
          {navItems.map((item) => (
            <Grid item xs={12} sm={6} md={3} key={item.path}>
              <Card
                sx={{
                  background: "rgba(255, 255, 255, 0.95)",
                  backdropFilter: "blur(10px)",
                  borderRadius: 3,
                  cursor: "pointer",
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

        {/* ===== MAIN ANALYTICS GRID ===== */}
        <Grid container spacing={3}>
          
          {/* ===== SUCCESS RATE CARD ===== */}
          <Grid item xs={12} md={4}>
            <Card
              sx={{
                background: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
                borderRadius: 4,
                height: "100%",
                position: "relative",
                overflow: "hidden"
              }}
            >
              <CardContent sx={{ position: "relative", zIndex: 1 }}>
                <Stack spacing={2}>
                  {/* Icon box */}
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
                  
                  {/* Title */}
                  <Typography variant="h6" color="white" fontWeight="600">
                    Success Rate
                  </Typography>
                  
                  {/* Large percentage display */}
                  <Typography variant="h2" color="white" fontWeight="800">
                    {successRate}%
                  </Typography>
                  
                  {/* Progress bar */}
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
                  
                  {/* Status badge */}
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
              
              {/* Decorative circle background */}
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

          {/* ===== FAILURE RATE CARD ===== */}
          <Grid item xs={12} md={4}>
            <Card
              sx={{
                background: "linear-gradient(135deg, #ee0979 0%, #ff6a00 100%)",
                borderRadius: 4,
                height: "100%",
                position: "relative",
                overflow: "hidden"
              }}
            >
              <CardContent sx={{ position: "relative", zIndex: 1 }}>
                <Stack spacing={2}>
                  {/* Icon box */}
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
                  
                  {/* Title */}
                  <Typography variant="h6" color="white" fontWeight="600">
                    Failure Rate
                  </Typography>
                  
                  {/* Large percentage display */}
                  <Typography variant="h2" color="white" fontWeight="800">
                    {failureRate}%
                  </Typography>
                  
                  {/* Progress bar */}
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
                  
                  {/* Status badge */}
                  <Chip
                    label="Needs Attention"
                    sx={{
                      background: "rgba(255, 255, 255, 0.2)",
                      color: "white",
                      fontWeight: 600,
                      alignSelf: "flex-start"
                    }}
                  />
                </Stack>
              </CardContent>
              
              {/* Decorative circle background */}
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

          {/* ===== PIE CHART CARD ===== */}
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
                {/* Chart title */}
                <Typography variant="h6" fontWeight="700" mb={2} color="text.primary">
                  Quality Distribution
                </Typography>

                {/* Pie chart showing success vs failure breakdown */}
                <PieChart
                  series={[
                    {
                      innerRadius: 60,              // Makes it a donut chart
                      outerRadius: 100,             // Size of pie
                      paddingAngle: 5,              // Space between slices
                      cornerRadius: 8,              // Rounded corners
                      data: [
                        {
                          id: 0,
                          value: successRate,        // Slice size
                          label: "Success",
                          color: "#38ef7d"           // Green
                        },
                        {
                          id: 1,
                          value: failureRate,        // Slice size
                          label: "Failure",
                          color: "#ff6a00"           // Orange
                        }
                      ]
                    }
                  ]}
                  height={240}
                  slotProps={{
                    legend: { hidden: false }      // Show legend
                  }}
                />
              </CardContent>
            </Card>
          </Grid>

          {/* ===== COMPLIANCE OVERVIEW CARD ===== */}
          <Grid item xs={12}>
            <Card
              sx={{
                background: "rgba(255, 255, 255, 0.95)",
                backdropFilter: "blur(10px)",
                borderRadius: 4
              }}
            >
              <CardContent>
                {/* Header with title and badge */}
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
                  <Typography variant="h5" fontWeight="700" color="text.primary">
                    Compliance Overview
                  </Typography>
                  <Chip
                    label="Auto-generated"
                    color="primary"
                    variant="outlined"
                    size="small"
                  />
                </Stack>

                <Divider sx={{ mb: 3 }} />

                {/* Metrics grid */}
                <Grid container spacing={3}>
                  
                  {/* Success metrics box */}
                  <Grid item xs={12} md={6}>
                    <Paper
                      sx={{
                        p: 3,
                        borderRadius: 3,
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
                          Quality inspections passed
                        </Typography>
                      </Stack>
                    </Paper>
                  </Grid>

                  {/* Failure metrics box */}
                  <Grid item xs={12} md={6}>
                    <Paper
                      sx={{
                        p: 3,
                        borderRadius: 3,
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
                          Quality inspections failed
                        </Typography>
                      </Stack>
                    </Paper>
                  </Grid>

                  {/* Last updated info box */}
                  <Grid item xs={12}>
                    <Paper
                      sx={{
                        p: 3,
                        borderRadius: 3,
                        background: alpha("#667eea", 0.05)
                      }}
                    >
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Stack>
                          <Typography variant="overline" color="text.secondary" fontWeight="600">
                            Last Updated
                          </Typography>
                          {/* Format and display report generation time */}
                          <Typography variant="h6" fontWeight="600" color="text.primary">
                            {new Date(latestReport.generatedDate).toLocaleString()}
                          </Typography>
                        </Stack>
                        {/* Info note */}
                        <Typography variant="body2" color="text.secondary" sx={{ fontStyle: "italic" }}>
                          Based on Quality Inspection records
                        </Typography>
                      </Stack>
                    </Paper>
                  </Grid>
                </Grid>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

// ============================================================
// EXPORT: Make component available
// ============================================================
export default AnalyticsDashboard;