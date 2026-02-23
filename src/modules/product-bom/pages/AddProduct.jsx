// UPDATED AddProduct.jsx - Creates product via API  
  
import { Box, Typography, Paper, TextField, Select, MenuItem, Button, InputLabel, FormControl, CircularProgress, Alert } from "@mui/material";  
import { useState } from "react";  
import { useNavigate } from "react-router-dom";  
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';  
  
// ✅ CHANGE: Import API function  
import { createProduct } from "../../product-bom/api/productApi";  
  
export default function AddProduct() {  
    const navigate = useNavigate();  
    const [productname, setproductname] = useState("");  
    const [category, setcategory] = useState("");  
    const [Status, setstatus] = useState("ACTIVE");  
  
    // ✅ NEW: Loading and error states  
    const [loading, setLoading] = useState(false);  
    const [error, setError] = useState("");  
  
    // ✅ CHANGE: Create product via API instead of localStorage  
    const handleclick = async (e) => {  
        e.preventDefault();  
          
        if (!productname || !category) {  
            setError("Please fill in the Product Name and Category");  
            return;  
        }  
  
        try {  
            setLoading(true);  
            setError("");  
  
            // Call backend API  
            const newProduct = await createProduct({  
                name: productname,  
                category: category,  
                status: Status  
            });  
  
            // Navigate to BOM page with product ID  
            navigate('/products/addbom', {   
                state: {   
                    productId: newProduct.id,   
                    productName: newProduct.name   
                }   
            });  
        } catch (err) {  
            setError(err.message);  
        } finally {  
            setLoading(false);  
        }  
    };  
  
    return (  
        <Box  
            display="flex"  
            justifyContent="center"  
            alignItems="center"  
            minHeight="100vh"  
            bgcolor="#f4f6f8"  
        >  
            <Paper elevation={6} sx={{ padding: 5, width: 400, borderRadius: 3 }}>  
                  
                <Box display="flex" flexDirection="column" alignItems="center" mb={3}>  
                    <AddCircleOutlineIcon sx={{ fontSize: 40, color: "#1976d2", mb: 1 }} />  
                    <Typography variant="h5" fontWeight="bold" color="#333">  
                        New Product       
                    </Typography>  
                    <Typography variant="body2" color="textSecondary">  
                        Step 1: Define Product Details  
                    </Typography>  
                </Box>  
  
                {/* ✅ NEW: Error message */}  
                {error && (  
                    <Alert severity="error" sx={{ mb: 2 }}>  
                        {error}  
                    </Alert>  
                )}  
  
                <TextField  
                    fullWidth  
                    label="Product Name"  
                    variant="outlined"  
                    margin="normal"  
                    value={productname}  
                    onChange={(e) => setproductname(e.target.value)}  
                    disabled={loading}  
                />  
  
                <FormControl fullWidth margin="normal">  
                    <InputLabel>Category</InputLabel>  
                    <Select  
                        label="Category"  
                        value={category}  
                        onChange={(e) => setcategory(e.target.value)}  
                        disabled={loading}  
                    >  
                        <MenuItem value="Mechanical">Mechanical</MenuItem>  
                        <MenuItem value="Electrical">Electrical</MenuItem>  
                        <MenuItem value="Packaging">Packaging</MenuItem>  
                        <MenuItem value="Construction">Construction</MenuItem>  
                        <MenuItem value="Tools">Tools</MenuItem>  
                    </Select>  
                </FormControl>  
  
                <TextField  
                    label="Status"  
                    fullWidth  
                    value={Status}  
                    variant="outlined"  
                    margin="normal"  
                    disabled  
                    sx={{ backgroundColor: "#f0f0f0" }}  
                />  
  
                <Button  
                    fullWidth  
                    variant="contained"  
                    size="large"  
                    onClick={handleclick}  
                    disabled={loading}  
                    sx={{   
                        marginTop: 3,   
                        fontWeight: "bold",  
                        backgroundColor: "#1976d2",  
                        '&:hover': { backgroundColor: "#115293" }  
                    }}  
                >  
                    {loading ? <CircularProgress size={24} color="inherit" /> : "Save & Add Materials (BOM)"}  
                </Button>  
            </Paper>  
        </Box>  
    );  
}