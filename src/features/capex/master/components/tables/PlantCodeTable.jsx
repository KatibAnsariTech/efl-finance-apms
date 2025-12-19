import React, { useState, useEffect } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { IconButton, Box, Typography } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Iconify from "src/components/iconify";
import { userRequest } from "src/requestMethod";
import swal from "sweetalert";
import { showErrorMessage } from "src/utils/errorUtils";

export default function PlantCodeTable({ handleEdit: parentHandleEdit, handleDelete: parentHandleDelete, refreshTrigger, tabChangeTrigger }) {
  const theme = useTheme();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [rowCount, setRowCount] = useState(0);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await userRequest.get("cpx/getPlantCodes", {
        params: {
          page: page + 1,
          limit: rowsPerPage,
        },
      });

      const apiData = response.data.data?.items || response.data.data || [];
      const totalCount = response.data.data?.pagination?.total || response.data.data?.total || 0;

      const mappedData = apiData.map((item, index) => ({
        ...item,
        id: item._id,
        sno: (page * rowsPerPage) + index + 1,
        plantCode: item.plantCode || "-",
        businessVerticalName: item.businessVertical?.name || "-",
        locationDetails: {
          location: item.location?.location || "-",
          deliveryAddress: item.location?.deliveryAddress || "-",
          postalCode: item.location?.postalCode || "-",
          state: item.location?.state || "-",
        },
      }));

      setData(mappedData);
      setRowCount(totalCount);
    } catch (error) {
      console.error("Error fetching Plant Code data:", error);
      showErrorMessage(error, "Error fetching Plant Code data", swal);
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
      alert(`Edit Plant Code: ${id}`);
    }
  };

  const handleDelete = (id) => {
    if (parentHandleDelete) {
      parentHandleDelete(id);
    } else {
      alert(`Delete Plant Code: ${id}`);
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
      field: "plantCode",
      headerName: "Plant Code",
      minWidth: 120,
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
      field: "businessVerticalName",
      headerName: "Business Vertical",
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
      field: "locationDetails",
      headerName: "Location",
      minWidth: 250,
      flex: 1,
      sortable: false,
      align: "center",
      headerAlign: "center",
      resizable: true,
      renderCell: (params) => {
        const location = params.value;
        return (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              py: 1,
              gap: 0,
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 500, fontSize: "0.75rem", lineHeight: 1.2 }}>
              {location?.location || "-"}
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary", fontSize: "0.7rem", lineHeight: 1.2 }}>
              {location?.deliveryAddress || "-"}
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary", fontSize: "0.7rem", lineHeight: 1.2 }}>
              {location?.postalCode || "-"} {location?.state ? `, ${location.state}` : ""}
            </Typography>
          </Box>
        );
      },
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
            onClick={(event) => {
              event.stopPropagation();
              handleEdit(params.row.id);
            }}
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
            onClick={(event) => {
              event.stopPropagation();
              handleDelete(params.row.id);
            }}
            sx={{
              color: theme.palette.error.main,
              "&:hover": {
                backgroundColor: theme.palette.error.lighter,
              },
            }}
          >
            <Iconify icon="eva:trash-2-fill" sx={{ color: "error.main" }} />
          </IconButton>
        </Box>
      ),
    },
  ];

  return (
    <DataGrid
        key={`plantcode-table-${tabChangeTrigger}`}
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
        disableColumnResize={false}
        autoHeight
        sx={{
        "& .MuiDataGrid-root": {
          tableLayout: "fixed",
        },
          "& .MuiDataGrid-cell": {
          display: "flex",
          alignItems: "center",
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

