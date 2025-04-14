import React, { Fragment, useEffect, useState } from 'react';
import { Box, Flex, Heading, Container, Grid, GridItem, Text, Center, Spinner } from '@chakra-ui/react';
import CategoryCard from '../components/card/CategoryCard';
import '@fontsource/playfair-display';
import { RecipeCard } from '../components/card/RecipeCard';
import { getAllCategories } from '../api/categories.api';
import { getAllRecipes } from '../api/recipes.api';

const HomePage = () => {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchRecipes = async () => {
      const response = await getAllRecipes();
      if (response) {
        setRecipes(response);
      }
      setLoading(false);
    };

    const fetchCategories = async () => {
      const categoriesResponse = await getAllCategories();
      if (categoriesResponse) {
        setCategories(categoriesResponse);
      }
    };
    fetchRecipes();
    fetchCategories();
  }, []);

  return (
    <Fragment>
      {loading && (
        <Center height="100vh">
          <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="orange" size="xl" />
        </Center>
      )}
      <Box
        backgroundImage="/images/recipe-hero-image.jpeg"
        backgroundSize="cover"
        backgroundPosition="center"
        width="calc(100vw - 2rem)"
        height="60vh"
        display="flex"
        justifyContent="center"
        alignItems="center"
        margin="1rem"
        borderRadius="md"
      >
        <Flex flexDirection="column" width={{ base: '90vw', lg: '40vw' }} alignItems="center" gap="2rem">
          <Heading color="white">Find your favorite dish</Heading>
        </Flex>
      </Box>
      <Container maxW="container.xl">
        <Box my="3rem">
          <Heading fontSize="2.25rem" padding="1rem 0" fontWeight="700" fontFamily="'Playfair Display', serif">
            Super Delicious
          </Heading>
          {recipes.length > 0 ? (
            <Grid
              templateColumns={{
                base: 'repeat(1, 1fr)',
                md: 'repeat(2, 1fr)',
                lg: 'repeat(3, 1fr)'
              }}
              gap={8}
            >
              {recipes?.map(({ id, ...rest }) => (
                <GridItem key={id}>
                  <RecipeCard {...rest} />
                </GridItem>
              ))}
            </Grid>
          ) : (
            <Text fontSize="2xl">No recipe found.</Text>
          )}
        </Box>
        <Box my="3rem">
          <Heading fontSize="2.25rem" padding="1rem 0" fontFamily="'Playfair Display', serif" fontWeight="700">
            Popular Categories
          </Heading>
          {categories.length === 0 && <Text fontSize="2xl">No categories found.</Text>}
          <Grid
            templateColumns={{
              base: 'repeat(2, 1fr)',
              md: 'repeat(4, 1fr)',
              lg: 'repeat(6, 1fr)'
            }}
          >
            {categories?.map(({ category_id, ...rest }) => (
              <GridItem key={category_id}>
                <CategoryCard {...rest} />
              </GridItem>
            ))}
          </Grid>
        </Box>
      </Container>
    </Fragment>
  );
};

export default HomePage;
