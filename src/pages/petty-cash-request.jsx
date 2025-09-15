import React, { useState } from "react";
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
  Snackbar,
} from "@mui/material";
import {
  AttachMoney,
  Add,
  CheckCircle,
  Assessment,
  RequestPage,
  Save,
} from "@mui/icons-material";

const PettyCashRequestPage = () => {
  const [requestData, setRequestData] = useState({
    amount: "",
    purpose: "",
    department: "",
    priority: "Medium",
    category: "",
    expectedDate: "",
  });

  const [requests, setRequests] = useState([
    {
      id: "PC001",
      amount: 150,
      purpose: "Office supplies",
      department: "Finance",
      date: "2024-01-15",
      status: "Approved",
      priority: "Low",
      category: "Office Supplies",
    },
    {
      id: "PC002",
      amount: 300,
      purpose: "Team lunch",
      department: "HR",
      date: "2024-01-14",
      status: "Pending",
      priority: "Medium",
      category: "Meals",
    },
    {
      id: "PC003",
      amount: 500,
      purpose: "Emergency repairs",
      department: "Operations",
      date: "2024-01-13",
      status: "Rejected",
      priority: "High",
      category: "Maintenance",
    },
  ]);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleInputChange = (field) => (event) => {
    setRequestData({
      ...requestData,
      [field]: event.target.value,
    });
  };

  const handleSubmit = () => {
    if (
      !requestData.amount ||
      !requestData.purpose ||
      !requestData.department
    ) {
      setSnackbar({
        open: true,
        message: "Please fill in all required fields",
        severity: "error",
      });
      return;
    }

    const newRequest = {
      id: `PC${String(requests.length + 1).padStart(3, "0")}`,
      amount: parseFloat(requestData.amount),
      purpose: requestData.purpose,
      department: requestData.department,
      date: new Date().toISOString().split("T")[0],
      status: "Pending",
      priority: requestData.priority,
      category: requestData.category,
    };

    setRequests([newRequest, ...requests]);
    setRequestData({
      amount: "",
      purpose: "",
      department: "",
      priority: "Medium",
      category: "",
      expectedDate: "",
    });

    setSnackbar({
      open: true,
      message: "Petty cash request submitted successfully!",
      severity: "success",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Approved":
        return "success";
      case "Pending":
        return "warning";
      case "Rejected":
        return "error";
      default:
        return "default";
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "High":
        return "error";
      case "Medium":
        return "warning";
      case "Low":
        return "success";
      default:
        return "default";
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Container maxWidth="xl">
      <Box sx={{ py: 3 }}>
        <Paper sx={{ p: 3, mt: 2 }}>
          <Typography variant="body1">
            Welcome to the Request Petty Cash page.
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default PettyCashRequestPage;
