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
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider
} from '@mui/material';
import { 
  FileUpload, 
  History, 
  CloudUpload, 
  Description,
  CheckCircle,
  Error
} from '@mui/icons-material';

const ImportPaymentPage = () => {
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const handleFileUpload = (event) => {
    const files = Array.from(event.target.files);
    const newFiles = files.map(file => ({
      id: Date.now() + Math.random(),
      name: file.name,
      size: file.size,
      status: 'Processing',
      date: new Date().toLocaleDateString()
    }));
    setUploadedFiles([...uploadedFiles, ...newFiles]);
  };

  const getFileIcon = (status) => {
    switch (status) {
      case 'Completed':
        return <CheckCircle color="success" />;
      case 'Error':
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
        <Typography variant="body1" color="text.secondary">
          Upload and manage payment files
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <FileUpload color="primary" sx={{ mr: 1 }} />
                <Typography variant="h6">Upload Payment Files</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Upload CSV, Excel, or PDF files containing payment information
              </Typography>
              <input
                accept=".csv,.xlsx,.xls,.pdf"
                style={{ display: 'none' }}
                id="file-upload"
                multiple
                type="file"
                onChange={handleFileUpload}
              />
              <label htmlFor="file-upload">
                <Button
                  variant="contained"
                  component="span"
                  startIcon={<CloudUpload />}
                  fullWidth
                >
                  Choose Files
                </Button>
              </label>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <History color="success" sx={{ mr: 1 }} />
                <Typography variant="h6">Upload History</Typography>
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                View previously uploaded payment files
              </Typography>
              <Button
                variant="outlined"
                startIcon={<History />}
                fullWidth
              >
                View History
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {uploadedFiles.length > 0 && (
        <Paper sx={{ mt: 3, p: 3 }}>
          <Typography variant="h6" gutterBottom>
            Recent Uploads
          </Typography>
          <List>
            {uploadedFiles.map((file, index) => (
              <React.Fragment key={file.id}>
                <ListItem>
                  <ListItemIcon>
                    {getFileIcon(file.status)}
                  </ListItemIcon>
                  <ListItemText
                    primary={file.name}
                    secondary={`Size: ${(file.size / 1024).toFixed(2)} KB • Uploaded: ${file.date}`}
                  />
                </ListItem>
                {index < uploadedFiles.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </Paper>
      )}

      <Paper sx={{ mt: 3, p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Supported File Formats
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            <Box sx={{ textAlign: 'center', p: 2 }}>
              <Typography variant="h6" color="primary">CSV</Typography>
              <Typography variant="body2" color="text.secondary">
                Comma-separated values
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box sx={{ textAlign: 'center', p: 2 }}>
              <Typography variant="h6" color="primary">Excel</Typography>
              <Typography variant="body2" color="text.secondary">
                .xlsx, .xls files
              </Typography>
            </Box>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Box sx={{ textAlign: 'center', p: 2 }}>
              <Typography variant="h6" color="primary">PDF</Typography>
              <Typography variant="body2" color="text.secondary">
                Portable Document Format
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default ImportPaymentPage;
