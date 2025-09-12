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
  Tabs,
  Tab
} from '@mui/material';
import { 
  AttachMoney, 
  Add, 
  CheckCircle, 
  Assessment,
  RequestPage,
  Approval
} from '@mui/icons-material';

const PettyCashPage = () => {
  const [selectedTab, setSelectedTab] = useState(0);
  const [requestData, setRequestData] = useState({
    amount: '',
    purpose: '',
    department: '',
    priority: 'Medium'
  });

  const [requests] = useState([
    {
      id: 'PC001',
      amount: 150,
      purpose: 'Office supplies',
      department: 'Finance',
      date: '2024-01-15',
      status: 'Approved',
      priority: 'Low'
    },
    {
      id: 'PC002',
      amount: 300,
      purpose: 'Team lunch',
      department: 'HR',
      date: '2024-01-14',
      status: 'Pending',
      priority: 'Medium'
    },
    {
      id: 'PC003',
      amount: 500,
      purpose: 'Emergency repairs',
      department: 'Operations',
      date: '2024-01-13',
      status: 'Rejected',
      priority: 'High'
    }
  ]);

  const handleInputChange = (field) => (event) => {
    setRequestData({
      ...requestData,
      [field]: event.target.value
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

  const TabPanel = ({ children, value, index }) => (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Petty Cash Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Request, approve, and track petty cash transactions
        </Typography>
      </Box>

      <Paper sx={{ mb: 3 }}>
        <Tabs value={selectedTab} onChange={(e, newValue) => setSelectedTab(newValue)}>
          <Tab icon={<RequestPage />} label="Request Petty Cash" />
          <Tab icon={<Approval />} label="Approve Petty Cash" />
          <Tab icon={<Assessment />} label="Petty Cash Reports" />
        </Tabs>
      </Paper>

      <TabPanel value={selectedTab} index={0}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Card>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  <Add color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">New Request</Typography>
                </Box>
                <Box sx={{ mb: 2 }}>
                  <TextField
                    fullWidth
                    label="Amount"
                    type="number"
                    value={requestData.amount}
                    onChange={handleInputChange('amount')}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="Purpose"
                    multiline
                    rows={3}
                    value={requestData.purpose}
                    onChange={handleInputChange('purpose')}
                    sx={{ mb: 2 }}
                  />
                  <TextField
                    fullWidth
                    label="Department"
                    value={requestData.department}
                    onChange={handleInputChange('department')}
                    sx={{ mb: 2 }}
                  />
                  <FormControl fullWidth>
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
                </Box>
                <Button variant="contained" startIcon={<Add />} fullWidth>
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
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" color="primary">
                    $2,450
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Total Available
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </TabPanel>

      <TabPanel value={selectedTab} index={1}>
        <Paper>
          <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
            <Typography variant="h6">Pending Approvals</Typography>
          </Box>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Request ID</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Purpose</TableCell>
                  <TableCell>Department</TableCell>
                  <TableCell>Priority</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {requests.filter(req => req.status === 'Pending').map((row) => (
                  <TableRow key={row.id}>
                    <TableCell>{row.id}</TableCell>
                    <TableCell>${row.amount}</TableCell>
                    <TableCell>{row.purpose}</TableCell>
                    <TableCell>{row.department}</TableCell>
                    <TableCell>
                      <Chip 
                        label={row.priority} 
                        color={getPriorityColor(row.priority)}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>{row.date}</TableCell>
                    <TableCell>
                      <Button size="small" color="success" startIcon={<CheckCircle />}>
                        Approve
                      </Button>
                      <Button size="small" color="error">
                        Reject
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>
      </TabPanel>

      <TabPanel value={selectedTab} index={2}>
        <Paper>
          <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
            <Typography variant="h6">All Petty Cash Requests</Typography>
          </Box>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Request ID</TableCell>
                  <TableCell>Amount</TableCell>
                  <TableCell>Purpose</TableCell>
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
      </TabPanel>
    </Container>
  );
};

export default PettyCashPage;
