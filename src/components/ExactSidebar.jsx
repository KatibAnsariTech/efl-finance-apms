import React, { useState } from 'react';
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
import Logo from "../../public/assets/image1.png";
import EurekaForbes from "../../public/assets/eurekafobesimage2.png";

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
  width: collapsed ? 80 : 280,
  height: '100vh',
  backgroundColor: '#F5F5F5',
  borderRight: '1px dashed #E0E0E0',
  display: 'flex',
  flexDirection: 'column',
  transition: 'width 0.3s ease',
  position: 'fixed',
  left: 0,
  top: 0,
  zIndex: 1000,
}));

const LogoContainer = styled(Box)(({ collapsed }) => ({
  padding: collapsed ? '20px 10px' : '20px 30px',
  textAlign: 'center',
  borderBottom: '1px solid #E0E0E0',
  marginBottom: '20px',
}));


const NavigationList = styled(List)(({ collapsed }) => ({
  padding: collapsed ? '0 8px' : '0 20px',
  flex: 1,
}));

const StyledListItemButton = styled(ListItemButton)(({ theme, active }) => ({
  borderRadius: '8px',
  marginBottom: '4px',
  padding: '12px 16px',
  backgroundColor: active ? '#E3F2FD' : 'transparent',
  // borderLeft: active ? '3px solid #1877F2' : '3px solid transparent',
  '&:hover': {
    backgroundColor: active ? '#E3F2FD' : '#F0F0F0',
  },
  transition: 'all 0.2s ease',
  minHeight: '44px',
}));

const StyledListItemText = styled(ListItemText)(({ active, collapsed }) => ({
  '& .MuiListItemText-primary': {
    fontFamily: 'Arial, sans-serif',
    fontSize: '14px',
    fontWeight: active ? '600' : '400',
    color: active ? '#1877F2' : '#333333',
    textTransform: 'none',
    opacity: collapsed ? 0 : 1,
    transition: 'opacity 0.3s ease',
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
}));

const SubItemButton = styled(ListItemButton)(({ theme, active }) => ({
  borderRadius: '6px',
  marginBottom: '2px',
  padding: '8px 16px 8px 40px',
  backgroundColor: active ? '#E3F2FD' : 'transparent',
  // borderLeft: active ? '2px solid #1877F2' : '2px solid transparent',
  '&:hover': {
    backgroundColor: active ? '#E3F2FD' : '#F0F0F0',
  },
  transition: 'all 0.2s ease',
  minHeight: '36px',
}));

const SubItemText = styled(ListItemText)(({ active }) => ({
  '& .MuiListItemText-primary': {
    fontFamily: 'Arial, sans-serif',
    fontSize: '13px',
    fontWeight: active ? '500' : '400',
    color: active ? '#1877F2' : '#555555',
    textTransform: 'none',
  },
}));

const CollapseButton = styled(Button)(({ theme, collapsed }) => ({
  position: 'absolute',
  bottom: '20px',
  left: collapsed ? '20px' : '30px',
  right: collapsed ? '20px' : '30px',
  backgroundColor: 'transparent',
  color: '#333333',
  fontSize: '14px',
  fontFamily: 'Arial, sans-serif',
  textTransform: 'none',
  padding: '8px 12px',
  justifyContent: 'flex-start',
  minWidth: 'auto',
  '&:hover': {
    backgroundColor: 'transparent',
  },
}));

const IconContainer = styled(Box)(({ theme }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  padding: '4px',
  borderRadius: '4px',
  transition: 'background-color 0.2s ease',
  '&:hover': {
    backgroundColor: '#F0F0F0',
  },
}));

// Navigation items configuration with subitems
const navigationItems = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: <DashboardIcon />,
    path: '/',
    active: true,
    hasSubItems: false,
  },
  {
    id: 'master-data',
    label: 'Master Data',
    icon: <LockIcon />,
    path: '/master',
    active: false,
    hasSubItems: true,
    subItems: [
      { id: 'master-data-1', label: 'Data Management', path: '/master/data' },
      { id: 'master-data-2', label: 'Configuration', path: '/master/config' },
      { id: 'master-data-3', label: 'Settings', path: '/master/settings' },
    ],
  },
  {
    id: 'user-management',
    label: 'User Management',
    icon: <PersonIcon />,
    path: '/usermanagement',
    active: false,
    hasSubItems: true,
    subItems: [
      { id: 'user-management-1', label: 'Users', path: '/usermanagement/users' },
      { id: 'user-management-2', label: 'Roles', path: '/usermanagement/roles' },
      { id: 'user-management-3', label: 'Permissions', path: '/usermanagement/permissions' },
    ],
  },
  {
    id: 'master-sheet',
    label: 'Master Sheet',
    icon: <AssignmentIcon />,
    path: '/master-sheet',
    active: false,
    hasSubItems: true,
    subItems: [
      { id: 'master-sheet-1', label: 'Sheet Templates', path: '/master-sheet/templates' },
      { id: 'master-sheet-2', label: 'Data Import', path: '/master-sheet/import' },
      { id: 'master-sheet-3', label: 'Export', path: '/master-sheet/export' },
    ],
  },
  {
    id: 'h-management',
    label: 'H. Management',
    icon: <AccountTreeIcon />,
    path: '/hierarchy-management',
    active: false,
    hasSubItems: true,
    subItems: [
      { id: 'h-management-1', label: 'Organization', path: '/hierarchy-management/org' },
      { id: 'h-management-2', label: 'Structure', path: '/hierarchy-management/structure' },
      { id: 'h-management-3', label: 'Reports', path: '/hierarchy-management/reports' },
    ],
  },
];

const ExactSidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [expandedItems, setExpandedItems] = useState({});
  const [activeItem, setActiveItem] = useState('dashboard');

  const handleCollapse = () => {
    setCollapsed(!collapsed);
  };

  const handleItemClick = (itemId, hasSubItems) => {
    if (hasSubItems) {
      // If expanding, select the first subitem and close other expanded items
      if (!expandedItems[itemId]) {
        const item = navigationItems.find(navItem => navItem.id === itemId);
        if (item && item.subItems && item.subItems.length > 0) {
          setActiveItem(item.subItems[0].id);
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
  };

  const handleNavigation = (path) => {
    console.log('Navigate to:', path);
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
              // Handle navigation to home
              console.log('Navigate to home');
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
              // Handle navigation to home
              console.log('Navigate to home');
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
                onClick={() => handleItemClick(item.id, item.hasSubItems)}
              >
                <StyledListItemIcon active={activeItem === item.id || (item.hasSubItems && item.subItems.some(subItem => activeItem === subItem.id))} collapsed={collapsed}>
                  {item.icon}
                </StyledListItemIcon>
                {!collapsed && (
                  <>
                    <StyledListItemText
                      primary={item.label}
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
                          primary={subItem.label}
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
              <TbLayoutSidebarRightCollapse size={20} />
            ) : (
              <TbLayoutSidebarLeftCollapse size={20} />
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
