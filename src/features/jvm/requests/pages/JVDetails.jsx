import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Card,
  Container,
  Typography,
  CircularProgress,
  TextField,
  Button,
  Stack,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { userRequest } from "src/requestMethod";
import { useRouter } from "src/routes/hooks";
import swal from "sweetalert";
import { showErrorMessage } from "src/utils/errorUtils";
import { RequestColumns } from "../components/RequestColumns";
import { JVDetailsColumns } from "../components/JVDetailsColumns";
import RequestStatus from "../components/RequestStatus";
import JVCurrentStatus from "../components/JVCurrentStatus";
import ColorIndicators from "../components/ColorIndicators";
import CloseButton from "src/routes/components/CloseButton";
import { Helmet } from "react-helmet-async";
import { useParams } from "src/routes/hooks";

export default function JVDetails() {
  const router = useRouter();
  const { parentId, groupId } = useParams();
  
  const requestId = groupId;
  const [data, setData] = useState([]);
  const [jvData, setJvData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState("");
  const [approveLoading, setApproveLoading] = useState(false);
  const [rejectLoading, setRejectLoading] = useState(false);
  const [assigned, setAssigned] = useState(false);

  const [page, setPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openModal, setOpenModal] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState(null);

  const handleBack = () => {
    router.back();
  };


  const getRequestInfo = useCallback(async () => {
    try {
      if (!requestId) {
        setJvData(null);
        setAssigned(false);
        return;
      }

      const response = await userRequest.get(`jvm/getRequestInfoByGroupId?groupId=${requestId}`);
      
      if (response.data.statusCode === 200) {
        const requestData = response.data.data;
        
        // Store the full JV data for CurrentStatus component
        setJvData(requestData);
        
        // Set assigned status from the response data
        setAssigned(requestData.assigned || false);
      } else {
        throw new Error(response.data.message || "Failed to fetch request info");
      }
    } catch (err) {
      console.error("Error fetching request info:", err);
      showErrorMessage(err, "Failed to fetch request details", swal);
      setJvData(null);
      setAssigned(false);
    }
  }, [requestId]);

  const getFormItems = useCallback(async (pageNum = 1) => {
    try {
      setLoading(true);

      if (!requestId) {
        setData([]);
        return;
      }

      const response = await userRequest.get(`jvm/getFormItemsByGroupId?groupId=${requestId}`, {
        params: {
          page: pageNum,
          limit: rowsPerPage,
        },
      });
      
      if (response.data.statusCode === 200) {
        const items = response.data.data.items || [];
        const pagination = response.data.data.pagination || {};
        const totalItems = pagination.totalItems || 0;
        
        // Add line numbers and ensure unique IDs
        const dataWithLineNumbers = items.map((item, index) => {
          const lineNumber = (pageNum - 1) * rowsPerPage + index + 1;
          return {
            ...item,
            id: item._id || item.itemId || `${pageNum}-${index}`,
            lineNumber: lineNumber,
          };
        });

        setData(dataWithLineNumbers);
        setTotalCount(totalItems);
      } else {
        throw new Error(response.data.message || "Failed to fetch form items");
      }
    } catch (err) {
      console.error("Error fetching form items:", err);
      showErrorMessage(err, "Failed to fetch form details", swal);
      setData([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, [requestId, rowsPerPage]);

  const getData = useCallback(async (pageNum = 1) => {
    // Fetch request info first (only on initial load)
    if (pageNum === 1) {
      await getRequestInfo();
    }
    
    // Fetch form items
    await getFormItems(pageNum);
  }, [getRequestInfo, getFormItems]);

  useEffect(() => {
    if (requestId) {
      setPage(0);
      setData([]);
      setJvData(null);
      setAssigned(false);
      setLoading(true);
      getData(1);
    }
  }, [requestId]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
    getData(newPage + 1); // API uses 1-based pagination
  };

  const handleRowsPerPageChange = (newRowsPerPage) => {
    setRowsPerPage(newRowsPerPage);
    setPage(0);
    getData(1);
  };


  const handleRequestClick = (rowData) => {
    setSelectedRowData(rowData);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedRowData(null);
  };

  const handleApprovalAction = async (action) => {
    if (action === "rejected" && !comment.trim()) {
      swal("Warning", "Please provide a comment for rejection", "warning");
      return;
    }

    if (!requestId) {
      swal("Error", "No request ID found", "error");
      return;
    }

    try {
      // Set the appropriate loading state based on the action
      if (action === "approved") {
        setApproveLoading(true);
      } else {
        setRejectLoading(true);
      }

      const apiEndpoint = action === "approved" ? "jvm/acceptForm" : "jvm/declineForm";
      
      const response = await userRequest.post(apiEndpoint, {
        id: requestId,
        comment: comment.trim() || (action === "approved" ? "Approved" : "Declined")
      });

      if (response.data.statusCode === 200) {
        swal("Success", `JV ${action} successfully`, "success");
        setComment("");
        // Only refresh request info, not form items
        await getRequestInfo();
      } else {
        throw new Error(response.data.message || `Failed to ${action} JV`);
      }
    } catch (error) {
      console.error("Error performing action:", error);
      showErrorMessage(error, `Failed to ${action} JV`, swal);
    } finally {
      // Reset the appropriate loading state based on the action
      if (action === "approved") {
        setApproveLoading(false);
      } else {
        setRejectLoading(false);
      }
    }
  };

  const columns = JVDetailsColumns();

  return (
    <>
      <Helmet>
        <title>JV Details - {groupId}</title>
      </Helmet>

      <Container>
        <Card sx={{ mt: 2, p: 2 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "16px",
            }}
          >
            <h2>JV Details: {groupId}</h2>
            <CloseButton
              onClick={handleBack}
              tooltip="Back to JV Requests"
            />
          </div>
          <Box
            sx={{
              width: "100%",
              height: 300,
            }}
          >
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
                if (status === "declined") return "row-declined";
                if (status === "draft") return "row-draft";
                if (status === "submitted") return "row-submitted";
                return "";
              }}
              columnResizeMode="onResize"
              disableColumnResize={false}
              disableColumnSort={false}
              sortModel={[{ field: 'lineNumber', sort: 'asc' }]}
              sx={{
                "& .MuiDataGrid-cell": {
                  "&:focus": { outline: "none" },
                  "&:focus-visible": { outline: "none" },
                  display: "flex",
                  alignItems: "center",
                },
                "& .MuiDataGrid-cell[data-field='sNo']": {
                  paddingLeft: "16px",
                },
                "& .MuiDataGrid-columnHeaders": {
                  backgroundColor: "#f5f6f8",
                  fontWeight: "bold",
                  color: "#637381",
                },
                "& .MuiDataGrid-columnHeader[data-field='sNo']": {
                  paddingLeft: "16px",
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
          <Box
            sx={{
              position: "relative",
              height: "52px", // Match DataGrid footer height
              marginTop: "-52px", // Overlap with DataGrid footer
              display: "flex",
              alignItems: "center",
              paddingLeft: "16px",
              zIndex: 0, // Lower z-index so pagination is clickable
              pointerEvents: "none", // Allow clicks to pass through
            }}
          >
            <Box sx={{ pointerEvents: "auto" }}>
              <ColorIndicators />
            </Box>
          </Box>

          {/* Approval History */}
          {jvData && (
            <Box sx={{ mt: 3 }}>
              <JVCurrentStatus 
                steps={jvData.steps || []} 
                data={jvData} 
              />
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

        <RequestStatus
          open={openModal}
          onClose={handleCloseModal}
          rowData={selectedRowData}
          getRequestData={getData}
          selectedTab="requests"
        />
      </Container>
    </>
  );
}
