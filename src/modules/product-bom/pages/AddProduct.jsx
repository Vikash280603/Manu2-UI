import { Box, Typography, Paper, TextField, Select, MenuItem, Button, InputLabel, FormControl, Grid } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Import Hook
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'; // Optional: npm install @mui/icons-material

export default function AddProduct() {
    const navigate = useNavigate(); // Initialize hook
    const [productname, setproductname] = useState("");
    const [category, setcategory] = useState("");
    const [Status, setstatus] = useState("ACTIVE");

    const handleclick = (e) => {
        e.preventDefault();

        if (!productname || !category) {
            alert("Please fill in the Product Name and Category");
            return;
        }

        // --- STEP A: GET EXISTING DATA ---
        const existingData = JSON.parse(localStorage.getItem("products") || "[]");

        // --- STEP B: AUTO-GENERATE ID ---
        const newId = existingData.length > 0 
            ? Math.max(...existingData.map(item => item.id)) + 1 
            : 1;

        // --- STEP C: CREATE NEW OBJECT ---
        const newProduct = {
            id: newId,
            name: productname,
            category: category,
            status: Status
        };

        // --- STEP D: SAVE BACK TO LOCAL STORAGE ---
        existingData.push(newProduct);
        localStorage.setItem("products", JSON.stringify(existingData));

        // --- STEP E: NAVIGATE TO EDIT BOM ---
        // We pass the newId and productname as "state" to the next route
        navigate('/products/addbom', { state: { productId: newId, productName: productname } });
    };

    return (
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="100vh"
            bgcolor="#f4f6f8" // Softer background
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

                <TextField
                    fullWidth
                    label="Product Name"
                    variant="outlined"
                    margin="normal"
                    value={productname}
                    onChange={(e) => setproductname(e.target.value)}
                />

                <FormControl fullWidth margin="normal">
                    <InputLabel>Category</InputLabel>
                    <Select
                        label="Category"
                        value={category}
                        onChange={(e) => setcategory(e.target.value)}
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
                    sx={{ 
                        marginTop: 3, 
                        fontWeight: "bold",
                        backgroundColor: "#1976d2",
                        '&:hover': { backgroundColor: "#115293" }
                    }}
                >
                    Save & Add Materials (BOM)
                </Button>
            </Paper>
        </Box>
    );
}   