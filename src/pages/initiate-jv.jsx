import { Helmet } from "react-helmet-async";
import { useState, useEffect, useCallback } from "react";

// DEVELOPMENT MODE: This page uses mock data and console logging instead of API calls
// for testing purposes. Replace with actual API calls when backend is ready.
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
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { fDateTime } from "src/utils/format-time";
import Iconify from "src/components/iconify/iconify";
import { userRequest } from "src/requestMethod";
import swal from "sweetalert";
import { showErrorMessage } from "src/utils/errorUtils";
import { AddJVModal, EditJVModal, UploadJVModal } from "../sections/jvm";
import ConfirmationModal from "../components/ConfirmationModal";

export default function InitiateJVPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 50,
  });
  const [totalCount, setTotalCount] = useState(0);
  const [autoReversal, setAutoReversal] = useState("No");
  const [hasMore, setHasMore] = useState(true);
  const [showInfoText, setShowInfoText] = useState(false);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);

  // Generate mock data for infinite scrolling
  const generateMockData = (startIndex, count) => {
    const documentTypes = [
      "Invoice",
      "Credit Note",
      "Journal Entry",
      "Payment Voucher",
      "Receipt Voucher",
    ];
    const businessAreas = [
      "Sales",
      "Finance",
      "Operations",
      "Procurement",
      "Marketing",
    ];
    const accountTypes = ["Asset", "Liability", "Expense", "Revenue", "Equity"];
    const postingKeys = [
      "40 - Customer Invoice",
      "50 - Vendor Invoice",
      "11 - Cash Receipt",
      "21 - Cash Payment",
      "31 - Bank Receipt",
    ];
    const statuses = ["Draft", "Submitted", "Approved", "Rejected", "Pending"];
    const companies = [
      "ABC Company Ltd",
      "XYZ Corporation",
      "DEF Industries",
      "GHI Suppliers",
      "JKL Enterprises",
      "MNO Solutions",
      "PQR Systems",
      "STU Technologies",
    ];

    return Array.from({ length: count }, (_, index) => {
      const globalIndex = startIndex + index;
      const docType = documentTypes[globalIndex % documentTypes.length];
      const businessArea = businessAreas[globalIndex % businessAreas.length];
      const accountType = accountTypes[globalIndex % accountTypes.length];
      const postingKey = postingKeys[globalIndex % postingKeys.length];
      const status = statuses[globalIndex % statuses.length];
      const company = companies[globalIndex % companies.length];
      const amount = Math.floor(Math.random() * 200000) + 10000;
      const date = new Date(2024, 8, 12 - (globalIndex % 30)); // Random dates in September 2024

      return {
        _id: `jv_${globalIndex + 1}`,
        srNo: `JV${String(globalIndex + 1).padStart(3, "0")}`,
        documentType: docType,
        documentDate: date,
        postingDate: date,
        businessArea: businessArea,
        accountType: accountType,
        postingKey: postingKey,
        vendorCustomerGLName: company,
        vendorCustomerGLNumber: `GL${String(globalIndex + 1).padStart(3, "0")}`,
        amount: amount,
        assignment: `Assignment ${globalIndex + 1}`,
        costCenter: `CC${String(globalIndex + 1).padStart(3, "0")}`,
        profitCenter: `PC${String(globalIndex + 1).padStart(3, "0")}`,
        specialGLIndication: `SGI${String(globalIndex + 1).padStart(3, "0")}`,
        referenceNumber: `REF${String(globalIndex + 1).padStart(3, "0")}`,
        personalNumber: `PN${String(globalIndex + 1).padStart(3, "0")}`,
        remarks: `Sample journal voucher entry ${
          globalIndex + 1
        } for ${docType.toLowerCase()} processing`,
        autoReversal: globalIndex % 3 === 0 ? "Y" : "N",
        status: status,
        createdAt: date,
        sno: globalIndex + 1,
      };
    });
  };

  const getData = async (isLoadMore = false) => {
    try {
      setLoading(true);

      // For development - using mock data instead of API call
      console.log("Fetching JV data with params:", {
        page: paginationModel.page + 1,
        limit: paginationModel.pageSize,
        isLoadMore,
      });

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      const startIndex = paginationModel.page * paginationModel.pageSize;
      const newData = generateMockData(startIndex, paginationModel.pageSize);

      if (isLoadMore) {
        setData((prevData) => [...prevData, ...newData]);
      } else {
        setData(newData);
      }

      // Simulate having more data (in real app, this would come from API response)
      const totalMockRecords = 1000; // Simulate 1000 total records
      setTotalCount(totalMockRecords);
      setHasMore(startIndex + paginationModel.pageSize < totalMockRecords);

      console.log("Mock JV data loaded:", newData);
    } catch (error) {
      console.error("Failed to fetch JV data:", error);
      showErrorMessage(error, "Failed to fetch journal voucher data", swal);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, [paginationModel.page]);

  // Handle infinite scrolling
  const handleScroll = useCallback(
    (event) => {
      const { scrollTop, scrollHeight, clientHeight } = event.target;
      const isNearBottom = scrollTop + clientHeight >= scrollHeight - 100; // 100px threshold

      if (isNearBottom && hasMore && !loading) {
        setPaginationModel((prev) => ({
          ...prev,
          page: prev.page + 1,
        }));
      }
    },
    [hasMore, loading]
  );

  // Load more data when page changes
  useEffect(() => {
    if (paginationModel.page > 0) {
      getData(true);
    }
  }, [paginationModel.page]);

  const handleAddSuccess = () => {
    setAddModalOpen(false);
    getData();
    swal("Success!", "Journal voucher added successfully!", "success");
  };

  const handleEditSuccess = () => {
    setEditModalOpen(false);
    setEditData(null);
    getData();
    swal("Success!", "Journal voucher updated successfully!", "success");
  };

  const handleUploadSuccess = () => {
    setUploadModalOpen(false);
    getData();
    swal("Success!", "Journal vouchers uploaded successfully!", "success");
  };

  const handleSubmitRequest = () => {
    setConfirmModalOpen(true);
  };

  const handleConfirmSubmit = async () => {
    try {
      // For development - using console log instead of API call
      console.log("Submitting JV request with data:", {
        entries: data,
        autoReversal: autoReversal,
        totalEntries: data.length,
        totalAmount: data.reduce((sum, item) => sum + (item.amount || 0), 0),
      });

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      swal(
        "Success!",
        "Journal voucher request submitted successfully!",
        "success"
      );

      // Reset form
      setData([]);
      setPaginationModel({ page: 0, pageSize: 50 });
      setAutoReversal("No");
      setConfirmModalOpen(false);
    } catch (error) {
      console.error("Submit error:", error);
      showErrorMessage(error, "Failed to submit journal voucher request", swal);
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
      field: "sno",
      headerName: "Sr.No",
      width: 80,
      align: "center",
      headerAlign: "center",
      resizable: true,
    },
    {
      field: "documentType",
      headerName: "Document Type",
      width: 140,
      resizable: true,
    },
    {
      field: "documentDate",
      headerName: "Document Date",
      width: 140,
      resizable: true,
      renderCell: (params) => fDateTime(params.value),
    },
    {
      field: "postingDate",
      headerName: "Posting Date",
      width: 140,
      resizable: true,
      renderCell: (params) => fDateTime(params.value),
    },
    {
      field: "businessArea",
      headerName: "Business Area",
      width: 130,
      resizable: true,
    },
    {
      field: "accountType",
      headerName: "Account Type",
      width: 130,
      resizable: true,
    },
    {
      field: "postingKey",
      headerName: "Posting Key",
      width: 160,
      resizable: true,
    },
    {
      field: "vendorCustomerGLName",
      headerName: "Vendor/Customer/GL Name",
      width: 200,
      resizable: true,
    },
    {
      field: "vendorCustomerGLNumber",
      headerName: "Vendor/Customer/GL Number",
      width: 200,
      resizable: true,
    },
    {
      field: "amount",
      headerName: "Amount",
      width: 120,
      resizable: true,
      renderCell: (params) => `₹${params.value?.toLocaleString() || "0"}`,
    },
    {
      field: "assignment",
      headerName: "Assignment",
      width: 130,
      resizable: true,
    },
    {
      field: "costCenter",
      headerName: "Cost Center",
      width: 130,
      resizable: true,
    },
    {
      field: "profitCenter",
      headerName: "Profit Center",
      width: 130,
      resizable: true,
    },
    {
      field: "specialGLIndication",
      headerName: "Special GL Indication",
      width: 170,
      resizable: true,
    },
    {
      field: "referenceNumber",
      headerName: "Reference Number",
      width: 150,
      resizable: true,
    },
    {
      field: "personalNumber",
      headerName: "Personal Number",
      width: 150,
      resizable: true,
    },
    {
      field: "remarks",
      headerName: "Remarks",
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
      field: "autoReversal",
      headerName: "Auto Reversal",
      width: 130,
      resizable: true,
      renderCell: (params) =>
        // <Chip
        //   label={params.value === "Y" ? "Yes" : "No"}
        //   color={params.value === "Y" ? "success" : "default"}
        //   size="small"
        // />
        params.value === "Y" ? "Yes" : "No",
    },
    // {
    //   field: "status",
    //   headerName: "Status",
    //   flex: 1,
    //   minWidth: 100,
    //   renderCell: (params) => getStatusChip(params.value),
    // },
    {
      field: "createdAt",
      headerName: "Created At",
      width: 140,
      resizable: true,
      renderCell: (params) => fDateTime(params.value),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      align: "center",
      headerAlign: "center",
      resizable: false,
      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            gap: 1,
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
          }}
        >
          <IconButton
            size="small"
            color="primary"
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(params.row);
            }}
          >
            <Iconify icon="eva:edit-fill" />
          </IconButton>
          <IconButton
            size="small"
            color="error"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(params.row);
            }}
          >
            <Iconify icon="eva:trash-2-fill" />
          </IconButton>
        </Box>
      ),
    },
  ];

  const handleEdit = (row) => {
    setEditData(row);
    setEditModalOpen(true);
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
        // For development - using console log instead of API call
        console.log("Deleting JV with ID:", row._id);
        console.log("JV data to delete:", row);

        // Simulate API delay
        await new Promise((resolve) => setTimeout(resolve, 500));

        swal("Deleted!", "Journal voucher has been deleted.", "success");
        getData();
      } catch (error) {
        console.error("Delete error:", error);
        showErrorMessage(error, "Failed to delete journal voucher", swal);
      }
    }
  };

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
                  fontWeight: "500"
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
              onClick={() => setAddModalOpen(true)}
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
          <CardContent sx={{ p: 0 }}>
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
                  overflow: "auto",
                  marginBottom: { xs: "0px", sm: "0px" },
                  minHeight: "300px",
                  maxHeight: "70vh",
                }}
                onScroll={handleScroll}
              >
                <DataGrid
                  rows={data}
                  columns={columns}
                  getRowId={(row) => row._id || row.sno}
                  loading={loading}
                  pagination={false}
                  disableRowSelectionOnClick
                  disableRowClick
                  columnResize
                  disableColumnResize={false}
                  hideFooter
                  autoHeight={false}
                  columnResizeMode="onResize"
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
                {loading && hasMore && (
                  <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
                    <CircularProgress size={24} />
                  </Box>
                )}
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
              mt: 2,
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
              disabled={data.length === 0}
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

        <AddJVModal
          open={addModalOpen}
          onClose={() => setAddModalOpen(false)}
          onSuccess={handleAddSuccess}
        />

        <EditJVModal
          open={editModalOpen}
          onClose={() => {
            setEditModalOpen(false);
            setEditData(null);
          }}
          onSuccess={handleEditSuccess}
          editData={editData}
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
        />
      </Container>
    </>
  );
}
