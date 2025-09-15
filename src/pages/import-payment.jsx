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
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
} from "@mui/material";
import {
  FileUpload,
  History,
  CloudUpload,
  Description,
  CheckCircle,
  Error,
} from "@mui/icons-material";

const ImportPaymentPage = () => {
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    const newFiles = files.map((file) => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: file.size,
      status: "Processing",
      date: new Date().toLocaleDateString(),
    }));
    setUploadedFiles([...uploadedFiles, ...newFiles]);
  };

  const getFileIcon = (status) => {
    switch (status) {
      case "Completed":
        return <CheckCircle color="success" />;
      case "Error":
        return <Error color="error" />;
      default:
        return <Description color="info" />;
    }
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Import Payment
        </Typography>
      </Box>
    </Container>
  );
};

export default ImportPaymentPage;
