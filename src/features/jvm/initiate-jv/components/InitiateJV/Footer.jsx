import { Box, Button, Typography, FormControl, Select, MenuItem, CircularProgress, IconButton, Input } from "@mui/material";
import Iconify from "src/components/iconify/iconify";
import { useState, useRef } from "react";
import { userRequest } from "src/requestMethod";
import { showErrorMessage } from "src/utils/errorUtils";
import swal from "sweetalert";

const Footer = ({
  autoReversal,
  setAutoReversal,
  reversalRemarks,
  setReversalRemarks,
  onSubmitRequest,
  submitting,
  supportingDocuments,
  setSupportingDocuments,
}) => {
  const [uploadingFile, setUploadingFile] = useState(false);
  const [uploadedFileNames, setUploadedFileNames] = useState([]);
  const fileInputRef = useRef(null);

  const handleFileSelect = async (event) => {
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    // Validate each file
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "image/jpeg",
      "image/jpg",
      "image/png",
    ];

    const maxSize = 5 * 1024 * 1024; // 5MB in bytes

    for (const file of files) {
      if (!allowedTypes.includes(file.type)) {
        swal(
          "Invalid File Type",
          `File "${file.name}" is not a valid type. Please upload PDF, DOC, DOCX, JPG, or PNG files.`,
          "error"
        );
        return;
      }

      if (file.size > maxSize) {
        swal(
          "File Too Large",
          `File "${file.name}" is too large. Please upload files smaller than 5MB.`,
          "error"
        );
        return;
      }
    }

    setUploadingFile(true);

    try {
      const uploadPromises = files.map(async (file) => {
        const formData = new FormData();
        formData.append("file", file);

        const response = await userRequest.post("/util/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });

        if (response.data.success) {
          return {
            url: response.data.data,
            name: file.name
          };
        } else {
          throw new Error(response.data.msg || "File upload failed");
        }
      });

      const uploadedFiles = await Promise.all(uploadPromises);
      
      // Extract URLs for the main state
      const urls = uploadedFiles.map(file => file.url);
      const names = uploadedFiles.map(file => file.name);
      
      // Replace existing files instead of adding to them
      setSupportingDocuments(urls);
      setUploadedFileNames(names);
      
      swal(
        "Success!", 
        `Successfully uploaded ${uploadedFiles.length} supporting document(s)!`, 
        "success"
      );
    } catch (error) {
      console.error("File upload error:", error);
      showErrorMessage(error, "Failed to upload supporting documents", swal);
    } finally {
      setUploadingFile(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleRemoveFile = (indexToRemove) => {
    setSupportingDocuments(prev => prev.filter((_, index) => index !== indexToRemove));
    setUploadedFileNames(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleRemoveAllFiles = () => {
    setSupportingDocuments([]);
    setUploadedFileNames([]);
  };
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: { xs: "column", sm: "row" },
        gap: { xs: 2, sm: 0 },
        minHeight: { xs: "auto", sm: "120px" },
        mt: { xs: 1, xl: 2 },
      }}
    >
      {/* Left Side - Controls */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          width: { xs: "100%", sm: "auto" },
          justifyContent: { xs: "center", sm: "flex-start" },
        }}
      >
        {/* Auto Reversal Section */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography
              variant="body2"
              sx={{
                fontSize: { xs: "0.8rem", sm: "0.875rem" },
                whiteSpace: "nowrap",
                fontWeight: 500,
              }}
            >
              Auto-reversal this transaction: <span style={{ color: "red" }}>*</span>
            </Typography>
            <FormControl
              required
              sx={{
                minWidth: 80,
                "& .MuiOutlinedInput-root": {
                  height: "40px",
                },
              }}
            >
              <Select
                value={autoReversal}
                onChange={(e) => setAutoReversal(e.target.value)}
                displayEmpty
                sx={{
                  fontSize: { xs: "0.8rem", sm: "0.875rem" },
                }}
                renderValue={(selected) => {
                  if (!selected) {
                    return <em style={{ color: "#9e9e9e" }}>Select</em>;
                  }
                  return selected;
                }}
              >
                <MenuItem value="" disabled>
                  <em>Select</em>
                </MenuItem>
                <MenuItem value="Yes">Yes</MenuItem>
                <MenuItem value="No">No</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {autoReversal === "Yes" && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                minWidth: 300,
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  fontSize: { xs: "0.8rem", sm: "0.875rem" },
                  whiteSpace: "nowrap",
                  fontWeight: 500,
                }}
              >
                Reversal Reason:
              </Typography>
              <FormControl
                sx={{
                  minWidth: 120,
                  "& .MuiOutlinedInput-root": {
                    height: "40px",
                  },
                }}
              >
                <Select
                  value={reversalRemarks}
                  onChange={(e) => setReversalRemarks(e.target.value)}
                  displayEmpty
                  sx={{
                    fontSize: { xs: "0.8rem", sm: "0.875rem" },
                  }}
                >
                  <MenuItem value="">Select Reason</MenuItem>
                  <MenuItem value="01">01 - Existing Posting</MenuItem>
                  <MenuItem value="02">02 - New Posting Date</MenuItem>
                </Select>
              </FormControl>
            </Box>
          )}
        </Box>

        {/* Upload Supporting Document Section */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          <Typography
            variant="body2"
            sx={{
              fontSize: { xs: "0.8rem", sm: "0.875rem" },
              whiteSpace: "nowrap",
              fontWeight: 500,
            }}
          >
            Supporting Document:
          </Typography>
          
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Input
            type="file"
            inputRef={fileInputRef}
            onChange={handleFileSelect}
            sx={{ display: "none" }}
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            multiple
          />
          
          <Button
            variant="outlined"
            onClick={handleFileUpload}
            disabled={uploadingFile}
            startIcon={
              uploadingFile ? (
                <CircularProgress size={16} color="inherit" />
              ) : (
                <Iconify icon="eva:upload-fill" width={18} height={18} />
              )
            }
            sx={{
              borderColor: uploadingFile ? "#d0d7de" : "#0969da",
              color: uploadingFile ? "#8c959f" : "#0969da",
              textTransform: "none",
              fontSize: "0.875rem",
              fontWeight: 500,
              px: 2,
              py: 1,
              borderRadius: 1,
              "&:hover": {
                borderColor: "#0969da",
                color: "#0969da",
                backgroundColor: "#f6f8fa",
              },
              "&:disabled": {
                borderColor: "#d0d7de",
                color: "#8c959f",
                backgroundColor: "#f6f8fa",
              },
            }}
          >
            {uploadingFile ? "Uploading..." : "Choose Files"}
          </Button>
            
          {supportingDocuments.length > 0 && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1, minWidth: 300 }}>
              {supportingDocuments.map((url, index) => (
                <Box 
                  key={index}
                  sx={{ 
                    display: "flex", 
                    alignItems: "center", 
                    gap: 1,
                    backgroundColor: "#f6f8fa",
                    border: "1px solid #d0d7de",
                    borderRadius: 1,
                    px: 2,
                    py: 1,
                  }}
                >
                  <Iconify 
                    icon="eva:file-text-fill" 
                    width={16} 
                    height={16} 
                    style={{ color: "#0969da" }}
                  />
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: "0.8rem",
                      color: "#24292f",
                      fontWeight: 500,
                      flex: 1,
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {uploadedFileNames[index] || `Document ${index + 1}`}
                  </Typography>
                  <IconButton
                    onClick={() => handleRemoveFile(index)}
                    size="small"
                    sx={{ 
                      color: "#d1242f",
                      p: 0.5,
                      "&:hover": {
                        backgroundColor: "#ffeef0",
                      }
                    }}
                  >
                    <Iconify icon="eva:close-fill" width={14} height={14} />
                  </IconButton>
                </Box>
              ))}
              {supportingDocuments.length > 1 && (
                <Button
                  variant="text"
                  size="small"
                  onClick={handleRemoveAllFiles}
                  sx={{
                    color: "#d1242f",
                    fontSize: "0.75rem",
                    textTransform: "none",
                    alignSelf: "flex-start",
                    px: 1,
                    py: 0.5,
                    "&:hover": {
                      backgroundColor: "#ffeef0",
                    }
                  }}
                >
                  Remove All
                </Button>
              )}
            </Box>
          )}
          </Box>
        </Box>
      </Box>

      {/* Right Side - Submit Button */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: { xs: "100%", sm: "auto" },
        }}
      >
        <Button
          variant="contained"
          color="primary"
          onClick={onSubmitRequest}
          disabled={submitting || uploadingFile}
          sx={{
            px: { xs: 2, sm: 3 },
            py: { xs: 1.5, sm: 1 },
            fontSize: { xs: "0.8rem", sm: "0.875rem" },
            fontWeight: "bold",
            width: { xs: "100%", sm: "auto" },
            minWidth: { xs: "auto", sm: "240px" },
          }}
        >
          {submitting ? (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <CircularProgress size={16} color="inherit" />
              Submitting...
            </Box>
          ) : uploadingFile ? (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <CircularProgress size={16} color="inherit" />
              Uploading...
            </Box>
          ) : (
            "Submit Request"
          )}
        </Button>
      </Box>
    </Box>
  );
};

export default Footer;
