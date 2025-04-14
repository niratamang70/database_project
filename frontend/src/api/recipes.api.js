import axios from 'axios';

export const getAllRecipes = async () => {
  try {
    const response = await axios.get('http://localhost:3001/recipes/all');
    return response.data;
  } catch (error) {
    console.error('Error fetching all recipes:', error);
    throw error;
  }
};

export const showRecipeDetails = async id => {
  try {
    const response = await axios.get(`http://localhost:3001/recipes/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching recipe details:', error);
    throw error;
  }
};

export const deleteRecipe = async id => {
  try {
    const response = await axios.delete(`http://localhost:3001/recipes/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting recipe:', error);
    throw error;
  }
};
