import React, { useState, useEffect } from 'react';
import {
  Typography, TextField, FormControl, InputLabel, Select, MenuItem,
  Grid, Button, Stack, Box, Dialog, DialogTitle, DialogContent,
  DialogActions, IconButton, InputAdornment, Chip, Paper, Divider,
  useTheme, Avatar
} from '@mui/material';

/*
  -------------------------
  ICON IMPORTS (MUI ICONS)
  -------------------------
  These icons are used purely for visual clarity and UX improvement.
  They help users quickly understand the meaning of fields and actions.
*/
import CloseIcon from '@mui/icons-material/Close';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import CategoryOutlinedIcon from '@mui/icons-material/CategoryOutlined';
import FactCheckOutlinedIcon from '@mui/icons-material/FactCheckOutlined';
import LayersOutlinedIcon from '@mui/icons-material/LayersOutlined';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded';
import BuildCircleOutlinedIcon from '@mui/icons-material/BuildCircleOutlined';

import { useNavigate } from 'react-router-dom';

/*
  ============================================================================
  EditProduct Component
  ----------------------------------------------------------------------------
  Purpose:
  - Displays a modal dialog to edit product details
  - Loads product data & BOM from localStorage
  - Allows updating product name, category, status
  - Shows associated BOM items (read-only here)
  ============================================================================
*/
export default function EditProduct({ open, handleClose, productId, onSaveSuccess }) {

  // -------------------------------------------------------------------------
  // STATE MANAGEMENT
  // -------------------------------------------------------------------------

  /*
    formData
    --------
    Holds editable product fields.
    These values are bound to TextField / Select components.
  */
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    status: 'ACTIVE'
  });

  /*
    productBom
    ----------
    Stores BOM items related to the current product.
    Used only for display in the right panel.
  */
  const [productBom, setProductBom] = useState([]);

  /*
    useNavigate
    -----------
    React Router hook used for programmatic navigation.
    Used here to move to the BOM edit screen.
  */
  const navigate = useNavigate();

  /*
    useTheme
    --------
    Gives access to MUI theme values (colors, spacing, breakpoints).
    Helps avoid hardcoding colors.
  */
  const theme = useTheme();

  // -------------------------------------------------------------------------
  // SIDE EFFECT: LOAD PRODUCT & BOM DATA WHEN MODAL OPENS
  // -------------------------------------------------------------------------
  useEffect(() => {
    if (open && productId) {
      const pid = Number(productId);

      /*
        1️⃣ LOAD PRODUCT DETAILS
        -----------------------
        - Fetch all products from localStorage
        - Find the product matching productId
        - Populate form fields
      */
      const products = JSON.parse(localStorage.getItem('products')) || [];
      const product = products.find(p => Number(p.id) === pid);

      if (product) {
        setFormData({
          name: product.name || '',
          category: product.category || '',
          status: product.status || 'ACTIVE',
        });
      }

      /*
        2️⃣ LOAD BOM DETAILS
        -------------------
        - Fetch all BOMs from localStorage
        - Filter BOMs linked to this product
        - Store them for display
      */
      const allBoms = JSON.parse(localStorage.getItem('boms')) || [];
      const filtered = allBoms.filter(bom => Number(bom.id) === pid);
      setProductBom(filtered);
    }
  }, [open, productId]);

  // -------------------------------------------------------------------------
  // HANDLER: UPDATE FORM FIELD VALUES
  // -------------------------------------------------------------------------
  /*
    Generic handler for TextField and Select components.
    Uses the "name" attribute to update the correct field.
  */
  const handleInputChange = (e) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // -------------------------------------------------------------------------
  // HANDLER: SAVE UPDATED PRODUCT DETAILS
  // -------------------------------------------------------------------------
  /*
    - Updates the product inside localStorage
    - Keeps BOM unchanged
    - Triggers refresh in parent component
    - Closes modal
  */
  const saveProductDetails = () => {
    const products = JSON.parse(localStorage.getItem('products')) || [];

    const updated = products.map(p =>
      Number(p.id) === Number(productId)
        ? { ...p, ...formData }
        : p
    );

    localStorage.setItem('products', JSON.stringify(updated));

    if (onSaveSuccess) onSaveSuccess();
    handleClose();
  };

  // -------------------------------------------------------------------------
  // UI SECTION
  // -------------------------------------------------------------------------
  return (
    /*
      Dialog
      ------
      MUI modal component.
      - fullWidth + maxWidth control size
      - PaperProps controls card appearance
      - BackdropProps adds blur effect behind modal
    */
    <Dialog
      open={open}
      onClose={handleClose}
      fullWidth
      maxWidth="md"
      TransitionProps={{ timeout: 400 }}
      PaperProps={{
        sx: {
          borderRadius: '24px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          overflow: 'hidden'
        }
      }}
      BackdropProps={{
        sx: {
          backdropFilter: 'blur(4px)',
          backgroundColor: 'rgba(0,0,0,0.1)'
        }
      }}
    >

      {/* ================= HEADER SECTION ================= */}
      <DialogTitle
        component="div"
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          p: 3,
          background: 'linear-gradient(to right, #f8f9fa, #ffffff)',
          borderBottom: '1px solid #f0f0f0'
        }}
      >
        {/* Left: Title & Icon */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ bgcolor: 'primary.light', color: 'primary.main' }}>
            <EditOutlinedIcon />
          </Avatar>

          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800 }}>
              Edit Product
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Update details & configuration
            </Typography>
          </Box>
        </Box>

        {/* Right: Close Button */}
        <IconButton
          onClick={handleClose}
          sx={{
            color: 'text.secondary',
            '&:hover': { bgcolor: '#ffebee', color: 'error.main' }
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      {/* ================= CONTENT SECTION ================= */}
      <DialogContent sx={{ p: 0 }}>
        <Grid container>

          {/* ---------- LEFT PANEL: PRODUCT FORM ---------- */}
          <Grid item xs={12} md={6} sx={{ p: 4 }}>
            <Typography
              variant="subtitle2"
              sx={{
                textTransform: 'uppercase',
                letterSpacing: '1px',
                fontWeight: 700,
                color: 'text.secondary',
                mb: 3
              }}
            >
              General Information
            </Typography>

            <Stack spacing={3}>
              {/* Product Name Input */}
              <TextField
                label="Product Name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Inventory2OutlinedIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />

              {/* Category Input */}
              <TextField
                label="Category"
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                fullWidth
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CategoryOutlinedIcon fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />

              {/* Status Dropdown */}
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={formData.status}
                  label="Status"
                  onChange={handleInputChange}
                  startAdornment={
                    <InputAdornment position="start" sx={{ ml: 1 }}>
                      <FactCheckOutlinedIcon fontSize="small" />
                    </InputAdornment>
                  }
                >
                  <MenuItem value="ACTIVE">
                    <Chip label="ACTIVE" color="success" size="small" />
                  </MenuItem>
                  <MenuItem value="DISCONTINUED">
                    <Chip label="DISCONTINUED" color="error" size="small" />
                  </MenuItem>
                </Select>
              </FormControl>
            </Stack>
          </Grid>

          {/* ---------- RIGHT PANEL: BOM LIST ---------- */}
          <Grid
            item
            xs={12}
            md={6}
            sx={{
              bgcolor: '#fafafa',
              p: 4,
              borderLeft: { md: '1px solid #eee' },
              display: 'flex',
              flexDirection: 'column'
            }}
          >
            {/* BOM Header */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LayersOutlinedIcon color="primary" fontSize="small" />
                <Typography fontWeight={700}>BILL OF MATERIALS</Typography>
              </Box>
              <Chip label={`${productBom.length} Items`} size="small" />
            </Box>

            {/* BOM Items */}
            <Box sx={{ flexGrow: 1, overflowY: 'auto' }}>
              {productBom.length > 0 ? (
                productBom.map((item, index) => (
                  <Paper
                    key={index}
                    elevation={0}
                    sx={{
                      p: 2,
                      mb: 1.5,
                      borderRadius: '12px',
                      border: '1px solid #e0e0e0',
                      display: 'flex',
                      justifyContent: 'space-between'
                    }}
                  >
                    <Typography fontWeight={600}>
                      {item.materialName}
                    </Typography>
                    <Chip label={`x ${item.quantity}`} size="small" />
                  </Paper>
                ))
              ) : (
                <Typography align="center" color="text.secondary">
                  No materials configured.
                </Typography>
              )}
            </Box>

            {/* Navigate to BOM Editor */}
            <Button
              variant="outlined"
              fullWidth
              onClick={() => navigate(`/products/${productId}/edit-bom`)}
              startIcon={<BuildCircleOutlinedIcon />}
              endIcon={<ArrowForwardIosRoundedIcon />}
              sx={{ mt: 3 }}
            >
              Modify Structure
            </Button>
          </Grid>
        </Grid>
      </DialogContent>

      {/* ================= FOOTER ACTIONS ================= */}
      <Divider />

      <DialogActions sx={{ p: 3 }}>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={saveProductDetails}
          startIcon={<SaveRoundedIcon />}
        >
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
}
