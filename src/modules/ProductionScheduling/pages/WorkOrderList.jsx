
import React, { useEffect, useState } from "react";
import {
Box, Card, CardContent, Typography, Grid, Button, Chip,
Stack, Alert, Divider, Container, Paper, alpha, LinearProgress,
IconButton, Badge, CircularProgress, Avatar, Tooltip
} from "@mui/material";

import { useNavigate, useLocation } from "react-router-dom";

import AddIcon from "@mui/icons-material/Add";
import InventoryIcon from "@mui/icons-material/Inventory2";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import AssignmentIcon from "@mui/icons-material/Assignment";
import VerifiedIcon from "@mui/icons-material/Verified";
import WorkIcon from "@mui/icons-material/Work";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import RefreshIcon from "@mui/icons-material/Refresh";
import LogoutIcon from "@mui/icons-material/Logout";

import HomeIcon from "@mui/icons-material/Home";

// ✅ CHANGE: Import API functions
import { getAllProducts } from "../../product-bom/api/productApi";
import { getCurrentUser } from "../../../auth/authApi";

import {
getAllWorkOrders,
allocateMaterials as allocateMaterialsApi,
completeWorkOrder as completeWorkOrderApi
} from "../api/workOrderApi";

const statusConfig = {
PLANNED: {
color: "#f39c12",
bgColor: alpha("#f39c12", 0.1),
borderColor: alpha("#f39c12", 0.3),
icon: <InventoryIcon />,
label: "Planned",
gradient: "linear-gradient(135deg, #f39c12 0%, #f1c40f 100%)"
},
IN_PROGRESS: {
color: "#3498db",
bgColor: alpha("#3498db", 0.1),
borderColor: alpha("#3498db", 0.3),
icon: <PlayArrowIcon />,
label: "In Progress",
gradient: "linear-gradient(135deg, #3498db 0%, #2980b9 100%)"
},
COMPLETED: {
color: "#38ef7d",
bgColor: alpha("#38ef7d", 0.1),
borderColor: alpha("#38ef7d", 0.3),
icon: <CheckCircleIcon />,
label: "Completed",
gradient: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)"
},
QUALITY_DONE: {
color: "#9b59b6",
bgColor: alpha("#9b59b6", 0.1),
borderColor: alpha("#9b59b6", 0.3),
icon: <VerifiedIcon />,
label: "Quality Approved",
gradient: "linear-gradient(135deg, #8e44ad 0%, #9b59b6 100%)"
}
};

const WorkOrderList = () => {
const navigate = useNavigate();
const location = useLocation();

const [orders, setOrders] = useState([]);
const [products, setProducts] = useState([]);
const [error, setError] = useState("");

// ✅ NEW: Loading states
const [loading, setLoading] = useState(true);
const [processingOrderId, setProcessingOrderId] = useState(null);

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

const [ordersData, productsData] = await Promise.all([
getAllWorkOrders(),
getAllProducts()
]);

setOrders(ordersData);
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

// Get product name
const getProductName = (id) =>
products.find((p) => p.id === id)?.name || "Unknown Product";

// ✅ CHANGE: Allocate materials via API
const handleAllocateMaterials = async (order) => {
try {
setError("");
setProcessingOrderId(order.workOrderId);

const updated = await allocateMaterialsApi(order.workOrderId);

// Update local state
setOrders(prev =>
prev.map(o => o.workOrderId === order.workOrderId ? updated : o)
);
} catch (err) {
console.error("Failed to allocate materials:", err);
setError(err.message);
} finally {
setProcessingOrderId(null);
}
};

// ✅ CHANGE: Complete order via API
const handleCompleteOrder = async (order) => {
try {
setError("");
setProcessingOrderId(order.workOrderId);

const updated = await completeWorkOrderApi(order.workOrderId);

// Update local state
setOrders(prev =>
prev.map(o => o.workOrderId === order.workOrderId ? updated : o)
);
} catch (err) {
console.error("Failed to complete order:", err);
setError(err.message);
} finally {
setProcessingOrderId(null);
}
};

// ✅ NEW: Refresh data
const handleRefresh = async () => {
try {
setLoading(true);
setError("");

const ordersData = await getAllWorkOrders();
setOrders(ordersData);
} catch (err) {
console.error("Failed to refresh:", err);
setError(err.message);
} finally {
setLoading(false);
}
};

// Statistics
const stats = {
planned: orders.filter(o => o.status === "PLANNED").length,
inProgress: orders.filter(o => o.status === "IN_PROGRESS").length,
completed: orders.filter(o => o.status === "COMPLETED").length,
qualityDone: orders.filter(o => o.status === "QUALITY_DONE").length
};

// ✅ CHANGE: Empty state check with loading
if (loading && orders.length === 0) {
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
{/* ✅ UPDATED: Conditionally show Home icon for admin or Work icon for others */}
  {isAdmin ? (
    <Tooltip title="Go to Analytics">
      <Avatar 
        onClick={handleHomeClick}
        sx={{ 
          bgcolor: '#667eea', 
          cursor: 'pointer',  // ✅ Pointer cursor
          '&:hover': {  // ✅ Hover effect
            transform: 'scale(1.1)',
            boxShadow: '0 4px 12px rgba(243, 156, 18, 0.3)',
          },
          transition: 'all 0.3s ease',
        }}
      >  
        <HomeIcon sx={{ color: 'white' }} />  {/* ✅ Home icon for admin */}
      </Avatar>
    </Tooltip>
  ) : (
    <Box sx={{ bgcolor: '#f39c12', p: 1.5, borderRadius: 2 }}>
      <WorkIcon sx={{ color: 'white', fontSize: 24 }} />  {/* ✅ Work icon for non-admin */}
    </Box>
  )}
<Box>
<Typography variant="h4" fontWeight="700" color="text.primary">
Production Work Orders
</Typography>
<Typography variant="body2" color="text.secondary">
Track, allocate & complete production tasks
</Typography>
</Box>
</Stack>

<Stack direction="row" spacing={3}>
{/* ✅ NEW: Refresh button */}
<IconButton
onClick={handleRefresh}
disabled={loading}
sx={{
background: alpha("#667eea", 0.1),
color: "#667eea",
"&:hover": {
background: alpha("#667eea", 0.2)
}
}}
>
<RefreshIcon />
</IconButton>

<Button
variant="contained"
startIcon={<AddIcon />}
onClick={() => navigate(`${location.pathname}/create`)}
sx={{
background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
borderRadius: 2,
textTransform: "none",
fontWeight: 600,
px: 3,
boxShadow: "0 4px 20px rgba(102, 126, 234, 0.4)"
}}
>
New Work Order
</Button>
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
{/* CONDITIONAL CONTENT - Empty state or Data */}
{orders.length === 0 && !loading ? (
// Empty state
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
<AssignmentIcon sx={{ fontSize: 64, color: "#667eea" }} />
</Box>

<Typography variant="h4" fontWeight="700" mb={2} color="text.primary">
No Work Orders Yet
</Typography>
<Typography variant="body1" color="text.secondary" mb={4}>
Start by creating your first production order and track your manufacturing workflow
</Typography>

<Button
variant="contained"
size="large"
startIcon={<AddIcon />}
onClick={() => navigate(`${location.pathname}/create`)}
sx={{
background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
borderRadius: 3,
textTransform: "none",
fontWeight: 700,
py: 1.5,
px: 4,
fontSize: 16,
boxShadow: "0 4px 20px rgba(102, 126, 234, 0.4)"
}}
>
Create First Work Order
</Button>
</Paper>
</Container>
) : (
<>
{/* STATISTICS */}
<Grid container spacing={2} mb={3}>
<Grid item xs={6} sm={3}>
<Paper
sx={{
p: 2.5,
borderRadius: 3,
background: "rgba(255, 255, 255, 0.95)",
backdropFilter: "blur(10px)",
border: `2px solid ${alpha("#f39c12", 0.2)}`
}}
>
<Stack direction="row" spacing={2} alignItems="center">
<Box
sx={{
width: 50,
height: 50,
borderRadius: 2,
background: alpha("#f39c12", 0.1),
display: "flex",
alignItems: "center",
justifyContent: "center"
}}
>
<InventoryIcon sx={{ color: "#f39c12", fontSize: 28 }} />
</Box>
<Box>
<Typography variant="h4" fontWeight="800" color="#f39c12">
{stats.planned}
</Typography>
<Typography variant="caption" color="text.secondary" fontWeight="600">
PLANNED
</Typography>
</Box>
</Stack>
</Paper>
</Grid>

<Grid item xs={6} sm={3}>
<Paper
sx={{
p: 2.5,
borderRadius: 3,
background: "rgba(255, 255, 255, 0.95)",
backdropFilter: "blur(10px)",
border: `2px solid ${alpha("#3498db", 0.2)}`
}}
>
<Stack direction="row" spacing={2} alignItems="center">
<Box
sx={{
width: 50,
height: 50,
borderRadius: 2,
background: alpha("#3498db", 0.1),
display: "flex",
alignItems: "center",
justifyContent: "center"
}}
>
<PlayArrowIcon sx={{ color: "#3498db", fontSize: 28 }} />
</Box>
<Box>
<Typography variant="h4" fontWeight="800" color="#3498db">
{stats.inProgress}
</Typography>
<Typography variant="caption" color="text.secondary" fontWeight="600">
IN PROGRESS
</Typography>
</Box>
</Stack>
</Paper>
</Grid>

<Grid item xs={6} sm={3}>
<Paper
sx={{
p: 2.5,
borderRadius: 3,
background: "rgba(255, 255, 255, 0.95)",
backdropFilter: "blur(10px)",
border: `2px solid ${alpha("#38ef7d", 0.2)}`
}}
>
<Stack direction="row" spacing={2} alignItems="center">
<Box
sx={{
width: 50,
height: 50,
borderRadius: 2,
background: alpha("#38ef7d", 0.1),
display: "flex",
alignItems: "center",
justifyContent: "center"
}}
>
<CheckCircleIcon sx={{ color: "#38ef7d", fontSize: 28 }} />
</Box>
<Box>
<Typography variant="h4" fontWeight="800" color="#11998e">
{stats.completed}
</Typography>
<Typography variant="caption" color="text.secondary" fontWeight="600">
COMPLETED
</Typography>
</Box>
</Stack>
</Paper>
</Grid>

<Grid item xs={6} sm={3}>
<Paper
sx={{
p: 2.5,
borderRadius: 3,
background: "rgba(255, 255, 255, 0.95)",
backdropFilter: "blur(10px)",
border: `2px solid ${alpha("#9b59b6", 0.2)}`
}}
>
<Stack direction="row" spacing={2} alignItems="center">
<Box
sx={{
width: 50,
height: 50,
borderRadius: 2,
background: alpha("#9b59b6", 0.1),
display: "flex",
alignItems: "center",
justifyContent: "center"
}}
>
<VerifiedIcon sx={{ color: "#9b59b6", fontSize: 28 }} />
</Box>
<Box>
<Typography variant="h4" fontWeight="800" color="#9b59b6">
{stats.qualityDone}
</Typography>
<Typography variant="caption" color="text.secondary" fontWeight="600">
APPROVED
</Typography>
</Box>
</Stack>
</Paper>
</Grid>
</Grid>

{/* ERROR ALERT */}
{error && (
<Alert
severity="error"
sx={{ mb: 3, borderRadius: 3 }}
onClose={() => setError("")}
>
{error}
</Alert>
)}

{/* WORK ORDER CARDS */}
<Grid container spacing={3}>
{orders.map((order) => {
const config = statusConfig[order.status] || {
color: "#95a5a6",
bgColor: alpha("#95a5a6", 0.1),
borderColor: alpha("#95a5a6", 0.3),
icon: <AssignmentIcon />,
label: order.status,
gradient: "linear-gradient(135deg, #95a5a6 0%, #7f8c8d 100%)"
};

const isProcessing = processingOrderId === order.workOrderId;

return (
<Grid item xs={12} sm={6} md={4} key={order.workOrderId}>
<Card
sx={{
borderRadius: 4,
overflow: "hidden",
background: "rgba(255, 255, 255, 0.95)",
backdropFilter: "blur(10px)",
border: `2px solid ${config.borderColor}`,
transition: "all 0.3s ease",
"&:hover": {
transform: "translateY(-4px)",
boxShadow: `0 12px 24px ${alpha(config.color, 0.2)}`
}
}}
>
<Box sx={{ height: 6, background: config.gradient }} />

<CardContent sx={{ p: 3 }}>
<Stack spacing={2}>

<Stack
direction="row"
justifyContent="space-between"
alignItems="flex-start"
spacing={1}
>
<Box flex={1}>
<Typography variant="h6" fontWeight="700" color="text.primary">
{getProductName(order.productId)}
</Typography>
<Typography variant="caption" color="text.secondary">
WO #{order.workOrderId.substring(0, 8)}...
</Typography>
</Box>

<Chip
icon={config.icon}
label={config.label}
sx={{
background: config.bgColor,
color: config.color,
border: `2px solid ${config.borderColor}`,
fontWeight: 700,
fontSize: 11
}}
/>
</Stack>

<Divider />

<Stack spacing={1.5}>
<Stack direction="row" justifyContent="space-between">
<Typography variant="body2" color="text.secondary">
Quantity
</Typography>
<Typography variant="body2" fontWeight="700" color="text.primary">
{order.quantity} units
</Typography>
</Stack>

{order.scheduledDate && (
<Stack direction="row" justifyContent="space-between" alignItems="center">
<Stack direction="row" spacing={0.5} alignItems="center">
<CalendarTodayIcon sx={{ fontSize: 14, color: "text.secondary" }} />
<Typography variant="body2" color="text.secondary">
Scheduled
</Typography>
</Stack>
<Typography variant="body2" fontWeight="600" color="text.primary">
{new Date(order.scheduledDate).toLocaleDateString("en-US", {
month: "short",
day: "numeric"
})}
</Typography>
</Stack>
)}
</Stack>

<Divider />

<Stack spacing={1}>
{order.status === "PLANNED" && (
<Button
fullWidth
variant="contained"
startIcon={isProcessing ? <CircularProgress size={20} color="inherit" /> : <InventoryIcon />}
onClick={() => handleAllocateMaterials(order)}
disabled={isProcessing}
sx={{
background: config.gradient,
borderRadius: 2,
textTransform: "none",
fontWeight: 700,
py: 1.2,
boxShadow: `0 4px 12px ${alpha(config.color, 0.3)}`,
"&:hover": {
boxShadow: `0 6px 16px ${alpha(config.color, 0.4)}`
}
}}
>
{isProcessing ? "Allocating..." : "Allocate Materials"}
</Button>
)}

{order.status === "IN_PROGRESS" && (
<Button
fullWidth
variant="contained"
startIcon={isProcessing ? <CircularProgress size={20} color="inherit" /> : <CheckCircleIcon />}
onClick={() => handleCompleteOrder(order)}
disabled={isProcessing}
sx={{
background: config.gradient,
borderRadius: 2,
textTransform: "none",
fontWeight: 700,
py: 1.2,
boxShadow: `0 4px 12px ${alpha(config.color, 0.3)}`,
"&:hover": {
boxShadow: `0 6px 16px ${alpha(config.color, 0.4)}`
}
}}
>
{isProcessing ? "Completing..." : "Mark Complete"}
</Button>
)}

{order.status === "COMPLETED" && (
<Button
fullWidth
variant="contained"
startIcon={<FactCheckIcon />}
onClick={() => navigate(`/quality/create/${order.workOrderId}`)}
sx={{
background: config.gradient,
borderRadius: 2,
textTransform: "none",
fontWeight: 700,
py: 1.2,
boxShadow: `0 4px 12px ${alpha(config.color, 0.3)}`,
"&:hover": {
boxShadow: `0 6px 16px ${alpha(config.color, 0.4)}`
}
}}
>
Quality Inspection
</Button>
)}

{order.status === "QUALITY_DONE" && (
<Button
fullWidth
variant="outlined"
startIcon={<VerifiedIcon />}
disabled
sx={{
borderRadius: 2,
textTransform: "none",
fontWeight: 700,
py: 1.2,
borderColor: config.borderColor,
color: config.color,
borderWidth: 2
}}
>
Quality Approved ✓
</Button>
)}
</Stack>
</Stack>
</CardContent>
</Card>
</Grid>
);
})}
</Grid>
</>
)}
</Container>
</Box>
);

};

export default WorkOrderList;