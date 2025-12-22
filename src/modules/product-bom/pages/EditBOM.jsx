import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Typography, TextField, Button, Box, Stack, Grid, IconButton, 
  Container, Paper, InputAdornment, Divider, Tooltip, Fade 
} from '@mui/material';

// Icons
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import DesignServicesOutlinedIcon from '@mui/icons-material/DesignServicesOutlined';
import NumbersRoundedIcon from '@mui/icons-material/NumbersRounded';
import LayersOutlinedIcon from '@mui/icons-material/LayersOutlined';

const EditBOM = () => {
  // -------------------------------------------------------------------------
  //  LOGIC SECTION (STRICTLY PRESERVED)
  // -------------------------------------------------------------------------
  const { id: productId } = useParams();
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

  // -------------------------------------------------------------------------
  //  UI SECTION (BEAST MODE)
  // -------------------------------------------------------------------------
  return (
    <Box sx={{ 
      minHeight: '100vh', 
      bgcolor: '#f4f6f8',
      background: 'radial-gradient(circle at 10% 20%, rgb(248, 250, 252) 0%, rgb(241, 245, 249) 90%)',
      py: 6
    }}>
      <Container maxWidth="md">
        
        {/* HEADER AREA */}
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 4 }}>
          <IconButton 
            onClick={() => navigate(-1)} 
            sx={{ 
              bgcolor: 'white', 
              boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
              '&:hover': { bgcolor: '#f1f5f9', transform: 'translateX(-2px)' },
              transition: 'all 0.2s'
            }}
          >
            <ArrowBackIosNewRoundedIcon fontSize="small" />
          </IconButton>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#1e293b', letterSpacing: '-1px' }}>
              Bill of Materials
            </Typography>
            <Typography variant="body2" sx={{ color: 'text.secondary', fontWeight: 500 }}>
              Configuration for Product ID <Box component="span" sx={{ fontFamily: 'monospace', bgcolor: '#e2e8f0', px: 1, borderRadius: 1 }}>#{productId}</Box>
            </Typography>
          </Box>
        </Stack>

        <Paper 
          elevation={0}
          sx={{ 
            p: { xs: 3, md: 5 }, 
            borderRadius: '24px', 
            bgcolor: 'white',
            boxShadow: '0 20px 40px -10px rgba(0,0,0,0.05)',
            border: '1px solid #f1f5f9'
          }}
        >
          {/* TITLE INSIDE CARD */}
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
            <Stack direction="row" alignItems="center" spacing={1.5}>
              <LayersOutlinedIcon color="primary" sx={{ fontSize: 28 }} />
              <Typography variant="h6" sx={{ fontWeight: 700 }}>
                Material List
              </Typography>
            </Stack>
            <Typography variant="caption" sx={{ fontWeight: 600, color: 'text.disabled' }}>
              {productBoms.length} ITEMS
            </Typography>
          </Stack>

          <Stack spacing={2.5}>
            {productBoms.length > 0 ? (
              productBoms.map((bom, index) => (
                <Fade in={true} timeout={300 + (index * 100)} key={bom.BOMID || index}>
                  <Paper 
                    variant="outlined" 
                    sx={{ 
                      p: 2.5, 
                      borderRadius: '16px',
                      border: '1px solid #e2e8f0',
                      bgcolor: '#fff',
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': { 
                        borderColor: 'primary.main',
                        boxShadow: '0 10px 30px -10px rgba(0, 0, 0, 0.08)',
                        transform: 'translateY(-2px)'
                      }
                    }}
                  >
                    <Grid container spacing={3} alignItems="center">
                      <Grid item xs={12} sm={6}>
                        <TextField
                          label="Material Name"
                          name="materialName"
                          value={bom.materialName}
                          onChange={(e) => handleBomChange(e, index)}
                          fullWidth
                          variant="outlined"
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <DesignServicesOutlinedIcon fontSize="small" color="action" />
                              </InputAdornment>
                            ),
                            sx: { borderRadius: '10px' }
                          }}
                        />
                      </Grid>
                      <Grid item xs={8} sm={4}>
                        <TextField
                          label="Quantity"
                          name="quantity"
                          value={bom.quantity}
                          onChange={(e) => handleBomChange(e, index)}
                          type="number"
                          fullWidth
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <NumbersRoundedIcon fontSize="small" color="action" />
                              </InputAdornment>
                            ),
                            sx: { borderRadius: '10px' }
                          }}
                        />
                      </Grid>
                      <Grid item xs={4} sm={2} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                        <Tooltip title="Remove Item">
                          <IconButton 
                            onClick={() => deleteBomRow(index)}
                            sx={{ 
                              color: 'error.main', 
                              bgcolor: '#fff0f0',
                              '&:hover': { bgcolor: '#ffe0e0' } 
                            }}
                          >
                            <DeleteOutlineRoundedIcon />
                          </IconButton>
                        </Tooltip>
                      </Grid>
                    </Grid>
                  </Paper>
                </Fade>
              ))
            ) : (
              <Box 
                sx={{ 
                  textAlign: 'center', 
                  py: 8, 
                  bgcolor: '#f8fafc', 
                  borderRadius: '16px', 
                  border: '2px dashed #e2e8f0' 
                }}
              >
                <LayersOutlinedIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2, opacity: 0.5 }} />
                <Typography variant="body1" color="text.secondary" fontWeight={500}>
                  No materials added yet.
                </Typography>
                <Typography variant="caption" color="text.disabled">
                  Start by adding your first raw material below.
                </Typography>
              </Box>
            )}
            
            {/* ADD BUTTON AREA */}
            <Button 
              fullWidth
              variant="outlined" 
              onClick={addBomRow}
              startIcon={<AddCircleOutlineRoundedIcon />}
              sx={{ 
                py: 2,
                borderStyle: 'dashed',
                borderWidth: '2px',
                borderRadius: '12px',
                fontWeight: 600,
                color: 'text.secondary',
                '&:hover': { 
                  borderStyle: 'dashed', 
                  borderWidth: '2px',
                  bgcolor: '#f0f9ff',
                  borderColor: 'primary.main',
                  color: 'primary.main'
                }
              }}
            >
              Add New Material
            </Button>
          </Stack>

          <Divider sx={{ my: 4, borderColor: '#f1f5f9' }} />

          <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} justifyContent="flex-end">
            <Button 
              variant="text" 
              onClick={() => navigate(-1)} 
              sx={{ color: 'text.secondary', fontWeight: 600 }}
            >
              Cancel
            </Button>
            <Button 
              variant="contained" 
              onClick={saveBomDetails} 
              startIcon={<SaveRoundedIcon />}
              sx={{ 
                px: 5, 
                py: 1.5,
                borderRadius: '12px',
                fontWeight: 700,
                boxShadow: '0 10px 20px -5px rgba(37, 99, 235, 0.4)',
                background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)',
                '&:hover': {
                  boxShadow: '0 15px 25px -5px rgba(37, 99, 235, 0.5)',
                }
              }}
            >
              Save Configuration
            </Button>
          </Stack>
        </Paper>
      </Container>
    </Box>
  );
};

export default EditBOM;