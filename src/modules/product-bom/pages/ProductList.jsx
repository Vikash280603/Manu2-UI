// UPDATED ProductList.jsx - Uses real API instead of localStorage  
  
import React, { useState, useEffect } from "react";  
import {   
  Container, Typography, Button, Box, Grid, Stack, TextField,   
  Paper, Avatar, Divider, IconButton, Chip, CircularProgress, Alert, Tooltip  
} from "@mui/material";  
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";  
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";  
import Inventory2TwoToneIcon from "@mui/icons-material/Inventory2TwoTone";  
import TuneRoundedIcon from "@mui/icons-material/TuneRounded";  
import DashboardCustomizeRoundedIcon from "@mui/icons-material/DashboardCustomizeRounded";  
import LogoutIcon from "@mui/icons-material/Logout";

import HomeIcon from "@mui/icons-material/Home";
  
import ProductCard from "../components/ProductCard";  
import EditProductModal from "../pages/EditProduct";  
  
// ✅ CHANGE: Import API functions instead of localStorage data  
import { getAllProducts } from "../../product-bom/api/productApi";  
import { getCurrentUser } from "../../../auth/authApi";
  
import { useNavigate } from "react-router-dom";  
  
function ProductList() {  
  const [products, setProducts] = useState([]);  
  const [searchTerm, setSearchTerm] = useState("");  
  const navigate = useNavigate();  
  
  const [isModalOpen, setIsModalOpen] = useState(false);  
  const [selectedProductId, setSelectedProductId] = useState(null);  
  
  // ✅ NEW: Loading and error states  
  const [loading, setLoading] = useState(true);  
  const [error, setError] = useState("");  

  // ✅ NEWLY ADDED - Get current user to check role
  const user = getCurrentUser();
  const isAdmin = user?.role === 'admin';

  // ✅ NEWLY ADDED - Handler for home icon click (admin only)
  const handleHomeClick = () => {
    navigate('/analytics');
  };
  
  // ✅ CHANGE: Load products from API instead of localStorage  
  const loadProducts = async () => {  
    try {  
      setLoading(true);  
      setError("");  
      const data = await getAllProducts(searchTerm);  
      setProducts(data);  
    } catch (err) {  
      setError(err.message);  
      console.error("Failed to load products:", err);  
    } finally {  
      setLoading(false);  
    }  
  };  
  
  // ✅ CHANGE: Load on mount and when searchTerm changes  
  useEffect(() => {  
    loadProducts();  
  }, [searchTerm]);  
  
  const handleOpenEdit = (id) => {  
    setSelectedProductId(Number(id));  
    setIsModalOpen(true);  
  };  
  
  // ✅ CHANGE: Refresh now reloads from API  
  const handleRefresh = () => {  
    loadProducts();  
  };  
  
  // ✅ CHANGE: Filter happens on backend now, but keep for instant UI feedback  
  const filteredProducts = products.filter((p) =>  
    p.name.toLowerCase().includes(searchTerm.toLowerCase())  
  );  
  
  const activeCount = products.filter(p => p.status === 'ACTIVE').length;  
  
  
const pillTagSx = {
  bgcolor: 'primary.main',
  color: 'white',
  borderRadius: 999,
  px: 2,                      // Slightly reduced horizontal padding
  py: 0.4,                      // Slightly reduced vertical padding
  display: 'inline-flex',
  alignItems: 'center',
  fontWeight: 600,
  
  // --- UPDATED SIZE & FONT ---
  fontSize: '0.9rem',          // Reduced font size (approx 12px)
  fontFamily: 'Arial, sans-serif', 
  // ---------------------------

  lineHeight: 1,
  userSelect: 'none',           // Often better for buttons/pills
  transition: 'all 0.3s ease',
  '&:hover': {
    transform: 'scale(1.05)',   // Slightly subtler scale for smaller text
    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
  },
};
  return (  
    <Box  
      sx={{   
        bgcolor: "#f0f2f5",   
        minHeight: "100vh",  
        pb: 10,  
        position: 'relative',  
        backgroundImage: `  
          radial-gradient(at 0% 0%, hsla(210,100%,93%,1) 0, transparent 50%),   
          radial-gradient(at 100% 0%, hsla(220,100%,96%,1) 0, transparent 50%)  
        `  
      }}  
    >  
        
      {/* TOP NAVBAR */}  
      <Box  
        sx={{   
          position: 'sticky',   
          top: 0,   
          zIndex: 10,   
          backdropFilter: 'blur(10px)',  
          bgcolor: 'rgba(255,255,255,0.7)',  
          borderBottom: '1px solid rgba(0,0,0,0.05)',  
          py: 2  
        }}  
      >  
        <Container maxWidth="lg">  
          <Stack direction="row" justifyContent="space-between" alignItems="center">  
            <Stack direction="row" alignItems="center" spacing={2}>  
            {/* ✅ UPDATED: Conditionally show Home icon for admin or Product icon for others */}
            {isAdmin ? (
              <Tooltip title="Go to Analytics">
                <Avatar 
                  onClick={handleHomeClick}
                  sx={{ 
                    bgcolor: 'primary.main', 
                    variant: 'rounded',
                    cursor: 'pointer',  // ✅ Pointer cursor for clickable feel
                    '&:hover': {  // ✅ Hover effect
                      transform: 'scale(1.1)',
                      boxShadow: '0 4px 12px rgba(25, 118, 210, 0.3)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >  
                  <HomeIcon sx={{ color: 'white' }} />  {/* ✅ Home icon for admin */}
                </Avatar>
              </Tooltip>
            ) : (
              <Avatar sx={{ bgcolor: 'primary.main', variant: 'rounded' }}>  
                <Inventory2TwoToneIcon sx={{ color: 'white' }} />  {/* ✅ Product icon for non-admin */}
              </Avatar>
            )}  
              <Box>  
                <Typography variant="subtitle1" sx={{ fontWeight: 800, lineHeight: 1 }}>  
                  Product Manager  
                </Typography>  
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>  
                  v2.4.1  
                </Typography>  
              </Box>  
            </Stack>  
  
            <Stack direction="row" spacing={1} sx={{ display: { xs: 'none', md: 'flex' } }}> 
              <Box sx={pillTagSx}>Total: {products.length}</Box>
              <Box sx={pillTagSx}>Active: {activeCount}</Box>

              <Tooltip title="Logout">
                <Avatar 
                  onClick={() => {
                  localStorage.removeItem('loggedInUser'); // Clear user session
                  navigate('/login');
                }}
                  sx={{ 
                    bgcolor: '#f94949ff',
                    variant: 'rounded',
                    cursor: 'pointer',  // ✅ Pointer cursor for clickable feel
                    '&:hover': {  // ✅ Hover effect
                      transform: 'scale(1.1)',
                      boxShadow: "0 4px 20px rgba(102, 126, 234, 0.4)"
                    },
                    transition: 'all 0.3s ease',
                  }}
                >  
                  <LogoutIcon sx={{ color: 'white' }} />
                </Avatar>
              </Tooltip>
            </Stack>
          </Stack>  
        </Container>  
      </Box>  
  
      {/* HERO & CONTROL SECTION */}  
      <Container maxWidth="lg" sx={{ mt: 6, mb: 6 }}>  
        <Stack direction={{ xs: 'column', md: 'row' }} alignItems="end" spacing={4}>  
          <Box sx={{ flexGrow: 1, width: '100%' }}>  
            <Typography variant="h3" sx={{ fontWeight: 800 }}>  
              Products  
            </Typography>  
  
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>  
              Manage your Products, edit configurations, and track Products & BOMs efficiently.  
            </Typography>  
  
            {/* Search Bar */}  
            <Paper elevation={0} sx={{ p: '4px', display: 'flex', alignItems: 'center' }}>  
              <IconButton>  
                <SearchRoundedIcon />  
              </IconButton>  
  
              <TextField  
                sx={{ ml: 1, flex: 1 }}  
                placeholder="Search products..."  
                variant="standard"  
                value={searchTerm}  
                onChange={(e) => setSearchTerm(e.target.value)}  
                InputProps={{ disableUnderline: true }}  
              />  
  
              <Divider orientation="vertical" />  
              <IconButton>  
                <TuneRoundedIcon />  
              </IconButton>  
            </Paper>  
          </Box>  
  
          <Button  
            variant="contained"  
            size="large"  
            onClick={() => navigate('/products/add')}  
            startIcon={<AddCircleRoundedIcon />}  
          >  
            Create Product  
          </Button>  
        </Stack>  
      </Container>  
  
      {/* PRODUCT GRID */}  
      <Container maxWidth="lg">  
        {/* ✅ NEW: Show loading spinner */}  
        {loading ? (  
          <Stack alignItems="center" justifyContent="center" sx={{ py: 10 }}>  
            <CircularProgress />  
            <Typography sx={{ mt: 2 }}>Loading products...</Typography>  
          </Stack>  
        ) : error ? (  
          /* ✅ NEW: Show error message */  
          <Alert severity="error" sx={{ mb: 3 }}>  
            {error}  
          </Alert>  
        ) : filteredProducts.length > 0 ? (  
          <Grid container spacing={3} alignItems="stretch">  
            {filteredProducts.map((product) => (  
              <Grid item xs={12} sm={6} md={4} key={product.id}>  
                <ProductCard   
                  product={product}   
                  onClick={handleOpenEdit}   
                />  
              </Grid>  
            ))}  
          </Grid>  
        ) : (  
          <Stack alignItems="center" justifyContent="center" sx={{ py: 10 }}>  
            <DashboardCustomizeRoundedIcon fontSize="large" />  
            <Typography>No products found</Typography>  
          </Stack>  
        )}  
      </Container>  
  
      {/* EDIT PRODUCT MODAL */}  
      {selectedProductId !== null && (  
        <EditProductModal  
          open={isModalOpen}  
          productId={selectedProductId}  
          handleClose={() => setIsModalOpen(false)}  
          onSaveSuccess={handleRefresh}  
        />  
      )}  
    </Box>  
  );  
}   
  
export default ProductList;