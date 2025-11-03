import React, { useState, useEffect } from "react";
import {
  Modal,
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
  CircularProgress,
} from "@mui/material";
import { RxCross2 } from "react-icons/rx";
import { userRequest } from "src/requestMethod";
import { showErrorMessage } from "src/utils/errorUtils";
import swal from "sweetalert";

const SAPResponseModal = ({ open, onClose, rowData }) => {
  const [sapData, setSapData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchSapData = async () => {
      if (!open || !rowData?.groupId) {
        setSapData(null);
        return;
      }

      setLoading(true);
      try {
        const response = await userRequest.get(
          `jvm/getSapApiLogByGroupId?groupId=${rowData.groupId}`
        );

        if (response.data.statusCode === 200 && response.data.data) {
          setSapData(response.data.data);
        } else {
          setSapData(null);
        }
      } catch (error) {
        const isNotFound = error.response?.data?.statusCode === 404 || 
                          error.response?.data?.message?.toLowerCase().includes("no sap api log found");
        
        if (!isNotFound) {
          console.error("Error fetching SAP API log:", error);
          showErrorMessage(error, "Failed to fetch SAP response data", swal);
        }
        setSapData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchSapData();
  }, [open, rowData?.groupId]);

  const sapFields = sapData ? {
    "EV_ACCOUNTING_DOCUMENT_NUMBER": sapData.EV_ACCOUNTING_DOCUMENT_NUMBER || "",
    "EV_MESSAGE": sapData.EV_MESSAGE || "",
    "EV_STATUS": sapData.EV_STATUS || "",
  } : {};

  const displayFields = sapData ? Object.entries(sapFields) : [];

  const isError = (sapFields.EV_STATUS || "").toUpperCase() === "E";

  const formatFieldName = (fieldName) => {
    return fieldName
      .replace(/_/g, " ")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 700,
          bgcolor: "background.paper",
          boxShadow: 24,
          borderRadius: 5,
          p: 4,
          outline: "none",
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 3,
          }}
        >
          <Typography 
            variant="h5" 
            sx={{ 
              fontWeight: "bold",
              fontSize: "1.5rem",
            }}
          >
            SAP Response Details
          </Typography>
          <IconButton
            onClick={onClose}
            sx={{ color: "#B22222" }}
          >
            <RxCross2 size={20} />
          </IconButton>
        </Box>

        <Box sx={{ pb: 2 }}>
        {loading ? (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              py: 4,
            }}
          >
            <CircularProgress />
          </Box>
        ) : displayFields.length > 0 ? (
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
              {displayFields.map(([fieldName, value], index) => {
                const isStatusField = fieldName.toUpperCase().includes("STATUS");
                const isMessageField = fieldName.toUpperCase().includes("MESSAGE");
                const isError = (sapFields.EV_STATUS || "").toUpperCase() === "E";
                const displayValue = value || "-";
                
                return (
                  <TableRow key={fieldName}>
                    <TableCell
                      sx={{
                        fontWeight: 500,
                      }}
                    >
                      {formatFieldName(fieldName)}
                    </TableCell>
                    <TableCell
                    >
                      {isStatusField ? (
                        displayValue !== "-" ? (
                          <Chip
                            label={displayValue}
                            color={displayValue.toUpperCase() === "SUCCESS" || displayValue.toUpperCase() === "S" ? "success" : "error"}
                            size="small"
                            sx={{ fontWeight: 600 }}
                          />
                        ) : (
                          <Typography variant="body2">-</Typography>
                        )
                      ) : isMessageField && isError && displayValue !== "-" ? (
                        <Typography variant="body2" sx={{ color: "error.main", fontWeight: 500 }}>
                          {displayValue}
                        </Typography>
                      ) : (
                        <Typography variant="body2">{displayValue}</Typography>
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

        {isError && (
          <Box sx={{ mt: 3, display: "flex", justifyContent: "flex-end" }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => {
                console.log("Retry clicked for row:", rowData);
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
          </Box>
        )}
        </Box>
      </Box>
    </Modal>
  );
};

export default SAPResponseModal;

