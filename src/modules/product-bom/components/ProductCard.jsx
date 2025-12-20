import React from "react";
import { Card, CardContent, Typography, Chip, Box, Stack } from "@mui/material";
import ChevronRightIcon from '@mui/icons-material/ChevronRight';

function ProductCard({ product, onClick }) {
  const isActive = product.status === "ACTIVE";

  return (
    <Card
      onClick={() => onClick(product.id)}
      sx={{
        borderRadius: "16px",
        cursor: "pointer",
        position: "relative",
        border: "1px solid #e0e4e7",
        boxShadow: "none",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 12px 24px rgba(0,0,0,0.08)",
          borderColor: "primary.light",
          "& .arrow-icon": { opacity: 1, transform: "translateX(0)" }
        }
      }}
    >
      <CardContent sx={{ p: 3 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={2}>
          <Chip
            label={product.status}
            size="small"
            sx={{
              fontWeight: 700,
              fontSize: "0.65rem",
              bgcolor: isActive ? "#e8f5e9" : "#fff3e0",
              color: isActive ? "#2e7d32" : "#ed6c02",
              border: `1px solid ${isActive ? "#a5d6a7" : "#ffcc80"}`,
            }}
          />
          <ChevronRightIcon 
            className="arrow-icon"
            sx={{ 
              fontSize: 20, 
              color: "primary.main", 
              opacity: 0, 
              transition: "0.3s",
              transform: "translateX(-10px)" 
            }} 
          />
        </Stack>

        <Typography variant="h6" sx={{ fontWeight: 700, color: "#2D3436", mb: 0.5 }}>
          {product.name}
        </Typography>

        <Typography variant="body2" sx={{ color: "text.secondary", mb: 2 }}>
          {product.category}
        </Typography>

        <Box sx={{ pt: 2, borderTop: "1px solid #f0f0f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="caption" sx={{ fontWeight: 600, color: "text.disabled", textTransform: "uppercase" }}>
            ID: {product.id.toString().slice(0, 8)}
          </Typography>
          <Typography variant="body2" sx={{ fontWeight: 700, color: "primary.main" }}>
            View Details
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
}

export default ProductCard;