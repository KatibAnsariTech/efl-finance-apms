import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Input from '@mui/material/Input';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import Iconify from 'src/components/iconify';
import { userRequest } from 'src/requestMethod';

const UploadFile = ({ onFileUpload, project = "custom" }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploadSuccessful, setIsUploadSuccessful] = useState(false);

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setIsUploadSuccessful(false);

    setUploadProgress(0);
    await uploadFile(file);
  };

  const uploadFile = async (file) => {
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('project', project);

    try {
      const response = await userRequest.post('/util/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setUploadProgress(progress);
        },
      });

      console.log('Upload successful:', response.data);
      setIsUploadSuccessful(true);
      if (onFileUpload) {
        onFileUpload(response.data.fileUrl); // Assuming the file URL is in `response.data.fileUrl`
      }
    } catch (error) {
      console.error('Upload failed:', error);
    }
  };

  return (
    <Box sx={{ textAlign: 'center', p: 2, border: '1px dashed grey', borderRadius: 2 }}>
      <Input
        type="file"
        onChange={handleFileChange}
        style={{ display: 'none' }}
        inputProps={{ accept: 'image/*' }}
        id="upload-button"
      />
      <label htmlFor="upload-button">
        <Button
          variant="contained"
          component="span"
          startIcon={<Iconify icon="eva:cloud-upload-outline" />}
          sx={{ mb: 2 }}
        >
          Select File
        </Button>
      </label>

      {uploadProgress > 0 && uploadProgress < 100 && (
        <Box sx={{ width: '100%', mt: 2 }}>
          <LinearProgress variant="determinate" value={uploadProgress} />
          <Typography variant="body2" sx={{ mt: 1, color: 'text.secondary' }}>
            Upload progress: {uploadProgress}%
          </Typography>
        </Box>
      )}

      {isUploadSuccessful && (
        <Typography variant="body2" sx={{ mt: 2, color: 'green' }}>
          Selected file: {selectedFile?.name}
        </Typography>
      )}
    </Box>
  );
};

export default UploadFile;
