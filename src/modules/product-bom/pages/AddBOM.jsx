import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  TextField,
  Button,
  Stack,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  IconButton,
  Tooltip,
  Box,
  Paper,
  Chip
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useLocation, useNavigate } from "react-router-dom";

export default function AddBom() {
  const navigate = useNavigate();
  const location = useLocation();

  // 1. Get Product Details from Navigation State
  const { productId, productName } = location.state || {};

  // Redirect if accessed directly without selecting a product
  useEffect(() => {
    if (!productId) {
      alert("No Product Selected! Redirecting to home...");
      navigate("/products");
    }
  }, [productId, navigate]);

  // 2. Helper to create a new empty row (Removed Unit)
  const makeItem = (seqNumber) => ({
    uiId: crypto.randomUUID(), // Internal ID for React keys
    materialId: `${String(seqNumber).padStart(2, "0")}`, // Display ID
    materialName: "",
    quantity: ""
  });

  // 3. State Management
  const [items, setItems] = useState([makeItem(1)]);
  const [nextSeq, setNextSeq] = useState(2); // Tracks MAT-02, MAT-03...

  // Delete Dialog State
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [pendingDeleteId, setPendingDeleteId] = useState(null);

  // 4. Handlers
  const handleItemChange = (uiId, field, value) => {
    setItems((prev) =>
      prev.map((item) => (item.uiId === uiId ? { ...item, [field]: value } : item))
    );
  };

  const addItem = () => {
    setItems((prev) => [...prev, makeItem(nextSeq)]);
    setNextSeq((n) => n + 1);
  };

  // Delete Logic
  const requestDelete = (uiId) => {
    // If it's the only item, just clear it, don't delete the row completely
    if (items.length === 1) {
       alert("You must have at least one material line.");
       return;
    }
    setPendingDeleteId(uiId);
    setConfirmOpen(true);
  };

  const handleConfirmDelete = () => {
    if (pendingDeleteId) {
      setItems((prev) => prev.filter((item) => item.uiId !== pendingDeleteId));
    }
    setConfirmOpen(false);
    setPendingDeleteId(null);
  };

  // 5. SAVE LOGIC
  const handleSave = () => {
    // Validation
    const isValid = items.every(item => item.materialName && item.quantity);
    if (!isValid) {
      alert("Please fill in all Material Names and Quantities.");
      return;
    }

    // A. Get Existing BOMs
    const existingBoms = JSON.parse(localStorage.getItem("boms") || "[]");

    // B. Calculate new BOMID
    // We will append our new items to the existing list
    // Removed 'unit' and 'status' fields here
    const newEntries = items.map((item, index) => ({
      BOMID: Date.now() + index, // Unique ID for the BOM row
      id: productId,             // LINKING TO THE PRODUCT HERE
      materialName: item.materialName,
      quantity: parseInt(item.quantity)
    }));

    // C. Save and Merge
    const updatedBoms = [...existingBoms, ...newEntries];
    localStorage.setItem("boms", JSON.stringify(updatedBoms));

    // D. Feedback & Navigate
    alert(`Successfully added ${newEntries.length} materials to ${productName}!`);
    navigate("/products"); // Return to Dashboard/Home
  };

  return (
    <Box 
      sx={{ 
        height: "100vh", 
        overflow: "hidden", 
        bgcolor: "#f4f6f8",
        display: "flex", 
        flexDirection: "column" 
      }}
    >
      {/* --- SCROLLABLE CONTAINER --- */}
      <Stack
        spacing={3}
        sx={{
          width: "100%",
          maxWidth: 900,
          mx: "auto",
          pt: 0,
          pb: 10,
          height: "100%",
          overflowY: "auto",
          position: "relative"
        }}
      >
        {/* --- STICKY HEADER --- */}
        <Paper
          elevation={2}
          sx={{
            position: "sticky",
            top: 0,
            zIndex: 1100,
            p: 3,
            borderRadius: "0 0 12px 12px",
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(10px)"
          }}
        >
            <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                    <Stack direction="row" alignItems="center" spacing={2} mb={1}>
                        <IconButton onClick={() => navigate("/")} size="small">
                            <ArrowBackIcon />
                        </IconButton>
                        <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: 1 }}>
                            BOM Configuration
                        </Typography>
                    </Stack>
                    <Stack direction="row" alignItems="center" spacing={2}>
                        <Typography variant="h4" fontWeight="bold" color="#1e293b">
                            {productName || "Product"}
                        </Typography>
                        <Chip label={`ID: ${productId}`} color="primary" variant="outlined" size="small" />
                    </Stack>
                </Box>
                <Button 
                    variant="contained" 
                    size="large"
                    startIcon={<SaveIcon />}
                    onClick={handleSave}
                    sx={{ 
                        px: 4, 
                        bgcolor: "#1e293b", 
                        '&:hover': { bgcolor: "#0f172a" } 
                    }}
                >
                    Save BOM
                </Button>
            </Stack>
        </Paper>

        {/* --- FORM CONTENT --- */}
        <Box px={3}>
            {items.map((item) => (
            <Card
                key={item.uiId}
                elevation={0}
                sx={{
                    mb: 2,
                    border: "1px solid #e2e8f0",
                    borderRadius: 2,
                    transition: "all 0.2s",
                    "&:hover": { borderColor: "#94a3b8", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }
                }}
            >
                <CardContent>
                <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="center">
                    
                    {/* Seq ID (Visual only) */}
                    <TextField
                        label="#"
                        value={item.materialId}
                        size="small"
                        InputProps={{ readOnly: true }}
                        sx={{ width: { xs: "100%", sm: 100 }, bgcolor: "#f8fafc" }}
                        variant="filled"
                    />

                    {/* Material Name */}
                    <TextField
                        label="Material Name"
                        placeholder="e.g. Steel Sheet"
                        value={item.materialName}
                        onChange={(e) => handleItemChange(item.uiId, "materialName", e.target.value)}
                        fullWidth
                        size="small"
                        required
                    />

                    {/* Quantity */}
                    <TextField
                        label="Qty"
                        type="number"
                        value={item.quantity}
                        onChange={(e) => handleItemChange(item.uiId, "quantity", e.target.value)}
                        sx={{ width: { xs: "100%", sm: 120 } }}
                        size="small"
                        required
                    />

                    <Tooltip title="Remove Item">
                        <IconButton 
                            color="error" 
                            onClick={() => requestDelete(item.uiId)}
                            sx={{ bgcolor: "#fee2e2", '&:hover': { bgcolor: "#fecaca" } }}
                        >
                            <DeleteIcon fontSize="small" />
                        </IconButton>
                    </Tooltip>
                </Stack>
                </CardContent>
            </Card>
            ))}

            <Button
                fullWidth
                variant="outlined"
                startIcon={<AddCircleOutlineIcon />}
                onClick={addItem}
                sx={{ 
                    py: 2, 
                    borderStyle: "dashed", 
                    borderWidth: 2,
                    color: "#64748b",
                    borderColor: "#cbd5e1",
                    "&:hover": { borderColor: "#94a3b8", bgcolor: "#f1f5f9", borderWidth: 2 }
                }}
            >
                Add Another Material
            </Button>
        </Box>
      </Stack>

      {/* --- CONFIRM DELETE DIALOG --- */}
      <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)}>
        <DialogTitle sx={{ color: "#ef4444", display: 'flex', alignItems: 'center', gap: 1 }}>
            <DeleteIcon /> Remove Material?
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to remove this line item? This cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setConfirmOpen(false)} variant="outlined" color="inherit">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} variant="contained" color="error">
            Remove
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}