import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Typography, TextField, Button, Box, Stack, Grid, IconButton, Container, Paper } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const EditBOM = () => {
  const { id:productId } = useParams();
  const navigate = useNavigate();
  const [productBoms, setProductBoms] = useState([]);

  // 1. Load data from LocalStorage on mount
  useEffect(() => {
    const pid = Number(productId);
    const storedBoms = JSON.parse(localStorage.getItem('boms')) || [];
    
    // Simple filter: match our JSON structure where 'id' is the link
    const filtered = storedBoms.filter((bom) => Number(bom.id) === pid);
    setProductBoms(filtered);
  }, [productId]);

  // 2. Handle input changes for materialName and quantity
  const handleBomChange = (e, index) => {
    const { name, value } = e.target;
    setProductBoms((prev) => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [name]: value };
      return updated;
    });
  };

  // 3. Save Logic
  const saveBomDetails = () => {
    const pid = Number(productId);
    const allStoredBoms = JSON.parse(localStorage.getItem('boms')) || [];

    // Remove old entries for this product
    const otherProductsBoms = allStoredBoms.filter((bom) => Number(bom.id) !== pid);

    // Merge with new/edited entries
    const finalBoms = [...otherProductsBoms, ...productBoms];

    localStorage.setItem('boms', JSON.stringify(finalBoms));
    
    // Navigate back to the product list/modal
    navigate(-1);
  };

  const addBomRow = () => {
    setProductBoms((prev) => [
      ...prev,
      { 
        BOMID: Date.now(), // Unique ID for the row
        id: Number(productId), // Link to the product
        materialName: '', 
        quantity: 0 
      },
    ]);
  };

  const deleteBomRow = (index) => {
    setProductBoms((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper sx={{ p: 4, borderRadius: '15px' }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={4}>
          <Typography variant="h4" sx={{ fontWeight: 800 }}>
            Edit BOM (Product #{productId})
          </Typography>
          <IconButton onClick={() => navigate(-1)}><CloseIcon /></IconButton>
        </Stack>

        <Stack spacing={2}>
          {productBoms.map((bom, index) => (
            <Grid container key={bom.BOMID || index} spacing={2} alignItems="center">
              <Grid item xs={6}>
                <TextField
                  label="Material Name"
                  name="materialName"
                  value={bom.materialName}
                  onChange={(e) => handleBomChange(e, index)}
                  fullWidth
                />
              </Grid>
              <Grid item xs={4}>
                <TextField
                  label="Quantity"
                  name="quantity"
                  value={bom.quantity}
                  onChange={(e) => handleBomChange(e, index)}
                  type="number"
                  fullWidth
                />
              </Grid>
              <Grid item xs={2}>
                <Button variant="text" color="error" onClick={() => deleteBomRow(index)}>
                  Delete
                </Button>
              </Grid>
            </Grid>
          ))}
          
          {productBoms.length === 0 && (
            <Typography variant="body1" color="text.secondary" textAlign="center" py={3}>
              No items in this Bill of Materials.
            </Typography>
          )}
        </Stack>

        <Stack direction="row" spacing={2} justifyContent="flex-end" sx={{ mt: 4 }}>
          <Button variant="outlined" onClick={addBomRow}>Add Item</Button>
          <Button variant="contained" onClick={saveBomDetails} sx={{ px: 4, fontWeight: 700 }}>
            Save BOM Changes
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
};

export default EditBOM;