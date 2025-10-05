import React from "react";
import { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import { DataGrid } from "@mui/x-data-grid";
import Container from "@mui/material/Container";
import CircularIndeterminate from "src/utils/loader";
import { FormTableToolbar } from "src/components/table";
import { applyFilter, getComparator } from "src/utils/utils";
import { publicRequest, userRequest } from "src/requestMethod";
import FormRequestTabs from "src/features/credit-deviation/approvals/components/FormRequestTabs";
import { action } from "src/theme/palette";
import { format } from "date-fns";
import { useRouter } from "src/routes/hooks";
import { useCounts } from "src/contexts/CountsContext";
import { Box, Tooltip, Typography } from "@mui/material";
import RequestStatus from "../components/RequestStatus";
import ColorIndicators from "../components/ColorIndicators";
import { fDateTime } from "src/utils/format-time";
import swal from "sweetalert";
import { showErrorMessage } from "src/utils/errorUtils";
import { Helmet } from "react-helmet-async";
import { RequestedJVColumns } from "../components/RequestedJVColumns";

export default function RequestedJV() {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [limit, setLimit] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState("");
  const [selectedTab, setSelectedTab] = useState("all");
  const [approvalCount, setApprovalCount] = useState(0);
  const [statusCounts, setStatusCounts] = useState({
    all: 0,
    pending: 0,
    approved: 0,
    declined: 0,
  });
  const [openStatusModal, setOpenStatusModal] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState(null);

  const menuItems = [
    { label: "All", value: "all", count: statusCounts.all },
    { label: "Pending", value: "Pending", count: statusCounts.pending },
    { label: "Approved", value: "Approved", count: statusCounts.approved },
    { label: "Declined", value: "Declined", count: statusCounts.declined },
  ];

  const getData = async () => {
    setLoading(true);
    try {
      const response = await userRequest.get("jvm/getForms", {
        params: {
          page: page + 1, // API uses 1-based pagination
          limit: rowsPerPage,
          status: selectedTab !== "all" ? selectedTab : undefined,
        },
      });

      if (response.data.statusCode === 200) {
        const apiData = response.data.data.data;
        const pagination = response.data.data.pagination;
        const processedData = apiData.map((item, index) => ({
          ...item,
          id: item.groupId,
          createdAt: new Date(item.createdAt),
        }));
        setData(processedData);
        setTotalCount(pagination.totalCount);
        const counts = {
          all: pagination.totalCount,
          pending: processedData.filter((item) => item.status === "Pending")
            .length,
          approved: processedData.filter((item) => item.status === "Approved")
            .length,
          declined: processedData.filter((item) => item.status === "Declined")
            .length,
        };
        setStatusCounts(counts);
      } else {
        throw new Error(response.data.message || "Failed to fetch data");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      showErrorMessage(error, "Failed to fetch JV data", swal);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, [page, rowsPerPage, selectedTab]);

  const handleFilterChange = (filterType, value) => {
    if (filterType === "search") {
      setSearch(value);
    }
  };

  const handleExport = () => {
    // Export functionality
    console.log("Export clicked");
  };

  const handleStatusClick = (rowData) => {
    setSelectedRowData(rowData);
    setOpenStatusModal(true);
  };

  const handleCloseStatusModal = () => {
    setOpenStatusModal(false);
    setSelectedRowData(null);
  };

  const handleDelete = async (row) => {
    // Only allow deletion if canDelete is true
    if (!row.canDelete) {
      swal("Cannot Delete", "This request cannot be deleted.", "warning");
      return;
    }

    const result = await swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this journal voucher request!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    });

    if (result) {
      try {
        await userRequest.delete(`jvm/deleteRequest/${row.groupId}`);
        swal("Deleted!", "Journal voucher request has been deleted successfully.", "success");
        getData();
      } catch (error) {
        console.error("Delete error:", error);
        showErrorMessage(error, "Failed to delete journal voucher request. Please try again.", swal);
      }
    }
  };

  // Get columns from separate file
  const columns = RequestedJVColumns({ handleStatusClick, router, handleDelete });

  // Apply filtering and sorting to the data
  const dataFiltered = (() => {
    let filteredData = [...data];

    // Apply status tab filter
    if (selectedTab !== "all") {
      filteredData = filteredData.filter((item) => item.status === selectedTab);
    }

    // Apply search filter if search term exists
    if (search) {
      filteredData = filteredData.filter((item) =>
        ["groupId", "parentId", "status"].some((field) =>
          item[field]?.toString().toLowerCase().includes(search.toLowerCase())
        )
      );
    }

    // Apply sorting
    const comparator = getComparator("desc", "createdAt");
    const stabilizedThis = filteredData.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });

    return stabilizedThis.map((el) => el[0]);
  })();

  return (
    <>
      <Helmet>
        <title>Requested JV's</title>
      </Helmet>

      <Container>
        <FormRequestTabs
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
          menuItems={menuItems}
          approvalCount={approvalCount}
        />
        <Card sx={{ mt: 2, p: 2 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginRight: "20px",
            }}
          >
            <FormTableToolbar
              search={search}
              onFilterChange={handleFilterChange}
              placeholder="Search JVs..."
            />
          </div>

          <Box sx={{ width: "100%" }}>
            <DataGrid
              rows={dataFiltered || []}
              columns={columns}
              getRowId={(row) => row?.groupId}
              loading={loading}
              pagination
              paginationMode="server"
              rowCount={totalCount}
              paginationModel={{ page: page, pageSize: rowsPerPage }}
              onPaginationModelChange={(newModel) => {
                setPage(newModel.page);
                setRowsPerPage(newModel.pageSize);
                setLimit(newModel.pageSize);
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
              autoHeight
              disableRowSelectionOnClick
              sx={{
                "& .MuiDataGrid-cell": {
                  justifyContent: "center",
                  display: "flex",
                  alignItems: "center",
                  "&:focus": {
                    outline: "none",
                  },
                  "&:focus-visible": {
                    outline: "none",
                  },
                },
                "& .MuiDataGrid-columnHeaders": {
                  backgroundColor: "#f5f6f8",
                  fontWeight: "bold",
                  color: "#637381",
                },
                "& .MuiDataGrid-columnHeaderTitle": {
                  width: "100%",
                  textAlign: "center",
                },
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
          open={openStatusModal}
          onClose={handleCloseStatusModal}
          rowData={selectedRowData}
          getRequestData={getData}
          selectedTab="jv-status"
        />
      </Container>
    </>
  );
}
