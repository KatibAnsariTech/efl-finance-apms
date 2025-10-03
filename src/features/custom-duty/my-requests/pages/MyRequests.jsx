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
  const [formsData, setFormsData] = useState([]); // Removed any mock data initialization

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
      // Generate dummy data for demonstration
      const generateDummyData = (startId, count) => {
        const statuses = ["Pending", "Approved", "Rejected"];
        const descriptions = [
          "Duty Payment",
          "Custom Duty Payment",
          "Import Duty",
          "Export Duty Refund",
          "Additional Duty",
          "Countervailing Duty",
          "Anti-dumping Duty",
          "Safeguard Duty",
        ];
        const transactionTypes = ["Debit", "Credit"];

        return Array.from({ length: count }, (_, index) => {
          const id = startId + index;
          const status = statuses[Math.floor(Math.random() * statuses.length)];
          const description =
            descriptions[Math.floor(Math.random() * descriptions.length)];
          const typeOfTransaction =
            transactionTypes[
              Math.floor(Math.random() * transactionTypes.length)
            ];
          const amount = Math.floor(Math.random() * 500000) + 50000;

          return {
            id: id.toString(),
            _id: id.toString(),
            requestNo: `CDR-2024-${String(id).padStart(3, "0")}`,
            requestedDate: new Date(
              2024,
              0,
              15 + Math.floor(Math.random() * 30),
              Math.floor(Math.random() * 24),
              Math.floor(Math.random() * 60)
            ).toISOString(),
            boeNumber: `BOE-2024-${String(id).padStart(3, "0")}`,
            srNo: id.toString(),
            challanNo: `2056627${String(67 + id).padStart(3, "0")}`,
            transactionDate: new Date(
              2024,
              0,
              15 + Math.floor(Math.random() * 30),
              Math.floor(Math.random() * 24),
              Math.floor(Math.random() * 60)
            ).toISOString(),
            referenceId: `007000BEINDEL41457${String(50 + id).padStart(
              3,
              "0"
            )}`,
            description,
            typeOfTransaction,
            transactionAmount: amount,
            icegateAckNo: `IG1082920250645${String(509 + id).padStart(3, "0")}`,
            status,
            createdAt: new Date(
              2024,
              0,
              15 + Math.floor(Math.random() * 30),
              Math.floor(Math.random() * 24),
              Math.floor(Math.random() * 60)
            ).toISOString(),
          };
        });
      };

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Generate 50 total records for pagination demo
      const allData = generateDummyData(1, 50);
      const totalRecords = allData.length;
      setTotalCount(totalRecords);

      // Get paginated data
      const startIndex = page * rowsPerPage;
      const endIndex = startIndex + rowsPerPage;
      const paginatedData = allData.slice(startIndex, endIndex);

      setData(paginatedData);
    } catch (error) {
      console.error("Error fetching requests:", error);
      setData([]);
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
        return company ? company.name : "N/A"; // Assuming company is an object with a `name` field
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

  useEffect(() => {
    const fetchFormsData = async () => {
      try {
        const response = await userRequest.get("/custom/getForms?action=all");
        setFormsData(response.data.data); // Assuming the data is nested under data.data
      } catch (error) {
        console.error("Failed to fetch forms data:", error);
        showErrorMessage(error, "Failed to fetch forms data", swal);
      }
    };

    fetchFormsData();
  }, []);

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
              rows={formsData.forms || []} // Use the forms array from the API response
              columns={columns}
              getRowId={(row) => row._id}
              autoHeight
              disableSelectionOnClick
              pageSize={10}
              rowsPerPageOptions={[10]}
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
