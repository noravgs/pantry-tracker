import { Button, List, ListItem, ListItemText, Chip, Box } from "@mui/material";
import { deleteItem, updateItem, getItems } from "../lib/firestoreUtils"; // Import getItems

const ItemList = ({ items }) => {
  const handleDelete = async (id) => {
    await deleteItem(id);
    // Optionally, you may want to refresh the item list in the parent component
  };

  const handleEdit = async (id) => {
    const allItems = await getItems(); // Fetch all items
    const itemToUpdate = allItems.find(item => item.id === id);

    if (itemToUpdate) {
      const updatedData = {
        // Define the updated fields, you might want to get this from user input instead
        name: "Updated Name",
        category: "Updated Category",
      };

      await updateItem(id, updatedData);
    } else {
      console.error("Item not found:", id);
    }
  };

  return (
    <List>
      {items.length === 0 ? (
        <ListItem>
          <ListItemText primary="No items available." />
        </ListItem>
      ) : (
        items.map((item) => (
          <ListItem key={item.id} divider>
            <ListItemText 
              primary={item.name}
              secondary={
                <span style={{ display: 'flex', alignItems: 'center' }}>
                  <Chip label={item.category} size="small" style={{ backgroundColor: '#4caf50', color: '#ffffff' }} />
                </span>
              }
            />
            <Button variant="contained" color="primary" onClick={() => handleEdit(item.id)}>
              Edit
            </Button>
            <Button variant="contained" color="error" onClick={() => handleDelete(item.id)}>
              Delete
            </Button>
          </ListItem>
        ))
      )}
    </List>
  );
};

export default ItemList;
