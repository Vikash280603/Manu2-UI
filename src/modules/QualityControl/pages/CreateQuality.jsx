// ============================================================
// IMPORTS: React hooks and Material-UI components
// ============================================================
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Stack,
  Divider,
  Box,
  Container,
  Paper,
  Grid,
  alpha,
  Chip,
  IconButton,
  LinearProgress,
  InputAdornment
} from "@mui/material";

// React Router hooks - get work order ID from URL and navigate
import { useParams, useNavigate } from "react-router-dom";

// Import quality check and work order functions
import { getQualityChecks, saveQualityChecks, generateQcId } from "../entities/quality";
import { getWorkOrders, saveWorkOrders } from "../../ProductionScheduling/entities/workOrders";

// Import product data
import { products } from "../../entities/product";

// Material-UI Icons
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

// ============================================================
// MAIN COMPONENT: QualityCreate
// REASON: Form to inspect and approve/reject completed work orders
// ============================================================
const QualityCreate = () => {
  // ============================================================
  // HOOK: useParams
  // SYNTAX: const { workOrderId } = useParams();
  // LOGIC: Extract workOrderId from URL (e.g., /quality/create/uuid-123)
  // REASON: Know which work order to inspect
  // ============================================================
  const { workOrderId } = useParams();

  // ============================================================
  // HOOK: useNavigate
  // REASON: Navigate back to work orders page after submission
  // ============================================================
  const navigate = useNavigate();

  // ============================================================
  // GET DATA: Fetch work orders from storage
  // REASON: Find the specific work order being inspected
  // ============================================================
  const workOrders = getWorkOrders();

  // ============================================================
  // FIND ORDER: Get the specific work order by ID
  // SYNTAX: const order = workOrders.find(w => w.workOrderId == workOrderId);
  // LOGIC: Search array for matching work order ID
  // REASON: Get details of the work order being inspected
  // ============================================================
  const order = workOrders.find(w => w.workOrderId == workOrderId);

  // ============================================================
  // STATE 1: accepted (Number of units that passed inspection)
  // SYNTAX: const [accepted, setAccepted] = useState(0);
  // REASON: Inspector enters how many units are acceptable
  // ============================================================
  const [accepted, setAccepted] = useState(0);

  // ============================================================
  // STATE 2: remarks (Inspector's notes and observations)
  // SYNTAX: const [remarks, setRemarks] = useState("");
  // REASON: Inspector documents defects, issues, or positive notes
  // ============================================================
  const [remarks, setRemarks] = useState("");

  // ============================================================
  // ERROR STATE: If work order not found
  // LOGIC: If order doesn't exist, show error message
  // REASON: Prevent errors from processing invalid orders
  // ============================================================
  if (!order) {
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
            {/* Error icon */}
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
            
            {/* Error message */}
            <Typography variant="h4" fontWeight="700" mb={2} color="text.primary">
              Invalid Work Order
            </Typography>
            <Typography variant="body1" color="text.secondary" mb={3}>
              The work order you're looking for doesn't exist or has been removed
            </Typography>
            
            {/* Back button */}
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

  // ============================================================
  // COMPUTED VALUE 1: rejected
  // SYNTAX: const rejected = order.quantity - accepted;
  // LOGIC: Total quantity minus accepted units = rejected units
  // EXAMPLE: If made 100 units, accepted 95 → rejected = 5
  // REASON: Calculate how many units failed inspection
  // ============================================================
  const rejected = order.quantity - accepted;

  // ============================================================
  // COMPUTED VALUE 2: successRate
  // SYNTAX: const successRate = order.quantity > 0 ? Math.round((accepted / order.quantity) * 100) : 0;
  // LOGIC:
  //   - (accepted / order.quantity) * 100 = percentage
  //   - Math.round() = round to nearest whole number
  //   - ? : = if order.quantity > 0, calculate rate, else use 0
  // EXAMPLE: If accepted=90, total=100 → (90/100)*100 = 90%
  // REASON: Show quality percentage for easy understanding
  // ============================================================
  const successRate = order.quantity > 0 ? Math.round((accepted / order.quantity) * 100) : 0;

  // ============================================================
  // COMPUTED VALUE 3: result (PASS or FAIL determination)
  // SYNTAX: const result = successRate >= 90 ? "PASS" : "FAIL";
  // LOGIC:
  //   - If success rate >= 90% → "PASS"
  //   - Otherwise → "FAIL"
  // REASON: Auto-determine quality result based on threshold
  // ============================================================
  const result = successRate >= 90 ? "PASS" : "FAIL";

  // ============================================================
  // COMPUTED VALUE 4: productName
  // SYNTAX: const productName = products.find(p => p.id === order.productId)?.name || "Unknown";
  // LOGIC: Find product by ID and get its name
  // REASON: Display readable product name instead of ID
  // ============================================================
  const productName = products.find(p => p.id === order.productId)?.name || "Unknown";

  // ============================================================
  // COMPUTED VALUE 5: resultConfig
  // SYNTAX: const resultConfig = result === "PASS" ? {...} : {...};
  // LOGIC: Different colors and styling based on PASS or FAIL
  // REASON: Visually indicate quality result status
  // ============================================================
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

  // ============================================================
  // FUNCTION: submitQuality
  // SYNTAX: const submitQuality = () => { ... }
  //
  // LOGIC (3 Steps):
  //   STEP 1: Create quality check record
  //   STEP 2: Save to quality checks storage
  //   STEP 3: Update work order status to QUALITY_DONE
  //
  // DETAILED FLOW:
  //   1. Generate unique QC ID (timestamp-based)
  //   2. Create object with all inspection details
  //   3. Get existing quality checks from storage
  //   4. Add new check to the list
  //   5. Save updated list to storage
  //   6. Update work order status from COMPLETED → QUALITY_DONE
  //   7. Save updated work orders to storage
  //   8. Navigate back to work orders page
  //
  // REASON: Save inspection results and mark order as complete
  // ============================================================
  const submitQuality = () => {
    // Create new quality check record
    const newQc = {
      qcId: generateQcId(),              // Generate unique ID (e.g., "QC-1704067245123")
      workOrderId: order.workOrderId,    // Link to work order
      productId: order.productId,        // Link to product
      inspectionDate: new Date().toISOString().split("T")[0], // Today's date (YYYY-MM-DD)
      totalQty: order.quantity,          // Total units produced
      acceptedQty: accepted,             // Units that passed
      rejectedQty: rejected,             // Units that failed
      successRate,                       // Percentage passed (0-100)
      result,                            // "PASS" or "FAIL"
      remarks                            // Inspector notes
    };

    // STEP 1: Get existing quality checks
    const existing = getQualityChecks();

    // STEP 2: Add new check and save
    saveQualityChecks([...existing, newQc]);

    // STEP 3: Update work order status
    const updatedOrders = workOrders.map(o =>
      o.workOrderId === order.workOrderId
        ? { ...o, status: "QUALITY_DONE" }  // Change status to complete
        : o
    );

    // Save updated work orders
    saveWorkOrders(updatedOrders);

    // Navigate back to work orders page
    navigate("/workorder");
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
            
            {/* Icon */}
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
            
            {/* Title */}
            <Box flex={1}>
              <Typography variant="h4" fontWeight="700" color="text.primary">
                Quality Inspection
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Verify and approve production quality
              </Typography>
            </Box>

            {/* Status badge */}
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

        {/* ===== MAIN CONTENT: Form (Left) + Results Preview (Right) ===== */}
        <Grid container spacing={3}>
          
          {/* ===== LEFT SECTION: Inspection Form ===== */}
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
                
                {/* ===== WORK ORDER INFO ===== */}
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
                      {/* Product name */}
                      <Typography variant="h6" fontWeight="700" color="text.primary">
                        {productName}
                      </Typography>
                      {/* Work order ID */}
                      <Typography variant="caption" color="text.secondary">
                        Work Order #{order.workOrderId}
                      </Typography>
                    </Box>
                  </Stack>
                </Paper>

                {/* ===== INSPECTION DATE (Read-only) ===== */}
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

                {/* ===== TOTAL QUANTITY (Read-only) ===== */}
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

                {/* ===== ACCEPTED QUANTITY (User Input) ===== */}
                <Box>
                  <Typography variant="subtitle2" fontWeight="600" mb={1} color="text.secondary">
                    Accepted Quantity
                  </Typography>
                  <TextField
                    fullWidth
                    type="number"
                    value={accepted}
                    // Ensure value stays between 0 and total quantity
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

                {/* ===== REJECTED QUANTITY (Auto-calculated) ===== */}
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

                {/* ===== INSPECTOR REMARKS ===== */}
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

                {/* ===== SUBMIT BUTTON ===== */}
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  startIcon={<VerifiedIcon />}
                  onClick={submitQuality}
                  disabled={accepted === 0} 
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
                  Submit Quality Inspection
                </Button>
              </Stack>
            </Paper>
          </Grid>

          {/* ===== RIGHT SECTION: Live Results Preview ===== */}
          <Grid item xs={12} md={5}>
            <Stack spacing={3}>
              
              {/* ===== RESULT CARD ===== */}
              <Card
                sx={{
                  borderRadius: 4,
                  overflow: "hidden",
                  background: "rgba(255, 255, 255, 0.95)",
                  backdropFilter: "blur(10px)",
                  border: `2px solid ${resultConfig.borderColor}`
                }}
              >
                {/* Color bar indicating PASS/FAIL */}
                <Box sx={{ height: 6, background: resultConfig.gradient }} />
                
                <CardContent sx={{ p: 3 }}>
                  <Stack spacing={2.5}>
                    
                    {/* Title and result badge */}
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

                    {/* Success Rate */}
                    <Box>
                      <Stack direction="row" justifyContent="space-between" mb={1}>
                        <Typography variant="body2" color="text.secondary">
                          Success Rate
                        </Typography>
                        {/* Show percentage in matching color */}
                        <Typography variant="h5" fontWeight="800" color={resultConfig.color}>
                          {successRate}%
                        </Typography>
                      </Stack>
                      {/* Progress bar showing quality percentage */}
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
                      {/* Show "Excellent Quality" message if >= 90% */}
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

                    {/* ===== METRICS: Accepted, Total, Rejected ===== */}
                    <Grid container spacing={2}>
                      {/* Accepted count */}
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

                      {/* Total count */}
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

                      {/* Rejected count */}
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

              {/* ===== QUALITY STANDARDS INFO ===== */}
              <Paper
                sx={{
                  background: "rgba(255, 255, 255, 0.95)",
                  backdropFilter: "blur(10px)",
                  borderRadius: 4,
                  p: 3
                }}
              >
                {/* Header */}
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

                {/* Standards list */}
                <Stack spacing={1.5}>
                  {/* PASS criteria */}
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
                  
                  {/* FAIL criteria */}
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
                  
                  {/* Note about auto-calculation */}
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

// ============================================================
// EXPORT: Make component available
// ============================================================
export default QualityCreate;