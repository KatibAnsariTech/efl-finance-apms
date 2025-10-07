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
import { RequestColumns } from "../components/RequestColumns";
import RequestStatus from "../components/RequestStatus";

export default function Requests() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState("pendingWithMe");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRows, setSelectedRows] = useState([]);
  const [comment, setComment] = useState("");
  const [approveLoading, setApproveLoading] = useState(false);
  const [rejectLoading, setRejectLoading] = useState(false);

  const [page, setPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectAllLoading, setSelectAllLoading] = useState(false);
  const [allData, setAllData] = useState([]);
  const [isSelectAll, setIsSelectAll] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState(null);

  const menuItems = [
    { label: "Pending with Me", value: "pendingWithMe" },
    { label: "All Requests", value: "allRequests" },
  ];

  const getData = async (pageNum = 1, shouldSelectAll = false) => {
    try {
      setLoading(true);
      if (shouldSelectAll) {
        setSelectAllLoading(true);
      }

      const page = pageNum;
      const limit = shouldSelectAll ? 10000 : rowsPerPage;

      const apiEndpoint =
        selectedTab === "pendingWithMe"
          ? "/custom/getPendingRequestForms"
          : "/custom/getRequestsForApprover";

      const response = await userRequest.get(apiEndpoint, {
        params: {
          page: page,
          limit: limit,
        },
      });

      const apiData =
        response.data.data.forms ||
        response.data.data.requests ||
        response.data.data;
      const totalCount =
        response.data.data.totalForms || response.data.data.totalRequests || 0;

      const transformedData = apiData.map((item) => ({
        ...item,
        id: item._id,
        requestedDate: item.requestedDate || item.createdAt,
      }));

      setData(transformedData);
      setTotalCount(totalCount);

      if (shouldSelectAll) {
        setAllData(transformedData);
        setSelectedRows(transformedData.map((item) => item.id));
        setIsSelectAll(true);
      }
    } catch (err) {
      console.error("Error fetching data:", err);
      setData([]);
      setTotalCount(0);
      if (shouldSelectAll) {
        setAllData([]);
      }
    } finally {
      setLoading(false);
      if (shouldSelectAll) {
        setSelectAllLoading(false);
      }
    }
  };


  useEffect(() => {
    setPage(0);
    setData([]);
    setAllData([]);
    setSelectedRows([]);
    setIsSelectAll(false);
    setLoading(true);
    getData(1);
  }, [selectedTab]);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
    setSelectedRows([]);
    setIsSelectAll(false);
  };

  const handleSelectAll = async (event) => {
    if (event.target.checked) {
      await getData(1, true);
    } else {
      setSelectedRows([]);
      setIsSelectAll(false);
    }
  };

  const handlePageChange = (newPage) => {
    setPage(newPage);
    getData(newPage + 1);
  };

  const handleRowsPerPageChange = (newRowsPerPage) => {
    setRowsPerPage(newRowsPerPage);
    setPage(0);
    getData(1);
  };

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
      if (action === "approved") {
        setApproveLoading(true);
      } else if (action === "rejected") {
        setRejectLoading(true);
      }

      const payload = {
        formIds: selectedRows,
        comment: comment.trim(),
      };

      if (action === "rejected") {
        await userRequest.post("/custom/declineForm", payload);
      } else if (action === "approved") {
        await userRequest.post("/custom/acceptForm", payload);
      }

      swal("Success", `Requests ${action} successfully`, "success");
      setSelectedRows([]);
      setComment("");
      getData();
    } catch (error) {
      console.error("Error performing action:", error);
      showErrorMessage(error, `Failed to ${action} requests`, swal);
    } finally {
      if (action === "approved") {
        setApproveLoading(false);
      } else if (action === "rejected") {
        setRejectLoading(false);
      }
    }
  };

  const handleRequestClick = (rowData) => {
    setSelectedRowData(rowData);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedRowData(null);
  };

  const columns = RequestColumns({
    isSelectAll,
    handleSelectAll,
    selectAllLoading,
    selectedRows,
    handleSelectRow,
    onRequestClick: handleRequestClick,
    showCheckboxes: selectedTab === "pendingWithMe",
  });

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
        <Box sx={{ height: 400, width: "100%" }}>
          <DataGrid
            rows={data}
            columns={columns}
            loading={loading}
            disableRowSelectionOnClick
            pagination
            paginationMode="server"
            rowCount={totalCount}
            paginationModel={{ page: page, pageSize: rowsPerPage }}
            onPaginationModelChange={(newModel) => {
              handlePageChange(newModel.page);
              handleRowsPerPageChange(newModel.pageSize);
            }}
            pageSizeOptions={[5, 10, 25, 50]}
          getRowClassName={(params) => {
            const status = params.row.status?.toLowerCase();
            if (status === "pending") return "row-pending";
            if (status === "rejected") return "row-rejected";
            if (status === "approved") return "row-approved";
            if (status === "clarification needed") return "row-clarification";
            if (status === "draft") return "row-draft";
            if (status === "submitted") return "row-submitted";
            if (status === "declined") return "row-declined";
            return "";
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
              backgroundColor: "rgba(0, 0, 0, 0.04)",
            },
            "& .row-pending": {
              backgroundColor: "#f4f5ba !important",
            },
            "& .row-rejected": {
              backgroundColor: "#e6b2aa !important",
            },
            "& .row-approved": {
              backgroundColor: "#baf5c2 !important",
            },
            "& .row-clarification": {
              backgroundColor: "#9be7fa !important",
            },
            "& .row-draft": {
              backgroundColor: "#e0e0e0 !important",
            },
            "& .row-submitted": {
              backgroundColor: "#bbdefb !important",
            },
            "& .row-declined": {
              backgroundColor: "#e6b2aa !important",
            },
          }}
        />
        </Box>

        {selectedRows.length > 0 && selectedTab !== "submitted" && (
          <Box
            sx={{ mt: 3, p: 2, backgroundColor: "#f8f9fa", borderRadius: 1 }}
          >
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              // sx={{ mb: 2 }}
            >
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                Total Selected BOE's: {selectedRows.length}
              </Typography>

              <Stack direction="row" spacing={2}>
                <Button
                  variant="contained"
                  color="success"
                  onClick={() => handleApprovalAction("approved")}
                  disabled={approveLoading || rejectLoading}
                  startIcon={
                    approveLoading ? <CircularProgress size={20} /> : null
                  }
                  sx={{ minWidth: 120 }}
                >
                  {approveLoading ? "Processing..." : "Approved"}
                </Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => handleApprovalAction("rejected")}
                  disabled={approveLoading || rejectLoading}
                  startIcon={
                    rejectLoading ? <CircularProgress size={20} /> : null
                  }
                  sx={{ minWidth: 120 }}
                >
                  {rejectLoading ? "Processing..." : "Rejected"}
                </Button>
              </Stack>
            </Stack>

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
          </Box>
        )}
      </Card>

      <RequestStatus
        open={openModal}
        onClose={handleCloseModal}
        rowData={selectedRowData}
        getRequestData={getData}
        selectedTab="requests"
      />
    </Container>
  );
}
