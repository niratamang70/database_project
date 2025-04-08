import React from 'react';
import { Flex, Box, Container } from '@chakra-ui/react';
import ProductCard from '../components/card/ProductCard';

const RecipePage = () => {
  return (
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
      </Box>
    </Container>
  );
};

export default RecipePage;
