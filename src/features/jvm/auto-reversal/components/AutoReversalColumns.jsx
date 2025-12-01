import React from "react";
import { Box, IconButton, Tooltip } from "@mui/material";
import { fDate, fDateTime } from "src/utils/format-time";
import Iconify from "src/components/iconify/iconify";

export const AutoReversalColumns = ({ navigate, handleDelete }) => {
  const columns = [
    {
      field: "groupId",
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
            navigate(`/jvm/auto-reversal/ar-detail/${params.row._id}`, { 
              state: params.row 
            });
          }}
        >
          {params.value || "-"}
        </Box>
      ),
    },
    {
      field: "parentId",
      headerName: "P.Id",
      flex: 1,
      minWidth: 120,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => params.value || "-",
    },
    {
      field: "companyId",
      headerName: "Company",
      flex: 1,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        const company = params.value;
        if (typeof company === "object" && company?.value) {
          return company.value;
        }
        return typeof company === "string" ? company : "-";
      },
    },
    {
      field: "documentDate",
      headerName: "Document Date",
      flex: 1,
      minWidth: 180,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => params.value ? fDate(params.value) : "-",
    },
    {
      field: "postingDate",
      headerName: "Posting Date",
      flex: 1,
      minWidth: 180,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => params.value ? fDate(params.value) : "-",
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
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 0.5,
      minWidth: 100,
      align: "center",
      headerAlign: "center",
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        const isCompleted = (params.row?.status || "").toLowerCase() === "completed";
        if (isCompleted) {
          return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
              <Tooltip title="Completed items cannot be deleted">
                <span>
                  <IconButton size="small" color="error" disabled>
                    <Iconify icon="solar:trash-bin-trash-bold" />
                  </IconButton>
                </span>
              </Tooltip>
            </Box>
          );
        }
        return (
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <Tooltip title="Delete">
              <IconButton
                size="small"
                color="error"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDelete(params.row);
                }}
                sx={{
                  "&:hover": {
                    backgroundColor: "rgba(244, 67, 54, 0.08)",
                  },
                }}
              >
                <Iconify icon="solar:trash-bin-trash-bold" />
              </IconButton>
            </Tooltip>
          </Box>
        );
      },
    }
  ];

  return columns;
};
