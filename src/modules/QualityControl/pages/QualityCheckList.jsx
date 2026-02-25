// UPDATED QualityCheckList.jsx - Uses real API

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
  Tooltip, CircularProgress
} from "@mui/material";

// ✅ CHANGE: Import API functions
import { getAllProducts } from "../../product-bom/api/productApi";
import { getAllQualityChecks } from "../../QualityControl/api/qualityCheckApi";

// Import quality check retrieval function
import { getQualityChecks } from "../entities/quality";
import { getCurrentUser } from "../../../auth/authApi";

// Material-UI Icons
import VerifiedIcon from '@mui/icons-material/Verified';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import AssignmentIcon from '@mui/icons-material/Assignment';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import RefreshIcon from '@mui/icons-material/Refresh';
import FilterListIcon from '@mui/icons-material/FilterList';
import ScienceIcon from '@mui/icons-material/Science';

import HomeIcon from "@mui/icons-material/Home";

import { useNavigate } from "react-router-dom";

// ============================================================
// MAIN COMPONENT: QualityCheckList
// REASON: Display all completed quality inspections with statistics
// ============================================================
const QualityCheckList = () => {
const [quality, setQuality] = useState([]);
const [products, setProducts] = useState([]);

// ✅ NEW: Loading and error states
const [loading, setLoading] = useState(true);
const [error, setError] = useState("");

const navigate = useNavigate();
// ✅ NEWLY ADDED - Get current user to check role
const user = getCurrentUser();
const isAdmin = user?.role === 'admin';

// ✅ NEWLY ADDED - Handler for home icon click (admin only)
const handleHomeClick = () => {
  navigate('/analytics');
};

// ✅ CHANGE: Load from API
useEffect(() => {
const loadData = async () => {
try {
setLoading(true);
setError("");

const [qualityData, productsData] = await Promise.all([
getAllQualityChecks(),
getAllProducts()
]);

setQuality(qualityData);
setProducts(productsData);
} catch (err) {
console.error("Failed to load data:", err);
setError(err.message);
} finally {
setLoading(false);
}
};

loadData();
}, []);

// ✅ NEW: Refresh function
const handleRefresh = async () => {
try {
setLoading(true);
setError("");

const qualityData = await getAllQualityChecks();
setQuality(qualityData);
} catch (err) {
console.error("Failed to refresh:", err);
setError(err.message);
} finally {
setLoading(false);
}
};

// Statistics
const stats = {
total: quality.length,
passed: quality.filter(q => q.result === "PASS").length,
failed: quality.filter(q => q.result === "FAIL").length,
avgSuccessRate: quality.length > 0
? (quality.reduce((acc, q) => acc + q.successRate, 0) / quality.length).toFixed(1)
: 0
};

// ✅ NEW: Loading state
if (loading && quality.length === 0) {
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

// Empty state
if (!quality.length && !loading) {
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
<VerifiedIcon sx={{ color: "white", fontSize: 28 }} />
</Box>
<Box>
<Typography variant="h4" fontWeight="700" color="text.primary">
Quality Inspections
</Typography>
<Typography variant="body2" color="text.secondary">
{quality.length} inspection records
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

{/* STATISTICS */}
<Grid container spacing={2} mb={3}>

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

{/* QUALITY CHECK CARDS */}
<Grid container spacing={3}>
{quality.map(qc => {
const product = products.find(p => p.id === qc.productId)?.name || "Unknown";

const isPassed = qc.result === "PASS";

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
<Box sx={{ height: 6, background: resultConfig.gradient }} />

<CardContent sx={{ p: 3 }}>
<Stack spacing={2.5}>

<Stack
direction="row"
justifyContent="space-between"
alignItems="flex-start"
spacing={1}
>
<Box flex={1}>
<Typography variant="h6" fontWeight="700" color="text.primary">
{product}
</Typography>
<Typography variant="caption" color="text.secondary">
QC #{qc.qcId}
</Typography>
</Box>

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
<Typography variant="body2" fontWeight="700" color="#667eea">
#{qc.workOrderId.substring(0, 8)}...
</Typography>
</Stack>
</Paper>

<Divider />

<Stack spacing={2}>

<Box>
<Stack direction="row" justifyContent="space-between" mb={1}>
<Typography variant="body2" color="text.secondary">
Acceptance Rate
</Typography>
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

<Stack
direction="row"
spacing={2}
sx={{
p: 2,
borderRadius: 2,
background: alpha(resultConfig.color, 0.05)
}}
>
<Box flex={1}>
<Typography variant="caption" color="text.secondary">
Accepted
</Typography>
<Typography variant="h6" fontWeight="700" color={resultConfig.color}>
{qc.acceptedQty}
</Typography>
</Box>

<Divider orientation="vertical" flexItem />

<Box flex={1}>
<Typography variant="caption" color="text.secondary">
Total
</Typography>
<Typography variant="h6" fontWeight="700" color="text.primary">
{qc.totalQty}
</Typography>
</Box>

<Divider orientation="vertical" flexItem />

<Box flex={1}>
<Typography variant="caption" color="text.secondary">
Rejected
</Typography>
<Typography
variant="h6"
fontWeight="700"
color={isPassed ? "text.secondary" : resultConfig.color}
>
{qc.rejectedQty}
</Typography>
</Box>
</Stack>
</Stack>

<Divider />

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

<Stack direction="row" spacing={1} alignItems="center" justifyContent="center">
<CalendarTodayIcon sx={{ fontSize: 14, color: "text.secondary" }} />
<Typography variant="caption" color="text.secondary">
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

export default QualityCheckList;