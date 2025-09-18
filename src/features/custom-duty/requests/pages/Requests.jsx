import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Card,
  Container,
  Typography,
  Tabs,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  TextField,
  Button,
  Stack,
  CircularProgress,
  Chip,
  Alert,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { userRequest } from "src/requestMethod";
import { fDateTime } from "src/utils/format-time";
import { useRouter } from "src/routes/hooks";
import swal from "sweetalert";
import { showErrorMessage } from "src/utils/errorUtils";

export default function Requests() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState("pendingWithMe");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRows, setSelectedRows] = useState([]);
  const [comment, setComment] = useState("");
  const [actionLoading, setActionLoading] = useState(false);
  
  // Pagination and infinite scroll states
  const [page, setPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [selectAllLoading, setSelectAllLoading] = useState(false);
  const [allData, setAllData] = useState([]);
  const [isSelectAll, setIsSelectAll] = useState(false);

  const menuItems = [
    { label: "Pending with Me", value: "pendingWithMe" },
    { label: "Submitted", value: "submitted" },
    { label: "All Requests", value: "allRequests" },
  ];

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
      default:
        return "white";
    }
  };

  // Generate mock data for demonstration
  const generateMockData = (startId, count) => {
    const statuses = ["Pending", "Approved", "Rejected", "Draft"];
    const descriptions = [
      "Duty Payment",
      "Custom Duty Payment", 
      "Import Duty",
      "Export Duty Refund",
      "Additional Duty",
      "Countervailing Duty",
      "Anti-dumping Duty",
      "Safeguard Duty",
    ];
    const transactionTypes = ["Debit", "Credit"];

    return Array.from({ length: count }, (_, index) => {
      const id = startId + index;
      const status = statuses[Math.floor(Math.random() * statuses.length)];
      const description = descriptions[Math.floor(Math.random() * descriptions.length)];
      const typeOfTransaction = transactionTypes[Math.floor(Math.random() * transactionTypes.length)];
      const amount = Math.floor(Math.random() * 500000) + 50000;

      return {
        id: id.toString(),
        requestNo: `2056627${String(67 + id).padStart(3, "0")}`,
        requestedDate: new Date(
          2024,
          0,
          15 + Math.floor(Math.random() * 30),
          Math.floor(Math.random() * 24),
          Math.floor(Math.random() * 60)
        ).toISOString(),
        boeNumber: `41457${String(50 + id).padStart(3, "0")}`,
        challanNumber: `2056627${String(67 + id).padStart(3, "0")}`,
        transactionType: typeOfTransaction,
        transactionDate: new Date(
          2024,
          0,
          15 + Math.floor(Math.random() * 30),
          Math.floor(Math.random() * 24),
          Math.floor(Math.random() * 60)
        ).toISOString(),
        transactionAmount: amount,
        status,
        company: "EFL",
        description,
      };
    });
  };

  const getData = async (pageNum = 0, isLoadMore = false) => {
    try {
      if (isLoadMore) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Generate mock data - in real app, this would be an API call
      const startId = pageNum * rowsPerPage + 1;
      const newData = generateMockData(startId, rowsPerPage);
      
      // Filter data based on selected tab
      let filteredData = newData;
      if (selectedTab === "pendingWithMe") {
        filteredData = newData.filter((item) => item.status === "Pending");
      } else if (selectedTab === "submitted") {
        filteredData = newData.filter((item) => item.status === "Approved");
      }

      if (isLoadMore) {
        setData(prev => [...prev, ...filteredData]);
      } else {
        setData(filteredData);
        setAllData(filteredData);
      }

      // Simulate total count - in real app, this would come from API
      const totalRecords = 100; // Mock total
      setTotalCount(totalRecords);
      setHasMore((pageNum + 1) * rowsPerPage < totalRecords);

    } catch (err) {
      console.log("err:", err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const getAllData = async (shouldSelectAll = false) => {
    try {
      setSelectAllLoading(true);
      
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Generate all data for select all functionality
      const allMockData = generateMockData(1, 100);
      
      // Filter data based on selected tab
      let filteredData = allMockData;
      if (selectedTab === "pendingWithMe") {
        filteredData = allMockData.filter((item) => item.status === "Pending");
      } else if (selectedTab === "submitted") {
        filteredData = allMockData.filter((item) => item.status === "Approved");
      }

      setAllData(filteredData);
      setData(filteredData);
      setTotalCount(filteredData.length);
      setHasMore(false);

      // If this is called from select all, select all the loaded data
      if (shouldSelectAll) {
        setSelectedRows(filteredData.map((item) => item.id));
        setIsSelectAll(true);
      }

    } catch (err) {
      console.log("err:", err);
    } finally {
      setSelectAllLoading(false);
    }
  };

  useEffect(() => {
    setPage(0);
    setData([]);
    setAllData([]);
    setSelectedRows([]);
    setIsSelectAll(false);
    getData(0);
  }, [selectedTab]);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
    setSelectedRows([]);
    setIsSelectAll(false);
  };

  const handleSelectAll = async (event) => {
    if (event.target.checked) {
      // Show loading state and select all current data
      setSelectAllLoading(true);
      
      // Simulate a brief loading state
      await new Promise((resolve) => setTimeout(resolve, 500));
      
      // Select all currently loaded data
      setSelectedRows(data.map((item) => item.id));
      setIsSelectAll(true);
      setSelectAllLoading(false);
    } else {
      setSelectedRows([]);
      setIsSelectAll(false);
    }
  };

  const handleLoadMore = useCallback(() => {
    if (hasMore && !loadingMore && !loading) {
      const nextPage = page + 1;
      setPage(nextPage);
      getData(nextPage, true);
    }
  }, [hasMore, loadingMore, loading, page]);

  // Auto-scroll detection - using DataGrid's built-in onRowsScrollEnd event
  // The handleLoadMore function is called automatically when user scrolls to the end

  const handleSelectRow = (rowId) => {
    setSelectedRows((prev) => {
      const newSelection = prev.includes(rowId)
        ? prev.filter((id) => id !== rowId)
        : [...prev, rowId];
      
      // Update select all state based on current selection
      setIsSelectAll(newSelection.length === data.length && data.length > 0);
      
      return newSelection;
    });
  };

  const handleApprovalAction = async (action) => {
    if (selectedRows.length === 0) {
      swal(
        "Warning",
        "Please select at least one request to perform action",
        "warning"
      );
      return;
    }

    if (action === "rejected" && !comment.trim()) {
      swal("Warning", "Please provide a comment for rejection", "warning");
      return;
    }

    try {
      setActionLoading(true);

      // Mock API call - replace with actual implementation
      await new Promise((resolve) => setTimeout(resolve, 1000));

      swal("Success", `Requests ${action} successfully`, "success");
      setSelectedRows([]);
      setComment("");
      getData();
    } catch (error) {
      console.error("Error performing action:", error);
      showErrorMessage(error, `Failed to ${action} requests`, swal);
    } finally {
      setActionLoading(false);
    }
  };

  const columns = [
    {
      field: "checkbox",
      headerName: (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          {selectAllLoading ? (
            <CircularProgress size={20} />
          ) : (
            <Checkbox
              checked={isSelectAll}
              onChange={handleSelectAll}
              size="small"
            />
          )}
        </Box>
      ),
      width: 80,
      sortable: false,
      filterable: false,
      resizable: false,
      disableColumnMenu: true,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <Checkbox
          checked={selectedRows.includes(params.row.id)}
          onChange={() => handleSelectRow(params.row.id)}
          size="small"
        />
      ),
    },
    {
      field: "requestNo",
      headerName: "Request No.",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => (
        <Typography
          sx={{
            color: "#1976d2",
            textDecoration: "underline",
            cursor: "pointer",
            fontWeight: 600,
            "&:hover": { color: "#1565c0" },
          }}
          onClick={() => router.push(`/request-detail/${params.value}`)}
        >
          {params.value}
        </Typography>
      ),
    },
    {
      field: "requestedDate",
      headerName: "Requested Date",
      flex: 1,
      minWidth: 180,
      renderCell: (params) => fDateTime(params.value),
    },
    {
      field: "boeNumber",
      headerName: "BOE number",
      flex: 1,
      minWidth: 120,
    },
    {
      field: "challanNumber",
      headerName: "Challan number",
      flex: 1,
      minWidth: 140,
    },
    {
      field: "transactionType",
      headerName: "Type of transaction",
      flex: 1,
      minWidth: 150,
    },
    {
      field: "transactionDate",
      headerName: "Transaction Date",
      flex: 1,
      minWidth: 180,
      renderCell: (params) => fDateTime(params.value),
    },
    {
      field: "transactionAmount",
      headerName: "Transaction amount",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => params.value?.toLocaleString(),
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      minWidth: 120,
      // renderCell: (params) => (
      //   <Chip
      //     label={params.value}
      //     sx={{
      //       backgroundColor: getStatusColor(params.value),
      //       fontWeight: "bold",
      //       color: "#000",
      //     }}
      //   />
      // ),
    },
    {
      field: "company",
      headerName: "Company",
      flex: 1,
      minWidth: 100,
    },
    {
      field: "description",
      headerName: "Description",
      flex: 1,
      minWidth: 150,
    },
  ];

  return (
    <Container>
      {/* Tabs */}
      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
        <Tabs
          value={selectedTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          sx={{
            "& .MuiTabs-indicator": { backgroundColor: "#1877F2" },
            "& .MuiTab-root": { fontWeight: "bold" },
          }}
        >
          {menuItems.map((item) => (
            <Tab key={item.value} label={item.label} value={item.value} />
          ))}
        </Tabs>
      </Box>

      {/* Data Table */}
      <Card sx={{ mt: 2, p: 2 }}>
        <Box sx={{ width: "100%" }}>
          <DataGrid
            rows={data}
            columns={columns}
            loading={loading}
            autoHeight
            disableRowSelectionOnClick
            hideFooterSelectedRowCount
            pagination={false}
            onRowsScrollEnd={handleLoadMore}
            slots={{
              loadingOverlay: () => (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 2 }}>
                  <CircularProgress size={24} />
                  <Typography sx={{ ml: 1 }}>Loading...</Typography>
                </Box>
              ),
            }}
            sx={{
              "& .MuiDataGrid-cell": {
                "&:focus": { outline: "none" },
                "&:focus-visible": { outline: "none" },
              },
              "& .MuiDataGrid-cell[data-field='checkbox']": {
                justifyContent: "center",
                display: "flex",
                alignItems: "center",
                padding: "8px 0",
              },
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "#f5f6f8",
                fontWeight: "bold",
                color: "#637381",
              },
              "& .MuiDataGrid-columnHeader[data-field='checkbox']": {
                justifyContent: "center",
                display: "flex",
                alignItems: "center",
                padding: "8px 0",
              },
              "& .MuiDataGrid-columnHeaderTitle": {
                width: "100%",
                textAlign: "center",
              },
              "& .MuiDataGrid-row": {
                "&:focus": { outline: "none" },
                "&:focus-visible": { outline: "none" },
              },
              "& .MuiDataGrid-row:hover": {
                backgroundColor: (theme) => theme.palette.action.hover,
                opacity: 0.8,
              },
            }}
          />
          
          {/* Loading More Indicator */}
          {loadingMore && (
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              mt: 1, 
              py: 1,
              backgroundColor: '#f5f5f5',
              borderRadius: 1
            }}>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <CircularProgress size={16} sx={{ mr: 1 }} />
                <Typography variant="body2" color="text.secondary">
                  Loading more data...
                </Typography>
              </Box>
            </Box>
          )}
          
        </Box>

        {/* Action Section */}
        {selectedRows.length > 0 && (
          <Box
            sx={{ mt: 3, p: 2, backgroundColor: "#f8f9fa", borderRadius: 1 }}
          >
            <Typography variant="h6" sx={{ mb: 2, fontWeight: "bold" }}>
              Total Selected BOE's: {selectedRows.length}
            </Typography>

            <Typography variant="body2" sx={{ mb: 2, color: "#666" }}>
              Leave a comment with your response
            </Typography>

            <TextField
              fullWidth
              multiline
              rows={3}
              placeholder="Comment..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              sx={{ mb: 2, backgroundColor: "#fff" }}
            />

            <Stack direction="row" spacing={2}>
              <Button
                variant="contained"
                color="success"
                onClick={() => handleApprovalAction("approved")}
                disabled={actionLoading}
                startIcon={
                  actionLoading ? <CircularProgress size={20} /> : null
                }
                sx={{ minWidth: 120 }}
              >
                {actionLoading ? "Processing..." : "Approved"}
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={() => handleApprovalAction("rejected")}
                disabled={actionLoading}
                startIcon={
                  actionLoading ? <CircularProgress size={20} /> : null
                }
                sx={{ minWidth: 120 }}
              >
                {actionLoading ? "Processing..." : "Rejected"}
              </Button>
            </Stack>
          </Box>
        )}
      </Card>
    </Container>
  );
}
