import React, { useState, useEffect } from 'react';
import {
  Typography, TextField, FormControl, InputLabel, Select, MenuItem,
  Grid, Button, Stack, Box, Dialog, DialogTitle, DialogContent,
  DialogActions, IconButton, InputAdornment, Chip, Paper, Divider,
  useTheme, Avatar
} from '@mui/material';

// Icons
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

export default function EditProduct({ open, handleClose, productId, onSaveSuccess }) {
  // -------------------------------------------------------------------------
  //  LOGIC SECTION (UNCHANGED)
  // -------------------------------------------------------------------------
  const [formData, setFormData] = useState({ name: '', category: '', status: 'ACTIVE' });
  const [productBom, setProductBom] = useState([]);
  const navigate = useNavigate();
  const theme = useTheme(); // For accessing theme colors safely

  useEffect(() => {
    if (open && productId) {
      const pid = Number(productId);

      // 1. Get Product Details
      const products = JSON.parse(localStorage.getItem('products')) || [];
      const product = products.find(p => Number(p.id) === pid);
      if (product) {
        setFormData({
          name: product.name || '',
          category: product.category || '',
          status: product.status || 'ACTIVE',
        });
      }

      // 2. Get BOM Details (Simple Filter)
      const allBoms = JSON.parse(localStorage.getItem('boms')) || [];
      const filtered = allBoms.filter(bom => Number(bom.id) === pid);
      setProductBom(filtered);
    }
  }, [open, productId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const saveProductDetails = () => {
    const products = JSON.parse(localStorage.getItem('products')) || [];
    const updated = products.map(p => 
      Number(p.id) === Number(productId) ? { ...p, ...formData } : p
    );
    localStorage.setItem('products', JSON.stringify(updated));
    if (onSaveSuccess) onSaveSuccess();
    handleClose();
  };

  // -------------------------------------------------------------------------
  //  UI SECTION (MODERNIZED)
  // -------------------------------------------------------------------------
  return (
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
        sx: { backdropFilter: 'blur(4px)', backgroundColor: 'rgba(0,0,0,0.1)' }
      }}
    >
      {/* HEADER */}
      <DialogTitle component="div" sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        p: 3,
        background: 'linear-gradient(to right, #f8f9fa, #ffffff)',
        borderBottom: '1px solid #f0f0f0'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Avatar sx={{ bgcolor: 'primary.light', color: 'primary.main' }}>
            <EditOutlinedIcon />
          </Avatar>
          <Box>
            <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.2 }}>
              Edit Product
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Update details & configuration
            </Typography>
          </Box>
        </Box>
        <IconButton onClick={handleClose} sx={{ color: 'text.secondary', '&:hover': { bgcolor: '#ffebee', color: 'error.main' } }}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 0 }}>
        <Grid container sx={{ height: '100%' }}>
          
          {/* LEFT SIDE: FORM INPUTS */}
          <Grid item xs={12} md={6} sx={{ p: 4 }}>
            <Typography variant="subtitle2" sx={{ 
              textTransform: 'uppercase', 
              letterSpacing: '1px', 
              fontWeight: 700, 
              color: 'text.secondary', 
              mb: 3 
            }}>
              General Information
            </Typography>

            <Stack spacing={3}>
              <TextField 
                label="Product Name" 
                name="name" 
                value={formData.name} 
                onChange={handleInputChange} 
                fullWidth 
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Inventory2OutlinedIcon color="action" fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />
              
              <TextField 
                label="Category" 
                name="category" 
                value={formData.category} 
                onChange={handleInputChange} 
                fullWidth 
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <CategoryOutlinedIcon color="action" fontSize="small" />
                    </InputAdornment>
                  ),
                }}
              />

              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select 
                  name="status" 
                  value={formData.status} 
                  label="Status" 
                  onChange={handleInputChange}
                  startAdornment={
                    <InputAdornment position="start" sx={{ ml: 1 }}>
                      <FactCheckOutlinedIcon color="action" fontSize="small" />
                    </InputAdornment>
                  }
                >
                  <MenuItem value="ACTIVE">
                    <Chip label="ACTIVE" color="success" size="small" variant="outlined" sx={{ fontWeight: 600 }} />
                  </MenuItem>
                  <MenuItem value="DISCONTINUED">
                    <Chip label="DISCONTINUED" color="error" size="small" variant="outlined" sx={{ fontWeight: 600 }} />
                  </MenuItem>
                </Select>
              </FormControl>
            </Stack>
          </Grid>

          {/* RIGHT SIDE: BOM */}
          <Grid item xs={12} md={6} sx={{ 
            bgcolor: '#fafafa', 
            p: 4, 
            borderLeft: { md: '1px solid #eee' },
            display: 'flex',
            flexDirection: 'column'
          }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LayersOutlinedIcon color="primary" fontSize="small" />
                <Typography variant="subtitle2" sx={{ fontWeight: 700, color: 'text.primary' }}>
                  BILL OF MATERIALS
                </Typography>
              </Box>
              <Chip label={`${productBom.length} Items`} size="small" sx={{ bgcolor: 'white', fontWeight: 600, border: '1px solid #eee' }} />
            </Box>
            
            <Box sx={{ 
              flexGrow: 1, 
              overflowY: 'auto', 
              maxHeight: '300px', 
              pr: 1,
              '&::-webkit-scrollbar': { width: '4px' },
              '&::-webkit-scrollbar-thumb': { bgcolor: '#ddd', borderRadius: '4px' }
            }}>
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
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      transition: 'all 0.2s',
                      '&:hover': { transform: 'translateX(4px)', borderColor: 'primary.main' }
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                      <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'primary.main' }} />
                      <Typography variant="body2" sx={{ fontWeight: 600, color: '#333' }}>
                        {item.materialName}
                      </Typography>
                    </Box>
                    <Chip 
                      label={`x ${item.quantity}`} 
                      size="small" 
                      sx={{ borderRadius: '6px', height: '24px', fontSize: '0.75rem', fontWeight: 700, bgcolor: 'primary.50', color: 'primary.main' }} 
                    />
                  </Paper>
                ))
              ) : (
                <Box sx={{ textAlign: 'center', py: 5, opacity: 0.6 }}>
                  <LayersOutlinedIcon sx={{ fontSize: 40, color: 'text.disabled', mb: 1 }} />
                  <Typography variant="body2" color="text.secondary">No materials configured.</Typography>
                </Box>
              )}
            </Box>
            
            <Button 
              variant="outlined" 
              fullWidth 
              onClick={() => navigate(`/products/${productId}/edit-bom`)} 
              startIcon={<BuildCircleOutlinedIcon />}
              endIcon={<ArrowForwardIosRoundedIcon sx={{ fontSize: '14px !important' }} />}
              sx={{ 
                mt: 3, 
                borderRadius: '12px', 
                textTransform: 'none', 
                fontWeight: 600,
                borderStyle: 'dashed',
                borderWidth: '2px',
                '&:hover': { borderStyle: 'dashed', borderWidth: '2px', bgcolor: 'primary.50' }
              }}
            >
              Modify Structure
            </Button>
          </Grid>
        </Grid>
      </DialogContent>

      <Divider />

      <DialogActions sx={{ p: 3, bgcolor: '#ffffff' }}>
        <Button 
          onClick={handleClose} 
          sx={{ 
            color: 'text.secondary', 
            fontWeight: 600, 
            textTransform: 'none',
            px: 3
          }}
        >
          Cancel
        </Button>
        <Button 
          variant="contained" 
          onClick={saveProductDetails} 
          startIcon={<SaveRoundedIcon />}
          disableElevation
          sx={{ 
            borderRadius: '10px', 
            px: 4, 
            py: 1, 
            fontWeight: 700, 
            textTransform: 'none',
            background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
            boxShadow: '0 3px 5px 2px rgba(33, 203, 243, .3)',
            '&:hover': { boxShadow: '0 6px 10px 4px rgba(33, 203, 243, .3)' }
          }}
        >
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
}