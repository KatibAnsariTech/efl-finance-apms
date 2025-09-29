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
import { Helmet } from "react-helmet-async";
import { useParams, useSearchParams } from "react-router-dom";

export default function JVDetails() {
  const router = useRouter();
  const { jvId } = useParams();
  const [searchParams] = useSearchParams();
  
  // Get ID from either URL parameter or query parameter
  const requestId = jvId || searchParams.get('id');
  const [data, setData] = useState([]);
  const [jvData, setJvData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState("");
  const [approveLoading, setApproveLoading] = useState(false);
  const [rejectLoading, setRejectLoading] = useState(false);
  const [assigned, setAssigned] = useState(false);

  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState(null);


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

  const getFormItems = useCallback(async (pageNum = 1, isLoadMore = false) => {
    try {
      if (isLoadMore) {
        setLoadingMore(true);
      } else {
        setLoading(true);
      }

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

        if (isLoadMore) {
          setData((prev) => [...prev, ...dataWithLineNumbers]);
        } else {
          setData(dataWithLineNumbers);
        }
        
        setTotalCount(totalItems);
        setHasMore(pagination.hasNextPage || false);
      } else {
        throw new Error(response.data.message || "Failed to fetch form items");
      }
    } catch (err) {
      console.error("Error fetching form items:", err);
      showErrorMessage(err, "Failed to fetch form details", swal);
      setData([]);
      setTotalCount(0);
      setHasMore(false);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [requestId, rowsPerPage]);

  const getData = useCallback(async (pageNum = 1, isLoadMore = false) => {
    // Fetch request info first (only on initial load)
    if (!isLoadMore && pageNum === 1) {
      await getRequestInfo();
    }
    
    // Fetch form items
    await getFormItems(pageNum, isLoadMore);
  }, [getRequestInfo, getFormItems]);

  useEffect(() => {
    if (requestId) {
      setPage(1);
      setData([]);
      setJvData(null);
      setAssigned(false);
      setIsLoadingMore(false);
      setLoading(true);
      getData(1);
    }
  }, [requestId]);

  const handleLoadMore = useCallback(() => {
    if (hasMore && !loadingMore && !loading && !isLoadingMore) {
      setIsLoadingMore(true);
      const nextPage = page + 1;
      setPage(nextPage);
      getData(nextPage, true).finally(() => {
        setIsLoadingMore(false);
      });
    }
  }, [hasMore, loadingMore, loading, page, isLoadingMore, getData]);

  useEffect(() => {
    const dataGrid = document.querySelector(".MuiDataGrid-root");
    if (!dataGrid) return;

    const scrollableElement = dataGrid.querySelector(
      ".MuiDataGrid-virtualScroller"
    );
    if (!scrollableElement) return;

    let isScrolling = false;
    let scrollTimeout;

    const handleScroll = () => {
      if (isScrolling) return;

      isScrolling = true;
      clearTimeout(scrollTimeout);

      scrollTimeout = setTimeout(() => {
        const { scrollTop, scrollHeight, clientHeight } = scrollableElement;
        const isNearBottom = scrollTop + clientHeight >= scrollHeight - 50;

        if (
          isNearBottom &&
          hasMore &&
          !loadingMore &&
          !loading &&
          !isLoadingMore
        ) {
          handleLoadMore();
        }

        isScrolling = false;
      }, 100);
    };

    scrollableElement.addEventListener("scroll", handleScroll, {
      passive: true,
    });
    return () => {
      scrollableElement.removeEventListener("scroll", handleScroll);
      clearTimeout(scrollTimeout);
    };
  }, [hasMore, loadingMore, loading, isLoadingMore, handleLoadMore]);


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
        <title>JV Details - {requestId}</title>
      </Helmet>

      <Container>
        <Card sx={{ mt: 2, p: 2 }}>
          <Box
            sx={{
              width: "100%",
              height: 300,
              position: "relative",
            }}
          >
            {(loading || loadingMore) && (
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                  zIndex: 10,
                  height: "100%",
                  width: "100%",
                }}
              >
                <CircularProgress size={50} thickness={4} />
                <Typography
                  variant="h6"
                  sx={{
                    mt: 2,
                    color: "text.secondary",
                    fontWeight: 500,
                    textAlign: "center",
                  }}
                >
                  {loading
                    ? "Loading data..."
                    : loadingMore
                    ? "Loading more data..."
                    : "Loading..."}
                </Typography>
              </Box>
            )}

            <DataGrid
              rows={data}
              columns={columns}
              loading={false}
              disableRowSelectionOnClick
              hideFooterSelectedRowCount
              pagination={false}
              hideFooterPagination
              onRowsScrollEnd={handleLoadMore}
              columnResizeMode="onResize"
              disableColumnResize={false}
              disableColumnSort={false}
              sortModel={[{ field: 'lineNumber', sort: 'asc' }]}
              slots={{
                footer: () => null,
              }}
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
              }}
            />
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
