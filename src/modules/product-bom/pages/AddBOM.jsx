// ============================================================
// IMPORTS: Bringing in tools and components we need
// ============================================================
import React, { useState, useEffect } from "react";

// Material-UI Components: Pre-made UI elements
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

// Icons from Material-UI Icons library
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

// React Router Hooks
// useLocation: Hook to get data passed from previous page
// useNavigate: Hook to move to a different page
import { useLocation, useNavigate } from "react-router-dom";

export default function AddBom() {

  const navigate = useNavigate();

  // ============================================================
  // HOOK 2: useLocation()
  // LOGIC: Gets data passed from the previous page (AddProduct.jsx)
  // REASON: We need to know which product we're adding materials to
  // ============================================================
  const location = useLocation();

  // ============================================================
  // DESTRUCTURING: Extract product info from navigation state
  // SYNTAX: const { productId, productName } = location.state || {};
  // LOGIC:
  //   - location.state = data passed from AddProduct page
  //   - { productId, productName } = get these two values
  //   - || {} = if no data, use empty object (prevents error)
  // REASON: Get the product ID and name that user created
  // ============================================================
  const { productId, productName } = location.state || {};

  // ============================================================
  // HOOK 3: useEffect (Protection against direct access)
  // SYNTAX: useEffect(() => { ... }, [productId, navigate]);
  // LOGIC:
  //   - This runs when component loads or when productId changes
  //   - If productId is missing, send user back to /products page
  //   - [productId, navigate] = dependency array (when to run this)
  // REASON: Protect against users accessing this page without selecting a product
  // ============================================================
  useEffect(() => {
    if (!productId) {
      alert("No Product Selected! Redirecting to home...");
      navigate("/products");
    }
  }, [productId, navigate]);

  // ============================================================
  // HELPER FUNCTION: makeItem
  // FUNCTION SYNTAX: const makeItem = (seqNumber) => ({ ... })
  // LOGIC: Creates a new empty material row with default values
  // REASON: When user clicks "Add Another Material", we create a blank row
  // ============================================================
  const makeItem = (seqNumber) => ({
    // uiId: Unique ID for React (React uses this to track each row)
    // crypto.randomUUID() = generates a random unique code
    uiId: crypto.randomUUID(),

    // materialId: The display number (01, 02, etc)
    // String(seqNumber).padStart(2, "0") = converts number with leading zero
    // Example: 1 becomes "01", 2 becomes "02"
    materialId: `${String(seqNumber).padStart(2, "0")}`,

    // materialName: User will type the material name here (starts empty)
    materialName: "",

    // quantity: User will enter how many units needed (starts empty)
    quantity: ""
  });

  // ============================================================
  // STATE 1: items (List of all materials)
  // SYNTAX: const [items, setItems] = useState([makeItem(1)]);
  // LOGIC:
  //   - items = array of material objects
  //   - setItems = function to update the items array
  //   - useState([makeItem(1)]) = starts with one empty row
  // REASON: Keep track of all materials user enters
  // ============================================================
  const [items, setItems] = useState([makeItem(1)]);

  // ============================================================
  // STATE 2: nextSeq (Sequence counter)
  // SYNTAX: const [nextSeq, setNextSeq] = useState(2);
  // LOGIC:
  //   - Tracks the next material ID number (02, 03, etc)
  //   - Starts at 2 because first row already has 1
  // REASON: Generate unique ID numbers for each new material row
  // ============================================================
  const [nextSeq, setNextSeq] = useState(2);

  // ============================================================
  // STATE 3: confirmOpen (Delete confirmation dialog)
  // SYNTAX: const [confirmOpen, setConfirmOpen] = useState(false);
  // LOGIC:
  //   - true = show the delete confirmation popup
  //   - false = hide the popup
  // REASON: Control when to show/hide the "Are you sure?" dialog
  // ============================================================
  const [confirmOpen, setConfirmOpen] = useState(false);

  // ============================================================
  // STATE 4: pendingDeleteId (Which row to delete)
  // SYNTAX: const [pendingDeleteId, setPendingDeleteId] = useState(null);
  // LOGIC:
  //   - Stores the uiId of the row user wants to delete
  //   - null = no row selected for deletion
  // REASON: Remember which row user clicked delete on
  // ============================================================
  const [pendingDeleteId, setPendingDeleteId] = useState(null);

  // ============================================================
  // HANDLER 1: handleItemChange
  // FUNCTION SYNTAX: const handleItemChange = (uiId, field, value) => { ... }
  // PARAMETERS:
  //   - uiId: The unique ID of which row changed
  //   - field: Which field changed (materialName or quantity)
  //   - value: The new value user typed
  // LOGIC:
  //   - Loop through all items with map()
  //   - If uiId matches, update that field with new value
  //   - Otherwise, keep the item unchanged
  // REASON: Update state when user types in a material field
  // ============================================================
  const handleItemChange = (uiId, field, value) => {
    setItems((prev) =>
      prev.map((item) => 
        item.uiId === uiId 
          ? { ...item, [field]: value } 
          : item
      )
    );
  };

  // ============================================================
  // HANDLER 2: addItem
  // FUNCTION SYNTAX: const addItem = () => { ... }
  // LOGIC:
  //   - Create a new empty row using makeItem()
  //   - Add it to the items array using [...prev, ...]
  //   - Increment nextSeq so next row gets a new number
  // REASON: When user clicks "Add Another Material" button
  // ============================================================
  const addItem = () => {
    setItems((prev) => [...prev, makeItem(nextSeq)]);
    setNextSeq((n) => n + 1);
  };

  // ============================================================
  // HANDLER 3: requestDelete
  // FUNCTION SYNTAX: const requestDelete = (uiId) => { ... }
  // LOGIC:
  //   - If user only has 1 material row, don't allow deletion
  //   - Otherwise, show confirmation dialog
  //   - Store the uiId of row to delete in pendingDeleteId
  // REASON: Prevent user from deleting the last material row
  // ============================================================
  const requestDelete = (uiId) => {
    if (items.length === 1) {
      alert("You must have at least one material line.");
      return;
    }
    setPendingDeleteId(uiId);
    setConfirmOpen(true);
  };

  // ============================================================
  // HANDLER 4: handleConfirmDelete
  // FUNCTION SYNTAX: const handleConfirmDelete = () => { ... }
  // LOGIC:
  //   - Get the uiId from pendingDeleteId
  //   - Remove the row with that uiId from items array
  //   - Close the confirmation dialog
  // REASON: Actually delete the row after user confirms
  // ============================================================
  const handleConfirmDelete = () => {
    if (pendingDeleteId) {
      setItems((prev) => prev.filter((item) => item.uiId !== pendingDeleteId));
    }
    setConfirmOpen(false);
    setPendingDeleteId(null);
  };

  // ============================================================
  // HANDLER 5: handleSave (Most important!)
  // FUNCTION SYNTAX: const handleSave = () => { ... }
  // LOGIC: Save all materials to localStorage
  // REASON: When user clicks "Save BOM" button
  // ============================================================
  const handleSave = () => {
    // Check if ALL items have material name AND quantity filled in
    const isValid = items.every(item => item.materialName && item.quantity);
    
    if (!isValid) {
      alert("Please fill in all Material Names and Quantities.");
      return;
    }

    // STEP A: Get all BOMs already saved in browser memory
    const existingBoms = JSON.parse(localStorage.getItem("boms") || "[]");

    // STEP B: Create new BOM entries
    // Loop through each material and create object with necessary data
    const newEntries = items.map((item, index) => ({
      BOMID: Date.now() + index,  // Unique ID using current time + count
      id: productId,              // Link to the product
      materialName: item.materialName,
      quantity: parseInt(item.quantity) // Convert to number
    }));

    // STEP C: Save and Merge
    // Combine old materials + new materials into one array
    const updatedBoms = [...existingBoms, ...newEntries];
    localStorage.setItem("boms", JSON.stringify(updatedBoms));

    // STEP D: Success feedback and navigate
    alert(`Successfully added ${newEntries.length} materials to ${productName}!`);
    navigate("/products");
  };

  // ============================================================
  // RETURN: The UI (what user sees)
  // ============================================================
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
        {/* STICKY HEADER - Stays at top when scrolling */}
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
              {/* Top row: Back button and title */}
              <Stack direction="row" alignItems="center" spacing={2} mb={1}>
                <IconButton onClick={() => navigate("/")} size="small">
                  <ArrowBackIcon />
                </IconButton>
                <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: 1 }}>
                  BOM Configuration
                </Typography>
              </Stack>
              
              {/* Main title row: Product name and ID */}
              <Stack direction="row" alignItems="center" spacing={2}>
                <Typography variant="h4" fontWeight="bold" color="#1e293b">
                  {productName || "Product"}
                </Typography>
                <Chip label={`ID: ${productId}`} color="primary" variant="outlined" size="small" />
              </Stack>
            </Box>
            
            {/* Save button on the right side of header */}
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

        {/* FORM CONTENT: All material rows */}
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
                  
                  {/* Sequence ID (Read-only) - shows material number like 01, 02, etc */}
                  <TextField
                    label="#"
                    value={item.materialId}
                    size="small"
                    InputProps={{ readOnly: true }}
                    sx={{ width: { xs: "100%", sm: 100 }, bgcolor: "#f8fafc" }}
                    variant="filled"
                  />

                  {/* Material Name field - user enters the material name here */}
                  <TextField
                    label="Material Name"
                    placeholder="e.g. Steel Sheet"
                    value={item.materialName}
                    onChange={(e) => handleItemChange(item.uiId, "materialName", e.target.value)}
                    fullWidth
                    size="small"
                    required
                  />

                  {/* Quantity field - user enters how many units needed */}
                  <TextField
                    label="Qty"
                    type="number"
                    value={item.quantity}
                    onChange={(e) => handleItemChange(item.uiId, "quantity", e.target.value)}
                    sx={{ width: { xs: "100%", sm: 120 } }}
                    size="small"
                    required
                  />

                  {/* Delete button - removes this material row */}
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

          {/* ADD BUTTON: Add another material row */}
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

      {/* DELETE CONFIRMATION DIALOG: Popup to confirm deletion */}
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
          {/* Cancel button - closes dialog without deleting */}
          <Button onClick={() => setConfirmOpen(false)} variant="outlined" color="inherit">
            Cancel
          </Button>
          
          {/* Remove button - confirms deletion */}
          <Button onClick={handleConfirmDelete} variant="contained" color="error">
            Remove
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}