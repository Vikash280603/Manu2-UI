import React, { useState, useEffect } from "react";
import { Container, Typography, Button, Box, Grid, Stack, TextField } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ProductCard from "../components/ProductCard";
import EditProductModal from "./EditProduct"; // Import the modal version
import { products as initialProducts } from "../entities/product";
import { boms as initialBoms } from "../entities/bom"; // Import the static BOM data
import { Navigate , useNavigate  } from "react-router-dom";
import AddProduct from "./AddProduct";

 
function ProductList() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const Navigate = useNavigate();
 
  // Modal States
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
 
  useEffect(() => {
    // Initialize products in localStorage
    const storedProducts = localStorage.getItem("products");
    if (!storedProducts) {
      localStorage.setItem("products", JSON.stringify(initialProducts));
      setProducts(initialProducts);
    } else {
      try {
        setProducts(JSON.parse(storedProducts));
      } catch {
        // Fallback if corrupted
        localStorage.setItem("products", JSON.stringify(initialProducts));
        setProducts(initialProducts);
      }
    }
 
    // Initialize BOMs in localStorage
    const storedBoms = localStorage.getItem("boms");
    if (!storedBoms) {
      localStorage.setItem("boms", JSON.stringify(initialBoms));
    } else {
      try {
        JSON.parse(storedBoms);
      } catch {
        // If corrupted, reset to initialBoms
        localStorage.setItem("boms", JSON.stringify(initialBoms));
      }
    }
  }, []);
 
  const handleOpenEdit = (id) => {
    // ensure id is a number for consistency
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
 
  return (
<Box sx={{ bgcolor: "#f4f7f9", minHeight: "100vh", py: 6 }}>
<Container maxWidth="lg">
<Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
<Typography variant="h3" sx={{ fontWeight: 800 }}>Products</Typography>
<Button
            variant="contained"
            startIcon={<AddIcon />}
            sx={{ borderRadius: "10px", px: 3, fontWeight: 700 }}
            onClick={()=>Navigate('/products/add')}
>
            New Product
</Button>
</Stack>
 
        <TextField
          fullWidth
          placeholder="Search..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ mb: 4, bgcolor: "white", borderRadius: "12px" }}
        />
 
        <Grid container spacing={3}>
          {filteredProducts.map((product) => (
<Grid item xs={12} sm={6} md={4} key={product.id}>
<ProductCard product={product} onClick={() => handleOpenEdit(product.id)} />
</Grid>
          ))}
</Grid>
 
        {/* THE MODAL LIVES HERE */}
        {selectedProductId !== null && (
<EditProductModal
            open={isModalOpen}
            productId={selectedProductId}
            handleClose={() => setIsModalOpen(false)}
            onSaveSuccess={handleRefresh}
          />
        )}
</Container>
</Box>
  );
}
 
export default ProductList;