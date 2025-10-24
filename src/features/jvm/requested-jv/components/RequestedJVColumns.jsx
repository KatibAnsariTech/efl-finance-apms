import React from "react";
import { Box, IconButton, Tooltip, Typography } from "@mui/material";
import { fDateTime } from "src/utils/format-time";
import Iconify from "src/components/iconify/iconify";

export const RequestedJVColumns = ({
  handleStatusClick,
  router,
  handleDelete,
}) => {
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
            router.push(`/jvm/requested-jvs/${params.value}`);
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
        const canDelete = params.row.canDelete;
        return (
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Tooltip
              title={canDelete ? "Delete" : "This request cannot be deleted"}
            >
              <span>
                <IconButton
                  size="small"
                  color="error"
                  disabled={!canDelete}
                  onClick={(e) => {
                    e.stopPropagation();
                    if (canDelete) {
                      handleDelete(params.row);
                    }
                  }}
                  sx={{
                    "&:hover": {
                      backgroundColor: canDelete
                        ? "rgba(244, 67, 54, 0.08)"
                        : "transparent",
                    },
                    "&.Mui-disabled": {
                      color: "rgba(0, 0, 0, 0.26)",
                    },
                  }}
                >
                  <Iconify icon="solar:trash-bin-trash-bold" />
                </IconButton>
              </span>
            </Tooltip>
          </Box>
        );
      },
    },
  ];

  return columns;
};
