import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Card,
  Container,
  Typography,
  Tabs,
  Tab,
  CircularProgress,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { userRequest } from "src/requestMethod";
import { fDateTime } from "src/utils/format-time";
import { useRouter } from "src/routes/hooks";
import swal from "sweetalert";
import { showErrorMessage } from "src/utils/errorUtils";
import { RequestColumns } from "../components/RequestColumns";

export default function Requests() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState("pendingWithMe");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [allData, setAllData] = useState([]);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const menuItems = [
    { label: "Pending with Me", value: "pendingWithMe" },
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
      case "draft":
        return "#e0e0e0";
      case "submitted":
        return "#bbdefb";
      case "rejected":
        return "#e6b2aa";
      default:
        return "white";
    }
  };

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

      // Choose API endpoint based on selected tab
      const apiEndpoint = selectedTab === "pendingWithMe" 
        ? "jvm/getMyAssignedForms" 
        : "jvm/getMyWorkflowForms";

      try {
        const response = await userRequest.get(apiEndpoint, {
          params: {
            page: page,
            limit: limit,
          },
        });
        apiData = response.data.data || [];
        totalCount = response.data.pagination?.totalCount || 0;
        setHasMore(response.data.pagination?.hasNextPage || false);
      } catch (userRequestError) {
        console.error("API Error:", userRequestError);
        // Fallback to mock data if API fails
        try {
          const fetchResponse = await fetch(
            `https://68cce4b9da4697a7f303dd30.mockapi.io/requests/request-data?page=${page}&limit=${limit}`
          );
          const fetchData = await fetchResponse.json();
          apiData = fetchData;
          totalCount = 100;
        } catch (fallbackError) {
          console.error("Fallback API Error:", fallbackError);
          apiData = [];
          totalCount = 0;
        }
      }

      await new Promise((resolve) => setTimeout(resolve, 500));

      let transformedData;

      transformedData = apiData.map((item, index) => ({
        id: item.groupId || item.id || item._id,
        groupId: item.groupId,
        parentId: item.parentId || "",
        sNo: `JV${String(item.groupId?.split('-')[2] || item.id || item._id).padStart(6, "0")}`,
        documentType: "JV",
        documentDate: new Date().toISOString().split('T')[0],
        postingDate: new Date().toISOString().split('T')[0],
        businessArea: "1000",
        accountType: "GL",
        postingKey: "40",
        vendorCustomerGLName: "Sample Vendor",
        vendorCustomerGLNumber: "100000",
        amount: parseFloat(item.totalDebit || item.totalCredit || 0),
        assignment: "",
        costCenter: "1000",
        profitCenter: "1000",
        specialGLIndication: "",
        referenceNumber: `REF${String(item.groupId?.split('-')[2] || item.id || item._id).padStart(4, "0")}`,
        personalNumber: "",
        remarks: "",
        autoReversal: "N",
        status: item.status || "Draft",
        totalAmount: parseFloat(item.totalDebit || item.totalCredit || 0),
        totalDebit: parseFloat(item.totalDebit || 0),
        totalCredit: parseFloat(item.totalCredit || 0),
        count: item.count || 0,
        currentStep: item.currentStep || 1,
        createdAt: item.createdAt || new Date().toISOString(),
      }));

      if (isLoadMore) {
        setData((prev) => [...prev, ...transformedData]);
      } else {
        setData(transformedData);
        setAllData(transformedData);
      }

      setTotalCount(totalCount);
    } catch (err) {
      console.error("Error in getData:", err);
      setData([]);
      setAllData([]);
      setTotalCount(0);
      setHasMore(false);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  const getAllData = async () => {
    try {
      let allApiData;

      // Choose API endpoint based on selected tab
      const apiEndpoint = selectedTab === "pendingWithMe" 
        ? "jvm/getMyAssignedForms" 
        : "jvm/getMyWorkflowForms";

      try {
        const response = await userRequest.get(apiEndpoint, {
          params: {
            page: 1,
            limit: 1000,
          },
        });
        allApiData = response.data.data || [];
      } catch (userRequestError) {
        console.error("API Error in getAllData:", userRequestError);
        // Fallback to mock data if API fails
        try {
          const fetchResponse = await fetch(
            `https://68cce4b9da4697a7f303dd30.mockapi.io/requests/request-data?page=1&limit=1000`
          );
          const fetchData = await fetchResponse.json();
          allApiData = fetchData;
        } catch (fallbackError) {
          console.error("Fallback API Error in getAllData:", fallbackError);
          allApiData = [];
        }
      }

      let transformedData;

      transformedData = allApiData.map((item, index) => ({
        id: item.groupId || item.id || item._id,
        groupId: item.groupId,
        parentId: item.parentId || "",
        sNo: `JV${String(item.groupId?.split('-')[2] || item.id || item._id).padStart(6, "0")}`,
        documentType: "JV",
        documentDate: new Date().toISOString().split('T')[0],
        postingDate: new Date().toISOString().split('T')[0],
        businessArea: "1000",
        accountType: "GL",
        postingKey: "40",
        vendorCustomerGLName: "Sample Vendor",
        vendorCustomerGLNumber: "100000",
        amount: parseFloat(item.totalDebit || item.totalCredit || 0),
        assignment: "",
        costCenter: "1000",
        profitCenter: "1000",
        specialGLIndication: "",
        referenceNumber: `REF${String(item.groupId?.split('-')[2] || item.id || item._id).padStart(4, "0")}`,
        personalNumber: "",
        remarks: "",
        autoReversal: "N",
        status: item.status || "Draft",
        totalAmount: parseFloat(item.totalDebit || item.totalCredit || 0),
        totalDebit: parseFloat(item.totalDebit || 0),
        totalCredit: parseFloat(item.totalCredit || 0),
        count: item.count || 0,
        currentStep: item.currentStep || 1,
        createdAt: item.createdAt || new Date().toISOString(),
      }));

      setAllData(transformedData);
      setData(transformedData);
      setTotalCount(transformedData.length);
      setHasMore(false);
    } catch (err) {
      console.error("Error in getAllData:", err);
      setAllData([]);
      setData([]);
      setTotalCount(0);
      setHasMore(false);
    }
  };

  useEffect(() => {
    setPage(1);
    setData([]);
    setAllData([]);
    setIsLoadingMore(false);
    setLoading(true);
    getData(1);
  }, [selectedTab]);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };


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
    // Handle request click - you can add modal or navigation logic here
    console.log("Request clicked:", rowData);
  };

  const columns = RequestColumns({
    onRequestClick: handleRequestClick,
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
        <Box
          sx={{
            width: "100%",
            height: 380,
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

      </Card>

    </Container>
  );
}
