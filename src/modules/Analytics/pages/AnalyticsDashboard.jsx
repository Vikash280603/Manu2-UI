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
import { PieChart } from "@mui/x-charts/PieChart";
import { useNavigate } from "react-router-dom";
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AssessmentIcon from '@mui/icons-material/Assessment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import RefreshIcon from '@mui/icons-material/Refresh';
import InventoryIcon from '@mui/icons-material/Inventory';
import WorkIcon from '@mui/icons-material/Work';
import VerifiedIcon from '@mui/icons-material/Verified';
import CategoryIcon from '@mui/icons-material/Category';

import { getReports, saveReports, generateReportId } from "../Entities/reports";
import { calculateMetrics } from "../utils/analytics";

const QUALITY_KEY = "manutrack_quality_v1";

const AnalyticsDashboard = () => {
  const navigate = useNavigate();
  const [latestReport, setLatestReport] = useState(null);

  useEffect(() => {
    const qualityData = JSON.parse(localStorage.getItem(QUALITY_KEY)) || [];
    const metrics = calculateMetrics(qualityData);

    const newReport = {
      reportId: generateReportId(),
      generatedDate: new Date().toISOString(),
      metrics
    };

    const existing = getReports();
    saveReports([...existing, newReport]);
    setLatestReport(newReport);
  }, []);

  if (!latestReport) return null;

  const { successRate, failureRate } = latestReport.metrics;

  const navItems = [
    { label: "Products", path: "/products", icon: <CategoryIcon /> },
    { label: "Inventory", path: "/inventory", icon: <InventoryIcon /> },
    { label: "Work Orders", path: "/workorder", icon: <WorkIcon /> },
    { label: "Quality", path: "/quality", icon: <VerifiedIcon /> }
  ];

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        py: 4
      }}
    >
      <Container maxWidth="xl">
        {/* Header Section */}
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
              <IconButton
                color="primary"
                sx={{
                  background: alpha("#667eea", 0.1),
                  "&:hover": { background: alpha("#667eea", 0.2) }
                }}
              >
                <RefreshIcon />
              </IconButton>
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

        {/* Quick Navigation */}
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

        {/* Main Analytics Grid */}
        <Grid container spacing={3}>
          {/* Success Rate Card */}
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

          {/* Failure Rate Card */}
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

          {/* Chart Card */}
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

          {/* Detailed Metrics */}
          <Grid item xs={12}>
            <Card
              sx={{
                background: "rgba(255, 255, 255, 0.95)",
                backdropFilter: "blur(10px)",
                borderRadius: 4
              }}
            >
              <CardContent>
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

                <Grid container spacing={3}>
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
                          <Typography variant="h6" fontWeight="600" color="text.primary">
                            {new Date(latestReport.generatedDate).toLocaleString()}
                          </Typography>
                        </Stack>
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

export default AnalyticsDashboard;