import React from 'react';
import { Box, Typography, Container, Paper } from '@mui/material';
import ExactSidebar from '../components/ExactSidebar';

const ExactSidebarDemo = () => {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Exact Sidebar */}
      <ExactSidebar />
      
    </Box>
  );
};

export default ExactSidebarDemo;
