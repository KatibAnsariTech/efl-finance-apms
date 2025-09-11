import React, { useState, useEffect } from "react";
import {
  Box,
  CircularProgress,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
import { userRequest } from "src/requestMethod";

export default function MonthDataTable({
  financialYear,
  month,
  channel,
  region,
  setType,
  setSubType,
  loading,
  error,
}) {
  const [tableData, setTableData] = useState([]);
  useEffect(() => {
    const fetchTableData = async () => {
      if (financialYear && month) {
        try {
          const res = await userRequest.get(`/admin/getForms`, {
            params: {
              action: "myRaised",
              month: month,
              channel,
              region,
              fYear: financialYear,
            },
          });
          setTableData(res?.data?.data?.forms || []);
          // Determine subType based on status logic
          const forms = res?.data?.data?.forms || [];
          if (forms.length > 0) {
            const isApproved = forms.some((f) => f.status === "Approved");
            setSubType(isApproved ? "Extension" : "Limit");
          } else {
            setSubType("Limit");
          }
        } catch (err) {
          setTableError("Failed to fetch data");
        } finally {
          // setTableLoading(false);
        }
      } else {
        setTableData([]);
      }
    };
    fetchTableData();
  }, [financialYear, month]);

  if (!financialYear || !month || tableData.length === 0) return null;

  return (
    <Box mt={4}>
      <Paper elevation={2} sx={{ p: 2 }}>
        <Typography variant="h6" mb={2}>
          Past Request Data for {month}, {financialYear}
        </Typography>
        {/* {loading ? (
          <CircularProgress />
        ) : error ? (
          <Typography color="error">{error}</Typography>
        ) : rows.length === 0 ? (
          <Typography>No data found.</Typography>
        ) : ( */}
        <Table>
          <TableHead>
            <TableRow>
              {/* Replace with your actual column headers */}
              <TableCell>Financial Year</TableCell>
              <TableCell>Month</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Status</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {tableData.map((row) => (
              <TableRow key={row._id}>
                <TableCell>{row.fYear}</TableCell>
                <TableCell>{row.month}</TableCell>
                <TableCell>{row.amount}</TableCell>
                <TableCell>{row.status}</TableCell>
              </TableRow>
            ))}

            {/* <TableRow> */}
            {/* Replace with your actual row data */}
            {/* <TableCell>{row.id}</TableCell>
                  <TableCell>{row.name}</TableCell>
                  <TableCell>{row.value}</TableCell> */}
            {/* <TableCell>2025-26</TableCell>
                <TableCell>June</TableCell>
                <TableCell>₹200000</TableCell>
              </TableRow> */}
          </TableBody>
        </Table>
        {/* )} */}
      </Paper>
    </Box>
  );
}
