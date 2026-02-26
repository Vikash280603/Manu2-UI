// UPDATED InventoryList.jsx - Uses real API instead of localStorage

import React, { useEffect, useState, useMemo } from "react";
import {
  Card, CardContent, Typography, Grid, Chip, IconButton,
  Collapse, Stack, Divider, TextField, Box, LinearProgress,
  Paper, Tooltip, Avatar, alpha, Container, Button, CircularProgress, Alert
} from "@mui/material";

import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import LogoutIcon from '@mui/icons-material/Logout';

import HomeIcon from "@mui/icons-material/Home";

// ✅ CHANGE: Import API functions + product API
import { getAllInventories, adjustMaterialQuantity, updateMaterialThreshold } from "../../Inventory/api/inventoryApi";
import { getAllProducts } from "../../product-bom/api/productApi";
import { getCurrentUser } from "../../../auth/authApi";

import { useNavigate } from "react-router-dom";

const InventoryList = () => {
  const [inventory, setInventory] = useState([]);
  const [products, setProducts] = useState([]); // ✅ NEW: Store products for name lookup
  const [expandedId, setExpandedId] = useState(null);

  // ✅ NEW: Loading and error states
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();  // ✅ NEWLY ADDED

  // ✅ NEWLY ADDED - Get current user to check role
  const user = getCurrentUser();
  const isAdmin = user?.role === 'admin';

  // ✅ NEWLY ADDED - Handler for home icon click (admin only)
  const handleHomeClick = () => {
    navigate('/analytics');
  };

  // ✅ CHANGE: Load from API instead of localStorage
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError("");

        // Load both inventories and products
        const [inventoriesData, productsData] = await Promise.all([
          getAllInventories(),
          getAllProducts()
        ]);

        setInventory(inventoriesData);
        setProducts(productsData);
      } catch (err) {
        console.error("Failed to load inventory:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // ✅ CHANGE: Get product name from products array (loaded from API)
  const getProductName = (productId) => {
    return products.find((p) => p.id === productId)?.name || "Unknown Product";
  };

  // ✅ CHANGE: Update quantity via API
  const updateMaterialQty = async (inventoryId, materialId, delta) => {
    try {
      // Call backend API to adjust quantity
      const updated = await adjustMaterialQuantity(materialId, delta);

      // Update local state to reflect change immediately
      setInventory((prev) =>
        prev.map((inv) => {
          if (inv.inventoryId !== inventoryId) return inv;
          return {
            ...inv,
            materials: inv.materials.map((mat) =>
              mat.id === materialId
                ? { ...mat, availableQty: updated.availableQty }
                : mat
            )
          };
        })
      );
    } catch (err) {
      console.error("Failed to update quantity:", err);
      alert(err.message);
    }
  };

  // ✅ CHANGE: Update threshold via API
  const updateThreshold = async (inventoryId, materialId, newVal) => {
    try {
      const thresholdQty = parseInt(newVal) || 0;

      // Call backend API
      const updated = await updateMaterialThreshold(materialId, thresholdQty);

      // Update local state
      setInventory((prev) =>
        prev.map((inv) => {
          if (inv.inventoryId !== inventoryId) return inv;
          return {
            ...inv,
            materials: inv.materials.map((mat) =>
              mat.id === materialId
                ? { ...mat, thresholdQty: updated.thresholdQty }
                : mat
            )
          };
        })
      );
    } catch (err) {
      console.error("Failed to update threshold:", err);
      alert(err.message);
    }
  };

  // Calculate low stock summary
  const lowStockSummary = useMemo(() => {
    let alerts = [];
    inventory.forEach((inv) => {
      inv.materials?.forEach((mat) => {
        if (mat.availableQty < mat.thresholdQty) {
          alerts.push({
            productName: getProductName(inv.productId),
            material: mat.materialName,
            current: mat.availableQty,
            needed: mat.thresholdQty,
            invId: inv.inventoryId
          });
        }
      });
    });
    return alerts;
  }, [inventory, products]);

  // Calculate statistics
  const stats = {
    totalProducts: inventory.length,
    lowStock: lowStockSummary.length,
    totalMaterials: inventory.reduce((acc, inv) => acc + (inv.materials?.length || 0), 0),
    healthyStock: inventory.filter(inv =>
      !inv.materials?.some(mat => mat.availableQty < mat.thresholdQty)
    ).length
  };

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
            {/* ✅ UPDATED: Conditionally show Home icon for admin or Inventory icon for others */}
            {isAdmin ? (
              <Tooltip title="Go to Analytics">
                <Avatar 
                  onClick={handleHomeClick}
                  sx={{ 
                    bgcolor: '#667eea', 
                    variant: 'rounded',
                    cursor: 'pointer',  // ✅ Pointer cursor
                    '&:hover': {  // ✅ Hover effect
                      transform: 'scale(1.1)',
                      boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >  
                  <HomeIcon sx={{ color: 'white' }} />  {/* ✅ Home icon for admin */}
                </Avatar>
              </Tooltip>
            ) : (
              <Avatar sx={{ bgcolor: '#667eea', variant: 'rounded' }}>  
                <Inventory2OutlinedIcon sx={{ color: 'white' }} />  {/* ✅ Inventory icon for non-admin */}
              </Avatar>
            )}
              <Box>
                <Typography variant="h4" fontWeight="700" color="text.primary">
                  Inventory Management
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Track materials and restock levels
                </Typography>
              </Box>
            </Stack>
            <Stack direction="row" spacing={1}>
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

        {/* ✅ NEW: Loading state */}
        {loading ? (
          <Box sx={{ textAlign: 'center', py: 10 }}>
            <CircularProgress size={60} sx={{ color: 'white' }} />
            <Typography sx={{ mt: 2, color: 'white', fontSize: 18 }}>
              Loading inventory data...
            </Typography>
          </Box>
        ) : error ? (
          /* ✅ NEW: Error state */
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        ) : (
          <>
            {/* STATISTICS CARDS */}
            <Grid container spacing={2} mb={3}>
              <Grid item xs={6} sm={3}>
                <Paper sx={{ p: 3, borderRadius: 3, background: "rgba(255, 255, 255, 0.95)", backdropFilter: "blur(10px)", border: `2px solid ${alpha("#667eea", 0.2)}` }}>
                  <Stack spacing={1}>
                    <Typography variant="overline" color="text.secondary" fontWeight="600">
                      Total Products
                    </Typography>
                    <Typography variant="h3" fontWeight="800" color="#667eea">
                      {stats.totalProducts}
                    </Typography>
                  </Stack>
                </Paper>
              </Grid>

              <Grid item xs={6} sm={3}>
                <Paper sx={{ p: 3, borderRadius: 3, background: "linear-gradient(135deg, #ee0979 0%, #ff6a00 100%)", position: "relative", overflow: "hidden" }}>
                  <Stack spacing={1}>
                    <Typography variant="overline" sx={{ color: "rgba(255,255,255,0.9)", fontWeight: 600 }}>
                      Low Stock
                    </Typography>
                    <Typography variant="h3" fontWeight="800" color="white">
                      {stats.lowStock}
                    </Typography>
                  </Stack>
                  <Box sx={{ position: "absolute", bottom: -15, right: -15, width: 80, height: 80, borderRadius: "50%", background: "rgba(255, 255, 255, 0.1)" }} />
                </Paper>
              </Grid>

              <Grid item xs={6} sm={3}>
                <Paper sx={{ p: 3, borderRadius: 3, background: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)", position: "relative", overflow: "hidden" }}>
                  <Stack spacing={1}>
                    <Typography variant="overline" sx={{ color: "rgba(255,255,255,0.9)", fontWeight: 600 }}>
                      Healthy Stock
                    </Typography>
                    <Typography variant="h3" fontWeight="800" color="white">
                      {stats.healthyStock}
                    </Typography>
                  </Stack>
                  <Box sx={{ position: "absolute", bottom: -15, right: -15, width: 80, height: 80, borderRadius: "50%", background: "rgba(255, 255, 255, 0.1)" }} />
                </Paper>
              </Grid>

              <Grid item xs={6} sm={3}>
                <Paper sx={{ p: 3, borderRadius: 3, background: "rgba(255, 255, 255, 0.95)", backdropFilter: "blur(10px)", border: `2px solid ${alpha("#667eea", 0.2)}` }}>
                  <Stack spacing={1}>
                    <Typography variant="overline" color="text.secondary" fontWeight="600">
                      Total Materials
                    </Typography>
                    <Typography variant="h3" fontWeight="800" color="#667eea">
                      {stats.totalMaterials}
                    </Typography>
                  </Stack>
                </Paper>
              </Grid>
            </Grid>

            {/* LOW STOCK ALERT BANNER */}
            <Collapse in={lowStockSummary.length > 0}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  mb: 3,
                  borderRadius: 4,
                  background: "linear-gradient(135deg, #ee0979 0%, #ff6a00 100%)",
                  position: "relative",
                  overflow: "hidden"
                }}
              >
                <Stack direction="row" spacing={2} alignItems="flex-start" sx={{ position: "relative", zIndex: 1 }}>
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
                    <WarningAmberRoundedIcon sx={{ fontSize: 32, color: "white" }} />
                  </Box>
                  <Box width="100%">
                    <Typography variant="h5" color="white" fontWeight="700" gutterBottom>
                      Critical Low Stock Alerts ({lowStockSummary.length})
                    </Typography>
                    <Typography variant="body2" sx={{ color: "rgba(255,255,255,0.9)", mb: 2 }}>
                      The following materials require immediate restocking
                    </Typography>
                    <Grid container spacing={2}>
                      {lowStockSummary.map((alert, idx) => (
                        <Grid item xs={12} sm={6} md={4} lg={3} key={idx}>
                          <Paper
                            sx={{
                              p: 2,
                              borderRadius: 2,
                              background: "rgba(255, 255, 255, 0.95)",
                              cursor: "pointer",
                              transition: "all 0.2s ease",
                              "&:hover": {
                                transform: "translateY(-2px)",
                                boxShadow: "0 8px 16px rgba(0,0,0,0.1)"
                              }
                            }}
                            onClick={() => setExpandedId(alert.invId)}
                          >
                            <Stack spacing={1}>
                              <Typography variant="subtitle2" fontWeight="700" color="text.primary">
                                {alert.material}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {alert.productName}
                              </Typography>
                              <Chip
                                icon={<TrendingDownIcon />}
                                label={`${alert.current} / ${alert.needed} units`}
                                size="small"
                                sx={{
                                  background: alpha("#ff6a00", 0.1),
                                  color: "#ff6a00",
                                  border: `2px solid ${alpha("#ff6a00", 0.3)}`,
                                  fontWeight: 700
                                }}
                              />
                            </Stack>
                          </Paper>
                        </Grid>
                      ))}
                    </Grid>
                  </Box>
                </Stack>
                <Box sx={{ position: "absolute", bottom: -30, right: -30, width: 150, height: 150, borderRadius: "50%", background: "rgba(255, 255, 255, 0.1)" }} />
              </Paper>
            </Collapse>

            {/* INVENTORY GRID */}
            <Grid container spacing={3}>
              {inventory.map((inv) => {
                const productName = getProductName(inv.productId);
                const isLowStock = inv.materials?.some((mat) => mat.availableQty < mat.thresholdQty);
                const isExpanded = expandedId === inv.inventoryId;

                const statusConfig = isLowStock ? {
                  color: "#ff6a00",
                  bgColor: alpha("#ff6a00", 0.1),
                  borderColor: alpha("#ff6a00", 0.3),
                  gradient: "linear-gradient(135deg, #ee0979 0%, #ff6a00 100%)"
                } : {
                  color: "#38ef7d",
                  bgColor: alpha("#38ef7d", 0.1),
                  borderColor: alpha("#38ef7d", 0.3),
                  gradient: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)"
                };

                return (
                  <Grid item xs={12} md={6} lg={4} key={inv.inventoryId}>
                    <Card
                      sx={{
                        borderRadius: 4,
                        overflow: "hidden",
                        background: "rgba(255, 255, 255, 0.95)",
                        backdropFilter: "blur(10px)",
                        border: `2px solid ${statusConfig.borderColor}`,
                        transition: "all 0.3s ease",
                        "&:hover": {
                          transform: isExpanded ? "none" : "translateY(-4px)",
                          boxShadow: `0 12px 24px ${alpha(statusConfig.color, 0.2)}`
                        }
                      }}
                    >
                      <Box sx={{ height: 6, background: statusConfig.gradient }} />

                      <CardContent sx={{ p: 0 }}>
                        {/* CARD HEADER */}
                        <Box
                          sx={{ p: 3, cursor: "pointer" }}
                          onClick={() => setExpandedId(isExpanded ? null : inv.inventoryId)}
                        >
                          <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={2}>
                            <Stack direction="row" spacing={2} alignItems="center" flex={1}>
                              <Avatar
                                variant="rounded"
                                sx={{
                                  bgcolor: statusConfig.bgColor,
                                  color: statusConfig.color,
                                  width: 56,
                                  height: 56,
                                  borderRadius: 2
                                }}
                              >
                                <Inventory2OutlinedIcon sx={{ fontSize: 28 }} />
                              </Avatar>
                              <Box>
                                <Typography variant="h6" fontWeight="700" color="text.primary">
                                  {productName}
                                </Typography>
                                <Typography variant="caption" color="text.secondary">
                                  {inv.location} • ID: {inv.inventoryId}
                                </Typography>
                              </Box>
                            </Stack>

                            <IconButton
                              size="small"
                              sx={{
                                transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                                transition: 'transform 0.3s ease',
                                background: alpha(statusConfig.color, 0.1),
                                color: statusConfig.color,
                                "&:hover": {
                                  background: alpha(statusConfig.color, 0.2)
                                }
                              }}
                            >
                              <ExpandMoreIcon />
                            </IconButton>
                          </Stack>

                          <Stack direction="row" spacing={1}>
                            {isLowStock ? (
                              <Chip
                                icon={<WarningAmberRoundedIcon />}
                                label="Restock Needed"
                                size="small"
                                sx={{
                                  background: statusConfig.bgColor,
                                  color: statusConfig.color,
                                  border: `2px solid ${statusConfig.borderColor}`,
                                  fontWeight: 700
                                }}
                              />
                            ) : (
                              <Chip
                                icon={<CheckCircleOutlineRoundedIcon />}
                                label="Stock Healthy"
                                size="small"
                                sx={{
                                  background: statusConfig.bgColor,
                                  color: statusConfig.color,
                                  border: `2px solid ${statusConfig.borderColor}`,
                                  fontWeight: 700
                                }}
                              />
                            )}
                            <Chip
                              label={`${inv.materials?.length || 0} Materials`}
                              size="small"
                              variant="outlined"
                              sx={{ fontWeight: 600 }}
                            />
                          </Stack>
                        </Box>

                        {/* EXPANDABLE CONTENT */}
                        <Collapse in={isExpanded}>
                          <Divider />
                          <Box sx={{ bgcolor: alpha("#667eea", 0.03), p: 3 }}>
                            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                              <Typography variant="subtitle2" fontWeight="700" color="text.primary">
                                Bill of Materials
                              </Typography>
                              <Button
                                size="small"
                                startIcon={<LocalShippingIcon />}
                                sx={{
                                  textTransform: "none",
                                  fontWeight: 600,
                                  color: "#667eea"
                                }}
                              >
                                Order Supplies
                              </Button>
                            </Stack>

                            {/* MATERIALS LIST */}
                            <Stack spacing={2}>
                              {(inv.materials || []).map((mat, idx) => {
                                const isShortage = mat.availableQty < mat.thresholdQty;
                                const health = Math.min((mat.availableQty / (mat.thresholdQty || 1)) * 100, 100);

                                return (
                                  <Paper
                                    key={mat.id}
                                    elevation={0}
                                    sx={{
                                      p: 2.5,
                                      borderRadius: 3,
                                      border: `2px solid ${isShortage ? alpha("#ff6a00", 0.3) : alpha("#667eea", 0.1)}`,
                                      background: "white"
                                    }}
                                  >
                                    <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1.5}>
                                      <Typography variant="subtitle2" fontWeight="700" color="text.primary">
                                        {mat.materialName}
                                      </Typography>
                                      {isShortage && (
                                        <Chip
                                          label={`Below Min (${mat.thresholdQty})`}
                                          size="small"
                                          sx={{
                                            background: alpha("#ff6a00", 0.1),
                                            color: "#ff6a00",
                                            fontWeight: 700,
                                            fontSize: 11
                                          }}
                                        />
                                      )}
                                    </Stack>

                                    <LinearProgress
                                      variant="determinate"
                                      value={health}
                                      sx={{
                                        height: 8,
                                        borderRadius: 4,
                                        mb: 2,
                                        backgroundColor: alpha(isShortage ? "#ff6a00" : "#38ef7d", 0.1),
                                        "& .MuiLinearProgress-bar": {
                                          backgroundColor: isShortage ? "#ff6a00" : "#38ef7d",
                                          borderRadius: 4
                                        }
                                      }}
                                    />

                                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                                      <TextField
                                        label="Min Threshold"
                                        type="number"
                                        size="small"
                                        value={mat.thresholdQty}
                                        onChange={(e) => updateThreshold(inv.inventoryId, mat.id, e.target.value)}
                                        sx={{
                                          width: 120,
                                          "& .MuiOutlinedInput-root": {
                                            borderRadius: 2,
                                            background: alpha("#667eea", 0.05),
                                            "& fieldset": {
                                              borderColor: alpha("#667eea", 0.2)
                                            }
                                          }
                                        }}
                                      />

                                      <Stack
                                        direction="row"
                                        alignItems="center"
                                        spacing={1}
                                        sx={{
                                          border: `2px solid ${alpha("#667eea", 0.2)}`,
                                          borderRadius: 3,
                                          px: 0.5,
                                          py: 0.5,
                                          background: "white"
                                        }}
                                      >
                                        <Tooltip title="Decrease">
                                          <IconButton
                                            size="small"
                                            onClick={() => updateMaterialQty(inv.inventoryId, mat.id, -1)}
                                            sx={{
                                              width: 32,
                                              height: 32,
                                              color: "#667eea",
                                              "&:hover": {
                                                background: alpha("#667eea", 0.1)
                                              }
                                            }}
                                          >
                                            <RemoveIcon fontSize="small" />
                                          </IconButton>
                                        </Tooltip>

                                        <Typography
                                          sx={{
                                            minWidth: 40,
                                            textAlign: 'center',
                                            fontWeight: 800,
                                            fontSize: 16,
                                            color: isShortage ? "#ff6a00" : "#667eea"
                                          }}
                                        >
                                          {mat.availableQty}
                                        </Typography>

                                        <Tooltip title="Increase">
                                          <IconButton
                                            size="small"
                                            onClick={() => updateMaterialQty(inv.inventoryId, mat.id, 1)}
                                            sx={{
                                              width: 32,
                                              height: 32,
                                              background: alpha("#667eea", 0.1),
                                              color: "#667eea",
                                              "&:hover": {
                                                background: alpha("#667eea", 0.2)
                                              }
                                            }}
                                          >
                                            <AddIcon fontSize="small" />
                                          </IconButton>
                                        </Tooltip>
                                      </Stack>
                                    </Stack>
                                  </Paper>
                                );
                              })}
                            </Stack>
                          </Box>
                        </Collapse>
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

export default InventoryList;
