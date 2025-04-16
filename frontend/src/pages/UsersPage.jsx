import React, { useEffect } from 'react';
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
  ModalFooter
} from '@chakra-ui/react';
import { getAllCategories } from '../api/categories.api';
import CategoryCard from '../components/card/CategoryCard';
import { AddIcon } from '@chakra-ui/icons';

const UsersPage = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [categories, setCategories] = React.useState([]);
  const [categoriesLoading, setCategoriesLoading] = React.useState(true);

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
        >
          {categories?.map(({ category_id, ...rest }) => (
            <GridItem key={category_id}>
              <CategoryCard {...rest} />
            </GridItem>
          ))}
          <Button leftIcon={<AddIcon />} colorScheme="orange" onClick={onOpen} marginTop={5} width={'80%'}>
            Add recipe
          </Button>
        </Grid>
      </Box>

      <Modal isOpen={isOpen} onClose={onClose} isCentered size="3xl">
        <ModalOverlay />
        <ModalContent padding={4} borderRadius="md">
          <ModalHeader>{'Add New Category'}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex flexDirection="column" gap="3">
              <FormControl>
                <FormLabel>Category Name</FormLabel>
                <Input type="text" placeholder="For example: Chinese" value={'Indian'} onChange={() => {}} required />
              </FormControl>

              <FormControl>
                <FormLabel>Image URL</FormLabel>
                <Input type="text" placeholder="Please provide image URL" value={''} onChange={() => {}} required />
              </FormControl>
            </Flex>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="orange" mr={3} onClick={() => {}}>
              {'Create'}
            </Button>
            <Button onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Container>
  );
};

export default UsersPage;
