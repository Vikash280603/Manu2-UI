// src/modules/product-bom/pages/ProductList.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Typography,
  Button,
  Box,
  Grid,
  Stack
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import ProductCard from "../components/ProductCard";
import { products } from "../entities/product";



function ProductList() {
  const navigate = useNavigate();

  const handleCardClick = (productId) => {
    navigate(`/products/${productId}/edit`);
  };

  return (
    <Container sx={{ py: 4 }}>
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        mb={3}
      >
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Products
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate("/products/add")}
          sx={{ fontWeight: 600 }}
        >
          Create New Product
        </Button>
      </Stack>
      <Grid container spacing={3}>
        {products.map((product) => (
          <Grid item xs={12} sm={6} md={4} key={product.id}>
            <ProductCard product={product} onClick={handleCardClick} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default ProductList;