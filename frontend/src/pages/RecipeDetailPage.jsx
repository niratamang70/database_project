import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Box, Container, Divider, Flex, Heading, Image, Text } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';

const RecipeDetailPage = () => {
  const { id } = useParams();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        const response = await axios.get(`http://localhost:3001/recipes/${id}`);
        setRecipe(response.data);
      } catch (error) {
        console.error('Error fetching recipe:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id]);

  return (
    <Container maxW="container.xl">
      <Box padding="1.5rem">
        <Heading>{recipe?.recipe_name}</Heading>
        <Divider marginTop={5} marginBottom={9} />
        <Box overflow="hidden" width="100%" height="30rem" position="relative">
          <Image
            rounded={'lg'}
            src={recipe?.recipe_image ?? '/images/no-recipe.png'}
            alt={recipe?.recipe_name}
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
        {/* <IconButton
          marginTop={5}
          background="transparent"
          _hover={{ background: 'transparent' }}
          aria-label="delete recipe"
          onClick={handleRecipeDelete}
          icon={<DeleteIcon color="orange" w={6} h={6} cursor="pointer" />}
        /> */}
      </Box>
    </Container>
  );
};

export default RecipeDetailPage;
