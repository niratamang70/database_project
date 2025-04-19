import React, { useState } from 'react';
import { Box, Container, Heading, Flex, FormControl, FormLabel, Input, Button, useToast, Text } from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const LoginPage = () => {
  const navigate = useNavigate();
  const toast = useToast();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleUserLogin = async () => {
    try {
      const response = await axios.post('http://localhost:3001/user/login', {
        username,
        password
      });

      const user = response.data;

      localStorage.setItem('user', JSON.stringify(user));

      toast({
        title: 'Login successful',
        status: 'success',
        duration: 3000,
        isClosable: true,
        position: 'top-right'
      });

      navigate('/');
    } catch (error) {
      toast({
        description: error.response?.data?.error || 'Invalid credentials',
        status: 'error',
        duration: 3000,
        isClosable: true,
        position: 'top-right'
      });
    }
  };

  return (
    <Container maxW="container.xl">
      <Box marginTop="200px">
        <Heading textAlign="center">Login</Heading>
        <Flex flexDirection="column" alignItems="center" gap={3} width="30%" mx="auto" marginTop="80px">
          <FormControl isRequired>
            <FormLabel>Username</FormLabel>
            <Input type="text" value={username} onChange={e => setUsername(e.target.value)} />
          </FormControl>
          <FormControl isRequired>
            <FormLabel>Password</FormLabel>
            <Input type="password" value={password} onChange={e => setPassword(e.target.value)} />
          </FormControl>

          <Button colorScheme="orange" width="full" marginTop={5} onClick={handleUserLogin}>
            Login
          </Button>
          <Text>
            No account ? {''}
            <Link to="/register" style={{ textDecoration: 'underline', color: 'orange' }}>
              Register
            </Link>
          </Text>
        </Flex>
      </Box>
    </Container>
  );
};

export default LoginPage;
