import { Box } from '@chakra-ui/react';
import Navbar from '../navbar/Navbar';
import { Outlet } from 'react-router-dom';

const RootLayout = () => {
  return (
    <Box>
      <Navbar />
      <main>
        <Outlet />
      </main>
    </Box>
  );
};

export default RootLayout;
