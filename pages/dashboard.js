import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import ItemList from "../components/ItemList";
import AddItem from "../components/AddItem"; 
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Container, Typography, Button, FormControl, InputLabel, Select, MenuItem, TextField } from "@mui/material";
import { getItems } from "../lib/firestoreUtils";

const Dashboard = () => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [items, setItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [sortOption, setSortOption] = useState("name");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const auth = getAuth();
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsSignedIn(!!user);
    });

    return () => unsubscribe();
  }, [auth]);

  useEffect(() => {
    const fetchItems = async () => {
      if (isSignedIn) {
        const allItems = await getItems();
        setItems(allItems || []);
      }
    };
    fetchItems();
  }, [isSignedIn]);

  useEffect(() => {
    let updatedItems = [...items];

    if (categoryFilter) {
      updatedItems = updatedItems.filter(item => item.category === categoryFilter);
    }

    if (searchTerm) {
      updatedItems = updatedItems.filter(item => item.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }

    updatedItems.sort((a, b) => a[sortOption].localeCompare(b[sortOption]));

    setFilteredItems(updatedItems);
  }, [items, sortOption, categoryFilter, searchTerm]);

  const handleSignOut = async () => {
    await auth.signOut();
    setIsSignedIn(false);
    router.push("/");
  };

  const handleAddItem = (newItem) => {
    setItems((prevItems) => [...prevItems, newItem]);
  };

  if (!isSignedIn) {
    return (
      <Container>
        <Typography variant="h6">Please log in to view your pantry items.</Typography>
      </Container>
    );
  }

  return (
    <Container>
      <Typography variant="h4" component="h1" gutterBottom>
        Your Pantry Items
      </Typography>

      <Button variant="contained" color="secondary" onClick={handleSignOut}>
        Log Out
      </Button>

      <AddItem onAdd={handleAddItem} />

      <FormControl fullWidth margin="normal">
        <InputLabel id="sort-label">Sort By</InputLabel>
        <Select
          labelId="sort-label"
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
        >
          <MenuItem value="name">Name</MenuItem>
          <MenuItem value="category">Category</MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth margin="normal">
        <InputLabel id="category-label">Filter by Category</InputLabel>
        <Select
          labelId="category-label"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <MenuItem value="">All</MenuItem>
          <MenuItem value="Fruits and Vegetables">Fruits and Vegetables</MenuItem>
          <MenuItem value="Dairy">Dairy</MenuItem>
          <MenuItem value="Nuts/Cereals">Nuts/Cereals</MenuItem>
          <MenuItem value="Drinks">Drinks</MenuItem>
          <MenuItem value="Snacks">Snacks</MenuItem>
        </Select>
      </FormControl>

      <TextField
        fullWidth
        margin="normal"
        label="Search"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />

      {filteredItems.length === 0 ? (
        <Typography variant="h6">Your pantry is empty! Please add an item.</Typography>
      ) : (
        <ItemList items={filteredItems} />
      )}
    </Container>
  );
};

export default Dashboard;
