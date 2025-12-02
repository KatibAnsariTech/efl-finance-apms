import React, { useState, useEffect } from "react";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import { IconButton, Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Iconify from "src/components/iconify";
import { userRequest } from "src/requestMethod";
import { fDate } from "src/utils/format-time";
import swal from "sweetalert";
import { showErrorMessage } from "src/utils/errorUtils";
import CircularIndeterminate from "src/utils/loader";

export default function TypeTable({ handleEdit, handleDelete, refreshTrigger, onDataUpdate }) {
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
      const response = await userRequest.get(
        `/imt/getMasters?key=Type&page=${paginationModel.page + 1}&limit=${
          paginationModel.pageSize
        }`
      );
      if (response.data.success) {
        const mappedData = response.data.data.masters.map((item, index) => ({
          id: item._id,
          sno: paginationModel.page * paginationModel.pageSize + index + 1,
          type: item.value || "-",
          Scope: item.other?.map(o => o.value).join(", ") || "-",
          ...item,
        }));
        setData(mappedData);
        setRowCount(response.data.data.total);
        
        // Pass the latest data to parent component for toolbar display
        if (onDataUpdate && mappedData.length > 0) {
          onDataUpdate(mappedData[0]); // Send the first (latest) record
        }
      }
    } catch (error) {
      console.error("Error fetching Hierarchy data:", error);
      showErrorMessage(error, "Error fetching Hierarchy data", swal);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [paginationModel]);

  useEffect(() => {
    if (refreshTrigger) {
      fetchData();
    }
  }, [refreshTrigger]);

  const handleEditClick = (event, id) => {
    event.preventDefault();
    event.stopPropagation();
    const row = data.find(item => item.id === id);
    if (row) {
      handleEdit(row);
    }
  };

  const handleDeleteClick = (event, id) => {
    event.preventDefault();
    event.stopPropagation();
    handleDelete(id);
  };

  const renderUserText = (value) => {
    if (!value || value === "-") {
      return <Typography variant="body2" color="text.secondary">-</Typography>;
    }
    return (
      <Typography variant="body2" sx={{ fontWeight: 500 }}>
        {value}
      </Typography>
    );
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
      field: "Scope",
      headerName: "Scope Name",
      minWidth: 200,
      flex: 1,
      sortable: true,
      align: "center",
      headerAlign: "center",
      resizable: true,
      renderCell: (params) => renderUserText(params.value),
    },
    {
      field: "type",
      headerName: "Type Name",
      minWidth: 200,
      flex: 1,
      sortable: true,
      align: "center",
      headerAlign: "center",
      resizable: true,
      renderCell: (params) => renderUserText(params.value),
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 120,
      sortable: false,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: 1,
          }}
          onClick={(event) => event.stopPropagation()}
        >
          <IconButton
            size="small"
            onClick={(event) => handleEditClick(event, params.row.id)}
            sx={{
              color: theme.palette.primary.main,
              "&:hover": {
                backgroundColor: theme.palette.primary.lighter,
              },
            }}
          >
            <Iconify icon="eva:edit-fill" sx={{ color: "primary.main" }} />
          </IconButton>
          <IconButton
            size="small"
            onClick={(event) => handleDeleteClick(event, params.row.id)}
            sx={{
              color: theme.palette.error.main,
              "&:hover": {
                backgroundColor: theme.palette.error.lighter,
              },
            }}
          >
            <Iconify icon="solar:trash-bin-trash-bold" />
          </IconButton>
        </Box>
      ),
    },
  ];

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
      disableColumnResize={false}
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
        "& .MuiSwitch-root:focus": {
          outline: "none",
        },
        "& .MuiSwitch-root:focus-visible": {
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
