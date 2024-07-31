// components/ItemList.js
import { Button, List, ListItem, ListItemText, Chip, Box } from "@mui/material";
import { deleteItem } from "../lib/firestoreUtils";

const ItemList = ({ items }) => {
  const handleDelete = async (id) => {
    await deleteItem(id);
    // Optionally, you may want to refresh the item list in the parent component
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
                <Box component="span" display="flex" alignItems="center">
                  <Chip label={item.category} size="small" style={{ backgroundColor: '#4caf50', color: '#ffffff' }} />
                </Box>
              }
            />
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
