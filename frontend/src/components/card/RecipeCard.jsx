import React from 'react';

import { Box, Text, Flex, Icon, Image } from '@chakra-ui/react';
import { FaStar } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';

export const RecipeCard = ({ recipe_id, recipe_name, rating = 4, image_url }) => {
  const navigate = useNavigate();

  const handleRecipeDetail = () => {
    navigate(`/recipes/${recipe_id}`);
  };

  return (
    <Flex
      flexDirection="column"
      gap="0.5rem"
      _hover={{
        color: 'orange'
      }}
      onClick={handleRecipeDetail}
    >
      <Box
        borderRadius="lg"
        overflow="hidden"
        position="relative"
        width="22.313rem"
        height="15.438rem"
        sx={{
          '& img': {
            transition: 'transform 0.8s ease'
          },
          '&:hover img': {
            transform: 'scale(1.1)'
          }
        }}
      >
        <Image
          src={image_url ?? '/images/no-recipe.png'}
          width={357}
          height={247}
          alt={recipe_name}
          layout="responsive"
          objectFit="cover"
        />
      </Box>
      <Box>
        <Flex flexDirection="row" alignItems="center" gap="0.25rem" marginBottom="0.25rem">
          {Array.from({ length: rating }, (_, index) => (
            <Icon as={FaStar} boxSize="1rem" color="orange" key={index} />
          ))}
        </Flex>

        <Text fontSize="1.25rem" fontWeight="600" transition="0.8s ease">
          {recipe_name}
        </Text>
      </Box>
    </Flex>
  );
};
