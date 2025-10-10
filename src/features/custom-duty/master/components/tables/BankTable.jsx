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

export default function BankTable({ handleEdit: parentHandleEdit, handleDelete: parentHandleDelete, refreshTrigger }) {
  const theme = useTheme();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [rowCount, setRowCount] = useState(0);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await userRequest.get("/custom/getBanks", {
        params: {
          page: paginationModel.page + 1, // API uses 1-based pagination
          limit: paginationModel.pageSize,
        },
      });

      const apiData = response.data.data.banks || [];
      const totalCount = response.data.data.pagination?.total || 0;

      const mappedData = apiData.map((item, index) => ({
        id: item._id,
        sno: (paginationModel.page * paginationModel.pageSize) + index + 1,
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
  }, [paginationModel, refreshTrigger]);

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

  if (loading) {
    return <CircularIndeterminate />;
  }

  return (
    <DataGrid
      rows={data}
      columns={columns}
      loading={loading}
      paginationMode="server"
      rowCount={rowCount}
      paginationModel={paginationModel}
      onPaginationModelChange={setPaginationModel}
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
