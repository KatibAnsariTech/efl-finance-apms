import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";

import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import {
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
  Button,
  Collapse,
  Divider,
  Tooltip,
} from "@mui/material";
import {
  TbLayoutSidebarLeftCollapse,
  TbLayoutSidebarRightCollapse,
  TbChevronDown,
  TbChevronRight,
} from "react-icons/tb";
import { useRouter } from "src/routes/hooks";
import { usePathname } from "src/routes/hooks";
import { useResponsive } from "src/hooks/use-responsive";

import { NAV } from "./config/layout";
import Logo from "../../public/assets/logo-image.png";
import EurekaForbes from "../../public/assets/eurekafobesimage2.png";
import generateNavigationConfig from "./config/navConfig.jsx";

import DashboardIcon from "@mui/icons-material/Dashboard";
import LockIcon from "@mui/icons-material/Lock";
import PersonIcon from "@mui/icons-material/Person";
import AssignmentIcon from "@mui/icons-material/Assignment";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp";


// Legacy function - will be replaced by generateNavigationConfig
const filterNavigationByRole = (config, userRole) => {
  return config
    .filter((item) => {
      return !item.roles || item.roles.includes(userRole);
    })
    .map((item) => {
      if (item.hasSubItems && item.subItems) {
        const filteredSubItems = item.subItems.filter(
          (subItem) => !subItem.roles || subItem.roles.includes(userRole)
        );
        return {
          ...item,
          subItems: filteredSubItems,
        };
      }

      return item;
    })
    .filter((item) => {
      if (item.hasSubItems && item.subItems) {
        return item.subItems.length > 0;
      }
      return true;
    });
};


const getActiveItemFromPath = (pathname, navigationItems) => {
  for (const item of navigationItems) {
    if (item.hasSubItems && item.subItems) {
      for (const subItem of item.subItems) {
        if (pathname === subItem.path) {
          return subItem.id;
        }
      }
    }
    if (pathname === item.path) {
      return item.id;
    }
  }

  for (const item of navigationItems) {
    if (item.hasSubItems && item.subItems) {
      for (const subItem of item.subItems) {
        if (pathname.startsWith(subItem.path)) {
          return subItem.id;
        }
      }
    }
    if (pathname.startsWith(item.path)) {
      return item.id;
    }
  }

  if (navigationItems.length > 0) {
    const firstItem = navigationItems[0];
    if (firstItem.hasSubItems && firstItem.subItems.length > 0) {
      return firstItem.subItems[0].id;
    }
    return firstItem.id;
  }

  return "dashboard";
};

const Sidebar = ({
  collapsed: externalCollapsed,
  setCollapsed: setExternalCollapsed,
}) => {
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const [expandedItems, setExpandedItems] = useState({});
  const [navigationItems, setNavigationItems] = useState([]);
  const router = useRouter();
  const pathname = usePathname();

  const collapsed =
    externalCollapsed !== undefined ? externalCollapsed : internalCollapsed;
  const setCollapsed = setExternalCollapsed || setInternalCollapsed;

  const activeItem = getActiveItemFromPath(pathname, navigationItems);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    
    if (user?.accessibleProjects && user?.projectRoles) {
      // Use new project-based navigation system
      const filteredNav = generateNavigationConfig(user.accessibleProjects, user.projectRoles);
      setNavigationItems(filteredNav);
    } else {
      // No accessible projects - show empty navigation
      setNavigationItems([]);
    }
  }, []);

  useEffect(() => {
    if (navigationItems.length > 0) {
      const newExpandedItems = {};

      for (const item of navigationItems) {
        if (item.hasSubItems && item.subItems) {
          const hasActiveSubItem = item.subItems.some(
            (subItem) => subItem.id === activeItem
          );
          if (hasActiveSubItem || item.id === activeItem) {
            newExpandedItems[item.id] = true;
          }
        }
      }

      setExpandedItems(newExpandedItems);
    }
  }, [activeItem, navigationItems]);

  const handleCollapse = () => {
    setCollapsed(!collapsed);
  };

  const handleItemClick = (itemId, hasSubItems, path) => {
    if (hasSubItems) {
      handleNavigation(path);
      setExpandedItems((prev) => {
        const newExpandedItems = {};
        newExpandedItems[itemId] = true;
        return newExpandedItems;
      });
    } else {
      setExpandedItems({});
      handleNavigation(path);
    }
  };

  const handleSubItemClick = (subItemId, parentId) => {
    setExpandedItems((prev) => {
      const newExpandedItems = {};
      newExpandedItems[parentId] = true;
      return newExpandedItems;
    });

    const parentItem = navigationItems.find(
      (navItem) => navItem.id === parentId
    );
    if (parentItem && parentItem.subItems) {
      const subItem = parentItem.subItems.find((sub) => sub.id === subItemId);
      if (subItem) {
        handleNavigation(subItem.path);
      }
    }
  };

  const handleNavigation = (path) => {
    router.push(path);
  };

  return (
    <Box
      sx={{
        width: "100%",
        height: "100vh",
        backgroundColor: "#F5F5F5",
        display: "flex",
        flexDirection: "column",
        transition: "all 0.3s ease",
      }}
    >
      <Box
        sx={{
          padding: 0,
          textAlign: "center",
          marginBottom: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {collapsed ? (
          <img
            src={EurekaForbes}
            alt="Eurekforbes"
            style={{
              width: "64%",
              marginTop: "32px",
              marginBottom: "9px",
              cursor: "pointer",
            }}
            onClick={() => {
              handleNavigation("/");
            }}
          />
        ) : (
          <img
            src={Logo}
            alt="Description of your image"
            style={{
              width: "50%",
              marginTop: "20px",
              cursor: "pointer",
            }}
            onClick={() => {
              handleNavigation("/");
            }}
          />
        )}
      </Box>

      {pathname !== "/" && (
        <List
          sx={{
            padding: collapsed ? "0 8px" : "0 20px",
            flex: 1,
            marginTop: "20px",
            overflow: "auto",
            maxHeight: "calc(100vh - 170px)",
            paddingBottom: 0,
            "&::-webkit-scrollbar": {
              width: "6px",
            },
            "&::-webkit-scrollbar-track": {
              background: "transparent",
            },
            "&::-webkit-scrollbar-thumb": {
              background: "#c1c1c1",
              borderRadius: "3px",
              "&:hover": {
                background: "#a8a8a8",
              },
            },
          }}
        >
          {navigationItems.map((item) => (
            <Box
              key={item.id}
              sx={{
                marginBottom: "4px",
                borderRadius: "8px",
                backgroundColor:
                  activeItem === item.id ||
                  (item.hasSubItems &&
                    item.subItems.some(
                      (subItem) => activeItem === subItem.id
                    ))
                    ? "#E3F2FD"
                    : "transparent",
                "&:hover": {
                  backgroundColor:
                    activeItem === item.id ||
                    (item.hasSubItems &&
                      item.subItems.some(
                        (subItem) => activeItem === subItem.id
                      ))
                      ? "#E3F2FD"
                      : "#F0F0F0",
                },
                transition: "all 0.2s ease",
                overflow: "hidden",
              }}
            >
              <ListItem disablePadding>
                <ListItemButton
                  sx={{
                    borderRadius: "8px",
                    padding: "8px 16px",
                    backgroundColor: "transparent",
                    "&:hover": {
                      backgroundColor: "transparent",
                    },
                    transition: "all 0.2s ease",
                    minHeight: "36px",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    justifyContent: collapsed ? "center" : "flex-start",
                    display: "flex",
                    alignItems: "center",
                  }}
                  onClick={() =>
                    handleItemClick(item.id, item.hasSubItems, item.path)
                  }
                >
                  <ListItemIcon
                    sx={{
                      minWidth: collapsed ? "auto" : "20px",
                      color:
                        activeItem === item.id ||
                        (item.hasSubItems &&
                          item.subItems.some(
                            (subItem) => activeItem === subItem.id
                          ))
                          ? "#1877F2"
                          : "#666666",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      marginRight: collapsed ? 0 : "10px",
                    }}
                  >
                    <Box sx={{ fontSize: collapsed ? 18 : 20, display: 'flex', alignItems: 'center' }}>
                      {item.icon}
                    </Box>
                  </ListItemIcon>
                  {!collapsed && (
                    <>
                      <ListItemText
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          position: "relative",
                          flex: 1,
                          minWidth: 0,
                          "& .MuiListItemText-primary": {
                            fontFamily: "Arial, sans-serif",
                            fontSize: "14px",
                            fontWeight:
                              activeItem === item.id ||
                              (item.hasSubItems &&
                                item.subItems.some(
                                  (subItem) => activeItem === subItem.id
                                ))
                                ? "600"
                                : "400",
                            color:
                              activeItem === item.id ||
                              (item.hasSubItems &&
                                item.subItems.some(
                                  (subItem) => activeItem === subItem.id
                                ))
                                ? "#1877F2"
                                : "#333333",
                            textTransform: "none",
                            opacity: collapsed ? 0 : 1,
                            transition: "opacity 0.3s ease",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                          },
                        }}
                        primary={item.title}
                      />
                      {item.hasSubItems && (
                        <Box
                          sx={{
                            color:
                              activeItem === item.id ||
                              (item.hasSubItems &&
                                item.subItems.some(
                                  (subItem) => activeItem === subItem.id
                                ))
                                ? "#1877F2"
                                : "#666666",
                            opacity: collapsed ? 0 : 1,
                            transition: "all 0.2s ease",
                            fontSize: "20px",
                            flexShrink: 0,
                            marginLeft: "8px",
                          }}
                        >
                          {expandedItems[item.id] ? (
                            <ArrowDropUpIcon sx={{ fontSize: 20 }} />
                          ) : (
                            <ArrowDropDownIcon sx={{ fontSize: 20 }} />
                          )}
                        </Box>
                      )}
                    </>
                  )}
                </ListItemButton>
              </ListItem>

              {item.hasSubItems && (
                <Collapse
                  in={expandedItems[item.id]}
                  timeout="auto"
                  unmountOnExit
                >
                  <List component="div" disablePadding>
                    {item.subItems.map((subItem) => (
                      <ListItem key={subItem.id} disablePadding>
                        <ListItemButton
                          sx={{
                            borderRadius: "0px",
                            marginBottom: "0px",
                            padding: collapsed ? "4px 6px" : "4px 14px 4px 36px",
                            backgroundColor: "transparent",
                            "&:hover": {
                              backgroundColor: "rgba(0, 0, 0, 0.04)",
                            },
                            transition: "all 0.2s ease",
                            minHeight: "28px",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            justifyContent: collapsed ? "center" : "flex-start",
                            marginLeft: collapsed ? 0 : 0,
                            display: "flex",
                            alignItems: "center",
                          }}
                          onClick={() =>
                            handleSubItemClick(subItem.id, item.id)
                          }
                        >
                          <Tooltip title={subItem.title} placement="right" disableHoverListener={!collapsed}>
                            <ListItemIcon
                              sx={{
                              minWidth: "auto",
                              color: activeItem === subItem.id ? "#1877F2" : "#666666",
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              marginRight: collapsed ? 0 : "10px",
                              '& svg': { fontSize: collapsed ? 16 : 18 },
                              }}
                            >
                              {subItem.icon}
                            </ListItemIcon>
                          </Tooltip>
                          {!collapsed && (
                            <ListItemText
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                position: "relative",
                                flex: 1,
                                minWidth: 0,
                                "& .MuiListItemText-primary": {
                                  fontFamily: "Arial, sans-serif",
                                  fontSize: "13px",
                                  fontWeight:
                                    activeItem === subItem.id ? "500" : "400",
                                  color:
                                    activeItem === subItem.id
                                      ? "#1877F2"
                                      : "#555555",
                                  textTransform: "none",
                                  whiteSpace: "nowrap",
                                  overflow: "hidden",
                                  textOverflow: "ellipsis",
                                },
                              }}
                              primary={subItem.title}
                            />
                          )}
                        </ListItemButton>
                      </ListItem>
                    ))}
                  </List>
                </Collapse>
              )}
            </Box>
          ))}
        </List>
      )}

      <Button
        sx={{
          position: "absolute",
          bottom: "10px",
          left: collapsed ? "20px" : "30px",
          right: "20px",
          backgroundColor: "transparent",
          color: "#666666",
          fontSize: "13px",
          fontFamily: "Arial, sans-serif",
          fontWeight: "500",
          textTransform: "none",
          padding: collapsed ? "8px" : "8px 12px",
          justifyContent: "flex-start",
          minWidth: "auto",
          textAlign: "left",
          borderRadius: "6px",
          transition: "all 0.2s ease",
          "&:hover": {
            backgroundColor: "#E8F4FD",
            color: "#1877F2",
          },
        }}
        onClick={handleCollapse}
        startIcon={
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              justifyContent: "center",
              padding: "6px",
              borderRadius: "4px",
              transition: "all 0.2s ease",
              marginRight: "8px",
              "&:hover": {
                backgroundColor: "rgba(24, 119, 242, 0.1)",
              },
            }}
          >
            {collapsed ? (
              <TbLayoutSidebarRightCollapse size={18} />
            ) : (
              <TbLayoutSidebarLeftCollapse size={18} />
            )}
          </Box>
        }
      >
        {!collapsed && "Collapse"}
      </Button>
    </Box>
  );
};

export default function Nav({ openNav, onCloseNav, collapsed, setCollapsed }) {
  const upLg = useResponsive("up", "lg");

  return (
    <Box
      component="nav"
      sx={{
        flexShrink: { lg: 0 },
        width: { lg: collapsed ? 80 : NAV.WIDTH },
        transition: "width 0.3s ease",
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
              transition: "width 0.3s ease",
            },
          }}
        >
          <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
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
          <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
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
