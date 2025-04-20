import React from 'react';
import { Container, Heading, Box, Center, Spinner } from '@chakra-ui/react';

const UsersPage = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <Container maxW="container.xl">
      {!user && (
        <Center height="100vh">
          <Spinner thickness="4px" speed="0.65s" emptyColor="gray.200" color="orange" size="xl" />
        </Center>
      )}
      <Box my={9}>
        <Heading  textAlign="center">{`Welcome to your profile ${user.fullname}`}</Heading>
      </Box>
    </Container>
  );
};

export default UsersPage;
