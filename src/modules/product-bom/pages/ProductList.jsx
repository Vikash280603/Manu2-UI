import React, { useState, useEffect } from "react";

/*
  Importing Material UI (MUI) components.
  MUI provides pre-built UI components that already handle:
  - responsiveness
  - accessibility
  - styling consistency

  Brief purpose of each:
  - Container : Centers content and limits max width
  - Typography: All text (headings, paragraphs, captions)
  - Button    : Clickable buttons
  - Box       : Generic layout wrapper (like a div with styling powers)
  - Grid      : Responsive grid system (row/columns)
  - Stack     : Simplified flexbox layout (row/column spacing)
  - TextField : Input fields
  - Paper     : Elevated surface (cards, search bars)
  - Avatar    : Icon/image container (circle/square)
  - Divider   : Thin separator line
  - IconButton: Button that only contains an icon
  - Chip      : Small pill-style labels (stats, status)
*/
import { 
  Container, Typography, Button, Box, Grid, Stack, TextField, 
  Paper, Avatar, Divider, IconButton, Chip 
} from "@mui/material";

// Icons are visual-only components from MUI Icons library
import AddCircleRoundedIcon from "@mui/icons-material/AddCircleRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import Inventory2TwoToneIcon from "@mui/icons-material/Inventory2TwoTone";
import TuneRoundedIcon from "@mui/icons-material/TuneRounded";
import DashboardCustomizeRoundedIcon from "@mui/icons-material/DashboardCustomizeRounded";

// Custom components created in your project
import ProductCard from "../components/ProductCard";
import EditProductModal from "./EditProduct";

// Hardcoded mock data (used instead of backend API)
import { products as initialProducts } from "../../entities/product";
import { boms as initialBoms } from "../../entities/bom";

// React Router hook for programmatic navigation
import { useNavigate } from "react-router-dom";

function ProductList() {

  // -------------------------------------------------------------------------
  //  LOGIC SECTION (State + Data handling)
  // -------------------------------------------------------------------------

  /*
    products:
    - Stores the list of products displayed on the UI
    - Initially empty, filled from localStorage on page load
  */
  const [products, setProducts] = useState([]);

  /*
    searchTerm:
    - Stores user input from the search bar
    - Used to filter products by name
  */
  const [searchTerm, setSearchTerm] = useState("");

  /*
    navigate:
    - Function provided by React Router
    - Used to move to another page programmatically
    - Example: navigate("/products/add")
  */
  const navigate = useNavigate();

  /*
    Modal state:
    - isModalOpen       : controls whether Edit modal is visible
    - selectedProductId: stores which product is being edited
  */
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);

  /*
    useEffect runs once when the component mounts (page loads)
    because dependency array is empty []
  */
  useEffect(() => {

    // -------------------- PRODUCT INITIALIZATION --------------------

    /*
      Try to read products from localStorage.
      localStorage is used here as a "fake database".
    */
    const storedProducts = localStorage.getItem("products");

    if (!storedProducts) {
      /*
        If no products exist in localStorage:
        - Seed it with initialProducts
        - Update React state
      */
      localStorage.setItem("products", JSON.stringify(initialProducts));
      setProducts(initialProducts);
    } else {
      try {
        /*
          If products exist and JSON is valid:
          - Parse and store in state
        */
        setProducts(JSON.parse(storedProducts));
      } catch {
        /*
          If JSON is corrupted:
          - Reset localStorage
          - Use initialProducts
        */
        localStorage.setItem("products", JSON.stringify(initialProducts));
        setProducts(initialProducts);
      }
    }

    // -------------------- BOM INITIALIZATION --------------------

    /*
      BOMs are initialized here so that:
      - They are available globally in localStorage
      - Other pages can read them later
    */
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

  /*
    Called when a ProductCard is clicked
    - Stores selected product ID
    - Opens EditProduct modal
  */
  const handleOpenEdit = (id) => {
    setSelectedProductId(Number(id));
    setIsModalOpen(true);
  };

  /*
    Refreshes product list after edit/save
    - Reads updated products from localStorage
    - Updates UI state
  */
  const handleRefresh = () => {
    const stored = JSON.parse(localStorage.getItem("products")) || [];
    setProducts(stored);
  };

  /*
    Filters products based on search input
    - Converts both strings to lowercase for case-insensitive match
  */
  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  /*
    Counts how many products are ACTIVE
    - Used for stats display in top navbar
  */
  const activeCount = products.filter(p => p.status === 'ACTIVE').length;

  // -------------------------------------------------------------------------
  //  UI SECTION (JSX rendering)
  // -------------------------------------------------------------------------
  return (
    <Box
      /*
        Page wrapper:
        - Sets background color
        - Full viewport height
        - Decorative gradient background
      */
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
      
      {/* ====================== 1. TOP NAVBAR AREA ====================== */}
      <Box
        /*
          Sticky header:
          - Stays visible while scrolling
          - Uses blur + transparency for glass effect
        */
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

            {/* Logo + App Title */}
            <Stack direction="row" alignItems="center" spacing={2}>
              <Avatar sx={{ bgcolor: 'primary.main', variant: 'rounded' }}>
                <Inventory2TwoToneIcon sx={{ color: 'white' }} />
              </Avatar>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 800, lineHeight: 1 }}>
                  Product Manager
                </Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  v2.4.1
                </Typography>
              </Box>
            </Stack>

            {/* Product statistics pills */}
            <Stack direction="row" spacing={1} sx={{ display: { xs: 'none', md: 'flex' } }}>
              <Chip label={`Total: ${products.length}`} size="small" />
              <Chip label={`Active: ${activeCount}`} size="small" color="success" variant="outlined" />
            </Stack>

          </Stack>
        </Container>
      </Box>

      {/* ====================== 2. HERO & CONTROL SECTION ====================== */}
      <Container maxWidth="lg" sx={{ mt: 6, mb: 6 }}>
        <Stack direction={{ xs: 'column', md: 'row' }} alignItems="end" spacing={4}>
          
          {/* Left side: title, description, search */}
          <Box sx={{ flexGrow: 1, width: '100%' }}>
            <Typography variant="h3" sx={{ fontWeight: 800 }}>
              Products
            </Typography>

            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Manage your Products, edit configurations, and track Products & BOMs efficiently.
            </Typography>

            {/* Search Bar */}
            <Paper
              elevation={0}
              sx={{
                p: '4px',
                display: 'flex',
                alignItems: 'center'
              }}
            >
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

          {/* Primary CTA button */}
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

      {/* ====================== 3. PRODUCT GRID ====================== */}
      <Container maxWidth="lg">
        {filteredProducts.length > 0 ? (
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
          /* Empty state UI */
          <Stack alignItems="center" justifyContent="center" sx={{ py: 10 }}>
            <DashboardCustomizeRoundedIcon fontSize="large" />
            <Typography>No products found</Typography>
          </Stack>
        )}
      </Container>

      {/* ====================== EDIT PRODUCT MODAL ====================== */}
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
