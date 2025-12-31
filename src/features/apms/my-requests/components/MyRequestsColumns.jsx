import React from "react";
import { Box, Typography, Chip } from "@mui/material";
import { fDateTime } from "src/utils/format-time";

export const MyRequestsColumns = ({ onRequestClick, onStatusClick }) => [
  {
    field: "requestNo",
    headerName: "Request No",
    width: 160,
    align: "center",
    headerAlign: "center",
    renderCell: (params) => (
      <Typography
        sx={{
          color: "#1976d2",
          cursor: "pointer",
          fontWeight: 600,
          textDecoration: "underline",
        }}
        onClick={() => onRequestClick?.(params.row)}
      >
        {params.value || "-"}
      </Typography>
    ),
  },

  {
    field: "createdAt",
    headerName: "Raised On",
    width: 170,
    align: "center",
    headerAlign: "center",
    renderCell: (params) =>
      params.value ? fDateTime(params.value) : "-",
  },

  {
    field: "advanceType",
    headerName: "Advance Type",
    width: 200,
    align: "center",
    headerAlign: "center",
    renderCell: (params) => params.value || "-",
  },
  {
    field: "status",
    headerName: "Status",
    width: 150,
    align: "center",
    headerAlign: "center",
    renderCell: (params) => {
      const status = params.value || "Pending";

      const colorMap = {
        Pending: "warning",
        Approved: "success",
        Rejected: "error",
      };

      return (
        <Chip
          label={status}
          color={colorMap[status] || "default"}
          size="small"
          clickable
          sx={{ cursor: "pointer", fontWeight: 600 }}
          onClick={() => onStatusClick?.(params.row)}
        />
      );
    },
  },

  {
    field: "purpose",
    headerName: "Purpose",
    width: 220,
    align: "left",
    headerAlign: "center",
    renderCell: (params) => (
      <Box
        sx={{
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
        title={params.value}
      >
        {params.value || "-"}
      </Box>
    ),
  },

  {
    field: "requestedAmount",
    headerName: "Requested Amount",
    width: 180,
    align: "center",
    headerAlign: "center",
    renderCell: (params) =>
      params.value ? `₹${Number(params.value).toLocaleString()}` : "-",
  },

  {
    field: "approvedAmount",
    headerName: "Approved Amount",
    width: 180,
    align: "center",
    headerAlign: "center",
    renderCell: (params) =>
      params.value
        ? `₹${Number(params.value).toLocaleString()}`
        : "-",
  },

];
