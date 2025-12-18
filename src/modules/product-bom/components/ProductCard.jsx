// src/modules/product-bom/components/ProductCard.jsx
import React from "react";
import { Card, CardContent, Typography, Chip, Box } from "@mui/material";

function ProductCard({ product, onClick }) {
  return (
    <Card
      sx={{
        minWidth: 250,
        maxWidth: 350,
        borderRadius: 2,
        cursor: "pointer",
        boxShadow: 3,
        transition: "0.2s",
        "&:hover": { boxShadow: 6, border: "1px solid #1976d2" }
      }}
      onClick={() => onClick(product.id)}
    >
      <CardContent>
        <Typography variant="h6" color="primary">
          {product.name}
        </Typography>
        <Typography variant="subtitle1" color="text.secondary" gutterBottom>
          Category: {product.category}
        </Typography>
        <Box sx={{ mt: 1 }}>
          <Chip
            label={product.status}
            color={product.status === "ACTIVE" ? "success" : "warning"}
            size="small"
          />
        </Box>
      </CardContent>
    </Card>
  );
}

export default ProductCard;