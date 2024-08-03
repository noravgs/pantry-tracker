import { useState } from "react";
import { TextField, Button, MenuItem, Box } from "@mui/material";
import { addItem } from "../lib/firestoreUtils";

const categories = ["Fruits and Vegetables", "Dairy", "Nuts/Cereals", "Drinks", "Snacks", "Other"];

const AddItem = ({ onAdd }) => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");
  const [quantity, setQuantity] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (name && category && quantity) {
      const newItem = { name, category, quantity: parseInt(quantity, 10) };
      await addItem(newItem);
      onAdd(newItem);
      setName("");
      setCategory("");
      setQuantity("");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, my: 2 }}>
        <TextField
          label="Item Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          fullWidth
        />
        <TextField
          select
          label="Category"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
          fullWidth
        >
          {categories.map((cat) => (
            <MenuItem key={cat} value={cat}>
              {cat}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="Quantity"
          type="number"
          value={quantity}
          onChange={(e) => setQuantity(e.target.value)}
          required
          fullWidth
        />
        <Button type="submit" variant="contained" color="primary" fullWidth>
          Add Item
        </Button>
      </Box>
    </form>
  );
};

export default AddItem;