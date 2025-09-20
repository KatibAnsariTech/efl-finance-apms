import { useState } from 'react';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';

import Nav from './Navigation';
import Main from './Main';
import Header from './Header';

// ----------------------------------------------------------------------

export default function Layout({ children }) {
  const [openNav, setOpenNav] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  return (
    <>
      <Header collapsed={collapsed} onOpenNav={() => setOpenNav(true)} />

      <Box
        sx={{
          minHeight: 1,
          display: 'flex',
          flexDirection: { xs: 'column', lg: 'row' },
          position: 'relative',
        }}
      >
        <Nav
          collapsed={collapsed}
          setCollapsed={setCollapsed}
          openNav={openNav}
          onCloseNav={() => setOpenNav(false)}
        />

        <Box
          sx={{
            flexGrow: 1,
            position: 'absolute',
            top: 0,
            left: collapsed ? '80px' : '220px',
            right: 0,
            bottom: 0,
            transition: 'left 0.3s ease',
          }}
        >
          <Main collapsed={collapsed}>{children}</Main>
        </Box>
      </Box>
    </>
  );
}

Layout.propTypes = {
  children: PropTypes.node,
};
