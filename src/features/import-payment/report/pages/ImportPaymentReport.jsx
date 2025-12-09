import React, { useState, useEffect } from "react";
import {
  Container,
  Box,
  Card,
  Tabs,
  Tab,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { userRequest } from "src/requestMethod";
import { Helmet } from "react-helmet-async";
import { FormTableToolbar } from "src/components/table";
import { MyRequestsColumns } from "../components/MyRequestsColumns";
import ColorIndicators from "../components/ColorIndicators";

export default function ImportPaymentReport() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedTab, setSelectedTab] = useState("submitted");

  const menuItems = [
    // { label: "Pending with Me", value: "pendingWithMe" },
    { label: "Submitted", value: "submitted" },
  ];

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 600);

    return () => clearTimeout(handler);
  }, [search]);

  const getData = async () => {
    try {
      setLoading(true);

      const queryParams = new URLSearchParams({
        page: (page + 1).toString(),
        limit: rowsPerPage.toString(),
      });

      if (debouncedSearch) {
        queryParams.append("search", debouncedSearch);
      }

      // Choose API endpoint based on selected tab
      const apiEndpoint =
        selectedTab === "pendingWithMe"
          ? "/cpx/getPendingRequestForms"
          : "/cpx/getRequestsForApprover";

      const response = await userRequest.get('/imt/getForms?action=all', {
        params: {
          page: page + 1,
          limit: rowsPerPage,
          search: debouncedSearch || undefined,
        },
      });

      if (response.data && response.data.data) {
        const {
          forms,
          items,
          totalForms,
          total,
          totalRequests,
          pagination,
        } = response.data.data;

        const formsData = forms || items || [];
        const totalCountValue =
          totalForms || total || totalRequests || pagination?.total || 0;

        setData(formsData);
        setTotalCount(totalCountValue);
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
  }, [page, rowsPerPage, selectedTab, debouncedSearch]);

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
    setPage(0);
    setData([]);
    setTotalCount(0);
    setLoading(true);
  };

  const handleFilterChange = (field, value) => {
    setPage(0);
    setSearch(value);
  };

  const handleRequestClick = (rowData) => {
    // TODO: Implement view/edit modal or navigation
    console.log("Request clicked:", rowData);
  };

  const columns = MyRequestsColumns({ onRequestClick: handleRequestClick });

  return (
    <>
      <Helmet>
        <title>Import Payment Reports</title>
      </Helmet>

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
              display: "flex",
              justifyContent: "space-between",
              marginBottom: 2,
            }}
          >
            <FormTableToolbar
              search={search}
              onFilterChange={handleFilterChange}
              placeholder="Search requests..."
            />
          </Box>
          <Box sx={{ width: "100%" }}>
            <DataGrid
              rows={data || []}
              columns={columns}
              getRowId={(row) => row._id || row.id}
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
                console.log("status",status)
                if (status === "inprocess") return "row-inprocess";
                if (status === "submitted") return "row-submitted";
                if (status === "clarification need" || status === "clarificationneed")
                  return "row-clarification";
                if (status === "approved") return "row-approved";
                if (status === "rejected" || status === "declined")
                  return "row-rejected";
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
                "& .row-inprocess": {
                  backgroundColor: "#f4f5ba !important",
                },
                "& .row-submitted": {
                  backgroundColor: "#e3f2fd !important",
                },
                "& .row-clarification": {
                  backgroundColor: "#9be7fa !important",
                },
                "& .row-approved": {
                  backgroundColor: "#baf5c2 !important",
                },
                "& .row-rejected": {
                  backgroundColor: "#e6b2aa !important",
                },
              }}
            />
          </Box>
          <Box
            sx={{
              position: "relative",
              height: "52px",
              marginTop: "-52px",
              display: "flex",
              alignItems: "center",
              paddingLeft: "16px",
              zIndex: 0,
              pointerEvents: "none",
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


