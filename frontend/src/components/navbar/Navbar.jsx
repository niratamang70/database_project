import React, { Fragment } from 'react';
import { Box, Flex, HStack, Stack, useColorModeValue, useDisclosure } from '@chakra-ui/react';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';
import { useLocation } from 'react-router-dom'; 
import NavLink from './NavLink';
import HamburgerMenu from './HamburgerMenu';

export const NAVBAR_ITEMS = [
  { label: 'Home', link: '/' },
  { label: 'Recipes', link: '/recipes' }
];

const hoverStyle = {
  borderBottom: '2px',
  borderBottomColor: 'orange'
};

export default function Navbar() {
  const [colorMode, setColorMode] = React.useState('light');
  const { isOpen, onToggle } = useDisclosure();
  const location = useLocation(); 
 
  const toggleColorMode = () => setColorMode(colorMode === 'light' ? 'dark' : 'light');

  return (
    <Fragment>
      <Box bg={useColorModeValue('gray.100', 'gray.900')} px={4}>
        <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
          <Box fontWeight="500" color="orange" cursor="pointer">
            Cook.io
          </Box>
          <HamburgerMenu isOpen={isOpen} onToggle={onToggle} />
          <HStack as={'nav'} spacing={4} display={{ base: 'none', md: 'flex' }}>
            {NAVBAR_ITEMS.map((item, index) => (
              <NavLink
                key={index}
                href={item.link}
                _hover={hoverStyle}
                isActive={location.pathname === item.link} 
              >
                {item.label}
              </NavLink>
            ))}
          </HStack>
          <Flex alignItems={'center'} display={{ base: 'none', md: 'flex' }}>
            <Stack direction={'row'} spacing={7}>
              <Box onClick={toggleColorMode} cursor="pointer">
                {colorMode === 'light' ? (
                  <MoonIcon _hover={{ background: 'transparent' }} />
                ) : (
                  <SunIcon _hover={{ bg: 'transparent' }} />
                )}
              </Box>
            </Stack>
          </Flex>
        </Flex>
      </Box>
    </Fragment>
  );
}
