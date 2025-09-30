import React from "react";
import { Box, Chip, IconButton } from "@mui/material";
import Iconify from "src/components/iconify/iconify";
import { fDateTime, fDateDisplay } from "src/utils/format-time";

export const InitiateJVColumns = ({ 
  handleEdit, 
  handleDelete 
}) => {
  const columns = [
    {
      field: "slNo",
      headerName: "S No",
      width: 120,
      align: "center",
      headerAlign: "center",
      resizable: true,
      editable: true,
      renderCell: (params) => params.row.slNo || params.value || "",
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
      renderCell: (params) => fDateDisplay(params.value),
    },
    {
      field: "postingDate",
      headerName: "Posting Date",
      width: 140,
      resizable: true,
      renderCell: (params) => fDateDisplay(params.value),
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
      field: "type",
      headerName: "Type",
      width: 100,
      align: "center",
      headerAlign: "center",
      resizable: true,
      renderCell: (params) => (
        <Chip
          label={params.value || ""}
          color={params.value === "Debit" ? "error" : params.value === "Credit" ? "success" : "default"}
          size="small"
          variant="filled"
        />
      ),
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
      renderCell: (params) =>
        params.value === "Y" ? "Yes" : "No",
    },
    {
      field: "createdAt",
      headerName: "Created At",
      width: 140,
      resizable: true,
      renderCell: (params) => fDateTime(params.value),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      align: "center",
      headerAlign: "center",
      resizable: false,
      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            gap: 1,
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
          }}
        >
          <IconButton
            size="small"
            color="primary"
            onClick={(e) => {
              e.stopPropagation();
              handleEdit(params.row);
            }}
          >
            <Iconify icon="eva:edit-fill" />
          </IconButton>
          <IconButton
            size="small"
            color="error"
            onClick={(e) => {
              e.stopPropagation();
              handleDelete(params.row);
            }}
          >
            <Iconify icon="eva:trash-2-fill" />
          </IconButton>
        </Box>
      ),
    },
  ];

  return columns;
};
