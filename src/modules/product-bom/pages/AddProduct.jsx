<<<<<<< HEAD
import { Label } from "@mui/icons-material";
import {Box, Typography, Paper, TextField, Select, MenuItem, Button, InputLabel, FormControl} from "@mui/material"
import { useState } from "react";
export default function AddProduct(){
    
    const [productid,setproductid]=useState("")
    const [productname,setproductname]=useState("")
    const [category,setcategory]=useState("")
    const [Status,setstatus]=useState("Active")
    const [message,setmessage]=useState("")

     const handleclick=(e)=>{
        e.preventDefault();
        setmessage("Product Added Successfully");
     }
    return(
        
        
            <Box    
             display="flex"
             justifyContent="center"
             alignItems="center"
             height="100vh"
             bgcolor="#ffffffff"
            >
            
            <Paper elevation={5} sx={{ padding: 4, width: 300 }}>

            <Typography
             align="center"
             color="#3174e8ff"
             variant="h5"
             >Add Product
            </Typography>

            <TextField
             fullWidth
             label="Product ID*"
             variant="outlined"
             margin="normal"
            />

            <TextField
             fullWidth
             label="Product Name*"
             variant="outlined"
             margin="normal"
            />
            
            <FormControl fullWidth margin="normal">
                <InputLabel>Category</InputLabel>
                <Select label="Category">
                    <MenuItem value="personal">Personal Uses</MenuItem>
                    <MenuItem value="industry">Industry Uses</MenuItem>
                    <MenuItem value="commercial">Commerical Uses</MenuItem>
                </Select>
            </FormControl>

            <TextField
             label="Status"
             fullWidth
             value="Active"
             variant="outlined"
             margin="normal"
             disabled
             />

            <Button
             fullWidth
             variant="contained"
             onClick={handleclick}
             sx={{ marginTop: 2}}  
            >
            Add
            </Button>
          </Paper>  
        </Box>
    );
}
=======
export default function AddProduct(){
    return(
        <h1>Add Product</h1>
    )
}
>>>>>>> 0967f204ab52ed89ef591304509d8abaab35130a
