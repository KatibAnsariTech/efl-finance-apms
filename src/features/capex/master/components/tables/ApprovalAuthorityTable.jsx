import React, { useState, useEffect } from "react";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import { 
  IconButton, 
  Box, 
  Typography, 
  Chip, 
  Card, 
  CardContent,
  Tooltip,
  Stack
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Iconify from "src/components/iconify";
import { userRequest } from "src/requestMethod";
import { fDate } from "src/utils/format-time";
import { fCurrency } from "src/utils/format-number";
import swal from "sweetalert";
import { showErrorMessage } from "src/utils/errorUtils";
import CircularIndeterminate from "src/utils/loader";

export default function ApprovalAuthorityTable({ 
  handleEdit: parentHandleEdit, 
  handleDelete: parentHandleDelete, 
  refreshTrigger, 
  tabChangeTrigger 
}) {
  const theme = useTheme();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [rowCount, setRowCount] = useState(0);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await userRequest.get("/capex/getApprovalAuthority", {
        params: {
          page: page + 1,
          limit: rowsPerPage,
        },
      });

      const apiData = response.data.data.approvalAuthority || [];
      const totalCount = response.data.data.pagination?.total || 0;

      const mappedData = apiData.map((item, index) => ({
        id: item._id,
        sno: (page * rowsPerPage) + index + 1,
        valueFrom: item.valueFrom || 0,
        valueTo: item.valueTo || null,
        functionalSpoc: item.functionalSpoc || false,
        exCom: item.exCom || false,
        headOfFinanceOps: item.headOfFinanceOps || false,
        financeController: item.financeController || false,
        cfo: item.cfo || false,
        ceoMd: item.ceoMd || false,
        ...item,
      }));

      setData(mappedData);
      setRowCount(totalCount);
    } catch (error) {
      console.error("Error fetching Approval Authority data:", error);
      showErrorMessage(error, "Error fetching Approval Authority data", swal);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [page, rowsPerPage, refreshTrigger]);

  useEffect(() => {
    if (tabChangeTrigger > 0 || refreshTrigger > 0) {
      setPage(0);
    }
  }, [tabChangeTrigger, refreshTrigger]);

  const handleEdit = (id) => {
    if (parentHandleEdit) {
      const rowData = data.find(item => item.id === id);
      parentHandleEdit(rowData);
    } else {
      alert(`Edit Approval Authority: ${id}`);
    }
  };

  const handleDelete = (id) => {
    if (parentHandleDelete) {
      parentHandleDelete(id);
    } else {
      alert(`Delete Approval Authority: ${id}`);
    }
  };

  const formatCurrency = (value) => {
    if (value >= 10000000) {
      return `${(value / 10000000).toFixed(1)} Cr`;
    } else if (value >= 100000) {
      return `${(value / 100000).toFixed(1)} L`;
    } else {
      return `${value.toLocaleString()}`;
    }
  };

  const getValueRangeText = (valueFrom, valueTo) => {
    const fromText = formatCurrency(valueFrom);
    const toText = valueTo ? formatCurrency(valueTo) : "Above";
    return `${fromText} - ${toText}`;
  };

  const ApprovalChip = ({ approved, label }) => (
    <Chip
      label={approved ? "Required" : "Not Required"}
      size="small"
      color={approved ? "success" : "default"}
      variant={approved ? "filled" : "outlined"}
      sx={{
        fontSize: "11px",
        height: "24px",
        fontWeight: 500,
        minWidth: "80px",
      }}
    />
  );

  const columns = [
    {
      field: "sno",
      headerName: "S.No.",
      width: 90,
      sortable: false,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "valueRange",
      headerName: "Project Value Range (INR)",
      minWidth: 200,
      flex: 1,
      sortable: false,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="body2" sx={{ fontWeight: 600, color: "primary.main" }}>
            {getValueRangeText(params.row.valueFrom, params.row.valueTo)}
          </Typography>
          <Typography variant="caption" sx={{ color: "text.secondary" }}>
            {params.row.valueFrom.toLocaleString()} - {params.row.valueTo ? params.row.valueTo.toLocaleString() : "∞"}
          </Typography>
        </Box>
      ),
    },
    {
      field: "functionalSpoc",
      headerName: "Functional SPOC",
      width: 130,
      sortable: false,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => <ApprovalChip approved={params.value} label="Functional SPOC" />,
    },
    {
      field: "exCom",
      headerName: "Ex-com",
      width: 100,
      sortable: false,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => <ApprovalChip approved={params.value} label="Ex-com" />,
    },
    {
      field: "headOfFinanceOps",
      headerName: "Head of Finance Ops",
      width: 150,
      sortable: false,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => <ApprovalChip approved={params.value} label="Head of Finance Ops" />,
    },
    {
      field: "financeController",
      headerName: "Finance Controller",
      width: 150,
      sortable: false,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => <ApprovalChip approved={params.value} label="Finance Controller" />,
    },
    {
      field: "cfo",
      headerName: "CFO",
      width: 80,
      sortable: false,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => <ApprovalChip approved={params.value} label="CFO" />,
    },
    {
      field: "ceoMd",
      headerName: "CEO / MD",
      width: 100,
      sortable: false,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => <ApprovalChip approved={params.value} label="CEO / MD" />,
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      sortable: false,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => [
        <GridActionsCellItem
          key="edit"
          icon={
            <Tooltip title="Edit">
              <IconButton color="primary" size="small">
                <Iconify icon="eva:edit-fill" />
              </IconButton>
            </Tooltip>
          }
          label="Edit"
          onClick={() => handleEdit(params.id)}
        />,
        <GridActionsCellItem
          key="delete"
          icon={
            <Tooltip title="Delete">
              <IconButton color="error" size="small">
                <Iconify icon="eva:trash-2-fill" />
              </IconButton>
            </Tooltip>
          }
          label="Delete"
          onClick={() => handleDelete(params.id)}
        />,
      ],
    },
  ];

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: 400 }}>
        <CircularIndeterminate />
      </Box>
    );
  }

  return (
    <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
      <CardContent sx={{ p: 0 }}>
        <Box sx={{ height: 600, width: "100%" }}>
          <DataGrid
            rows={data}
            columns={columns}
            page={page}
            pageSize={rowsPerPage}
            rowsPerPageOptions={[5, 10, 25, 50]}
            onPageChange={(newPage) => setPage(newPage)}
            onPageSizeChange={(newPageSize) => {
              setRowsPerPage(newPageSize);
              setPage(0);
            }}
            rowCount={rowCount}
            paginationMode="server"
            loading={loading}
            disableSelectionOnClick
            sx={{
              border: "none",
              "& .MuiDataGrid-cell": {
                borderBottom: "1px solid #f0f0f0",
              },
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: theme.palette.grey[50],
                borderBottom: "2px solid #e0e0e0",
                fontWeight: 600,
              },
              "& .MuiDataGrid-row:hover": {
                backgroundColor: theme.palette.action.hover,
              },
            }}
          />
        </Box>
      </CardContent>
    </Card>
  );
}
