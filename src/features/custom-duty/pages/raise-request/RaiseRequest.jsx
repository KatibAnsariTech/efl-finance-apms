import { Helmet } from "react-helmet-async";
import { useState, useEffect, useCallback } from "react";

import {
  Container,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  Grid,
  Paper,
  IconButton,
  Chip,
  CircularProgress,
  FormControl,
  FormControlLabel,
  Switch,
  Divider,
  Select,
  MenuItem,
  InputLabel,
  TextField,
  Autocomplete,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { fDateTime } from "src/utils/format-time";
import Iconify from "src/components/iconify/iconify";
import { userRequest } from "src/requestMethod";
import swal from "sweetalert";
import { showErrorMessage } from "src/utils/errorUtils";
import { UploadCustomDutyModal } from "../../components";
import ConfirmationModal from "src/components/ConfirmationModal";

export default function RaiseRequest() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [autoReversal, setAutoReversal] = useState("No");
  const [showInfoText, setShowInfoText] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [isAfter3PM, setIsAfter3PM] = useState(false);

  const checkTimeRestriction = useCallback(() => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTime = currentHour * 60 + currentMinute;
    const cutoffTime = 15 * 60; // 3:00 PM = 15:00 = 900 minutes
    return currentTime >= cutoffTime;
  }, []);


  const companies = [
    { id: 1, name: "EFL" },
    { id: 2, name: "Eureka Forbes" },
    { id: 3, name: "Eureka Industries" },
  ];

  const BASE_URL = "https://crd-test-2ib6.onrender.com/api/v1/journal-vouchers";


  useEffect(() => {
    setIsAfter3PM(checkTimeRestriction());    
    const interval = setInterval(() => {
      setIsAfter3PM(checkTimeRestriction());
    }, 60000);
    return () => clearInterval(interval);
  }, [checkTimeRestriction]);

  // Add new custom duty entry to local state
  const addCustomDutyEntry = (newEntry) => {
    const entryWithId = {
      ...newEntry,
      _id: `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      sNo: newEntry.sNo || "",
      createdAt: new Date().toISOString(),
    };
    setData((prev) => [...prev, entryWithId]);
  };

  const handleUploadSuccess = (uploadedEntries) => {
    // Replace existing data with uploaded entries
    setData(uploadedEntries);
    setUploadModalOpen(false);
    swal("Success!", "Custom duty entries uploaded successfully!", "success");
  };

  const handleSubmitRequest = async () => {
    if (isAfter3PM) {
      swal("Time Restriction", "Cannot generate requests after 3:00 PM. Please try again tomorrow.", "warning");
      return;
    }
    setConfirmModalOpen(true);
  };

  const handleConfirmSubmit = async () => {
    try {
      setSubmitting(true);
      const journalVouchers = data.map((entry) => ({
        sNo: entry.sNo?.toString(),
        documentType: entry.documentType,
        documentDate: entry.documentDate,
        businessArea: entry.businessArea,
        accountType: entry.accountType,
        postingKey: entry.postingKey,
        vendorCustomerGLNumber: entry.vendorCustomerGLNumber,
        amount: parseFloat(entry.amount),
        assignment: entry.assignment,
        profitCenter: entry.profitCenter,
        specialGLIndication: entry.specialGLIndication,
        referenceNumber: entry.referenceNumber,
        remarks: entry.remarks,
        postingDate: entry.postingDate,
        vendorCustomerGLName: entry.vendorCustomerGLName,
        costCenter: entry.costCenter,
        personalNumber: entry.personalNumber,
        autoReversal: autoReversal === "Yes" ? "Y" : "N",
      }));

      const requestBody = {
        journalVouchers,
      };

      // Call the custom duty API endpoint
      const response = await userRequest.post(
        `${BASE_URL}/createCustomDuty`,
        requestBody
      );

      swal(
        "Success!",
        "Custom duty request submitted successfully!",
        "success"
      );

      // Reset form
      setData([]);
      setAutoReversal("No");
      setConfirmModalOpen(false);
    } catch (error) {
      console.error("Submit error:", error);
      showErrorMessage(error, "Failed to submit custom duty request", swal);
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusChip = (status) => {
    const statusConfig = {
      Draft: { color: "default", label: "Draft" },
      Submitted: { color: "info", label: "Submitted" },
      Approved: { color: "success", label: "Approved" },
      Rejected: { color: "error", label: "Rejected" },
      Pending: { color: "warning", label: "Pending" },
    };

    const config = statusConfig[status] || { color: "default", label: status };
    return <Chip label={config.label} color={config.color} size="small" />;
  };

  const columns = [
    {
      field: "srNo",
      headerName: "Sr.no.",
      width: 80,
      align: "center",
      headerAlign: "center",
      resizable: true,
    },
    {
      field: "challanNo",
      headerName: "Challan No.",
      width: 150,
      resizable: true,
    },
    {
      field: "documentNo",
      headerName: "Document No",
      width: 150,
      resizable: true,
    },
    {
      field: "transactionDate",
      headerName: "Transaction Date",
      width: 200,
      resizable: true,
      renderCell: (params) => {
        if (!params.value) return "";
        const date = new Date(params.value);
        return isNaN(date.getTime())
          ? params.value
          : date.toLocaleString("en-GB", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              fractionalSecondDigits: 3,
            });
      },
    },
    {
      field: "referenceId",
      headerName: "Reference ID",
      width: 200,
      resizable: true,
      renderCell: (params) => (
        <Box
          sx={{
            maxWidth: "100%",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
          title={params.value}
        >
          {params.value}
        </Box>
      ),
    },
    {
      field: "description",
      headerName: "Description",
      width: 150,
      resizable: true,
    },
    {
      field: "typeOfTransaction",
      headerName: "Type of Transaction",
      width: 180,
      resizable: true,
      // renderCell: (params) => (
      //   <Chip
      //     label={params.value}
      //     color={params.value === "Debit" ? "error" : "success"}
      //     size="small"
      //     variant="outlined"
      //   />
      // ),
    },
    {
      field: "transactionAmount",
      headerName: "Transaction Amount",
      width: 180,
      resizable: true,
      renderCell: (params) => `₹${params.value?.toLocaleString() || "0"}`,
    },
    {
      field: "icegateAckNo",
      headerName: "Icegate Ack. No.",
      width: 200,
      resizable: true,
    },
  ];

  return (
    <>
      <Helmet>
        <title>Initiate Journal Voucher</title>
      </Helmet>

      <Container maxWidth="xl" sx={{ mb: -15 }}>
        <Box
          sx={{
            mb: 1,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography
              variant="body2"
              sx={{ fontSize: "0.85rem", fontWeight: 800 }}
            >
              Company:
            </Typography>
            <Autocomplete
              value={selectedCompany}
              onChange={(event, newValue) => {
                setSelectedCompany(newValue);
              }}
              options={companies}
              getOptionLabel={(option) => option.name}
              isOptionEqualToValue={(option, value) => option.id === value?.id}
              sx={{ minWidth: 160 }}
              ListboxProps={{
                sx: {
                  "& .MuiAutocomplete-option": {
                    fontSize: "0.85rem",
                  },
                },
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Select"
                  size="small"
                  variant="standard"
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      height: "40px",
                    },
                    "& .MuiInputBase-input": {
                      fontSize: "0.85rem",
                      fontWeight:"500"
                    },
                    "& .MuiInputBase-input::placeholder": {
                      fontSize: "0.85rem",
                    },
                  }}
                />
              )}
            />
          </Box>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              gap: 0.2,
            }}
          >
            {isAfter3PM ? (
              <span
                style={{
                  fontSize: "0.75rem",
                  color: "red",
                  marginRight: "4px",
                  fontWeight: "500",
                }}
              >
                Cannot generate requests or upload files after 3:00 PM. Please try again tomorrow.
              </span>
            ) : (
              showInfoText && (
                <span
                  style={{
                    fontSize: "0.75rem",
                    color: "red",
                    marginRight: "4px",
                    fontWeight: "500",
                  }}
                >
                  use a unique serial number for each SAP debit and credit entry
                </span>
              )
            )}
            <IconButton
              size="small"
              color="error"
              sx={{ p: 0, mr: 0.5 }}
              onClick={() => setShowInfoText(!showInfoText)}
            >
              <Iconify icon="eva:info-fill" />
            </IconButton>
            <span
              style={{
                fontSize: "0.875rem",
                fontWeight: "bold",
                color: "#2c72d8",
              }}
            >
              |
            </span>
            <Button
              variant="text"
              size="small"
              onClick={() => {
                if (isAfter3PM) {
                  swal("Time Restriction", "Cannot upload files after 3:00 PM. Please try again tomorrow.", "warning");
                  return;
                }
                setUploadModalOpen(true);
              }}
              disabled={isAfter3PM}
              sx={{
                fontSize: "0.875rem",
                color: isAfter3PM ? "red" : "primary.main",
                "&:hover": {
                  backgroundColor: "transparent",
                },
                "&.Mui-disabled": {
                  color: "red",
                  opacity: 0.8,
                },
              }}
            >
              Upload File
            </Button>
          </Box>
        </Box>

        <Card>
          <CardContent
            sx={{
              p: 0,
              "&:last-child": {
                pb: 0,
              },
            }}
          >
            {data.length === 0 && !loading ? (
              <Paper
                sx={{
                  p: 6,
                  textAlign: "center",
                  backgroundColor: "#fafafa",
                  borderRadius: 2,
                  m: 2,
                }}
              >
                <Iconify
                  icon="eva:folder-outline"
                  sx={{
                    width: 48,
                    height: 48,
                    color: "text.disabled",
                    mb: 1.5,
                  }}
                />
                <Typography
                  variant="h6"
                  color="text.secondary"
                  gutterBottom
                  sx={{ fontSize: "1rem" }}
                >
                  No Data
                </Typography>
              </Paper>
            ) : (
              <Box
                sx={{
                  height: "calc(100vh - 200px)",
                  marginBottom: { xs: "0px", sm: "0px" },
                  minHeight: "300px",
                  maxHeight: "70vh",
                }}
              >
                <DataGrid
                  rows={data}
                  columns={columns}
                  getRowId={(row) => row._id || row.sNo}
                  loading={loading}
                  pagination={false}
                  disableRowSelectionOnClick
                  disableRowClick
                  columnResize
                  disableColumnResize={false}
                  hideFooter
                  autoHeight={false}
                  columnResizeMode="onResize"
                  editMode="cell"
                  sx={{
                    height: "100%",
                    border: "none",
                    "& .MuiDataGrid-cell": {
                      "&:focus": {
                        outline: "none",
                      },
                      "&:focus-visible": {
                        outline: "none",
                      },
                    },
                    "& .MuiDataGrid-row": {
                      "&:focus": {
                        outline: "none",
                      },
                      "&:focus-visible": {
                        outline: "none",
                      },
                    },
                    "& .MuiDataGrid-columnHeaders": {
                      backgroundColor: "#f5f6f8",
                      fontWeight: "bold",
                      color: "#637381",
                    },
                    "& .MuiDataGrid-cell:focus": {
                      outline: "none",
                    },
                    "& .MuiDataGrid-row:hover": {
                      backgroundColor: "rgba(0, 0, 0, 0.04)",
                    },
                  }}
                />
              </Box>
            )}
          </CardContent>
        </Card>

        {/* Footer section - only show when there's data */}
        {data.length > 0 && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              flexDirection: { xs: "column", sm: "row" },
              gap: { xs: 2, sm: 0 },
              minHeight: { xs: "auto", sm: "60px" },
              mt: { xs: 1, xl: 2 },
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                width: { xs: "100%", sm: "auto" },
                justifyContent: { xs: "center", sm: "flex-start" },
              }}
            >
            </Box>

            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmitRequest}
              disabled={data.length === 0 || isAfter3PM}
              sx={{
                px: { xs: 2, sm: 3 },
                py: { xs: 1.5, sm: 1 },
                fontSize: { xs: "0.8rem", sm: "0.875rem" },
                fontWeight: "bold",
                width: { xs: "100%", sm: "auto" },
                minWidth: { xs: "auto", sm: "240px" },
                "&.Mui-disabled": {
                  backgroundColor: isAfter3PM ? "error.main" : "rgba(0, 0, 0, 0.12)",
                  color: isAfter3PM ? "white" : "rgba(0, 0, 0, 0.26)",
                },
              }}
            >
              Submit Request
            </Button>
          </Box>
        )}

        <UploadCustomDutyModal
          open={uploadModalOpen}
          onClose={() => setUploadModalOpen(false)}
          onSuccess={handleUploadSuccess}
        />

        {/* Confirmation Modal */}
        <ConfirmationModal
          open={confirmModalOpen}
          onClose={() => setConfirmModalOpen(false)}
          onConfirm={handleConfirmSubmit}
          data={data}
          autoReversal={autoReversal}
          loading={submitting}
        />
      </Container>
    </>
  );
}
