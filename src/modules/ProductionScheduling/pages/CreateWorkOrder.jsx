// ============================================================
// IMPORTS: React hooks and Material-UI components
// ============================================================
import React, { useState , useEffect} from "react";
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
  IconButton,
  
} from "@mui/material";
import CircularProgress from '@mui/material/CircularProgress';


// React Router hook - allows navigation between pages
import { useAsyncError, useNavigate } from "react-router-dom";

// Import product and work order data
// import { products } from "../../entities/product"; Removed as we use DB
// import {
//   getWorkOrders,
//   saveWorkOrders,
//   generateWorkOrderId
// } from "../entities/workOrders";      Removed as we use DB


import { getAllProducts } from "../../product-bom/api/productApi";
import { createBatchWorkOrders } from "../api/workOrderApi";

// Material-UI Icons
import WorkIcon from '@mui/icons-material/Work';
import CategoryIcon from '@mui/icons-material/Category';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import ProductionQuantityLimitsIcon from '@mui/icons-material/ProductionQuantityLimits';
import LayersIcon from '@mui/icons-material/Layers';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InfoIcon from '@mui/icons-material/Info';

// ============================================================
// MAIN COMPONENT: CreateWorkOrder
// REASON: Form to create new work orders for manufacturing
// ============================================================
const CreateWorkOrder = () => {
  // ============================================================
  // HOOK: useNavigate
  // REASON: Navigate between pages (back button, after creating)
  // ============================================================
  const navigate = useNavigate();

  // ============================================================
  // STATE 1: productId (Selected product)
  // SYNTAX: const [productId, setProductId] = useState("");
  // LOGIC: Stores which product user selected from dropdown
  // REASON: We need to know which product to create orders for
  // ============================================================
  const [productId, setProductId] = useState("");

  const [products, setProducts] = useState([]);

  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  // ============================================================
  // STATE 2: qty (Quantity per batch)
  // SYNTAX: const [qty, setQty] = useState("1");
  // LOGIC: 
  //   - Stored as STRING (not number) to allow text input
  //   - Allows user to clear field while typing (empty string)
  //   - Converted to number only when needed
  // REASON: Text input fields work better with string state
  // ============================================================
  const [qty, setQty] = useState("1");

  // ============================================================
  // STATE 3: batches (Number of batches to create)
  // SYNTAX: const [batches, setBatches] = useState("1");
  // LOGIC: How many identical work orders to create
  // EXAMPLE: If qty=100 and batches=3, create 3 orders of 100 each
  // REASON: User might want to create multiple orders at once
  // ============================================================
  const [batches, setBatches] = useState("1");

  // ============================================================
  // STATE 4: scheduledDate (When to start production)
  // SYNTAX: const [scheduledDate, setScheduledDate] = useState("");
  // LOGIC: Date string in format "YYYY-MM-DD"
  // REASON: Schedule production for future dates
  // ============================================================
  const [scheduledDate, setScheduledDate] = useState("");



  useEffect(() => {
    const loadProducts = async () => {
      try {
        const data = await getAllProducts();
        setProducts(data);
      } catch (err) {
        console.error("Failed to load products:", err);
        setError(err.message);
      }
    };
    loadProducts();
  }, []);

  // ============================================================
  // COMPUTED VALUE 1: qtyNumForCalc
  // SYNTAX: const qtyNumForCalc = Math.max(1, parseInt(qty, 10) || 1);
  // LOGIC:
  //   - parseInt(qty, 10) = convert string "100" to number 100
  //   - || 1 = if conversion fails (empty string), use 1
  //   - Math.max(1, ...) = ensure minimum is 1 (never 0 or negative)
  // REASON: Safe numeric value for calculations and display
  // ============================================================
  const qtyNumForCalc = Math.max(1, parseInt(qty, 10) || 1);

  // ============================================================
  // COMPUTED VALUE 2: batchesNumForCalc
  // SYNTAX: const batchesNumForCalc = Math.max(1, parseInt(batches, 10) || 1);
  // LOGIC: Same as above - convert string to safe numeric value
  // REASON: Use for calculating how many orders to create
  // ============================================================
  const batchesNumForCalc = Math.max(1, parseInt(batches, 10) || 1);

  // ============================================================
  // FUNCTION: createOrders
  // SYNTAX: const createOrders = () => { ... }
  // LOGIC:
  //   STEP 1: Get existing work orders from storage
  //   STEP 2: Get current date/time
  //   STEP 3: Create new work order objects (one for each batch)
  //   STEP 4: Save combined list to storage
  //   STEP 5: Navigate to work orders page
  // 
  // EXAMPLE FLOW:
  //   - User selects Product 1
  //   - User enters qty=50, batches=2
  //   - Creates 2 work orders:
  //     Order 1: { id: uuid-123, productId: 1, quantity: 50, status: "PLANNED" }
  //     Order 2: { id: uuid-456, productId: 1, quantity: 50, status: "PLANNED" }
  // 
  // REASON: Handle the "Create Work Order" button click
  // ============================================================
  const createOrders = async () => {
    try {
      setLoading(true);
      setError("");

      // Create work order data
      const orderData = {
        productId: Number(productId),
        quantity: qtyNumForCalc,
        scheduledDate: scheduledDate || null
      };

      // Call API to create batch work orders
      await createBatchWorkOrders(orderData, batchesNumForCalc);

      // Navigate to work orders page
      navigate("/workorder");
    } catch (err) {
      console.error("Failed to create work orders:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // COMPUTED VALUE 3: selectedProduct
  // SYNTAX: const selectedProduct = products.find(p => p.id === Number(productId));
  // LOGIC:
  //   - products.find() = search products array
  //   - p.id === Number(productId) = find one matching the selected ID
  //   - Returns product object or undefined if not found
  // REASON: Show product details in summary card
  // ============================================================
  const selectedProduct = products.find(p => p.id === Number(productId));

  // ============================================================
  // COMPUTED VALUE 4: totalQuantity
  // SYNTAX: const totalQuantity = qtyNumForCalc * batchesNumForCalc;
  // LOGIC: Multiply quantity per batch × number of batches
  // EXAMPLE: 50 units × 2 batches = 100 total units
  // REASON: Show user total quantity in summary
  // ============================================================
  const totalQuantity = qtyNumForCalc * batchesNumForCalc;

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
      <Container maxWidth="lg">

        {/* ===== HEADER SECTION ===== */}
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
            {/* Back button */}
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

            {/* Icon box */}
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

            {/* Title */}
            <Box flex={1}>
              <Typography variant="h4" fontWeight="700" color="text.primary">
                Create Work Order
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Schedule new production batches
              </Typography>
            </Box>

            {/* Status badge */}
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

        {/* ===== MAIN CONTENT: Form (Left) + Summary (Right) ===== */}
        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3}>

          {/* ===== LEFT SECTION: Form Inputs ===== */}
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

                {/* ===== FIELD 1: Product Selection ===== */}
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
                    {/* Loop through all products and show as options */}
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

                {/* ===== FIELD 2: Scheduled Date ===== */}
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

                {/* ===== FIELDS 3 & 4: Quantity and Batches ===== */}
                <Grid container spacing={2}>

                  {/* Quantity per Batch */}
                  <Grid item xs={12} sm={6}>
                    <Box>
                      <Typography variant="subtitle2" fontWeight="600" mb={1} color="text.secondary">
                        Quantity per Batch
                      </Typography>
                      <TextField
                        type="number"
                        fullWidth
                        // String value allows clearing while typing
                        value={qty}
                        // Allow typing and remove non-digits with regex
                        // .replace(/\D/g, "") = remove all non-digit characters
                        onChange={(e) => setQty(e.target.value.replace(/\D/g, ""))}
                        // When user leaves field, ensure valid number
                        onBlur={() => {
                          // Convert to number and ensure minimum is 1
                          const n = Math.max(1, parseInt(qty, 10) || 1);
                          setQty(String(n)); // Convert back to string for display
                        }}
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

                  {/* Number of Batches */}
                  <Grid item xs={12} sm={6}>
                    <Box>
                      <Typography variant="subtitle2" fontWeight="600" mb={1} color="text.secondary">
                        Number of Batches
                      </Typography>
                      <TextField
                        type="number"
                        fullWidth
                        // Same logic as quantity field
                        value={batches}
                        onChange={(e) => setBatches(e.target.value.replace(/\D/g, ""))}
                        onBlur={() => {
                          const n = Math.max(1, parseInt(batches, 10) || 1);
                          setBatches(String(n));
                        }}
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

                {/* ===== ACTION BUTTONS ===== */}
                <Stack direction="row" spacing={2}>
                  {/* Create button - disabled until product and date selected */}
                  <Button
                    variant="contained"
                    fullWidth
                    size="large"
                    startIcon={loading ? <CircularProgress size={20} /> : <CheckCircleIcon />}
                    onClick={createOrders}
                    disabled={!productId || !scheduledDate || loading}
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
                    {loading ? "Creating..." : "Create Work Order"}
                  </Button>

                  {/* Cancel button - goes back to previous page */}
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

          {/* ===== RIGHT SECTION: Summary and Info ===== */}
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
                    {/* Selected Product Box */}
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

                    {/* Total Quantity Box */}
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
                      {/* Show breakdown: qty per batch × number of batches */}
                      <Typography variant="caption" sx={{ color: "rgba(255,255,255,0.8)" }}>
                        {qty} per batch × {batches} batches
                      </Typography>
                    </Box>

                    {/* Scheduled Date Box */}
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
                          // Convert date string to readable format
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

                {/* Decorative circle background */}
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

              {/* Quick Tips Card */}
              <Paper
                sx={{
                  background: "rgba(255, 255, 255, 0.95)",
                  backdropFilter: "blur(10px)",
                  borderRadius: 4,
                  p: 3
                }}
              >
                {/* Tips header */}
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

                {/* Tips list */}
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

// ============================================================
// EXPORT: Make component availableL
// ============================================================
export default CreateWorkOrder;