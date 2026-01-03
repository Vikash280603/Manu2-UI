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
import { useNavigate, useLocation } from "react-router-dom";

// Icons
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

import { products } from "../../entities/product";
import { boms } from "../../entities/bom";
import { getWorkOrders, saveWorkOrders } from "../entities/workOrders";

const INVENTORY_KEY = "manutrack_inventory_v2";

// Status UI Config
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
  const [error, setError] = useState("");

  useEffect(() => {
    setOrders(getWorkOrders());
  }, []);

  const getProductName = (id) =>
    products.find((p) => p.id === id)?.name || "Unknown Product";

  // Allocate Inventory → IN_PROGRESS
  const allocateMaterials = (order) => {
    setError("");

    const inventory = JSON.parse(localStorage.getItem(INVENTORY_KEY)) || [];
    const invItem = inventory.find((i) => i.productId === order.productId);
    const productBoms = boms.filter((b) => b.id === order.productId);

    for (let bom of productBoms) {
      const mat = invItem?.materials.find((m) => m.materialName === bom.materialName);
      const required = bom.quantity * order.quantity;

      if (!mat || mat.availableQty < required) {
        setError("Insufficient inventory for allocation.");
        return;
      }
    }

    const updatedInventory = inventory.map((inv) =>
      inv.productId !== order.productId
        ? inv
        : {
            ...inv,
            materials: inv.materials.map((mat) => {
              const bom = productBoms.find((b) => b.materialName === mat.materialName);
              return bom
                ? {
                    ...mat,
                    availableQty: mat.availableQty - bom.quantity * order.quantity
                  }
                : mat;
            })
          }
    );

    localStorage.setItem(INVENTORY_KEY, JSON.stringify(updatedInventory));

    const updatedOrders = orders.map((o) =>
      o.workOrderId === order.workOrderId ? { ...o, status: "IN_PROGRESS" } : o
    );

    saveWorkOrders(updatedOrders);
    setOrders(updatedOrders);
  };

  // Complete → COMPLETED
  const completeOrder = (order) => {
    const updatedOrders = orders.map((o) =>
      o.workOrderId === order.workOrderId ? { ...o, status: "COMPLETED" } : o
    );

    saveWorkOrders(updatedOrders);
    setOrders(updatedOrders);
  };

  // Statistics
  const stats = {
    planned: orders.filter(o => o.status === "PLANNED").length,
    inProgress: orders.filter(o => o.status === "IN_PROGRESS").length,
    completed: orders.filter(o => o.status === "COMPLETED").length,
    qualityDone: orders.filter(o => o.status === "QUALITY_DONE").length
  };

  // Empty State
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

            <Stack direction="row" spacing={2}>
              <IconButton
                sx={{
                  background: alpha("#667eea", 0.1),
                  color: "#667eea",
                  "&:hover": { background: alpha("#667eea", 0.2) }
                }}
              >
                <RefreshIcon />
              </IconButton>
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

        {/* Statistics Dashboard */}
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

        {/* Error Alert */}
        {error && (
          <Alert 
            severity="error" 
            sx={{ mb: 3, borderRadius: 3 }}
            onClose={() => setError("")}
          >
            {error}
          </Alert>
        )}

        {/* Work Order Cards */}
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
                  {/* Status Gradient Bar */}
                  <Box sx={{ height: 6, background: config.gradient }} />

                  <CardContent sx={{ p: 3 }}>
                    <Stack spacing={2}>
                      {/* Header */}
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
                            WO #{order.workOrderId}
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

                      {/* Details */}
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

                      {/* Actions */}
                      <Stack spacing={1}>
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
      </Container>
    </Box>
  );
};

export default WorkOrderList;