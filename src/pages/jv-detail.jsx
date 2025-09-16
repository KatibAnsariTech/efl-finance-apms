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
import { useParams } from "react-router-dom";
// import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function JVDetailPage() {
  const router = useRouter();
  const { jvId } = useParams();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState("");
  const [jvInfo, setJvInfo] = useState({});

  // Generate mock detailed data for a specific JV
  const generateJVDetailData = (jvId, count = 8) => {
    // Extract JV number for consistent data
    const jvNumber = jvId ? jvId.replace("jv_", "JV") : "JV001";
    const paddedNumber =
      jvNumber.length > 2 ? jvNumber : jvNumber.padStart(5, "0");

    // Create realistic JV entries that balance
    const entries = [
      // Debit entries
      {
        lineType: "Debit Entry",
        accountCode: "5001 - Office Equipment",
        description: "Purchase of computer equipment",
        debitAmount: 50000,
        creditAmount: 0,
        reference: "PO-2024-001",
        costCenter: "IT001",
        profitCenter: "MAIN",
        glAccount: "5001",
        postingDate: new Date(2024, 8, 12),
      },
      {
        lineType: "Debit Entry",
        accountCode: "4001 - Office Supplies",
        description: "Stationery and office materials",
        debitAmount: 5000,
        creditAmount: 0,
        reference: "PO-2024-002",
        costCenter: "ADMIN001",
        profitCenter: "MAIN",
        glAccount: "4001",
        postingDate: new Date(2024, 8, 12),
      },
      {
        lineType: "Debit Entry",
        accountCode: "4002 - Travel Expenses",
        description: "Business travel reimbursement",
        debitAmount: 15000,
        creditAmount: 0,
        reference: "TR-2024-001",
        costCenter: "SALES001",
        profitCenter: "MAIN",
        glAccount: "4002",
        postingDate: new Date(2024, 8, 12),
      },
      {
        lineType: "Debit Entry",
        accountCode: "4003 - Training Expenses",
        description: "Employee training program",
        debitAmount: 25000,
        creditAmount: 0,
        reference: "TR-2024-002",
        costCenter: "HR001",
        profitCenter: "MAIN",
        glAccount: "4003",
        postingDate: new Date(2024, 8, 12),
      },
      // Credit entries
      {
        lineType: "Credit Entry",
        accountCode: "1002 - Bank Account",
        description: "Payment from bank account",
        debitAmount: 0,
        creditAmount: 95000,
        reference: "CHQ-001234",
        costCenter: "FIN001",
        profitCenter: "MAIN",
        glAccount: "1002",
        postingDate: new Date(2024, 8, 12),
      },
    ];

    return entries.map((entry, index) => ({
      id: `${jvId}_line_${index + 1}`,
      jvNumber: paddedNumber,
      lineNumber: index + 1,
      ...entry,
      createdBy: "John Doe",
      createdAt: new Date(2024, 8, 12),
    }));
  };

  // Generate JV header information
  const generateJVInfo = (jvId) => {
    // Extract JV number from ID (assuming format like jv_1, jv_2, etc.)
    const jvNumber = jvId ? jvId.replace("jv_", "JV") : "JV001";
    const paddedNumber =
      jvNumber.length > 2 ? jvNumber : jvNumber.padStart(5, "0");

    return {
      jvNumber: paddedNumber,
      documentType: "Journal Entry",
      status: ["Pending", "Approved", "Rejected"][
        Math.floor(Math.random() * 3)
      ],
      businessArea: "Finance",
      totalDebit: 0, // Will be calculated
      totalCredit: 0, // Will be calculated
      createdDate: new Date(2024, 8, 12),
      createdBy: "John Doe",
      description: `Journal voucher entry for ${paddedNumber}`,
    };
  };

  const getData = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const detailData = generateJVDetailData(jvId, 15);
      const jvHeaderInfo = generateJVInfo(jvId);

      // Calculate totals
      const totalDebit = detailData.reduce(
        (sum, item) => sum + item.debitAmount,
        0
      );
      const totalCredit = detailData.reduce(
        (sum, item) => sum + item.creditAmount,
        0
      );

      jvHeaderInfo.totalDebit = totalDebit;
      jvHeaderInfo.totalCredit = totalCredit;

      setData(detailData);
      setJvInfo(jvHeaderInfo);
      setTotalCount(detailData.length);
    } catch (error) {
      console.error("Error fetching JV detail data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (jvId) {
      getData();
    }
  }, [jvId, page, rowsPerPage]);

  const handleFilterChange = (filterType, value) => {
    if (filterType === "search") {
      setSearch(value);
    }
  };

  const handleBack = () => {
    router.push("/jvm/jv-status");
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

  // Custom ColorIndicators component for JV Detail
  const JVDetailColorIndicators = () => {
    const ColorCircle = ({ color, label }) => (
      <Tooltip title={label} arrow>
        <Box
          sx={{
            width: "18px",
            height: "18px",
            backgroundColor: color,
            borderRadius: "50%",
            cursor: "pointer",
            border: "1px solid rgba(0, 0, 0, 0.2)",
          }}
        />
      </Tooltip>
    );

    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          gap: 1,
          marginLeft: 2,
        }}
      >
        <ColorCircle color="#e8f5e8" label="Debit Entry" />
        <ColorCircle color="#fff3e0" label="Credit Entry" />
        <ColorCircle color="#f4f5ba" label="Adjustment" />
      </Box>
    );
  };

  const columns = [
    {
      field: "lineNumber",
      headerName: "Line #",
      flex: 0.5,
      minWidth: 80,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "glAccount",
      headerName: "GL Account",
      flex: 1,
      minWidth: 100,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "accountCode",
      headerName: "Account Description",
      flex: 2,
      minWidth: 200,
      align: "left",
      headerAlign: "center",
    },
    {
      field: "description",
      headerName: "Line Description",
      flex: 2.5,
      minWidth: 250,
      align: "left",
      headerAlign: "center",
    },
    {
      field: "debitAmount",
      headerName: "Debit Amount",
      flex: 1.2,
      minWidth: 130,
      align: "right",
      headerAlign: "center",
      renderCell: (params) =>
        params.value > 0 ? `₹${params.value?.toLocaleString()}` : "-",
    },
    {
      field: "creditAmount",
      headerName: "Credit Amount",
      flex: 1.2,
      minWidth: 130,
      align: "right",
      headerAlign: "center",
      renderCell: (params) =>
        params.value > 0 ? `₹${params.value?.toLocaleString()}` : "-",
    },
    {
      field: "reference",
      headerName: "Reference",
      flex: 1,
      minWidth: 120,
      align: "center",
      headerAlign: "center",
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
      field: "profitCenter",
      headerName: "Profit Center",
      flex: 1,
      minWidth: 120,
      align: "center",
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
  ];

  // Apply filtering and sorting to the data
  const dataFiltered = (() => {
    let filteredData = [...data];

    // Apply search filter if search term exists
    if (search) {
      filteredData = filteredData.filter((item) =>
        [
          "glAccount",
          "accountCode",
          "description",
          "reference",
          "costCenter",
          "profitCenter",
        ].some((field) =>
          item[field]?.toString().toLowerCase().includes(search.toLowerCase())
        )
      );
    }

    // Apply sorting
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
        <title>JV Detail - {jvInfo.jvNumber || "Loading..."}</title>
      </Helmet>

      <Container>
        {/* Header with back button and JV info */}
        {/* <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <IconButton 
            onClick={handleBack} 
            sx={{ 
              mr: 2, 
              color: '#1976d2',
              fontSize: '1.5rem',
              '&:hover': { backgroundColor: 'rgba(25, 118, 210, 0.08)' }
            }}
          >
            ←
          </IconButton>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#333' }}>
              JV Detail - {jvInfo.jvNumber || 'Loading...'}
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, mt: 1, alignItems: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Status: {getStatusChip(jvInfo.status || 'Pending')}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Document Type: {jvInfo.documentType || 'Journal Entry'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Business Area: {jvInfo.businessArea || 'Finance'}
              </Typography>
            </Box>
          </Box>
        </Box> */}

        {/* JV Summary Information */}
        {/* <Card sx={{ mb: 3, p: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold', color: '#1976d2' }}>
            Journal Voucher Summary
          </Typography>
          <Box sx={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
            <Box>
              <Typography variant="body2" color="text.secondary">JV Number</Typography>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                {jvInfo.jvNumber || 'Loading...'}
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">Status</Typography>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                {getStatusChip(jvInfo.status || 'Pending')}
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">Document Type</Typography>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                {jvInfo.documentType || 'Journal Entry'}
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">Created By</Typography>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                {jvInfo.createdBy || 'John Doe'}
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">Created Date</Typography>
              <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                {jvInfo.createdDate ? fDateTime(jvInfo.createdDate) : 'Loading...'}
              </Typography>
            </Box>
          </Box>
        
          <Box sx={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            mt: 3, 
            pt: 2, 
            borderTop: '2px solid #e0e0e0',
            gap: 2
          }}>
            <Box sx={{ textAlign: 'center', flex: 1 }}>
              <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                Total Debit
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#4caf50' }}>
                ₹{jvInfo.totalDebit?.toLocaleString() || '0'}
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center', flex: 1 }}>
              <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                Total Credit
              </Typography>
              <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#f44336' }}>
                ₹{jvInfo.totalCredit?.toLocaleString() || '0'}
              </Typography>
            </Box>
            <Box sx={{ textAlign: 'center', flex: 1 }}>
              <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                Balance
              </Typography>
              <Typography variant="h4" sx={{ 
                fontWeight: 'bold', 
                color: Math.abs((jvInfo.totalDebit || 0) - (jvInfo.totalCredit || 0)) < 1 ? '#4caf50' : '#ff9800'
              }}>
                ₹{Math.abs((jvInfo.totalDebit || 0) - (jvInfo.totalCredit || 0)).toLocaleString()}
              </Typography>
            </Box>
          </Box>
        </Card> */}

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
              placeholder="Search by account, description, reference..."
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
              rows={
                dataFiltered?.map((row, index) => ({
                  id: row.id,
                  ...row,
                })) || []
              }
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
          <Box
            sx={{
              position: "relative",
              height: "52px",
              marginTop: "-52px",
              display: "flex",
              alignItems: "center",
              paddingLeft: "16px",
              zIndex: 0,
              pointerEvents: "none",
            }}
          >
            <Box sx={{ pointerEvents: "auto" }}>
              {/* <JVDetailColorIndicators /> */}
            </Box>
          </Box>
        </Card>
      </Container>
    </>
  );
}
