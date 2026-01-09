import React, { useState } from "react";
import {
  TextField,
  Button,
  Stack,
  MenuItem,
  Typography,
  Paper,
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  alpha,
  Divider,
  Chip,
  InputAdornment,
  IconButton
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { products } from "../../entities/product";
import {
  getWorkOrders,
  saveWorkOrders,
  generateWorkOrderId
} from "../entities/workOrders";
import WorkIcon from '@mui/icons-material/Work';
import CategoryIcon from '@mui/icons-material/Category';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ProductionQuantityLimitsIcon from '@mui/icons-material/ProductionQuantityLimits';
import LayersIcon from '@mui/icons-material/Layers';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AddIcon from '@mui/icons-material/Add';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InfoIcon from '@mui/icons-material/Info';

const CreateWorkOrder = () => {
  const navigate = useNavigate();

  const [productId, setProductId] = useState("");
  const [qty, setQty] = useState("1");
  const [batches, setBatches] = useState("1");
  const [scheduledDate, setScheduledDate] = useState("");

  // CHANGED: compute numeric values for display/calculation
  const qtyNumForCalc = Math.max(1, parseInt(qty, 10) || 1);
  const batchesNumForCalc = Math.max(1, parseInt(batches, 10) || 1);

  const createOrders = () => {
    const existing = getWorkOrders();
    const now = new Date().toISOString();

    const newOrders = Array.from({ length: batchesNumForCalc }).map(() => ({
      workOrderId: generateWorkOrderId(),
      productId: Number(productId),
      quantity: qtyNumForCalc,
      status: "PLANNED",
      createdAt: now,
      scheduledDate,
      completedAt: null
    }));

    saveWorkOrders([...existing, ...newOrders]);
    navigate("/workorder");
  };

  const selectedProduct = products.find(p => p.id === Number(productId));
  
  
  const totalQuantity = qtyNumForCalc * batchesNumForCalc;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        py: 4
      }}
    >
      <Container maxWidth="lg">
        {/* Header Section */}
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
              onClick={() => navigate(-1)}
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
              <WorkIcon sx={{ color: "white", fontSize: 28 }} />
            </Box>
            
            <Box flex={1}>
              <Typography variant="h4" fontWeight="700" color="text.primary">
                Create Work Order
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Schedule new production batches
              </Typography>
            </Box>

            <Chip
              icon={<InfoIcon />}
              label="PLANNING"
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

        <Grid container spacing={3}>
          {/* Form Section */}
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
                Order Details
              </Typography>

              <Stack spacing={3}>
                {/* Product Selection */}
                <Box>
                  <Typography variant="subtitle2" fontWeight="600" mb={1} color="text.secondary">
                    Product Selection
                  </Typography>
                  <TextField
                    select
                    fullWidth
                    placeholder="Select a product"
                    value={productId}
                    onChange={(e) => setProductId(e.target.value)}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <CategoryIcon sx={{ color: "#667eea" }} />
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
                  >
                    <MenuItem value="" disabled>
                      <em>Choose a product</em>
                    </MenuItem>
                    {products.map((p) => (
                      <MenuItem key={p.id} value={p.id}>
                        <Stack direction="row" spacing={1} alignItems="center" width="100%">
                          <Box
                            sx={{
                              width: 8,
                              height: 8,
                              borderRadius: "50%",
                              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
                            }}
                          />
                          <Typography fontWeight="600">{p.name}</Typography>
                        </Stack>
                      </MenuItem>
                    ))}
                  </TextField>
                </Box>

                {/* Scheduled Date */}
                <Box>
                  <Typography variant="subtitle2" fontWeight="600" mb={1} color="text.secondary">
                    Scheduled Date
                  </Typography>
                  <TextField
                    type="date"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    value={scheduledDate}
                    onChange={(e) => setScheduledDate(e.target.value)}
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

                {/* Quantity and Batches */}
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <Box>
                      <Typography variant="subtitle2" fontWeight="600" mb={1} color="text.secondary">
                        Quantity per Batch
                      </Typography>
                      {/* <TextField
                        type="number"
                        fullWidth
                        value={qty}
                        onChange={(e) => setQty(Math.max(1, +e.target.value))} */}
                      <TextField
                        type="number"
                        fullWidth
                        // CHANGED: value is a string so the input can be cleared while typing
                        value={qty}
                        // CHANGED: allow typing (including an empty string) and only keep digits
                        onChange={(e) => setQty(e.target.value.replace(/\D/g, ""))}
                        // CHANGED: onFocus clear the "1" so typing replaces it; onBlur restore to at least "1"
                        //onFocus={() => { if (qty === "1") setQty(""); }} // CHANGED
                        onBlur={() => {
                          // ensure a valid numeric value after user leaves input
                          const n = Math.max(1, parseInt(qty, 10) || 1);
                          setQty(String(n));
                        }} // CHANGED
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <ProductionQuantityLimitsIcon sx={{ color: "#667eea" }} />
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
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <Box>
                      <Typography variant="subtitle2" fontWeight="600" mb={1} color="text.secondary">
                        Number of Batches
                      </Typography>
                      {/* <TextField
                        type="number"
                        fullWidth
                        value={batches}
                        onChange={(e) => setBatches(Math.max(1, +e.target.value))} */}
                      <TextField
                        type="number"
                        fullWidth
                        value={batches} // CHANGED: string value
                        onChange={(e) => setBatches(e.target.value.replace(/\D/g, ""))} // CHANGED
                        //onFocus={() => { if (batches === "1") setBatches(""); }} // CHANGED
                        onBlur={() => {
                          const n = Math.max(1, parseInt(batches, 10) || 1);
                          setBatches(String(n));
                        }} // CHANGED
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <LayersIcon sx={{ color: "#667eea" }} />
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
                  </Grid>
                </Grid>

                <Divider />

                {/* Action Buttons */}
                <Stack direction="row" spacing={2}>
                  <Button
                    variant="contained"
                    fullWidth
                    size="large"
                    startIcon={<CheckCircleIcon />}
                    onClick={createOrders}
                    disabled={!productId || !scheduledDate}
                    sx={{
                      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      borderRadius: 3,
                      textTransform: "none",
                      fontWeight: 700,
                      py: 1.5,
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
                    Create Work Order
                  </Button>

                  <Button
                    variant="outlined"
                    size="large"
                    onClick={() => navigate(-1)}
                    sx={{
                      borderRadius: 3,
                      textTransform: "none",
                      fontWeight: 700,
                      py: 1.5,
                      px: 4,
                      borderColor: alpha("#667eea", 0.3),
                      color: "#667eea",
                      borderWidth: 2,
                      "&:hover": {
                        borderColor: "#667eea",
                        background: alpha("#667eea", 0.05),
                        borderWidth: 2
                      }
                    }}
                  >
                    Cancel
                  </Button>
                </Stack>
              </Stack>
            </Paper>
          </Grid>

          {/* Summary Section */}
          <Grid item xs={12} md={5}>
            <Stack spacing={3}>
              {/* Order Summary Card */}
              <Card
                sx={{
                  background: "linear-gradient(135deg, #11998e 0%, #38ef7d 100%)",
                  borderRadius: 4,
                  position: "relative",
                  overflow: "hidden"
                }}
              >
                <CardContent sx={{ position: "relative", zIndex: 1 }}>
                  <Typography variant="h6" fontWeight="700" color="white" mb={3}>
                    Order Summary
                  </Typography>

                  <Stack spacing={2}>
                    <Box
                      sx={{
                        background: "rgba(255, 255, 255, 0.2)",
                        borderRadius: 2,
                        p: 2
                      }}
                    >
                      <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.9)" }}>
                        Selected Product
                      </Typography>
                      <Typography variant="h6" fontWeight="700" color="white">
                        {selectedProduct ? selectedProduct.name : "Not selected"}
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        background: "rgba(255, 255, 255, 0.2)",
                        borderRadius: 2,
                        p: 2
                      }}
                    >
                      <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.9)" }}>
                        Total Quantity
                      </Typography>
                      <Typography variant="h6" fontWeight="700" color="white">
                        {totalQuantity} units
                      </Typography>
                      <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.8)" }}>
                        {qty} per batch × {batches} batches
                      </Typography>
                    </Box>

                    <Box
                      sx={{
                        background: "rgba(255, 255, 255, 0.2)",
                        borderRadius: 2,
                        p: 2
                      }}
                    >
                      <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.9)" }}>
                        Scheduled Date
                      </Typography>
                      <Typography variant="h6" fontWeight="700" color="white">
                        {scheduledDate
                          ? new Date(scheduledDate).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric"
                            })
                          : "Not set"}
                      </Typography>
                    </Box>
                  </Stack>
                </CardContent>

                <Box
                  sx={{
                    position: "absolute",
                    bottom: -30,
                    right: -30,
                    width: 150,
                    height: 150,
                    borderRadius: "50%",
                    background: "rgba(255, 255, 255, 0.1)"
                  }}
                />
              </Card>

              {/* Info Card */}
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
                    <InfoIcon sx={{ color: "#667eea" }} />
                  </Box>
                  <Box>
                    <Typography variant="subtitle1" fontWeight="700" color="text.primary">
                      Quick Tips
                    </Typography>
                  </Box>
                </Stack>

                <Stack spacing={1.5}>
                  <Typography variant="body2" color="text.secondary">
                    • All work orders will be created with "PLANNED" status
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    • Each batch will generate a unique work order ID
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    • Schedule dates help prioritize production
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    • You can track orders from the main dashboard
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

export default CreateWorkOrder;