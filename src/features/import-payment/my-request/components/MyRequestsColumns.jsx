import React from "react";
import { Box, Typography } from "@mui/material";
import { fDateTime } from "src/utils/format-time";

export const MyRequestsColumns = ({ onRequestClick }) => {
  const columns = [
    {
      field: "requestNo",
      headerName: "Request No.",
      width: 180,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            width: "100%",
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
            {params.value || params.row._id || "-"}
          </Typography>
        </Box>
      ),
    },
    {
      field: "poDate",
      headerName: "PO Date",
      width: 180,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        const dateValue = params.value || params.row.poDate;
        return (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              width: "100%",
            }}
          >
            {dateValue ? fDateTime(dateValue) : "-"}
          </Box>
        );
      },
    },
    {
      field: "grnDate",
      headerName: "GRN Date",
      width: 180,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        const dateValue = params.value || params.row.grnDate;
        return (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              width: "100%",
            }}
          >
            {dateValue ? fDateTime(dateValue) : "-"}
          </Box>
        );
      },
    },
    {
      field: "requesterName",
      headerName: "Requester Name",
      width: 150,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        const status = params.value || "";
        const displayStatus =
          status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
        return (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              width: "100%",
            }}
          >
            {displayStatus || "-"}
          </Box>
        );
      },
    },
    {
      field: "requesterEmail",
      headerName: "Requester Email",
      width: 180,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        const status = params.value || "";
        const displayStatus =
          status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
        return (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              width: "100%",
            }}
          >
            {displayStatus || "-"}
          </Box>
        );
      },
    },
    {
      field: "date",
      headerName: "Date",
      width: 180,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        const dateValue = params.value || params.row.createdAt;
        return (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              width: "100%",
            }}
          >
            {dateValue ? fDateTime(dateValue) : "-"}
          </Box>
        );
      },
    },
    {
      field: "status",
      headerName: "Status",
      width: 150,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        const status = params.value || "";
        const displayStatus =
          status.charAt(0).toUpperCase() + status.slice(1).toLowerCase();
        return (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              width: "100%",
            }}
          >
            {displayStatus || "-"}
          </Box>
        );
      },
    },
    {
      field: "poNumber",
      headerName: "PO Number",
      width: 150,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            width: "100%",
          }}
        >
          {params.value || "-"}
        </Box>
      ),
    },
    {
      field: "poAmount",
      headerName: "PO Amount",
      width: 180,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        const value = params.value;
        let displayValue = "-";
        if (typeof value === "object" && value?.name) {
          displayValue = value.name;
        } else if (value) {
          displayValue = value;
        }
        return (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              width: "100%",
            }}
          >
            {displayValue}
          </Box>
        );
      },
    },
    {
      field: "advAmount",
      headerName: "Advanced Amount",
      width: 180,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        const value = params.value;
        let displayValue = "-";
        if (typeof value === "object" && value?.name) {
          displayValue = value.name;
        } else if (value) {
          displayValue = value;
        }
        return (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              width: "100%",
            }}
          >
            {displayValue}
          </Box>
        );
      },
    },
    {
      field: "advPercentage",
      headerName: "Advanced Percentage",
      width: 180,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        const value = params.value;
        let displayValue = "-";
        if (typeof value === "object" && value?.name) {
          displayValue = value.name;
        } else if (value) {
          displayValue = value;
        }
        return (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              width: "100%",
            }}
          >
            {displayValue}
          </Box>
        );
      },
    },
      {
          field: "paymentTerms",
          headerName: "Payment Terms",
          width: 400,
          align: "center",
          headerAlign: "center",
          renderCell: (params) => {
            const value = params.value;
            let displayValue = "-";
    
            if (typeof value === "object" && value?.name) {
              displayValue = value.name;
            } else if (value) {
              displayValue = value;
            }
    
            return (
              <Box
                sx={{
                  whiteSpace: "normal !important",
                  wordBreak: "break-word",
                  lineHeight: "1.3rem",
                  p: 1, // padding for readability
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  textAlign: "center",
                  width: "100%",
                  height: "100%",
                }}
              >
                {displayValue}
              </Box>
            );
          },
        },
    {
      field: "vendorId",
      headerName: "vendor Name",
      width: 150,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        const value = params.value;
        let displayValue = "-";
        if (typeof value === "object" && value?.name) {
          displayValue = value.name;
        } else if (value) {
          displayValue = value;
        }
        return (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              width: "100%",
            }}
          >
            {displayValue}
          </Box>
        );
      },
    },
    {
      field: "department",
      headerName: "Department Name",
      width: 180,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        const value = params.value;
        let displayValue = "-";
        if (typeof value === "object" && value?.name) {
          displayValue = value.name;
        } else if (value) {
          displayValue = value;
        }
        return (
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              height: "100%",
              width: "100%",
            }}
          >
            {displayValue}
          </Box>
        );
      },
    },
    {
      field: "importType",
      headerName: "Import Type",
      width: 150,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            width: "100%",
          }}
        >
          {params.value || "-"}
        </Box>
      ),
    },
    {
      field: "type",
      headerName: "Purchase Type",
      width: 200,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            width: "100%",
          }}
        >
          {params.value || "-"}
        </Box>
      ),
    },
    {
      field: "scope",
      headerName: "Scope",
      width: 180,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            width: "100%",
          }}
        >
          {params.value || "-"}
        </Box>
      ),
    },
    {
      field: "currencyId",
      headerName: "Currency",
      width: 150,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            width: "100%",
          }}
        >
          {params.value || "-"}
        </Box>
      ),
    }
  ];

  return columns;
};
