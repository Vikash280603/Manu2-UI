import React, { useState, useEffect } from 'react';
import {
  Typography, TextField, FormControl, InputLabel, Select, MenuItem,
  Grid, Button, Stack, Box, Dialog, DialogTitle, DialogContent,
  DialogActions, IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate, Navigate  } from 'react-router-dom';

export default function EditProduct({ open, handleClose, productId, onSaveSuccess }) {
  const [formData, setFormData] = useState({ name: '', category: '', status: 'ACTIVE' });
  const [productBom, setProductBom] = useState([]);
  const navigate = useNavigate();

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

  return (
    <Dialog open={open} onClose={handleClose} fullWidth maxWidth="md" PaperProps={{ sx: { borderRadius: '20px' } }}>
      {/* component="div" fixes the <h5> inside <h2> hydration error */}
      <DialogTitle component="div" sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 3 }}>
        <Typography variant="h5" sx={{ fontWeight: 800 }}>Edit Product</Typography>
        <IconButton onClick={handleClose}><CloseIcon /></IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ p: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Stack spacing={3}>
              <TextField label="Product Name" name="name" value={formData.name} onChange={handleInputChange} fullWidth />
              <TextField label="Category" name="category" value={formData.category} onChange={handleInputChange} fullWidth />
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select name="status" value={formData.status} label="Status" onChange={handleInputChange}>
                  <MenuItem value="ACTIVE">ACTIVE</MenuItem>
                  <MenuItem value="DISCONTINUED">DISCONTINUED</MenuItem>
                </Select>
              </FormControl>
            </Stack>
          </Grid>

          <Grid item xs={12} md={6} sx={{ borderLeft: { md: '1px solid #eee' } }}>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2, color: 'primary.main' }}>
              BILL OF MATERIALS
            </Typography>
            
            {productBom.length > 0 ? (
              productBom.map((item, index) => (
                <Box key={index} sx={{ p: 2, mb: 1, bgcolor: '#f8f9fa', borderRadius: '10px' }}>
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>{item.materialName}</Typography>
                  <Typography variant="caption">Qty: {item.quantity}</Typography>
                </Box>
              ))
            ) : (
              <Typography variant="body2" color="text.secondary">No materials found.</Typography>
            )}
            
            <Button 
              variant="outlined" 
              fullWidth 
              onClick={() => navigate(`/products/${productId}/edit-bom`)} 
              sx={{ mt: 2, fontWeight: 600 }}
            >
              Edit BOM
            </Button>
          </Grid>
        </Grid>
      </DialogContent>

      <DialogActions sx={{ p: 3 }}>
        <Button onClick={handleClose}>Cancel</Button>
        <Button variant="contained" onClick={saveProductDetails} sx={{ borderRadius: '10px', px: 4, fontWeight: 700 }}>
          Save Changes
        </Button>
      </DialogActions>
    </Dialog>
  );
}