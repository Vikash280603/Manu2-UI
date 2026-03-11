// UPDATED EditProduct.jsx - Loads and updates via API  
  
import React, { useState, useEffect } from 'react';  
import {  
  Typography, TextField, FormControl, InputLabel, Select, MenuItem,  
  Grid, Button, Stack, Box, Dialog, DialogTitle, DialogContent,  
  DialogActions, IconButton, InputAdornment, Chip, Paper, Divider,  
  Avatar, CircularProgress, Alert  
} from '@mui/material';  
  
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
  
// ✅ CHANGE: Import API functions  
import { getProductById, updateProduct } from '../../product-bom/api/productApi';  
  
export default function EditProduct({ open, handleClose, productId, onSaveSuccess }) {  
  const [formData, setFormData] = useState({  
    name: '',  
    category: '',  
    status: 'ACTIVE'  
  });  
  
  const [productBom, setProductBom] = useState([]);  
  const navigate = useNavigate();  
  
  // ✅ NEW: Loading and error states  
  const [loading, setLoading] = useState(false);  
  const [saving, setSaving] = useState(false);  
  const [error, setError] = useState("");  
  
  // ✅ CHANGE: Load product data from API  
  useEffect(() => {  
    const loadProduct = async () => {  
      if (open && productId) {  
        try {  
          setLoading(true);  
          setError("");  
  
          const product = await getProductById(productId);  

            
          setFormData({  
            name: product.name || '',  
            category: product.category || '',  
            status: product.status || 'ACTIVE',  
          });  
  
          // BOMs are already included in the product response  
          setProductBom(product.boMs || []);  
          // console.log("Loaded product BOMs:", product.boMs); // Debug log
          // console.log("Product details :" ,product); // Debug log

        } catch (err) {  
          setError(err.message);  
          console.error("Failed to load product:", err);  
        } finally {  
          setLoading(false);  
        }  
      }  
    };  
  
    loadProduct();  
  }, [open, productId]);  
  
  const handleInputChange = (e) => {  
    const { name, value } = e.target;  
    setFormData(prev => ({  
      ...prev,  
      [name]: value  
    }));  
  };  
  
  // ✅ CHANGE: Save via API instead of localStorage  
  const saveProductDetails = async () => {  
    try {  
      setSaving(true);  
      setError("");  
  
      await updateProduct(productId, formData);  
  
      if (onSaveSuccess) onSaveSuccess();  
      handleClose();  
    } catch (err) {  
      setError(err.message);  
    } finally {  
      setSaving(false);  
    }  
  };  
  
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
        sx: {  
          backdropFilter: 'blur(4px)',  
          backgroundColor: 'rgba(0,0,0,0.1)'  
        }  
      }}  
    >  
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
  
      <DialogContent sx={{ p: 0 }}>  
        {/* ✅ NEW: Show loading spinner or error */}  
        {loading ? (  
          <Box sx={{ p: 4, textAlign: 'center' }}>  
            <CircularProgress />  
            <Typography sx={{ mt: 2 }}>Loading product...</Typography>  
          </Box>  
        ) : error ? (  
          <Alert severity="error" sx={{ m: 3 }}>  
            {error}  
          </Alert>  
        ) : (  
          <Grid container>  
            {/* LEFT PANEL: PRODUCT FORM */}  
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
                <TextField  
                  label="Product Name"  
                  name="name"  
                  value={formData.name}  
                  onChange={handleInputChange}  
                  fullWidth  
                  disabled={saving}  
                  InputProps={{  
                    startAdornment: (  
                      <InputAdornment position="start">  
                        <Inventory2OutlinedIcon fontSize="small" />  
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
                  disabled={saving}  
                  InputProps={{  
                    startAdornment: (  
                      <InputAdornment position="start">  
                        <CategoryOutlinedIcon fontSize="small" />  
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
                    disabled={saving}  
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
  
            {/* RIGHT PANEL: BOM LIST */}  
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
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>  
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>  
                  <LayersOutlinedIcon color="primary" fontSize="small" />  
                  <Typography fontWeight={700}>BILL OF MATERIALS</Typography>  
                </Box>  
                <Chip label={`${productBom.length} Items`} size="small" />  
              </Box>  
  
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
  
              <Button  
                variant="outlined"  
                fullWidth  
                onClick={() => {if(formData.status=='ACTIVE') navigate(`/products/${productId}/edit-bom`)
                else alert("Only ACTIVE products can be modified")}}  
                startIcon={<BuildCircleOutlinedIcon />}  
                endIcon={<ArrowForwardIosRoundedIcon />}  
                sx={{ mt: 3 }}  
              >  
                Modify Structure  
              </Button>  
            </Grid>  
          </Grid>  
        )}  
      </DialogContent>  
  
      <Divider />  
  
      <DialogActions sx={{ p: 3 }}>  
        <Button onClick={handleClose} disabled={saving}>Cancel</Button>  
        <Button  
          variant="contained"  
          onClick={saveProductDetails}  
          disabled={saving || loading}  
          startIcon={saving ? <CircularProgress size={20} /> : <SaveRoundedIcon />}  
        >  
          {saving ? "Saving..." : "Save Changes"}  
        </Button>  
      </DialogActions>  
    </Dialog>  
  );  
}