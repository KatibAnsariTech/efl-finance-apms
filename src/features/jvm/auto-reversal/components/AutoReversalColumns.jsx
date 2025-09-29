import React from "react";
import { Box } from "@mui/material";
import { fDateTime } from "src/utils/format-time";

export const AutoReversalColumns = ({ navigate }) => {
  const columns = [
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
            // Pass the complete data to the detail page
            
            // Store data in localStorage as backup
            localStorage.setItem('arDetailData', JSON.stringify(params.row));
            
            // Use navigate with state to pass data
            navigate(`/jvm/auto-reversal/ar-detail/${params.row.requestNo}`, { 
              state: params.row 
            });
          }}
        >
          {params.value || "-"}
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
      renderCell: (params) => params.value || "-",
    },
    {
      field: "documentDate",
      headerName: "Document Date",
      flex: 1,
      minWidth: 180,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => params.value ? fDateTime(params.value) : "-",
    },
    {
      field: "postingDate",
      headerName: "Posting Date",
      flex: 1,
      minWidth: 180,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => params.value ? fDateTime(params.value) : "-",
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      minWidth: 120,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => params.value || "-",
    },
    {
      field: "totalDebit",
      headerName: "Total Debit",
      flex: 1,
      minWidth: 120,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => params.value ? `₹${params.value?.toLocaleString()}` : "-",
    },
    {
      field: "totalCredit",
      headerName: "Total Credit",
      flex: 1,
      minWidth: 120,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => params.value ? `₹${params.value?.toLocaleString()}` : "-",
    }
  ];

  return columns;
};
