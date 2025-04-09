import React, { Fragment } from 'react';
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
  Icon
} from '@chakra-ui/react';
import axios from 'axios';
import { DeleteIcon } from '@chakra-ui/icons'; // Chakra UI components for UI elements

import ProductCard from '../components/card/ProductCard';

const RecipePage = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  // State management for the recipe form
  const [recipeName, setRecipeName] = React.useState('');
  const [categoryId, setCategoryId] = React.useState('');
  const [instructions, setInstructions] = React.useState('');
  const [ingredients, setIngredients] = React.useState([{ name: '', quantity: '', unit: '', is_optional: false }]);

  // Handle recipe name change
  const handleRecipeNameChange = e => {
    setRecipeName(e.target.value);
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

  return (
    <Fragment>
      <Container maxW="container.xl">
        <Box padding="1.5rem">
          <Flex
            flexDirection={{
              base: 'column',
              md: 'row'
            }}
            marginTop={'2rem'}
            gap={10}
          >
            <ProductCard
              title="Vegetable Momo"
              time={'20 minutes'}
              image={'https://thebigmansworld.com/wp-content/uploads/2023/02/chicken-chow-mein-recipe.jpg'}
            />
            <ProductCard
              title="Vegetable Momo"
              time={'60 minutes'}
              image="https://assets.vogue.in/photos/5f0446d5800c753aed1a4b71/4:3/w_6547,h_4910,c_limit/momos%20tandoori%20momos%20chicken%20momos%20steamed%20dumplings%20easy%20recipes%20home%20recipes.jpg"
            />
            <ProductCard
              title="Vegetable Chow-mein"
              time={'20 minutes'}
              image={'https://www.recipetineats.com/wp-content/uploads/2023/07/Beef-chow-mein_5.jpg'}
            />
            <ProductCard
              title="Vegetable Pizza"
              time={'30 minutes'}
              image={'https://kauveryhospital.com/blog/wp-content/uploads/2021/04/pizza-5179939_960_720.jpg'}
            />
          </Flex>
          <Button colorScheme="orange" onClick={onOpen}>
            Add recipe
          </Button>
        </Box>
      </Container>

      <Modal isOpen={isOpen} onClose={onClose} isCentered size="3xl" >
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
                <Input type="text" />
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
                      <Icon as={DeleteIcon} cursor="pointer" onClick={()=>removeIngredient(index)} />
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

export default RecipePage;
