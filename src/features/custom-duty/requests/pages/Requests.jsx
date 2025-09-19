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
    { label: "Raise to Bank", value: "submitted" },
    { label: "All Requests", value: "allRequests" },
  ];

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


  const getData = async (pageNum = 0, isLoadMore = false) => {
    try {
      if (isLoadMore) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

      let allApiData;
      
      try {
        const response = await userRequest.get(`https://68cce4b9da4697a7f303dd30.mockapi.io/requests/request-data`);
        allApiData = response.data;
      } catch (userRequestError) {
        const fetchResponse = await fetch(`https://68cce4b9da4697a7f303dd30.mockapi.io/requests/request-data`);
        const fetchData = await fetchResponse.json();
        allApiData = fetchData;
      }
      
      // Add minimum delay to ensure loading indicator is visible
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const transformedData = allApiData.map((item, index) => ({
        id: item.id,
        requestNo: `REQ${String(item.requestNo).padStart(6, "0")}`,
        requestedDate: new Date(item.requestedDate * 1000).toISOString(),
        boeNumber: `BOE${String(item.boeNumber).padStart(4, "0")}`,
        challanNumber: `CHL${String(item.challanNumber).padStart(4, "0")}`,
        transactionType: item.transactionType,
        transactionDate: new Date(item.transactionDate * 1000).toISOString(),
        transactionAmount: parseFloat(item.transactionAmount),
        status: item.status,
        company: item.company,
        description: item.description,
      }));

      const startIndex = pageNum * rowsPerPage;
      const endIndex = startIndex + rowsPerPage;
      const paginatedData = transformedData.slice(startIndex, endIndex);

      if (isLoadMore) {
        setData(prev => [...prev, ...paginatedData]);
      } else {
        setData(paginatedData);
        setAllData(paginatedData);
      }

      const totalRecords = allApiData.length;
      setTotalCount(totalRecords);
      setHasMore(endIndex < totalRecords);

    } catch (err) {
      setData([]);
      setAllData([]);
      setTotalCount(0);
      setHasMore(false);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const getAllData = async (shouldSelectAll = false) => {
    try {
      setSelectAllLoading(true);
      
      let allApiData;
      
      try {
        const response = await userRequest.get(`https://68cce4b9da4697a7f303dd30.mockapi.io/requests/request-data`);
        allApiData = response.data;
      } catch (userRequestError) {
        const fetchResponse = await fetch(`https://68cce4b9da4697a7f303dd30.mockapi.io/requests/request-data`);
        const fetchData = await fetchResponse.json();
        allApiData = fetchData;
      }
      
      const transformedData = allApiData.map((item, index) => ({
        id: item.id,
        requestNo: `REQ${String(item.requestNo).padStart(6, "0")}`,
        requestedDate: new Date(item.requestedDate * 1000).toISOString(),
        boeNumber: `BOE${String(item.boeNumber).padStart(4, "0")}`,
        challanNumber: `CHL${String(item.challanNumber).padStart(4, "0")}`,
        transactionType: item.transactionType,
        transactionDate: new Date(item.transactionDate * 1000).toISOString(),
        transactionAmount: parseFloat(item.transactionAmount),
        status: item.status,
        company: item.company,
        description: item.description,
      }));

      setAllData(transformedData);
      setData(transformedData);
      setTotalCount(transformedData.length);
      setHasMore(false);

      if (shouldSelectAll) {
        setSelectedRows(transformedData.map((item) => item.id));
        setIsSelectAll(true);
      }

    } catch (err) {
      setAllData([]);
      setData([]);
      setTotalCount(0);
      setHasMore(false);
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
      // Load all data from API and select all
      await getAllData(true);
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

  useEffect(() => {
    const dataGrid = document.querySelector('.MuiDataGrid-root');
    if (!dataGrid) return;

    const scrollableElement = dataGrid.querySelector('.MuiDataGrid-virtualScroller');
    if (!scrollableElement) return;

    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = scrollableElement;
      const isNearBottom = scrollTop + clientHeight >= scrollHeight - 10;
      
      if (isNearBottom && hasMore && !loadingMore && !loading) {
        handleLoadMore();
      }
    };

    scrollableElement.addEventListener('scroll', handleScroll);
    return () => scrollableElement.removeEventListener('scroll', handleScroll);
  }, [hasMore, loadingMore, loading, handleLoadMore]);

  const handleSelectRow = (rowId) => {
    setSelectedRows((prev) => {
      const newSelection = prev.includes(rowId)
        ? prev.filter((id) => id !== rowId)
        : [...prev, rowId];
      
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

      <Card sx={{ mt: 2, p: 2 }}>
        <Box sx={{ 
          width: "100%", 
          height: 600,
          "& .MuiDataGrid-root": {
            "& .MuiDataGrid-virtualScroller": {
              "&::-webkit-scrollbar": {
                display: "none !important",
                width: "0 !important",
                height: "0 !important",
              },
              "&::-webkit-scrollbar-track": {
                display: "none !important",
              },
              "&::-webkit-scrollbar-thumb": {
                display: "none !important",
              },
              "-ms-overflow-style": "none !important",
              "scrollbar-width": "none !important",
            },
            "& .MuiDataGrid-main": {
              "&::-webkit-scrollbar": {
                display: "none !important",
                width: "0 !important",
                height: "0 !important",
              },
              "-ms-overflow-style": "none !important",
              "scrollbar-width": "none !important",
            },
          }
        }}>
          <DataGrid
            rows={data}
            columns={columns}
            loading={loading}
            disableRowSelectionOnClick
            hideFooterSelectedRowCount
            pagination={false}
            hideFooterPagination
            onRowsScrollEnd={handleLoadMore}
            slots={{
              loadingOverlay: () => (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 2 }}>
                  <CircularProgress size={24} />
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
              "& .MuiDataGrid-cell[data-field='requestNo']": {
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-start",
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
              "& .MuiDataGrid-columnHeader[data-field='requestNo']": {
                justifyContent: "flex-start",
                display: "flex",
                alignItems: "center",
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
          
          {loadingMore && (
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              mt: 1, 
              py: 1,
              backgroundColor: '#f5f5f5',
              borderRadius: 1
            }}>
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', p: 2 }}>
                <CircularProgress size={24} />
              </Box>
            </Box>
          )}
          
        </Box>

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
