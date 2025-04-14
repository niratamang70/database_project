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
  SimpleGrid,
  useToast,
  Center,
  Spinner,
  Text,
  InputGroup,
  InputLeftElement,
  InputRightElement
} from '@chakra-ui/react';
import axios from 'axios';
import { AddIcon, DeleteIcon, RepeatIcon, SearchIcon } from '@chakra-ui/icons'; // Chakra UI components for UI elements

import ProductCard from '../components/card/ProductCard';
import { useNavigate } from 'react-router-dom';
import { deleteRecipe, getAllRecipes, showRecipeDetails } from '../api/recipes.api';
import { getAllCategories } from '../api/categories.api';
import { getAllIngredients, getAllIngredientUnit } from '../api/ingredients.api';
import { GiKnifeFork } from 'react-icons/gi';

const MyRecipes = () => {
  const navigate = useNavigate();
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  // State management for the recipe form
  const [recipeName, setRecipeName] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [instructions, setInstructions] = useState('');
  const [recipeImage, setRecipeImage] = useState('');
  const [ingredients, setIngredients] = useState([
    { ingredient_id: '', quantity: '', ingredient_unit: '', is_optional: false }
  ]);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [ingredientsList, setIngredientsList] = useState([]);
  const [ingredientUnitList, setIngredientUnitList] = useState([]);
  const [searchName, setSearchName] = useState('');
  const [searchCategory, setSearchCategory] = useState('');
  const [cookingTime, setCookingTime] = useState('');

  // Handle recipe name change
  const handleRecipeNameChange = e => {
    setRecipeName(e.target.value);
  };

  const handleRecipeImageChange = e => {
    setRecipeImage(e.target.value);
  };

  const handleRecipeCookingChange = e => {
    setCookingTime(e.target.value);
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
    setIngredients([...ingredients, { ingredient_id: '', quantity: '', ingredient_unit: '', is_optional: false }]);
  };

  // Remove ingredient row
  const removeIngredient = index => {
    const newIngredients = ingredients.filter((_, i) => i !== index);
    setIngredients(newIngredients);
  };

  // Handle form submission (sending data to backend)
  const handleSubmit = async () => {
    const recipeData = {
      recipe_name: recipeName,
      category_id: categoryId,
      image_url: recipeImage,
      duration: cookingTime,
      instructions,
      ingredients
    };

    try {
      let response;

      if (isEditing && editId) {
        //update existing recipe
        response = await axios.put(`http://localhost:3001/recipes/${editId}`, recipeData);
        if (response.status === 200) {
          toast({
            description: response?.data?.message,
            status: 'success',
            duration: 3000,
            position: 'top-right',
            isClosable: true
          });
        }
      } else {
        //create new recipe
        response = await axios.post('http://localhost:3001/recipes', recipeData);
        if (response.status === 201) {
          toast({
            description: response?.data?.message,
            status: 'success',
            duration: 3000,
            position: 'top-right',
            isClosable: true
          });
        }
      }

      // fetch all recipes after add or update
      const allRecipeResponse = await getAllRecipes();
      setRecipes(allRecipeResponse);

      // clear form after add or update
      setRecipeName('');
      setCategoryId('');
      setInstructions('');
      setRecipeImage('');
      setIngredients([{ name: '', quantity: '', unit: '', is_optional: false }]);
      setIsEditing(false);
    } catch (error) {
      console.error(error);
      toast({
        description: error?.message ?? 'Something went wrong',
        status: 'success',
        duration: 3000,
        position: 'top-right',
        isClosable: true
      });
    }
    onClose();
  };

  const updateRecipe = async recipeId => {
    const recipeData = await showRecipeDetails(recipeId);
    if (recipeData) {
      setRecipeName(recipeData.recipe_name);
      setRecipeImage(recipeData.recipe_image);
      setCategoryId(recipeData.category_id);
      setCookingTime(recipeData.duration);
      setInstructions(recipeData.instructions);
      setIngredients(
        recipeData.ingredients.map(ingredient => ({
          ingredient_id: ingredient.ingredient_id,
          quantity: ingredient.quantity,
          ingredient_unit: ingredient.unit_id,
          is_optional: ingredient.is_optional
        }))
      );
      setIsEditing(true);
      setEditId(recipeId);
    }
    onOpen();
  };

  const createRecipe = () => {
    setIsEditing(false);
    onOpen();
  };

  const handleDeleteRecipe = async recipeID => {
    const response = await deleteRecipe(recipeID);
    if (response) {
      toast({
        description: response?.message,
        status: 'success',
        duration: 3000,
        position: 'top-right',
        isClosable: true
      });
      const data = await getAllRecipes();
      setRecipes(data);
    }
  };

  const handleShowRecipeDetails = recipeId => {
    navigate(`/recipes/${recipeId}`);
  };

  const handleSearch = async () => {
    try {
      const queryParams = new URLSearchParams();
      if (searchName) queryParams.append('name', searchName);
      if (searchCategory) queryParams.append('category', searchCategory);

      const response = await axios.get(`http://localhost:3001/recipes/all?${queryParams.toString()}`);
      setRecipes(response.data);
    } catch (error) {
      console.error('Search failed:', error);
    }
  };

  const resetSearch = async () => {
    setSearchName('');
    setSearchCategory('');
    const data = await getAllRecipes();
    setRecipes(data);
  };

  useEffect(() => {
    const fetchRecipes = async () => {
      setLoading(true);
      const data = await getAllRecipes();
      setRecipes(data);
      setLoading(false);
    };

    const fetchCategories = async () => {
      const categoriesResponse = await getAllCategories();
      if (categoriesResponse) {
        setCategories(categoriesResponse);
      }
    };

    const fetchIngredients = async () => {
      const ingredientResponse = await getAllIngredients();
      if (ingredientResponse) {
        setIngredientsList(ingredientResponse);
      }
    };

    const fetchAllIngredientUnit = async () => {
      const ingredientUnitResponse = await getAllIngredientUnit();
      if (ingredientUnitResponse) {
        setIngredientUnitList(ingredientUnitResponse);
      }
    };

    fetchAllIngredientUnit();
    fetchIngredients();
    fetchCategories();
    fetchRecipes();
  }, []);

  return (
    <Fragment>
      <Container maxW="container.xl">
        <Box padding="1.5rem">
          <Flex flexDirection="row" marginBottom={5} gap={2} alignItems="center">
            <InputGroup size="lg" borderRadius="md">
              <InputLeftElement padding="0.5rem">
                <Icon as={GiKnifeFork} fontWeight="600" />
              </InputLeftElement>
              <Input
                placeholder="Search you recipes by name..."
                borderRadius="md"
                _focus={{ outline: 'none' }}
                _placeholder={{ fontSize: '1.125rem' }}
                value={searchName}
                onChange={e => setSearchName(e.target.value)}
              />
              <InputRightElement padding="0.5rem"></InputRightElement>
            </InputGroup>
            <Select
              size="lg"
              placeholder="Search by category"
              _placeholder={{ fontSize: '1.125rem' }}
              value={searchCategory}
              onChange={e => setSearchCategory(e.target.value)}
            >
              {categories.map((category, index) => (
                <option key={index} value={category.category_name}>
                  {category.category_name}
                </option>
              ))}
            </Select>
            <Button
              h="2.5rem"
              size="md"
              colorScheme="orange"
              _hover={{ bg: 'orange.400' }}
              width="30%"
              height="48px"
              onClick={handleSearch}
              leftIcon={<SearchIcon />}
            >
              Search
            </Button>

            <Button width="30%" height="48px" leftIcon={<RepeatIcon />} onClick={() => resetSearch()}>
              Reset
            </Button>
          </Flex>

          {loading && (
            <Center height="70vh">
              <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="orange" size="xl" />
            </Center>
          )}

          {recipes.length === 0 && (
            <Center height="70vh">
              <Text fontSize="2xl">No recipe found.</Text>
            </Center>
          )}

          <SimpleGrid columns={{ base: 1, sm: 2, md: 4 }} spacing={10} gap={5} alignItems="flex-end" marginTop={5}>
            {recipes?.map((recipe, index) => (
              <ProductCard
                title={recipe.recipe_name}
                id={recipe.recipe_id}
                key={index}
                time={recipe.duration}
                image={recipe.image_url}
                handleRecipeEdit={updateRecipe}
                handleShowRecipeDetails={handleShowRecipeDetails}
                handleRecipeDelete={handleDeleteRecipe}
              />
            ))}
            <Button leftIcon={<AddIcon />} colorScheme="orange" onClick={createRecipe} marginTop={5} width="50%">
              Add recipe
            </Button>
          </SimpleGrid>
        </Box>
      </Container>

      {/* Modal for adding new recipe */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered size="3xl">
        <ModalOverlay />
        <ModalContent padding={4} borderRadius="md">
          <ModalHeader>{isEditing ? 'Update Recipe' : 'Add New Recipe'}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex flexDirection="column" gap="3">
              <FormControl>
                <FormLabel>Recipe Name</FormLabel>
                <Input
                  type="text"
                  placeholder="For example: momo"
                  value={recipeName}
                  onChange={handleRecipeNameChange}
                  required
                />
              </FormControl>

              <FormControl>
                <FormLabel>Image URL</FormLabel>
                <Input
                  type="text"
                  placeholder="Please provide image URL"
                  value={recipeImage}
                  onChange={handleRecipeImageChange}
                  required
                />
              </FormControl>

              <FormControl>
                <FormLabel>Cooking Time</FormLabel>
                <Input
                  type="text"
                  placeholder="For example: 30 minutes"
                  value={cookingTime}
                  onChange={handleRecipeCookingChange}
                  required
                />
              </FormControl>

              <FormControl>
                <FormLabel>Category</FormLabel>
                <Select placeholder="Select Category" value={categoryId} onChange={handleCategoryChange} required>
                  {categories?.map((category, index) => (
                    <option key={index} value={category?.category_id}>
                      {category?.category_name}
                    </option>
                  ))}
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel>Ingredients</FormLabel>
                <Flex flexDirection="column" gap="2">
                  {ingredients.map((ingredient, index) => (
                    <Flex key={index} flexDirection="row" gap="1" alignItems="center" justifyContent="space-between">
                      <Select
                        value={ingredient.ingredient_id}
                        onChange={e => handleIngredientChange(index, 'ingredient_id', e.target.value)}
                        placeholder="Select ingredient"
                      >
                        {ingredientsList?.map((ingredient, index) => (
                          <option key={index} value={ingredient?.ingredient_id}>
                            {ingredient?.ingredient_name}
                          </option>
                        ))}
                      </Select>
                      <Input
                        type="number"
                        value={ingredient.quantity}
                        onChange={e => handleIngredientChange(index, 'quantity', e.target.value)}
                        placeholder="Quantity"
                      />
                      <Select
                        value={ingredient.ingredient_unit}
                        onChange={e => handleIngredientChange(index, 'ingredient_unit', e.target.value)}
                        placeholder="Select unit"
                      >
                        {ingredientUnitList?.map((ingredientUnit, index) => (
                          <option key={index} value={ingredientUnit?.unit_id}>
                            {ingredientUnit?.name}
                          </option>
                        ))}
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
              {isEditing ? 'Update' : 'Create'}
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Fragment>
  );
};

export default MyRecipes;
