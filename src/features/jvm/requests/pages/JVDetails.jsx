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
import { Helmet } from "react-helmet-async";
import { useParams, useSearchParams } from "react-router-dom";

export default function JVDetails() {
  const router = useRouter();
  const { jvId } = useParams();
  const [searchParams] = useSearchParams();
  
  // Get ID from either URL parameter or query parameter
  const requestId = jvId || searchParams.get('id');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState(null);


  const getData = async (pageNum = 1, isLoadMore = false) => {
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

      const response = await userRequest.get(`jvm/getFormByGroupId?groupId=${requestId}`, {
        params: {
          page: pageNum,
          limit: rowsPerPage,
        },
      });
      
      if (response.data.statusCode === 200) {
        const items = response.data.data.items || [];
        const totalItems = response.data.data.items?.length || 0;
        
        // Add line numbers and ensure unique IDs
        const dataWithLineNumbers = items.map((item, index) => ({
          ...item,
          id: item._id || item.itemId || index,
          lineNumber: (pageNum - 1) * rowsPerPage + index + 1,
        }));

        if (isLoadMore) {
          setData((prev) => [...prev, ...dataWithLineNumbers]);
        } else {
          setData(dataWithLineNumbers);
        }
        
        setTotalCount(totalItems);
        setHasMore(pageNum * rowsPerPage < totalItems);
      } else {
        throw new Error(response.data.message || "Failed to fetch form data");
      }
    } catch (err) {
      console.error("Error fetching form data:", err);
      showErrorMessage(err, "Failed to fetch form details", swal);
      setData([]);
      setTotalCount(0);
      setHasMore(false);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    if (requestId) {
      setPage(1);
      setData([]);
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
  }, [hasMore, loadingMore, loading, page, isLoadingMore]);

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
      setActionLoading(true);

      const apiEndpoint = action === "approved" ? "jvm/acceptForm" : "jvm/declineForm";
      
      const response = await userRequest.post(apiEndpoint, {
        id: requestId,
        comment: comment.trim() || (action === "approved" ? "Approved" : "Declined")
      });

      if (response.data.statusCode === 200) {
        swal("Success", `JV ${action} successfully`, "success");
        setComment("");
        getData(); // Refresh the data
      } else {
        throw new Error(response.data.message || `Failed to ${action} JV`);
      }
    } catch (error) {
      console.error("Error performing action:", error);
      showErrorMessage(error, `Failed to ${action} JV`, swal);
    } finally {
      setActionLoading(false);
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
