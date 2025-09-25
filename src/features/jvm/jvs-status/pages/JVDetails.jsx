import React from "react";
import { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import { DataGrid } from "@mui/x-data-grid";
import Container from "@mui/material/Container";
import CircularIndeterminate from "src/utils/loader";
import { FormTableToolbar } from "src/components/table";
import { getComparator } from "src/utils/utils";
import { useRouter } from "src/routes/hooks";
import { Box, Tooltip, Typography, IconButton } from "@mui/material";
import { fDateTime } from "src/utils/format-time";
import { Helmet } from "react-helmet-async";
import { useSearchParams } from "react-router-dom";
import { userRequest } from "src/requestMethod";

export default function JVDetails() {
  const router = useRouter();
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState("");
  const [jvInfo, setJvInfo] = useState({});



  const getData = async () => {
    setLoading(true);
    try {
      if (!id) return;

      const response = await userRequest.get(`jvm/getFormByGroupId?groupId=${id}`);
      const { items } = response.data.data;
      
      const data = items.map((item, index) => ({
        ...item,
        id: item._id,
        lineNumber: index + 1,
      }));

      setData(data);
      setTotalCount(data.length);
    } catch (error) {
      console.error("Error fetching JV detail data:", error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      getData();
    }
  }, [id, page, rowsPerPage]);

  const handleFilterChange = (filterType, value) => {
    if (filterType === "search") {
      setSearch(value);
    }
  };

  const handleBack = () => {
    router.push("/jvm/requested-jvs");
  };

  const getStatusColor = (status) => {
    const statusColors = {
      Approved: "#e8f5e8",
      Rejected: "#ffcdd2",
      Pending: "#f4f5ba",
    };
    return statusColors[status] || "#f5f5f5";
  };

  const getStatusChip = (status) => {
    return (
      <Box
        sx={{
          display: "inline-block",
          px: 1.5,
          py: 0.5,
          borderRadius: 1,
          backgroundColor: getStatusColor(status),
          color: "#333",
          fontSize: "0.75rem",
          fontWeight: 600,
          textTransform: "uppercase",
        }}
      >
        {status}
      </Box>
    );
  };


  const columns = [
    {
      field: "lineNumber",
      headerName: "S No",
      flex: 0.5,
      minWidth: 80,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "type",
      headerName: "Type",
      flex: 0.8,
      minWidth: 100,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "documentType",
      headerName: "Document Type",
      flex: 1,
      minWidth: 120,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "documentDate",
      headerName: "Document Date",
      flex: 1,
      minWidth: 120,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => fDateTime(params.value),
    },
    {
      field: "businessArea",
      headerName: "Business Area",
      flex: 1,
      minWidth: 120,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "accountType",
      headerName: "Account Type",
      flex: 1,
      minWidth: 120,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "postingKey",
      headerName: "Posting Key",
      flex: 1,
      minWidth: 120,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "vendorCustomerGLNumber",
      headerName: "GL Number",
      flex: 1,
      minWidth: 120,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "vendorCustomerGLName",
      headerName: "GL Name",
      flex: 2,
      minWidth: 200,
      align: "left",
      headerAlign: "center",
    },
    {
      field: "amount",
      headerName: "Amount",
      flex: 1.2,
      minWidth: 130,
      align: "right",
      headerAlign: "center",
      renderCell: (params) => {
        const amount = params.value;
        const type = params.row.type;
        const formattedAmount = `₹${Math.abs(amount)?.toLocaleString()}`;
        
        if (type === 'Debit') {
          return formattedAmount;
        } else {
          return `(${formattedAmount})`;
        }
      },
    },
    {
      field: "assignment",
      headerName: "Assignment",
      flex: 1,
      minWidth: 120,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "profitCenter",
      headerName: "Profit Center",
      flex: 1,
      minWidth: 120,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "specialGLIndication",
      headerName: "Special GL",
      flex: 1,
      minWidth: 100,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "referenceNumber",
      headerName: "Reference",
      flex: 1,
      minWidth: 120,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "remarks",
      headerName: "Remarks",
      flex: 2,
      minWidth: 200,
      align: "left",
      headerAlign: "center",
    },
    {
      field: "postingDate",
      headerName: "Posting Date",
      flex: 1,
      minWidth: 120,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => fDateTime(params.value),
    },
    {
      field: "costCenter",
      headerName: "Cost Center",
      flex: 1,
      minWidth: 120,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "personalNumber",
      headerName: "Personal No.",
      flex: 1,
      minWidth: 120,
      align: "center",
      headerAlign: "center",
    },
  ];

  const dataFiltered = (() => {
    let filteredData = [...data];

    if (search) {
      filteredData = filteredData.filter((item) =>
        [
          "sNo",
          "documentType",
          "businessArea",
          "accountType",
          "postingKey",
          "vendorCustomerGLNumber",
          "vendorCustomerGLName",
          "assignment",
          "profitCenter",
          "specialGLIndication",
          "referenceNumber",
          "remarks",
          "costCenter",
          "personalNumber",
          "autoReversal",
        ].some((field) =>
          item[field]?.toString().toLowerCase().includes(search.toLowerCase())
        )
      );
    }

    const comparator = getComparator("asc", "lineNumber");
    const stabilizedThis = filteredData.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });

    return stabilizedThis.map((el) => el[0]);
  })();

  return (
    <>
      <Helmet>
        <title>JV Detail</title>
      </Helmet>

      <Container>
        <Card sx={{ mt: 2, p: 2 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <FormTableToolbar
              search={search}
              onFilterChange={handleFilterChange}
              placeholder="Search by JV No, document type, GL account, remarks, reference..."
            />
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                position: "relative",
                "&:hover .close-tooltip": { opacity: 1, pointerEvents: "auto" },
                mr: 1,
              }}
              onClick={handleBack}
            >
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="#e53935"
                stroke="#fff"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ borderRadius: "50%" }}
              >
                <circle cx="12" cy="12" r="12" fill="#e53935" />
                <line x1="8" y1="8" x2="16" y2="16" />
                <line x1="16" y1="8" x2="8" y2="16" />
              </svg>
              <Box
                className="close-tooltip"
                sx={{
                  position: "absolute",
                  top: 0,
                  right: 35,
                  background: "#12368d",
                  color: "#fff",
                  px: 1.5,
                  py: 0.5,
                  borderRadius: 1,
                  fontSize: "0.85rem",
                  whiteSpace: "nowrap",
                  opacity: 0,
                  pointerEvents: "none",
                  transition: "opacity 0.2s",
                  zIndex: 10,
                }}
              >
                Back to JV Status
              </Box>
            </Box>
          </Box>

          <Box sx={{ width: "100%" }}>
            <DataGrid
              rows={dataFiltered || []}
              columns={columns}
              getRowId={(row) => row?.id}
              loading={loading}
              pagination
              paginationMode="client"
              rowCount={dataFiltered.length}
              paginationModel={{ page: page, pageSize: rowsPerPage }}
              onPaginationModelChange={(newModel) => {
                setPage(newModel.page);
                setRowsPerPage(newModel.pageSize);
              }}
              pageSizeOptions={[5, 10, 25, 50]}
              autoHeight
              disableRowSelectionOnClick
              sx={{
                "& .MuiDataGrid-cell": {
                  justifyContent: "center",
                  display: "flex",
                  alignItems: "center",
                  "&:focus": {
                    outline: "none",
                  },
                  "&:focus-visible": {
                    outline: "none",
                  },
                },
                "& .MuiDataGrid-columnHeaders": {
                  backgroundColor: "#f5f6f8",
                  fontWeight: "bold",
                  color: "#637381",
                },
                "& .MuiDataGrid-columnHeaderTitle": {
                  width: "100%",
                  textAlign: "center",
                },
                "& .MuiDataGrid-row": {
                  "&:focus": {
                    outline: "none",
                  },
                  "&:focus-visible": {
                    outline: "none",
                  },
                },
                "& .MuiDataGrid-row": {
                  borderBottom: "1px solid #e0e0e0",
                },
                "& .MuiDataGrid-row:hover": {
                  backgroundColor: (theme) => theme.palette.action.hover,
                  opacity: 0.8,
                },
              }}
            />
          </Box>
        </Card>
      </Container>
    </>
  );
}
