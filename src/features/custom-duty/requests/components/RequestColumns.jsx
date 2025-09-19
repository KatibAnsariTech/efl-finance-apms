import React from "react";
import { Box, Typography, Checkbox, CircularProgress } from "@mui/material";
import { useRouter } from "src/routes/hooks";
import { fDateTime } from "src/utils/format-time";

// Component for "Raise to Bank" tab columns
export const SubmittedColumns = () => {
  const router = useRouter();

  return [
    {
      field: "submitRequestNo",
      headerName: "Final - Submit Request No.",
      flex: 1,
      minWidth: 200,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Typography
          sx={{
            color: "#1976d2",
            textDecoration: "underline",
            cursor: "pointer",
            fontWeight: 600,
            "&:hover": { color: "#1565c0" },
            fontSize: "0.875rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            width: "100%",
          }}
          onClick={() => router.push(`/submit-detail/${params.value}`)}
        >
          {params.value}
        </Typography>
      ),
    },
    {
      field: "submitDate",
      headerName: "Submit Date and Time",
      flex: 1,
      minWidth: 180,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Typography
          sx={{
            fontSize: "0.875rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            width: "100%",
          }}
        >
          {fDateTime(params.value)}
        </Typography>
      ),
    },
    {
      field: "totalRecords",
      headerName: "Total Records Submitted",
      flex: 1,
      minWidth: 180,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Typography 
          sx={{ 
            fontWeight: 600,
            fontSize: "0.875rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            width: "100%",
          }}
        >
          {params.value}
        </Typography>
      ),
    },
    {
      field: "downloadLink",
      headerName: "Download Submitted Record Details",
      flex: 1,
      minWidth: 250,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Typography
          sx={{
            color: "#1976d2",
            textDecoration: "underline",
            cursor: "pointer",
            fontWeight: 600,
            "&:hover": { color: "#1565c0" },
            fontSize: "0.875rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            width: "100%",
          }}
          onClick={() => {
            // Handle download
            console.log('Download file for:', params.row.submitRequestNo);
          }}
        >
          Download File
        </Typography>
      ),
    },
    {
      field: "submittedBy",
      headerName: "Submitted by",
      flex: 1,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Typography
          sx={{
            fontSize: "0.875rem",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "100%",
            width: "100%",
          }}
        >
          {params.value}
        </Typography>
      ),
    },
  ];
};

// Component for other tabs columns
export const RequestColumns = ({ 
  isSelectAll, 
  handleSelectAll, 
  selectAllLoading, 
  selectedRows, 
  handleSelectRow 
}) => {
  const router = useRouter();

  return [
    {
      field: "checkbox",
      headerName: (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          {selectAllLoading ? (
            <CircularProgress size={20} />
          ) : (
            <Checkbox
              checked={isSelectAll}
              onChange={handleSelectAll}
              size="small"
            />
          )}
        </Box>
      ),
      width: 80,
      sortable: false,
      filterable: false,
      resizable: false,
      disableColumnMenu: true,
      headerAlign: 'center',
      align: 'center',
      renderCell: (params) => (
        <Checkbox
          checked={selectedRows.includes(params.row.id)}
          onChange={() => handleSelectRow(params.row.id)}
          size="small"
        />
      ),
    },
    {
      field: "requestNo",
      headerName: "Request No.",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => (
        <Typography
          sx={{
            color: "#1976d2",
            textDecoration: "underline",
            cursor: "pointer",
            fontWeight: 600,
            "&:hover": { color: "#1565c0" },
          }}
          onClick={() => router.push(`/request-detail/${params.value}`)}
        >
          {params.value}
        </Typography>
      ),
    },
    {
      field: "requestedDate",
      headerName: "Requested Date",
      flex: 1,
      minWidth: 180,
      renderCell: (params) => fDateTime(params.value),
    },
    {
      field: "boeNumber",
      headerName: "BOE number",
      flex: 1,
      minWidth: 120,
    },
    {
      field: "challanNumber",
      headerName: "Challan number",
      flex: 1,
      minWidth: 140,
    },
    {
      field: "transactionType",
      headerName: "Type of transaction",
      flex: 1,
      minWidth: 150,
    },
    {
      field: "transactionDate",
      headerName: "Transaction Date",
      flex: 1,
      minWidth: 180,
      renderCell: (params) => fDateTime(params.value),
    },
    {
      field: "transactionAmount",
      headerName: "Transaction amount",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => params.value?.toLocaleString(),
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      minWidth: 120,
    },
    {
      field: "company",
      headerName: "Company",
      flex: 1,
      minWidth: 100,
    },
    {
      field: "description",
      headerName: "Description",
      flex: 1,
      minWidth: 150,
    },
  ];
};
