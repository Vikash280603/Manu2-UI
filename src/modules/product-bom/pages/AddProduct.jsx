// Box: A container component for layout (like a div)
// Typography: Component for displaying text
// Paper: A white card-like component for better UI
// TextField: Input field for user to type
// Select, MenuItem: Dropdown menu components
// Button: Clickable button component
// InputLabel, FormControl: Label and form wrapper for dropdowns
// Grid: Grid layout system
import { Box, Typography, Paper, TextField, Select, MenuItem, Button, InputLabel, FormControl, Grid } from "@mui/material";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
// ============================================================
// MAIN COMPONENT: AddProduct
// FUNCTION SYNTAX: export default function AddProduct() { ... }
// REASON: This component creates a form to add new products
// ============================================================
export default function AddProduct() {
    // REASON: We'll use it to send user to the BOM page after saving
    const navigate = useNavigate();
    // REASON: We need to remember what the user types in the product name field
    const [productname, setproductname] = useState("");
    // REASON: We need to remember which category user selects from dropdown
    const [category, setcategory] = useState("");
    // REASON: We need to track the product status (ACTIVE by default)
    const [Status, setstatus] = useState("ACTIVE");

    //   - This function runs when user clicks the "Save" button
    // REASON: We need a function to handle what happens when user saves
    const handleclick = (e) => {
        e.preventDefault();
        // STEP 2: Validate user input
        if (!productname || !category) {
            alert("Please fill in the Product Name and Category");
            return;
        }

        // ========================================================
        // STEP 3: Get existing products from localStorage
        // SYNTAX: const existingData = JSON.parse(localStorage.getItem("products") || "[]");
        // LOGIC: 
        //   - localStorage.getItem("products") = get saved products from browser memory
        //   - || "[]" = if nothing saved yet, use empty array []
        //   - JSON.parse() = convert text into JavaScript array format
        // REASON: We need to add our new product to the existing list
        // ========================================================
        const existingData = JSON.parse(localStorage.getItem("products") || "[]");

        // ========================================================
        // STEP 4: Auto-generate a unique ID for the new prod
        // LOGIC:
        //   - If existingData.length > 0 = if we already have products
        //     - existingData.map(item => item.id) = get all product IDs
        //     - Math.max(...) = find the highest ID
        //     - + 1 = add 1 to make a new unique ID
        //   - : 1 = else (no products yet), start with ID 1
        // REASON: Each product needs a unique ID number to identify it
        // ========================================================
        const newId = existingData.length > 0 
            ? Math.max(...existingData.map(item => item.id)) + 1 
            : 1;

        // ========================================================
        // STEP 5: Create a new product object
        // SYNTAX: const newProduct = { id: newId, ... }
        // LOGIC: 
        //   - Create a JavaScript object with 4 properties:
        //   - id: the unique ID we just created
        //   - name: the product name user typed
        //   - category: the category user selected
        //   - status: the status (ACTIVE by default)
        // REASON: We need to organize all the product data in one object
        // ========================================================
        const newProduct = {
            id: newId,
            name: productname,
            category: category,
            status: Status
        };

        // ========================================================
        // STEP 6: Add new product to the existing list
        // SYNTAX: existingData.push(newProduct);
        // LOGIC: 
        //   - push() = add the newProduct to the end of the array
        //   - Now existingData has the old products + new product
        // REASON: We want to keep all products in our list
        // ========================================================
        existingData.push(newProduct);

        // ========================================================
        // STEP 7: Save the updated list back to localStorage
        // REASON: We want to permanently save the product list
        // ========================================================
        localStorage.setItem("products", JSON.stringify(existingData));

        // ========================================================
        // STEP 8: Navigate to BOM page
        // SYNTAX: navigate('/products/addbom', { state: { ... } });
        // LOGIC: 
        //   - '/products/addbom' = the page route to go to
        //   - { state: { ... } } = pass data to the next page
        //   - productId: newId = pass the new product's ID
        //   - productName: productname = pass the product name
        // REASON: User goes to next step (adding Bill of Materials)
        //         We send the product info so BOM page knows which product
        // ========================================================
        navigate('/products/addbom', { state: { productId: newId, productName: productname } });
    };

    return (
        // ========================================================
        // OUTER BOX: Main container
        // LOGIC: 
        //   - display="flex" = use flexbox layout
        //   - justifyContent="center" = center horizontally
        //   - alignItems="center" = center vertically
        //   - minHeight="100vh" = take full height of screen
        // REASON: Make form centered and pretty on the screen
        // ========================================================
        <Box
            display="flex"
            justifyContent="center"
            alignItems="center"
            minHeight="100vh"
            bgcolor="#f4f6f8"
        >
            {/* ====================================================
                PAPER: The white card/container
                SYNTAX: <Paper elevation={6} sx={{ ... }}>
                LOGIC: 
                  - elevation={6} = shadow effect (makes it look raised)
                  - padding={5} = space inside the box
                  - width={400} = width of the card
                  - borderRadius={3} = rounded corners
                REASON: Makes the form look like a nice white card
                ==================================================== */}
            <Paper elevation={6} sx={{ padding: 5, width: 400, borderRadius: 3 }}>
                
                {/* ====================================================
                    HEADER SECTION: Title and icon
                    SYNTAX: <Box display="flex" flexDirection="column" ...>
                    LOGIC: 
                      - flexDirection="column" = stack items vertically
                      - alignItems="center" = center items horizontally
                      - mb={3} = margin bottom (space below)
                    REASON: Create a nice header section
                    ==================================================== */}
                <Box display="flex" flexDirection="column" alignItems="center" mb={3}>
                    {/* Icon for the form */}
                    <AddCircleOutlineIcon sx={{ fontSize: 40, color: "#1976d2", mb: 1 }} />
                    
                    {/* Main title */}
                    <Typography variant="h5" fontWeight="bold" color="#333">
                        New Product     
                    </Typography>
                    
                    {/* Subtitle: Instructions for user */}
                    <Typography variant="body2" color="textSecondary">
                        Step 1: Define Product Details
                    </Typography>
                </Box>

                {/* ====================================================
                    INPUT FIELD 1: Product Name
                    SYNTAX: <TextField label="..." value={...} onChange={...} />
                    LOGIC: 
                      - label="Product Name" = placeholder/label text
                      - fullWidth = take full width of container
                      - variant="outlined" = style type
                      - value={productname} = show current state value
                      - onChange={(e) => setproductname(e.target.value)}
                        * onChange = runs when user types
                        * e.target.value = what user typed
                        * setproductname() = update the state with new value
                    REASON: Let user enter the product name
                    ==================================================== */}
                <TextField
                    fullWidth
                    label="Product Name"
                    variant="outlined"
                    margin="normal"
                    value={productname}
                    onChange={(e) => setproductname(e.target.value)}
                />

                {/* ====================================================
                    INPUT FIELD 2: Category (Dropdown)
                    SYNTAX: <FormControl> ... <Select> ... </Select> </FormControl>
                    LOGIC: 
                      - FormControl = wrapper for form elements
                      - InputLabel = label above the dropdown
                      - Select = the actual dropdown
                        * value={category} = show selected value
                        * onChange={(e) => setcategory(e.target.value)}
                          - Update state when selection changes
                      - MenuItem = each option in the dropdown
                    REASON: Let user choose a category from predefined list
                    ==================================================== */}
                <FormControl fullWidth margin="normal">
                    <InputLabel>Category</InputLabel>
                    <Select
                        label="Category"
                        value={category}
                        onChange={(e) => setcategory(e.target.value)}
                    >
                        {/* Each option in the dropdown */}
                        <MenuItem value="Mechanical">Mechanical</MenuItem>
                        <MenuItem value="Electrical">Electrical</MenuItem>
                        <MenuItem value="Packaging">Packaging</MenuItem>
                        <MenuItem value="Construction">Construction</MenuItem>
                        <MenuItem value="Tools">Tools</MenuItem>
                    </Select>
                </FormControl>

                {/* ====================================================
                    INPUT FIELD 3: Status (Read-only)
                    SYNTAX: <TextField ... disabled ... />
                    LOGIC: 
                      - disabled = user cannot edit this field
                      - value={Status} = shows "ACTIVE"
                      - backgroundColor="#f0f0f0" = gray background to show it's disabled
                    REASON: Show the status but don't let user change it (always ACTIVE)
                    ==================================================== */}
                <TextField
                    label="Status"
                    fullWidth
                    value={Status}
                    variant="outlined"
                    margin="normal"
                    disabled
                    sx={{ backgroundColor: "#f0f0f0" }}
                />

                {/* ====================================================
                    BUTTON: Save and continue
                    SYNTAX: <Button onClick={handleclick} ... >
                    LOGIC: 
                      - fullWidth = take full width
                      - variant="contained" = filled button style
                      - onClick={handleclick} = run handleclick when clicked
                      - sx={{ ... }} = custom styling
                        * marginTop: 3 = space above button
                        * backgroundColor: "#1976d2" = blue color
                        * '&:hover': change color when mouse over
                    REASON: Give user a button to save and move to next step
                    ==================================================== */}
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