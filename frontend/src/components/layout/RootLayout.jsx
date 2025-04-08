import { Box } from '@chakra-ui/react';
import Navbar from '../navbar/Navbar';

const RootLayout = ({ children }) => {
  return (
    <Box>
      <Navbar />
      <main>{children}</main>
    </Box>
  );
};

export default RootLayout;
