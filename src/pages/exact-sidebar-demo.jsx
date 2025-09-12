import React from 'react';
import { Box, Typography, Container, Paper } from '@mui/material';
import ExactSidebar from '../components/ExactSidebar';

const ExactSidebarDemo = () => {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Exact Sidebar */}
      <ExactSidebar />
      
      {/* Main Content Area */}
      <Box
        sx={{
          flex: 1,
          marginLeft: '280px', // Adjust based on sidebar width
          padding: '20px',
          backgroundColor: '#fafafa',
        }}
      >
        <Container maxWidth="lg">
          <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h4" gutterBottom color="primary">
              Exact Sidebar Design Demo
            </Typography>
            <Typography variant="body1" paragraph>
              This sidebar matches the design exactly with all the features you requested:
            </Typography>
          </Paper>

          <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              ✅ Exact Design Features:
            </Typography>
            <Box component="ul" sx={{ pl: 2, mb: 2 }}>
              <li><strong>EUREKA FORBES Logo:</strong> Blue cross icon + company name</li>
              <li><strong>Credit Deviation Request:</strong> Subtitle below logo</li>
              <li><strong>Exact Colors:</strong> #F5F5F5 background, #1877F2 blue, #666666 grey</li>
              <li><strong>Active State:</strong> Light blue background with left border</li>
              <li><strong>Icons:</strong> Dashboard, Lock, Person, Assignment, AccountTree</li>
              <li><strong>Collapse Button:</strong> Bottom left with arrow icon</li>
            </Box>
          </Paper>

          <Paper elevation={1} sx={{ p: 3, mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              ✅ Expandable Menu Features:
            </Typography>
            <Box component="ul" sx={{ pl: 2, mb: 2 }}>
              <li><strong>Arrow Icons:</strong> Right-pointing arrows that rotate when expanded</li>
              <li><strong>Subitems:</strong> Indented submenu items with proper styling</li>
              <li><strong>Click to Expand:</strong> Click any menu item with arrow to expand/collapse</li>
              <li><strong>Smooth Animation:</strong> Collapse/expand with smooth transitions</li>
              <li><strong>Active States:</strong> Both main items and subitems can be active</li>
            </Box>
          </Paper>

          <Paper elevation={1} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              🎯 How to Test:
            </Typography>
            <Box component="ol" sx={{ pl: 2 }}>
              <li>Click on "Master Data", "User Management", "Master Sheet", or "H. Management" to see the expandable submenus</li>
              <li>Notice the arrow icons rotate when expanded</li>
              <li>Click on subitems to see them become active</li>
              <li>Click the "Collapse" button at the bottom to toggle sidebar width</li>
              <li>Dashboard is currently active (blue background with left border)</li>
            </Box>
          </Paper>
        </Container>
      </Box>
    </Box>
  );
};

export default ExactSidebarDemo;
