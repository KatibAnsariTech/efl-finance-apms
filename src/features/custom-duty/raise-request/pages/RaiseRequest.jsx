import { Helmet } from "react-helmet-async";
import { useState, useEffect, useCallback } from "react";

import {
  Container,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  Paper,
  IconButton,
  TextField,
  Autocomplete,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import Iconify from "src/components/iconify/iconify";
import { userRequest } from "src/requestMethod";
import swal from "sweetalert";
import { showErrorMessage } from "src/utils/errorUtils";
import UploadCustomDutyModal from "../components/UploadCustomDutyModal.jsx";
import { RaiseRequestColumns } from "../components/RaiseRequestColumns.jsx";

export default function RaiseRequest() {
  const [data, setData] = useState([]);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [showInfoText, setShowInfoText] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState(null);
  const [isAfter3PM, setIsAfter3PM] = useState(false);
  const [companies, setCompanies] = useState([]);

  const checkTimeRestriction = useCallback(() => {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const currentTime = currentHour * 60 + currentMinute;

    // Restriction starts at 2:59:59 PM (14:59) and ends at 11:59:59 PM (23:59)
    const restrictionStartTime = 14 * 60 + 59; // 2:59 PM = 899 minutes
    const restrictionEndTime = 23 * 60 + 59; // 11:59 PM = 1439 minutes

    return (
      currentTime >= restrictionStartTime && currentTime <= restrictionEndTime
    );
  }, []);

  const showTimeRestrictionAlert = useCallback((action) => {
    swal(
      "Time Restriction",
      `Cannot ${action} after 3:00 PM. Please try again tomorrow.`,
      "warning"
    );
  }, []);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await userRequest.get("/custom/getCompanies");
        setCompanies(response.data.data.companies); 
      } catch (error) {
        console.error("Failed to fetch companies:", error);
        showErrorMessage(error, "Failed to fetch companies", swal);
      }
    };

    fetchCompanies();
  }, []);

  useEffect(() => {
    setIsAfter3PM(checkTimeRestriction());
    const interval = setInterval(() => {
      setIsAfter3PM(checkTimeRestriction());
    }, 60000);
    return () => clearInterval(interval);
  }, [checkTimeRestriction]);

  const handleUploadSuccess = (uploadedEntries) => {
    // Add unique IDs to each entry for DataGrid
    const entriesWithIds = uploadedEntries.map((entry, index) => ({
      ...entry,
      id: `entry_${Date.now()}_${index}`,
    }));
    setData(entriesWithIds);
    setUploadModalOpen(false);
    swal("Success!", "Custom duty entries uploaded successfully!", "success");
  };

  const handleSubmitRequest = async () => {
    if (isAfter3PM) {
      showTimeRestrictionAlert("generate requests");
      return;
    }
    if (!selectedCompany) {
      swal(
        "Company Selection Required",
        "Please select a company before submitting the request.",
        "error"
      );
      return;
    }

    // Show SweetAlert confirmation
    const result = await swal({
      title: "Confirm Submission",
      text: `Are you sure you want to submit ${data.length} custom duty entries?`,
      icon: "warning",
      buttons: {
        cancel: "Cancel",
        confirm: "Submit",
      },
      dangerMode: true,
    });

    if (result) {
      await handleConfirmSubmit();
    }
  };

  const handleConfirmSubmit = async () => {
    try {
      setSubmitting(true);
      const customDutyEntries = data.map((entry) => ({
        typeOfTransaction: entry.typeOfTransaction,
        transactionDate: entry.transactionDate,
        transactionAmount: parseFloat(entry.transactionAmount),
        company: selectedCompany._id,
        challanNo: entry.challanNo,
        documentNo: entry.documentNo,
        referenceId: entry.referenceId,
        description: entry.description,
        icegateAckNo: entry.icegateAckNo,
      }));

      const response = await userRequest.post(`/custom/createRequest`, customDutyEntries);

      swal(
        "Success!",
        "Custom duty request submitted successfully!",
        "success"
      );

      // Reset form
      setData([]);
    } catch (error) {
      console.error("Submit error:", error);
      showErrorMessage(error, "Failed to submit custom duty request", swal);
    } finally {
      setSubmitting(false);
    }
  };


  const columns = RaiseRequestColumns();

  return (
    <>
      <Helmet>
        <title>Raise Request - Custom Duty</title>
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
                      fontWeight: "500",
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
                Cannot generate requests or upload files after 3:00 PM. Please
                try again tomorrow.
              </span>
            ) : null}
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
                if (!selectedCompany) {
                  swal(
                    "Company Selection Required",
                    "Please select a company before uploading files.",
                    "warning"
                  );
                  return;
                }
                if (isAfter3PM) {
                  showTimeRestrictionAlert("upload files");
                  return;
                }
                setUploadModalOpen(true);
              }}
              disabled={!selectedCompany || isAfter3PM}
              sx={{
                fontSize: "0.875rem",
                color: isAfter3PM ? "red" : "primary.main",
                "&:hover": {
                  backgroundColor: "transparent",
                },
                "&.Mui-disabled": {
                  color: isAfter3PM ? "red" : "rgba(0, 0, 0, 0.26)",
                  opacity: isAfter3PM ? 0.8 : 0.6,
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
            {data.length === 0 && !submitting ? (
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
                  getRowId={(row) => row.id}
                  loading={submitting}
                  pagination
                  paginationMode="client"
                  initialState={{
                    pagination: {
                      paginationModel: { pageSize: 10 },
                    },
                  }}
                  pageSizeOptions={[5, 10, 25, 50]}
                  hideFooter={false}
                  disableRowSelectionOnClick
                  disableRowClick
                  columnResize
                  disableColumnResize={false}
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
            ></Box>

            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmitRequest}
              disabled={data.length === 0 || isAfter3PM || submitting}
              sx={{
                px: { xs: 2, sm: 3 },
                py: { xs: 1.5, sm: 1 },
                fontSize: { xs: "0.8rem", sm: "0.875rem" },
                fontWeight: "bold",
                width: { xs: "100%", sm: "auto" },
                minWidth: { xs: "auto", sm: "240px" },
                "&.Mui-disabled": {
                  backgroundColor: isAfter3PM
                    ? "error.main"
                    : "rgba(0, 0, 0, 0.12)",
                  color: isAfter3PM ? "white" : "rgba(0, 0, 0, 0.26)",
                },
              }}
            >
              {submitting ? "Submitting..." : "Submit Request"}
            </Button>
          </Box>
        )}

        <UploadCustomDutyModal
          open={uploadModalOpen}
          onClose={() => setUploadModalOpen(false)}
          onSuccess={handleUploadSuccess}
        />
      </Container>
    </>
  );
}
