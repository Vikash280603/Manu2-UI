import React, { useState, useEffect } from "react";
import { 
  Container, Typography, Button, Box, Grid, Stack, TextField, 
  Paper, Avatar, Divider, IconButton, Chip 
} from "@mui/material";

// Icons
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import Inventory2TwoToneIcon from "@mui/icons-material/Inventory2TwoTone";
import TuneRoundedIcon from "@mui/icons-material/TuneRounded";
import DashboardCustomizeRoundedIcon from "@mui/icons-material/DashboardCustomizeRounded";

import ProductCard from "../components/ProductCard";
import EditProductModal from "./EditProduct";
import { products as initialProducts } from "../entities/product";
import { boms as initialBoms } from "../entities/bom";
import { useNavigate } from "react-router-dom";

function ProductList() {
  // -------------------------------------------------------------------------
  //  LOGIC SECTION
  // -------------------------------------------------------------------------
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);

  useEffect(() => {
    // Initialize products
    const storedProducts = localStorage.getItem("products");
    if (!storedProducts) {
      localStorage.setItem("products", JSON.stringify(initialProducts));
      setProducts(initialProducts);
    } else {
      try {
        setProducts(JSON.parse(storedProducts));
      } catch {
        localStorage.setItem("products", JSON.stringify(initialProducts));
        setProducts(initialProducts);
      }
    }

    // Initialize BOMs
    const storedBoms = localStorage.getItem("boms");
    if (!storedBoms) {
      localStorage.setItem("boms", JSON.stringify(initialBoms));
    } else {
      try {
        JSON.parse(storedBoms);
      } catch {
        localStorage.setItem("boms", JSON.stringify(initialBoms));
      }
    }
  }, []);

  const handleOpenEdit = (id) => {
    setSelectedProductId(Number(id));
    setIsModalOpen(true);
  };

  const handleRefresh = () => {
    const stored = JSON.parse(localStorage.getItem("products")) || [];
    setProducts(stored);
  };

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeCount = products.filter(p => p.status === 'ACTIVE').length;

  // -------------------------------------------------------------------------
  //  UI SECTION
  // -------------------------------------------------------------------------
  return (
    <Box sx={{ 
      bgcolor: "#f0f2f5", 
      minHeight: "100vh",
      pb: 10,
      position: 'relative',
      backgroundImage: `
        radial-gradient(at 0% 0%, hsla(210,100%,93%,1) 0, transparent 50%), 
        radial-gradient(at 100% 0%, hsla(220,100%,96%,1) 0, transparent 50%)
      `
    }}>
      
      {/* 1. TOP NAVBAR AREA */}
      <Box sx={{ 
        position: 'sticky', 
        top: 0, 
        zIndex: 10, 
        backdropFilter: 'blur(10px)',
        bgcolor: 'rgba(255,255,255,0.7)',
        borderBottom: '1px solid rgba(0,0,0,0.05)',
        py: 2
      }}>
        <Container maxWidth="lg">
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            {/* Logo / Brand Area */}
            <Stack direction="row" alignItems="center" spacing={2}>
              <Avatar sx={{ bgcolor: 'primary.main', variant: 'rounded' }}>
                <Inventory2TwoToneIcon sx={{ color: 'white' }} />
              </Avatar>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 800, lineHeight: 1, color: '#1e293b' }}>
                  Product Manager
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary', fontWeight: 500 }}>
                  v2.4.0
                </Typography>
              </Box>
            </Stack>

            {/* Quick Stats Pills */}
            <Stack direction="row" spacing={1} sx={{ display: { xs: 'none', md: 'flex' } }}>
              <Chip 
                label={`Total: ${products.length}`} 
                size="small" 
                sx={{ bgcolor: 'white', fontWeight: 600, border: '1px solid #e2e8f0' }} 
              />
              <Chip 
                label={`Active: ${activeCount}`} 
                size="small" 
                color="success"
                variant="outlined"
                sx={{ bgcolor: '#f0fdf4', fontWeight: 600, borderColor: '#bbf7d0' }} 
              />
            </Stack>
          </Stack>
        </Container>
      </Box>

      {/* 2. HERO & CONTROL SECTION */}
      <Container maxWidth="lg" sx={{ mt: 6, mb: 6 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} alignItems="end" spacing={4}>
          
          <Box sx={{ flexGrow: 1, width: '100%' }}>
            <Typography variant="h3" sx={{ 
              fontWeight: 800, 
              color: '#0f172a', 
              mb: 1,
              letterSpacing: '-1px' 
            }}>
              Products
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: '600px' }}>
              Manage your Products, edit configurations, and track Products & BOMs efficiently.
            </Typography>

            {/* Search Bar */}
            <Paper
              elevation={0}
              sx={{
                p: '4px',
                display: 'flex',
                alignItems: 'center',
                width: '100%',
                borderRadius: '16px',
                border: '1px solid #e2e8f0',
                boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
                transition: 'all 0.3s ease',
                '&:focus-within': {
                  boxShadow: '0 8px 30px rgba(0,0,0,0.08)',
                  borderColor: 'primary.main',
                  transform: 'translateY(-2px)'
                }
              }}
            >
              <IconButton sx={{ p: '12px' }} aria-label="search">
                <SearchRoundedIcon sx={{ color: 'primary.main' }} />
              </IconButton>
              <TextField
                sx={{ ml: 1, flex: 1 }}
                placeholder="Search products..."
                variant="standard"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{ 
                  disableUnderline: true, 
                  sx: { fontSize: '1rem', fontWeight: 500 } 
                }}
              />
              <Divider sx={{ height: 28, m: 0.5 }} orientation="vertical" />
              <IconButton color="default" sx={{ p: '12px' }} aria-label="directions">
                <TuneRoundedIcon fontSize="small" />
              </IconButton>
            </Paper>
          </Box>

          {/* Primary Action Button */}
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate('/products/add')}
            startIcon={<AddCircleRoundedIcon />}
            sx={{
              borderRadius: '14px',
              px: 4,
              py: 2,
              fontWeight: 700,
              textTransform: 'none',
              fontSize: '1rem',
              whiteSpace: 'nowrap',
              boxShadow: '0 10px 20px -5px rgba(0, 123, 255, 0.4)',
              background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
              transition: 'transform 0.2s',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 15px 30px -5px rgba(0, 123, 255, 0.5)',
              }
            }}
          >
            Create Product
          </Button>
        </Stack>
      </Container>

      {/* 3. PRODUCT GRID */}
      <Container maxWidth="lg">
        {filteredProducts.length > 0 ? (
          <Grid container spacing={3} alignItems="stretch">
            {filteredProducts.map((product) => (
              <Grid item xs={12} sm={6} md={4} key={product.id}>
                {/* We removed the external 'Box' wrapper.
                   We pass 'handleOpenEdit' directly to the onClick prop.
                   The ProductCard component now handles the click and the height.
                */}
                <ProductCard 
                  product={product} 
                  onClick={handleOpenEdit} 
                />
              </Grid>
            ))}
          </Grid>
        ) : (
          /* EMPTY STATE */
          <Stack alignItems="center" justifyContent="center" sx={{ py: 10, opacity: 0.7 }}>
            <Box sx={{ 
              p: 3, 
              bgcolor: 'white', 
              borderRadius: '50%', 
              mb: 2, 
              boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)' 
            }}>
              <DashboardCustomizeRoundedIcon sx={{ fontSize: 48, color: 'text.secondary' }} />
            </Box>
            <Typography variant="h6" color="text.primary" sx={{ fontWeight: 600 }}>
              No products found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              We couldn't find anything matching "{searchTerm}"
            </Typography>
          </Stack>
        )}
      </Container>

      {/* MODAL */}
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