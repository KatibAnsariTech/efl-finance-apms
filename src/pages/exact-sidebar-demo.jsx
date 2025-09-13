import React, { useState, useEffect } from 'react';
import { Box, Typography, Container, Paper, Button, Stack, Chip } from '@mui/material';
import ExactSidebar from '../layouts/dashboard/Sidebar';

const ExactSidebarDemo = () => {
  const [currentUser, setCurrentUser] = useState(null);
  const [currentRole, setCurrentRole] = useState('REQUESTER');

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    setCurrentUser(user);
    setCurrentRole(user?.userType || "REQUESTER");
  }, []);

  const simulateRoleChange = (role) => {
    const mockUser = {
      ...currentUser,
      userType: role
    };
    localStorage.setItem("user", JSON.stringify(mockUser));
    setCurrentUser(mockUser);
    setCurrentRole(role);
    // Reload the page to apply the new role
    window.location.reload();
  };

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Exact Sidebar */}
      <ExactSidebar />
      
      {/* Main Content Area */}
      <Box sx={{ flex: 1, p: 3, ml: '220px' }}>
        <Container maxWidth="lg">
          <Paper sx={{ p: 3, mb: 3 }}>
            <Typography variant="h4" gutterBottom>
              ExactSidebar Role-Based Demo
            </Typography>
            
            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Current User Role: 
                <Chip 
                  label={currentRole} 
                  color="primary" 
                  sx={{ ml: 1 }} 
                />
              </Typography>
              
              {currentUser && (
                <Typography variant="body2" color="text.secondary">
                  User: {currentUser.username || currentUser.email || 'Unknown'}
                </Typography>
              )}
            </Box>

            <Typography variant="h6" gutterBottom>
              Test Different Roles:
            </Typography>
            
            <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
              <Button 
                variant={currentRole === 'REQUESTER' ? 'contained' : 'outlined'}
                onClick={() => simulateRoleChange('REQUESTER')}
              >
                REQUESTER
              </Button>
              <Button 
                variant={currentRole === 'APPROVER' ? 'contained' : 'outlined'}
                onClick={() => simulateRoleChange('APPROVER')}
              >
                APPROVER
              </Button>
              <Button 
                variant={currentRole === 'ADMIN' ? 'contained' : 'outlined'}
                onClick={() => simulateRoleChange('ADMIN')}
              >
                ADMIN
              </Button>
              <Button 
                variant={currentRole === 'SUPER_ADMIN' ? 'contained' : 'outlined'}
                onClick={() => simulateRoleChange('SUPER_ADMIN')}
              >
                SUPER_ADMIN
              </Button>
            </Stack>

            <Typography variant="body1" color="text.secondary">
              The sidebar will show different navigation items based on the selected role. 
              Try switching between roles to see how the navigation changes.
            </Typography>
          </Paper>
        </Container>
      </Box>
    </Box>
  );
};

export default ExactSidebarDemo;
