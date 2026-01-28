// ============================================================
// IMPORTS: React hooks and Material-UI components
// ============================================================
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

// Import report retrieval function
import { getReports } from "../entities/reports";

// Material-UI Icons
import AssessmentIcon from '@mui/icons-material/Assessment';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import DownloadIcon from '@mui/icons-material/Download';
import SearchIcon from '@mui/icons-material/Search';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import FilterListIcon from '@mui/icons-material/FilterList';

// ============================================================
// MAIN COMPONENT: ReportList
// REASON: Display all generated compliance reports in a searchable table
// ============================================================
const ReportList = () => {
  // ============================================================
  // STATE 1: reports (All generated reports)
  // SYNTAX: const [reports, setReports] = useState([]);
  // REASON: Store all reports fetched from storage
  // ============================================================
  const [reports, setReports] = useState([]);

  // ============================================================
  // STATE 2: searchTerm (User's search input)
  // SYNTAX: const [searchTerm, setSearchTerm] = useState("");
  // REASON: Track what user types in search box
  // ============================================================
  const [searchTerm, setSearchTerm] = useState("");

  // ============================================================
  // HOOK: useEffect (Load reports on component mount)
  // LOGIC: Runs once when component loads ([] dependency)
  // REASON: Fetch all reports from localStorage on page open
  // ============================================================
  useEffect(() => {
    setReports(getReports());
  }, []);

  // ============================================================
  // COMPUTED VALUE 1: filteredReports
  // SYNTAX: const filteredReports = reports.filter(report => ...);
  // LOGIC:
  //   - .filter() = create new array with matching items
  //   - report.reportId.toLowerCase() = convert ID to lowercase
  //   - .includes(searchTerm.toLowerCase()) = check if ID contains search text
  //   - Case-insensitive search: "RPT-123" matches "rpt-123"
  //
  // EXAMPLE:
  //   reports = [
  //     {reportId: "RPT-1704067245123", ...},
  //     {reportId: "RPT-1704067300000", ...},
  //     {reportId: "RPT-1704067400000", ...}
  //   ]
  //   searchTerm = "1704067245"
  //   
  //   filteredReports = [
  //     {reportId: "RPT-1704067245123", ...}  ← only this matches
  //   ]
  //
  // REASON: Show only reports matching user's search
  // ============================================================
  const filteredReports = reports.filter(report =>
    report.reportId.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ============================================================
  // FUNCTION 1: getSuccessColor
  // SYNTAX: const getSuccessColor = (rate) => { ... };
  // LOGIC: Return color based on success rate percentage
  //   - rate >= 80 → Green (#38ef7d) = Excellent
  //   - rate >= 60 → Orange (#f39c12) = Good
  //   - rate < 60 → Red (#ff6a00) = Poor
  //
  // REASON: Color-code success rate for quick visual assessment
  // ============================================================
  const getSuccessColor = (rate) => {
    if (rate >= 80) return "#38ef7d";    // Green: Excellent
    if (rate >= 60) return "#f39c12";    // Orange: Good
    return "#ff6a00";                    // Red: Poor
  };

  // ============================================================
  // FUNCTION 2: getFailureColor
  // SYNTAX: const getFailureColor = (rate) => { ... };
  // LOGIC: Return color based on failure rate percentage
  //   - rate <= 20 → Green (#38ef7d) = Excellent (low failure)
  //   - rate <= 40 → Orange (#f39c12) = Good (moderate failure)
  //   - rate > 40 → Red (#ff6a00) = Poor (high failure)
  //
  // NOTE: Inverse logic from success color!
  //   - Low failure rate = good (green)
  //   - High failure rate = bad (red)
  //
  // REASON: Color-code failure rate for quick visual assessment
  // ============================================================
  const getFailureColor = (rate) => {
    if (rate <= 20) return "#38ef7d";    // Green: Low failure (good)
    if (rate <= 40) return "#f39c12";    // Orange: Moderate failure
    return "#ff6a00";                    // Red: High failure (bad)
  };

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
                  Compliance Reports
                </Typography>
                {/* Show count of reports */}
                <Typography variant="body2" color="text.secondary">
                  {reports.length} reports generated
                </Typography>
              </Box>
            </Stack>

            {/* Action buttons section */}
            <Stack direction="row" spacing={2}>
              {/* Filter button */}
              <Button
                variant="outlined"
                startIcon={<FilterListIcon />}
                sx={{
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 600,
                  borderColor: alpha("#667eea", 0.3),
                  color: "#667eea",
                  "&:hover": {
                    borderColor: "#667eea",
                    background: alpha("#667eea", 0.05)
                  }
                }}
              >
                Filter
              </Button>

              {/* Export button */}
              <Button
                variant="contained"
                startIcon={<DownloadIcon />}
                sx={{
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 600,
                  px: 3,
                  boxShadow: "0 4px 20px rgba(102, 126, 234, 0.4)"
                }}
              >
                Export
              </Button>
            </Stack>
          </Stack>

          {/* ===== SEARCH BAR ===== */}
          <Box mt={3}>
            <TextField
              fullWidth
              placeholder="Search by Report ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon sx={{ color: "#667eea" }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 3,
                  background: "white",
                  "& fieldset": {
                    borderColor: alpha("#667eea", 0.2)
                  },
                  "&:hover fieldset": {
                    borderColor: alpha("#667eea", 0.4)
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#667eea"
                  }
                }
              }}
            />
          </Box>
        </Paper>

        {/* ===== STATISTICS CARDS ===== */}
        <Stack direction={{ xs: "column", md: "row" }} spacing={2} mb={3}>
          
          {/* Average Success Rate Card */}
          <Paper
            sx={{
              flex: 1,
              p: 3,
              borderRadius: 3,
              background: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
              position: "relative",
              overflow: "hidden"
            }}
          >
            <Stack spacing={1}>
              <Typography variant="overline" sx={{ color: "rgba(255,255,255,0.9)", fontWeight: 600 }}>
                Average Success Rate
              </Typography>
              {/* Calculate average of all success rates */}
              <Typography variant="h3" fontWeight="800" color="white">
                {reports.length > 0
                  ? (reports.reduce((acc, r) => acc + r.metrics.successRate, 0) / reports.length).toFixed(1)
                  : 0}%
              </Typography>
              <Chip
                icon={<TrendingUpIcon />}
                label="Above Target"
                size="small"
                sx={{
                  background: "rgba(255, 255, 255, 0.2)",
                  color: "white",
                  fontWeight: 600,
                  alignSelf: "flex-start"
                }}
              />
            </Stack>
            {/* Decorative circle */}
            <Box
              sx={{
                position: "absolute",
                bottom: -20,
                right: -20,
                width: 120,
                height: 120,
                borderRadius: "50%",
                background: "rgba(255, 255, 255, 0.1)"
              }}
            />
          </Paper>

          {/* Average Failure Rate Card */}
          <Paper
            sx={{
              flex: 1,
              p: 3,
              borderRadius: 3,
              background: "linear-gradient(135deg, #ee0979 0%, #ff6a00 100%)",
              position: "relative",
              overflow: "hidden"
            }}
          >
            <Stack spacing={1}>
              <Typography variant="overline" sx={{ color: "rgba(255,255,255,0.9)", fontWeight: 600 }}>
                Average Failure Rate
              </Typography>
              {/* Calculate average of all failure rates */}
              <Typography variant="h3" fontWeight="800" color="white">
                {reports.length > 0
                  ? (reports.reduce((acc, r) => acc + r.metrics.failureRate, 0) / reports.length).toFixed(1)
                  : 0}%
              </Typography>
              <Chip
                icon={<TrendingDownIcon />}
                label="Monitor Closely"
                size="small"
                sx={{
                  background: "rgba(255, 255, 255, 0.2)",
                  color: "white",
                  fontWeight: 600,
                  alignSelf: "flex-start"
                }}
              />
            </Stack>
            {/* Decorative circle */}
            <Box
              sx={{
                position: "absolute",
                bottom: -20,
                right: -20,
                width: 120,
                height: 120,
                borderRadius: "50%",
                background: "rgba(255, 255, 255, 0.1)"
              }}
            />
          </Paper>

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

        {/* ===== REPORTS TABLE ===== */}
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
              {/* ===== TABLE HEADER ===== */}
              <TableHead>
                <TableRow
                  sx={{
                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                  }}
                >
                  {/* Report ID column header */}
                  <TableCell sx={{ color: "white", fontWeight: 700, fontSize: 16 }}>
                    Report ID
                  </TableCell>

                  {/* Generated Date column header */}
                  <TableCell sx={{ color: "white", fontWeight: 700, fontSize: 16 }}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <CalendarTodayIcon sx={{ fontSize: 18 }} />
                      <span>Generated Date</span>
                    </Stack>
                  </TableCell>

                  {/* Success Rate column header */}
                  <TableCell sx={{ color: "white", fontWeight: 700, fontSize: 16 }}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <CheckCircleIcon sx={{ fontSize: 18 }} />
                      <span>Success Rate</span>
                    </Stack>
                  </TableCell>

                  {/* Failure Rate column header */}
                  <TableCell sx={{ color: "white", fontWeight: 700, fontSize: 16 }}>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <ErrorIcon sx={{ fontSize: 18 }} />
                      <span>Failure Rate</span>
                    </Stack>
                  </TableCell>

                  {/* Actions column header */}
                  <TableCell sx={{ color: "white", fontWeight: 700, fontSize: 16 }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>

              {/* ===== TABLE BODY ===== */}
              <TableBody>
                {/* EMPTY STATE: Show when no reports found */}
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
                  // REPORTS: Loop through filtered reports and display each row
                  filteredReports.map((r, index) => (
                    <TableRow
                      key={r.reportId}
                      sx={{
                        "&:hover": {
                          background: alpha("#667eea", 0.05)
                        },
                        transition: "all 0.2s ease"
                      }}
                    >
                      {/* Column 1: Report ID */}
                      <TableCell>
                        <Stack direction="row" spacing={1} alignItems="center">
                          {/* Colored dot indicator */}
                          <Box
                            sx={{
                              width: 8,
                              height: 8,
                              borderRadius: "50%",
                              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                            }}
                          />
                          {/* Report ID text */}
                          <Typography fontWeight="600" color="text.primary">
                            {r.reportId}
                          </Typography>
                        </Stack>
                      </TableCell>

                      {/* Column 2: Generated Date */}
                      <TableCell>
                        {/* Date in format: "January 1, 2024" */}
                        <Typography variant="body2" color="text.secondary">
                          {new Date(r.generatedDate).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric"
                          })}
                        </Typography>
                        {/* Time in format: "10:30 AM" */}
                        <Typography variant="caption" color="text.secondary">
                          {new Date(r.generatedDate).toLocaleTimeString("en-US", {
                            hour: "2-digit",
                            minute: "2-digit"
                          })}
                        </Typography>
                      </TableCell>

                      {/* Column 3: Success Rate */}
                      <TableCell>
                        {/* Color-coded chip with success rate */}
                        <Chip
                          icon={<CheckCircleIcon />}
                          label={`${r.metrics.successRate}%`}
                          sx={{
                            // Get color based on rate (green/orange/red)
                            background: alpha(getSuccessColor(r.metrics.successRate), 0.15),
                            color: getSuccessColor(r.metrics.successRate),
                            fontWeight: 700,
                            border: `2px solid ${alpha(getSuccessColor(r.metrics.successRate), 0.3)}`
                          }}
                        />
                      </TableCell>

                      {/* Column 4: Failure Rate */}
                      <TableCell>
                        {/* Color-coded chip with failure rate */}
                        <Chip
                          icon={<ErrorIcon />}
                          label={`${r.metrics.failureRate}%`}
                          sx={{
                            // Get color based on rate (green/orange/red)
                            background: alpha(getFailureColor(r.metrics.failureRate), 0.15),
                            color: getFailureColor(r.metrics.failureRate),
                            fontWeight: 700,
                            border: `2px solid ${alpha(getFailureColor(r.metrics.failureRate), 0.3)}`
                          }}
                        />
                      </TableCell>

                      {/* Column 5: Actions */}
                      <TableCell>
                        <Stack direction="row" spacing={1}>
                          {/* View button */}
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

                          {/* Download button */}
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

          {/* ===== TABLE FOOTER ===== */}
          {filteredReports.length > 0 && (
            <Box
              sx={{
                p: 3,
                borderTop: `1px solid ${alpha("#667eea", 0.1)}`,
                background: alpha("#667eea", 0.02)
              }}
            >
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                {/* Show count of displayed vs total */}
                <Typography variant="body2" color="text.secondary">
                  Showing {filteredReports.length} of {reports.length} reports
                </Typography>
                {/* Info note */}
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

// ============================================================
// EXPORT: Make component available
// ============================================================
export default ReportList;