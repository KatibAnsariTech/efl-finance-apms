import React from "react";
import { Box } from "@mui/material";
import { useRouter } from "src/routes/hooks";
import { fDateTime } from "src/utils/format-time";

// Component for other tabs columns
export const RequestColumns = ({ onRequestClick }) => {
  const router = useRouter();

  const handleStatusClick = (rowData) => {
    if (onRequestClick) {
      onRequestClick(rowData);
    }
  };

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
            router.push(`/jvm/requests/jv-detail?id=${params.row.groupId}`);
          }}
        >
          {params.value}
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
      field: "status",
      headerName: "Status",
      flex: 1,
      minWidth: 120,
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
          onClick={() => handleStatusClick(params.row)}
        >
          {params.value}
        </Box>
      ),
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
      field: "count",
      headerName: "Count",
      flex: 1,
      minWidth: 80,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "currentStep",
      headerName: "Step",
      flex: 1,
      minWidth: 80,
      align: "center",
      headerAlign: "center",
    },
  ];

  return columns;
};
