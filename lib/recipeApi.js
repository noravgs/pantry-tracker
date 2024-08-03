import axios from 'axios';
import { getCache, setCache, incrementApiCall } from './apiCache';

const API_KEY = process.env.NEXT_PUBLIC_SPOONACULAR_API_KEY;
const BASE_URL = 'https://api.spoonacular.com/recipes';

export const getRecipeSuggestions = async (ingredients) => {
  const cacheKey = `suggestions_${ingredients.sort().join(',')}`;
  const cachedData = getCache(cacheKey);
  
  if (cachedData) {
    return cachedData;
  }

  if (!incrementApiCall()) {
    console.error('Daily API call limit reached');
    return [];
  }

  try {
    const response = await axios.get(`${BASE_URL}/findByIngredients`, {
      params: {
        ingredients: ingredients.join(','),
        number: 5,
        ranking: 2,
        ignorePantry: true,
        apiKey: API_KEY,
      },
    });
    setCache(cacheKey, response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching recipe suggestions:', error);
    return [];
  }
};

export const getRecipeDetails = async (id) => {
  const cacheKey = `details_${id}`;
  const cachedData = getCache(cacheKey);
  
  if (cachedData) {
    return cachedData;
  }

  if (!incrementApiCall()) {
    console.error('Daily API call limit reached');
    return null;
  }

  try {
    const response = await axios.get(`${BASE_URL}/${id}/information`, {
      params: {
        apiKey: API_KEY,
      },
    });
    setCache(cacheKey, response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching recipe details:', error);
    return null;
  }
};