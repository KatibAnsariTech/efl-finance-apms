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

export default function JVStatus() {
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
          id: item.groupId || `group-${index}`,
          requestNo: item.groupId || `G-${item.slNo}`,
          pId: item.parentId,
          slNo: item.slNo,
          groupId: item.groupId,
          totalAmount: item.totalAmount,
          count: item.count,
          createdAt: new Date(item.createdAt),
          status: item.status || "Pending",
          totalDebit: item.totalAmount / 2,
          totalCredit: item.totalAmount / 2,
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

  const columns = [
    // {
    //   field: "slNo",
    //   headerName: "S No",
    //   flex: 0.8,
    //   minWidth: 80,
    //   align: "center",
    //   headerAlign: "center",
    // },
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
            localStorage.setItem("jvDetailData", JSON.stringify(params.row));
            router.push(
              `/jvm/requested-jvs/jv-detail?id=${params.row.requestNo}`
            );
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
    },
    {
      field: "totalDebit",
      headerName: "Total Debit",
      flex: 1,
      minWidth: 120,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => `₹${params.value?.toLocaleString() || "0"}`,
    },
    {
      field: "totalCredit",
      headerName: "Total Credit",
      flex: 1,
      minWidth: 120,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => `₹${params.value?.toLocaleString() || "0"}`,
    },
  ];

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
        ["requestNo", "pId", "status"].some((field) =>
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
        <title>JV's Status</title>
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
              }}
            />
          </Box>
        </Card>
      </Container>
    </>
  );
}
