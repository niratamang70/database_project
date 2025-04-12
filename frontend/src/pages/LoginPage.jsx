import { Box, Container, Heading, Flex, FormControl, FormLabel, Input, Button } from '@chakra-ui/react';
import React from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const navigate = useNavigate();

  const handleUserLogin = async () => {
    navigate('/');
  };
  return (
    <Container maxW="container.xl">
      <Box marginTop="200px">
        <Heading textAlign="center">Login</Heading>
        <Flex flexDirection="column" alignItems="center" gap={3} width="30%" mx="auto" marginTop="80px">
          <FormControl isRequired>
            <FormLabel htmlFor="email">Email address</FormLabel>
            <Input id="email" type="email" />
          </FormControl>
          <FormControl isRequired>
            <FormLabel htmlFor="email">Password</FormLabel>
            <Input id="password" type="password" />
          </FormControl>

          <Button colorScheme="orange" width="full" marginTop={5} onClick={handleUserLogin}>
            Login
          </Button>
        </Flex>
      </Box>
    </Container>
  );
};

export default LoginPage;
