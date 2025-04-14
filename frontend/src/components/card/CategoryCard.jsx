import React from 'react';
import { Text, VStack, Box, Image } from '@chakra-ui/react';

const CategoryCard = ({ category_name, image_url }) => {
  return (
    <VStack my="1rem" spacing="0.5rem" _hover={{ color: 'orange' }}>
      <Box
        borderRadius="full"
        overflow="hidden"
        width="12rem"
        height="12rem"
        sx={{
          position: 'relative',
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
          width="160"
          height="160"
          alt={category_name}
          layout="responsive"
          objectFit="cover"
          style={{ borderRadius: '6px', width: '100%', height: '100%' }}
        />
      </Box>
      <Text fontWeight="600" fontSize="1.25rem" transition="0.8s ease">
        {category_name}
      </Text>
    </VStack>
  );
};

export default CategoryCard;
