import React, { useState, useEffect, useCallback } from "react";
import Card from "@mui/material/Card";
import { DataGrid } from "@mui/x-data-grid";
import Container from "@mui/material/Container";
import { Box, Button, Typography } from "@mui/material";
import { userRequest } from "src/requestMethod";
import { showErrorMessage } from "src/utils/errorUtils";
import { Helmet } from "react-helmet-async";
import { JVMReportColumns } from "../components/JVMReportColumns";
import swal from "sweetalert";
import { FilterList } from "@mui/icons-material";
import FilterModal from "../../requested-jv/components/FilterModal";

export default function JVMReport() {
  const [allData, setAllData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openFilterModal, setOpenFilterModal] = useState(false);
  const [filterStartDate, setFilterStartDate] = useState("");
  const [filterEndDate, setFilterEndDate] = useState("");
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [rowCount, setRowCount] = useState(0);

  const getData = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: paginationModel.page + 1,
        limit: paginationModel.pageSize,
      };

      if (filterStartDate) params.startDate = filterStartDate;
      if (filterEndDate) params.endDate = filterEndDate;

      const response = await userRequest.get("jvm/getJVMReport", { params });

      if (response.data.statusCode === 200) {
        const reportItems = response.data.data.data || [];
        const pagination = response.data.data.pagination;

        const processedData = reportItems.map((item, index) => ({
          ...item,
          id: item._id || `${item.parentId}-${item.groupId}-${index}`,
          createdAt: item.createdAt ? new Date(item.createdAt) : null,
          documentDate: item.documentDate ? new Date(item.documentDate) : null,
          postingDate: item.postingDate ? new Date(item.postingDate) : null,
          sapStatus: item.sapStatus || "-",
          sapNumber: item.sapNumber || "-",
          sapMessage: item.sapMessage || "-",
        }));

        setAllData(processedData);
        setRowCount(pagination?.total || 0);
      } else {
        throw new Error(response.data.message || "Failed to fetch data");
      }
    } catch (error) {
      console.error("Error fetching report data:", error);
      showErrorMessage(error, "Failed to fetch JVM report data", swal);
      setAllData([]);
      setRowCount(0);
    } finally {
      setLoading(false);
    }
  }, [filterStartDate, filterEndDate, paginationModel.page, paginationModel.pageSize]);

  useEffect(() => {
    getData();
  }, [getData]);

  useEffect(() => {
    setPaginationModel((prev) => ({ ...prev, page: 0 }));
  }, [filterStartDate, filterEndDate]);

  const handlePaginationModelChange = (newModel) => {
    setPaginationModel(newModel);
  };

  const handleOpenFilterModal = () => {
    setOpenFilterModal(true);
  };

  const handleCloseFilterModal = () => {
    setOpenFilterModal(false);
  };

  const columns = JVMReportColumns();

  return (
    <>
      <Helmet>
        <title>JVM Report</title>
      </Helmet>

      <Container>
        <Card sx={{ mt: 2, p: 2 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              marginRight: "20px",
              mb: 1,
            }}
          >
            <Button
              variant="text"
              size="small"
              startIcon={<FilterList />}
              onClick={handleOpenFilterModal}
              sx={{
                ml: 2,
                backgroundColor: "transparent",
                minHeight: "auto",
                height: "32px",
                py: 0.5,
                px: 1,
                "&:hover": {
                  backgroundColor: "rgba(0, 0, 0, 0.04)",
                  height: "32px",
                  minHeight: "auto",
                },
                "&:focus": {
                  outline: "none",
                },
                "&:focus-visible": {
                  outline: "none",
                },
              }}
            >
              Filter
            </Button>
          </Box>

          <Box sx={{ width: "100%" }}>
            <DataGrid
              rows={allData || []}
              columns={columns}
              getRowId={(row) => row?.id}
              loading={loading}
              pagination
              paginationMode="server"
              paginationModel={paginationModel}
              onPaginationModelChange={handlePaginationModelChange}
              pageSizeOptions={[10]}
              rowCount={rowCount}
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
