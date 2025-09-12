import { useState } from "react";
import PropTypes from "prop-types";

import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import { useResponsive } from "src/hooks/use-responsive";

import { NAV } from "./config-layout";
import ExactSidebar from "src/components/ExactSidebar";

// ----------------------------------------------------------------------

export default function Nav({ openNav, onCloseNav, collapsed, setCollapsed }) {
  const upLg = useResponsive("up", "lg");

  return (
    <Box
      component="nav"
      sx={{
        flexShrink: { lg: 0 },
        width: { lg: collapsed ? 80 : NAV.WIDTH },
        transition: 'width 0.3s ease',
      }}
    >
      {upLg ? (
        <Drawer
          open
          variant="permanent"
          PaperProps={{
            sx: {
              width: collapsed ? 80 : NAV.WIDTH,
              bgcolor: "transparent",
              borderRightStyle: collapsed ? "none" : "dashed",
              transition: 'width 0.3s ease',
            },
          }}
        >
          <ExactSidebar collapsed={collapsed} setCollapsed={setCollapsed} />
        </Drawer>
      ) : (
        <Drawer
          open={openNav}
          onClose={onCloseNav}
          ModalProps={{
            keepMounted: true,
          }}
          PaperProps={{
            sx: {
              width: NAV.WIDTH,
            },
          }}
        >
          <ExactSidebar collapsed={collapsed} setCollapsed={setCollapsed} />
        </Drawer>
      )}
    </Box>
  );
}

Nav.propTypes = {
  openNav: PropTypes.bool,
  onCloseNav: PropTypes.func,
  collapsed: PropTypes.bool,
  setCollapsed: PropTypes.func,
};