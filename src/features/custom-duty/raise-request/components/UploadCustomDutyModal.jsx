import React, { useState, useRef, useEffect } from "react";
import { Modal, Box, Button, Typography, LinearProgress } from "@mui/material";
import swal from "sweetalert";
import Iconify from "src/components/iconify/iconify";
import { userRequest } from "src/requestMethod";
import { getErrorMessage, showErrorMessage } from "src/utils/errorUtils";
import * as XLSX from "xlsx";

export default function UploadCustomDutyModal({ open, onClose, onSuccess }) {
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

  // Upload logic - extract data from Excel file
  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    setUploadProgress(0);
    setUploadError("");
    setUploadSuccess(false);

    try {
      let jsonData;

      if (selectedFile.name.toLowerCase().endsWith(".csv")) {
        // Handle CSV file
        const text = await selectedFile.text();
        const lines = text.split("\n");
        jsonData = lines.map((line) => line.split(","));
      } else {
        // Handle Excel file
        const arrayBuffer = await selectedFile.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: "array" });

        // Get the first worksheet
        const worksheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[worksheetName];

        // Convert to JSON
        jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      }

      // Skip header row and process data
      const headers = jsonData[0];
      const dataRows = jsonData.slice(1);

      // Map the data to our custom duty structure
      const extractedData = dataRows
        .map((row, index) => {
          const entry = {};
          headers.forEach((header, colIndex) => {
            const value = row[colIndex];
            if (value !== undefined && value !== null && value !== "") {
              // Map common column names to our field names for Custom Duty
              const fieldMap = {
                // Serial Number variations
                "Sr.No": "srNo",
                srNo: "srNo",
                sno: "srNo",
                srno: "srNo",
                SRNO: "srNo",
                "Serial Number": "srNo",
                "serial number": "srNo",
                "SERIAL NUMBER": "srNo",
                "Sr No": "srNo",
                "Sr. No": "srNo",

                // Challan Number variations
                "Challan No": "challanNo",
                "Challan No.": "challanNo",
                challanNo: "challanNo",
                challanno: "challanNo",
                CHALLANNO: "challanNo",
                "Challan Number": "challanNo",
                "challan number": "challanNo",
                "CHALLAN NUMBER": "challanNo",

                // Document Number variations
                "Document No": "documentNo",
                "Document No.": "documentNo",
                documentNo: "documentNo",
                documentno: "documentNo",
                DOCUMENTNO: "documentNo",
                "Document Number": "documentNo",
                "document number": "documentNo",
                "DOCUMENT NUMBER": "documentNo",

                // Transaction Date variations
                "Transaction Date": "transactionDate",
                transactionDate: "transactionDate",
                transactiondate: "transactionDate",
                TRANSACTIONDATE: "transactionDate",
                Date: "transactionDate",
                date: "transactionDate",
                DATE: "transactionDate",
                "Txn Date": "transactionDate",
                txnDate: "transactionDate",
                TxnDate: "transactionDate",

                // Reference ID variations
                "Reference ID": "referenceId",
                "Reference ID.": "referenceId",
                "Reference Id": "referenceId",
                "Reference Id.": "referenceId",
                referenceId: "referenceId",
                referenceid: "referenceId",
                REFERENCEID: "referenceId",
                Reference: "referenceId",
                reference: "referenceId",
                REFERENCE: "referenceId",
                "Ref ID": "referenceId",
                refId: "referenceId",
                RefId: "referenceId",

                // Description variations
                Description: "description",
                description: "description",
                DESCRIPTION: "description",
                Desc: "description",
                desc: "description",
                DESC: "description",
                Remarks: "description",
                remarks: "description",
                REMARKS: "remarks",

                // Type of Transaction variations
                "Type of Transaction": "typeOfTransaction",
                typeOfTransaction: "typeOfTransaction",
                typeoftransaction: "typeOfTransaction",
                TYPEOFTRANSACTION: "typeOfTransaction",
                "Transaction Type": "typeOfTransaction",
                transactionType: "typeOfTransaction",
                TransactionType: "typeOfTransaction",
                Type: "typeOfTransaction",
                type: "typeOfTransaction",
                TYPE: "typeOfTransaction",
                "Txn Type": "typeOfTransaction",
                txnType: "typeOfTransaction",
                TxnType: "typeOfTransaction",

                // Transaction Amount variations
                "Transaction Amount": "transactionAmount",
                transactionAmount: "transactionAmount",
                transactionamount: "transactionAmount",
                TRANSACTIONAMOUNT: "transactionAmount",
                Amount: "transactionAmount",
                amount: "transactionAmount",
                AMOUNT: "transactionAmount",
                "Txn Amount": "transactionAmount",
                txnAmount: "transactionAmount",
                TxnAmount: "transactionAmount",
                Value: "transactionAmount",
                value: "transactionAmount",
                VALUE: "transactionAmount",

                // Icegate Acknowledgement Number variations
                "Icegate Ack. No.": "icegateAckNo",
                icegateAckNo: "icegateAckNo",
                icegateackno: "icegateAckNo",
                ICEGATEACKNO: "icegateAckNo",
                "Icegate Ack No": "icegateAckNo",
                "Icegate Ack No.": "icegateAckNo",
                "Icegate Acknowledgement": "icegateAckNo",
                "icegate acknowledgement": "icegateAckNo",
                "ICEGATE ACKNOWLEDGEMENT": "icegateAckNo",
                "Ack No": "icegateAckNo",
                ackNo: "icegateAckNo",
                AckNo: "icegateAckNo",
                Acknowledgement: "icegateAckNo",
                acknowledgement: "icegateAckNo",
                ACKNOWLEDGEMENT: "icegateAckNo",
              };

              // Case-insensitive field mapping
              const normalizedHeader = header?.toString().trim();
              const fieldName =
                fieldMap[normalizedHeader] ||
                fieldMap[normalizedHeader?.toLowerCase()] ||
                fieldMap[normalizedHeader?.toUpperCase()] ||
                normalizedHeader?.toLowerCase().replace(/\s+/g, "");
              entry[fieldName] = value;
            }
          });

          // Ensure required fields have default values for Custom Duty
          return {
            ...entry,
            srNo: entry.srNo || (index + 1).toString(),
            challanNo: entry.challanNo || "",
            documentNo: entry.documentNo || "",
            transactionDate:
              entry.transactionDate || new Date().toISOString().split("T")[0],
            referenceId: entry.referenceId || "",
            description: entry.description || "",
            typeOfTransaction: entry.typeOfTransaction || "Debit",
            transactionAmount: parseFloat(entry.transactionAmount) || 0,
            icegateAckNo: entry.icegateAckNo || "",
          };
        })
        .filter((entry) => entry.transactionAmount > 0);

      setUploadProgress(100);
      setUploadSuccess(true);
      setSelectedFile(null);

      swal(
        "Upload Successful!",
        `Successfully extracted ${extractedData.length} custom duty entries from the file.`,
        "success"
      );

      if (onSuccess) onSuccess(extractedData);
    } catch (err) {
      console.error("Error processing Excel file:", err);
      setUploadError(
        "Error processing Excel file. Please ensure the file format is correct."
      );
      showErrorMessage(
        err,
        "Error processing Excel file. Please check the file format and try again.",
        swal
      );
    } finally {
      setUploading(false);
    }
  };

  // Simple sample download
  const handleDownloadSample = async () => {
    try {
      const sampleUrl =
        "https://ik.imagekit.io/mpnzxgplf/test-uploads/raise_request_sample.xlsx?updatedAt=1760362449028";
      
      const response = await fetch(sampleUrl);
      if (!response.ok) {
        throw new Error('Download failed');
      }      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);      
      const a = document.createElement("a");
      a.href = url;
      a.download = "Sample_Custom_Duty.xlsx";
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Download error:', error);
      const sampleUrl =
        "https://ik.imagekit.io/mpnzxgplf/test-uploads/raise_request_sample.xlsx?updatedAt=1760362449028";
      window.open(sampleUrl, '_blank');
    }
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
