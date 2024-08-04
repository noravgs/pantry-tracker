import React, { useState, useEffect } from 'react';
import { 
  Button, Dialog, DialogTitle, DialogContent, List, ListItem, ListItemText, Typography, 
  Card, CardContent, CardMedia, CardActions, Box
} from '@mui/material';
import { getRecipeSuggestions, getRecipeDetails } from '../lib/recipeApi';

const RecipeSuggestions = ({ items }) => {
  const [open, setOpen] = useState(false);
  const [recipes, setRecipes] = useState([]);
  const [selectedRecipe, setSelectedRecipe] = useState(null);
  const [error, setError] = useState(null);

  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setSelectedRecipe(null);
    setError(null);
  };

  useEffect(() => {
    if (open) {
      const ingredients = items.map(item => item.name);
      getRecipeSuggestions(ingredients).then(data => {
        if (data.length === 0) {
          setError('No recipes found or daily API limit reached.');
        } else {
          setRecipes(data);
        }
      });
    }
  }, [open, items]);

  const handleRecipeClick = async (id) => {
    const details = await getRecipeDetails(id);
    if (details) {
      setSelectedRecipe(details);
    } else {
      setError('Unable to fetch recipe details or daily API limit reached.');
    }
  };

  return (
    <>
      <Button 
        variant="contained" 
        sx={{ fontFamily: 'Ubuntu' }} 
        style={{ background: '#ff9914' }} 
        onClick={handleOpen}
      >
        Get Recipe Suggestions
      </Button>
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle sx={{ fontFamily: 'Ubuntu'}} style={{ background: '#ff9914', color: "#fff" }}>Recipe Suggestions</DialogTitle>
        <DialogContent style={{ background: '#e9f5db' }}>
          {error ? (
            <Typography color="error">{error}</Typography>
          ) : selectedRecipe ? (
            <Card>
              <CardMedia
                component="img"
                height="300"
                image={selectedRecipe.image}
                alt={selectedRecipe.title}
              />
              <CardContent>
                <Typography style={{ background: '#ff9914', color: "#fff" }} gutterBottom variant="h5" component="div" sx={{ textAlign: 'center' }}>
                  {selectedRecipe.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" dangerouslySetInnerHTML={{ __html: selectedRecipe.summary }} />
              </CardContent>
              <CardActions sx={{ justifyContent: 'center' }}>
                <Button 
                  size="small" 
                  style={{ background: '#718355', color: "#fff" }} 
                  onClick={() => setSelectedRecipe(null)}
                >
                  Back to list
                </Button>
              </CardActions>
            </Card>
          ) : (
            <List>
              {recipes.map((recipe) => (
                <ListItem button key={recipe.id} onClick={() => handleRecipeClick(recipe.id)}>
                  <ListItemText 
                    primary={recipe.title} 
                    secondary={`Uses ${recipe.usedIngredientCount} of your ingredients`} 
                  />
                </ListItem>
              ))}
            </List>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default RecipeSuggestions;