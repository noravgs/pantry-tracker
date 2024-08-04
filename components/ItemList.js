import React, { useState } from 'react';
import { Grid, Card, CardContent, Typography, CardActions, Button, Chip, Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem } from '@mui/material';
import { deleteItem, updateItem, getItems } from "../lib/firestoreUtils";

const categories = ["Fruits and Vegetables", "Dairy", "Nuts/Cereals", "Drinks", "Snacks", "Spices", "Other"];

const ItemList = ({ items, onItemUpdate }) => {
  const [editItem, setEditItem] = useState(null);
  const [openEditModal, setOpenEditModal] = useState(false);

  const handleDelete = async (id) => {
    await deleteItem(id);
    onItemUpdate();
  };

  const handleEdit = (item) => {
    setEditItem(item);
    setOpenEditModal(true);
  };

  const handleCloseEditModal = () => {
    setOpenEditModal(false);
    setEditItem(null);
  };

  const handleSaveEdit = async () => {
    if (editItem) {
      await updateItem(editItem.id, {
        name: editItem.name,
        category: editItem.category,
        quantity: parseInt(editItem.quantity, 10)
      });
      onItemUpdate();
      handleCloseEditModal();
    }
  };

  return (
    <>
      <Grid container spacing={3}>
        {items.map((item) => (
          <Grid item xs={12} sm={6} md={4} key={item.id}>
            <Card>
              <CardContent sx={{ boxShadow: 1 }}>
                <Typography variant="h6" component="div">
                  {item.name}
                </Typography>
                <Chip 
                  label={item.category} 
                  size="small" 
                  style={{ backgroundColor: '#ffd449', color: '#ffffff', marginTop: 8 }}
                />
                <Typography variant="body2" color="text.secondary" style={{ marginTop: 8 }}>
                  Quantity: {item.quantity || 'N/A'}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" color="primary" onClick={() => handleEdit(item)}>
                  Edit
                </Button>
                <Button size="small" color="error" onClick={() => handleDelete(item.id)}>
                  Delete
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={openEditModal} onClose={handleCloseEditModal}>
        <DialogTitle>Edit Item</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Item Name"
            type="text"
            fullWidth
            value={editItem?.name || ''}
            onChange={(e) => setEditItem({...editItem, name: e.target.value})}
          />
          <TextField
            select
            margin="dense"
            label="Category"
            fullWidth
            value={editItem?.category || ''}
            onChange={(e) => setEditItem({...editItem, category: e.target.value})}
          >
            {categories.map((cat) => (
              <MenuItem key={cat} value={cat}>
                {cat}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            margin="dense"
            label="Quantity"
            type="number"
            fullWidth
            value={editItem?.quantity || ''}
            onChange={(e) => setEditItem({...editItem, quantity: e.target.value})}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEditModal}>Cancel</Button>
          <Button onClick={handleSaveEdit}>Save</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ItemList;