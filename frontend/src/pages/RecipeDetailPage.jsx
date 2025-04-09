import { Box, Container, Divider, Flex, Heading, Image, Text } from '@chakra-ui/react';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const RecipeDetailPage = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`http://localhost:3001/recipes/${id}`)
      .then(response => {
        setRecipe(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching recipe:', error);
        setLoading(false);
      });
  }, [id]);

  console.log(recipe, 'here is the recipe');
  return (
    <Container maxW="container.xl">
      <Box padding="1.5rem">
        <Heading>{recipe?.recipe_name}</Heading>

        <Divider marginTop={5} marginBottom={5} />
        <Box overflow="hidden" width="100%" height="30rem" position="relative">
          <Image
            rounded={'lg'}
            src={recipe?.recipe_image}
            alt="noodles"
            layout="responsive"
            objectFit="cover"
            borderRadius="lg"
          />
        </Box>

        <Flex flexDirection="row" gap="2rem" marginTop={9}>
          <Box>
            <Heading as="h4" size="lg" fontFamily="'Playfair Display', serif">
              Ingredients
            </Heading>
            <Flex flexDirection="column" gap="1rem" marginTop={5}>
              {recipe?.ingredients?.map(ingredient => (
                <Text fontSize="xl" key={ingredient.ingredient_id}>
                  {ingredient.quantity} {''}
                  {ingredient.unit} {ingredient.ingredient_name}
                </Text>
              ))}
            </Flex>
          </Box>
          <Box>
            <Heading as="h4" size="lg" fontFamily="'Playfair Display', serif">
              Instructions
            </Heading>
            <Box marginTop={5}>
              <Text>{recipe?.instructions}</Text>
            </Box>
          </Box>
        </Flex>
      </Box>
    </Container>
  );
};

export default RecipeDetailPage;
