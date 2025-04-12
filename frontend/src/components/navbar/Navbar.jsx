import React, { Fragment } from 'react';
import {
  Box,
  Flex,
  HStack,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Stack,
  useColorModeValue,
  useDisclosure
} from '@chakra-ui/react';
import { Link, useLocation } from 'react-router-dom';
import { FaUser } from 'react-icons/fa6';
import NavLink from './NavLink';
import HamburgerMenu from './HamburgerMenu';

export const NAVBAR_ITEMS = [
  { label: 'Home', link: '/' },
  { label: 'Recipes', link: '/recipes' },
  { label: 'My Recipes', link: '/my-recipes' }
];

const hoverStyle = {
  borderBottom: '2px',
  borderBottomColor: 'orange'
};

export default function Navbar() {
  const { isOpen, onToggle } = useDisclosure();
  const location = useLocation();

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
              <NavLink key={index} href={item.link} _hover={hoverStyle} isActive={location.pathname === item.link}>
                {item.label}
              </NavLink>
            ))}
          </HStack>
          <Flex alignItems={'center'} display={{ base: 'none', md: 'flex' }}>
            <Stack direction={'row'} spacing={7}>
              <Menu>
                <MenuButton>
                  <FaUser color="orange" />
                </MenuButton>
                <MenuList>
                  <MenuItem>
                    <Link to="/profile">My Profile</Link>
                  </MenuItem>
                  <MenuItem>Settings</MenuItem>
                  <MenuItem>
                    <Link to="/login">Log out</Link>
                  </MenuItem>
                </MenuList>
              </Menu>
            </Stack>
          </Flex>
        </Flex>
      </Box>
    </Fragment>
  );
}
