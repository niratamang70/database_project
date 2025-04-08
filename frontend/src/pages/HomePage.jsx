
import React, { Fragment } from 'react';
import {
  Box,
  Button,
  Flex,
  Input,
  InputGroup,
  InputRightElement,
  InputLeftElement,
  Icon,
  useColorModeValue,
  Heading,
  Container,
  Grid,
  GridItem
} from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import { GiKnifeFork } from 'react-icons/gi';
import { CATEGORY } from '../data/category';
import { RECIPE } from '../data/recipe';
import CategoryCard from '../components/card/CategoryCard';
import '@fontsource/playfair-display';
import { RecipeCard } from '../components/card/RecipeCard';

const HomePage = () => {
  return (
    <Fragment>
      <Box
        backgroundImage="url('https://images.unsplash.com/photo-1600891964599-f61ba0e24092')"
        backgroundSize="cover"
        backgroundPosition="center"
        width="calc(100vw - 1rem)"
        height="60vh"
        display="flex"
        justifyContent="center"
        alignItems="center"
        margin="1rem"
        borderRadius="md"
      >
        <Flex flexDirection="column" width={{ base: '90vw', lg: '40vw' }} alignItems="center" gap="2rem">
          <Heading color="white">Find your favorite dish?</Heading>
          <InputGroup size="lg" bg={useColorModeValue('gray.100', 'gray.900')} borderRadius="md">
            <InputLeftElement padding="0.5rem">
              <Icon as={GiKnifeFork} fontWeight="600" />
            </InputLeftElement>
            <Input
              placeholder="Search you recipes..."
              borderRadius="md"
              border="none"
              boxShadow="md"
              _focus={{ outline: 'none' }}
              _placeholder={{ fontSize: '1rem' }}
            />
            <InputRightElement padding="0.5rem">
              <Button
                h="2.5rem"
                size="md"
                bg="orange"
                color={useColorModeValue('gray.100', 'gray.900')}
                _hover={{ bg: 'orange.400' }}
              >
                <SearchIcon width={4} height={4} />
              </Button>
            </InputRightElement>
          </InputGroup>
        </Flex>
      </Box>
      <Container maxW="container.xl">
        <Box my="3rem">
          <Heading fontSize="2.25rem" padding="1rem 0" fontWeight="700" fontFamily="'Playfair Display', serif">
            Super Delicious
          </Heading>
          <Grid
            templateColumns={{
              base: 'repeat(1, 1fr)',
              md: 'repeat(2, 1fr)',
              lg: 'repeat(3, 1fr)'
            }}
            gap={8}
          >
            {RECIPE.map(({ id, ...rest }) => (
              <GridItem key={id}>
                <RecipeCard {...rest} />
              </GridItem>
            ))}
          </Grid>
        </Box>
        <Box my="3rem">
          <Heading fontSize="2.25rem" padding="1rem 0" fontFamily="'Playfair Display', serif" fontWeight="700">
            Popular Categories
          </Heading>
          <Grid
            templateColumns={{
              base: 'repeat(2, 1fr)',
              md: 'repeat(4, 1fr)',
              lg: 'repeat(6, 1fr)'
            }}
          >
            {CATEGORY.map(({ id, ...rest }) => (
              <GridItem key={id}>
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
