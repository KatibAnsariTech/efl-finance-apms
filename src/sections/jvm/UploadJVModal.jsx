import React, { useState, useRef, useEffect } from "react";
import { Modal, Box, Button, Typography, LinearProgress } from "@mui/material";
import swal from "sweetalert";
import Iconify from "src/components/iconify/iconify";
import { userRequest } from "src/requestMethod";
import { getErrorMessage, showErrorMessage } from "src/utils/errorUtils";

export default function UploadJVModal({ open, onClose, onSuccess }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [dragActive, setDragActive] = useState(false);

  const inputRef = useRef();

  // Reset modal state when closed
  useEffect(() => {
    if (!open) {
      setSelectedFile(null);
      setUploadProgress(0);
      setUploadSuccess(false);
      setUploadError("");
      setUploading(false);
      setDragActive(false);
    }
  }, [open]);

  // File selection
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setUploadSuccess(false);
      setUploadError("");
      setUploadProgress(0);
    }
  };

  // Drag-drop handlers
  const handleDrop = (event) => {
    event.preventDefault();
    setDragActive(false);
    if (event.dataTransfer.files?.[0]) {
      setSelectedFile(event.dataTransfer.files[0]);
      setUploadSuccess(false);
      setUploadError("");
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
  const triggerFileInput = () => inputRef.current.click();

  // Upload logic (direct API)
  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setUploadProgress(0);
    setUploadError("");
    setUploadSuccess(false);

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const response = await userRequest.post("https://crd-test-2ib6.onrender.com/api/v1/journal-vouchers/uploadjvexcel", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        onUploadProgress: (progressEvent) => {
          const progress = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          setUploadProgress(progress);
        },
      });

      setUploadSuccess(true);
      setSelectedFile(null);

      swal("Upload Successful!", response.data.message, "success");

      if (onSuccess) onSuccess();
    } catch (err) {
      setUploadError(getErrorMessage(err));
      showErrorMessage(
        err,
        "Error uploading file. Please try again later.",
        swal
      );
    } finally {
      setUploading(false);
    }
  };

  // Simple sample download
  const handleDownloadSample = () => {
    const sampleUrl = "/sample-files/jv-sample.xlsx"; // <-- fixed location
    const a = document.createElement("a");
    a.href = sampleUrl;
    a.download = "Sample_JV.xlsx";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 5,
          borderRadius: 2,
          width: 600,
          maxWidth: "90vw",
          outline: "none",
        }}
      >
        <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
          Upload File
        </Typography>

        {/* Drag-drop upload area */}
        <Box
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={triggerFileInput}
          sx={{
            border: dragActive ? "2px solid #1976d2" : "2px dashed #bdbdbd",
            borderRadius: 2,
            p: 3,
            mb: 2,
            textAlign: "center",
            cursor: uploading ? "not-allowed" : "pointer",
            background: dragActive ? "#e3f2fd" : "#fafafa",
            transition: "border 0.2s, background 0.2s",
            color: "#616161",
            fontWeight: 500,
            fontSize: "1rem",
            outline: "none",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <input
            ref={inputRef}
            type="file"
            accept=".xls,.xlsx"
            hidden
            onChange={handleFileChange}
            disabled={uploading}
          />
          <Iconify
            icon="mdi:upload"
            width={40}
            sx={{ color: dragActive ? "#1976d2" : "#bdbdbd", mb: 1 }}
          />
          {selectedFile ? (
            <>
              <Typography sx={{ color: "#1976d2", fontWeight: 600 }}>
                {selectedFile.name}
              </Typography>
              <Typography variant="caption" sx={{ color: "#757575", mt: 0.5 }}>
                Click or drag to replace file
              </Typography>
            </>
          ) : (
            <>
              <Typography
                variant="caption"
                sx={{
                  color: dragActive ? "#1976d2" : "#757575",
                  fontWeight: 600,
                }}
              >
                Drag & drop Excel file here, or click to select
              </Typography>
              <Typography variant="caption" sx={{ color: "#bdbdbd", mt: 0.5 }}>
                Only .xls, .xlsx files are supported
              </Typography>
            </>
          )}
        </Box>

        {/* Upload Button */}
        <Button
          variant="contained"
          color="success"
          onClick={handleUpload}
          disabled={!selectedFile || uploading}
          fullWidth
          sx={{ my: 2 }}
        >
          Upload
        </Button>

        {/* Progress / Status */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          {uploadProgress > 0 && (
            <Box sx={{ width: "100%" }}>
              <LinearProgress variant="determinate" value={uploadProgress} />
              <Typography
                variant="body2"
                sx={{ mt: 1, color: "text.secondary" }}
              >
                Upload progress: {uploadProgress}%
              </Typography>
            </Box>
          )}
          {uploadSuccess && (
            <Typography variant="body2" sx={{ color: "green" }}>
              Upload successful!
            </Typography>
          )}
          {uploadError && (
            <Typography variant="body2" sx={{ color: "red" }}>
              {uploadError}
            </Typography>
          )}

          {/* Download Sample */}
          <Box
            onClick={handleDownloadSample}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 1,
              color: "#1976d2",
              fontWeight: 500,
              fontSize: "0.95rem",
              cursor: "pointer",
              mb: 2,
              userSelect: "none",
            }}
          >
            <Iconify icon="mdi:download" width={22} sx={{ color: "#1976d2" }} />
            <span>Download Sample File</span>
          </Box>

          {/* Cancel */}
          <Button
            variant="text"
            sx={{ color: "#d32f2f", fontWeight: 600 }}
            onClick={onClose}
            fullWidth
          >
            Cancel
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}
