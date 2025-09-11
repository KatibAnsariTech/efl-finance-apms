import React, { useState, useRef, useEffect } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import LinearProgress from "@mui/material/LinearProgress";
import { userRequest } from "src/requestMethod";
import Iconify from "src/components/iconify/iconify";
import swal from "sweetalert";
import { getErrorMessage, showErrorMessage } from "src/utils/errorUtils";

// Permission value to tab label mapping (should match master-sheet-view)
const tabLabelToPermission = {
  "Controlled Cheque": "controlledCheque",
  "CF Master": "cfMaster",
  "DSO Benchmark": "dsobenchmark",
  "DSO Standards": "dsostandard",
};

export default function UploadFileModal({
  open,
  onClose,
  onSuccess,
  selectedTab,
  menuItems = [
    "Controlled Cheque",
    "CF Master",
    "DSO Benchmark",
    "DSO Standards",
  ],
}) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [uploading, setUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef();

  // Reset state when modal is opened or closed
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

  const handleBulkFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setUploadSuccess(false);
      setUploadError("");
      setUploadProgress(0);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(false);
    if (event.dataTransfer.files && event.dataTransfer.files[0]) {
      setSelectedFile(event.dataTransfer.files[0]);
      setUploadSuccess(false);
      setUploadError("");
      setUploadProgress(0);
    }
  };

  const handleDragOver = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(true);
  };

  const handleDragLeave = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setDragActive(false);
  };

  const handleClick = () => {
    inputRef.current.click();
  };

  // Use menuItems and selectedTab to determine permission value
  const getAPIURL = () => {
    const tabLabel = menuItems[selectedTab] || "Controlled Cheque";
    const permission = tabLabelToPermission[tabLabel] || "controlledCheque";
    // Map permission to API param value
    let apiType = "ControlledCheque";
    if (permission === "cfMaster") apiType = "CFMaster";
    else if (permission === "dsobenchmark") apiType = "DSOBenchmark";
    else if (permission === "dsostandard") apiType = "DSOStandards";
    return `/admin/uploadMasterSheet?uploadFileType=${apiType}`;
  };

  const handleBulkUpload = async () => {
    if (!selectedFile) return;
    setUploading(true);
    setUploadProgress(0);
    setUploadError("");
    setUploadSuccess(false);
    const formData = new FormData();
    formData.append("file", selectedFile);
    try {
      const response = await userRequest.post(getAPIURL(), formData, {
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

      // Check if there are duplicates in the response
      if (response.data?.data?.duplicateInfo?.totalDuplicates > 0) {
        const duplicateMessage = response?.data?.data?.duplicateInfo?.message;
        swal(
          "Upload Successful!",
          `${response.data.message}\n\n${duplicateMessage}`,
          "success"
        );
      } else {
        swal(
          "Upload Successful!",
          response.data.message || "Your file has been uploaded successfully.",
          "success"
        );
      }

      if (onSuccess) onSuccess();
    } catch (err) {
      onClose();

      if (err.response?.data?.message?.includes("Data validation error")) {
        const errorMessage = err.response.data.message;
        const lines = errorMessage.split("\n");
        const header = lines[0]; 
        const issues = lines.slice(1).filter((line) => line.trim()); 
        const issueCount = issues.length;
        const firstFewIssues = issues.slice(0, 3); 
        const hasMoreIssues = issues.length > 3;

        let formattedMessage = `${header}\n\n`;
        formattedMessage += `Found ${issueCount} validation errors:\n\n`;
        formattedMessage += firstFewIssues.join("\n");

        if (hasMoreIssues) {
          formattedMessage += `\n... and ${issues.length - 5} more errors`;
        }

        swal({
          title: "Validation Error",
          text: formattedMessage,
          icon: "error",
          button: "OK",
        });
      } else {
        setUploadError(getErrorMessage(err));
        showErrorMessage(
          err,
          "Error saving data. Please try again later.",
          swal
        );
      }
    } finally {
      setUploading(false);
    }
  };

  const getDownloadURL = () => {
    const tabLabel = menuItems[selectedTab] || "Controlled Cheque";
    // Map tab label to sample file URL
    if (tabLabel === "Controlled Cheque")
      return "https://efl-rrr-api.eurekaforbes.co.in/uploads/file_391434_1756375576529.xlsx";
    if (tabLabel === "CF Master")
      return "https://efl-rrr-api.eurekaforbes.co.in/uploads/file_280776_1756375555580.xlsx";
    if (tabLabel === "DSO Benchmark")
      return "https://efl-rrr-api.eurekaforbes.co.in/uploads/file_929563_1756375595250.xlsx";
    return "https://efl-rrr-api.eurekaforbes.co.in/uploads/file_996024_1756375609894.xlsx";
  };

  const getSampleFileName = () => {
    const tabLabel = menuItems[selectedTab] || "Controlled Cheque";
    if (tabLabel === "Controlled Cheque") return "Controlled_Cheque";
    if (tabLabel === "CF Master") return "CF_Master";
    if (tabLabel === "DSO Benchmark") return "DSO_Benchmark";
    return "DSO_Standards";
  };

  const handleDownloadSample = async () => {
    try {
      const sampleUrl = getDownloadURL();
      const response = await fetch(sampleUrl);
      const blob = await response.blob();

      const fileName = `Sample_${getSampleFileName()}.xlsx`;

      const downloadUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(downloadUrl);
    } catch (error) {
      console.error("Download error:", error);
    }
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="bulk-upload-modal-title"
      aria-describedby="bulk-upload-modal-description"
    >
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
        <Typography
          id="bulk-upload-modal-title"
          variant="h6"
          sx={{ mb: 2, fontWeight: "bold" }}
        >
          Upload File
        </Typography>
        {/* Modern Drag and Drop Upload Area with Icon */}
        <Box
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={handleClick}
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
            position: "relative",
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
            onChange={handleBulkFileChange}
            disabled={uploading}
          />
          <Iconify
            icon="mdi:upload"
            width={40}
            sx={{ color: dragActive ? "#1976d2" : "#bdbdbd", mb: 1 }}
          />
          {selectedFile ? (
            <>
              <Typography
                variant="body1"
                sx={{ color: "#1976d2", fontWeight: 600 }}
              >
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
          onClick={handleBulkUpload}
          disabled={!selectedFile || uploading}
          fullWidth
          sx={{ my: 2 }}
        >
          Upload
        </Button>
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

          {/* Download Sample Button below upload button, icon + text only */}
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
