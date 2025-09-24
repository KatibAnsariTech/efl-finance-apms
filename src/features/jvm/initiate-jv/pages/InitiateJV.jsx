import { Helmet } from "react-helmet-async";
import { useState, useEffect, useCallback } from "react";
import axios from "axios";


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
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { fDateTime } from "src/utils/format-time";
import Iconify from "src/components/iconify/iconify";
import { userRequest } from "src/requestMethod";
import swal from "sweetalert";
import { showErrorMessage } from "src/utils/errorUtils";
import { JVModal, UploadJVModal } from "../components/InitiateJV";
import { InitiateJVColumns } from "../components/InitiateJV/InitiateJVColumns";
import ConfirmationModal from "src/components/ConfirmationModal";


export default function InitiateJV() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState("add"); // "add" or "edit"
  const [editData, setEditData] = useState(null);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [autoReversal, setAutoReversal] = useState("No");
  const [showInfoText, setShowInfoText] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Add new JV entry to local state
  const addJVEntry = (newEntry) => {
    const entryWithId = {
      ...newEntry,
      _id: `temp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      slNo: newEntry.slNo || "",
      createdAt: new Date().toISOString(),
    };
    setData((prev) => [...prev, entryWithId]);
  };

  // Update JV entry in local state
  const updateJVEntry = (updatedEntry) => {
    setData((prev) =>
      prev.map((item) =>
        item._id === updatedEntry._id
          ? { ...updatedEntry, slNo: item.slNo }
          : item
      )
    );
  };

  // Remove JV entry from local state
  const removeJVEntry = (entryId) => {
    setData((prev) => prev.filter((item) => item._id !== entryId));
  };

  const handleModalSuccess = (entry) => {
    if (modalMode === "add") {
      addJVEntry(entry);
      swal("Success!", "Journal voucher added successfully!", "success");
    } else {
      updateJVEntry(entry);
      setEditData(null);
      swal("Success!", "Journal voucher updated successfully!", "success");
    }
    setModalOpen(false);
  };

  const handleUploadSuccess = (uploadedEntries) => {
    // Add all uploaded entries to local state
    uploadedEntries.forEach((entry) => addJVEntry(entry));
    setUploadModalOpen(false);
    swal("Success!", "Journal vouchers uploaded successfully!", "success");
  };

  // Validation function to check if rows with same slNo have balanced debit/credit amounts
  const validateSlNoBalance = () => {
    const slNoGroups = {};
    
    // Group entries by slNo
    data.forEach(entry => {
      const slNo = entry.slNo?.toString().trim();
      if (slNo) {
        if (!slNoGroups[slNo]) {
          slNoGroups[slNo] = { debit: 0, credit: 0, entries: [] };
        }
        
        const amount = parseFloat(entry.amount) || 0;
        if (entry.type === 'Debit') {
          slNoGroups[slNo].debit += amount;
        } else if (entry.type === 'Credit') {
          slNoGroups[slNo].credit += amount;
        }
        slNoGroups[slNo].entries.push(entry);
      }
    });

    // Check if any slNo group has unbalanced amounts
    const unbalancedGroups = [];
    Object.keys(slNoGroups).forEach(slNo => {
      const group = slNoGroups[slNo];
      if (Math.abs(group.debit - group.credit) > 0.01) { // Allow for small floating point differences
        unbalancedGroups.push({
          slNo,
          debit: group.debit,
          credit: group.credit,
          difference: Math.abs(group.debit - group.credit)
        });
      }
    });

    return unbalancedGroups;
  };

  // const handleSubmitRequest = async () => {
  const handleConfirmSubmit = () => {
    // setConfirmModalOpen(true);
    console.log("Submit confirmed");
  };

  // const handleConfirmSubmit = async () => {
  const handleSubmitRequest = async () => {
    try {
      setSubmitting(true);
      
      // Validate slNo balance before submitting
      const unbalancedGroups = validateSlNoBalance();
      if (unbalancedGroups.length > 0) {
        const errorMessage = unbalancedGroups.map(group => 
          `Serial Number ${group.slNo}: Debit ₹${group.debit.toLocaleString()} vs Credit ₹${group.credit.toLocaleString()} (Difference: ₹${group.difference.toLocaleString()})`
        ).join('\n');
        
        await swal({
          title: "Validation Error",
          text: `The following serial numbers have unbalanced debit and credit amounts:\n\n${errorMessage}\n\nPlease ensure that for each serial number, the total debit amount equals the total credit amount.`,
          icon: "error",
          button: "OK"
        });
        setSubmitting(false);
        return;
      }
      
      const journalVouchers = data.map((entry) => ({
        slNo: entry.slNo?.toString(),
        documentType: entry.documentType,
        documentDate: new Date(entry.documentDate).toISOString(),
        businessArea: entry.businessArea,
        accountType: entry.accountType,
        postingKey: entry.postingKey,
        vendorCustomerGLNumber: entry.vendorCustomerGLNumber,
        amount: parseFloat(entry.amount),
        type: entry.type,
        assignment: entry.assignment,
        profitCenter: entry.profitCenter,
        specialGLIndication: entry.specialGLIndication,
        referenceNumber: entry.referenceNumber,
        remarks: entry.remarks,
        postingDate: new Date(entry.postingDate).toISOString(),
        vendorCustomerGLName: entry.vendorCustomerGLName,
        costCenter: entry.costCenter,
        personalNumber: entry.personalNumber,
      }));

      // Call the createRequest API endpoint with array of objects directly
      const response = await userRequest.post(
        "jvm/createRequest",
        journalVouchers
      );

      swal(
        "Success!",
        "Journal voucher request submitted successfully!",
        "success"
      );

      // Reset form
      setData([]);
      setAutoReversal("No");
      setConfirmModalOpen(false);
    } catch (error) {
      console.error("Submit error:", error);
      showErrorMessage(error, "Failed to submit journal voucher request", swal);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (row) => {
    setEditData(row);
    setModalMode("edit");
    setModalOpen(true);
  };

  const handleAdd = () => {
    setEditData(null);
    setModalMode("add");
    setModalOpen(true);
  };

  const handleDelete = async (row) => {
    const result = await swal({
      title: "Are you sure?",
      text: "You will not be able to recover this journal voucher!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    });

    if (result) {
      try {
        removeJVEntry(row._id);
        swal("Deleted!", "Journal voucher has been deleted.", "success");
      } catch (error) {
        console.error("Delete error:", error);
        showErrorMessage(error, "Failed to delete journal voucher", swal);
      }
    }
  };

  // Get columns from separate file
  const columns = InitiateJVColumns({ handleEdit, handleDelete });

  return (
    <>
      <Helmet>
        <title>Initiate Journal Voucher</title>
      </Helmet>

      <Container maxWidth="xl" sx={{ mb: -15 }}>
        <Box sx={{ mb: 0 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              gap: 0.2,
            }}
          >
            {showInfoText && (
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
              onClick={handleAdd}
              sx={{
                fontSize: "0.875rem",
                "&:hover": {
                  backgroundColor: "transparent",
                },
              }}
            >
              Add Manual
            </Button>
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
              onClick={() => setUploadModalOpen(true)}
              sx={{
                fontSize: "0.875rem",
                "&:hover": {
                  backgroundColor: "transparent",
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
                    // mb: 1.5,
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
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontSize: "0.875rem" }}
                >
                  No journal voucher entries found. Click "Add Manual" or
                  "Upload File" to get started.
                </Typography>
              </Paper>
            ) : (
              <Box
                sx={{
                  height: "calc(100vh - 220px)",
                  marginBottom: { xs: "0px", sm: "0px" },
                  minHeight: "300px",
                  maxHeight: "70vh",
                }}
              >
                <DataGrid
                  rows={data}
                  columns={columns}
                  getRowId={(row) => row._id || row.slNo}
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
                  processRowUpdate={(updatedRow, originalRow) => {
                    updateJVEntry(updatedRow);
                    return updatedRow;
                  }}
                  onProcessRowUpdateError={(error) => {
                    console.error("Error updating row:", error);
                  }}
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
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: { xs: "0.8rem", sm: "0.875rem" },
                    whiteSpace: "nowrap",
                    fontWeight: 500,
                  }}
                >
                  Auto-reversal this transaction:
                </Typography>
                <FormControl
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
                  >
                    <MenuItem value="Yes">Yes</MenuItem>
                    <MenuItem value="No">No</MenuItem>
                  </Select>
                </FormControl>
              </Box>
            </Box>

            <Button
              variant="contained"
              color="primary"
              onClick={handleSubmitRequest}
              disabled={data.length === 0 || validateSlNoBalance().length > 0}
              sx={{
                px: { xs: 2, sm: 3 },
                py: { xs: 1.5, sm: 1 },
                fontSize: { xs: "0.8rem", sm: "0.875rem" },
                fontWeight: "bold",
                width: { xs: "100%", sm: "auto" },
                minWidth: { xs: "auto", sm: "240px" },
              }}
            >
              Submit Request
            </Button>
          </Box>
        )}

        <JVModal
          open={modalOpen}
          onClose={() => {
            setModalOpen(false);
            setEditData(null);
          }}
          onSuccess={handleModalSuccess}
          editData={editData}
          mode={modalMode}
        />

        <UploadJVModal
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
