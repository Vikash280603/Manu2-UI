import React, { useEffect, useState } from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Typography,
  Box,
  Container,
  Chip,
  Stack,
  IconButton,
  TableContainer,
  alpha,
  Button,
  InputAdornment,
  TextField
} from "@mui/material";

import { getReports } from "../entities/reports";

import AssessmentIcon from '@mui/icons-material/Assessment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import DownloadIcon from '@mui/icons-material/Download';
import SearchIcon from '@mui/icons-material/Search';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import FilterListIcon from '@mui/icons-material/FilterList';

const ReportList = () => {
  const [reports, setReports] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Load reports when component mounts
  useEffect(() => {
    const loadedReports = getReports();
    setReports(loadedReports);
  }, []);

  // Filter reports based on search term
  const filteredReports = reports.filter(report =>
    report.reportId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Get color for success rate
  const getSuccessColor = (rate) => {
    if (rate >= 80) return "#38ef7d";
    if (rate >= 60) return "#f39c12";
    return "#ff6a00";
  };

  // Get color for failure rate
  const getFailureColor = (rate) => {
    if (rate <= 20) return "#38ef7d";
    if (rate <= 40) return "#f39c12";
    return "#ff6a00";
  };

  // Calculate average success rate
  const avgSuccessRate = reports.length > 0
    ? (reports.reduce((acc, r) => acc + r.metrics.successRate, 0) / reports.length).toFixed(1)
    : 0;

  // Calculate average failure rate
  const avgFailureRate = reports.length > 0
    ? (reports.reduce((acc, r) => acc + r.metrics.failureRate, 0) / reports.length).toFixed(1)
    : 0;

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
            {/* Title */}
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
                  Compliance Reports
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {reports.length} reports generated
                </Typography>
              </Box>
            </Stack>

      
          </Stack>

        
        </Paper>

        {/* STATISTICS CARDS */}
        <Stack direction={{ xs: "column", md: "row" }} spacing={2} mb={3}>
          
        

          {/* Total Reports Card */}
          <Paper
            sx={{
              flex: 1,
              p: 3,
              borderRadius: 3,
              background: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(10px)"
            }}
          >
            <Stack spacing={1}>
              <Typography variant="overline" color="text.secondary" fontWeight="600">
                Total Reports
              </Typography>
              <Typography variant="h3" fontWeight="800" color="#667eea">
                {reports.length}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Generated reports in system
              </Typography>
            </Stack>
          </Paper>
        </Stack>

        {/* REPORTS TABLE */}
        <Paper
          elevation={0}
          sx={{
            borderRadius: 4,
            overflow: "hidden",
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(10px)"
          }}
        >
          <TableContainer>
            <Table>
              {/* TABLE HEADER */}
              <TableHead>
                <TableRow
                  sx={{
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                  }}
                >
                  <TableCell sx={{ color: "white", fontWeight: 700, fontSize: 16 }}>
                    Report ID
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: 700, fontSize: 16 }}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <CalendarTodayIcon sx={{ fontSize: 18 }} />
                      <span>Generated Date</span>
                    </Stack>
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: 700, fontSize: 16 }}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <CheckCircleIcon sx={{ fontSize: 18 }} />
                      <span>Success Rate</span>
                    </Stack>
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: 700, fontSize: 16 }}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <ErrorIcon sx={{ fontSize: 18 }} />
                      <span>Failure Rate</span>
                    </Stack>
                  </TableCell>
                  <TableCell sx={{ color: "white", fontWeight: 700, fontSize: 16 }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>

              {/* TABLE BODY */}
              <TableBody>
                {filteredReports.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 8 }}>
                      <Typography variant="h6" color="text.secondary">
                        No reports found
                      </Typography>
                      <Typography variant="body2" color="text.secondary" mt={1}>
                        Try adjusting your search criteria
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredReports.map((report) => (
                    <TableRow
                      key={report.reportId}
                      sx={{
                        "&:hover": {
                          background: alpha("#667eea", 0.05)
                        },
                        transition: "all 0.2s ease"
                      }}
                    >
                      {/* Report ID */}
                      <TableCell>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Box
                            sx={{
                              width: 8,
                              height: 8,
                              borderRadius: "50%",
                              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                            }}
                          />
                          <Typography fontWeight="600" color="text.primary">
                            {report.reportId}
                          </Typography>
                        </Stack>
                      </TableCell>

                      {/* Generated Date */}
                      <TableCell>
                        <Typography variant="body2" color="text.secondary">
                          {new Date(report.generatedDate).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric"
                          })}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {new Date(report.generatedDate).toLocaleTimeString("en-US", {
                            hour: "2-digit",
                            minute: "2-digit"
                          })}
                        </Typography>
                      </TableCell>

                      {/* Success Rate */}
                      <TableCell>
                        <Chip
                          icon={<CheckCircleIcon />}
                          label={`${report.metrics.successRate}%`}
                          sx={{
                            background: alpha(getSuccessColor(report.metrics.successRate), 0.15),
                            color: getSuccessColor(report.metrics.successRate),
                            fontWeight: 700,
                            border: `2px solid ${alpha(getSuccessColor(report.metrics.successRate), 0.3)}`
                          }}
                        />
                      </TableCell>

                      {/* Failure Rate */}
                      <TableCell>
                        <Chip
                          icon={<ErrorIcon />}
                          label={`${report.metrics.failureRate}%`}
                          sx={{
                            background: alpha(getFailureColor(report.metrics.failureRate), 0.15),
                            color: getFailureColor(report.metrics.failureRate),
                            fontWeight: 700,
                            border: `2px solid ${alpha(getFailureColor(report.metrics.failureRate), 0.3)}`
                          }}
                        />
                      </TableCell>

                      {/* Actions */}
                      <TableCell>
                        <Stack direction="row" spacing={1}>
                          <IconButton
                            size="small"
                            sx={{
                              background: alpha("#667eea", 0.1),
                              color: "#667eea",
                              "&:hover": {
                                background: alpha("#667eea", 0.2)
                              }
                            }}
                          >
                            <AssessmentIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            sx={{
                              background: alpha("#667eea", 0.1),
                              color: "#667eea",
                              "&:hover": {
                                background: alpha("#667eea", 0.2)
                              }
                            }}
                          >
                            <DownloadIcon fontSize="small" />
                          </IconButton>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>

          {/* TABLE FOOTER */}
          {filteredReports.length > 0 && (
            <Box
              sx={{
                p: 3,
                borderTop: `1px solid ${alpha("#667eea", 0.1)}`,
                background: alpha("#667eea", 0.02)
              }}
            >
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography variant="body2" color="text.secondary">
                  Showing {filteredReports.length} of {reports.length} reports
                </Typography>
                <Typography variant="caption" color="text.secondary" fontStyle="italic">
                  Auto-generated compliance analytics
                </Typography>
              </Stack>
            </Box>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default ReportList;