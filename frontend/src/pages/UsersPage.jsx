import React, { useEffect } from 'react';
import { Container, Heading, Box } from '@chakra-ui/react';

const UsersPage = () => {
  return (
    <Container maxW="container.xl">
      <Box my={9}>
        <Heading>Welcome to your profile</Heading>
      </Box>
    </Container>
  );
};

export default UsersPage;
