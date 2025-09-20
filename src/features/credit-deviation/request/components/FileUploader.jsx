import React, { useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  LinearProgress,
  Stack,
  Paper,
  IconButton,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const FileUploader = ({
  acceptedFileTypes = ["image/jpeg", "image/png", "application/pdf"],
  maxSizeMB = 50,
  onChange,
  apiUrl,
  localStorageKey,
}) => {
  const [fileName, setFileName] = useState(null);
  const [progress, setProgress] = useState(0);
  const [validationError, setValidationError] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const uploadToAPI = async (selectedFile) => {
    if (!apiUrl) {
      setValidationError("API URL is required.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await axios.post(apiUrl, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (event) => {
          if (event.lengthComputable) {
            const percent = (event.loaded / event.total) * 100;
            setProgress(percent);
          }
        },
      });

      const uploadedFileUrl = response?.data?.data;
      setFileName(selectedFile.name);
      setValidationError(null);
      if (onChange) onChange(uploadedFileUrl);
    } catch (error) {
      console.error("Error uploading file:", error);
      setValidationError("File upload failed. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (!selectedFile) return;

    const fileSizeInMB = selectedFile.size / 1024 / 1024;
    const isValidType = acceptedFileTypes.includes(selectedFile.type);
    const isValidSize = fileSizeInMB <= maxSizeMB;

    if (!isValidType) {
      setValidationError(
        `Only ${acceptedFileTypes.join(", ")} files are allowed.`
      );
      return;
    }

    if (!isValidSize) {
      setValidationError(`File size must be less than ${maxSizeMB} MB.`);
      return;
    }

    setValidationError(null);
    setIsUploading(true);
    uploadToAPI(selectedFile);
  };

  return (
    <Box width="100%">
      <Paper
        elevation={3}
        sx={{
          border: "2px dashed #ccc",
          borderRadius: 2,
          p: 4,
          textAlign: "center",
          position: "relative",
          cursor: "pointer",
          ":hover": {
            backgroundColor: "#f9f9f9",
          },
        }}
        onClick={() => document.getElementById("file-input").click()}
      >
        <input
          id="file-input"
          type="file"
          accept={acceptedFileTypes.join(", ")}
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
        <Stack alignItems="center" spacing={2}>
          <IconButton color="primary" size="large">
            <CloudUploadIcon fontSize="large" />
          </IconButton>
          <Typography variant="body1" color="textSecondary">
            Drag & Drop or Browse to select a file
          </Typography>
        </Stack>
      </Paper>

      {isUploading && (
        <Box mt={2}>
          <LinearProgress variant="determinate" value={progress} />
          <Box display="flex" justifyContent="space-between" mt={1}>
            <Typography variant="caption" color="textSecondary">
              Uploading...
            </Typography>
            <Typography variant="caption" color="primary">
              {progress.toFixed(0)}%
            </Typography>
          </Box>
        </Box>
      )}

      {fileName && (
        <Typography color="success.main" variant="body2" mt={1}>
          Uploaded File: {fileName}
        </Typography>
      )}

      {validationError && (
        <Typography color="error" variant="body2" mt={1}>
          {validationError}
        </Typography>
      )}
    </Box>
  );
};

export default FileUploader;
