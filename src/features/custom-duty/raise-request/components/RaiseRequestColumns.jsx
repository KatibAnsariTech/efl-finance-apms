import React from "react";
import { Box } from "@mui/material";

export const RaiseRequestColumns = () => {
  const columns = [
    {
      field: "srNo",
      headerName: "Sr.no.",
      width: 80,
      align: "center",
      headerAlign: "center",
      resizable: true,
    },
    {
      field: "challanNo",
      headerName: "Challan No.",
      width: 150,
      resizable: true,
    },
    {
      field: "documentNo",
      headerName: "Document No",
      width: 150,
      resizable: true,
    },
    {
      field: "transactionDate",
      headerName: "Transaction Date",
      width: 200,
      resizable: true,
      renderCell: (params) => {
        if (!params.value) return "";
        const date = new Date(params.value);
        return isNaN(date.getTime())
          ? params.value
          : date.toLocaleString("en-GB", {
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              fractionalSecondDigits: 3,
            });
      },
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
    {
      field: "description",
      headerName: "Description",
      width: 150,
      resizable: true,
    },
    {
      field: "typeOfTransaction",
      headerName: "Type of Transaction",
      width: 180,
      resizable: true,
    },
    {
      field: "transactionAmount",
      headerName: "Transaction Amount",
      width: 180,
      resizable: true,
      renderCell: (params) => `₹${params.value?.toLocaleString() || "0"}`,
    },
    {
      field: "icegateAckNo",
      headerName: "Icegate Ack. No.",
      width: 200,
      resizable: true,
    },
  ];

  return columns;
};
