// UPDATED EditBom.jsx - Uses API to load and save BOMs  
  
import React, { useEffect, useState } from 'react';  
import { useParams, useNavigate } from 'react-router-dom';  
import {   
  Typography, TextField, Button, Box, Stack, Grid,  
  IconButton, Container, Paper, InputAdornment,  
  Divider, Tooltip, Fade, CircularProgress, Alert  
} from '@mui/material';  
  
import CloseIcon from '@mui/icons-material/Close';  
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';  
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';  
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';  
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';  
import DesignServicesOutlinedIcon from '@mui/icons-material/DesignServicesOutlined';  
import NumbersRoundedIcon from '@mui/icons-material/NumbersRounded';  
  
// ✅ CHANGE: Import API functions  
import { getBOMsByProductId, replaceBOMs } from '../../product-bom/api/productApi';  
  
const EditBOM = () => {  
  const { id: productId } = useParams();  
  const navigate = useNavigate();  
  
  const [productBoms, setProductBoms] = useState([]);  
  
  // ✅ NEW: Loading and error states  
  const [loading, setLoading] = useState(true);  
  const [saving, setSaving] = useState(false);  
  const [error, setError] = useState("");  
  
  // ✅ CHANGE: Load BOMs from API  
  useEffect(() => {  
    const loadBOMs = async () => {  
      try {  
        setLoading(true);  
        setError("");  
  
        const boms = await getBOMsByProductId(productId);  
        setProductBoms(boms);  
      } catch (err) {  
        setError(err.message);  
        console.error("Failed to load BOMs:", err);  
      } finally {  
        setLoading(false);  
      }  
    };  
  
    loadBOMs();  
  }, [productId]);  
  
  const handleBomChange = (e, index) => {  
    const { name, value } = e.target;  
  
    setProductBoms((prev) => {  
      const updated = [...prev];  
      updated[index] = {  
        ...updated[index],  
        [name]: value  
      };  
      return updated;  
    });  
  };  
  
  // ✅ CHANGE: Save BOMs via API (replace all)  
  const saveBomDetails = async () => {  
    try {  
      setSaving(true);  
      setError("");  
  
      // Convert to CreateBOMDto format  
      const bomsToSave = productBoms.map(bom => ({  
        materialName: bom.materialName,  
        quantity: parseInt(bom.quantity)  
      }));  
  
      // Replace all BOMs via API  
      await replaceBOMs(productId, bomsToSave);  
  
      navigate(-1);  
    } catch (err) {  
      setError(err.message);  
    } finally {  
      setSaving(false);  
    }  
  };  
  
  const addBomRow = () => {  
    setProductBoms((prev) => [  
      ...prev,  
      {   
        bomid: Date.now(),  
        productId: Number(productId),  
        materialName: '',  
        quantity: 0  
      },  
    ]);  
  };  
  
  const deleteBomRow = (index) => {  
    setProductBoms((prev) => prev.filter((_, i) => i !== index));  
  };  
  
  return (  
    <Box sx={{   
      minHeight: '100vh',  
      bgcolor: '#f4f6f8',  
      background: 'radial-gradient(circle at 10% 20%, rgb(248, 250, 252) 0%, rgb(241, 245, 249) 90%)',  
      py: 6  
    }}>  
      <Container maxWidth="md">  
  
        {/* HEADER */}  
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 4 }}>  
          <IconButton onClick={() => navigate(-1)}>  
            <ArrowBackIosNewRoundedIcon fontSize="small" />  
          </IconButton>  
  
          <Box>  
            <Typography variant="h4" fontWeight={800}>  
              Bill of Materials  
            </Typography>  
            <Typography variant="body2" color="text.secondary">  
              Configuration for Product ID #{productId}  
            </Typography>  
          </Box>  
        </Stack>  
  
        {/* MAIN CARD */}  
        <Paper sx={{ p: 5, borderRadius: '24px' }}>  
            
          {/* ✅ NEW: Error message */}  
          {error && (  
            <Alert severity="error" sx={{ mb: 3 }}>  
              {error}  
            </Alert>  
          )}  
  
          {/* ✅ NEW: Loading state */}  
          {loading ? (  
            <Box sx={{ textAlign: 'center', py: 4 }}>  
              <CircularProgress />  
              <Typography sx={{ mt: 2 }}>Loading BOMs...</Typography>  
            </Box>  
          ) : (  
            <>  
              {/* BOM LIST */}  
              <Stack spacing={2.5}>  
                {productBoms.length > 0 ? (  
                  productBoms.map((bom, index) => (  
                    <Fade in={true} key={bom.bomid || index}>  
                      <Paper sx={{ p: 2.5 }}>  
                        <Grid container spacing={3} alignItems="center">  
  
                          {/* Material Name */}  
                          <Grid item xs={12} sm={6}>  
                            <TextField  
                              label="Material Name"  
                              name="materialName"  
                              value={bom.materialName}  
                              onChange={(e) => handleBomChange(e, index)}  
                              fullWidth  
                              disabled={saving}  
                              InputProps={{  
                                startAdornment: (  
                                  <InputAdornment position="start">  
                                    <DesignServicesOutlinedIcon />  
                                  </InputAdornment>  
                                ),  
                              }}  
                            />  
                          </Grid>  
  
                          {/* Quantity */}  
                          <Grid item xs={8} sm={4}>  
                            <TextField  
                              label="Quantity"  
                              name="quantity"  
                              type="number"  
                              value={bom.quantity}  
                              onChange={(e) => handleBomChange(e, index)}  
                              fullWidth  
                              disabled={saving}  
                              InputProps={{  
                                startAdornment: (  
                                  <InputAdornment position="start">  
                                    <NumbersRoundedIcon />  
                                  </InputAdornment>  
                                ),  
                              }}  
                            />  
                          </Grid>  
  
                          {/* Delete Button */}  
                          <Grid item xs={4} sm={2}>  
                            <Tooltip title="Remove Item">  
                              <IconButton onClick={() => deleteBomRow(index)} disabled={saving}>  
                                <DeleteOutlineRoundedIcon />  
                              </IconButton>  
                            </Tooltip>  
                          </Grid>  
  
                        </Grid>  
                      </Paper>  
                    </Fade>  
                  ))  
                ) : (  
                  <Typography align="center" color="text.secondary">  
                    No materials added yet.  
                  </Typography>  
                )}  
  
                {/* Add New Row */}  
                <Button  
                  variant="outlined"  
                  onClick={addBomRow}  
                  disabled={saving}  
                  startIcon={<AddCircleOutlineRoundedIcon />}  
                >  
                  Add New Material  
                </Button>  
              </Stack>  
  
              <Divider sx={{ my: 4 }} />  
  
              {/* ACTION BUTTONS */}  
              <Stack direction="row" justifyContent="flex-end" spacing={2}>  
                <Button onClick={() => navigate(-1)} disabled={saving}>Cancel</Button>  
                <Button  
                  variant="contained"  
                  onClick={saveBomDetails}  
                  disabled={saving}  
                  startIcon={saving ? <CircularProgress size={20} /> : <SaveRoundedIcon />}  
                >  
                  {saving ? "Saving..." : "Save Configuration"}  
                </Button>  
              </Stack>  
            </>  
          )}  
        </Paper>  
      </Container>  
    </Box>  
  );  
};  
  
export default EditBOM;