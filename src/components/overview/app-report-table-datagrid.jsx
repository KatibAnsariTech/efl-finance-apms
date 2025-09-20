import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Select,
  MenuItem,
  Button,
  Typography,
  CircularProgress,
} from "@mui/material";
import { toast } from "react-toastify";
import { userRequest } from "src/requestMethod";
import ExcelIcon from "../../../public/assets/excel.svg";

const columns = [
  { id: "category", label: "Category", color: "#1777ED", textColor: "#FFF" },
  {
    id: "totalPending",
    label: "Total Pending",
    color: "#1777ED",
    textColor: "#FFF",
  },
  { id: "today", label: "Today", color: "#FFCC33", textColor: "#FFF" },
  { id: "1 day", label: "1 Day", color: "#FFAB00", textColor: "#FFF" },
  { id: "2 days", label: "2 Day", color: "#FF9933", textColor: "#FFF" },
  { id: "3 days", label: "3 Day", color: "#FF6600", textColor: "#FFF" },
  { id: "4 days", label: "4 Day", color: "#FF3300", textColor: "#FFF" },
  { id: "5 days", label: "5 Day", color: "#CC0000", textColor: "#FFF" },
  { id: ">5 days", label: ">5 Day", color: "#990000", textColor: "#FFF" },
];

const ReportTable = () => {
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
        type: "application/octet-stream",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "Region-Report.xlsx";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      toast.error("Error exporting data. Please try again.");
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await userRequest.get(
        `/admin/getCharts?region=${region}`
      );
      if (response.data.success) {
        setReportData(response.data.data.formattedData);
        setTotalPendingRequests(response.data.data.totalPendingRequests);
        setRegionCount(response.data.data.regionCount);
      }
    } catch (error) {
      console.log("error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  useEffect(() => {
    fetchData();
  }, [region]);

  return (
    <Paper sx={{ p: 2, mt: 4, borderRadius: 2, width: "100%" }}>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
        }}
      >
        <div>
          <Typography variant="body2">TAT: Pending Requests</Typography>
          <Typography variant="body2" sx={{ color: "red" }}>
            Total: {totalPendingRequests}
          </Typography>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ display: "flex", alignItems: "center" }}>
            {/* <Typography variant="body2" color="#000">
              Region:
            </Typography> */}
            <Select
              value={region}
              onChange={(e) => setRegion(e.target.value)}
              size="small"
              sx={{
                // borderBottom: "1px solid #000",
                borderRadius: "0px",
                "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                "&:hover .MuiOutlinedInput-notchedOutline": { border: "none" },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  border: "none",
                },
              }}
            >
              {Object.keys(regionCount).map((region) => (
                <MenuItem key={region} value={region}>
                  {region}
                </MenuItem>
              ))}
            </Select>
          </div>

          <Typography variant="caption" color="#000">
            Pending Requests: <strong>{regionCount[region] || 0}</strong>
          </Typography>
        </div>

        <Button
          onClick={handleExport}
          variant="text"
          sx={{ textTransform: "none", color: "#167beb", border: "none" }}
        >
          Export{" "}
          <img
            src={ExcelIcon}
            alt="Excel"
            style={{ width: "1.2rem", marginLeft: "5px" }}
          />
        </Button>
      </div>
      {loading ? (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            padding: "16px",
            height:"60dvh"
          }}
        >
          <CircularProgress />
        </div>
      ) : (
        <>
          <TableContainer
            component={Paper}
            sx={{ boxShadow: 3, borderRadius: 2 }}
          >
            <Table>
              <TableHead>
                <TableRow>
                  {columns.map(({ id, label, color, textColor }) => (
                    <TableCell
                      key={id}
                      align="center"
                      sx={{
                        backgroundColor: color || "#F0F0F0",
                        color: textColor || "#000",
                        fontWeight: "bold",
                      }}
                    >
                      {label}
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {reportData.length > 0 ? (
                  reportData.map((item, index) => {

                    const category = Object.keys(item)[0];
                    const values = item[category];

                    return (
                      <TableRow key={index} hover>
                        <TableCell align="center">{category}</TableCell>
                        {columns.slice(1).map(({ id }) => (
                          <TableCell key={id} align="center">
                            {values[id] !== undefined ? values[id] : "-"}
                          </TableCell>
                        ))}
                      </TableRow>
                    );
                  })
                ) : (
                  <TableRow sx={{height:"60dvh"}}>
                    <TableCell colSpan={columns.length} align="center">
                      No data available for the selected region.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <div
            style={{
              display: "flex",
              justifyContent: "flex-end",
              marginTop: "8px",
              fontSize: "0.875rem",
              color: "#666",
              gap: "8px",
            }}
          >
            <span style={{ color: "#1777ED" }}>
              North:{" "}
              <strong style={{ color: "#000" }}>
                {regionCount.NORTH || 0}
              </strong>
            </span>{" "}
            |
            <span style={{ color: "#28A745" }}>
              {" "}
              South:{" "}
              <strong style={{ color: "#000" }}>
                {regionCount.SOUTH || 0}
              </strong>
            </span>{" "}
            |
            <span style={{ color: "#FFC107" }}>
              {" "}
              East:{" "}
              <strong style={{ color: "#000" }}>{regionCount.EAST || 0}</strong>
            </span>{" "}
            |
            <span style={{ color: "#DC3545" }}>
              {" "}
              West:{" "}
              <strong style={{ color: "#000" }}>{regionCount.WEST || 0}</strong>
            </span>
          </div>
        </>
      )}
    </Paper>
  );
};

export default ReportTable;