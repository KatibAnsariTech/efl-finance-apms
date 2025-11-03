import React from "react";
import { Box, Chip, Tooltip } from "@mui/material";
import { fDateTime } from "src/utils/format-time";

export const JVMReportColumns = () => {
  const columns = [
    {
      field: "parentId",
      headerName: "P.Id",
      flex: 0.8,
      minWidth: 120,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "groupId",
      headerName: "G.Id",
      flex: 1,
      minWidth: 160,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "createdAt",
      headerName: "Created Date",
      flex: 1,
      minWidth: 180,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => fDateTime(params.value),
    },
    {
      field: "status",
      headerName: "Approval Status",
      flex: 1,
      minWidth: 130,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        const status = params.value?.toLowerCase() || "";
        let color = "default";
        if (status === "approved" || status === "accepted") {
          color = "success";
        } else if (status === "rejected" || status === "declined") {
          color = "error";
        } else if (status === "pending") {
          color = "warning";
        }
        return (
          <Chip
            label={params.value || "-"}
            color={color}
            size="small"
            sx={{ fontWeight: 600 }}
          />
        );
      },
    },
    {
      field: "totalDebit",
      headerName: "Total Debit",
      flex: 1,
      minWidth: 140,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => `₹${params.value?.toLocaleString() || "0"}`,
    },
    {
      field: "totalCredit",
      headerName: "Total Credit",
      flex: 1,
      minWidth: 140,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => `₹${params.value?.toLocaleString() || "0"}`,
    },
    {
      field: "autoReversal",
      headerName: "Auto Reversal",
      flex: 0.8,
      minWidth: 110,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => `${params.value === true ? "Yes" : "No"}`,
    },
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
      minWidth: 150,
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
      renderCell: (params) => {
        const name = params.value || "-";
        return (
          <Tooltip title={name} arrow>
            <Box
              sx={{
                maxWidth: "100%",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {name}
            </Box>
          </Tooltip>
        );
      },
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
        const formattedAmount = `₹${Math.abs(amount)?.toLocaleString() || "0"}`;
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
      renderCell: (params) => {
        const remarks = params.value || "-";
        return (
          <Tooltip title={remarks} arrow>
            <Box
              sx={{
                maxWidth: "100%",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {remarks}
            </Box>
          </Tooltip>
        );
      },
    },
    {
      field: "postingDate",
      headerName: "Posting Date",
      flex: 1,
      minWidth: 150,
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
    {
      field: "sapStatus",
      headerName: "SAP Status",
      flex: 1,
      minWidth: 120,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        const sapStatus = params.value?.toString().trim();
        if (!sapStatus || sapStatus === "" || sapStatus === "-") {
          return "-";
        }
        const statusUpper = sapStatus.toUpperCase();
        const isSuccess = statusUpper === "SUCCESS" || statusUpper === "S";
        const isPending = statusUpper === "PENDING" || statusUpper === "P";
        let color = "error";
        if (isSuccess) {
          color = "success";
        } else if (isPending) {
          color = "warning";
        }
        return (
          <Chip
            label={sapStatus}
            color={color}
            size="small"
            sx={{ fontWeight: 600 }}
          />
        );
      },
    },
    {
      field: "sapNumber",
      headerName: "SAP Number",
      flex: 1,
      minWidth: 140,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => params.value || "-",
    },
    {
      field: "sapMessage",
      headerName: "SAP Message",
      flex: 2,
      minWidth: 200,
      align: "left",
      headerAlign: "center",
      renderCell: (params) => {
        const message = params.value || "-";
        return (
          <Tooltip title={message} arrow>
            <Box
              sx={{
                maxWidth: "100%",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap",
              }}
            >
              {message}
            </Box>
          </Tooltip>
        );
      },
    },
  ];

  return columns;
};
