import React from "react";
import { Box } from "@mui/material";
import { fDateTime } from "src/utils/format-time";

export const JVByRequestNoColumns = ({
  router,
  parentId,
  onStatusClick,
  basePath = "requested-jvs",
}) => {
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
            localStorage.setItem("jvDetailData", JSON.stringify(params.row));
            router.push(`/jvm/${basePath}/${parentId}/${params.row.groupId}`);
          }}
        >
          {params.value}
        </Box>
      ),
    },
    {
      field: "createdAt",
      headerName: "Created Date",
      flex: 1,
      minWidth: 200,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => fDateTime(params.value),
    },
    {
      field: "totalDebit",
      headerName: "Total Debit",
      flex: 1,
      minWidth: 120,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => `₹${params.value?.toLocaleString() || "0"}`,
    },
    {
      field: "totalCredit",
      headerName: "Total Credit",
      flex: 1,
      minWidth: 120,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => `₹${params.value?.toLocaleString() || "0"}`,
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      minWidth: 120,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        const statusValue = params.value?.toString().trim();
        const hasStatus = statusValue && statusValue !== "" && statusValue !== "-";
        
        if (!hasStatus) {
          return "-";
        }
        
        return (
          <Box
            sx={{
              cursor: "pointer",
              color: "#1976d2",
              textDecoration: "underline",
              textDecorationThickness: "1px",
              textUnderlineOffset: "2px",
              "&:hover": { color: "#1565c0" },
            }}
            onClick={(e) => {
              e.stopPropagation();
              if (onStatusClick) {
                onStatusClick(params.row);
              }
            }}
          >
            {params.value}
          </Box>
        );
      },
    },
  ];

  return columns;
};

