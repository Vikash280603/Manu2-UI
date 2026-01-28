// ============================================================
// IMPORTS: React hooks and Material-UI components
// ============================================================
import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Button,
  Chip,
  Stack,
  Alert,
  Divider,
  Container,
  Paper,
  alpha,
  LinearProgress,
  IconButton,
  Badge
} from "@mui/material";

// React Router hooks - navigation between pages
import { useNavigate, useLocation } from "react-router-dom";

// Material-UI Icons for different work order statuses
import AddIcon from "@mui/icons-material/Add";
import InventoryIcon from "@mui/icons-material/Inventory2";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import FactCheckIcon from "@mui/icons-material/FactCheck";
import AssignmentIcon from "@mui/icons-material/Assignment";
import VerifiedIcon from "@mui/icons-material/Verified";
import WorkIcon from "@mui/icons-material/Work";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import FilterListIcon from "@mui/icons-material/FilterList";
import RefreshIcon from "@mui/icons-material/Refresh";

// Import data sources
import { products } from "../../entities/product";
import { boms } from "../../entities/bom";
import { getWorkOrders, saveWorkOrders } from "../entities/workOrders";

// ============================================================
// CONSTANT: Storage key for inventory
// REASON: Same key used consistently to store/retrieve inventory
// ============================================================
const INVENTORY_KEY = "manutrack_inventory_v2";

// ============================================================
// CONSTANT: Status Configuration Object
// SYNTAX: const statusConfig = { PLANNED: {...}, IN_PROGRESS: {...}, ... }
// 
// LOGIC:
//   - Stores styling and metadata for each work order status
//   - Each status has:
//     * color: primary color for that status
//     * bgColor: background color (with transparency)
//     * borderColor: border color (with transparency)
//     * icon: icon component to display
//     * label: readable text label
//     * gradient: gradient background for buttons
//
// REASON:
//   - Consistent UI across all components
//   - Easy to change colors/icons in one place
//   - Reusable configuration for multiple status types
// 
// EXAMPLE:
//   statusConfig.PLANNED.color = "#f39c12" (orange)
//   statusConfig.IN_PROGRESS.color = "#3498db" (blue)
//   statusConfig.COMPLETED.color = "#38ef7d" (green)
//   statusConfig.QUALITY_DONE.color = "#9b59b6" (purple)
// ============================================================
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

// ============================================================
// MAIN COMPONENT: WorkOrderList
// REASON: Display and manage all work orders with status tracking
// ============================================================
const WorkOrderList = () => {
  // ============================================================
  // HOOK: useNavigate - navigate between pages
  // REASON: Move to create page or quality inspection page
  // ============================================================
  const navigate = useNavigate();

  // ============================================================
  // HOOK: useLocation - get current page info
  // REASON: Build navigation URLs relative to current page
  // ============================================================
  const location = useLocation();

  // ============================================================
  // STATE 1: orders (List of all work orders)
  // REASON: Store all work orders fetched from storage
  // ============================================================
  const [orders, setOrders] = useState([]);

  // ============================================================
  // STATE 2: error (Error message if operation fails)
  // REASON: Display error alerts when inventory allocation fails
  // ============================================================
  const [error, setError] = useState("");

  // ============================================================
  // HOOK: useEffect (Load work orders on mount)
  // LOGIC: Runs once when component loads
  // REASON: Fetch all work orders from storage on page open
  // ============================================================
  useEffect(() => {
    setOrders(getWorkOrders());
  }, []);

  // ============================================================
  // FUNCTION: getProductName
  // SYNTAX: const getProductName = (id) => ...
  // LOGIC: Find product by ID and return its name
  // REASON: Convert numeric product ID to readable name
  // ============================================================
  const getProductName = (id) =>
    products.find((p) => p.id === id)?.name || "Unknown Product";

  // ============================================================
  // FUNCTION: allocateMaterials
  // SYNTAX: const allocateMaterials = (order) => { ... }
  // 
  // LOGIC (3 Steps):
  //   STEP 1: Validate - Check if enough inventory exists
  //   STEP 2: Update - Deduct materials from inventory
  //   STEP 3: Complete - Change order status to IN_PROGRESS
  //
  // DETAILED FLOW:
  //   1. Get current inventory from storage
  //   2. Find inventory for this product
  //   3. Get all BOMs (materials needed) for this product
  //   4. For each material:
  //      a. Check: How much do we need? (bom.quantity × order.quantity)
  //      b. Verify: Do we have enough in inventory?
  //      c. If NO → show error and stop
  //      d. If YES → continue
  //   5. Deduct all materials from inventory
  //   6. Save updated inventory to storage
  //   7. Change order status from PLANNED → IN_PROGRESS
  //   8. Save updated orders to storage
  //
  // EXAMPLE:
  //   Order: Product 1, Quantity 100 units
  //   BOM: [Steel 5kg per unit, Plastic 2kg per unit]
  //   Needed: Steel 500kg (5×100), Plastic 200kg (2×100)
  //   Check inventory: Do we have 500kg Steel and 200kg Plastic?
  //   If YES → Deduct and mark as IN_PROGRESS
  //   If NO → Show "Insufficient inventory" error
  //
  // REASON: Allocate materials when starting production
  // ============================================================
  const allocateMaterials = (order) => {
    // Clear previous errors
    setError("");

    // Get current inventory
    const inventory = JSON.parse(localStorage.getItem(INVENTORY_KEY)) || [];

    // Find inventory for this product
    const invItem = inventory.find((i) => i.productId === order.productId);

    // Get all materials (BOMs) needed for this product
    const productBoms = boms.filter((b) => b.id === order.productId);

    // VALIDATION: Check if we have enough of each material
    for (let bom of productBoms) {
      // Find this material in inventory
      const mat = invItem?.materials.find((m) => m.materialName === bom.materialName);

      // Calculate total needed: material per unit × order quantity
      const required = bom.quantity * order.quantity;

      // If material missing or insufficient, show error
      if (!mat || mat.availableQty < required) {
        setError("Insufficient inventory for allocation.");
        return; // Stop execution
      }
    }

    // UPDATE INVENTORY: Deduct materials from stock
    const updatedInventory = inventory.map((inv) =>
      // Skip products that don't match
      inv.productId !== order.productId
        ? inv
        // For matching product, deduct materials
        : {
            ...inv,
            materials: inv.materials.map((mat) => {
              // Find BOM for this material
              const bom = productBoms.find((b) => b.materialName === mat.materialName);
              // If BOM exists, deduct required quantity
              return bom
                ? {
                    ...mat,
                    // Reduce available quantity
                    availableQty: mat.availableQty - bom.quantity * order.quantity
                  }
                : mat; // No change if no BOM found
            })
          }
    );

    // Save updated inventory to storage
    localStorage.setItem(INVENTORY_KEY, JSON.stringify(updatedInventory));

    // UPDATE ORDER STATUS: Change from PLANNED to IN_PROGRESS
    const updatedOrders = orders.map((o) =>
      o.workOrderId === order.workOrderId ? { ...o, status: "IN_PROGRESS" } : o
    );

    // Save updated orders to storage
    saveWorkOrders(updatedOrders);

    // Update state to refresh UI
    setOrders(updatedOrders);
  };

  // ============================================================
  // FUNCTION: completeOrder
  // SYNTAX: const completeOrder = (order) => { ... }
  // LOGIC: Change order status from IN_PROGRESS to COMPLETED
  // REASON: Mark production as complete, ready for QA
  // ============================================================
  const completeOrder = (order) => {
    // Map through orders and update the matching one
    const updatedOrders = orders.map((o) =>
      o.workOrderId === order.workOrderId ? { ...o, status: "COMPLETED" } : o
    );

    // Save to storage
    saveWorkOrders(updatedOrders);

    // Update state
    setOrders(updatedOrders);
  };

  // ============================================================
  // STATISTICS: Count orders in each status
  // REASON: Display summary dashboard at top of page
  // ============================================================
  const stats = {
    // Count orders with status = "PLANNED"
    planned: orders.filter(o => o.status === "PLANNED").length,

    // Count orders with status = "IN_PROGRESS"
    inProgress: orders.filter(o => o.status === "IN_PROGRESS").length,

    // Count orders with status = "COMPLETED"
    completed: orders.filter(o => o.status === "COMPLETED").length,

    // Count orders with status = "QUALITY_DONE"
    qualityDone: orders.filter(o => o.status === "QUALITY_DONE").length
  };

  // ============================================================
  // EMPTY STATE: Show when no orders exist
  // LOGIC: If orders array is empty, show this UI instead
  // REASON: Guide user to create first work order
  // ============================================================
  if (orders.length === 0) {
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
              <AssignmentIcon sx={{ fontSize: 64, color: "#667eea" }} />
            </Box>

            {/* Empty state text */}
            <Typography variant="h4" fontWeight="700" mb={2} color="text.primary">
              No Work Orders Yet
            </Typography>
            <Typography variant="body1" color="text.secondary" mb={4}>
              Start by creating your first production order and track your manufacturing workflow
            </Typography>

            {/* Button to create first order */}
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
      </Box>
    );
  }

  // ============================================================
  // MAIN UI: When orders exist
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
                <WorkIcon sx={{ color: "white", fontSize: 28 }} />
              </Box>
              <Box>
                <Typography variant="h4" fontWeight="700" color="text.primary">
                  Production Work Orders
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Track, allocate & complete production tasks
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

              {/* Create new work order button */}
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
            </Stack>
          </Stack>
        </Paper>

        {/* ===== STATISTICS DASHBOARD ===== */}
        <Grid container spacing={2} mb={3}>
          {/* PLANNED count card */}
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

          {/* IN_PROGRESS count card */}
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

          {/* COMPLETED count card */}
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

          {/* QUALITY_DONE count card */}
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

        {/* ===== ERROR ALERT ===== */}
        {error && (
          <Alert 
            severity="error" 
            sx={{ mb: 3, borderRadius: 3 }}
            onClose={() => setError("")}
          >
            {error}
          </Alert>
        )}

        {/* ===== WORK ORDER CARDS GRID ===== */}
        <Grid container spacing={3}>
          {orders.map((order) => {
            // Get styling config for this order's status
            const config = statusConfig[order.status] || {
              color: "#95a5a6",
              bgColor: alpha("#95a5a6", 0.1),
              borderColor: alpha("#95a5a6", 0.3),
              icon: <AssignmentIcon />,
              label: order.status,
              gradient: "linear-gradient(135deg, #95a5a6 0%, #7f8c8d 100%)"
            };

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
                  {/* Color bar indicating status */}
                  <Box sx={{ height: 6, background: config.gradient }} />

                  <CardContent sx={{ p: 3 }}>
                    <Stack spacing={2}>
                      
                      {/* HEADER: Product name and status badge */}
                      <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="flex-start"
                        spacing={1}
                      >
                        <Box flex={1}>
                          {/* Product name */}
                          <Typography variant="h6" fontWeight="700" color="text.primary">
                            {getProductName(order.productId)}
                          </Typography>
                          {/* Work order ID */}
                          <Typography variant="caption" color="text.secondary">
                            WO #{order.workOrderId}
                          </Typography>
                        </Box>

                        {/* Status badge */}
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

                      {/* ORDER DETAILS */}
                      <Stack spacing={1.5}>
                        {/* Quantity */}
                        <Stack direction="row" justifyContent="space-between">
                          <Typography variant="body2" color="text.secondary">
                            Quantity
                          </Typography>
                          <Typography variant="body2" fontWeight="700" color="text.primary">
                            {order.quantity} units
                          </Typography>
                        </Stack>

                        {/* Scheduled date (if exists) */}
                        {order.scheduledDate && (
                          <Stack direction="row" justifyContent="space-between" alignItems="center">
                            <Stack direction="row" spacing={0.5} alignItems="center">
                              <CalendarTodayIcon sx={{ fontSize: 14, color: "text.secondary" }} />
                              <Typography variant="body2" color="text.secondary">
                                Scheduled
                              </Typography>
                            </Stack>
                            {/* Format date as "Jan 15" */}
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

                      {/* ACTION BUTTONS - Change based on status */}
                      <Stack spacing={1}>
                        {/* STATUS 1: PLANNED → Show "Allocate Materials" button */}
                        {order.status === "PLANNED" && (
                          <Button
                            fullWidth
                            variant="contained"
                            startIcon={<InventoryIcon />}
                            onClick={() => allocateMaterials(order)}
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
                            Allocate Materials
                          </Button>
                        )}

                        {/* STATUS 2: IN_PROGRESS → Show "Mark Complete" button */}
                        {order.status === "IN_PROGRESS" && (
                          <Button
                            fullWidth
                            variant="contained"
                            startIcon={<CheckCircleIcon />}
                            onClick={() => completeOrder(order)}
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
                            Mark Complete
                          </Button>
                        )}

                        {/* STATUS 3: COMPLETED → Show "Quality Inspection" button */}
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

                        {/* STATUS 4: QUALITY_DONE → Show disabled "Approved" button */}
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
      </Container>
    </Box>
  );
};

// ============================================================
// EXPORT: Make component available
// ============================================================
export default WorkOrderList;