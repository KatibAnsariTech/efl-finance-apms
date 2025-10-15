import React, { useState, useEffect } from "react";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import { IconButton, Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Iconify from "src/components/iconify";
import { userRequest } from "src/requestMethod";
import { fDate } from "src/utils/format-time";
import { fCurrency } from "src/utils/format-number";
import swal from "sweetalert";
import { showErrorMessage } from "src/utils/errorUtils";
import CircularIndeterminate from "src/utils/loader";

export default function BankTable({ handleEdit: parentHandleEdit, handleDelete: parentHandleDelete, refreshTrigger, tabChangeTrigger }) {
  const theme = useTheme();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [rowCount, setRowCount] = useState(0);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await userRequest.get("/custom/getBanks", {
        params: {
          page: page + 1, // API uses 1-based pagination
          limit: rowsPerPage,
        },
      });

      const apiData = response.data.data.banks || [];
      const totalCount = response.data.data.pagination?.total || 0;

      const mappedData = apiData.map((item, index) => ({
        id: item._id,
        sno: (page * rowsPerPage) + index + 1,
        bankName: item.bankName || "-",
        accountNumber: item.accountNumber || "-",
        iecCode: item.iecCode || "-",
        address1: item.address1 || "-",
        address2: item.address2 || "-",
        address3: item.address3 || "-",
        ...item,
      }));

      setData(mappedData);
      setRowCount(totalCount);
    } catch (error) {
      console.error("Error fetching Bank data:", error);
      showErrorMessage(error, "Error fetching Bank data", swal);
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
      alert(`Edit Bank: ${id}`);
    }
  };

  const handleDelete = (id) => {
    if (parentHandleDelete) {
      parentHandleDelete(id);
    } else {
      alert(`Delete Bank: ${id}`);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

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
      field: "bankName",
      headerName: "Bank Name",
      minWidth: 200,
      flex: 1,
      sortable: true,
      align: "center",
      headerAlign: "center",
      resizable: true,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          {params.value || "-"}
        </Typography>
      ),
    },
    {
      field: "accountNumber",
      headerName: "Account Number",
      minWidth: 180,
      flex: 1,
      sortable: true,
      align: "center",
      headerAlign: "center",
      resizable: true,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          {params.value || "-"}
        </Typography>
      ),
    },
    {
      field: "iecCode",
      headerName: "IEC Code",
      minWidth: 150,
      flex: 1,
      sortable: true,
      align: "center",
      headerAlign: "center",
      resizable: true,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          {params.value || "-"}
        </Typography>
      ),
    },
    {
      field: "address1",
      headerName: "Address 1",
      minWidth: 200,
      flex: 1,
      sortable: true,
      align: "center",
      headerAlign: "center",
      resizable: true,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          {params.value || "-"}
        </Typography>
      ),
    },
    {
      field: "address2",
      headerName: "Address 2",
      minWidth: 200,
      flex: 1,
      sortable: true,
      align: "center",
      headerAlign: "center",
      resizable: true,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          {params.value || "-"}
        </Typography>
      ),
    },
    {
      field: "address3",
      headerName: "Address 3",
      minWidth: 200,
      flex: 1,
      sortable: true,
      align: "center",
      headerAlign: "center",
      resizable: true,
      renderCell: (params) => (
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          {params.value || "-"}
        </Typography>
      ),
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 100,
      align: "center",
      headerAlign: "center",
      getActions: (params) => [
        <GridActionsCellItem
          icon={
            <IconButton
              size="small"
              sx={{
                color: theme.palette.primary.main,
                "&:hover": {
                  backgroundColor: theme.palette.primary.light + "20",
                },
              }}
            >
              <Iconify icon="eva:edit-fill" width={16} height={16} />
            </IconButton>
          }
          label="Edit"
          onClick={() => handleEdit(params.id)}
        />,
        <GridActionsCellItem
          icon={
            <IconButton
              size="small"
              sx={{
                color: theme.palette.error.main,
                "&:hover": {
                  backgroundColor: theme.palette.error.light + "20",
                },
              }}
            >
              <Iconify icon="eva:trash-2-fill" width={16} height={16} />
            </IconButton>
          }
          label="Delete"
          onClick={() => handleDelete(params.id)}
        />,
      ],
    },
  ];

  return (
    <DataGrid
      key={`bank-table-${tabChangeTrigger}`}
      rows={data}
      columns={columns}
      loading={loading}
      pagination
      paginationMode="server"
      rowCount={rowCount}
      paginationModel={{ page: page, pageSize: rowsPerPage }}
      onPaginationModelChange={(newModel) => {
        handleChangePage(null, newModel.page);
        handleChangeRowsPerPage({ target: { value: newModel.pageSize } });
      }}
      pageSizeOptions={[5, 10, 25, 50]}
      disableRowSelectionOnClick
      autoHeight
      sx={{
        "& .MuiDataGrid-root": {
          tableLayout: "fixed",
        },
        "& .MuiDataGrid-cell": {
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        },
        "& .MuiDataGrid-cell:focus": {
          outline: "none",
        },
        "& .MuiDataGrid-cell:focus-visible": {
          outline: "none",
        },
        "& .MuiDataGrid-row:focus": {
          outline: "none",
        },
        "& .MuiDataGrid-row:focus-visible": {
          outline: "none",
        },
        "& .MuiIconButton-root:focus": {
          outline: "none",
        },
        "& .MuiIconButton-root:focus-visible": {
          outline: "none",
        },
        "& .MuiDataGrid-columnSeparator": {
          display: "none",
        },
        "& .MuiDataGrid-columnHeader:hover .MuiDataGrid-columnSeparator": {
          display: "block",
          opacity: 0.3,
          color: "#637381",
        },
      }}
    />
  );
}
