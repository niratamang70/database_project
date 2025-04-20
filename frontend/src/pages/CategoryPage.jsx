import React, { useEffect, useState } from 'react';
import {
  Container,
  Heading,
  Box,
  GridItem,
  Grid,
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  Flex,
  FormControl,
  FormLabel,
  Input,
  ModalFooter,
  useToast
} from '@chakra-ui/react';
import { createNewCategory, getAllCategories } from '../api/categories.api';
import CategoryCard from '../components/card/CategoryCard';
import { AddIcon } from '@chakra-ui/icons';
import axios from 'axios';

const CategoryPage = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState({ name: '', imageUrl: '', description: '' });
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  const handleCategoryChange = (value, inputType) => {
    setNewCategory(prev => ({
      ...prev,
      [inputType]: value
    }));
  };

  const handleModalClose = () => {
    onClose();
    setNewCategory({ name: '', imageUrl: '', description: '' });
  };

  const createCategory = async () => {
    try {
      const response = await axios.post('http://localhost:3001/categories/create', {
        category_name: newCategory.name,
        image_url: newCategory.imageUrl || null,
        description: newCategory.description || 'No description provided'
      });

      if (response) {
        toast({
          description: response?.data?.message,
          status: 'success',
          duration: 3000,
          position: 'top-right',
          isClosable: true
        });
        setCategories(prev => [...response?.data?.data]);
        handleModalClose();
      }
    } catch (error) {
      toast({
        description: error?.response?.data?.error,
        status: 'error',
        duration: 3000,
        position: 'top-right',
        isClosable: true
      });
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      setCategoriesLoading(true);
      const categoriesResponse = await getAllCategories();
      if (categoriesResponse) {
        setCategories(categoriesResponse);
        setCategoriesLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return (
    <Container maxW="container.xl">
      <Box my={9}>
        <Heading>Categories</Heading>
        <Grid
          templateColumns={{
            base: 'repeat(1, 1fr)',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
            lg: 'repeat(6, 1fr)'
          }}
          alignItems="center"
        >
          {categories?.map(({ category_id, ...rest }) => (
            <GridItem key={category_id}>
              <CategoryCard {...rest} />
            </GridItem>
          ))}
          <Button leftIcon={<AddIcon />} colorScheme="orange" onClick={onOpen} marginTop={5} width={'80%'}>
            Add Category
          </Button>
        </Grid>
      </Box>

      <Modal isOpen={isOpen} onClose={handleModalClose} isCentered size="3xl" closeOnOverlayClick={false}>
        <ModalOverlay />
        <ModalContent padding={4} borderRadius="md">
          <ModalHeader>{'Add New Category'}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex flexDirection="column" gap="3">
              <FormControl isRequired>
                <FormLabel>Category Name</FormLabel>
                <Input
                  type="text"
                  placeholder="For example: Chinese"
                  value={newCategory.name}
                  onChange={e => handleCategoryChange(e.target.value, 'name')}
                  required
                />
              </FormControl>

              <FormControl>
                <FormLabel>Category image URL</FormLabel>
                <Input
                  type="text"
                  placeholder="Please provide image URL"
                  value={newCategory.imageUrl}
                  onChange={e => handleCategoryChange(e.target.value, 'imageUrl')}
                  required
                />
              </FormControl>

              <FormControl>
                <FormLabel>Description</FormLabel>
                <Input
                  type="text"
                  placeholder="Provide category description"
                  value={newCategory.description}
                  onChange={e => handleCategoryChange(e.target.value, 'description')}
                />
              </FormControl>
            </Flex>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="orange" mr={3} onClick={createCategory}>
              Create
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default CategoryPage;
