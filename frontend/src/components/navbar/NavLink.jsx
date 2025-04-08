import React from 'react';
import { Box } from '@chakra-ui/react';
import { Link, useLocation } from 'react-router-dom';

const NavLink = ({ children, href, ...props }) => {
  const location = useLocation();
  const isActive = location.pathname === href;

  return (
    <Link to={href}>
      <Box
        px={2}
        py={1}
        fontWeight="500"
        transition="all 0.3s ease-in-out"
        cursor="pointer"
        _hover={{
          color: 'orange.400',
          textDecoration: 'none',
          ...props._hover
        }}
        {...props}
        sx={isActive ? { color: 'orange.400', fontWeight: '600' } : {}}
      >
        {children}
      </Box>
    </Link>
  );
};

export default NavLink;
