import { useState } from "react";
import { TextField, Button, MenuItem } from "@mui/material";
import { addItem } from "../lib/firestoreUtils";

const categories = ["Fruits and Vegetables", "Dairy", "Nuts/Cereals", "Drinks", "Snacks"];

const AddItem = ({ onAdd }) => {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (name && category) {
      const newItem = { name, category };
      await addItem(newItem);
      onAdd(newItem); // Pass the new item to the parent component
      setName(""); // Clear the name input field
      setCategory(""); // Clear the category input field
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <TextField
        label="Item Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
        fullWidth
        margin="normal"
      />
      <TextField
        select
        label="Category"
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        required
        fullWidth
        margin="normal"
      >
        {categories.map((cat) => (
          <MenuItem key={cat} value={cat}>
            {cat}
          </MenuItem>
        ))}
      </TextField>
      <Button type="submit" variant="contained" color="primary" fullWidth>
        Add Item
      </Button>
    </form>
  );
};

export default AddItem;
