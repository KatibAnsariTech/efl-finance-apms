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
  TableRow
} from '@mui/material';
import { 
  AccountBalance, 
  Calculate, 
  Payment,
  Add,
  Edit,
  Delete
} from '@mui/icons-material';

const CustomDutyPage = () => {
  const [selectedTab, setSelectedTab] = useState('calculate');
  const [dutyData, setDutyData] = useState({
    itemValue: '',
    dutyRate: '',
    currency: 'USD',
    itemType: '',
    country: ''
  });

  const [dutyHistory] = useState([
    {
      id: 'CD001',
      itemValue: 5000,
      dutyRate: 10,
      dutyAmount: 500,
      currency: 'USD',
      date: '2024-01-15',
      status: 'Paid'
    },
    {
      id: 'CD002',
      itemValue: 3200,
      dutyRate: 15,
      dutyAmount: 480,
      currency: 'USD',
      date: '2024-01-14',
      status: 'Pending'
    }
  ]);

  const handleInputChange = (field) => (event) => {
    setDutyData({
      ...dutyData,
      [field]: event.target.value
    });
  };

  const calculateDuty = () => {
    const value = parseFloat(dutyData.itemValue) || 0;
    const rate = parseFloat(dutyData.dutyRate) || 0;
    const dutyAmount = (value * rate) / 100;
    return dutyAmount.toFixed(2);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Custom Duty Management
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Calculate and manage custom duty payments
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Calculate color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Calculate Duty</Typography>
              </Box>
              <Box sx={{ mb: 2 }}>
                <TextField
                  fullWidth
                  label="Item Value"
                  type="number"
                  value={dutyData.itemValue}
                  onChange={handleInputChange('itemValue')}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Duty Rate (%)"
                  type="number"
                  value={dutyData.dutyRate}
                  onChange={handleInputChange('dutyRate')}
                  sx={{ mb: 2 }}
                />
                <FormControl fullWidth sx={{ mb: 2 }}>
                  <InputLabel>Currency</InputLabel>
                  <Select
                    value={dutyData.currency}
                    onChange={handleInputChange('currency')}
                    label="Currency"
                  >
                    <MenuItem value="USD">USD</MenuItem>
                    <MenuItem value="EUR">EUR</MenuItem>
                    <MenuItem value="GBP">GBP</MenuItem>
                  </Select>
                </FormControl>
                <TextField
                  fullWidth
                  label="Item Type"
                  value={dutyData.itemType}
                  onChange={handleInputChange('itemType')}
                  sx={{ mb: 2 }}
                />
                <TextField
                  fullWidth
                  label="Country of Origin"
                  value={dutyData.country}
                  onChange={handleInputChange('country')}
                />
              </Box>
              <Box sx={{ p: 2, bgcolor: 'grey.100', borderRadius: 1, mb: 2 }}>
                <Typography variant="h6" color="primary">
                  Duty Amount: ${calculateDuty()}
                </Typography>
              </Box>
              <Button variant="contained" startIcon={<Add />} fullWidth>
                Add to Cart
              </Button>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Payment color="success" sx={{ mr: 1 }} />
                <Typography variant="h6">Make Payment</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Process payment for calculated duties
              </Typography>
              <Button variant="contained" color="success" startIcon={<Payment />} fullWidth>
                Pay Now
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Paper sx={{ mt: 3, p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Duty Payment History
        </Typography>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Item Value</TableCell>
                <TableCell>Duty Rate</TableCell>
                <TableCell>Duty Amount</TableCell>
                <TableCell>Currency</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {dutyHistory.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.id}</TableCell>
                  <TableCell>${row.itemValue.toLocaleString()}</TableCell>
                  <TableCell>{row.dutyRate}%</TableCell>
                  <TableCell>${row.dutyAmount}</TableCell>
                  <TableCell>{row.currency}</TableCell>
                  <TableCell>{row.date}</TableCell>
                  <TableCell>
                    <Typography 
                      color={row.status === 'Paid' ? 'success.main' : 'warning.main'}
                    >
                      {row.status}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Button size="small" startIcon={<Edit />}>
                      Edit
                    </Button>
                    <Button size="small" color="error" startIcon={<Delete />}>
                      Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Container>
  );
};

export default CustomDutyPage;
