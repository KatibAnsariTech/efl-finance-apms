import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Card,
  Container,
  Typography,
  Tabs,
  Tab,
  CircularProgress,
  Button,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { FilterList } from "@mui/icons-material";
import { userRequest } from "src/requestMethod";
import { fDateTime } from "src/utils/format-time";
import { useRouter } from "src/routes/hooks";
import swal from "sweetalert";
import { showErrorMessage } from "src/utils/errorUtils";
import { RequestColumns } from "../components/RequestColumns";
import RequestStatus from "../components/RequestStatus";
import ColorIndicators from "../components/ColorIndicators";
import JVMRequestTabs from "../components/JVMRequestTabs";
import FilterModal from "../../requested-jv/components/FilterModal";
import { useJVM } from "src/contexts/JVMContext";

export default function Requests() {
  const router = useRouter();
  const { jvmRequestCounts } = useJVM();
  const [selectedTab, setSelectedTab] = useState("pendingWithMe");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openModal, setOpenModal] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [openFilterModal, setOpenFilterModal] = useState(false);
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');

  const menuItems = [
    { label: "Pending with Me", value: "pendingWithMe" },
    { label: "All Requests", value: "allRequests" },
  ];

  const getData = async (pageNum = 1) => {
    try {
      setLoading(true);

      const page = pageNum;
      const limit = rowsPerPage;

      let apiData;
      let totalCount;

      // Choose API endpoint based on selected tab
      const apiEndpoint = selectedTab === "pendingWithMe" 
        ? "jvm/getMyAssignedForms" 
        : "jvm/getMyWorkflowForms";

      const params = {
        page: page,
        limit: limit,
      };
      
      if (filterStartDate) params.startDate = filterStartDate;
      if (filterEndDate) params.endDate = filterEndDate;
      
      const response = await userRequest.get(apiEndpoint, { params });
      apiData = response.data.data.data || [];
      totalCount = response.data.data.pagination?.totalCount || 0;

      // Ensure each row has an id field for DataGrid
      const dataWithIds = apiData.map((item, index) => ({
        ...item,
        id: item.groupId || item.id || index,
      }));

      setData(dataWithIds);
      setTotalCount(totalCount);
    } catch (err) {
      console.error("Error in getData:", err);
      setData([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    setPage(0);
    setData([]);
    setLoading(true);
    getData(1);
  }, [selectedTab, filterStartDate, filterEndDate]);

  // Clear filters when tab changes
  useEffect(() => {
    setFilterStartDate('');
    setFilterEndDate('');
  }, [selectedTab]);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
  };


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

  const handleOpenFilterModal = () => {
    setOpenFilterModal(true);
  };

  const handleCloseFilterModal = () => {
    setOpenFilterModal(false);
  };

  const columns = RequestColumns({
    onRequestClick: handleRequestClick,
  });

  return (
    <Container>
      <JVMRequestTabs
        selectedTab={selectedTab}
        setSelectedTab={handleTabChange}
        menuItems={menuItems}
        jvmRequestCounts={jvmRequestCounts}
      />

      <Card sx={{ mt: 2, p: 2 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            marginBottom: "16px",
            mb: 1,
          }}
        >
          <Button
            variant="text"
            size="small"
            startIcon={<FilterList />}
            onClick={handleOpenFilterModal}
            sx={{ 
              backgroundColor: 'transparent',
              minHeight: 'auto',
              height: '32px',
              py: 0.5,
              px: 1,
              '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.04)',
                height: '32px',
                minHeight: 'auto',
              },
              '&:focus': {
                outline: 'none',
              },
              '&:focus-visible': {
                outline: 'none',
              },
            }}
          >
            Filter
          </Button>
        </Box>
        <Box
          sx={{
            width: "100%",
          }}
        >
          <DataGrid
            rows={data}
            columns={columns}
            loading={loading}
            disableRowSelectionOnClick
            autoHeight
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

      </Card>

      <RequestStatus
        open={openModal}
        onClose={handleCloseModal}
        rowData={selectedRowData}
        getRequestData={getData}
        selectedTab="requests"
      />

      <FilterModal
        open={openFilterModal}
        handleClose={handleCloseFilterModal}
        setStartDate={setFilterStartDate}
        setEndDate={setFilterEndDate}
      />
    </Container>
  );
}
