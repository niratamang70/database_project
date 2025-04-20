import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Center,
  Container,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Select,
  Spinner,
  Text,
  useDisclosure,
  useToast
} from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import { getAllIngredients, getAllIngredientUnit } from '../api/ingredients.api';
import axios from 'axios';

const IngredientPage = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const [ingredient, setIngredient] = useState('');
  const [ingredients, setIngredients] = useState([]);
  const [unitId, setUnitId] = useState('');
  const [ingredientLoading, setIngredientLoading] = useState(true);
  const [ingredientUnitLoading, setIngredientUnitLoading] = useState(true);
  const [ingredientUnits, setIngredientUnits] = useState([]);

  const handleIngredientName = value => {
    setIngredient(value);
  };

  const handleModalClose = () => {
    onClose();
    setIngredient('');
  };

  const handleIngredientUnitChange = value => {
    setUnitId(value);
  };

  const createIngredientUnit = async () => {
    if (!ingredient || !unitId) {
      toast({
        description: 'Please fill all the fields',
        status: 'error',
        duration: 3000,
        position: 'top-right'
      });
      return;
    }
    try {
      const response = await axios.post('http://localhost:3001/ingredients/create', {
        ingredient_name: ingredient,
        unit_id: unitId
      });

      if (response) {
        toast({
          description: response?.data?.message,
          status: 'success',
          duration: 3000,
          position: 'top-right'
        });
        const allIngredients = await getAllIngredients();
        setIngredients(allIngredients);
        setIngredient('');
        onClose();
      }
    } catch (error) {
      toast({
        description: error?.response?.data?.error || 'Something went wrong',
        status: 'error',
        duration: 3000,
        position: 'top-right'
      });
    }
  };

  useEffect(() => {
    const fetchIngredients = async () => {
      setIngredientLoading(true);
      const response = await getAllIngredients();
      if (response) {
        setIngredients(response);
        setIngredientLoading(false);
      }
    };

    const fetchIngredientUnits = async () => {
      setIngredientUnitLoading(true);
      const response = await getAllIngredientUnit();
      if (response) {
        setIngredientUnits(response);
        setIngredientUnitLoading(false);
      }
    };

    fetchIngredients();
    fetchIngredientUnits();
  }, []);

  return (
    <Container maxW="container.xl" p={4}>
      {(ingredientLoading || ingredientUnitLoading) && (
        <Center height="100vh">
          <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="orange" size="xl" />
        </Center>
      )}
      <Box my={9}>
        <Heading>Ingredients</Heading>
        {ingredients?.map(ingredient => (
          <Box key={ingredient.ingredient_id} padding={4} borderWidth="1px" borderRadius="md" marginTop={4}>
            <Text fontSize="lg">{ingredient.ingredient_name}</Text>
          </Box>
        ))}
        <Button leftIcon={<AddIcon />} colorScheme="orange" onClick={onOpen} marginTop={5}>
          Add ingredient
        </Button>
      </Box>

      <Modal isOpen={isOpen} onClose={handleModalClose} isCentered size="3xl" closeOnOverlayClick={false}>
        <ModalOverlay />
        <ModalContent padding={4} borderRadius="md">
          <ModalHeader>{'Add Ingredient'}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex flexDirection="column" gap="3">
              <FormControl isRequired>
                <FormLabel>Ingredient Name</FormLabel>
                <Input
                  type="text"
                  placeholder="For example: grams"
                  value={ingredient}
                  onChange={e => handleIngredientName(e.target.value)}
                  required
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Ingredient Unit</FormLabel>
                <Select
                  placeholder="Select unit"
                  value={unitId}
                  onChange={e => handleIngredientUnitChange(e.target.value)}
                  required
                >
                  {ingredientUnits?.map((unit, index) => (
                    <option key={index} value={unit?.unit_id}>
                      {unit?.name}
                    </option>
                  ))}
                </Select>
              </FormControl>
            </Flex>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="orange" mr={3} onClick={createIngredientUnit}>
              Create
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default IngredientPage;
