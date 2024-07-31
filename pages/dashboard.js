import { useEffect, useState } from "react";
import { useRouter } from "next/router"; // Import useRouter
import ItemList from "../components/ItemList";
import AddItem from "../components/AddItem"; 
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Container, Typography, Button } from "@mui/material";
import { getItems } from "../lib/firestoreUtils";

const Dashboard = () => {
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [items, setItems] = useState([]);
  const auth = getAuth();
  const router = useRouter(); // Initialize useRouter

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
        setItems(allItems || []); // Ensure items is always an array
      }
    };
    fetchItems();
  }, [isSignedIn]);

  const handleSignOut = async () => {
    await auth.signOut();
    setIsSignedIn(false);
    router.push("/"); // Redirect to the login page
  };

  const handleAddItem = (newItem) => {
    setItems((prevItems) => [...prevItems, newItem]); // Add new item to the state
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

      {items.length === 0 ? (
        <Typography variant="h6">Your pantry is empty! Please add an item.</Typography>
      ) : (
        <ItemList items={items} /> // Pass items to ItemList
      )}
    </Container>
  );
};

export default Dashboard;
