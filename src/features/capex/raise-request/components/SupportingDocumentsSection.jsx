import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
  Button,
  MenuItem,
  LinearProgress,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Paper,
  Divider,
  Badge,
  Chip,
  Tooltip,
  Link,
} from "@mui/material";
import { Upload, Delete, Description, Image, PictureAsPdf, AttachFile, CloudUpload, OpenInNew, DeleteSweep } from "@mui/icons-material";
import { Controller } from "react-hook-form";
import { CustomSelect } from "./CustomFields";
import { userRequest } from "src/requestMethod";
import swal from "sweetalert";
import { showErrorMessage } from "src/utils/errorUtils";

export default function SupportingDocumentsSection({ control, setValue, watch, errors }) {
  const documents = watch("documents") || {};
  const [uploading, setUploading] = useState({});
  const fileInputRefs = useRef({});
  const documentsRef = useRef(documents);
  const updateLockRef = useRef(Promise.resolve());
  
  useEffect(() => {
    documentsRef.current = documents;
  }, [documents]);

  const getFileIcon = (fileUrl) => {
    if (!fileUrl) return <AttachFile />;
    const url = fileUrl.toLowerCase();
    if (url.includes('.pdf')) return <PictureAsPdf sx={{ color: '#d32f2f' }} />;
    if (url.includes('.doc') || url.includes('.docx')) return <Description sx={{ color: '#1976d2' }} />;
    if (url.includes('.jpg') || url.includes('.jpeg') || url.includes('.png')) return <Image sx={{ color: '#388e3c' }} />;
    return <AttachFile />;
  };

  const getFileName = (fileUrl) => {
    if (!fileUrl) return "Unknown File";
    try {
      const urlParts = fileUrl.split('/');
      const fileName = urlParts[urlParts.length - 1];
      return fileName.split('?')[0];
    } catch {
      return fileUrl.substring(fileUrl.lastIndexOf('/') + 1) || "File";
    }
  };

  const handleFileUpload = async (fieldName, file, fileName) => {
    if (!file) return;

    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "image/jpeg",
      "image/jpg",
      "image/png",
    ];

    if (!allowedTypes.includes(file.type)) {
      swal("Invalid File Type", "Please upload PDF, DOC, DOCX, JPG, or PNG files.", "error");
      return;
    }

    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      swal("File Too Large", "Please upload files smaller than 5MB.", "error");
      return;
    }

    const uploadKey = `${fieldName}_${Date.now()}_${fileName}`;
    setUploading((prev) => ({ ...prev, [uploadKey]: true }));

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await userRequest.post("/util/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (response.data.success) {
        const fileUrl = response.data.data;
        
        updateLockRef.current = updateLockRef.current.then(async () => {
          const currentDocuments = documentsRef.current || {};
          const currentFiles = Array.isArray(currentDocuments[fieldName]) 
            ? currentDocuments[fieldName] 
            : currentDocuments[fieldName] 
              ? [currentDocuments[fieldName]] 
              : [];
          
          const updatedDocuments = {
            ...currentDocuments,
            [fieldName]: [...currentFiles, fileUrl],
          };
          
          documentsRef.current = updatedDocuments;
          setValue("documents", updatedDocuments, { shouldDirty: true });
        }).catch((error) => {
          console.error("Error updating documents:", error);
        });
        
        await updateLockRef.current;
      } else {
        throw new Error(response.data.msg || "Upload failed");
      }
    } catch (error) {
      console.error("File upload error:", error);
      showErrorMessage(error, "Failed to upload file", swal);
    } finally {
      setUploading((prev) => {
        const newState = { ...prev };
        delete newState[uploadKey];
        return newState;
      });
    }
  };

  const handleFileSelect = (fieldName) => (event) => {
    const files = Array.from(event.target.files || []);
    if (files.length > 0) {
      files.forEach((file) => {
        handleFileUpload(fieldName, file, file.name);
      });
    }
    if (fileInputRefs.current[fieldName]) {
      fileInputRefs.current[fieldName].value = "";
    }
  };

  const handleRemoveFile = (fieldName, index) => {
    const currentFiles = Array.isArray(documents[fieldName]) 
      ? documents[fieldName] 
      : documents[fieldName] 
        ? [documents[fieldName]] 
        : [];
    
    const updatedFiles = currentFiles.filter((_, i) => i !== index);
    
    const updatedDocuments = {
      ...documents,
      [fieldName]: updatedFiles.length > 0 ? updatedFiles : "",
    };
    setValue("documents", updatedDocuments);
  };

  const handleClearAll = (fieldName) => {
    const updatedDocuments = {
      ...documents,
      [fieldName]: "",
    };
    setValue("documents", updatedDocuments);
  };

  const getFileExtension = (fileUrl) => {
    if (!fileUrl) return "";
    try {
      const fileName = getFileName(fileUrl);
      const parts = fileName.split('.');
      return parts.length > 1 ? parts[parts.length - 1].toUpperCase() : "";
    } catch {
      return "";
    }
  };

  const formatFileSize = (bytes) => {
    if (!bytes) return "";
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / (1024 * 1024)).toFixed(1) + " MB";
  };

  const renderFileUpload = (fieldName, label, required = false) => {
    const fileUrls = Array.isArray(documents[fieldName]) 
      ? documents[fieldName] 
      : documents[fieldName] 
        ? [documents[fieldName]] 
        : [];
    const uploadingFiles = Object.keys(uploading).filter(key => key.startsWith(fieldName));

    return (
      <Grid item xs={12} md={6}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 1.5 }}>
            <Typography variant="body2" sx={{ fontWeight: 500 }}>
              {label} {required && <span style={{ color: "red" }}>*</span>}
            </Typography>
            {fileUrls.length > 0 && (
              <Badge
                badgeContent={fileUrls.length}
                color="primary"
                sx={{
                  "& .MuiBadge-badge": {
                    fontSize: "0.7rem",
                    minWidth: "20px",
                    height: "20px",
                  },
                }}
              />
            )}
          </Box>
          <input
            ref={(el) => (fileInputRefs.current[fieldName] = el)}
            type="file"
            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
            multiple
            onChange={handleFileSelect(fieldName)}
            style={{ display: "none" }}
          />
          
          <Paper
            variant="outlined"
            sx={{
              mb: 2,
              minHeight: 180,
              maxHeight: 180,
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
              backgroundColor: fileUrls.length > 0 ? "background.paper" : "action.hover",
              border: fileUrls.length > 0 ? "1px solid" : "2px dashed",
              borderColor: fileUrls.length > 0 ? "divider" : "divider",
            }}
          >
            {fileUrls.length > 0 ? (
              <>
                {fileUrls.length > 1 && (
                  <Box
                    sx={{
                      px: 2,
                      py: 0.5,
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      backgroundColor: "action.hover",
                      borderBottom: "1px solid",
                      borderColor: "divider",
                    }}
                  >
                    <Typography variant="caption" sx={{ fontWeight: 600, color: "text.secondary" }}>
                      {fileUrls.length} file{fileUrls.length > 1 ? "s" : ""}
                    </Typography>
                    <Tooltip title="Clear All">
                      <IconButton
                        size="small"
                        onClick={() => handleClearAll(fieldName)}
                        sx={{
                          color: "error.main",
                          "&:hover": {
                            backgroundColor: "error.lighter",
                          },
                        }}
                      >
                        <DeleteSweep fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                )}
                <Box sx={{ flex: 1, overflow: "auto" }}>
                  <List dense>
                    {fileUrls.map((fileUrl, index) => (
                      <React.Fragment key={index}>
                        <ListItem
                          sx={{
                            py: 1.5,
                            px: 2,
                            "&:hover": {
                              backgroundColor: "action.hover",
                            },
                          }}
                        >
                          <Box sx={{ display: "flex", alignItems: "center", mr: 1.5 }}>
                            {getFileIcon(fileUrl)}
                          </Box>
                          <ListItemText
                            primary={
                              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                <Link
                                  href={fileUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  underline="hover"
                                  sx={{
                                    color: "primary.main",
                                    fontWeight: 500,
                                    fontSize: "0.875rem",
                                    cursor: "pointer",
                                    maxWidth: 200,
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                    display: "inline-block",
                                    "&:hover": {
                                      color: "primary.dark",
                                    },
                                  }}
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  {getFileName(fileUrl)}
                                </Link>
                                {getFileExtension(fileUrl) && (
                                  <Chip
                                    label={getFileExtension(fileUrl)}
                                    size="small"
                                    sx={{
                                      height: "20px",
                                      fontSize: "0.65rem",
                                      fontWeight: 600,
                                      backgroundColor: "action.selected",
                                      color: "text.secondary",
                                    }}
                                  />
                                )}
                              </Box>
                            }
                            secondary={
                              <Typography
                                variant="caption"
                                sx={{ color: "text.secondary", display: "flex", alignItems: "center", gap: 0.5, mt: 0.5 }}
                              >
                                File {index + 1}
                                <Tooltip title="Open in new tab">
                                  <OpenInNew sx={{ fontSize: "0.75rem", cursor: "pointer" }} 
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      window.open(fileUrl, '_blank');
                                    }}
                                  />
                                </Tooltip>
                              </Typography>
                            }
                          />
                          <ListItemSecondaryAction>
                            <Tooltip title="Remove file">
                              <IconButton
                                edge="end"
                                size="small"
                                color="error"
                                onClick={() => handleRemoveFile(fieldName, index)}
                                sx={{
                                  "&:hover": {
                                    backgroundColor: "error.lighter",
                                  },
                                }}
                              >
                                <Delete fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </ListItemSecondaryAction>
                        </ListItem>
                        {index < fileUrls.length - 1 && <Divider />}
                      </React.Fragment>
                    ))}
                  </List>
                </Box>
              </>
            ) : (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                  minHeight: 180,
                  gap: 1,
                }}
              >
                <CloudUpload sx={{ fontSize: 48, color: "text.disabled", opacity: 0.5 }} />
                <Typography
                  variant="caption"
                  sx={{ color: "text.secondary", fontStyle: "italic", fontWeight: 500 }}
                >
                  No files uploaded
                </Typography>
                <Typography
                  variant="caption"
                  sx={{ color: "text.disabled", fontSize: "0.7rem" }}
                >
                  Click below to upload
                </Typography>
              </Box>
            )}
          </Paper>

          {uploadingFiles.length > 0 && (
            <Box sx={{ mb: 2 }}>
              <LinearProgress sx={{ mb: 1 }} />
              <Typography variant="caption" sx={{ color: "text.secondary" }}>
                Uploading {uploadingFiles.length} file{uploadingFiles.length > 1 ? 's' : ''}...
              </Typography>
            </Box>
          )}

          <Button
            variant={fileUrls.length > 0 ? "outlined" : "contained"}
            startIcon={<Upload />}
            onClick={() => fileInputRefs.current[fieldName]?.click()}
            fullWidth
            sx={{
              ...(fileUrls.length > 0 && {
                borderColor: "primary.main",
                "&:hover": {
                  borderColor: "primary.dark",
                  backgroundColor: "primary.lighter",
                },
              }),
            }}
          >
            {fileUrls.length > 0 ? `Upload More (${fileUrls.length} uploaded)` : "Upload Files"}
          </Button>
        </Box>
      </Grid>
    );
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 3, fontWeight: "bold" }}>
        Supporting Documents
      </Typography>
      <Grid container spacing={3}>
        {renderFileUpload("rfq", "RFQ- Details Requirement Draft", true)}
        {renderFileUpload("drawings", "Drawings (If Applicable)")}
        {renderFileUpload("layout", "Layout (If Applicable)")}
        {renderFileUpload("catalogue", "Catalogue (If Available)")}
        {renderFileUpload("offer1", "Offer 1", true)}
        {renderFileUpload("offer2", "Offer 2")}
        {renderFileUpload("offer3", "Offer 3")}
        {renderFileUpload("previousHistory", "Previous History & Present Status")}
      </Grid>

      <Box sx={{ mt: 3 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <Controller
              name="projectStatus"
              control={control}
              render={({ field }) => (
                <CustomSelect
                  {...field}
                  label="Project Status"
                >
                  <MenuItem value="Active">Active</MenuItem>
                  <MenuItem value="Inactive">Inactive</MenuItem>
                  <MenuItem value="On Hold">On Hold</MenuItem>
                  <MenuItem value="Completed">Completed</MenuItem>
                </CustomSelect>
              )}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Controller
              name="submitCheckBox"
              control={control}
              render={({ field }) => (
                <CustomSelect
                  {...field}
                  value={field.value ? "True" : "False"}
                  onChange={(e) => field.onChange(e.target.value === "True")}
                  label="Submit Check Box"
                >
                  <MenuItem value="False">False</MenuItem>
                  <MenuItem value="True">True</MenuItem>
                </CustomSelect>
              )}
            />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

