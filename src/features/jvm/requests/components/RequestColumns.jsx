import React from "react";
import { Box, Typography } from "@mui/material";
import { useRouter } from "src/routes/hooks";
import { fDateTime } from "src/utils/format-time";

export const RequestColumns = ({ onRequestClick }) => {
  const router = useRouter();

  const handleStatusClick = (rowData) => {
    if (onRequestClick) {
      onRequestClick(rowData);
    }
  };

  const handleViewDocuments = (documents) => {
    if (documents && documents.length > 0) {
      // Open each document in a new tab
      documents.forEach((url) => {
        window.open(url, '_blank');
      });
    }
  };

  const columns = [
    {
      field: "parentId",
      headerName: "P.Id",
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
            router.push(`/jvm/requests/${params.value}`);
          }}
        >
          {params.value}
        </Box>
      ),
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
        const companyName = typeof company === "object" && company?.value 
          ? company.value 
          : typeof company === "string" 
          ? company 
          : "-";
        return (
          <Typography variant="body2">
            {companyName}
          </Typography>
        );
      },
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
      field: "autoReversal",
      headerName: "Auto Reversal",
      flex: 1,
      minWidth: 120,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => `${params.value === true ? "Yes" : "No"}`,
    },
    {
      field: "supportingDocuments",
      headerName: "Supporting Documents",
      flex: 1,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
      sortable: false,
      filterable: false,
      renderCell: (params) => {
        const documents = params.value;
        const hasDocuments = documents && documents.length > 0;
        
        return (
          <Typography
            variant="body2"
            onClick={(e) => {
              e.stopPropagation();
              if (hasDocuments) {
                handleViewDocuments(documents);
              }
            }}
            sx={{
              color: hasDocuments ? "#1976d2" : "#8c959f",
              fontSize: "0.875rem",
              fontWeight: hasDocuments ? 500 : 400,
              fontStyle: hasDocuments ? "normal" : "italic",
              cursor: hasDocuments ? "pointer" : "default",
              textDecoration: hasDocuments ? "underline" : "none",
              textDecorationThickness: hasDocuments ? "2px" : "none",
              textUnderlineOffset: hasDocuments ? "4px" : "none",
              "&:hover": hasDocuments ? {
                color: "#1565c0",
                textDecoration: "underline",
              } : {},
            }}
          >
            {hasDocuments ? "View" : "No documents"}
          </Typography>
        );
      },
    },
  ];

  return columns;
};
