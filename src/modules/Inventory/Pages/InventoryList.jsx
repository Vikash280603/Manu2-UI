// ============================================================
// IMPORTS: React hooks and Material-UI components
// ============================================================
import React, { useEffect, useState, useMemo } from "react";
import {
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  IconButton,
  Collapse,
  Stack,
  Divider,
  TextField,
  Box,
  LinearProgress,
  Paper,
  Tooltip,
  Avatar,
  alpha,
  Container,
  Button
} from "@mui/material";

// Material-UI Icons - visual indicators for different actions
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';
import RefreshIcon from '@mui/icons-material/Refresh';
import FilterListIcon from '@mui/icons-material/FilterList';
import LocalShippingIcon from '@mui/icons-material/LocalShipping';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';

// Import data sources
import { products } from "../../entities/product";
import { generateInventory } from "../entities/inventory";

// ============================================================
// CONSTANT: Storage key for localStorage
// SYNTAX: const STORAGE_KEY = "manutrack_inventory_v2";
// REASON: Unique identifier to save/retrieve inventory data from browser
// ============================================================
const STORAGE_KEY = "manutrack_inventory_v2";

// ============================================================
// MAIN COMPONENT: InventoryList
// REASON: Display and manage inventory for all products
// ============================================================
const InventoryList = () => {
  // ============================================================
  // STATE 1: inventory (List of all products' inventory)
  // REASON: Stores inventory data fetched/generated on load
  // ============================================================
  const [inventory, setInventory] = useState([]);

  // ============================================================
  // STATE 2: expandedId (Which product card is expanded)
  // REASON: Track which product's details are showing
  // ============================================================
  const [expandedId, setExpandedId] = useState(null);

  // ============================================================
  // HOOK: useEffect (Load inventory on component mount)
  // LOGIC:
  //   - Runs once when component first loads ([] dependency)
  //   - Check if inventory exists in localStorage
  //   - If yes, load it; if no, generate new one and save
  // REASON: Initialize inventory data when page opens
  // ============================================================
  useEffect(() => {
    const storedInventory = localStorage.getItem(STORAGE_KEY);
    if (storedInventory) {
      // Inventory exists - load it
      setInventory(JSON.parse(storedInventory));
    } else {
      // First time - generate and save
      const seedInventory = generateInventory();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seedInventory));
      setInventory(seedInventory);
    }
  }, []);

  // ============================================================
  // FUNCTION: persistInventory
  // SYNTAX: const persistInventory = (updatedInventory) => { ... }
  // LOGIC: Update state AND save to localStorage simultaneously
  // REASON: Keep memory and storage in sync whenever data changes
  // ============================================================
  const persistInventory = (updatedInventory) => {
    setInventory(updatedInventory);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedInventory));
  };

  // ============================================================
  // FUNCTION: getProductName
  // SYNTAX: const getProductName = (productId) => { ... }
  // LOGIC: Find product by ID and return its name
  // REASON: Convert numeric product ID to readable product name
  // ============================================================
  const getProductName = (productId) => {
    return products.find((p) => p.id === productId)?.name || "Unknown Product";
  };

  // ============================================================
  // FUNCTION: updateMaterialQty
  // SYNTAX: const updateMaterialQty = (productId, materialName, delta) => { ... }
  // LOGIC: Increase/decrease material quantity by delta amount
  // Parameters:
  //   - productId: which product
  //   - materialName: which material
  //   - delta: how much to change (+1 or -1)
  // Math.max(0, ...) ensures quantity never goes below 0
  // REASON: Handle +/- buttons to adjust stock levels
  // ============================================================
  const updateMaterialQty = (productId, materialName, delta) => {
    const updatedInventory = inventory.map((inv) => {
      if (inv.productId !== productId) return inv;
      return {
        ...inv,
        materials: inv.materials.map((mat) =>
          mat.materialName === materialName
            ? { ...mat, availableQty: Math.max(0, mat.availableQty + delta) }
            : mat
        )
      };
    });
    persistInventory(updatedInventory);
  };

  // ============================================================
  // FUNCTION: updateMaterialThreshold
  // SYNTAX: const updateMaterialThreshold = (productId, materialName, newVal) => { ... }
  // LOGIC: Update the minimum stock level for a material
  // parseInt(newVal) converts text input to number
  // REASON: Let user set custom reorder levels
  // ============================================================
  const updateMaterialThreshold = (productId, materialName, newVal) => {
    const updatedInventory = inventory.map((inv) => {
      if (inv.productId !== productId) return inv;
      return {
        ...inv,
        materials: inv.materials.map((mat) =>
          mat.materialName === materialName
            ? { ...mat, thresholdQty: parseInt(newVal) || 0 }
            : mat
        )
      };
    });
    persistInventory(updatedInventory);
  };

  // ============================================================
  // COMPUTED STATE: lowStockSummary
  // SYNTAX: const lowStockSummary = useMemo(() => { ... }, [inventory]);
  // LOGIC: Create alert list for all materials below threshold
  // useMemo: Only recalculate when inventory changes
  // REASON: Efficient way to find all low-stock items
  // ============================================================
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
  }, [inventory]);

  // ============================================================
  // STATISTICS: Calculate dashboard numbers
  // REASON: Show quick overview of inventory health
  // ============================================================
  const stats = {
    // Count total product inventories
    totalProducts: inventory.length,
    
    // Count how many materials are low on stock
    lowStock: lowStockSummary.length,
    
    // Sum up all materials across all products
    totalMaterials: inventory.reduce((acc, inv) => acc + (inv.materials?.length || 0), 0),
    
    // Count products with NO low-stock materials
    healthyStock: inventory.filter(inv => 
      !inv.materials?.some(mat => mat.availableQty < mat.thresholdQty)
    ).length
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
        
        {/* HEADER SECTION - Title and controls */}
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
                <Inventory2OutlinedIcon sx={{ color: "white", fontSize: 28 }} />
              </Box>
              <Box>
                <Typography variant="h4" fontWeight="700" color="text.primary">
                  Inventory Management
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Track materials and restock levels
                </Typography>
              </Box>
            </Stack>

            {/* Refresh and Filter buttons */}
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

        {/* STATISTICS CARDS - Show key numbers */}
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

        {/* LOW STOCK ALERT BANNER - Shows all low stock materials */}
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

        {/* INVENTORY GRID - Product cards with expandable details */}
        <Grid container spacing={3}>
          {inventory.map((inv) => {
            const productName = getProductName(inv.productId);
            // Check if ANY material is below threshold
            const isLowStock = inv.materials?.some(
              (mat) => mat.availableQty < mat.thresholdQty
            );
            const isExpanded = expandedId === inv.inventoryId;

            // Dynamic colors based on stock status
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
                  {/* Color bar at top - indicates status */}
                  <Box sx={{ height: 6, background: statusConfig.gradient }} />

                  <CardContent sx={{ p: 0 }}>
                    {/* CARD HEADER - Product info and expand button */}
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

                        {/* Expand/Collapse button */}
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

                      {/* Status badges */}
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

                    {/* EXPANDABLE CONTENT - Materials detail view */}
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

                        {/* MATERIALS LIST - Show each material with quantity controls */}
                        <Stack spacing={2}>
                          {(inv.materials || []).map((mat, idx) => {
                            const isShortage = mat.availableQty < mat.thresholdQty;
                            // Calculate progress bar percentage
                            const health = Math.min((mat.availableQty / (mat.thresholdQty || 1)) * 100, 100);

                            return (
                              <Paper
                                key={idx}
                                elevation={0}
                                sx={{
                                  p: 2.5,
                                  borderRadius: 3,
                                  border: `2px solid ${isShortage ? alpha("#ff6a00", 0.3) : alpha("#667eea", 0.1)}`,
                                  background: "white"
                                }}
                              >
                                {/* Material name and shortage badge */}
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

                                {/* Progress bar showing stock health */}
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

                                {/* Threshold input and quantity +/- controls */}
                                <Stack direction="row" justifyContent="space-between" alignItems="center">
                                  <TextField
                                    label="Min Threshold"
                                    type="number"
                                    size="small"
                                    value={mat.thresholdQty}
                                    onChange={(e) => updateMaterialThreshold(inv.productId, mat.materialName, e.target.value)}
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

                                  {/* Quantity adjustment buttons */}
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
                                    {/* Decrease button */}
                                    <Tooltip title="Decrease">
                                      <IconButton
                                        size="small"
                                        onClick={() => updateMaterialQty(inv.productId, mat.materialName, -1)}
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

                                    {/* Current quantity display */}
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

                                    {/* Increase button */}
                                    <Tooltip title="Increase">
                                      <IconButton
                                        size="small"
                                        onClick={() => updateMaterialQty(inv.productId, mat.materialName, 1)}
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
      </Container>
    </Box>
  );
};

// ============================================================
// EXPORT: Make component available to other files
// ============================================================
export default InventoryList;