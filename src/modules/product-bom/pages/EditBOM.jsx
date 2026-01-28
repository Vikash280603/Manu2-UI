// React core imports
// useState  -> to store and update component state
// useEffect -> to run code automatically when component loads or updates
import React, { useEffect, useState } from 'react';

// React Router hooks
// useParams  -> to read URL parameters (productId from route)
// useNavigate -> to programmatically navigate between pages
import { useParams, useNavigate } from 'react-router-dom';

// MUI (Material UI) components used to build the UI
import { 
  Typography,      // Text display (headings, labels, body text)
  TextField,       // Input field
  Button,          // Button component
  Box,             // Generic layout container (div replacement)
  Stack,           // Flexbox layout helper (row/column spacing)
  Grid,            // Responsive grid layout system
  IconButton,      // Button for icons
  Container,       // Centers content with max-width
  Paper,           // Card-like surface
  InputAdornment,  // Icons/text inside input fields
  Divider,         // Horizontal separator line
  Tooltip,         // Hover tooltip text
  Fade             // Simple fade-in animation
} from '@mui/material';

// MUI Icons (visual indicators only)
import CloseIcon from '@mui/icons-material/Close';
import ArrowBackIosNewRoundedIcon from '@mui/icons-material/ArrowBackIosNewRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import AddCircleOutlineRoundedIcon from '@mui/icons-material/AddCircleOutlineRounded';
import SaveRoundedIcon from '@mui/icons-material/SaveRounded';
import DesignServicesOutlinedIcon from '@mui/icons-material/DesignServicesOutlined';
import NumbersRoundedIcon from '@mui/icons-material/NumbersRounded';
import LayersOutlinedIcon from '@mui/icons-material/LayersOutlined';

/*
  =============================================================================
  EditBOM COMPONENT
  -----------------------------------------------------------------------------
  Purpose:
  - Edit Bill of Materials (BOM) for a specific product
  - Product ID comes from URL
  - BOM data is stored in localStorage
  - User can add, edit, delete materials
  =============================================================================
*/
const EditBOM = () => {

  // ---------------------------------------------------------------------------
  // ROUTER & STATE SETUP
  // ---------------------------------------------------------------------------

  /*
    useParams()
    ----------
    Reads the dynamic URL value.
    Example route: /products/5/edit-bom
    productId will be "5"
  */
  const { id: productId } = useParams();

  /*
    useNavigate()
    ------------
    Used to move backward or forward in browser history.
    Example: navigate(-1) -> go back one page
  */
  const navigate = useNavigate();

  /*
    productBoms
    -----------
    Array holding all BOM rows for this product.
    Each item contains:
      - BOMID
      - id (product id)
      - materialName
      - quantity
  */
  const [productBoms, setProductBoms] = useState([]);

  // ---------------------------------------------------------------------------
  // LOAD BOM DATA WHEN COMPONENT MOUNTS
  // ---------------------------------------------------------------------------
  useEffect(() => {
    /*
      Convert productId from string to number
      because localStorage data is numeric
    */
    const pid = Number(productId);

    /*
      Read all BOMs from localStorage
      If nothing exists, fallback to empty array
    */
    const storedBoms = JSON.parse(localStorage.getItem('boms')) || [];
    
    /*
      Filter only BOMs that belong to this product
      NOTE: Here "id" represents product ID
    */
    const filtered = storedBoms.filter((bom) => Number(bom.id) === pid);

    // Store filtered BOMs into component state
    setProductBoms(filtered);
  }, [productId]);

  // ---------------------------------------------------------------------------
  // HANDLE INPUT CHANGES (Material Name / Quantity)
  // ---------------------------------------------------------------------------
  /*
    This function updates a single BOM row.
    - index tells which row is being edited
    - name tells which field (materialName / quantity)
  */
  const handleBomChange = (e, index) => {
    const { name, value } = e.target;

    setProductBoms((prev) => {
      const updated = [...prev];          // Copy array (immutability)
      updated[index] = {                  // Update only one row
        ...updated[index],
        [name]: value
      };
      return updated;
    });
  };

  // ---------------------------------------------------------------------------
  // SAVE UPDATED BOM DATA
  // ---------------------------------------------------------------------------
  const saveBomDetails = () => {
    const pid = Number(productId);

    // Load all existing BOMs
    const allStoredBoms = JSON.parse(localStorage.getItem('boms')) || [];

    /*
      Remove old BOM entries related to this product
      (to avoid duplicates)
    */
    const otherProductsBoms = allStoredBoms.filter(
      (bom) => Number(bom.id) !== pid
    );

    /*
      Merge:
      - BOMs of other products
      - Updated BOMs of current product
    */
    const finalBoms = [...otherProductsBoms, ...productBoms];

    // Save back to localStorage
    localStorage.setItem('boms', JSON.stringify(finalBoms));
    
    // Go back to previous screen
    navigate(-1);
  };

  // ---------------------------------------------------------------------------
  // ADD A NEW EMPTY BOM ROW
  // ---------------------------------------------------------------------------
  const addBomRow = () => {
    setProductBoms((prev) => [
      ...prev,
      { 
        BOMID: Date.now(),      // Unique row identifier
        id: Number(productId), // Link BOM to product
        materialName: '',      // Empty material name
        quantity: 0            // Default quantity
      },
    ]);
  };

  // ---------------------------------------------------------------------------
  // DELETE A BOM ROW BY INDEX
  // ---------------------------------------------------------------------------
  const deleteBomRow = (index) => {
    setProductBoms((prev) => prev.filter((_, i) => i !== index));
  };

  // ---------------------------------------------------------------------------
  // UI SECTION
  // ---------------------------------------------------------------------------
  return (
    /*
      Box
      ---
      Acts like a <div> with powerful styling support via sx prop
    */
    <Box sx={{ 
      minHeight: '100vh',
      bgcolor: '#f4f6f8',
      background: 'radial-gradient(circle at 10% 20%, rgb(248, 250, 252) 0%, rgb(241, 245, 249) 90%)',
      py: 6
    }}>
      <Container maxWidth="md">

        {/* ================= HEADER ================= */}
        <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 4 }}>
          {/* Back button */}
          <IconButton onClick={() => navigate(-1)}>
            <ArrowBackIosNewRoundedIcon fontSize="small" />
          </IconButton>

          {/* Page title */}
          <Box>
            <Typography variant="h4" fontWeight={800}>
              Bill of Materials
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Configuration for Product ID #{productId}
            </Typography>
          </Box>
        </Stack>

        {/* ================= MAIN CARD ================= */}
        <Paper sx={{ p: 5, borderRadius: '24px' }}>
          
          {/* BOM LIST */}
          <Stack spacing={2.5}>
            {productBoms.length > 0 ? (
              productBoms.map((bom, index) => (
                <Fade in={true} key={bom.BOMID || index}>
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
                          <IconButton onClick={() => deleteBomRow(index)}>
                            <DeleteOutlineRoundedIcon />
                          </IconButton>
                        </Tooltip>
                      </Grid>

                    </Grid>
                  </Paper>
                </Fade>
              ))
            ) : (
              /* Empty State */
              <Typography align="center" color="text.secondary">
                No materials added yet.
              </Typography>
            )}

            {/* Add New Row */}
            <Button
              variant="outlined"
              onClick={addBomRow}
              startIcon={<AddCircleOutlineRoundedIcon />}
            >
              Add New Material
            </Button>
          </Stack>

          <Divider sx={{ my: 4 }} />

          {/* ACTION BUTTONS */}
          <Stack direction="row" justifyContent="flex-end" spacing={2}>
            <Button onClick={() => navigate(-1)}>Cancel</Button>
            <Button
              variant="contained"
              onClick={saveBomDetails}
              startIcon={<SaveRoundedIcon />}
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
