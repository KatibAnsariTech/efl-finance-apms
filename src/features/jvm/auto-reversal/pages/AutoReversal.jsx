import React from "react";
import { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import { DataGrid } from "@mui/x-data-grid";
import Container from "@mui/material/Container";
import CircularIndeterminate from "src/utils/loader";
import { FormTableToolbar } from "src/components/table";
import { getComparator } from "src/utils/utils";
import { userRequest } from "src/requestMethod";
import { useRouter } from "src/routes/hooks";
import { useNavigate } from "react-router-dom";
import { Box } from "@mui/material";
import { fDateTime } from "src/utils/format-time";
import swal from "sweetalert";
import { showErrorMessage } from "src/utils/errorUtils";
import { Helmet } from "react-helmet-async";
import { AutoReversalColumns } from "../components/AutoReversalColumns";
import AutoReversalTabs from "../components/AutoReversalTabs";
import ColorIndicators from "../components/ColorIndicators";
import { useJVM } from "src/contexts/JVMContext";

export default function AutoReversal() {
  const router = useRouter();
  const navigate = useNavigate();
  const { jvmRequestCounts, fetchJVMRequestCounts } = useJVM();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [limit, setLimit] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState("");
  const [selectedTab, setSelectedTab] = useState("all");
  const [statusCounts, setStatusCounts] = useState({
    all: 0,
    active: 0,
    completed: 0,
  });

  const menuItems = [
    { label: "All", value: "all", count: statusCounts.all },
    { label: "Active", value: "active", count: statusCounts.active },
    { label: "Completed", value: "completed", count: statusCounts.completed },
  ];


  const getData = async () => {
    setLoading(true);
    try {
      const params = {
        page: page + 1, // API uses 1-based pagination
        limit: rowsPerPage,
      };
      
      // Only add filter parameter if selectedTab is not 'all'
      if (selectedTab !== 'all') {
        params.filter = selectedTab;
      }

      const response = await userRequest.get(
        `jvm/getReversals`,
        { params }
      );

      if (response.data.statusCode === 200) {
        const apiData = response.data.data; // Data is directly in response.data.data array
        const processedData = apiData.map((item) => ({
          ...item,
          requestNo: item.groupId, // Map groupId to requestNo for display
          pId: item.parentId, // Map parentId to pId for display
          createdAt: new Date(item.createdAt),
          updatedAt: new Date(item.updatedAt),
          documentDate: new Date(item.documentDate),
          postingDate: new Date(item.postingDate),
          startDate: new Date(item.startDate),
          endDate: new Date(item.endDate),
          totalDebit: item.totalDebit || 0, // Add totalDebit field
          totalCredit: item.totalCredit || 0, // Add totalCredit field
          // Preserve original fields for detail page
          groupId: item.groupId, // Keep original groupId
          parentId: item.parentId, // Keep original parentId
          requesterId: item.requesterId, // Keep original requesterId
          status: item.status, // Keep original status
        }));

        setData(processedData);
        setTotalCount(apiData.length); // Use array length since no pagination info provided

        // Update status counts based on current filter
        if (selectedTab === 'all') {
          // For 'all' tab, update the all count
          setStatusCounts(prevCounts => ({
            ...prevCounts,
            all: apiData.length
          }));
        } else {
          // For specific status tabs, update that specific count
          setStatusCounts(prevCounts => ({
            ...prevCounts,
            [selectedTab]: apiData.length
          }));
        }
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

  const handleDelete = async (row) => {
    const result = await swal({
      title: "Are you sure?",
      text: "Once deleted, you will not be able to recover this auto reversal request!",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    });

    if (result) {
      try {
        await userRequest.delete(`jvm/deleteReversal/${row._id}`);
        swal("Deleted!", "Auto reversal request has been deleted successfully.", "success");
        getData();
        await fetchJVMRequestCounts();
      } catch (error) {
        console.error("Delete error:", error);
        showErrorMessage(error, "Failed to delete auto reversal request. Please try again.", swal);
      }
    }
  };

  // Get columns from separate file
  const columns = AutoReversalColumns({ navigate, handleDelete });

  // Apply filtering and sorting to the data
  const dataFiltered = (() => {
    let filteredData = [...data];

    // Apply search filter if search term exists
    if (search) {
      filteredData = filteredData.filter((item) =>
        [
          "requestNo",
          "pId",
          "status",
          "totalDebit",
          "totalCredit",
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
        <AutoReversalTabs
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
          menuItems={menuItems}
          autoReversalCounts={jvmRequestCounts}
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
              getRowId={(row) => {
                try {
                  return row?.requestNo || row?.id || Math.random();
                } catch (error) {
                  console.error('Error getting row ID:', error, row);
                  return Math.random();
                }
              }}
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
                if (status === "active") return "row-active";
                if (status === "completed") return "row-completed";
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
                "& .row-active": {
                  backgroundColor: "#bbdefb !important",
                },
                "& .row-completed": {
                  backgroundColor: "#baf5c2 !important",
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
    </>
  );
}