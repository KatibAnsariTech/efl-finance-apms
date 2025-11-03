import React from "react";
import { Box, Typography, Checkbox, CircularProgress } from "@mui/material";
import { useRouter } from "src/routes/hooks";
import { fDateTime } from "src/utils/format-time";

export const RequestColumns = ({
  isSelectAll,
  handleSelectAll,
  selectAllLoading,
  selectedRows,
  handleSelectRow,
  onRequestClick,
  showCheckboxes = true,
  selectedTab,
}) => {
  const router = useRouter();

  const columns = [];

  if (showCheckboxes) {
    columns.push({
      field: "checkbox",
      headerName: "Select",
      width: 80,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      headerAlign: "center",
      align: "center",
      renderHeader: () => (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
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
      renderCell: (params) => (
        <Checkbox
          checked={selectedRows.includes(params.row.id)}
          onChange={() => handleSelectRow(params.row.id)}
          size="small"
        />
      ),
    });
  }

  columns.push(
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
            fontSize: "0.87rem",
            fontWeight: 600,
            "&:hover": { color: "#1565c0" },
          }}
          onClick={() =>
            onRequestClick
              ? onRequestClick(params.row)
              : router.push(`/request-detail/${params.value}`)
          }
        >
          {params.value}
        </Typography>
      ),
    },
    {
      field: "createdAt",
      headerName: "Requested Date",
      flex: 1,
      minWidth: 180,
      renderCell: (params) => {
        const dateValue = params.value;
        return dateValue ? fDateTime(dateValue) : "-";
      },
    },
    {
      field: "docNumber",
      headerName: "Document No",
      flex: 1,
      minWidth: 120,
    },
    {
      field: "locationCode",
      headerName: "Location Code",
      flex: 1,
      minWidth: 140,
    },
    {
      field: "docType",
      headerName: "Document Type",
      flex: 1,
      minWidth: 150,
    },
    {
      field: "docDate",
      headerName: "Document Date",
      flex: 1,
      minWidth: 180,
      renderCell: (params) => fDateTime(params.value),
    },
    {
      field: "dueAmount",
      headerName: "Due Amount",
      flex: 1,
      minWidth: 150,
      renderCell: (params) => `₹${params.value?.toLocaleString()}`,
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      minWidth: 120,
    },
    {
      field: "companyId",
      headerName: "Company",
      flex: 1,
      minWidth: 100,
      renderCell: (params) => params.value?.name || "-",
    },
    ...(selectedTab !== "pendingWithMe" ? [{
      field: "finalReqNo",
      headerName: "Final Request No.",
      flex: 1,
      minWidth: 180,
      align: "center",
      headerAlign: "center",
    }] : [])
  );

  return columns;
};
