// ============================================================
// IMPORTS: React hooks and Material-UI components
// ============================================================
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Stack,
  LinearProgress,
  Box,
  Container,
  Paper,
  alpha,
  Divider,
  IconButton,
  Avatar,
  Tooltip
} from "@mui/material";

// Import product data
import { products } from "../../entities/product";

// Import quality check retrieval function
import { getQualityChecks } from "../entities/quality";
import { getCurrentUser } from "../../../auth/authApi";

// Material-UI Icons
import VerifiedIcon from '@mui/icons-material/Verified';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import AssignmentIcon from '@mui/icons-material/Assignment';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import FilterListIcon from '@mui/icons-material/FilterList';
import RefreshIcon from '@mui/icons-material/Refresh';
import ScienceIcon from '@mui/icons-material/Science';

import HomeIcon from "@mui/icons-material/Home";

import { useNavigate } from "react-router-dom";

// ============================================================
// MAIN COMPONENT: QualityCheckList
// REASON: Display all completed quality inspections with statistics
// ============================================================
const QualityCheckList = () => {
  // ============================================================
  // STATE: quality (List of all quality check records)
  // SYNTAX: const [quality, setQuality] = useState([]);
  // REASON: Store all quality inspection records fetched from storage
  // ============================================================
  const [quality, setQuality] = useState([]);

  const navigate = useNavigate();
  // ✅ NEWLY ADDED - Get current user to check role
  const user = getCurrentUser();
  const isAdmin = user?.role === 'admin';

  // ✅ NEWLY ADDED - Handler for home icon click (admin only)
  const handleHomeClick = () => {
    navigate('/analytics');
  };

  // ============================================================
  // HOOK: useEffect (Load quality checks on mount)
  // LOGIC: Runs once when component loads ([] dependency)
  // REASON: Fetch all quality inspections from storage on page open
  // ============================================================
  useEffect(() => {
    setQuality(getQualityChecks());
  }, []);

  // ============================================================
  // STATISTICS: Calculate summary numbers
  // REASON: Show dashboard overview of quality results
  // ============================================================
  const stats = {
    // Total number of quality inspections performed
    total: quality.length,

    // Count of inspections that PASSED (>= 90% success rate)
    passed: quality.filter(q => q.result === "PASS").length,

    // Count of inspections that FAILED (< 90% success rate)
    failed: quality.filter(q => q.result === "FAIL").length,

    // Average success rate across all inspections
    // LOGIC:
    //   - quality.reduce(...) = sum all success rates
    //   - / quality.length = divide by number of inspections
    //   - .toFixed(1) = round to 1 decimal place
    // EXAMPLE: If 3 inspections with 90%, 95%, 85% rates
    //   → (90 + 95 + 85) / 3 = 90.0%
    avgSuccessRate: quality.length > 0 
      ? (quality.reduce((acc, q) => acc + q.successRate, 0) / quality.length).toFixed(1)
      : 0
  };

  // ============================================================
  // EMPTY STATE: Show when no quality checks exist
  // LOGIC: If quality array is empty, show this UI instead
  // REASON: Guide user that quality inspections will appear after work completion
  // ============================================================
  if (!quality.length) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          py: 4
        }}
      >
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
            {/* Empty state icon */}
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
              <ScienceIcon sx={{ fontSize: 64, color: "#667eea" }} />
            </Box>

            {/* Empty state text */}
            <Typography variant="h4" fontWeight="700" mb={2} color="text.primary">
              No Quality Checks Yet
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Quality inspection records will appear here once work orders are completed and inspected
            </Typography>
          </Paper>
        </Container>
      </Box>
    );
  }

  // ============================================================
  // MAIN UI: When quality checks exist
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
            {/* ✅ UPDATED: Conditionally show Home icon for admin or Science icon for others */}
            {isAdmin ? (
              <Tooltip title="Go to Analytics">
                <Box
                  onClick={handleHomeClick}
                  sx={{
                    width: 48,
                    height: 48,
                    borderRadius: 2,
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: 'pointer',  // ✅ Pointer cursor
                    '&:hover': {  // ✅ Hover effect
                      transform: 'scale(1.1)',
                      boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  <HomeIcon sx={{ color: 'white', fontSize: 24 }} />  {/* ✅ Home icon for admin */}
                </Box>
              </Tooltip>
            ) : (
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
                <VerifiedIcon sx={{ color: 'white', fontSize: 24 }} />  {/* ✅ Verified icon for non-admin */}
              </Box>
            )}
              <Box>
                <Typography variant="h4" fontWeight="700" color="text.primary">
                  Quality Inspections
                </Typography>
                {/* Show count of inspection records */}
                <Typography variant="body2" color="text.secondary">
                  {quality.length} inspection records
                </Typography>
              </Box>
            </Stack>

            {/* Control buttons section */}
            <Stack direction="row" spacing={2}>
              {/* Refresh button */}
              <IconButton
                sx={{
                  background: alpha("#667eea", 0.1),
                  color: "#667eea",
                  "&:hover": { background: alpha("#667eea", 0.2) }
                }}
              >
                <RefreshIcon />
              </IconButton>

              {/* Filter button */}
              <IconButton
                sx={{
                  background: alpha("#667eea", 0.1),
                  color: "#667eea",
                  "&:hover": { background: alpha("#667eea", 0.2) }
                }}
              >
                <FilterListIcon />
              </IconButton>
            </Stack>
          </Stack>
        </Paper>

        {/* ===== STATISTICS DASHBOARD ===== */}
        <Grid container spacing={2} mb={3}>
          
          {/* Total Inspections Card */}
          <Grid item xs={6} md={3}>
            <Paper
              sx={{
                p: 3,
                borderRadius: 3,
                background: "rgba(255, 255, 255, 0.95)",
                backdropFilter: "blur(10px)",
                border: `2px solid ${alpha("#667eea", 0.2)}`
              }}
            >
              <Stack spacing={1}>
                <Typography variant="overline" color="text.secondary" fontWeight="600">
                  Total Inspections
                </Typography>
                <Typography variant="h3" fontWeight="800" color="#667eea">
                  {stats.total}
                </Typography>
              </Stack>
            </Paper>
          </Grid>

          {/* Passed Inspections Card */}
          <Grid item xs={6} md={3}>
            <Paper
              sx={{
                p: 3,
                borderRadius: 3,
                background: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
                position: "relative",
                overflow: "hidden"
              }}
            >
              <Stack spacing={1}>
                <Typography variant="overline" sx={{ color: "rgba(255,255,255,0.9)", fontWeight: 600 }}>
                  Passed
                </Typography>
                <Typography variant="h3" fontWeight="800" color="white">
                  {stats.passed}
                </Typography>
              </Stack>
              {/* Decorative circle background */}
              <Box
                sx={{
                  position: "absolute",
                  bottom: -15,
                  right: -15,
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  background: "rgba(255, 255, 255, 0.1)"
                }}
              />
            </Paper>
          </Grid>

          {/* Failed Inspections Card */}
          <Grid item xs={6} md={3}>
            <Paper
              sx={{
                p: 3,
                borderRadius: 3,
                background: "linear-gradient(135deg, #ee0979 0%, #ff6a00 100%)",
                position: "relative",
                overflow: "hidden"
              }}
            >
              <Stack spacing={1}>
                <Typography variant="overline" sx={{ color: "rgba(255,255,255,0.9)", fontWeight: 600 }}>
                  Failed
                </Typography>
                <Typography variant="h3" fontWeight="800" color="white">
                  {stats.failed}
                </Typography>
              </Stack>
              {/* Decorative circle background */}
              <Box
                sx={{
                  position: "absolute",
                  bottom: -15,
                  right: -15,
                  width: 80,
                  height: 80,
                  borderRadius: "50%",
                  background: "rgba(255, 255, 255, 0.1)"
                }}
              />
            </Paper>
          </Grid>

          {/* Average Success Rate Card */}
          <Grid item xs={6} md={3}>
            <Paper
              sx={{
                p: 3,
                borderRadius: 3,
                background: "rgba(255, 255, 255, 0.95)",
                backdropFilter: "blur(10px)",
                border: `2px solid ${alpha("#38ef7d", 0.2)}`
              }}
            >
              <Stack spacing={1}>
                <Typography variant="overline" color="text.secondary" fontWeight="600">
                  Avg Success Rate
                </Typography>
                <Typography variant="h3" fontWeight="800" color="#11998e">
                  {stats.avgSuccessRate}%
                </Typography>
              </Stack>
            </Paper>
          </Grid>
        </Grid>

        {/* ===== QUALITY CHECK CARDS GRID ===== */}
        <Grid container spacing={3}>
          {quality.map(qc => {
            // Get product name from ID
            const product = products.find(p => p.id === qc.productId)?.name || "Unknown";

            // Determine if passed or failed
            const isPassed = qc.result === "PASS";
            
            // Get styling config based on result
            const resultConfig = isPassed ? {
              color: "#38ef7d",
              bgColor: alpha("#38ef7d", 0.1),
              borderColor: alpha("#38ef7d", 0.3),
              gradient: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
              icon: <CheckCircleIcon />
            } : {
              color: "#ff6a00",
              bgColor: alpha("#ff6a00", 0.1),
              borderColor: alpha("#ff6a00", 0.3),
              gradient: "linear-gradient(135deg, #ee0979 0%, #ff6a00 100%)",
              icon: <CancelIcon />
            };

            return (
              <Grid item xs={12} md={6} lg={4} key={qc.qcId}>
                <Card
                  sx={{
                    borderRadius: 4,
                    overflow: "hidden",
                    background: "rgba(255, 255, 255, 0.95)",
                    backdropFilter: "blur(10px)",
                    border: `2px solid ${resultConfig.borderColor}`,
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: `0 12px 24px ${alpha(resultConfig.color, 0.2)}`
                    }
                  }}
                >
                  {/* Color bar indicating PASS/FAIL status */}
                  <Box sx={{ height: 6, background: resultConfig.gradient }} />

                  <CardContent sx={{ p: 3 }}>
                    <Stack spacing={2.5}>
                      
                      {/* ===== HEADER: Product name and result badge ===== */}
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="flex-start"
                        spacing={1}
                      >
                        <Box flex={1}>
                          {/* Product name */}
                          <Typography variant="h6" fontWeight="700" color="text.primary">
                            {product}
                          </Typography>
                          {/* QC ID */}
                          <Typography variant="caption" color="text.secondary">
                            QC #{qc.qcId}
                          </Typography>
                        </Box>

                        {/* PASS/FAIL badge */}
                        <Chip
                          icon={resultConfig.icon}
                          label={qc.result}
                          sx={{
                            background: resultConfig.bgColor,
                            color: resultConfig.color,
                            border: `2px solid ${resultConfig.borderColor}`,
                            fontWeight: 700,
                            fontSize: 12,
                            height: 32
                          }}
                        />
                      </Stack>

                      {/* ===== WORK ORDER REFERENCE ===== */}
                      <Paper
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          background: alpha("#667eea", 0.05),
                          border: `1px solid ${alpha("#667eea", 0.1)}`
                        }}
                      >
                        <Stack direction="row" spacing={1} alignItems="center">
                          <AssignmentIcon sx={{ fontSize: 18, color: "#667eea" }} />
                          <Typography variant="body2" fontWeight="600" color="text.secondary">
                            Work Order
                          </Typography>
                          {/* Link to work order */}
                          <Typography variant="body2" fontWeight="700" color="#667eea">
                            #{qc.workOrderId}
                          </Typography>
                        </Stack>
                      </Paper>

                      <Divider />

                      {/* ===== QUALITY METRICS ===== */}
                      <Stack spacing={2}>
                        
                        {/* Acceptance Rate Progress Bar */}
                        <Box>
                          <Stack direction="row" justifyContent="space-between" mb={1}>
                            <Typography variant="body2" color="text.secondary">
                              Acceptance Rate
                            </Typography>
                            {/* Show percentage in matching color */}
                            <Typography variant="body2" fontWeight="700" color={resultConfig.color}>
                              {qc.successRate}%
                            </Typography>
                          </Stack>
                          <LinearProgress
                            variant="determinate"
                            value={qc.successRate}
                            sx={{
                              height: 10,
                              borderRadius: 5,
                              backgroundColor: alpha(resultConfig.color, 0.1),
                              "& .MuiLinearProgress-bar": {
                                backgroundColor: resultConfig.color,
                                borderRadius: 5
                              }
                            }}
                          />
                        </Box>

                        {/* Quantity Breakdown: Accepted / Total / Rejected */}
                        <Stack
                          direction="row"
                          spacing={2}
                          sx={{
                            p: 2,
                            borderRadius: 2,
                            background: alpha(resultConfig.color, 0.05)
                          }}
                        >
                          {/* Accepted count */}
                          <Box flex={1}>
                            <Typography variant="caption" color="text.secondary">
                              Accepted
                            </Typography>
                            <Typography variant="h6" fontWeight="700" color={resultConfig.color}>
                              {qc.acceptedQty}
                            </Typography>
                          </Box>

                          {/* Vertical divider */}
                          <Divider orientation="vertical" flexItem />

                          {/* Total count */}
                          <Box flex={1}>
                            <Typography variant="caption" color="text.secondary">
                              Total
                            </Typography>
                            <Typography variant="h6" fontWeight="700" color="text.primary">
                              {qc.totalQty}
                            </Typography>
                          </Box>

                          {/* Vertical divider */}
                          <Divider orientation="vertical" flexItem />

                          {/* Rejected count */}
                          <Box flex={1}>
                            <Typography variant="caption" color="text.secondary">
                              Rejected
                            </Typography>
                            {/* Color rejected count based on result */}
                            <Typography 
                              variant="h6" 
                              fontWeight="700" 
                              color={isPassed ? "text.secondary" : resultConfig.color}
                            >
                              {qc.totalQty - qc.acceptedQty}
                            </Typography>
                          </Box>
                        </Stack>
                      </Stack>

                      <Divider />

                      {/* ===== INSPECTOR REMARKS (if exists) ===== */}
                      {qc.remarks && (
                        <Paper
                          sx={{
                            p: 2,
                            borderRadius: 2,
                            background: alpha("#667eea", 0.03),
                            border: `1px dashed ${alpha("#667eea", 0.2)}`
                          }}
                        >
                          <Typography variant="caption" color="text.secondary" fontWeight="600">
                            INSPECTOR REMARKS
                          </Typography>
                          <Typography variant="body2" color="text.primary" mt={0.5}>
                            {qc.remarks}
                          </Typography>
                        </Paper>
                      )}

                      {/* ===== INSPECTION DATE ===== */}
                      <Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
                        <CalendarTodayIcon sx={{ fontSize: 14, color: "text.secondary" }} />
                        <Typography variant="caption" color="text.secondary">
                          {/* Format date as "January 15, 2024" */}
                          Inspected on {new Date(qc.inspectionDate).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric"
                          })}
                        </Typography>
                      </Stack>
                    </Stack>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Container>
    </Box>
  );
};

// ============================================================
// EXPORT: Make component available
// ============================================================
export default QualityCheckList;