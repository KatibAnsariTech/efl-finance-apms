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

export default function CompanyTable() {
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
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Generate dummy data
      const dummyData = [
        {
          _id: "1",
          companyName: "Eureka Forbes Ltd",
          govtIdentifier: "GST123456789012",
          bankAccountNumber: "1234567890123456",
          isActive: true,
          createdAt: "2024-01-15T10:30:00Z",
        },
        {
          _id: "2",
          companyName: "Forbes Technologies Pvt Ltd",
          govtIdentifier: "GST987654321098",
          bankAccountNumber: "9876543210987654",
          isActive: true,
          createdAt: "2024-01-16T10:30:00Z",
        },
        {
          _id: "3",
          companyName: "AquaGuard Solutions Inc",
          govtIdentifier: "GST456789123456",
          bankAccountNumber: "4567891234567890",
          isActive: false,
          createdAt: "2024-01-17T10:30:00Z",
        },
        {
          _id: "4",
          companyName: "WaterTech Industries",
          govtIdentifier: "GST789123456789",
          bankAccountNumber: "7891234567890123",
          isActive: true,
          createdAt: "2024-01-18T10:30:00Z",
        },
        {
          _id: "5",
          companyName: "PureWater Systems Ltd",
          govtIdentifier: "GST321654987321",
          bankAccountNumber: "3216549873216549",
          isActive: true,
          createdAt: "2024-01-19T10:30:00Z",
        },
        {
          _id: "6",
          companyName: "CleanTech Corporation",
          govtIdentifier: "GST654321987654",
          bankAccountNumber: "6543219876543210",
          isActive: false,
          createdAt: "2024-01-20T10:30:00Z",
        },
        {
          _id: "7",
          companyName: "AquaPure Technologies",
          govtIdentifier: "GST147258369147",
          bankAccountNumber: "1472583691472583",
          isActive: true,
          createdAt: "2024-01-21T10:30:00Z",
        },
        {
          _id: "8",
          companyName: "WaterWorks Solutions",
          govtIdentifier: "GST369147258369",
          bankAccountNumber: "3691472583691472",
          isActive: true,
          createdAt: "2024-01-22T10:30:00Z",
        },
        {
          _id: "9",
          companyName: "HydroTech Industries",
          govtIdentifier: "GST258147369258",
          bankAccountNumber: "2581473692581473",
          isActive: false,
          createdAt: "2024-01-23T10:30:00Z",
        },
        {
          _id: "10",
          companyName: "AquaFlow Systems",
          govtIdentifier: "GST741852963741",
          bankAccountNumber: "7418529637418529",
          isActive: true,
          createdAt: "2024-01-24T10:30:00Z",
        },
        {
          _id: "11",
          companyName: "PureFlow Technologies",
          govtIdentifier: "GST852963741852",
          bankAccountNumber: "8529637418529637",
          isActive: true,
          createdAt: "2024-01-25T10:30:00Z",
        },
        {
          _id: "12",
          companyName: "WaterMaster Corp",
          govtIdentifier: "GST963741852963",
          bankAccountNumber: "9637418529637418",
          isActive: false,
          createdAt: "2024-01-26T10:30:00Z",
        },
        {
          _id: "13",
          companyName: "AquaShield Ltd",
          govtIdentifier: "GST159753486159",
          bankAccountNumber: "1597534861597534",
          isActive: true,
          createdAt: "2024-01-27T10:30:00Z",
        },
        {
          _id: "14",
          companyName: "CleanWater Solutions",
          govtIdentifier: "GST357951486357",
          bankAccountNumber: "3579514863579514",
          isActive: true,
          createdAt: "2024-01-28T10:30:00Z",
        },
        {
          _id: "15",
          companyName: "AquaTech Enterprises",
          govtIdentifier: "GST753159486753",
          bankAccountNumber: "7531594867531594",
          isActive: false,
          createdAt: "2024-01-29T10:30:00Z",
        }
      ];

      // Simulate pagination
      const startIndex = paginationModel.page * paginationModel.pageSize;
      const endIndex = startIndex + paginationModel.pageSize;
      const paginatedData = dummyData.slice(startIndex, endIndex);

      const mappedData = paginatedData.map((item, index) => ({
        id: item._id,
        sno: startIndex + index + 1,
        companyName: item.companyName || "-",
        govtIdentifier: item.govtIdentifier || "-",
        bankAccountNumber: item.bankAccountNumber || "-",
        isActive: item.isActive,
        createdAt: item.createdAt,
        ...item,
      }));

      setData(mappedData);
      setRowCount(dummyData.length);
    } catch (error) {
      console.error("Error fetching Company data:", error);
      showErrorMessage(error, "Error fetching Company data", swal);
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
    console.log("Edit Company:", id);
    // Add edit logic here
  };

  const handleDelete = (event, id) => {
    event.preventDefault();
    event.stopPropagation();
    console.log("Delete Company:", id);
    // Add delete logic here
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
      field: "companyName",
      headerName: "Company Name",
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
      field: "govtIdentifier",
      headerName: "Govt Identifier (Code)",
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
      field: "bankAccountNumber",
      headerName: "Bank Account Number",
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
      field: "isActive",
      headerName: "Status",
      width: 120,
      sortable: true,
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
      sortable: true,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          {params.value ? fDate(params.value) : "-"}
        </Typography>
      ),
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
            onClick={(event) => handleEdit(event, params.row.id)}
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
            onClick={(event) => handleDelete(event, params.row.id)}
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
