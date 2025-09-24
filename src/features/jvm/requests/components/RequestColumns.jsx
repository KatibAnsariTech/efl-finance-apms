import React from "react";
import { Box, Typography, Checkbox, CircularProgress } from "@mui/material";
import { useRouter } from "src/routes/hooks";
import { fDateTime } from "src/utils/format-time";

// Component for other tabs columns
export const RequestColumns = ({ 
  isSelectAll, 
  handleSelectAll, 
  selectAllLoading, 
  selectedRows, 
  handleSelectRow,
  onRequestClick,
  showCheckboxes = true
}) => {
  const router = useRouter();

  const columns = [];

  // Checkbox column removed - no longer needed for JVM Requests

  // Add other columns - JVM Initiate JV structure
  columns.push(
    {
      field: "sNo",
      headerName: "JV No",
      width: 120,
      resizable: true,
      renderCell: (params) => (
        <Typography
          sx={{
            color: "#1976d2",
            textDecoration: "underline",
            cursor: "pointer",
            fontWeight: 600,
            "&:hover": { color: "#1565c0" },
          }}
          onClick={() => router.push(`/jvm/requests/detail/${params.row.id}`)}
        >
          {params.value}
        </Typography>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      width: 120,
      resizable: true,
      renderCell: (params) => (
        <Typography
          sx={{
            color: "#1976d2",
            textDecoration: "underline",
            cursor: "pointer",
            fontWeight: 600,
            "&:hover": { color: "#1565c0" },
          }}
          onClick={() => onRequestClick ? onRequestClick(params.row) : null}
        >
          {params.value}
        </Typography>
      ),
    },
    {
      field: "pId",
      headerName: "P ID",
      width: 100,
      resizable: true,
      renderCell: (params) => `P${String(params.row.id).padStart(4, "0")}`,
    },
    {
      field: "documentType",
      headerName: "Document Type",
      width: 140,
      resizable: true,
    },
    {
      field: "documentDate",
      headerName: "Document Date",
      width: 140,
      resizable: true,
      renderCell: (params) => {
        if (!params.value) return "";
        const date = new Date(params.value);
        return isNaN(date.getTime())
          ? params.value
          : date.toLocaleDateString("en-GB");
      },
    },
    {
      field: "postingDate",
      headerName: "Posting Date",
      width: 140,
      resizable: true,
      renderCell: (params) => {
        if (!params.value) return "";
        const date = new Date(params.value);
        return isNaN(date.getTime())
          ? params.value
          : date.toLocaleDateString("en-GB");
      },
    },
    {
      field: "businessArea",
      headerName: "Business Area",
      width: 130,
      resizable: true,
    },
    {
      field: "accountType",
      headerName: "Account Type",
      width: 130,
      resizable: true,
    },
    {
      field: "postingKey",
      headerName: "Posting Key",
      width: 160,
      resizable: true,
    },
    {
      field: "vendorCustomerGLName",
      headerName: "Vendor/Customer/GL Name",
      width: 200,
      resizable: true,
    },
    {
      field: "vendorCustomerGLNumber",
      headerName: "Vendor/Customer/GL Number",
      width: 200,
      resizable: true,
    },
    {
      field: "amount",
      headerName: "Amount",
      width: 120,
      resizable: true,
      renderCell: (params) => `₹${params.value?.toLocaleString() || "0"}`,
    },
    {
      field: "assignment",
      headerName: "Assignment",
      width: 130,
      resizable: true,
    },
    {
      field: "costCenter",
      headerName: "Cost Center",
      width: 130,
      resizable: true,
    },
    {
      field: "profitCenter",
      headerName: "Profit Center",
      width: 130,
      resizable: true,
    },
    {
      field: "specialGLIndication",
      headerName: "Special GL Indication",
      width: 170,
      resizable: true,
    },
    {
      field: "referenceNumber",
      headerName: "Reference Number",
      width: 150,
      resizable: true,
      minWidth: 120,
      maxWidth: 300,
      sortable: false,
    },
    {
      field: "personalNumber",
      headerName: "Personal Number",
      width: 150,
      resizable: true,
    },
    {
      field: "remarks",
      headerName: "Remarks",
      width: 200,
      resizable: true,
      renderCell: (params) => (
        <Box
          sx={{
            maxWidth: "100%",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
          }}
          title={params.value}
        >
          {params.value}
        </Box>
      ),
    },
    {
      field: "autoReversal",
      headerName: "Auto Reversal",
      width: 130,
      resizable: true,
      renderCell: (params) => params.value === "Y" ? "Yes" : "No",
    },
    {
      field: "createdAt",
      headerName: "Created At",
      width: 140,
      resizable: true,
      renderCell: (params) => fDateTime(params.value),
    }
  );

  return columns;
};
