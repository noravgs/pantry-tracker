import { useState, useEffect } from "react";
import Head from "next/head";
import AddItem from "@/components/AddItem";
import ItemList from "@/components/ItemList";
import SignIn from "@/components/SignIn";
import { MenuItem, Select, FormControl, InputLabel, Container, Typography, Button, Grid, Card, CardContent, CardMedia, Box } from "@mui/material";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "../lib/firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

export default function Home() {
  const [category, setCategory] = useState("");
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState([]);

  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsSignedIn(!!user);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [auth]);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "pantryItems"));
        const allItems = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));
        setItems(allItems); // Store fetched items
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    };

    if (isSignedIn) {
      fetchItems();
    }
  }, [isSignedIn]);

  const handleSignIn = () => {
    setIsSignedIn(true);
  };

  const handleSignOut = async () => {
    await auth.signOut();
    setIsSignedIn(false);
  };

  if (loading) return <p>Loading...</p>;

  return (
    <>
      <Head>
        <title>Pantry Tracker</title>
        <meta name="description" content="Track and organize your pantry items" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '100vh',
          padding: 2,
        }}
      >
        <Grid container spacing={2} justifyContent="center" alignItems="center">
          <Grid item xs={12} sm={6}>
            <Card>
              <CardContent>
                <Typography variant="h5" component="div" align="center">
                  Pantry Tracker
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                  <CardMedia
                    component="img"
                    alt="Pantry Tracker"
                    image="/images/pantry.jpg"
                    title="Pantry Tracker"
                    sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Card>
              <CardContent>
                {!isSignedIn ? (
                  <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                    <SignIn onSignIn={handleSignIn} />
                  </Box>
                ) : (
                  <>
                    <Button variant="contained" color="secondary" onClick={handleSignOut} sx={{ mt: 2 }}>
                      Sign Out
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>

      {isSignedIn && (
        <Container>
          <AddItem onAdd={() => setCategory("")} />

          {/* Category Selector */}
          <FormControl fullWidth margin="normal">
            <InputLabel id="category-label">View Category</InputLabel>
            <Select
              labelId="category-label"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <MenuItem value=""><em>All</em></MenuItem>
              <MenuItem value="Fruits and Vegetables">Fruits and Vegetables</MenuItem>
              <MenuItem value="Dairy">Dairy</MenuItem>
              <MenuItem value="Nuts/Cereals">Nuts/Cereals</MenuItem>
              <MenuItem value="Drinks">Drinks</MenuItem>
              <MenuItem value="Snacks">Snacks</MenuItem>
            </Select>
          </FormControl>

          {/* ItemList Component */}
          <ItemList category={category} />
        </Container>
      )}
    </>
  );
}
