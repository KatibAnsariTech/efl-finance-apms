import React, { useState, useEffect } from 'react';
import {
  Box,
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
import { styled } from '@mui/material/styles';
import { 
  TbLayoutSidebarLeftCollapse,
  TbLayoutSidebarRightCollapse,
  TbChevronDown,
  TbChevronRight
} from 'react-icons/tb';
import { useRouter } from 'src/routes/hooks';
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

// Styled components
const SidebarContainer = styled(Box)(({ theme, collapsed }) => ({
  width: '100%',
  height: '100vh',
  backgroundColor: '#F5F5F5',
  display: 'flex',
  flexDirection: 'column',
  transition: 'all 0.3s ease',
}));

const LogoContainer = styled(Box)(({ collapsed }) => ({
  padding: collapsed ? '0' : '0',
  textAlign: 'center',
  borderBottom: '1px solid #E0E0E0',
  marginBottom: '0',
}));


const NavigationList = styled(List)(({ collapsed }) => ({
  padding: collapsed ? '0 8px' : '0 20px',
  flex: 1,
  marginTop: '20px',
  overflow: 'hidden',
}));

const StyledListItemButton = styled(ListItemButton)(({ theme, active }) => ({
  borderRadius: '8px',
  marginBottom: '4px',
  padding: '8px 16px',
  backgroundColor: active ? '#E3F2FD' : 'transparent',
  // borderLeft: active ? '3px solid #1877F2' : '3px solid transparent',
  '&:hover': {
    backgroundColor: active ? '#E3F2FD' : '#F0F0F0',
  },
  transition: 'all 0.2s ease',
  minHeight: '36px',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
}));

const StyledListItemText = styled(ListItemText)(({ active, collapsed }) => ({
  display: 'flex',
  alignItems: 'center',
  position: 'relative',
  flex: 1,
  minWidth: 0,
  '& .MuiListItemText-primary': {
    fontFamily: 'Arial, sans-serif',
    fontSize: '14px',
    fontWeight: active ? '600' : '400',
    color: active ? '#1877F2' : '#333333',
    textTransform: 'none',
    opacity: collapsed ? 0 : 1,
    transition: 'opacity 0.3s ease',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
}));

const StyledListItemIcon = styled(ListItemIcon)(({ active, collapsed }) => ({
  minWidth: collapsed ? 'auto' : '24px',
  color: active ? '#1877F2' : '#666666',
  display: 'flex',
  justifyContent: 'center',
  marginRight: collapsed ? 0 : '12px',
}));

const ArrowIcon = styled(Box)(({ expanded, collapsed, active }) => ({
  color: active ? '#1877F2' : '#666666',
  opacity: collapsed ? 0 : 1,
  transition: 'all 0.2s ease',
  fontSize: '20px',
  flexShrink: 0,
  marginLeft: '8px',
}));

const SubItemButton = styled(ListItemButton)(({ theme, active }) => ({
  borderRadius: '6px',
  marginBottom: '2px',
  padding: '6px 16px 6px 40px',
  backgroundColor: active ? '#E3F2FD' : 'transparent',
  // borderLeft: active ? '2px solid #1877F2' : '2px solid transparent',
  '&:hover': {
    backgroundColor: active ? '#E3F2FD' : '#F0F0F0',
  },
  transition: 'all 0.2s ease',
  minHeight: '30px',
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
}));

const SubItemText = styled(ListItemText)(({ active }) => ({
  display: 'flex',
  alignItems: 'center',
  position: 'relative',
  flex: 1,
  minWidth: 0,
  '& .MuiListItemText-primary': {
    fontFamily: 'Arial, sans-serif',
    fontSize: '13px',
    fontWeight: active ? '500' : '400',
    color: active ? '#1877F2' : '#555555',
    textTransform: 'none',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
}));

const CollapseButton = styled(Button)(({ theme, collapsed }) => ({
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
}));

const IconContainer = styled(Box)(({ theme }) => ({
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
}));

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

const ExactSidebar = ({ collapsed: externalCollapsed, setCollapsed: setExternalCollapsed }) => {
  const [internalCollapsed, setInternalCollapsed] = useState(false);
  const [expandedItems, setExpandedItems] = useState({});
  const [activeItem, setActiveItem] = useState('dashboard');
  const [navigationItems, setNavigationItems] = useState([]);
  const router = useRouter();

  // Use external collapsed state if provided, otherwise use internal state
  const collapsed = externalCollapsed !== undefined ? externalCollapsed : internalCollapsed;
  const setCollapsed = setExternalCollapsed || setInternalCollapsed;

  // Filter navigation items based on user role
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    const userRole = user?.userType || "REQUESTER";
    const filteredNav = filterNavigationByRole(navConfig, userRole);
    setNavigationItems(filteredNav);
    
    // Set the first available item as active if current active item is not available
    if (filteredNav.length > 0) {
      const firstItem = filteredNav[0];
      if (firstItem.hasSubItems && firstItem.subItems.length > 0) {
        setActiveItem(firstItem.subItems[0].id);
      } else {
        setActiveItem(firstItem.id);
      }
    }
  }, []);

  const handleCollapse = () => {
    setCollapsed(!collapsed);
  };

  const handleItemClick = (itemId, hasSubItems, path) => {
    if (hasSubItems) {
      // If expanding, select the first subitem and close other expanded items
      if (!expandedItems[itemId]) {
        const item = navigationItems.find(navItem => navItem.id === itemId);
        if (item && item.subItems && item.subItems.length > 0) {
          setActiveItem(item.subItems[0].id);
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
      setActiveItem(itemId);
      // Close all expanded items when selecting a main item
      setExpandedItems({});
      // Navigate to the item's path
      handleNavigation(path);
    }
  };

  const handleSubItemClick = (subItemId, parentId) => {
    setActiveItem(subItemId);
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
    <SidebarContainer collapsed={collapsed}>
      {/* Logo Section */}
      <LogoContainer collapsed={collapsed}>
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
      </LogoContainer>

      {/* Navigation Items */}
      <NavigationList collapsed={collapsed}>
        {navigationItems.map((item) => (
          <React.Fragment key={item.id}>
            <ListItem disablePadding>
              <StyledListItemButton
                active={activeItem === item.id || (item.hasSubItems && item.subItems.some(subItem => activeItem === subItem.id))}
                onClick={() => handleItemClick(item.id, item.hasSubItems, item.path)}
              >
                <StyledListItemIcon active={activeItem === item.id || (item.hasSubItems && item.subItems.some(subItem => activeItem === subItem.id))} collapsed={collapsed}>
                  {item.icon}
                </StyledListItemIcon>
                {!collapsed && (
                  <>
                    <StyledListItemText
                      primary={item.title}
                      active={activeItem === item.id || (item.hasSubItems && item.subItems.some(subItem => activeItem === subItem.id))}
                      collapsed={collapsed}
                    />
                    {item.hasSubItems && (
                      <ArrowIcon 
                        expanded={expandedItems[item.id]} 
                        collapsed={collapsed}
                        active={activeItem === item.id || (item.hasSubItems && item.subItems.some(subItem => activeItem === subItem.id))}
                      >
                        {expandedItems[item.id] ? (
                          <ArrowDropUpIcon sx={{ fontSize: 20 }} />
                        ) : (
                          <ArrowDropDownIcon sx={{ fontSize: 20 }} />
                        )}
                      </ArrowIcon>
                    )}
                  </>
                )}
              </StyledListItemButton>
            </ListItem>

            {/* Sub Items */}
            {item.hasSubItems && !collapsed && (
              <Collapse in={expandedItems[item.id]} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {item.subItems.map((subItem) => (
                    <ListItem key={subItem.id} disablePadding>
                      <SubItemButton
                        active={activeItem === subItem.id}
                        onClick={() => handleSubItemClick(subItem.id, item.id)}
                      >
                        <SubItemText
                          primary={subItem.title}
                          active={activeItem === subItem.id}
                        />
                      </SubItemButton>
                    </ListItem>
                  ))}
                </List>
              </Collapse>
            )}
          </React.Fragment>
        ))}
      </NavigationList>

      {/* Collapse Button */}
      <CollapseButton
        onClick={handleCollapse}
        collapsed={collapsed}
        startIcon={
          <IconContainer>
            {collapsed ? (
              <TbLayoutSidebarRightCollapse size={18} />
            ) : (
              <TbLayoutSidebarLeftCollapse size={18} />
            )}
          </IconContainer>
        }
      >
        {!collapsed && 'Collapse'}
      </CollapseButton>
    </SidebarContainer>
  );
};

export default ExactSidebar;
