import { Helmet } from "react-helmet-async";
import { useState, useEffect } from "react";

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
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { fDateTime } from "src/utils/format-time";
import Iconify from "src/components/iconify/iconify";
import { userRequest } from "src/requestMethod";
import swal from "sweetalert";
import { showErrorMessage } from "src/utils/errorUtils";
import { AddJVModal, UploadJVModal } from "../sections/jvm";

export default function InitiateJVPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [totalCount, setTotalCount] = useState(0);

  const getData = async () => {
    try {
      setLoading(true);

      // For development - using mock data instead of API call
      console.log("Fetching JV data with params:", {
        page: paginationModel.page + 1,
        limit: paginationModel.pageSize,
      });

      // Mock data for development
      const mockData = [
        {
          _id: "1",
          srNo: "JV001",
          documentType: "Invoice",
          documentDate: new Date("2024-09-12"),
          postingDate: new Date("2024-09-12"),
          businessArea: "Sales",
          accountType: "Asset",
          postingKey: "40 - Customer Invoice",
          vendorCustomerGLName: "ABC Company Ltd",
          vendorCustomerGLNumber: "GL001",
          amount: 50000,
          assignment: "Assignment 1",
          costCenter: "CC001",
          profitCenter: "PC001",
          specialGLIndication: "SGI001",
          referenceNumber: "REF001",
          personalNumber: "PN001",
          remarks: "Sample journal voucher entry for invoice processing",
          autoReversal: "N",
          status: "Draft",
          createdAt: new Date("2024-09-12"),
        },
        {
          _id: "2",
          srNo: "JV002",
          documentType: "Credit Note",
          documentDate: new Date("2024-09-11"),
          postingDate: new Date("2024-09-11"),
          businessArea: "Finance",
          accountType: "Liability",
          postingKey: "50 - Vendor Invoice",
          vendorCustomerGLName: "XYZ Corporation",
          vendorCustomerGLNumber: "GL002",
          amount: 25000,
          assignment: "Assignment 2",
          costCenter: "CC002",
          profitCenter: "PC002",
          specialGLIndication: "SGI002",
          referenceNumber: "REF002",
          personalNumber: "PN002",
          remarks: "Credit note for returned goods and services",
          autoReversal: "Y",
          status: "Submitted",
          createdAt: new Date("2024-09-11"),
        },
        {
          _id: "3",
          srNo: "JV003",
          documentType: "Journal Entry",
          documentDate: new Date("2024-09-10"),
          postingDate: new Date("2024-09-10"),
          businessArea: "Operations",
          accountType: "Expense",
          postingKey: "11 - Cash Receipt",
          vendorCustomerGLName: "DEF Industries",
          vendorCustomerGLNumber: "GL003",
          amount: 75000,
          assignment: "Assignment 3",
          costCenter: "CC003",
          profitCenter: "PC003",
          specialGLIndication: "SGI003",
          referenceNumber: "REF003",
          personalNumber: "PN003",
          remarks: "Monthly expense adjustment and reconciliation",
          autoReversal: "N",
          status: "Approved",
          createdAt: new Date("2024-09-10"),
        },
        {
          _id: "4",
          srNo: "JV004",
          documentType: "Payment Voucher",
          documentDate: new Date("2024-09-09"),
          postingDate: new Date("2024-09-09"),
          businessArea: "Procurement",
          accountType: "Asset",
          postingKey: "21 - Cash Payment",
          vendorCustomerGLName: "GHI Suppliers",
          vendorCustomerGLNumber: "GL004",
          amount: 120000,
          assignment: "Assignment 4",
          costCenter: "CC004",
          profitCenter: "PC004",
          specialGLIndication: "SGI004",
          referenceNumber: "REF004",
          personalNumber: "PN004",
          remarks: "Payment voucher for supplier invoice settlement",
          autoReversal: "N",
          status: "Pending",
          createdAt: new Date("2024-09-09"),
        },
        {
          _id: "5",
          srNo: "JV005",
          documentType: "Receipt Voucher",
          documentDate: new Date("2024-09-08"),
          postingDate: new Date("2024-09-08"),
          businessArea: "Sales",
          accountType: "Asset",
          postingKey: "31 - Bank Receipt",
          vendorCustomerGLName: "JKL Enterprises",
          vendorCustomerGLNumber: "GL005",
          amount: 85000,
          assignment: "Assignment 5",
          costCenter: "CC005",
          profitCenter: "PC005",
          specialGLIndication: "SGI005",
          referenceNumber: "REF005",
          personalNumber: "PN005",
          remarks: "Receipt voucher for customer payment received",
          autoReversal: "Y",
          status: "Rejected",
          createdAt: new Date("2024-09-08"),
        },
      ];

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const startIndex = paginationModel.page * paginationModel.pageSize;
      const paginatedData = mockData.slice(
        startIndex,
        startIndex + paginationModel.pageSize
      );
      const dataWithSno = paginatedData.map((item, index) => ({
        ...item,
        sno: startIndex + index + 1,
      }));

      setData(dataWithSno);
      setTotalCount(mockData.length);

      console.log("Mock JV data loaded:", dataWithSno);
    } catch (error) {
      console.error("Failed to fetch JV data:", error);
      showErrorMessage(error, "Failed to fetch journal voucher data", swal);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, [paginationModel]);

  const handleAddSuccess = () => {
    setAddModalOpen(false);
    getData();
    swal("Success!", "Journal voucher added successfully!", "success");
  };

  const handleUploadSuccess = () => {
    setUploadModalOpen(false);
    getData();
    swal("Success!", "Journal vouchers uploaded successfully!", "success");
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
      flex: 1,
      minWidth: 120,
      resizable: true,
    },
    {
      field: "documentDate",
      headerName: "Document Date",
      flex: 1,
      minWidth: 120,
      resizable: true,
      renderCell: (params) => fDateTime(params.value),
    },
    {
      field: "postingDate",
      headerName: "Posting Date",
      flex: 1,
      minWidth: 120,
      resizable: true,
      renderCell: (params) => fDateTime(params.value),
    },
    {
      field: "businessArea",
      headerName: "Business Area",
      flex: 1,
      minWidth: 120,
      resizable: true,
    },
    {
      field: "accountType",
      headerName: "Account Type",
      flex: 1,
      minWidth: 120,
      resizable: true,
    },
    {
      field: "postingKey",
      headerName: "Posting Key",
      flex: 1,
      minWidth: 150,
      resizable: true,
    },
    {
      field: "vendorCustomerGLName",
      headerName: "Vendor/Customer/GL Name",
      flex: 1,
      minWidth: 150,
      resizable: true,
    },
    {
      field: "vendorCustomerGLNumber",
      headerName: "Vendor/Customer/GL Number",
      flex: 1,
      minWidth: 150,
      resizable: true,
    },
    {
      field: "amount",
      headerName: "Amount",
      flex: 1,
      minWidth: 100,
      resizable: true,
      renderCell: (params) => `₹${params.value?.toLocaleString() || "0"}`,
    },
    {
      field: "assignment",
      headerName: "Assignment",
      flex: 1,
      minWidth: 120,
      resizable: true,
    },
    {
      field: "costCenter",
      headerName: "Cost Center",
      flex: 1,
      minWidth: 120,
      resizable: true,
    },
    {
      field: "profitCenter",
      headerName: "Profit Center",
      flex: 1,
      minWidth: 120,
      resizable: true,
    },
    {
      field: "specialGLIndication",
      headerName: "Special GL Indication",
      flex: 1,
      minWidth: 150,
      resizable: true,
    },
    {
      field: "referenceNumber",
      headerName: "Reference Number",
      flex: 1,
      minWidth: 120,
      resizable: true,
    },
    {
      field: "personalNumber",
      headerName: "Personal Number",
      flex: 1,
      minWidth: 120,
      resizable: true,
    },
    {
      field: "remarks",
      headerName: "Remarks",
      flex: 1,
      minWidth: 150,
      resizable: true,
      renderCell: (params) => (
        <Box
          sx={{
            maxWidth: 200,
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
      flex: 1,
      minWidth: 120,
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
      flex: 1,
      minWidth: 120,
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
        <Box sx={{ display: "flex", gap: 1 }}>
          <IconButton
            size="small"
            color="primary"
            onClick={() => handleEdit(params.row)}
          >
            <Iconify icon="eva:edit-fill" />
          </IconButton>
          <IconButton
            size="small"
            color="error"
            onClick={() => handleDelete(params.row)}
          >
            <Iconify icon="eva:trash-2-fill" />
          </IconButton>
        </Box>
      ),
    },
  ];

  const handleEdit = (row) => {
    // TODO: Implement edit functionality
    console.log("Edit row:", row);
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

      <Container maxWidth="xl">
        <Box sx={{ mb: 2 }}>
          <Typography variant="h5" sx={{ mb: 1, fontWeight: "bold" }}>
            Initiate Journal Voucher
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontSize: "0.875rem" }}
          >
            Today Date:{" "}
            {new Date().toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </Typography>
        </Box>

        <Card>
          <CardContent>
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
                mb: 2,
              }}
            >
              {/* <Typography variant="h6" sx={{ fontSize: '1.1rem' }}>Journal Voucher Entries</Typography> */}
              <Box sx={{ display: "flex", gap: 1.5 }}>
                <Button
                  variant="text"
                  size="small"
                  //   startIcon={<Iconify icon="eva:plus-fill" />}
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
                <Button
                  variant="text"
                  size="small"
                  //   startIcon={<Iconify icon="eva:upload-fill" />}
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

            {data.length === 0 && !loading ? (
              <Paper
                sx={{
                  p: 6,
                  textAlign: "center",
                  backgroundColor: "#fafafa",
                  borderRadius: 2,
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
              <DataGrid
                rows={data}
                columns={columns}
                getRowId={(row) => row._id || row.sno}
                loading={loading}
                pagination
                paginationMode="server"
                rowCount={totalCount}
                paginationModel={paginationModel}
                onPaginationModelChange={setPaginationModel}
                pageSizeOptions={[5, 10, 25, 50]}
                disableRowSelectionOnClick
                columnResize
                disableColumnResize={false}
                sx={{
                  height: 600,
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
                }}
              />
            )}
          </CardContent>
        </Card>

        <AddJVModal
          open={addModalOpen}
          onClose={() => setAddModalOpen(false)}
          onSuccess={handleAddSuccess}
        />

        <UploadJVModal
          open={uploadModalOpen}
          onClose={() => setUploadModalOpen(false)}
          onSuccess={handleUploadSuccess}
        />
      </Container>
    </>
  );
}
