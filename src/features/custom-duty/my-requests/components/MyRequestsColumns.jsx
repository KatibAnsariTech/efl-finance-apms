import React from "react";
import { Box, Typography } from "@mui/material";
import { fDateTime } from "src/utils/format-time";

export const MyRequestsColumns = ({ onRequestClick }) => {
  const columns = [
    {
      field: "requestNo",
      headerName: "Request No.",
      width: 200,
      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            height: "100%",
          }}
        >
          <Typography
            sx={{
              color: "#1976d2",
              textDecoration: "underline",
              cursor: "pointer",
              fontSize: "0.87rem",
              fontWeight: 600,
              "&:hover": { color: "#1565c0" },
            }}
            onClick={() => onRequestClick && onRequestClick(params.row)}
          >
            {params.value}
          </Typography>
        </Box>
      ),
    },
    {
      field: "createdAt",
      headerName: "Requested Date",
      flex: 1,
      minWidth: 180,
      renderCell: (params) => {
        const dateValue = params.value;
        return dateValue ? fDateTime(dateValue) : "-";
      },
    },
    {
      field: "docNumber",
      headerName: "Document No",
      flex: 1,
      minWidth: 120,
    },
    {
      field: "locationCode",
      headerName: "Location Code",
      flex: 1,
      minWidth: 140,
    },
    {
      field: "docType",
      headerName: "Document Type",
      width: 150,
    },
    {
      field: "docDate",
      headerName: "Document Date",
      width: 150,
      renderCell: (params) => {
        const date = new Date(params.value);
        return date.toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "2-digit",
        });
      },
    },
    {
      field: "dueAmount",
      headerName: "Amount",
      width: 120,
      renderCell: (params) => `₹${params.value.toLocaleString()}`,
    },
    {
      field: "status",
      headerName: "Status",
      width: 120,
    },
    {
      field: "companyId",
      headerName: "Company",
      width: 150,
      renderCell: (params) => params.value?.name || "-",
    },
  ];

  return columns;
};
