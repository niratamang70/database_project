import React, { Fragment, useEffect, useState } from 'react';
import {
  Flex,
  Box,
  Container,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  Icon,
  SimpleGrid
} from '@chakra-ui/react';
import axios from 'axios';
import { DeleteIcon } from '@chakra-ui/icons'; // Chakra UI components for UI elements

import ProductCard from '../components/card/ProductCard';

const MyRecipes = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  // State management for the recipe form
  const [recipeName, setRecipeName] = React.useState('');
  const [categoryId, setCategoryId] = React.useState('');
  const [instructions, setInstructions] = React.useState('');
  const [recipeImage, setRecipeImage] = React.useState('');
  const [ingredients, setIngredients] = React.useState([{ name: '', quantity: '', unit: '', is_optional: false }]);

  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Handle recipe name change
  const handleRecipeNameChange = e => {
    setRecipeName(e.target.value);
  };

  const handleRecipeImageChange = e => {
    setRecipeImage(e.target.value);
  };

  // Handle category selection
  const handleCategoryChange = e => {
    setCategoryId(e.target.value);
  };

  // Handle instructions change
  const handleInstructionsChange = e => {
    setInstructions(e.target.value);
  };

  // Handle ingredient fields change
  const handleIngredientChange = (index, field, value) => {
    const newIngredients = [...ingredients];
    newIngredients[index][field] = value;
    setIngredients(newIngredients);
  };

  // Add new ingredient row
  const addIngredient = () => {
    setIngredients([...ingredients, { name: '', quantity: '', unit: '', is_optional: false }]);
  };

  // Remove ingredient row
  const removeIngredient = index => {
    const newIngredients = ingredients.filter((_, i) => i !== index);
    setIngredients(newIngredients);
  };

  // Handle form submission (sending data to backend)
  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:3001/recipes', {
        recipe_name: recipeName,
        category_id: categoryId,
        image_url: recipeImage,
        instructions,
        ingredients
      });
      console.log(response.data);
      alert('Recipe added successfully!');

      setRecipeName('');
      setCategoryId('');
      setInstructions('');
      setIngredients([{ name: '', quantity: '', unit: '', is_optional: false }]);
    } catch (error) {
      console.error(error);
      alert('Failed to add recipe');
    }
  };

  const updateRecipe = () => {
    console.log('Update recipe');
    onOpen();
  };

  useEffect(() => {
    const fetchRecipes = async () => {
      try {
        const response = await axios.get('http://localhost:3001/recipes/all');
        console.log(response.data);
        setRecipes(response.data);
      } catch (error) {
        console.error('Error fetching recipes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipes();
  }, []);

  return (
    <Fragment>
      <Container maxW="container.xl">
        <Box padding="1.5rem">
          <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing={10} gap={5} alignItems="flex-end">
            {recipes.map((recipe, index) => (
              <ProductCard
                title={recipe.recipe_name}
                key={index}
                time={recipe.duration}
                image={recipe.image_url}
                handleRecipeEdit={updateRecipe}
              />
            ))}
            <Button colorScheme="orange" onClick={onOpen} marginTop={5} width="50%">
              Add recipe
            </Button>
          </SimpleGrid>
        </Box>
      </Container>

      {/* Modal for adding new recipe */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered size="3xl">
        <ModalOverlay />
        <ModalContent padding={4} borderRadius="md">
          <ModalHeader>Add New Recipe</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex flexDirection="column" gap="3">
              <FormControl>
                <FormLabel>Recipe Name</FormLabel>
                <Input type="text" value={recipeName} onChange={handleRecipeNameChange} required />
              </FormControl>

              <FormControl>
                <FormLabel>Image URL</FormLabel>
                <Input type="text" value={recipeImage} onChange={handleRecipeImageChange} required />
              </FormControl>

              <FormControl>
                <FormLabel>Category</FormLabel>
                <Select placeholder="Select Category" value={categoryId} onChange={handleCategoryChange} required>
                  <option value="1">Indian</option>
                  <option value="2">Chinese</option>
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel>Ingredients</FormLabel>
                <Flex flexDirection="column" gap="2">
                  {ingredients.map((ingredient, index) => (
                    <Flex key={index} flexDirection="row" gap="1" alignItems="center" justifyContent="space-between">
                      <Select
                        value={ingredient.name}
                        onChange={e => handleIngredientChange(index, 'name', e.target.value)}
                        placeholder="Select ingredient"
                      >
                        <option>Tomato</option>
                        <option>Flour</option>
                      </Select>
                      <Input
                        type="number"
                        value={ingredient.quantity}
                        onChange={e => handleIngredientChange(index, 'quantity', e.target.value)}
                        placeholder="Quantity"
                      />
                      <Select
                        value={ingredient.unit}
                        onChange={e => handleIngredientChange(index, 'unit', e.target.value)}
                        placeholder="Select unit"
                      >
                        <option value="gram">gram</option>
                        <option value="tbsp">tbsp</option>
                        <option value="cups">cups</option>
                      </Select>
                      <Icon as={DeleteIcon} cursor="pointer" onClick={() => removeIngredient(index)} />
                    </Flex>
                  ))}
                </Flex>

                <Button colorScheme="blue" onClick={addIngredient} marginTop="2">
                  Add Ingredient
                </Button>
              </FormControl>

              <FormControl>
                <FormLabel>Instructions</FormLabel>
                <Textarea
                  value={instructions}
                  onChange={handleInstructionsChange}
                  placeholder="Provide instructions"
                  required
                />
              </FormControl>
            </Flex>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="orange" mr={3} onClick={handleSubmit}>
              Save
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Fragment>
  );
};

export default MyRecipes;
