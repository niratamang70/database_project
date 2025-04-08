import { ChakraProvider, extendTheme } from '@chakra-ui/react';

const customTheme = extendTheme({
  components: {
    Container: {
      baseStyle: {
        maxW: {
          xl: 'container.xl',
          sm: 'container.sm',
          md: 'container.md',
          lg: 'container.lg'
        }
      }
    }
  }
});

export const AppThemeProvider = ({ children }) => {
  return <ChakraProvider theme={customTheme}>{children}</ChakraProvider>;
};
