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
  Spinner,
  Text,
  useDisclosure,
  useToast
} from '@chakra-ui/react';
import { AddIcon } from '@chakra-ui/icons';
import { getAllIngredientUnit } from '../api/ingredients.api';
import axios from 'axios';

const IngredientUnitPage = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const [ingredientUnit, setIngredientUnit] = useState('');
  const [ingredientUnits, setIngredientUnits] = useState([]);
  const [ingredientUnitLoading, setIngredientUnitLoading] = useState(true);

  const handleIngredientUnit = value => {
    setIngredientUnit(value);
  };

  const handleModalClose = () => {
    onClose();
    setIngredientUnit('');
  };

  const createIngredientUnit = async () => {
    try {
      const response = await axios.post('http://localhost:3001/ingredients-unit/create', {
        unit_name: ingredientUnit
      });

      if (response) {
        toast({
          description: response?.data?.message,
          status: 'success',
          duration: 3000,
          position: 'top-right'
        });
        const allIngredients = await getAllIngredientUnit();
        setIngredientUnits(allIngredients);
        setIngredientUnit('');
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
      setIngredientUnitLoading(true);
      const response = await getAllIngredientUnit();
      if (response) {
        setIngredientUnits(response);
        setIngredientUnitLoading(false);
      }
    };

    fetchIngredients();
  }, []);

  return (
    <Container maxW="container.xl" p={4}>
      {ingredientUnitLoading && (
        <Center height="100vh">
          <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="orange" size="xl" />
        </Center>
      )}
      <Box my={9}>
        <Heading>Ingredient unit</Heading>
        {ingredientUnits?.map(ingredient => (
          <Box key={ingredient.uit_id} padding={4} borderWidth="1px" borderRadius="md" marginTop={4}>
            <Text fontSize="lg">{ingredient.name}</Text>
          </Box>
        ))}
        <Button leftIcon={<AddIcon />} colorScheme="orange" onClick={onOpen} marginTop={5}>
          Add unit
        </Button>
      </Box>

      <Modal isOpen={isOpen} onClose={handleModalClose} isCentered size="3xl" closeOnOverlayClick={false}>
        <ModalOverlay />
        <ModalContent padding={4} borderRadius="md">
          <ModalHeader>{'Add Ingredient Unit'}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex flexDirection="column" gap="3">
              <FormControl isRequired>
                <FormLabel>Ingredient unit</FormLabel>
                <Input
                  type="text"
                  placeholder="For example: grams"
                  value={ingredientUnit}
                  onChange={e => handleIngredientUnit(e.target.value)}
                  required
                />
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

export default IngredientUnitPage;
