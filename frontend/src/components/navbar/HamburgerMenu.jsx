import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Icon,
  Stack,
  useColorMode,
  useColorModeValue
} from '@chakra-ui/react';
import { Fragment, useState } from 'react';
import { NAVBAR_ITEMS } from './Navbar';
import { SmallCloseIcon, HamburgerIcon, MoonIcon, SunIcon } from '@chakra-ui/icons';
import NavLink from './NavLink';

const HamburgerButton = ({ icon, ...props }) => {
  return (
    <Button
      colorScheme="orange"
      bg="transparent"
      fontSize="2xl"
      px="0.5rem"
      py="0"
      _active={{
        bg: 'orange'
      }}
      _hover={{
        bg: 'transparent'
      }}
      variant="ghost"
      {...props}
    >
      <Icon as={icon} />
    </Button>
  );
};

function HamburgerMenu() {
  const { colorMode, toggleColorMode } = useColorMode();

  const [menuOpen, setMenuOpen] = useState(false);

  const handleOpen = () => {
    setMenuOpen(true);
  };

  const handleClose = () => {
    setMenuOpen(false);
  };

  return (
    <Fragment>
      <HamburgerButton
        display={{
          base: 'inline-flex',
          md: 'none'
        }}
        icon={HamburgerIcon}
        onClick={handleOpen}
      />
      <Drawer placement="top" onClose={handleClose} isOpen={menuOpen}>
        <DrawerOverlay />
        <DrawerContent bg={useColorModeValue('gray.100', 'gray.900')} padding="0rem 1rem">
          <DrawerHeader display="flex" alignItems="center" justifyContent="space-between" pl="0.5rem">
            <Box
              // fontFamily={roboto.style.fontFamily}
              fontWeight="500"
              color="orange"
              cursor="pointer"
            >
              Cook.io
            </Box>
            <HamburgerButton icon={SmallCloseIcon} onClick={handleClose} />
          </DrawerHeader>

          <DrawerBody py="1rem">
            <Stack alignItems="flex-start" spacing="1rem">
              {NAVBAR_ITEMS.map((item, index) => (
                <NavLink key={index} href={item.link}>
                  {item.label}
                </NavLink>
              ))}
            </Stack>
            <Box onClick={toggleColorMode} cursor="pointer" px={2} py={1}>
              {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
            </Box>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Fragment>
  );
}

export default HamburgerMenu;
