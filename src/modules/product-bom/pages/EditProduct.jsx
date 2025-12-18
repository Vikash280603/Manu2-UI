import Box from '@mui/material/Box';
import {TextField,FormControl,InputLabel,Select,MenuItem} from '@mui/material';
import { products } from '../entities/product';
import { useParams } from 'react-router-dom';
import { boms } from '../entities/bom';


export default function EditProduct(){
    const {id}=useParams();
    console.log(id);
    const product = products.find(p => p.id === Number(id));
    const productBom = boms.filter(item => item.id === Number(id));
    console.log(productBom);
    return(
       <Box
      component="form"
      sx={{ '& > :not(style)': { m: 1, width: '25ch' } }}
      noValidate
      autoComplete="off"
    >
      <TextField id="outlined-basic" label="Product Name" variant="outlined" defaultValue={product.name} />
      <TextField id="outlined-basic" label="Category" variant="outlined" defaultValue={product.category} />
         <FormControl fullWidth margin="normal">
                <InputLabel>Status</InputLabel>
                <Select label="Status">
                    <MenuItem value="personal">ACTIVE</MenuItem>
                    <MenuItem value="industry">DISCONTINUED</MenuItem>
                </Select>
            </FormControl>
        <div> 
            {
                productBom.map(
                    item=>(
                        <div>
                        <TextField id="ahh" label="uhh" variant="outlined" defaultValue={item.materialName} />
                        <TextField id="eeee" label="uhh" variant="outlined" defaultValue={item.quantity} />
                        </div>
                    )
                )
            }
    
        </div>
        
        
    </Box>
    )
}