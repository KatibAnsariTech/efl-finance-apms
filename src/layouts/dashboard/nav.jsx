import React, { useState, useEffect } from 'react';
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
} from '@mui/material';
import { 
  TbLayoutSidebarLeftCollapse,
  TbLayoutSidebarRightCollapse,
  TbChevronDown,
  TbChevronRight
} from 'react-icons/tb';
import { useRouter } from 'src/routes/hooks';
import { usePathname } from 'src/routes/hooks';
import { useResponsive } from "src/hooks/use-responsive";

import { NAV } from "./config-layout";
import Logo from "../../../public/assets/image1.png";
import EurekaForbes from "../../../public/assets/eurekafobesimage2.png";
import navConfig from './config-navigation';

// Icons for navigation items
import DashboardIcon from '@mui/icons-material/Dashboard';
import LockIcon from '@mui/icons-material/Lock';
import PersonIcon from '@mui/icons-material/Person';
import AssignmentIcon from '@mui/icons-material/Assignment';
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import ArrowDropUpIcon from '@mui/icons-material/ArrowDropUp';


// Helper function to filter navigation items based on user role
const filterNavigationByRole = (config, userRole) => {
  return config.filter(item => {
    // Check if user role is in the item's allowed roles
    const hasAccess = !item.roles || item.roles.includes(userRole);
    
    if (hasAccess && item.hasSubItems && item.subItems) {
      // Filter subitems based on role as well
      const filteredSubItems = item.subItems.filter(subItem => 
        !subItem.roles || subItem.roles.includes(userRole)
      );
      
      // Return the item with filtered subitems
      return {
        ...item,
        subItems: filteredSubItems
      };
    }
    
    return hasAccess;
  });
};

// Helper function to determine active item based on current pathname
const getActiveItemFromPath = (pathname, navigationItems) => {
  // First check for exact matches with subitems
  for (const item of navigationItems) {
    if (item.hasSubItems && item.subItems) {
      for (const subItem of item.subItems) {
        if (pathname === subItem.path) {
          return subItem.id;
        }
      }
    }
    // Check for exact match with main item
    if (pathname === item.path) {
      return item.id;
    }
  }
  
  // Check for partial matches (e.g., /jvm should match /jvm/overview)
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
  
  // Default to first available item if no match found
  if (navigationItems.length > 0) {
    const firstItem = navigationItems[0];
    if (firstItem.hasSubItems && firstItem.subItems.length > 0) {
      return firstItem.subItems[0].id;
    }
    return firstItem.id;
  }
  
  return 'dashboard';
};

const ExactSidebar = ({ collapsed: externalCollapsed, setCollapsed: setExternalCollapsed }) => {
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const [expandedItems, setExpandedItems] = useState({});
  const [navigationItems, setNavigationItems] = useState([]);
  const router = useRouter();
  const pathname = usePathname();

  // Use external collapsed state if provided, otherwise use internal state
  const collapsed = externalCollapsed !== undefined ? externalCollapsed : internalCollapsed;
  const setCollapsed = setExternalCollapsed || setInternalCollapsed;

  // Compute active item based on current pathname
  const activeItem = getActiveItemFromPath(pathname, navigationItems);

  // Filter navigation items based on user role
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const userRole = user?.userType || "REQUESTER";
    const filteredNav = filterNavigationByRole(navConfig, userRole);
    setNavigationItems(filteredNav);
  }, []);

  // Update expanded items when active item changes
  useEffect(() => {
    if (navigationItems.length > 0) {
      const newExpandedItems = {};
      
      // Find which parent item contains the active subitem
      for (const item of navigationItems) {
        if (item.hasSubItems && item.subItems) {
          const hasActiveSubItem = item.subItems.some(subItem => subItem.id === activeItem);
          if (hasActiveSubItem) {
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
      // If expanding, select the first subitem and close other expanded items
      if (!expandedItems[itemId]) {
        const item = navigationItems.find(navItem => navItem.id === itemId);
        if (item && item.subItems && item.subItems.length > 0) {
          // Navigate to the first subitem's path
          handleNavigation(item.subItems[0].path);
        }
        // Close all other expanded items
        setExpandedItems(prev => {
          const newExpandedItems = {};
          newExpandedItems[itemId] = true;
          return newExpandedItems;
        });
      } else {
        // If collapsing, just close this item
        setExpandedItems(prev => ({
          ...prev,
          [itemId]: false
        }));
      }
    } else {
      // Close all expanded items when selecting a main item
      setExpandedItems({});
      // Navigate to the item's path
      handleNavigation(path);
    }
  };

  const handleSubItemClick = (subItemId, parentId) => {
    // Close all other expanded items and expand only the current parent
    setExpandedItems(prev => {
      const newExpandedItems = {};
      newExpandedItems[parentId] = true;
      return newExpandedItems;
    });
    
    // Find and navigate to the subitem's path
    const parentItem = navigationItems.find(navItem => navItem.id === parentId);
    if (parentItem && parentItem.subItems) {
      const subItem = parentItem.subItems.find(sub => sub.id === subItemId);
      if (subItem) {
        handleNavigation(subItem.path);
      }
    }
  };

  const handleNavigation = (path) => {
    // Use router for navigation
    router.push(path);
  };

  return (
    <Box
      sx={{
        width: '100%',
        height: '100vh',
        backgroundColor: '#F5F5F5',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s ease',
      }}
    >
      {/* Logo Section */}
      <Box
        sx={{
          padding: 0,
          textAlign: 'center',
          marginBottom: 0,
        }}
      >
        {collapsed ? (
          <img
            src={EurekaForbes}
            alt="Eurekforbes"
            style={{
              width: "64%",
              marginTop: "32px",
              marginLeft: "10px",
              marginBottom: "9px",
              cursor: "pointer",
            }}
            onClick={() => {
              handleNavigation('/');
            }}
          />
        ) : (
          <img
            src={Logo}
            alt="Description of your image"
            style={{
              width: "60%",
              marginTop: "20px",
              marginLeft: "25px",
              cursor: "pointer",
            }}
            onClick={() => {
              handleNavigation('/');
            }}
          />
        )}
      </Box>

      {/* Navigation Items */}
      <List
        sx={{
          padding: collapsed ? '0 8px' : '0 20px',
          flex: 1,
          marginTop: '20px',
          overflow: 'auto',
          maxHeight: 'calc(100vh - 180px)',
          paddingBottom: 2,
          '&::-webkit-scrollbar': {
            width: '6px',
          },
          '&::-webkit-scrollbar-track': {
            background: 'transparent',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#c1c1c1',
            borderRadius: '3px',
            '&:hover': {
              background: '#a8a8a8',
            },
          },
        }}
      >
        {navigationItems.map((item) => (
          <React.Fragment key={item.id}>
            <ListItem disablePadding>
              <ListItemButton
                sx={{
                  borderRadius: '8px',
                  marginBottom: '4px',
                  padding: '8px 16px',
                  backgroundColor: (activeItem === item.id || (item.hasSubItems && item.subItems.some(subItem => activeItem === subItem.id))) ? '#E3F2FD' : 'transparent',
                  '&:hover': {
                    backgroundColor: (activeItem === item.id || (item.hasSubItems && item.subItems.some(subItem => activeItem === subItem.id))) ? '#E3F2FD' : '#F0F0F0',
                  },
                  transition: 'all 0.2s ease',
                  minHeight: '36px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                }}
                onClick={() => handleItemClick(item.id, item.hasSubItems, item.path)}
              >
                <ListItemIcon
                  sx={{
                    minWidth: collapsed ? 'auto' : '24px',
                    color: (activeItem === item.id || (item.hasSubItems && item.subItems.some(subItem => activeItem === subItem.id))) ? '#1877F2' : '#666666',
                    display: 'flex',
                    justifyContent: 'center',
                    marginRight: collapsed ? 0 : '12px',
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                {!collapsed && (
                  <>
                    <ListItemText
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        position: 'relative',
                        flex: 1,
                        minWidth: 0,
                        '& .MuiListItemText-primary': {
                          fontFamily: 'Arial, sans-serif',
                          fontSize: '14px',
                          fontWeight: (activeItem === item.id || (item.hasSubItems && item.subItems.some(subItem => activeItem === subItem.id))) ? '600' : '400',
                          color: (activeItem === item.id || (item.hasSubItems && item.subItems.some(subItem => activeItem === subItem.id))) ? '#1877F2' : '#333333',
                          textTransform: 'none',
                          opacity: collapsed ? 0 : 1,
                          transition: 'opacity 0.3s ease',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        },
                      }}
                      primary={item.title}
                    />
                    {item.hasSubItems && (
                      <Box
                        sx={{
                          color: (activeItem === item.id || (item.hasSubItems && item.subItems.some(subItem => activeItem === subItem.id))) ? '#1877F2' : '#666666',
                          opacity: collapsed ? 0 : 1,
                          transition: 'all 0.2s ease',
                          fontSize: '20px',
                          flexShrink: 0,
                          marginLeft: '8px',
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

            {/* Sub Items */}
            {item.hasSubItems && !collapsed && (
              <Collapse in={expandedItems[item.id]} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {item.subItems.map((subItem) => (
                    <ListItem key={subItem.id} disablePadding>
                      <ListItemButton
                        sx={{
                          borderRadius: '6px',
                          marginBottom: '2px',
                          padding: '6px 16px 6px 40px',
                          backgroundColor: activeItem === subItem.id ? '#E3F2FD' : 'transparent',
                          '&:hover': {
                            backgroundColor: activeItem === subItem.id ? '#E3F2FD' : '#F0F0F0',
                          },
                          transition: 'all 0.2s ease',
                          minHeight: '30px',
                          whiteSpace: 'nowrap',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                        }}
                        onClick={() => handleSubItemClick(subItem.id, item.id)}
                      >
                        <ListItemText
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            position: 'relative',
                            flex: 1,
                            minWidth: 0,
                            '& .MuiListItemText-primary': {
                              fontFamily: 'Arial, sans-serif',
                              fontSize: '13px',
                              fontWeight: activeItem === subItem.id ? '500' : '400',
                              color: activeItem === subItem.id ? '#1877F2' : '#555555',
                              textTransform: 'none',
                              whiteSpace: 'nowrap',
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                            },
                          }}
                          primary={subItem.title}
                        />
                      </ListItemButton>
                    </ListItem>
                  ))}
                </List>
              </Collapse>
            )}
          </React.Fragment>
        ))}
      </List>

      {/* Collapse Button */}
      <Button
        sx={{
          position: 'absolute',
          bottom: '20px',
          left: collapsed ? '20px' : '30px',
          right: '20px',
          backgroundColor: 'transparent',
          color: '#666666',
          fontSize: '13px',
          fontFamily: 'Arial, sans-serif',
          fontWeight: '500',
          textTransform: 'none',
          padding: collapsed ? '8px' : '8px 12px',
          justifyContent: 'flex-start',
          minWidth: 'auto',
          textAlign: 'left',
          borderRadius: '6px',
          transition: 'all 0.2s ease',
          '&:hover': {
            backgroundColor: '#E8F4FD',
            color: '#1877F2',
          },
        }}
        onClick={handleCollapse}
        startIcon={
          <Box
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '6px',
              borderRadius: '4px',
              transition: 'all 0.2s ease',
              marginRight: '8px',
              '&:hover': {
                backgroundColor: 'rgba(24, 119, 242, 0.1)',
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
        {!collapsed && 'Collapse'}
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