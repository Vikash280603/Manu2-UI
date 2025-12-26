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
  alpha
} from "@mui/material";

// Icons
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded';
import CheckCircleOutlineRoundedIcon from '@mui/icons-material/CheckCircleOutlineRounded';

// Keep your existing imports
import { products } from "../../entities/product";
import { generateInventory } from "../entities/inventory";

const STORAGE_KEY = "manutrack_inventory_v2";

const InventoryList = () => {
  const [inventory, setInventory] = useState([]);
  const [expandedId, setExpandedId] = useState(null);

  // --- Initialization Logic ---
  useEffect(() => {
    const storedInventory = localStorage.getItem(STORAGE_KEY);
    if (storedInventory) {
      setInventory(JSON.parse(storedInventory));
    } else {
      const seedInventory = generateInventory();
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seedInventory));
      setInventory(seedInventory);
    }
  }, []);

  const persistInventory = (updatedInventory) => {
    setInventory(updatedInventory);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedInventory));
  };

  const getProductName = (productId) => {
    return products.find((p) => p.id === productId)?.name || "Unknown Product";
  };

  // --- Handlers ---
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

  // --- Derived State for Top Alerts ---
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
            invId: inv.inventoryId // Used to jump to card
          });
        }
      });
    });
    return alerts;
  }, [inventory]);

  return (
    <Box sx={{ pb: 10 }}>
      {/* 1. TOP DASHBOARD SECTION - High Visibility */}
      <Collapse in={lowStockSummary.length > 0}>
        <Paper 
          elevation={0} 
          sx={{ 
            p: 3, 
            mb: 4, 
            // Changed from orange bg to White with Red Border for cleaner look
            border: '1px solid #ffcc80', 
            borderLeft: '6px solid #ed6c02',
            bgcolor: '#fff',
            borderRadius: 2,
            boxShadow: '0 4px 20px rgba(0,0,0,0.05)'
          }}
        >
          <Stack direction="row" spacing={2} alignItems="flex-start">
            <WarningAmberRoundedIcon color="warning" sx={{ fontSize: 32, mt: 0.5 }} />
            <Box width="100%">
              <Typography variant="h6" color="#2c3e50" fontWeight="bold" gutterBottom>
                Critical Low Stock Alerts ({lowStockSummary.length})
              </Typography>
              <Grid container spacing={2}>
                {lowStockSummary.map((alert, idx) => (
                  <Grid item xs={12} sm={6} md={4} key={idx}>
                    <Box 
                      sx={{ 
                        bgcolor: '#fafafa', // Minimal grey/white
                        p: 2, 
                        borderRadius: 2, 
                        border: '1px solid #eee',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        cursor: 'pointer',
                        transition: '0.2s',
                        '&:hover': { bgcolor: '#fff3e0', borderColor: '#ffcc80' } // Hover turns to alert color
                      }}
                      onClick={() => setExpandedId(alert.invId)}
                    >
                      <Box>
                        <Typography variant="subtitle2" fontWeight="bold" color="#374151">
                          {alert.material}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          In: {alert.productName}
                        </Typography>
                      </Box>
                      <Chip 
                        label={`${alert.current} / ${alert.needed}`} 
                        size="small" 
                        // Alert color kept as requested
                        sx={{ 
                            fontWeight: 'bold', 
                            bgcolor: '#ffebee', 
                            color: '#c62828',
                            border: '1px solid #ffcdd2'
                        }}
                      />
                    </Box>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Stack>
        </Paper>
      </Collapse>

      {/* 2. MAIN INVENTORY GRID */}
      <Grid container spacing={3}>
        {inventory.map((inv) => {
          const productName = getProductName(inv.productId);
          const isLowStock = inv.materials?.some(
            (mat) => mat.availableQty < mat.thresholdQty
          );
          const isExpanded = expandedId === inv.inventoryId;

          // COLOR LOGIC: Blue for Healthy, Red for Alert
          const statusColor = isLowStock ? "#d32f2f" : "#1976d2"; // Red vs Professional Blue
          const statusBg = isLowStock ? "#fdeded" : "#e3f2fd"; // Light Red vs Light Blue

          return (
            <Grid item xs={12} md={6} lg={4} key={inv.inventoryId}>
              <Card
                elevation={isExpanded ? 8 : 1}
                sx={{
                  borderRadius: 3,
                  transition: "all 0.3s ease",
                  // Structure maintained: Left border indicator
                  borderLeft: `6px solid ${statusColor}`,
                  borderTop: '1px solid #f0f0f0',
                  borderRight: '1px solid #f0f0f0',
                  borderBottom: '1px solid #f0f0f0',
                  height: 'fit-content'
                }}
              >
                <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
                  {/* Card Header Area */}
                  <Box 
                    sx={{ p: 2.5, cursor: "pointer", bgcolor: 'white' }}
                    onClick={() => setExpandedId(isExpanded ? null : inv.inventoryId)}
                  >
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar 
                          variant="rounded" 
                          sx={{ 
                            bgcolor: statusBg,
                            color: statusColor,
                            borderRadius: 2
                          }}
                        >
                          <Inventory2OutlinedIcon />
                        </Avatar>
                        <Box>
                          <Typography variant="h6" fontWeight="bold" lineHeight={1.2} color="#1e293b">
                            {productName}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                             {inv.location} • ID: {inv.inventoryId}
                          </Typography>
                        </Box>
                      </Stack>

                      <IconButton 
                        size="small"
                        sx={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: '0.3s' }}
                      >
                        <ExpandMoreIcon />
                      </IconButton>
                    </Stack>

                    {/* Quick Status Pill */}
                    <Stack direction="row" spacing={1} mt={2}>
                        {isLowStock ? (
                           <Chip 
                                icon={<WarningAmberRoundedIcon sx={{ color: '#d32f2f !important' }} />} 
                                label="Restock Needed" 
                                size="small" 
                                sx={{ bgcolor: '#ffebee', color: '#d32f2f', fontWeight: 'bold' }}
                            />
                        ) : (
                           <Chip 
                                icon={<CheckCircleOutlineRoundedIcon sx={{ color: '#1976d2 !important' }} />} 
                                label="Stock Healthy" 
                                size="small" 
                                sx={{ bgcolor: '#e3f2fd', color: '#1565c0', fontWeight: 'bold' }} // Blue Pill
                            />
                        )}
                    </Stack>
                  </Box>

                  {/* Expandable Details */}
                  <Collapse in={isExpanded}>
                    <Divider />
                    {/* Background changed to Blue-Grey Tint for minimal look */}
                    <Box sx={{ bgcolor: "#f0f7ff", p: 2 }}> 
                      <Typography variant="overline" color="text.secondary" fontWeight="bold">
                        Bill of Materials & Stock
                      </Typography>

                      <Stack spacing={2} mt={1}>
                        {(inv.materials || []).map((mat, idx) => {
                          const isShortage = mat.availableQty < mat.thresholdQty;
                          const health = Math.min((mat.availableQty / (mat.thresholdQty || 1)) * 100, 100);

                          return (
                            <Paper 
                              key={idx} 
                              elevation={0}
                              sx={{ 
                                p: 2, 
                                borderRadius: 2,
                                // Red border if shortage, otherwise subtle border
                                border: '1px solid',
                                borderColor: isShortage ? '#ef5350' : '#e0e0e0',
                                bgcolor: 'white'
                              }}
                            >
                              {/* Row 1: Name and Progress */}
                              <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                                <Typography variant="subtitle2" fontWeight="bold" color="#334155">
                                  {mat.materialName}
                                </Typography>
                                {isShortage && (
                                  <Typography variant="caption" color="error" fontWeight="bold">
                                    Below Min ({mat.thresholdQty})
                                  </Typography>
                                )}
                              </Stack>

                              {/* Visual Progress Bar */}
                              <LinearProgress 
                                variant="determinate" 
                                value={health} 
                                // Color logic: Error if shortage, otherwise Primary Blue
                                color={isShortage ? "error" : "primary"}
                                sx={{ 
                                    height: 6, 
                                    borderRadius: 3, 
                                    mb: 2, 
                                    opacity: 0.8,
                                    bgcolor: '#e2e8f0' // Slate grey background for track
                                }}
                              />

                              {/* Controls */}
                              <Stack direction="row" justifyContent="space-between" alignItems="center">
                                {/* Threshold Input */}
                                <TextField
                                  label="Min Limit"
                                  type="number"
                                  variant="standard"
                                  size="small"
                                  value={mat.thresholdQty}
                                  onChange={(e) => updateMaterialThreshold(inv.productId, mat.materialName, e.target.value)}
                                  InputProps={{ disableUnderline: true, style: { fontWeight: 'bold', color: '#475569' } }}
                                  sx={{ 
                                    width: 80, 
                                    bgcolor: '#f1f5f9', // Slate 100
                                    borderRadius: 1, 
                                    px: 1,
                                    '& .MuiInputLabel-root': { pl: 1 } 
                                  }}
                                />

                                {/* Qty Counter - Clean Minimal Pill Style */}
                                <Stack 
                                  direction="row" 
                                  alignItems="center" 
                                  spacing={1} 
                                  sx={{ 
                                    border: '1px solid #cbd5e1',
                                    borderRadius: 50,
                                    px: 0.5,
                                    py: 0.5
                                  }}
                                >
                                  <Tooltip title="Decrease">
                                    <IconButton 
                                      size="small" 
                                      sx={{ width: 28, height: 28, color: '#64748b' }}
                                      onClick={() => updateMaterialQty(inv.productId, mat.materialName, -1)}
                                    >
                                      <RemoveIcon fontSize="small" />
                                    </IconButton>
                                  </Tooltip>
                                  
                                  <Typography sx={{ minWidth: 30, textAlign: 'center', fontWeight: 'bold', color: '#1e293b' }}>
                                    {mat.availableQty}
                                  </Typography>

                                  <Tooltip title="Increase">
                                    <IconButton 
                                      size="small" 
                                      sx={{ width: 28, height: 28, color: '#1976d2', bgcolor: '#e3f2fd' }}
                                      onClick={() => updateMaterialQty(inv.productId, mat.materialName, 1)}
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
    </Box>
  );
};

export default InventoryList;