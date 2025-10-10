import React from "react";
import { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import { DataGrid } from "@mui/x-data-grid";
import Container from "@mui/material/Container";
import { userRequest } from "src/requestMethod";
import { useRouter } from "src/routes/hooks";
import { useNavigate } from "react-router-dom";
import { Box, Button } from "@mui/material";
import { FilterList } from "@mui/icons-material";
import swal from "sweetalert";
import { showErrorMessage } from "src/utils/errorUtils";
import { Helmet } from "react-helmet-async";
import { AutoReversalColumns } from "../components/AutoReversalColumns";
import AutoReversalTabs from "../components/AutoReversalTabs";
import ColorIndicators from "../components/ColorIndicators";
import FilterModal from "../../requested-jv/components/FilterModal";
import { useJVM } from "src/contexts/JVMContext";

export default function AutoReversal() {
  const navigate = useNavigate();
  const { jvmRequestCounts, fetchJVMRequestCounts } = useJVM();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [selectedTab, setSelectedTab] = useState("all");
  const [openFilterModal, setOpenFilterModal] = useState(false);
  const [filterStartDate, setFilterStartDate] = useState("");
  const [filterEndDate, setFilterEndDate] = useState("");

  const menuItems = [
    { label: "All", value: "all" },
    { label: "Active", value: "active" },
    { label: "Completed", value: "completed" },
  ];

  const getData = async () => {
    setLoading(true);
    try {
      const params = {
        page: page + 1,
        limit: rowsPerPage,
      };
      if (selectedTab !== "all") {
        params.filter = selectedTab;
      }

      if (filterStartDate) params.startDate = filterStartDate;
      if (filterEndDate) params.endDate = filterEndDate;

      const response = await userRequest.get(`jvm/getReversals`, { params });

      if (response.data.statusCode === 200) {
        const apiData = response.data.data;
        const processedData = apiData.map((item, index) => ({
          ...item,
          id: item.groupId || item.id || index,
        }));

        setData(processedData);
        setTotalCount(apiData.length);
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
  }, [page, rowsPerPage, selectedTab, filterStartDate, filterEndDate]);

  const handleOpenFilterModal = () => {
    setOpenFilterModal(true);
  };

  const handleCloseFilterModal = () => {
    setOpenFilterModal(false);
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
        swal(
          "Deleted!",
          "Auto reversal request has been deleted successfully.",
          "success"
        );
        getData();
        await fetchJVMRequestCounts();
      } catch (error) {
        console.error("Delete error:", error);
        showErrorMessage(
          error,
          "Failed to delete auto reversal request. Please try again.",
          swal
        );
      }
    }
  };

  const columns = AutoReversalColumns({ navigate, handleDelete });

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
              justifyContent: "flex-end",
              marginRight: "20px",
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
          </div>

          <Box sx={{ width: "100%" }}>
            <DataGrid
              rows={data || []}
              columns={columns}
              getRowId={(row) => {
                try {
                  return row?.requestNo || row?.id || Math.random();
                } catch (error) {
                  console.error("Error getting row ID:", error, row);
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

        <FilterModal
          open={openFilterModal}
          handleClose={handleCloseFilterModal}
          setStartDate={setFilterStartDate}
          setEndDate={setFilterEndDate}
        />
      </Container>
    </>
  );
}
