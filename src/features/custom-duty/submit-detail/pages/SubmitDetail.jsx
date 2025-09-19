import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Card,
  Container,
  Typography,
  CircularProgress,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { userRequest } from "src/requestMethod";
import { fDateTime } from "src/utils/format-time";
import { useRouter } from "src/routes/hooks";
import { useParams } from "react-router-dom";
import { RequestColumns } from "../components/SubmitDetailColumns";
import RequestStatus from "../components/RequestStatus";

export default function SubmitDetail() {
  const router = useRouter();
  const { id } = useParams();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitRequestData, setSubmitRequestData] = useState(null);

  const [page, setPage] = useState(0);
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

      const page = pageNum;
      const limit = rowsPerPage;
      
      let apiData;
      let totalCount;

      try {
        const response = await userRequest.get(
          `https://68cce4b9da4697a7f303dd30.mockapi.io/requests/request-data`,
          {
            params: {
              page: page,
              limit: limit
            }
          }
        );
        apiData = response.data;
        totalCount = response.headers['x-total-count'] || 100;
      } catch (userRequestError) {
        const fetchResponse = await fetch(
          `https://68cce4b9da4697a7f303dd30.mockapi.io/requests/request-data?page=${page}&limit=${limit}`
        );
        const fetchData = await fetchResponse.json();
        apiData = fetchData;
        totalCount = 100;
      }

      await new Promise((resolve) => setTimeout(resolve, 500));

      const transformedData = apiData.map((item, index) => ({
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

      if (isLoadMore) {
        setData((prev) => [...prev, ...transformedData]);
      } else {
        setData(transformedData);
      }

      setTotalCount(totalCount);
      setHasMore(page * limit < totalCount);
    } catch (err) {
      setData([]);
      setTotalCount(0);
      setHasMore(false);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const getSubmitRequestData = async () => {
    try {
      const response = await userRequest.get(
        `https://68cce4b9da4697a7f303dd30.mockapi.io/requests/request-data/${id}`
      );
      setSubmitRequestData(response.data);
    } catch (error) {
      setSubmitRequestData({
        id: id,
        submitRequestNo: `2056627067`,
        totalRecords: Math.floor(Math.random() * 50) + 20,
        submitDate: new Date().toISOString(),
        submittedBy: "shweta@efl.com",
      });
    }
  };

  useEffect(() => {
    setPage(1);
    setData([]);
    setLoading(true);
    getSubmitRequestData();
    getData(1);
  }, [id]);

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

        if (isNearBottom && hasMore && !loadingMore && !loading && !isLoadingMore) {
          handleLoadMore();
        }
        
        isScrolling = false;
      }, 100);
    };

    scrollableElement.addEventListener("scroll", handleScroll, { passive: true });
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

  const columns = RequestColumns({
    onRequestClick: handleRequestClick,
  });

  return (
    <Container sx={{mb: -15 }}>
      <Card sx={{ mt: 2, p: 2 }}>
        <Box
          sx={{
            width: "100%",
            height: "calc(100vh - 160px)",
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
                {loading ? "Loading data..." : loadingMore ? "Loading more data..." : "Loading..."}
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
            slots={{
              footer: () => null,
            }}
            sx={{
              "& .MuiDataGrid-cell": {
                "&:focus": { outline: "none" },
                "&:focus-visible": { outline: "none" },
              },
              "& .MuiDataGrid-cell[data-field='requestNo']": {
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              },
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "#f5f6f8",
                fontWeight: "bold",
                color: "#637381",
              },
              "& .MuiDataGrid-columnHeader[data-field='requestNo']": {
                justifyContent: "center",
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
        </Box>
      </Card>
      
      <RequestStatus
        open={openModal}
        onClose={handleCloseModal}
        rowData={selectedRowData}
        getRequestData={getData}
        selectedTab="submitDetail"
      />
    </Container>
  );
}
