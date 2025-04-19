import React, { useState } from 'react';
import {
  Container,
  Box,
  Heading,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Button,
  Text,
  FormErrorMessage,
  useToast
} from '@chakra-ui/react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const RegisterPage = () => {
  const toast = useToast();
  const navigate = useNavigate();

  const [username, setUsername] = useState({ value: '', error: '' });
  const [password, setPassword] = useState({ value: '', error: '' });
  const [firstName, setFirstName] = useState({ value: '', error: '' });
  const [lastName, setLastName] = useState({ value: '', error: '' });
  const [confirmPassword, setConfirmPassword] = useState({ value: '', error: '' });

  const handleFirstName = value => {
    if (!value) {
      setFirstName({ value: '', error: 'First name is required' });
    } else {
      setFirstName({ value: value, error: '' });
    }
  };

  const handleLastName = value => {
    if (!value) {
      setLastName({ value: '', error: 'Last name is required' });
    } else {
      setLastName({ value: value, error: '' });
    }
  };

  const handleUsername = value => {
    if (!value) {
      setUsername({ value: '', error: 'Username is required' });
    } else {
      setUsername({ value: value, error: '' });
    }
  };

  const handlePassword = value => {
    if (!value) {
      setPassword({ value: '', error: 'Password is required' });
    } else {
      setPassword({ value: value, error: '' });
    }
  };

  const handleConfirmPassword = value => {
    if (!value) {
      setConfirmPassword({ value: '', error: 'Confirm password is required' });
    } else if (value !== password.value) {
      setConfirmPassword({ value: value, error: 'Passwords do not match' });
    } else {
      setConfirmPassword({ value: value, error: '' });
    }
  };

  const handleRegister = async () => {
    const userData = {
      username: username.value,
      first_name: firstName.value,
      last_name: lastName.value,
      password: password.value
    };
    try {
      const response = await axios.post('http://localhost:3001/user/register', userData);
      if (response) {
        toast({
          description: response.data.message,
          status: 'success',
          duration: 3000,
          isClosable: true,
          position: 'top-right'
        });

        navigate('/login');
      }
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
      <Box marginTop="100px">
        <Heading textAlign="center">Register</Heading>
        <Flex
          flexDirection="column"
          alignItems="center"
          gap={3}
          width={{ base: '100%', sm: '80%', lg: '30%' }}
          mx="auto"
          marginTop="80px"
        >
          <FormControl isRequired isInvalid={firstName?.error}>
            <FormLabel>First Name</FormLabel>
            <Input type="text" value={firstName?.value} onChange={e => handleFirstName(e.target.value)} />
            <FormErrorMessage>{firstName?.error}</FormErrorMessage>
          </FormControl>
          <FormControl isRequired isInvalid={lastName.error}>
            <FormLabel>Last Name</FormLabel>
            <Input type="text" value={lastName.value} onChange={e => handleLastName(e.target.value)} />
            <FormErrorMessage>{lastName.error}</FormErrorMessage>
          </FormControl>
          <FormControl isRequired isInvalid={username.error}>
            <FormLabel>Username</FormLabel>
            <Input
              type="text"
              autoComplete={false}
              value={username.value}
              onChange={e => handleUsername(e.target.value)}
            />
            <FormErrorMessage>{username.error}</FormErrorMessage>
          </FormControl>
          <FormControl isRequired isInvalid={password.error}>
            <FormLabel>Password</FormLabel>
            <Input
              type="password"
              autoComplete={false}
              value={password.value}
              onChange={e => handlePassword(e.target.value)}
            />
            <FormErrorMessage>{password.error}</FormErrorMessage>
          </FormControl>
          <FormControl isRequired isInvalid={confirmPassword.error}>
            <FormLabel>Confirm Password</FormLabel>
            <Input
              type="password"
              autoComplete={false}
              value={confirmPassword.value}
              onChange={e => handleConfirmPassword(e.target.value)}
            />
            <FormErrorMessage>{confirmPassword.error}</FormErrorMessage>
          </FormControl>

          <Button colorScheme="orange" width="full" marginTop={5} onClick={handleRegister}>
            Register
          </Button>
          <Text>
            Have already account ? {''}
            <Link to="/login" style={{ textDecoration: 'underline', color: 'orange' }}>
              Login
            </Link>
          </Text>
        </Flex>
      </Box>
    </Container>
  );
};

export default RegisterPage;
