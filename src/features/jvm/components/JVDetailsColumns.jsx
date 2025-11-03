import React from "react";
import { fDateTime } from "src/utils/format-time";

export const JVDetailsColumns = () => {
  const columns = [
    {
      field: "type",
      headerName: "Type",
      flex: 0.8,
      minWidth: 100,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "documentType",
      headerName: "Document Type",
      flex: 1,
      minWidth: 120,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "documentDate",
      headerName: "Document Date",
      flex: 1,
      minWidth: 120,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => fDateTime(params.value),
    },
    {
      field: "businessArea",
      headerName: "Business Area",
      flex: 1,
      minWidth: 120,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "accountType",
      headerName: "Account Type",
      flex: 1,
      minWidth: 120,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "postingKey",
      headerName: "Posting Key",
      flex: 1,
      minWidth: 120,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "vendorCustomerGLNumber",
      headerName: "GL Number",
      flex: 1,
      minWidth: 120,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "vendorCustomerGLName",
      headerName: "GL Name",
      flex: 2,
      minWidth: 200,
      align: "left",
      headerAlign: "center",
    },
    {
      field: "amount",
      headerName: "Amount",
      flex: 1.2,
      minWidth: 130,
      align: "right",
      headerAlign: "center",
      renderCell: (params) => {
        const amount = params.value;
        const formattedAmount = `₹${Math.abs(amount)?.toLocaleString()}`;
        return formattedAmount;
      },
    },
    {
      field: "assignment",
      headerName: "Assignment",
      flex: 1,
      minWidth: 120,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "profitCenter",
      headerName: "Profit Center",
      flex: 1,
      minWidth: 120,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "specialGLIndication",
      headerName: "Special GL",
      flex: 1,
      minWidth: 100,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "referenceNumber",
      headerName: "Reference",
      flex: 1,
      minWidth: 120,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "remarks",
      headerName: "Remarks",
      flex: 2,
      minWidth: 200,
      align: "left",
      headerAlign: "center",
    },
    {
      field: "postingDate",
      headerName: "Posting Date",
      flex: 1,
      minWidth: 120,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => fDateTime(params.value),
    },
    {
      field: "costCenter",
      headerName: "Cost Center",
      flex: 1,
      minWidth: 120,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "personalNumber",
      headerName: "Personal No.",
      flex: 1,
      minWidth: 120,
      align: "center",
      headerAlign: "center",
    },
  ];

  return columns;
};

