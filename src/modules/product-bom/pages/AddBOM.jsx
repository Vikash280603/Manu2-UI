// UPDATED AddBom.jsx - Creates BOMs via API  
  
import React, { useState, useEffect } from "react";  
import {  
  Card, CardContent, TextField, Button, Stack, Typography,  
  Dialog, DialogTitle, DialogContent, DialogContentText,  
  DialogActions, IconButton, Tooltip, Box, Paper, Chip, CircularProgress, Alert  
} from "@mui/material";  
import DeleteIcon from "@mui/icons-material/Delete";  
import SaveIcon from "@mui/icons-material/Save";  
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";  
import ArrowBackIcon from "@mui/icons-material/ArrowBack";  
import { useLocation, useNavigate } from "react-router-dom";  
  
// ✅ CHANGE: Import API function  
import { createBOM } from "../../product-bom/api/productApi";  
  
export default function AddBom() {  
  const navigate = useNavigate();  
  const location = useLocation();  
  const { productId, productName } = location.state || {};  
  
  const makeItem = (seqNumber) => ({  
    uiId: crypto.randomUUID(),  
    materialId: `${String(seqNumber).padStart(2, "0")}`,  
    materialName: "",  
    quantity: ""  
  });  
  
  const [items, setItems] = useState([makeItem(1)]);  
  const [nextSeq, setNextSeq] = useState(2);  
  const [confirmOpen, setConfirmOpen] = useState(false);  
  const [pendingDeleteId, setPendingDeleteId] = useState(null);  
  
  // ✅ NEW: Loading and error states  
  const [loading, setLoading] = useState(false);  
  const [error, setError] = useState("");  
  
  useEffect(() => {  
    if (!productId) {  
      alert("No Product Selected! Redirecting to home...");  
      navigate("/products");  
    }  
  }, [productId, navigate]);  
  
  const handleItemChange = (uiId, field, value) => {  
    setItems((prev) =>  
      prev.map((item) =>   
        item.uiId === uiId   
          ? { ...item, [field]: value }   
          : item  
      )  
    );  
  };  
  
  const addItem = () => {  
    setItems((prev) => [...prev, makeItem(nextSeq)]);  
    setNextSeq((n) => n + 1);  
  };  
  
  const requestDelete = (uiId) => {  
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
  
  // ✅ CHANGE: Save BOMs via API instead of localStorage  
  const handleSave = async () => {  
    const isValid = items.every(item => item.materialName && item.quantity);  
      
    if (!isValid) {  
      setError("Please fill in all Material Names and Quantities.");  
      return;  
    }  
  
    try {  
      setLoading(true);  
      setError("");  
  
      // Create BOMs one by one via API  
      const promises = items.map(item =>  
        createBOM(productId, {  
          materialName: item.materialName,  
          quantity: parseInt(item.quantity)  
        })  
      );  
  
      await Promise.all(promises);  
  
      alert(`Successfully added ${items.length} materials to ${productName}!`);  
      navigate("/products");  
    } catch (err) {  
      setError(err.message);  
    } finally {  
      setLoading(false);  
    }  
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
        {/* STICKY HEADER */}  
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
                <IconButton onClick={() => navigate("/products")} size="small">  
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
              disabled={loading}  
              sx={{   
                px: 4,   
                bgcolor: "#1e293b",  
                '&:hover': { bgcolor: "#0f172a" }  
              }}  
            >  
              {loading ? <CircularProgress size={24} color="inherit" /> : "Save BOM"}  
            </Button>  
          </Stack>  
        </Paper>  
  
        {/* FORM CONTENT */}  
        <Box px={3}>  
          {/* ✅ NEW: Error message */}  
          {error && (  
            <Alert severity="error" sx={{ mb: 2 }}>  
              {error}  
            </Alert>  
          )}  
  
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
                    
                  <TextField  
                    label="#"  
                    value={item.materialId}  
                    size="small"  
                    InputProps={{ readOnly: true }}  
                    sx={{ width: { xs: "100%", sm: 100 }, bgcolor: "#f8fafc" }}  
                    variant="filled"  
                  />  
  
                  <TextField  
                    label="Material Name"  
                    placeholder="e.g. Steel Sheet"  
                    value={item.materialName}  
                    onChange={(e) => handleItemChange(item.uiId, "materialName", e.target.value)}  
                    fullWidth  
                    size="small"  
                    required  
                    disabled={loading}  
                  />  
  
                  <TextField  
                    label="Qty"  
                    type="number"  
                    value={item.quantity}  
                    onChange={(e) => handleItemChange(item.uiId, "quantity", e.target.value)}  
                    sx={{ width: { xs: "100%", sm: 120 } }}  
                    size="small"  
                    required  
                    disabled={loading}  
                  />  
  
                  <Tooltip title="Remove Item">  
                    <IconButton   
                      color="error"   
                      onClick={() => requestDelete(item.uiId)}  
                      disabled={loading}  
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
            disabled={loading}  
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
  
      {/* DELETE CONFIRMATION DIALOG */}  
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