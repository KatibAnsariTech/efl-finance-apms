import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Paper,
  Chip,
  CircularProgress,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { fDateTime } from "src/utils/format-time";
import { userRequest } from "src/requestMethod";
import { Helmet } from "react-helmet-async";
import { useRouter } from "src/routes/hooks";

export default function MyRequests() {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Status color mapping
  const getStatusColor = (status) => {
    const normalizedStatus = (status || "").toLowerCase();
    switch (normalizedStatus) {
      case "pending":
        return "#f4f5ba";
      case "declined":
        return "#e6b2aa";
      case "approved":
        return "#baf5c2";
      case "clarification needed":
        return "#9be7fa";
      case "draft":
        return "#e0e0e0";
      case "submitted":
        return "#bbdefb";
      case "rejected":
        return "#ffcdd2";
      default:
        return "white";
    }
  };

  const getStatusChip = (status) => {
    const statusConfig = {
      Draft: { color: "default", label: "Draft" },
      Submitted: { color: "info", label: "Submitted" },
      Approved: { color: "success", label: "Approved" },
      Rejected: { color: "error", label: "Rejected" },
      Pending: { color: "warning", label: "Pending" },
      "Clarification Needed": { color: "info", label: "Clarification Needed" },
    };

    const config = statusConfig[status] || { color: "default", label: status };
    return <Chip label={config.label} color={config.color} size="small" />;
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      // Dummy data for demonstration
      const dummyData = [
        {
          _id: "1",
          requestNo: "CDR-2024-001",
          requestedDate: "2024-01-15T10:30:00Z",
          boeNumber: "BOE-2024-001",
          srNo: "1",
          challanNo: "2056627067",
          documentNo: "4145750",
          transactionDate: "2024-01-15T17:09:29.276Z",
          referenceId: "007000BEINDEL4145750",
          description: "Duty Payment",
          typeOfTransaction: "Debit",
          transactionAmount: 220823,
          icegateAckNo: "IG108292025064509",
          status: "Approved",
        },
        {
          _id: "2",
          requestNo: "CDR-2024-002",
          requestedDate: "2024-01-16T09:15:00Z",
          boeNumber: "BOE-2024-002",
          srNo: "2",
          challanNo: "2056627068",
          documentNo: "4145751",
          transactionDate: "2024-01-16T14:22:15.123Z",
          referenceId: "007000BEINDEL4145751",
          description: "Custom Duty Payment",
          typeOfTransaction: "Credit",
          transactionAmount: 150000,
          icegateAckNo: "IG108292025064510",
          status: "Pending",
        },
        {
          _id: "3",
          requestNo: "CDR-2024-003",
          requestedDate: "2024-01-17T11:45:00Z",
          boeNumber: "BOE-2024-003",
          srNo: "3",
          challanNo: "2056627069",
          documentNo: "4145752",
          transactionDate: "2024-01-17T16:30:45.789Z",
          referenceId: "007000BEINDEL4145752",
          description: "Import Duty",
          typeOfTransaction: "Debit",
          transactionAmount: 350000,
          icegateAckNo: "IG108292025064511",
          status: "Submitted",
        },
        {
          _id: "4",
          requestNo: "CDR-2024-004",
          requestedDate: "2024-01-18T08:20:00Z",
          boeNumber: "BOE-2024-004",
          srNo: "4",
          challanNo: "2056627070",
          documentNo: "4145753",
          transactionDate: "2024-01-18T13:15:30.456Z",
          referenceId: "007000BEINDEL4145753",
          description: "Export Duty Refund",
          typeOfTransaction: "Credit",
          transactionAmount: 75000,
          icegateAckNo: "IG108292025064512",
          status: "Rejected",
        },
        {
          _id: "5",
          requestNo: "CDR-2024-005",
          requestedDate: "2024-01-19T14:10:00Z",
          boeNumber: "BOE-2024-005",
          srNo: "5",
          challanNo: "2056627071",
          documentNo: "4145754",
          transactionDate: "2024-01-19T18:45:12.321Z",
          referenceId: "007000BEINDEL4145754",
          description: "Additional Duty",
          typeOfTransaction: "Debit",
          transactionAmount: 180000,
          icegateAckNo: "IG108292025064513",
          status: "Clarification Needed",
        },
        {
          _id: "6",
          requestNo: "CDR-2024-006",
          requestedDate: "2024-01-20T12:30:00Z",
          boeNumber: "BOE-2024-006",
          srNo: "6",
          challanNo: "2056627072",
          documentNo: "4145755",
          transactionDate: "2024-01-20T15:20:18.654Z",
          referenceId: "007000BEINDEL4145755",
          description: "Countervailing Duty",
          typeOfTransaction: "Debit",
          transactionAmount: 420000,
          icegateAckNo: "IG108292025064514",
          status: "Draft",
        },
      ];
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      setData(dummyData);
    } catch (error) {
      console.error("Error fetching requests:", error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    // Additional columns at the beginning
    {
      field: "requestNo",
      headerName: "Request No.",
      width: 160,
      align: "center",
      headerAlign: "center",
      resizable: true,
      renderCell: (params) => (
        <Box
          sx={{
            cursor: "pointer",
            color: "#1976d2",
            textDecoration: "underline",
            textDecorationThickness: "2px",
            textUnderlineOffset: "4px",
            fontWeight: 600,
            "&:hover": { color: "#1565c0" },
          }}
          onClick={() => {
            // Navigate to request detail page
            router.push(`/custom-duty/request-detail/${params.value}`);
          }}
        >
          {params.value}
        </Box>
      ),
    },
    {
      field: "requestedDate",
      headerName: "Requested Date",
      width: 180,
      align: "center",
      headerAlign: "center",
      resizable: true,
      renderCell: (params) => fDateTime(params.value),
    },
    {
      field: "boeNumber",
      headerName: "BOE Number",
      width: 150,
      align: "center",
      headerAlign: "center",
      resizable: true,
    },
    // Standard columns from raise ticket table
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
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={params.value === "Debit" ? "error" : "success"}
          size="small"
          variant="outlined"
        />
      ),
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
    {
      field: "status",
      headerName: "Status",
      width: 150,
      align: "center",
      headerAlign: "center",
      resizable: true,
      renderCell: (params) => getStatusChip(params.value),
    },
  ];

  return (
    <>
      <Helmet>
        <title>My Custom Duty Requests</title>
      </Helmet>

      <Container maxWidth="xl">
        <Card>
          <CardContent
            sx={{
              p: 0,
              "&:last-child": {
                pb: 0,
              },
            }}
          >
            {loading ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  height: "400px",
                }}
              >
                <CircularProgress />
              </Box>
            ) : data.length === 0 ? (
              <Paper
                sx={{
                  p: 6,
                  textAlign: "center",
                  backgroundColor: "#fafafa",
                  borderRadius: 2,
                  m: 2,
                }}
              >
                <Typography variant="h6" color="text.secondary">
                  No requests found
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1 }}
                >
                  You haven't submitted any custom duty requests yet.
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
                  rows={data.map((row, index) => ({
                    ...row,
                    id: row._id || row.requestNo || `row-${index}`,
                    backgroundColor: getStatusColor(row.status),
                  }))}
                  columns={columns}
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
      </Container>
    </>
  );
}
