import React, { useState, useRef, useEffect } from 'react';

// DEVELOPMENT MODE: This modal uses console logging instead of API calls
// for testing purposes. Replace with actual API calls when backend is ready.

import {
  Modal,
  Box,
  Typography,
  Button,
  LinearProgress,
  Paper,
  Alert,
  IconButton,
} from '@mui/material';
import { RxCross2 } from 'react-icons/rx';
import { userRequest } from 'src/requestMethod';
import Iconify from 'src/components/iconify/iconify';
import swal from 'sweetalert';
import { showErrorMessage } from 'src/utils/errorUtils';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  maxWidth: '90vw',
  bgcolor: 'background.paper',
  borderRadius: 2,
  p: 4,
  outline: 'none',
};

export default function UploadJVModal({ open, onClose, onSuccess }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef();

  // Reset state when modal is opened or closed
  useEffect(() => {
    if (!open) {
      setSelectedFile(null);
      setUploadProgress(0);
      setUploadSuccess(false);
      setUploadError('');
      setUploading(false);
      setDragActive(false);
    }
  }, [open]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setUploadSuccess(false);
      setUploadError('');
      setUploadProgress(0);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setDragActive(false);
    
    const file = event.dataTransfer.files[0];
    if (file) {
      setSelectedFile(file);
      setUploadSuccess(false);
      setUploadError('');
      setUploadProgress(0);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    setDragActive(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    setDragActive(false);
  };

  const handleClick = () => {
    if (!uploading) {
      inputRef.current?.click();
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setUploadError('Please select a file to upload');
      return;
    }

    try {
      setUploading(true);
      setUploadError('');
      setUploadProgress(0);

      // For development - using console log instead of API call
      console.log('Uploading file:', selectedFile.name);
      console.log('File size:', selectedFile.size);
      console.log('File type:', selectedFile.type);

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      clearInterval(progressInterval);
      setUploadSuccess(true);
      setUploadProgress(100);
      
      console.log('File uploaded successfully!');
      
      // Auto close modal after success
      setTimeout(() => {
        onSuccess();
      }, 2000);

    } catch (error) {
      console.error('Upload failed:', error);
      setUploadError(
        error.response?.data?.message || 
        'Upload failed. Please try again.'
      );
      setUploadProgress(0);
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    if (!uploading) {
      onClose();
    }
  };

  const getFileIcon = (fileName) => {
    const extension = fileName?.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'xlsx':
      case 'xls':
        return 'eva:file-text-fill';
      case 'csv':
        return 'eva:file-text-outline';
      case 'pdf':
        return 'eva:file-fill';
      default:
        return 'eva:file-outline';
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box sx={style}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
            Upload Journal Voucher File
          </Typography>
          <IconButton onClick={handleClose} disabled={uploading} sx={{ color: '#B22222' }}>
            <RxCross2 size={20} />
          </IconButton>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2, fontSize: '0.875rem' }}>
          Upload an Excel file (.xlsx, .xls) or CSV file containing journal voucher data.
        </Typography>

        {/* Drag and Drop Upload Area */}
        <Paper
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={handleClick}
          sx={{
            border: dragActive ? '2px solid #1976d2' : '2px dashed #bdbdbd',
            borderRadius: 2,
            p: 3,
            mb: 2,
            textAlign: 'center',
            cursor: uploading ? 'not-allowed' : 'pointer',
            background: dragActive ? '#e3f2fd' : '#fafafa',
            transition: 'border 0.2s, background 0.2s',
            color: '#616161',
            fontWeight: 500,
            fontSize: '0.875rem',
            outline: 'none',
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 160,
          }}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".xlsx,.xls,.csv"
            onChange={handleFileChange}
            style={{ display: 'none' }}
            disabled={uploading}
          />
          
          {selectedFile ? (
            <Box sx={{ textAlign: 'center' }}>
              <Iconify
                icon={getFileIcon(selectedFile.name)}
                sx={{ width: 40, height: 40, color: '#1976d2', mb: 1.5 }}
              />
              <Typography variant="h6" sx={{ mb: 0.5, color: '#1976d2', fontSize: '1rem' }}>
                {selectedFile.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
              </Typography>
            </Box>
          ) : (
            <Box sx={{ textAlign: 'center' }}>
              <Iconify
                icon="eva:cloud-upload-outline"
                sx={{ width: 48, height: 48, color: '#bdbdbd', mb: 1.5 }}
              />
              <Typography variant="h6" sx={{ mb: 0.5, fontSize: '1rem' }}>
                {dragActive ? 'Drop file here' : 'Drag & drop file here'}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                or click to browse
              </Typography>
              <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block', fontSize: '0.75rem' }}>
                Supports: .xlsx, .xls, .csv
              </Typography>
            </Box>
          )}
        </Paper>

        {/* Upload Progress */}
        {uploading && (
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <Typography variant="body2" sx={{ mr: 1, fontSize: '0.875rem' }}>
                Uploading...
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.875rem' }}>
                {uploadProgress}%
              </Typography>
            </Box>
            <LinearProgress variant="determinate" value={uploadProgress} />
          </Box>
        )}

        {/* Success Message */}
        {uploadSuccess && (
          <Alert severity="success" sx={{ mb: 2 }}>
            <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
              File uploaded successfully! Processing journal vouchers...
            </Typography>
          </Alert>
        )}

        {/* Error Message */}
        {uploadError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            <Typography variant="body2" sx={{ fontSize: '0.875rem' }}>
              {uploadError}
            </Typography>
          </Alert>
        )}

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1.5 }}>
          <Button
            variant="outlined"
            size="small"
            onClick={handleClose}
            disabled={uploading}
            sx={{ fontSize: '0.875rem' }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            size="small"
            onClick={handleUpload}
            disabled={!selectedFile || uploading || uploadSuccess}
            startIcon={
              uploading ? (
                <Iconify icon="eva:loader-outline" sx={{ animation: 'spin 1s linear infinite' }} />
              ) : (
                <Iconify icon="eva:upload-fill" />
              )
            }
            sx={{ fontSize: '0.875rem' }}
          >
            {uploading ? 'Uploading...' : uploadSuccess ? 'Uploaded' : 'Upload File'}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
