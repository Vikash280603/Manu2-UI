
// UPDATED CreateQuality.jsx - Uses real API

import React, { useEffect, useState } from "react";
import {
Card, CardContent, Typography, TextField, Button, Stack,
Divider, Box, Container, Paper, Grid, alpha, Chip, IconButton,
LinearProgress, InputAdornment, CircularProgress, Alert
} from "@mui/material";

import { useParams, useNavigate } from "react-router-dom";

// ✅ CHANGE: Import API functions
import { createQualityCheck } from "../../QualityControl/api/qualityCheckApi";
import { getWorkOrderById } from "../../ProductionScheduling/api/workOrderApi";
import { getAllProducts } from "../../product-bom/api/productApi";

import VerifiedIcon from '@mui/icons-material/Verified';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import InventoryIcon from '@mui/icons-material/Inventory';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ScienceIcon from '@mui/icons-material/Science';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import WarningIcon from '@mui/icons-material/Warning';

const QualityCreate = () => {
const { workOrderId } = useParams();
const navigate = useNavigate();

// ✅ NEW: State for data
const [order, setOrder] = useState(null);
const [products, setProducts] = useState([]);

const [accepted, setAccepted] = useState(0);
const [remarks, setRemarks] = useState("");

// ✅ NEW: Loading and error states
const [loading, setLoading] = useState(true);
const [submitting, setSubmitting] = useState(false);
const [error, setError] = useState("");

// ✅ CHANGE: Load data from API
useEffect(() => {
const loadData = async () => {
try {
setLoading(true);
setError("");

const [orderData, productsData] = await Promise.all([
getWorkOrderById(workOrderId),
getAllProducts()
]);

setOrder(orderData);
setProducts(productsData);
} catch (err) {
console.error("Failed to load data:", err);
setError(err.message);
} finally {
setLoading(false);
}
};

loadData();
}, [workOrderId]);

// ✅ CHANGE: Submit via API
const submitQuality = async () => {
try {
setSubmitting(true);
setError("");

const qualityCheckData = {
workOrderId: order.workOrderId,
acceptedQty: accepted,
remarks: remarks || null
};

await createQualityCheck(qualityCheckData);

// Navigate back to work orders page
navigate("/workorder");
} catch (err) {
console.error("Failed to submit quality check:", err);
setError(err.message);
} finally {
setSubmitting(false);
}
};

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

// Error state (work order not found or failed to load)
if (!order || error) {
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
background: alpha("#ff6a00", 0.1),
display: "flex",
alignItems: "center",
justifyContent: "center",
margin: "0 auto",
mb: 3
}}
>
<WarningIcon sx={{ fontSize: 64, color: "#ff6a00" }} />
</Box>

<Typography variant="h4" fontWeight="700" mb={2} color="text.primary">
{error || "Invalid Work Order"}
</Typography>
<Typography variant="body1" color="text.secondary" mb={3}>
The work order you're looking for doesn't exist or has been removed
</Typography>

<Button
variant="contained"
onClick={() => navigate("/workorder")}
sx={{
background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
borderRadius: 3,
textTransform: "none",
fontWeight: 700,
px: 4,
py: 1.5
}}
>
Back to Work Orders
</Button>
</Paper>
</Container>
</Box>
);
}

const rejected = order.quantity - accepted;
const successRate = order.quantity > 0 ? Math.round((accepted / order.quantity) * 100) : 0;
const result = successRate >= 90 ? "PASS" : "FAIL";
const productName = products.find(p => p.id === order.productId)?.name || "Unknown";

const resultConfig = result === "PASS" ? {
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
<Box
sx={{
minHeight: "100vh",
background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
py: 4
}}
>
<Container maxWidth="lg">

{/* HEADER */}
<Paper
elevation={0}
sx={{
background: "rgba(255, 255, 255, 0.95)",
backdropFilter: "blur(10px)",
borderRadius: 4,
p: 3,
mb: 3
}}
>
<Stack direction="row" spacing={2} alignItems="center">
<IconButton
onClick={() => navigate("/workorder")}
sx={{
background: alpha("#667eea", 0.1),
color: "#667eea",
"&:hover": {
background: alpha("#667eea", 0.2)
}
}}
>
<ArrowBackIcon />
</IconButton>

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

<Box flex={1}>
<Typography variant="h4" fontWeight="700" color="text.primary">
Quality Inspection
</Typography>
<Typography variant="body2" color="text.secondary">
Verify and approve production quality
</Typography>
</Box>

<Chip
icon={<ScienceIcon />}
label="INSPECTION"
sx={{
background: alpha("#667eea", 0.1),
color: "#667eea",
fontWeight: 600,
fontSize: 14,
px: 1
}}
/>
</Stack>
</Paper>

{/* ✅ NEW: Error display */}
{error && (
<Alert severity="error" sx={{ mb: 3, borderRadius: 3 }} onClose={() => setError("")}>
{error}
</Alert>
)}

{/* MAIN CONTENT */}
<Grid container spacing={3}>

{/* LEFT: Form */}
<Grid item xs={12} md={7}>
<Paper
elevation={0}
sx={{
background: "rgba(255, 255, 255, 0.95)",
backdropFilter: "blur(10px)",
borderRadius: 4,
p: 4
}}
>
<Typography variant="h6" fontWeight="700" mb={3} color="text.primary">
Inspection Details
</Typography>

<Stack spacing={3}>

{/* Work Order Info */}
<Paper
sx={{
p: 3,
borderRadius: 3,
background: alpha("#667eea", 0.05),
border: `2px solid ${alpha("#667eea", 0.1)}`
}}
>
<Stack direction="row" spacing={2} alignItems="center" mb={2}>
<Box
sx={{
width: 40,
height: 40,
borderRadius: 2,
background: alpha("#667eea", 0.1),
display: "flex",
alignItems: "center",
justifyContent: "center"
}}
>
<AssignmentIcon sx={{ color: "#667eea" }} />
</Box>
<Box>
<Typography variant="h6" fontWeight="700" color="text.primary">
{productName}
</Typography>
<Typography variant="caption" color="text.secondary">
Work Order #{order.workOrderId.substring(0, 8)}...
</Typography>
</Box>
</Stack>
</Paper>

{/* Inspection Date */}
<Box>
<Typography variant="subtitle2" fontWeight="600" mb={1} color="text.secondary">
Inspection Date
</Typography>
<TextField
fullWidth
value={new Date().toISOString().split("T")[0]}
disabled
InputProps={{
startAdornment: (
<InputAdornment position="start">
<CalendarTodayIcon sx={{ color: "#667eea" }} />
</InputAdornment>
),
}}
sx={{
"& .MuiOutlinedInput-root": {
borderRadius: 3,
background: alpha("#667eea", 0.05),
"& fieldset": {
borderColor: alpha("#667eea", 0.2)
}
}
}}
/>
</Box>

{/* Total Quantity */}
<Box>
<Typography variant="subtitle2" fontWeight="600" mb={1} color="text.secondary">
Total Production Quantity
</Typography>
<TextField
fullWidth
value={order.quantity}
disabled
InputProps={{
startAdornment: (
<InputAdornment position="start">
<InventoryIcon sx={{ color: "#667eea" }} />
</InputAdornment>
),
endAdornment: (
<InputAdornment position="end">
<Typography variant="body2" fontWeight="600">units</Typography>
</InputAdornment>
)
}}
sx={{
"& .MuiOutlinedInput-root": {
borderRadius: 3,
background: alpha("#667eea", 0.05),
"& fieldset": {
borderColor: alpha("#667eea", 0.2)
}
}
}}
/>
</Box>

<Divider />

{/* Accepted Quantity */}
<Box>
<Typography variant="subtitle2" fontWeight="600" mb={1} color="text.secondary">
Accepted Quantity
</Typography>
<TextField
fullWidth
type="number"
value={accepted}
inputProps={{ min: 0, max: order.quantity }}
onChange={(e) =>
setAccepted(Math.min(order.quantity, Math.max(0, Number(e.target.value))))
}
InputProps={{
startAdornment: (
<InputAdornment position="start">
<CheckCircleIcon sx={{ color: "#38ef7d" }} />
</InputAdornment>
),
endAdornment: (
<InputAdornment position="end">
<Typography variant="body2" fontWeight="600">units</Typography>
</InputAdornment>
)
}}
sx={{
"& .MuiOutlinedInput-root": {
borderRadius: 3,
background: "white",
"& fieldset": {
borderColor: alpha("#38ef7d", 0.3)
},
"&:hover fieldset": {
borderColor: alpha("#38ef7d", 0.5)
},
"&.Mui-focused fieldset": {
borderColor: "#38ef7d"
}
}
}}
/>
</Box>

{/* Rejected Quantity */}
<Box>
<Typography variant="subtitle2" fontWeight="600" mb={1} color="text.secondary">
Rejected Quantity
</Typography>
<TextField
fullWidth
value={rejected}
disabled
InputProps={{
startAdornment: (
<InputAdornment position="start">
<CancelIcon sx={{ color: "#ff6a00" }} />
</InputAdornment>
),
endAdornment: (
<InputAdornment position="end">
<Typography variant="body2" fontWeight="600">units</Typography>
</InputAdornment>
)
}}
sx={{
"& .MuiOutlinedInput-root": {
borderRadius: 3,
background: alpha("#ff6a00", 0.05),
"& fieldset": {
borderColor: alpha("#ff6a00", 0.2)
}
}
}}
/>
</Box>

<Divider />

{/* Inspector Remarks */}
<Box>
<Typography variant="subtitle2" fontWeight="600" mb={1} color="text.secondary">
Inspector Remarks
</Typography>
<TextField
fullWidth
multiline
rows={4}
placeholder="Add any observations, defects found, or quality notes..."
value={remarks}
onChange={(e) => setRemarks(e.target.value)}
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

<Divider />

{/* Submit Button */}
<Button
fullWidth
variant="contained"
size="large"
startIcon={submitting ? <CircularProgress size={20} color="inherit" /> : <VerifiedIcon />}
onClick={submitQuality}
disabled={submitting}
sx={{
background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
borderRadius: 3,
textTransform: "none",
fontWeight: 700,
py: 1.8,
fontSize: 16,
boxShadow: "0 4px 20px rgba(102, 126, 234, 0.4)",
"&:hover": {
boxShadow: "0 6px 30px rgba(102, 126, 234, 0.5)"
},
"&:disabled": {
background: alpha("#667eea", 0.3),
color: "white"
}
}}
>
{submitting ? "Submitting..." : "Submit Quality Inspection"}
</Button>
</Stack>
</Paper>
</Grid>

{/* RIGHT: Results Preview */}
<Grid item xs={12} md={5}>
<Stack spacing={3}>

{/* Result Card */}
<Card
sx={{
borderRadius: 4,
overflow: "hidden",
background: "rgba(255, 255, 255, 0.95)",
backdropFilter: "blur(10px)",
border: `2px solid ${resultConfig.borderColor}`
}}
>
<Box sx={{ height: 6, background: resultConfig.gradient }} />

<CardContent sx={{ p: 3 }}>
<Stack spacing={2.5}>

<Stack direction="row" justifyContent="space-between" alignItems="center">
<Typography variant="h6" fontWeight="700" color="text.primary">
Inspection Result
</Typography>
<Chip
icon={resultConfig.icon}
label={result}
sx={{
background: resultConfig.bgColor,
color: resultConfig.color,
border: `2px solid ${resultConfig.borderColor}`,
fontWeight: 700,
fontSize: 14,
height: 36
}}
/>
</Stack>

<Divider />

<Box>
<Stack direction="row" justifyContent="space-between" mb={1}>
<Typography variant="body2" color="text.secondary">
Success Rate
</Typography>
<Typography variant="h5" fontWeight="800" color={resultConfig.color}>
{successRate}%
</Typography>
</Stack>
<LinearProgress
variant="determinate"
value={successRate}
sx={{
height: 12,
borderRadius: 6,
backgroundColor: resultConfig.bgColor,
"& .MuiLinearProgress-bar": {
backgroundColor: resultConfig.color,
borderRadius: 6
}
}}
/>
{successRate >= 90 && (
<Stack direction="row" spacing={0.5} alignItems="center" mt={1}>
<TrendingUpIcon sx={{ fontSize: 16, color: resultConfig.color }} />
<Typography variant="caption" fontWeight="600" color={resultConfig.color}>
Excellent Quality
</Typography>
</Stack>
)}
</Box>

<Divider />

<Grid container spacing={2}>
<Grid item xs={4}>
<Paper
sx={{
p: 2,
borderRadius: 2,
background: alpha("#38ef7d", 0.1),
textAlign: "center"
}}
>
<Typography variant="caption" color="text.secondary" fontWeight="600">
ACCEPTED
</Typography>
<Typography variant="h5" fontWeight="800" color="#11998e" mt={0.5}>
{accepted}
</Typography>
</Paper>
</Grid>

<Grid item xs={4}>
<Paper
sx={{
p: 2,
borderRadius: 2,
background: alpha("#667eea", 0.1),
textAlign: "center"
}}
>
<Typography variant="caption" color="text.secondary" fontWeight="600">
TOTAL
</Typography>
<Typography variant="h5" fontWeight="800" color="#667eea" mt={0.5}>
{order.quantity}
</Typography>
</Paper>
</Grid>

<Grid item xs={4}>
<Paper
sx={{
p: 2,
borderRadius: 2,
background: alpha("#ff6a00", 0.1),
textAlign: "center"
}}
>
<Typography variant="caption" color="text.secondary" fontWeight="600">
REJECTED
</Typography>
<Typography variant="h5" fontWeight="800" color="#ff6a00" mt={0.5}>
{rejected}
</Typography>
</Paper>
</Grid>
</Grid>
</Stack>
</CardContent>
</Card>

{/* Quality Standards */}
<Paper
sx={{
background: "rgba(255, 255, 255, 0.95)",
backdropFilter: "blur(10px)",
borderRadius: 4,
p: 3
}}
>
<Stack direction="row" spacing={2} mb={2}>
<Box
sx={{
width: 40,
height: 40,
borderRadius: 2,
background: alpha("#667eea", 0.1),
display: "flex",
alignItems: "center",
justifyContent: "center"
}}
>
<ScienceIcon sx={{ color: "#667eea" }} />
</Box>
<Box>
<Typography variant="subtitle1" fontWeight="700" color="text.primary">
Quality Standards
</Typography>
</Box>
</Stack>

<Stack spacing={1.5}>
<Stack direction="row" spacing={1} alignItems="center">
<Box
sx={{
width: 8,
height: 8,
borderRadius: "50%",
background: "#38ef7d"
}}
/>
<Typography variant="body2" color="text.secondary">
<strong>PASS:</strong> Success rate ≥ 90%
</Typography>
</Stack>

<Stack direction="row" spacing={1} alignItems="center">
<Box
sx={{
width: 8,
height: 8,
borderRadius: "50%",
background: "#ff6a00"
}}
/>
<Typography variant="body2" color="text.secondary">
<strong>FAIL:</strong> Success rate &lt; 90%
</Typography>
</Stack>

<Divider sx={{ my: 1 }} />

<Typography variant="caption" color="text.secondary" fontStyle="italic">
Results are automatically calculated based on acceptance criteria
</Typography>
</Stack>
</Paper>
</Stack>
</Grid>
</Grid>
</Container>
</Box>
);
};

export default QualityCreate;
