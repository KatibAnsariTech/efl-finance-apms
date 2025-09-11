import React, { useEffect, useState } from "react";
import {
  DataGrid,
  GridToolbar,
} from "@mui/x-data-grid";
import { Box, Select, MenuItem, Button, Typography, CircularProgress } from "@mui/material";
import swal from 'sweetalert';
import { showErrorMessage } from 'src/utils/errorUtils';
import { userRequest } from "src/requestMethod";
import ExcelIcon from "../../../public/assets/excel.svg";

const ReportTableDataGrid = () => {
  const [region, setRegion] = useState("NORTH");
  const [reportData, setReportData] = useState({});
  const [totalPendingRequests, setTotalPendingRequests] = useState(0);
  const [regionCount, setRegionCount] = useState({});
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
    try {
      const response = await userRequest.get("/admin/getExcelExport", {
        responseType: "blob",
      });

      const blob = new Blob([response.data], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "report.xlsx";
      link.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Export failed:", error);
      showErrorMessage(error, "Export failed", swal);
    }
  };

  const getReportData = async () => {
    try {
      setLoading(true);
      const response = await userRequest.get("/admin/getReportData", {
        params: { region },
      });
      setReportData(response.data?.data || {});
      setTotalPendingRequests(response.data?.data?.totalPendingRequests || 0);
      setRegionCount(response.data?.data?.regionCount || {});
    } catch (error) {
      console.error("Error fetching report data:", error);
      showErrorMessage(error, "Failed to fetch report data", swal);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getReportData();
  }, [region]);

  // Transform data for DataGrid
  const rows = Object.entries(reportData).map(([category, data], index) => ({
    id: index,
    category,
    totalPending: data?.totalPending || 0,
    today: data?.today || 0,
    "1 day": data?.["1 day"] || 0,
    "2 days": data?.["2 days"] || 0,
    "3 days": data?.["3 days"] || 0,
    "4 days": data?.["4 days"] || 0,
    "5 days": data?.["5 days"] || 0,
    ">5 days": data?.[">5 days"] || 0,
  }));

  const columns = [
    {
      field: "category",
      headerName: "Category",
      width: 200,
      renderCell: (params) => (
        <Box
          sx={{
            backgroundColor: "#1777ED",
            color: "#FFF",
            padding: "8px 16px",
            borderRadius: "4px",
            fontWeight: "bold",
            textAlign: "center",
            width: "100%",
          }}
        >
          {params.value}
        </Box>
      ),
    },
    {
      field: "totalPending",
      headerName: "Total Pending",
      width: 150,
      renderCell: (params) => (
        <Box
          sx={{
            backgroundColor: "#1777ED",
            color: "#FFF",
            padding: "8px 16px",
            borderRadius: "4px",
            fontWeight: "bold",
            textAlign: "center",
            width: "100%",
          }}
        >
          {params.value}
        </Box>
      ),
    },
    {
      field: "today",
      headerName: "Today",
      width: 120,
      renderCell: (params) => (
        <Box
          sx={{
            backgroundColor: "#FFCC33",
            color: "#FFF",
            padding: "8px 16px",
            borderRadius: "4px",
            fontWeight: "bold",
            textAlign: "center",
            width: "100%",
          }}
        >
          {params.value}
        </Box>
      ),
    },
    {
      field: "1 day",
      headerName: "1 Day",
      width: 120,
      renderCell: (params) => (
        <Box
          sx={{
            backgroundColor: "#FFAB00",
            color: "#FFF",
            padding: "8px 16px",
            borderRadius: "4px",
            fontWeight: "bold",
            textAlign: "center",
            width: "100%",
          }}
        >
          {params.value}
        </Box>
      ),
    },
    {
      field: "2 days",
      headerName: "2 Days",
      width: 120,
      renderCell: (params) => (
        <Box
          sx={{
            backgroundColor: "#FF9933",
            color: "#FFF",
            padding: "8px 16px",
            borderRadius: "4px",
            fontWeight: "bold",
            textAlign: "center",
            width: "100%",
          }}
        >
          {params.value}
        </Box>
      ),
    },
    {
      field: "3 days",
      headerName: "3 Days",
      width: 120,
      renderCell: (params) => (
        <Box
          sx={{
            backgroundColor: "#FF6600",
            color: "#FFF",
            padding: "8px 16px",
            borderRadius: "4px",
            fontWeight: "bold",
            textAlign: "center",
            width: "100%",
          }}
        >
          {params.value}
        </Box>
      ),
    },
    {
      field: "4 days",
      headerName: "4 Days",
      width: 120,
      renderCell: (params) => (
        <Box
          sx={{
            backgroundColor: "#FF3300",
            color: "#FFF",
            padding: "8px 16px",
            borderRadius: "4px",
            fontWeight: "bold",
            textAlign: "center",
            width: "100%",
          }}
        >
          {params.value}
        </Box>
      ),
    },
    {
      field: "5 days",
      headerName: "5 Days",
      width: 120,
      renderCell: (params) => (
        <Box
          sx={{
            backgroundColor: "#CC0000",
            color: "#FFF",
            padding: "8px 16px",
            borderRadius: "4px",
            fontWeight: "bold",
            textAlign: "center",
            width: "100%",
          }}
        >
          {params.value}
        </Box>
      ),
    },
    {
      field: ">5 days",
      headerName: ">5 Days",
      width: 120,
      renderCell: (params) => (
        <Box
          sx={{
            backgroundColor: "#990000",
            color: "#FFF",
            padding: "8px 16px",
            borderRadius: "4px",
            fontWeight: "bold",
            textAlign: "center",
            width: "100%",
          }}
        >
          {params.value}
        </Box>
      ),
    },
  ];

  return (
    <Box sx={{ height: "100%", width: "100%" }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 2,
        }}
      >
        <Typography variant="h6">Report Data</Typography>
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <Select
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            size="small"
            sx={{ minWidth: 120 }}
          >
            <MenuItem value="NORTH">North</MenuItem>
            <MenuItem value="SOUTH">South</MenuItem>
            <MenuItem value="EAST">East</MenuItem>
            <MenuItem value="WEST">West</MenuItem>
          </Select>
          <Button
            variant="contained"
            startIcon={<img src={ExcelIcon} alt="Excel" width={20} height={20} />}
            onClick={handleExport}
            size="small"
          >
            Export
          </Button>
        </Box>
      </Box>

      <DataGrid
        rows={rows}
        columns={columns}
        loading={loading}
        disableRowSelectionOnClick
        hideFooter
        sx={{
          "& .MuiDataGrid-cell": {
            padding: 0,
            "&:focus": {
              outline: "none",
            },
            "&:focus-visible": {
              outline: "none",
            },
          },
          "& .MuiDataGrid-row": {
            "&:focus": {
              outline: "none",
            },
            "&:focus-visible": {
              outline: "none",
            },
          },
          "& .MuiDataGrid-columnHeader": {
            backgroundColor: "#f5f5f5",
            fontWeight: "bold",
          },
        }}
      />
    </Box>
  );
};

export default ReportTableDataGrid;

