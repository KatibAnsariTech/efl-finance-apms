import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Chip,
  TextField,
  InputAdornment,
  IconButton
} from '@mui/material';
import { Search, Visibility } from '@mui/icons-material';

const JVStatusPage = () => {
  const [searchTerm, setSearchTerm] = useState('');

  // Mock data for demonstration
  const jvData = [
    {
      id: 'JV001',
      description: 'Office Supplies Purchase',
      amount: 1500.00,
      status: 'Approved',
      date: '2024-01-15',
      department: 'Finance'
    },
    {
      id: 'JV002',
      description: 'Equipment Maintenance',
      amount: 3200.00,
      status: 'Pending',
      date: '2024-01-14',
      department: 'Operations'
    },
    {
      id: 'JV003',
      description: 'Travel Expenses',
      amount: 800.00,
      status: 'Rejected',
      date: '2024-01-13',
      department: 'HR'
    },
    {
      id: 'JV004',
      description: 'Software License',
      amount: 5000.00,
      status: 'Approved',
      date: '2024-01-12',
      department: 'IT'
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case 'Approved':
        return 'success';
      case 'Pending':
        return 'warning';
      case 'Rejected':
        return 'error';
      default:
        return 'default';
    }
  };

  const filteredData = jvData.filter(item =>
    item.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          JV Status
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Track the status of your journal vouchers
        </Typography>
      </Box>

      <Paper sx={{ p: 3, mb: 3 }}>
        <TextField
          fullWidth
          placeholder="Search JVs by ID, description, or department..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />
      </Paper>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>JV ID</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Department</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredData.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.id}</TableCell>
                <TableCell>{row.description}</TableCell>
                <TableCell>${row.amount.toLocaleString()}</TableCell>
                <TableCell>
                  <Chip 
                    label={row.status} 
                    color={getStatusColor(row.status)}
                    size="small"
                  />
                </TableCell>
                <TableCell>{row.date}</TableCell>
                <TableCell>{row.department}</TableCell>
                <TableCell>
                  <IconButton size="small">
                    <Visibility />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Container>
  );
};

export default JVStatusPage;
