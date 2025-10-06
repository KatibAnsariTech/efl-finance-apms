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

  // Add checkbox column only if showCheckboxes is true
  if (showCheckboxes) {
    columns.push({
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
    });
  }

  // Add other columns
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
          onClick={() => onRequestClick ? onRequestClick(params.row) : router.push(`/request-detail/${params.value}`)}
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
      renderCell: (params) => {
        const dateValue = params.value || params.row.createdAt;
        return dateValue ? fDateTime(dateValue) : "-";
      },
    },
    {
      field: "documentNo",
      headerName: "Document No",
      flex: 1,
      minWidth: 120,
    },
    {
      field: "challanNo",
      headerName: "Challan No",
      flex: 1,
      minWidth: 140,
    },
    {
      field: "typeOfTransaction",
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
      renderCell: (params) => params.value || "-",
    },
    {
      field: "finalRequestNo",
      headerName: "Final Request No.",
      flex: 1,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
    }
  );

  return columns;
};
