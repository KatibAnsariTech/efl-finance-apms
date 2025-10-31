import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Chip,
  IconButton,
} from "@mui/material";
import { RxCross2 } from "react-icons/rx";

const SAPResponseModal = ({ open, onClose, rowData }) => {
  if (!rowData) return null;

  // Extract SAP response fields - check for various possible field names
  const sapFields = {
    "EV_ACCOUNTING_DOCUMENT_NUMBER": rowData.EV_ACCOUNTING_DOCUMENT_NUMBER || rowData.evAccountingDocumentNumber || rowData.sapDocumentNumber || "",
    "EV_MESSAGE": rowData.EV_MESSAGE || rowData.evMessage || rowData.sapMessage || "",
    "EV_STATUS": rowData.EV_STATUS || rowData.evStatus || rowData.sapStatus || "",
  };

  // Get all SAP-related fields from rowData
  const allSapFields = {};
  Object.keys(rowData).forEach((key) => {
    // Include fields that start with EV_, ev, SAP, sap, or are known SAP fields
    if (
      key.startsWith("EV_") ||
      key.startsWith("ev") ||
      key.startsWith("SAP_") ||
      key.startsWith("sap") ||
      key.toLowerCase().includes("sap") ||
      key.toLowerCase().includes("ev_")
    ) {
      allSapFields[key] = rowData[key];
    }
  });

  // If no specific EV fields found, use allSapFields
  const displayFields = Object.keys(allSapFields).length > 0 
    ? allSapFields 
    : sapFields;

  const isError = (sapFields.EV_STATUS || "").toUpperCase() === "E";

  // Filter out empty values and format field names
  const filteredFields = Object.entries(displayFields).filter(
    ([_, value]) => value !== null && value !== undefined && value !== ""
  );

  const formatFieldName = (fieldName) => {
    // Convert camelCase/PascalCase to readable format
    return fieldName
      .replace(/([A-Z])/g, " $1")
      .replace(/_/g, " ")
      .replace(/^./, (str) => str.toUpperCase())
      .trim();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: 3,
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          pb: 2,
          borderBottom: "1px solid #e0e0e0",
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600, fontSize: "1.25rem" }}>
          SAP Response Details
        </Typography>
        <IconButton
          onClick={onClose}
          size="small"
          sx={{
            color: "#B22222",
            "&:hover": {
              backgroundColor: "#ffebee",
            },
          }}
        >
          <RxCross2 style={{ fontSize: "20px" }} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 3 }}>
        {filteredFields.length > 0 ? (
          <Table sx={{ mb: isError ? 3 : 0 }}>
            <TableHead>
              <TableRow>
                <TableCell
                  sx={{
                    backgroundColor: "#083389",
                    color: "white",
                    fontWeight: 600,
                    borderTopLeftRadius: 8,
                    width: "40%",
                  }}
                >
                  Field Name
                </TableCell>
                <TableCell
                  sx={{
                    backgroundColor: "#083389",
                    color: "white",
                    fontWeight: 600,
                    borderTopRightRadius: 8,
                    width: "60%",
                  }}
                >
                  Value
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredFields.map(([fieldName, value], index) => {
                const isStatusField = fieldName.toUpperCase().includes("STATUS");
                return (
                  <TableRow key={fieldName}>
                    <TableCell
                      sx={{
                        fontWeight: 500,
                        backgroundColor: index % 2 === 0 ? "#f9f9f9" : "white",
                      }}
                    >
                      {formatFieldName(fieldName)}
                    </TableCell>
                    <TableCell
                      sx={{
                        backgroundColor: index % 2 === 0 ? "#f9f9f9" : "white",
                      }}
                    >
                      {isStatusField && value ? (
                        <Chip
                          label={value}
                          color={value.toUpperCase() === "E" ? "error" : "success"}
                          size="small"
                          sx={{ fontWeight: 600 }}
                        />
                      ) : (
                        <Typography variant="body2">{value || "-"}</Typography>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        ) : (
          <Box
            sx={{
              textAlign: "center",
              py: 4,
              color: "text.secondary",
            }}
          >
            <Typography variant="body1">
              No SAP response data available for this record.
            </Typography>
          </Box>
        )}

        {isError && (
          <Box
            sx={{
              mt: 3,
              p: 2,
              backgroundColor: "#fff3e0",
              borderRadius: 1,
              borderLeft: "4px solid #ff9800",
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 600, mb: 1, color: "#e65100" }}>
              Error Status Detected
            </Typography>
            <Typography variant="body2" color="text.secondary">
              This transaction has an error status. Please review the details above and retry if necessary.
            </Typography>
          </Box>
        )}
      </DialogContent>

      <DialogActions
        sx={{
          px: 3,
          pb: 3,
          pt: 2,
          borderTop: "1px solid #e0e0e0",
        }}
      >
        <Button onClick={onClose} variant="outlined" sx={{ mr: 1 }}>
          Close
        </Button>
        {isError && (
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              // Retry functionality - to be implemented later
              console.log("Retry clicked for row:", rowData);
              // TODO: Implement retry logic
            }}
            sx={{
              backgroundColor: "#4caf50",
              "&:hover": {
                backgroundColor: "#45a049",
              },
            }}
          >
            Retry
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default SAPResponseModal;

