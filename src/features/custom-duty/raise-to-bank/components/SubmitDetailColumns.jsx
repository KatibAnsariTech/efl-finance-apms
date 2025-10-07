import React from "react";
import { Box, Typography, Checkbox, CircularProgress } from "@mui/material";
import { useRouter } from "src/routes/hooks";
import { fDateTime } from "src/utils/format-time";

export const RequestColumns = ({ onRequestClick }) => {
  const router = useRouter();

  return [
    {
      field: "requestNo",
      headerName: "Request No.",
      flex: 1,
      minWidth: 200,
      align: "center",
      headerAlign: "center",
      // renderCell: (params) => (
      //   <Typography
      //     sx={{
      //       color: "#1976d2",
      //       textDecoration: "underline",
      //       cursor: "pointer",
      //       fontWeight: 600,
      //       "&:hover": { color: "#1565c0" },
      //       fontSize: "0.875rem",
      //       display: "flex",
      //       alignItems: "center",
      //       justifyContent: "center",
      //       height: "100%",
      //       width: "100%",
      //     }}
      //     onClick={() =>
      //       onRequestClick
      //         ? onRequestClick(params.row)
      //         : router.push(`/request-detail/${params.value}`)
      //     }
      //   >
      //     {params.value}
      //   </Typography>
      // ),
    },
    {
      field: "createdAt",
      headerName: "Requested Date",
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
      field: "documentNo",
      headerName: "Document No",
      flex: 1,
      minWidth: 120,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "challanNo",
      headerName: "Challan number",
      flex: 1,
      minWidth: 140,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "typeOfTransaction",
      headerName: "Type of transaction",
      flex: 1,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "transactionDate",
      headerName: "Transaction Date",
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
      field: "transactionAmount",
      headerName: "Transaction amount",
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
          {params.value?.toLocaleString()}
        </Typography>
      ),
    },
    {
      field: "companyId",
      headerName: "Company",
      flex: 1,
      minWidth: 100,
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
          {params.value?.name || "-"}
        </Typography>
      ),
    },
    {
      field: "description",
      headerName: "Description",
      flex: 1,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "icegateAckNo",
      headerName: "Icegate Ack. No.",
      width: 200,
      resizable: true,
    },
    {
      field: "referenceId",
      headerName: "Reference ID",
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
  ];
};
