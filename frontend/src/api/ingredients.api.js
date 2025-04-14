import axios from 'axios';

export const getAllIngredients = async () => {
  try {
    const response = await axios.get('http://localhost:3001/ingredients/all');
    return response?.data;
  } catch (error) {
    console.error('Error fetching all ingredients:', error);
    throw error;
  }
};

export const getAllIngredientUnit = async () => {
  try {
    const response = await axios.get('http://localhost:3001/ingredients-unit/all');
    return response?.data;
  } catch (error) {
    console.error('Error fetching all ingredients:', error);
    throw error;
  }
};
