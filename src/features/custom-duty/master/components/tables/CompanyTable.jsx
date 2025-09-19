import React, { useState, useEffect } from "react";
import {
  DataGrid,
  GridActionsCellItem,
} from "@mui/x-data-grid";
import { Box, IconButton, Tooltip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

const columns = [
  {
    field: "id",
    headerName: "ID",
    width: 80,
    align: "center",
    headerAlign: "center",
  },
  {
    field: "companyName",
    headerName: "Company Name",
    flex: 1,
    minWidth: 250,
    align: "center",
    headerAlign: "center",
  },
  {
    field: "govtIdentifier",
    headerName: "Govt Identifier (Code)",
    flex: 1,
    minWidth: 200,
    align: "center",
    headerAlign: "center",
  },
  {
    field: "bankAccountNumber",
    headerName: "Bank Account Number",
    flex: 1,
    minWidth: 200,
    align: "center",
    headerAlign: "center",
  },
  {
    field: "isActive",
    headerName: "Status",
    width: 120,
    align: "center",
    headerAlign: "center",
    renderCell: (params) => (
      <Box
        sx={{
          color: params.value ? "success.main" : "error.main",
          fontWeight: "bold",
        }}
      >
        {params.value ? "Active" : "Inactive"}
      </Box>
    ),
  },
  {
    field: "createdAt",
    headerName: "Created Date",
    width: 150,
    align: "center",
    headerAlign: "center",
    renderCell: (params) => new Date(params.value).toLocaleDateString(),
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
          <Tooltip title="Edit">
            <EditIcon />
          </Tooltip>
        }
        label="Edit"
        onClick={() => handleEdit(params.row)}
      />,
      <GridActionsCellItem
        icon={
          <Tooltip title="Delete">
            <DeleteIcon />
          </Tooltip>
        }
        label="Delete"
        onClick={() => handleDelete(params.row.id)}
      />,
    ],
  },
];

const handleEdit = (row) => {
  console.log("Edit:", row);
};

const handleDelete = (id) => {
  console.log("Delete:", id);
};

export default function CompanyTable() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [totalCount, setTotalCount] = useState(0);

  const getData = async () => {
    setLoading(true);
    try {
      const mockData = [
        {
          id: 1,
          companyName: "ABC Industries Ltd",
          govtIdentifier: "GST123456789",
          bankAccountNumber: "1234567890123456",
          isActive: true,
          createdAt: "2024-01-15T10:30:00Z",
        },
        {
          id: 2,
          companyName: "XYZ Corporation",
          govtIdentifier: "GST987654321",
          bankAccountNumber: "9876543210987654",
          isActive: true,
          createdAt: "2024-01-16T10:30:00Z",
        },
        {
          id: 3,
          companyName: "DEF Manufacturing Co",
          govtIdentifier: "GST456789123",
          bankAccountNumber: "4567891234567890",
          isActive: false,
          createdAt: "2024-01-17T10:30:00Z",
        },
      ];
      
      setData(mockData);
      setTotalCount(mockData.length);
    } catch (error) {
      console.error("Error fetching data:", error);
      setData([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, [paginationModel]);

  return (
    <Box sx={{ height: 400, width: "100%" }}>
      <DataGrid
        rows={data}
        columns={columns}
        loading={loading}
        paginationModel={paginationModel}
        onPaginationModelChange={setPaginationModel}
        pageSizeOptions={[5, 10, 25, 50]}
        rowCount={totalCount}
        paginationMode="server"
        disableRowSelectionOnClick
        slots={{ toolbar: () => null }}
        sx={{
          "& .MuiDataGrid-cell": {
            "&:focus": { outline: "none" },
            "&:focus-visible": { outline: "none" },
          },
          "& .MuiDataGrid-columnHeaders": {
            backgroundColor: "#f5f6f8",
            fontWeight: "bold",
            color: "#637381",
          },
        }}
      />
    </Box>
  );
}
