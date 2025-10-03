import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  Box,
  Card,
  Paper,
  Chip,
  CircularProgress,
  IconButton,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { fDateTime } from "src/utils/format-time";
import { userRequest } from "src/requestMethod";
import { Helmet } from "react-helmet-async";
import { useRouter } from "src/routes/hooks";
import { FormTableToolbar } from "src/components/table";
import { applyFilter, getComparator } from "src/utils/utils";
import excel from "../../../../../public/assets/excel.svg";
import ColorIndicators from "../components/ColorIndicators";
import CustomDutyRequestModal from "../components/CustomDutyRequestModal";
import Iconify from "src/components/iconify";

export default function MyRequests() {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState("createdAt");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [region, setRegion] = useState();
  const [status, setStatus] = useState();
  const [refund, setRefund] = useState();
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [openModal, setOpenModal] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState(null);

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

  const getStatusChip = (status) => {
    const statusConfig = {
      Draft: { color: "default", label: "Draft" },
      Submitted: { color: "info", label: "Submitted" },
      Approved: { color: "success", label: "Approved" },
      Rejected: { color: "error", label: "Rejected" },
      Pending: { color: "warning", label: "Pending" },
      "Clarification Needed": { color: "info", label: "Clarification Needed" },
    };

    const config = statusConfig[status] || { color: "default", label: status };
    return <Chip label={config.label} color={config.color} size="small" />;
  };

  // Debounced search
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 600);

    return () => clearTimeout(handler);
  }, [search]);

  // Fetch data
  const getData = async () => {
    try {
      setLoading(true);
      
      // Build query parameters for pagination
      const queryParams = new URLSearchParams({
        page: (page + 1).toString(), // API expects 1-based page numbers
        limit: rowsPerPage.toString(),
        action: 'all'
      });

      // Add search parameter if provided
      if (debouncedSearch) {
        queryParams.append('search', debouncedSearch);
      }

      // Add other filter parameters if provided
      if (region) queryParams.append('region', region);
      if (status) queryParams.append('status', status);
      if (refund) queryParams.append('refund', refund);
      if (startDate) queryParams.append('startDate', startDate);
      if (endDate) queryParams.append('endDate', endDate);

      const response = await userRequest.get(`/custom/getForms?${queryParams.toString()}`);
      
      if (response.data && response.data.data) {
        const { forms, totalForms, page: currentPage, limit } = response.data.data;
        
        setData(forms || []);
        setTotalCount(totalForms || 0);
      } else {
        setData([]);
        setTotalCount(0);
      }
    } catch (error) {
      console.error("Error fetching requests:", error);
      setData([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, [
    debouncedSearch,
    page,
    rowsPerPage,
    region,
    status,
    refund,
    startDate,
    endDate,
  ]);

  const sortableColumns = ["createdAt", "requestNo"];

  const handleSort = (event, id) => {
    if (sortableColumns.includes(id)) {
      const isAsc = orderBy === id && order === "asc";
      setOrder(isAsc ? "desc" : "asc");
      setOrderBy(id);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    setRowsPerPage(rowsPerPage);
    window.scrollTo(0, 0);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value));
  };

  const handleFilterChange = (field, value) => {
    setPage(0);
    setSearch(value);
  };

  const dataFiltered = applyFilter({
    inputData: data,
    comparator: getComparator(order, orderBy),
    search,
  });

  const handleExport = async () => {
    try {
      // Simulate export functionality
      console.log("Exporting data...");
    } catch (error) {
      console.error("Export error:", error);
    }
  };

  const columns = [
    {
      field: "requestNo",
      headerName: "Request No.",
      width: 200,
    },
    {
      field: "typeOfTransaction",
      headerName: "Transaction Type",
      width: 150,
    },
    {
      field: "transactionDate",
      headerName: "Transaction Date",
      width: 150,
      renderCell: (params) => {
        const date = new Date(params.value);
        return date.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "2-digit",
        });
      },
    },
    {
      field: "transactionAmount",
      headerName: "Amount",
      width: 120,
      renderCell: (params) => `₹${params.value.toLocaleString()}`,
    },
    {
      field: "status",
      headerName: "Status",
      width: 120,
    },
    {
      field: "company",
      headerName: "Company",
      width: 150,
      renderCell: (params) => {
        const company = params.value;
        return company || "N/A";
      },
    },
    {
      field: "createdAt",
      headerName: "Created At",
      width: 150,
      renderCell: (params) => {
        const date = new Date(params.value);
        return date.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "2-digit",
        });
      },
    },
  ];


  return (
    <>
      <Helmet>
        <title>My Custom Duty Requests</title>
      </Helmet>

      <Container>
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-start",
            alignItems: "center",
            gap: 0.2,
          }}
        >
          <IconButton
            size="small"
            color="error"
            sx={{ p: 0, mr: 0.5 }}
          >
            <Iconify icon="eva:info-fill" />
          </IconButton>
          <span
            style={{
              fontSize: "0.75rem",
              color: "red",
              marginRight: "4px",
              fontWeight: "500",
            }}
          >
            Requests pending after 3:30 PM will be auto rejected.
          </span>
        </Box>
        <Card sx={{ mt: 2, p: 2 }}>
          {/* <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginRight: "20px",
            }}
          >
            <FormTableToolbar
              search={search}
              onFilterChange={handleFilterChange}
              placeholder="Search requests..."
            />
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontSize: "0.8rem",
                fontWeight: "bold",
                cursor: "pointer",
                gap: "8px",
              }}
            >
              <span onClick={handleExport} style={{ color: "#167beb" }}>
                Export{" "}
                <img src={excel} style={{ width: "1.2rem", marginLeft: "5px" }} />
              </span>
            </div>
          </div> */}

          <Box sx={{ width: "100%" }}>
            <DataGrid
              rows={data || []} 
              columns={columns}
              getRowId={(row) => row._id}
              autoHeight
              disableSelectionOnClick
              loading={loading}
              pagination
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
                if (status === "clarification needed")
                  return "row-clarification";
                return "";
              }}
              disableRowSelectionOnClick
              sx={{
                "& .MuiDataGrid-columnHeaders": {
                  backgroundColor: "#f5f6f8",
                  fontWeight: "bold",
                  color: "#637381",
                },
                "& .MuiDataGrid-cell:focus": {
                  outline: "none",
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
      </Container>
      <CustomDutyRequestModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        rowData={selectedRowData}
        getRequestData={getData}
        selectedTab="myRequests"
      />
    </>
  );
}
