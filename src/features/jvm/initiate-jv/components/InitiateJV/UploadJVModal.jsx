import React, { useState, useRef, useEffect } from "react";
import { Modal, Box, Button, Typography, LinearProgress } from "@mui/material";
import swal from "sweetalert";
import Iconify from "src/components/iconify/iconify";
import { userRequest } from "src/requestMethod";
import { getErrorMessage, showErrorMessage } from "src/utils/errorUtils";
import * as XLSX from 'xlsx';
import { validateAllJVEntries } from "../../utils/validationUtils"; // Import validation utility

export default function UploadJVModal({ open, onClose, onSuccess }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [uploadError, setUploadError] = useState("");
  const [dragActive, setDragActive] = useState(false);
  // Masters for validation
  const [docTypes, setDocTypes] = useState([]);
  const [accountTypes, setAccountTypes] = useState([]);
  const [postingKeyMasters, setPostingKeyMasters] = useState([]);
  const [specialGLMasters, setSpecialGLMasters] = useState([]);

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

  // Fetch master data for validation when modal opens
  useEffect(() => {
    const fetchMasters = async () => {
      if (!open) return;
      try {
        const [dtRes, atRes, pkRes, sgRes] = await Promise.all([
          userRequest.get("/jvm/getMasters?key=DocumentType&page=1&limit=1000"),
          userRequest.get("/jvm/getMasters?key=AccountType&page=1&limit=1000"),
          userRequest.get("/jvm/getMasters?key=PostingKey&page=1&limit=1000"),
          userRequest.get("/jvm/getMasters?key=SpecialGLIndication&page=1&limit=1000"),
        ]);

        if (dtRes?.data?.success) {
          setDocTypes((dtRes.data.data?.masters || []).map((m) => (m.value || "").toString().trim().toUpperCase()));
        }
        if (atRes?.data?.success) {
          setAccountTypes((atRes.data.data?.masters || []).map((m) => (m.value || "").toString().trim()));
        }
        if (pkRes?.data?.success) {
          setPostingKeyMasters(pkRes.data.data?.masters || []);
        }
        if (sgRes?.data?.success) {
          setSpecialGLMasters(sgRes.data.data?.masters || []);
        }
      } catch (err) {
        console.error("Error fetching masters for validation:", err);
        showErrorMessage(err, "Failed to load master data for validation", swal);
      }
    };
    fetchMasters();
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


  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setUploadProgress(0);
    setUploadError("");
    setUploadSuccess(false);

    try {
      setUploadProgress(10);
      // 1) Parse file locally first
      let jsonData;
      
      if (selectedFile.name.toLowerCase().endsWith('.csv')) {
        const text = await selectedFile.text();
        const lines = text.split('\n');
        jsonData = lines.map(line => line.split(','));
      } else {
        const arrayBuffer = await selectedFile.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });
        
        const worksheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[worksheetName];
        
        jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      }
      
      const headers = jsonData[0];
      const dataRows = jsonData.slice(1);
      
      const extractedData = dataRows.map((row, index) => {
        const entry = {};
        headers.forEach((header, colIndex) => {
          const value = row[colIndex];
          if (value !== undefined && value !== null && value !== '') {
            const fieldMap = {
              // JV No variations - all map to slNo for backend compatibility
              'slNo': 'slNo',
              'SlNo': 'slNo',
              'SLNO': 'slNo',
              'JV No': 'slNo',
              'jvNo': 'slNo',
              'jvno': 'slNo',
              'JVNO': 'slNo',
              'Sr.No': 'slNo',
              'srNo': 'slNo',
              'sno': 'slNo',
              'srno': 'slNo',
              'SRNO': 'slNo',
              'Serial Number': 'slNo',
              'serial number': 'slNo',
              'SERIAL NUMBER': 'slNo',
              'Document Type': 'documentType',
              'Document Date': 'documentDate',
              'Business Area': 'businessArea',
              'Account Type': 'accountType',
              'Posting Key': 'postingKey',
              'Type': 'type',
              'Vendor/Customer/GL Number': 'vendorCustomerGLNumber',
              'Vendor/Customer/GL Name': 'vendorCustomerGLName',
              'Amount': 'amount',
              'Assignment': 'assignment',
              'Cost Center': 'costCenter',
              'Profit Center': 'profitCenter',
              'Special GL Indication': 'specialGLIndication',
              'Reference Number': 'referenceNumber',
              'Personal Number': 'personalNumber',
              'Remarks': 'remarks',
              'Posting Date': 'postingDate',
              // Direct field name mapping
              'documentType': 'documentType',
              'documentDate': 'documentDate',
              'businessArea': 'businessArea',
              'accountType': 'accountType',
              'postingKey': 'postingKey',
              'type': 'type',
              'vendorCustomerGLNumber': 'vendorCustomerGLNumber',
              'vendorCustomerGLName': 'vendorCustomerGLName',
              'amount': 'amount',
              'assignment': 'assignment',
              'costCenter': 'costCenter',
              'profitCenter': 'profitCenter',
              'specialGLIndication': 'specialGLIndication',
              'referenceNumber': 'referenceNumber',
              'personalNumber': 'personalNumber',
              'remarks': 'remarks',
              'postingDate': 'postingDate'
              
            };
            
            // Case-insensitive field mapping
            const normalizedHeader = header?.toString().trim();
            const fieldName = fieldMap[normalizedHeader] || 
                             fieldMap[normalizedHeader?.toLowerCase()] || 
                             fieldMap[normalizedHeader?.toUpperCase()] ||
                             normalizedHeader?.toLowerCase().replace(/\s+/g, '');
            entry[fieldName] = value;
          }
        });
        
        // Ensure required fields have default values
        return {
          ...entry,
          slNo: entry.slNo || '',
          documentType: entry.documentType || 'DR',
          documentDate: entry.documentDate || new Date().toISOString().split('T')[0],
          postingDate: entry.postingDate || new Date().toISOString().split('T')[0],
          businessArea: entry.businessArea || '1000',
          accountType: entry.accountType || 'S',
          postingKey: entry.postingKey || '40',
          type: entry.type || 'Debit',
          amount: parseFloat(entry.amount) || 0,
          assignment: entry.assignment || '',
          profitCenter: entry.profitCenter || '1000',
          specialGLIndication: entry.specialGLIndication || 'N',
          referenceNumber: entry.referenceNumber || '',
          remarks: entry.remarks || '',
          vendorCustomerGLName: entry.vendorCustomerGLName || '',
          costCenter: entry.costCenter || '1000',
          personalNumber: entry.personalNumber || ''
        };
      }).filter(entry => entry.amount > 0); // Filter out entries with zero amount

      setUploadProgress(50);

      // 2) Validate against master data and relationships
      const errors = [];
      const normalize = (v) => (v ?? "").toString().trim();
      const normalizeUpper = (v) => normalize(v).toUpperCase();

      // Build quick lookup for PK/SG allowed by accountType (by label/value)
      const pkAllowedByAcct = postingKeyMasters.reduce((acc, m) => {
        const other0 = Array.isArray(m.other) ? m.other[0] : undefined;
        const acct = other0 ? (typeof other0 === "object" ? normalize(other0.value) : normalize(other0)) : "";
        if (!acct) return acc;
        acc[acct] = acc[acct] || new Set();
        acc[acct].add(normalize(m.value));
        return acc;
      }, {});
      const sgAllowedByAcct = specialGLMasters.reduce((acc, m) => {
        const other0 = Array.isArray(m.other) ? m.other[0] : undefined;
        const acct = other0 ? (typeof other0 === "object" ? normalize(other0.value) : normalize(other0)) : "";
        if (!acct) return acc;
        acc[acct] = acc[acct] || new Set();
        acc[acct].add(normalize(m.value));
        return acc;
      }, {});

      const pkAll = new Set(postingKeyMasters.map((m) => normalize(m.value)));
      const sgAll = new Set(specialGLMasters.map((m) => normalize(m.value)));
      const dtAll = new Set(docTypes);
      const atAll = new Set(accountTypes.map((v) => normalize(v)));

      extractedData.forEach((row, idx) => {
        const line = idx + 2; // considering headers at line 1
        const dt = normalizeUpper(row.documentType);
        const at = normalize(row.accountType);
        const pk = normalize(row.postingKey);
        const sg = normalize(row.specialGLIndication);

        if (!dtAll.has(dt)) {
          errors.push(`Row ${line}: Invalid Document Type '${row.documentType}'`);
        }
        if (!atAll.has(at)) {
          errors.push(`Row ${line}: Invalid Account Type '${row.accountType}'`);
        }
        if (!pkAll.has(pk)) {
          errors.push(`Row ${line}: Invalid Posting Key '${row.postingKey}'`);
        }
        if (!sgAll.has(sg)) {
          errors.push(`Row ${line}: Invalid Special GL Indication '${row.specialGLIndication}'`);
        }
        // Relationship checks only if Account Type is valid
        if (atAll.has(at)) {
          const allowedPK = pkAllowedByAcct[at];
          if (allowedPK && !allowedPK.has(pk)) {
            errors.push(`Row ${line}: Posting Key '${row.postingKey}' not allowed for Account Type '${row.accountType}'`);
          }
          const allowedSG = sgAllowedByAcct[at];
          if (allowedSG && !allowedSG.has(sg)) {
            errors.push(`Row ${line}: Special GL '${row.specialGLIndication}' not allowed for Account Type '${row.accountType}'`);
          }
        }
      });

      if (errors.length > 0) {
        const maxShow = 15;
        const msg = errors.slice(0, maxShow).join("\n") + (errors.length > maxShow ? `\n...and ${errors.length - maxShow} more.` : "");
        setUploadError("Validation failed. See details.");
        swal({ title: "Validation Errors", text: msg, icon: "error" });
        setUploading(false);
        return;
      }

      const validationResults = validateAllJVEntries(extractedData);

      if (!validationResults.isValid) {
        const errorMessages = validationResults.errors.map((error) => {
          if (error.type === "entryLimit") {
            return error.details
              .map(
                (group) =>
                  `Serial Number ${group.slNo}: ${group.count} entries (Limit: ${group.limit})`
              )
              .join("\n");
          } else if (error.type === "balance") {
            return error.details
              .map(
                (group) =>
                  `Serial Number ${
                    group.slNo
                  }: Debit ₹${group.debit.toLocaleString()} vs Credit ₹${group.credit.toLocaleString()} (Difference: ₹${group.difference.toLocaleString()})`
              )
              .join("\n");
          } else if (error.type === "dateConsistency") {
            return error.details
              .map((group) => {
                let message = `Serial Number ${group.slNo}:`;
                if (group.inconsistentDocumentDate) {
                  message += `\n  - Document Date inconsistency`;
                }
                if (group.inconsistentPostingDate) {
                  message += `\n  - Posting Date inconsistency`;
                }
                return message;
              })
              .join("\n\n");
          }
        });

        swal({
          title: "Validation Errors",
          text: errorMessages.join("\n\n"),
          icon: "error",
          button: "OK",
        });
        setUploading(false);
        return;
      }

      setUploadProgress(70);

      // 3) Only now upload file to server
      const formData = new FormData();
      formData.append('file', selectedFile);
      
      const uploadResponse = await userRequest.post('/util/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        onUploadProgress: (progressEvent) => {
          const percentCompleted = Math.round((progressEvent.loaded * 30) / progressEvent.total);
          setUploadProgress(70 + percentCompleted);
        },
      });

      if (!uploadResponse.data.success) {
        throw new Error(uploadResponse.data.msg || 'File upload failed');
      }

      const fileUrl = uploadResponse.data.data;

      setUploadProgress(100);
      setUploadSuccess(true);
      setSelectedFile(null);

      swal("Upload Successful!", `Successfully uploaded file and extracted ${extractedData.length} journal voucher entries.`, "success");

      if (onSuccess) onSuccess(extractedData, fileUrl);
    } catch (err) {
      console.error("Error uploading/processing file:", err);
      
      // Determine if it's an upload error or processing error
      const isUploadError = err.message?.includes('upload') || err.response?.status >= 400;
      const errorMessage = isUploadError 
        ? "Error uploading file. Please try again." 
        : "Error processing Excel file. Please ensure the file format is correct.";
      
      setUploadError(errorMessage);
      showErrorMessage(
        err,
        isUploadError 
          ? "Failed to upload file. Please check your connection and try again."
          : "Error processing Excel file. Please check the file format and try again.",
        swal
      );
    } finally {
      setUploading(false);
    }
  };

  // Simple sample download
  const handleDownloadSample = () => {
    const sampleUrl = "/sample-files/jv-sample.csv"; // <-- fixed location
    const a = document.createElement("a");
    a.href = sampleUrl;
    a.download = "Sample_JV.csv";
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
            accept=".xls,.xlsx,.csv"
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
                Drag & drop Excel/CSV file here, or click to select
              </Typography>
              <Typography variant="caption" sx={{ color: "#bdbdbd", mt: 0.5 }}>
                Only .xls, .xlsx, .csv files are supported
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
