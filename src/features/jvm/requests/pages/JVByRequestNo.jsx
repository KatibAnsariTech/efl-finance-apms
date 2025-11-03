import React from "react";
import { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import { DataGrid } from "@mui/x-data-grid";
import Container from "@mui/material/Container";
import { FormTableToolbar } from "src/components/table";
import { userRequest } from "src/requestMethod";
import { useRouter, useParams } from "src/routes/hooks";
import {
  Box,
  Typography,
  CircularProgress,
  TextField,
  Button,
  Stack,
} from "@mui/material";
import CloseButton from "src/routes/components/CloseButton";
import { showErrorMessage } from "src/utils/errorUtils";
import { Helmet } from "react-helmet-async";
import { JVByRequestNoColumns } from "../../components/JVByRequestNoColumns";
import JVCurrentStatus from "../../components/JVCurrentStatus";
import SAPResponseModal from "../../components/SAPResponseModal";
import swal from "sweetalert";
import { useJVM } from "src/contexts/JVMContext";

export default function JVByRequestNo() {
  const router = useRouter();
  const { parentId } = useParams();
  const { fetchJVMRequestCounts } = useJVM();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState("");
  const [searchDebounced, setSearchDebounced] = useState("");
  const [jvData, setJvData] = useState(null);
  const [comment, setComment] = useState("");
  const [approveLoading, setApproveLoading] = useState(false);
  const [rejectLoading, setRejectLoading] = useState(false);
  const [assigned, setAssigned] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState(null);

  const getData = async () => {
    setLoading(true);
    try {
      const response = await userRequest.get(
        `jvm/getFormsByParentId?parentId=${parentId}`,
        {
          params: {
            page: page + 1,
            limit: rowsPerPage,
            search: searchDebounced || undefined,
          },
        }
      );

      if (response.data.statusCode === 200) {
        const apiData = response.data.data.data;
        const pagination = response.data.data.pagination;
        const processedData = apiData.map((item, index) => ({
          ...item,
          id: item.groupId || `group-${index}`,
          groupId: item.groupId || `group-${index}`,
          createdAt: new Date(item.createdAt),
        }));
        setData(processedData);
        setTotalCount(pagination.totalCount);
      } else {
        throw new Error(response.data.message || "Failed to fetch data");
      }
    } catch (error) {
      showErrorMessage(
        error,
        "Failed to fetch JV data. Please try again.",
        swal
      );
      setData([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  const getRequestInfo = async () => {
    try {
      const response = await userRequest.get(
        `jvm/getRequestInfoByParentId?parentId=${parentId}`
      );
      if (response.data.statusCode === 200) {
        setJvData(response.data.data);
        setAssigned(response.data.data.assigned || false);
      }
    } catch (error) {
      console.error("Error fetching request info:", error);
    }
  };

  useEffect(() => {
    getData();
  }, [page, rowsPerPage, searchDebounced, parentId]);

  useEffect(() => {
    if (parentId) {
      getRequestInfo();
    }
  }, [parentId]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchDebounced(search);
      setPage(0);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  const handleFilterChange = (filterType, value) => {
    if (filterType === "search") {
      setSearch(value);
    }
  };

  const handleStatusClick = (rowData) => {
    setSelectedRowData(rowData);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedRowData(null);
  };

  const handleApprovalAction = async (action) => {
    if (action === "rejected" && !comment.trim()) {
      swal("Warning", "Please provide a comment for rejection", "warning");
      return;
    }

    if (!parentId) {
      swal("Error", "No request ID found", "error");
      return;
    }

    try {
      if (action === "approved") {
        setApproveLoading(true);
      } else {
        setRejectLoading(true);
      }

      const apiEndpoint =
        action === "approved" ? "jvm/acceptForm" : "jvm/declineForm";

      const response = await userRequest.post(apiEndpoint, {
        id: parentId,
        comment:
          comment.trim() || (action === "approved" ? "Approved" : "Declined"),
      });

      if (response.data.statusCode === 200) {
        swal("Success", `JV ${action} successfully`, "success");
        setComment("");
        await getRequestInfo();
        await fetchJVMRequestCounts();
      } else {
        throw new Error(response.data.message || `Failed to ${action} JV`);
      }
    } catch (error) {
      console.error("Error performing action:", error);
      showErrorMessage(error, `Failed to ${action} JV`, swal);
    } finally {
      if (action === "approved") {
        setApproveLoading(false);
      } else {
        setRejectLoading(false);
      }
    }
  };

  const columns = JVByRequestNoColumns({
    router,
    parentId,
    onStatusClick: handleStatusClick,
    basePath: "requests",
  });

  return (
    <>
      <Helmet>
        <title>JVs by Request No - {parentId}</title>
      </Helmet>

      <Container>
        <Card sx={{ p: 2 }}>
          <Box
            sx={{
              mb: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
            }}
          >
       
            <CloseButton
              onClick={() => router.back()}
              tooltip="Back to Requests"
            />
          </Box>

          <Box sx={{ width: "100%", mt: 2 }}>
            <DataGrid
              rows={data || []}
              columns={columns}
              loading={loading}
              getRowId={(row) => row?.id}
              paginationMode="server"
              rowCount={totalCount}
              paginationModel={{ page: page, pageSize: rowsPerPage }}
              onPaginationModelChange={(newModel) => {
                setPage(newModel.page);
                setRowsPerPage(newModel.pageSize);
              }}
              pageSizeOptions={[5, 10, 25, 50]}
              getRowClassName={(params) => {
                const status = params.row.status?.toLowerCase();
                if (status === "pending") return "row-pending";
                if (status === "rejected") return "row-rejected";
                if (status === "approved") return "row-approved";
                if (status === "declined") return "row-declined";
                if (status === "draft") return "row-draft";
                if (status === "submitted") return "row-submitted";
                return "";
              }}
              disableRowSelectionOnClick
              autoHeight
              sx={{
                "& .MuiDataGrid-row": {
                  "&:focus": {
                    outline: "none",
                  },
                  "&:focus-visible": {
                    outline: "none",
                  },
                },
                "& .MuiDataGrid-row": {
                  borderBottom: "1px solid #e0e0e0",
                },
                "& .MuiDataGrid-row:hover": {
                  backgroundColor: (theme) => theme.palette.action.hover,
                  opacity: 0.8,
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
                "& .row-declined": {
                  backgroundColor: "#e6b2aa !important",
                },
                "& .row-draft": {
                  backgroundColor: "#e0e0e0 !important",
                },
                "& .row-submitted": {
                  backgroundColor: "#bbdefb !important",
                },
              }}
            />
          </Box>
          {jvData && (
            <Box sx={{ mt: 3 }}>
              <JVCurrentStatus steps={jvData.steps || []} data={jvData} />
            </Box>
          )}

          {assigned && (
            <Box
              sx={{ mt: 3, p: 2, backgroundColor: "#f8f9fa", borderRadius: 1 }}
            >
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
              >
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  JV Actions
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
      </Container>
      <SAPResponseModal
        open={modalOpen}
        onClose={handleCloseModal}
        rowData={selectedRowData}
      />
    </>
  );
}
