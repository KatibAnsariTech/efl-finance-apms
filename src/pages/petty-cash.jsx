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

      </Box>
    </Container>
  );
};

export default PettyCashPage;
