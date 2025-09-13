import React, { useState } from 'react';
import { 
  Container, 
  Typography, 
  Box, 
  Paper, 
  Grid, 
  Card, 
  CardContent, 
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Alert,
  Snackbar
} from '@mui/material';
import { 
  AttachMoney, 
  Add, 
  CheckCircle, 
  Assessment,
  RequestPage,
  Save
} from '@mui/icons-material';

const PettyCashRequestPage = () => {
  const [requestData, setRequestData] = useState({
    amount: '',
    purpose: '',
    department: '',
    priority: 'Medium',
    category: '',
    expectedDate: ''
  });

  const [requests, setRequests] = useState([
    {
      id: 'PC001',
      amount: 150,
      purpose: 'Office supplies',
      department: 'Finance',
      date: '2024-01-15',
      status: 'Approved',
      priority: 'Low',
      category: 'Office Supplies'
    },
    {
      id: 'PC002',
      amount: 300,
      purpose: 'Team lunch',
      department: 'HR',
      date: '2024-01-14',
      status: 'Pending',
      priority: 'Medium',
      category: 'Meals'
    },
    {
      id: 'PC003',
      amount: 500,
      purpose: 'Emergency repairs',
      department: 'Operations',
      date: '2024-01-13',
      status: 'Rejected',
      priority: 'High',
      category: 'Maintenance'
    }
  ]);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success'
  });

  const handleInputChange = (field) => (event) => {
    setRequestData({
      ...requestData,
      [field]: event.target.value
    });
  };

  const handleSubmit = () => {
    if (!requestData.amount || !requestData.purpose || !requestData.department) {
      setSnackbar({
        open: true,
        message: 'Please fill in all required fields',
        severity: 'error'
      });
      return;
    }

    const newRequest = {
      id: `PC${String(requests.length + 1).padStart(3, '0')}`,
      amount: parseFloat(requestData.amount),
      purpose: requestData.purpose,
      department: requestData.department,
      date: new Date().toISOString().split('T')[0],
      status: 'Pending',
      priority: requestData.priority,
      category: requestData.category
    };

    setRequests([newRequest, ...requests]);
    setRequestData({
      amount: '',
      purpose: '',
      department: '',
      priority: 'Medium',
      category: '',
      expectedDate: ''
    });

    setSnackbar({
      open: true,
      message: 'Petty cash request submitted successfully!',
      severity: 'success'
    });
  };

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

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High':
        return 'error';
      case 'Medium':
        return 'warning';
      case 'Low':
        return 'success';
      default:
        return 'default';
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Request Petty Cash
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Submit new petty cash requests and track their status
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <RequestPage color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">New Petty Cash Request</Typography>
              </Box>
              
              <Box sx={{ mb: 2 }}>
                <TextField
                  fullWidth
                  label="Amount *"
                  type="number"
                  value={requestData.amount}
                  onChange={handleInputChange('amount')}
                  sx={{ mb: 2 }}
                  inputProps={{ min: 0, step: 0.01 }}
                />
                
                <TextField
                  fullWidth
                  label="Purpose *"
                  multiline
                  rows={3}
                  value={requestData.purpose}
                  onChange={handleInputChange('purpose')}
                  sx={{ mb: 2 }}
                  placeholder="Describe the purpose of this petty cash request..."
                />
                
                <TextField
                  fullWidth
                  label="Department *"
                  value={requestData.department}
                  onChange={handleInputChange('department')}
                  sx={{ mb: 2 }}
                />
                
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={requestData.category}
                    onChange={handleInputChange('category')}
                    label="Category"
                  >
                    <MenuItem value="Office Supplies">Office Supplies</MenuItem>
                    <MenuItem value="Meals">Meals & Entertainment</MenuItem>
                    <MenuItem value="Transportation">Transportation</MenuItem>
                    <MenuItem value="Maintenance">Maintenance</MenuItem>
                    <MenuItem value="Utilities">Utilities</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                  </Select>
                </FormControl>
                
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Priority</InputLabel>
                  <Select
                    value={requestData.priority}
                    onChange={handleInputChange('priority')}
                    label="Priority"
                  >
                    <MenuItem value="Low">Low</MenuItem>
                    <MenuItem value="Medium">Medium</MenuItem>
                    <MenuItem value="High">High</MenuItem>
                  </Select>
                </FormControl>
                
                <TextField
                  fullWidth
                  label="Expected Date"
                  type="date"
                  value={requestData.expectedDate}
                  onChange={handleInputChange('expectedDate')}
                  InputLabelProps={{ shrink: true }}
                  sx={{ mb: 2 }}
                />
              </Box>
              
              <Button 
                variant="contained" 
                startIcon={<Save />} 
                fullWidth
                onClick={handleSubmit}
                size="large"
              >
                Submit Request
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AttachMoney color="success" sx={{ mr: 1 }} />
                <Typography variant="h6">Quick Stats</Typography>
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="primary">
                      $2,450
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Available Balance
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="h4" color="warning.main">
                      {requests.filter(req => req.status === 'Pending').length}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Pending Requests
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper sx={{ mt: 3 }}>
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
          <Typography variant="h6">My Petty Cash Requests</Typography>
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Request ID</TableCell>
                <TableCell>Amount</TableCell>
                <TableCell>Purpose</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Department</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Priority</TableCell>
                <TableCell>Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {requests.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.id}</TableCell>
                  <TableCell>${row.amount}</TableCell>
                  <TableCell>{row.purpose}</TableCell>
                  <TableCell>{row.category || 'N/A'}</TableCell>
                  <TableCell>{row.department}</TableCell>
                  <TableCell>
                    <Chip 
                      label={row.status} 
                      color={getStatusColor(row.status)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={row.priority} 
                      color={getPriorityColor(row.priority)}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>{row.date}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          sx={{ width: '100%' }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default PettyCashRequestPage;
