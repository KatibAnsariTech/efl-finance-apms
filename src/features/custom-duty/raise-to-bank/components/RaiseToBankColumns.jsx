import React from "react";
import { Typography } from "@mui/material";
import { useRouter } from "src/routes/hooks";
import { fDateTime } from "src/utils/format-time";

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
