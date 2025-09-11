import React, { useState, useEffect } from 'react';
import {
  DataGrid,
  GridActionsCellItem,
} from '@mui/x-data-grid';
import { IconButton, Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Iconify from 'src/components/iconify';
import { userRequest } from 'src/requestMethod';
import { fDate } from 'src/utils/format-time';
import { fCurrency } from 'src/utils/format-number';
import swal from 'sweetalert';
import { showErrorMessage } from 'src/utils/errorUtils';
import CircularIndeterminate from 'src/utils/loader';

export default function RegionTable() {
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
      const response = await userRequest.get(`/admin/getMasters?key=Region&page=${paginationModel.page + 1}&limit=${paginationModel.pageSize}`);
      if (response.data.success) {
        const mappedData = response.data.data.masters.map((item, index) => ({
          id: item._id,
          sno: paginationModel.page * paginationModel.pageSize + index + 1,
          region: item.value || '-',
          ...item,
        }));
        setData(mappedData);
        setRowCount(response.data.data.pagination.total);
      }
    } catch (error) {
      console.error('Error fetching Region data:', error);
      showErrorMessage(error, 'Error fetching Region data', swal);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [paginationModel]);

  const handleEdit = (event, id) => {
    event.preventDefault();
    event.stopPropagation();
    console.log('Edit Region:', id);
    // Add edit logic here
  };

  const handleDelete = (event, id) => {
    event.preventDefault();
    event.stopPropagation();
    console.log('Delete Region:', id);
    // Add delete logic here
  };

  const columns = [
    {
      field: 'sno',
      headerName: 'S.No.',
      width: 90,
      sortable: false,
      align: 'center',
      headerAlign: 'center',
    },
    {
      field: 'region',
      headerName: 'Region',
      flex: 1,
      minWidth: 150,
      sortable: true,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          {params.value || '-'}
        </Typography>
      ),
    },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 120,
      sortable: false,
      align: 'center',
      headerAlign: 'center',
      renderCell: (params) => (
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 1,
          }}
          onClick={(event) => event.stopPropagation()}
        >
          <IconButton
            size="small"
            onClick={(event) => handleEdit(event, params.row.id)}
            sx={{
              color: theme.palette.primary.main,
              '&:hover': {
                backgroundColor: theme.palette.primary.lighter,
              },
            }}
          >
            <Iconify icon="eva:edit-fill" sx={{ color: "primary.main" }} />
          </IconButton>
          <IconButton
            size="small"
            onClick={(event) => handleDelete(event, params.row.id)}
            sx={{
              color: theme.palette.error.main,
              '&:hover': {
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
      autoHeight
      sx={{
        '& .MuiDataGrid-cell': {
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        },
        '& .MuiDataGrid-cell:focus': {
          outline: 'none',
        },
        '& .MuiDataGrid-cell:focus-visible': {
          outline: 'none',
        },
        '& .MuiDataGrid-row:focus': {
          outline: 'none',
        },
        '& .MuiDataGrid-row:focus-visible': {
          outline: 'none',
        },
        '& .MuiIconButton-root:focus': {
          outline: 'none',
        },
        '& .MuiIconButton-root:focus-visible': {
          outline: 'none',
        },
        '& .MuiSwitch-root:focus': {
          outline: 'none',
        },
        '& .MuiSwitch-root:focus-visible': {
          outline: 'none',
        },
      }}
    />
  );
}
