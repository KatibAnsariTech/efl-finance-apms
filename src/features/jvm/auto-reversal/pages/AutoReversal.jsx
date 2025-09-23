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
import { Box, Tooltip } from "@mui/material";
import RequestModal from "src/features/credit-deviation/approvals/components/RequestModal";
import { fDateTime } from "src/utils/format-time";
import swal from "sweetalert";
import { showErrorMessage } from "src/utils/errorUtils";
import { Helmet } from "react-helmet-async";

export default function AutoReversal() {
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
    active: 0,
    delayed: 0,
    accepted: 0,
  });

  const menuItems = [
    { label: "All", value: "all", count: statusCounts.all },
    { label: "Active", value: "active", count: statusCounts.active },
    { label: "Delayed", value: "delayed", count: statusCounts.delayed },
    { label: "Accepted", value: "accepted", count: statusCounts.accepted },
  ];


  const getData = async () => {
    setLoading(true);
    try {
      const response = await userRequest.get(
        `https://crd-test-2ib6.onrender.com/api/v1/journal-vouchers/getAllJV`,
        {
          params: {
            page: page + 1, // API uses 1-based pagination
            limit: rowsPerPage,
            status: selectedTab !== "all" ? selectedTab : undefined,
          },
        }
      );

      if (response.data.statusCode === 200) {
        const apiData = response.data.data.data;
        const { total, totalGroups } = response.data.data;
        const processedData = apiData.map((item) => ({
          ...item,
          createdAt: new Date(item.createdAt),
          updatedAt: new Date(item.updatedAt),
        }));

        setData(processedData);
        setTotalCount(total);

        // Calculate status counts (you might need a separate API call for this)
        const counts = {
          all: total,
          active: Math.floor(total / 3), // This should come from API
          delayed: Math.floor(total / 3),
          accepted: Math.floor(total / 3),
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

  // Custom ColorIndicators component for Auto Reversal Status
  const AutoReversalColorIndicators = () => {
    // Custom circle component for displaying each color with label on hover
    const ColorCircle = ({ color, label }) => (
      <Tooltip title={label} arrow>
        <Box
          sx={{
            width: "18px",
            height: "18px",
            backgroundColor: color,
            borderRadius: "50%",
            cursor: "pointer",
            border: "1px solid rgba(0, 0, 0, 0.2)", // Light black border
          }}
        />
      </Tooltip>
    );

    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: 1,
          marginLeft: 2,
        }}
      >
        {/* Status color legend for Auto Reversal Status */}
        <ColorCircle color="#e8f5e8" label="Delayed" />
        <ColorCircle color="#f4f5ba" label="Active" />
        <ColorCircle color="#ffcdd2" label="Accepted" />
      </Box>
    );
  };

  const getStatusColor = (status) => {
    const statusColors = {
      Delayed: "#e8f5e8",
      Accepted: "#ffcdd2",
      Active: "#f4f5ba",
    };
    return statusColors[status] || "#f5f5f5";
  };

  const getStatusChip = (status) => {
    return (
      <Box
        sx={{
          display: "inline-block",
          px: 1.5,
          py: 0.5,
          borderRadius: 1,
          backgroundColor: getStatusColor(status),
          color: "#333",
          fontSize: "0.75rem",
          fontWeight: 600,
          textTransform: "uppercase",
        }}
      >
        {status}
      </Box>
    );
  };

  const columns = [
    {
      field: "requestNo",
      headerName: "Request No.",
      flex: 1,
      minWidth: 160,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Box
          sx={{
            cursor: "pointer",
            color: "#1976d2",
            textDecoration: "underline",
            textDecorationThickness: "2px",
            textUnderlineOffset: "4px",
            fontWeight: 600,
            "&:hover": { color: "#1565c0" },
          }}
          onClick={() => {
            // Pass the complete data to the detail page
            console.log("Passing data to detail page:", params.row);
            console.log("Rows in the data:", params.row.rows);
            
            // Store data in localStorage as backup
            localStorage.setItem('arDetailData', JSON.stringify(params.row));
            
            router.push(`/jvm/auto-reversal/ar-detail/${params.row.requestNo}`, { 
              state: params.row 
            });
          }}
        >
          {params.value}
        </Box>
      ),
    },
    {
      field: "pId",
      headerName: "P.Id",
      flex: 1,
      minWidth: 120,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "createdAt",
      headerName: "Created Date",
      flex: 1,
      minWidth: 200,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => fDateTime(params.value),
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      minWidth: 120,
      align: "center",
      headerAlign: "center",
      // renderCell: (params) => getStatusChip(params.value),
    },
    {
      field: "totalDebit",
      headerName: "Total Debit",
      flex: 1,
      minWidth: 120,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => `₹${params.value?.toLocaleString() || '0'}`,
    },
    {
      field: "totalCredit",
      headerName: "Total Credit",
      flex: 1,
      minWidth: 120,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => `₹${params.value?.toLocaleString() || '0'}`,
    }
  ];

  // Apply filtering and sorting to the data
  const dataFiltered = (() => {
    let filteredData = [...data];

    // Apply status tab filter
    if (selectedTab !== "all") {
      filteredData = filteredData.filter(
        (item) => item.status?.toLowerCase() === selectedTab.toLowerCase()
      );
    }

    // Apply search filter if search term exists
    if (search) {
      filteredData = filteredData.filter((item) =>
        [
          "requestNo",
          "pId",
          "status",
        ].some((field) =>
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
        <title>Auto Reversal Status</title>
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
              placeholder="Search Auto Reversals..."
            />
          </div>

          <Box sx={{ width: "100%" }}>
            <DataGrid
              rows={dataFiltered || []}
              columns={columns}
              getRowId={(row) => row?.requestNo}
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
              autoHeight
              // getRowClassName={(params) => {
              //   const status = params.row.status?.toLowerCase();
              //   if (status === "active") return "row-active";
              //   if (status === "accepted") return "row-accepted";
              //   if (status === "delayed") return "row-delayed";
              //   return "";
              // }}
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
                "& .MuiDataGrid-row.row-active": {
                  backgroundColor: "#f4f5ba !important",
                },
                "& .MuiDataGrid-row.row-accepted": {
                  backgroundColor: "#ffcdd2 !important",
                },
                "& .MuiDataGrid-row.row-delayed": {
                  backgroundColor: "#e8f5e8 !important",
                },
                "& .MuiDataGrid-row": {
                  borderBottom: "1px solid #e0e0e0",
                },
                "& .MuiDataGrid-row:hover": {
                  backgroundColor: (theme) => theme.palette.action.hover,
                  opacity: 0.8,
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
            {/* <Box sx={{ pointerEvents: "auto" }}>
              <AutoReversalColorIndicators />
            </Box> */}
          </Box>
        </Card>
      </Container>
    </>
  );
}