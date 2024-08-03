import React, { useState, useEffect } from 'react';
import { Button, Dialog, DialogTitle, DialogContent, List, ListItem, ListItemText, Typography } from '@mui/material';
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
      <Button variant="contained" color="secondary" onClick={handleOpen}>
        Get Recipe Suggestions
      </Button>
      <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
        <DialogTitle>Recipe Suggestions</DialogTitle>
        <DialogContent>
          {error ? (
            <Typography color="error">{error}</Typography>
          ) : selectedRecipe ? (
            <div>
              <Typography variant="h6">{selectedRecipe.title}</Typography>
              <img src={selectedRecipe.image} alt={selectedRecipe.title} style={{ maxWidth: '100%', height: 'auto' }} />
              <Typography variant="body1" dangerouslySetInnerHTML={{ __html: selectedRecipe.summary }} />
              <Button onClick={() => setSelectedRecipe(null)}>Back to list</Button>
            </div>
          ) : (
            <List>
              {recipes.map((recipe) => (
                <ListItem button key={recipe.id} onClick={() => handleRecipeClick(recipe.id)}>
                  <ListItemText primary={recipe.title} secondary={`Uses ${recipe.usedIngredientCount} of your ingredients`} />
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