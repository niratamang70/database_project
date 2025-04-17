import axios from 'axios';

export const getAllCategories = async () => {
  try {
    const response = await axios.get('http://localhost:3001/categories/all');
    return response?.data;
  } catch (error) {
    console.error('Error fetching all categories:', error);
    throw error;
  }
};

export const createNewCategory = async categoryData => {
  try {
    const response = await axios.post('http://localhost:3001/categories/create', categoryData);
    return response?.data;
  } catch (error) {
    return { error: 'Something went wrong' };
  }
};
