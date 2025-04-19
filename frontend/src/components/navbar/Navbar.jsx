import React, { Fragment } from 'react';
import {
  Box,
  Button,
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
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { FaUser } from 'react-icons/fa6';
import NavLink from './NavLink';
import HamburgerMenu from './HamburgerMenu';
import { CgProfile } from 'react-icons/cg';
import { RiSettings2Line } from 'react-icons/ri';
import { MdOutlineLogout } from 'react-icons/md';

const hoverStyle = {
  borderBottom: '2px',
  borderBottomColor: 'orange'
};

export default function Navbar() {
  const { isOpen, onToggle } = useDisclosure();
  const location = useLocation();
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  const NAVBAR_ITEMS = [
    { label: 'Home', link: '/' },
    { label: 'Recipes', link: '/recipes' },
    ...(user?.role === 'user' || user?.role === 'superuser' ? [{ label: 'My Recipes', link: '/my-recipes' }] : []),
    ...(user?.role === 'superuser' ? [{ label: 'Categories', link: '/categories' }] : [])
  ];

  const handleLogOut = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  const handleLogin = () => {
    navigate('/login');
  };

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
            {!user ? (
              <Button colorScheme='orange' onClick={handleLogin}>login / register</Button>
            ) : (
              <Stack direction={'row'} spacing={7}>
                <Menu>
                  <MenuButton>
                    <FaUser color="orange" />
                  </MenuButton>
                  <MenuList>
                    <Link to="/profile">
                      <MenuItem>
                        <CgProfile style={{ marginRight: '0.5rem' }} />
                        My profile
                      </MenuItem>
                    </Link>
                    <MenuItem>
                      <RiSettings2Line style={{ marginRight: '0.5rem' }} />
                      Settings
                    </MenuItem>
                    <MenuItem onClick={handleLogOut}>
                      <MdOutlineLogout style={{ marginRight: '0.5rem' }} />
                      Log out
                    </MenuItem>
                  </MenuList>
                </Menu>
              </Stack>
            )}
          </Flex>
        </Flex>
      </Box>
    </Fragment>
  );
}
