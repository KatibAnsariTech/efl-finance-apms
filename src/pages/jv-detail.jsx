import React from "react";
import { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import { DataGrid } from "@mui/x-data-grid";
import Container from "@mui/material/Container";
import CircularIndeterminate from "src/utils/loader";
import { FormTableToolbar } from "src/components/table";
import { getComparator } from "src/utils/utils";
import excel from "../../public/assets/excel.svg";
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
  const generateJVDetailData = (jvId, count = 10) => {
    const lineTypes = [
      "Debit Entry",
      "Credit Entry",
      "Adjustment Entry",
      "Reversal Entry",
      "Allocation Entry",
    ];
    
    const accountCodes = [
      "1001 - Cash Account",
      "1002 - Bank Account",
      "2001 - Accounts Payable",
      "2002 - Accounts Receivable", 
      "3001 - Revenue Account",
      "4001 - Expense Account",
      "5001 - Asset Account",
      "6001 - Liability Account",
    ];

    const descriptions = [
      "Payment processing fee",
      "Vendor invoice payment",
      "Customer refund processing",
      "Bank charges adjustment",
      "Tax calculation entry",
      "Discount allocation",
      "Currency exchange adjustment",
      "Interest calculation",
    ];

    return Array.from({ length: count }, (_, index) => {
      const lineType = lineTypes[index % lineTypes.length];
      const accountCode = accountCodes[index % accountCodes.length];
      const description = descriptions[index % descriptions.length];
      const isDebit = index % 2 === 0;
      const amount = Math.floor(Math.random() * 50000) + 1000;
      
      return {
        id: `${jvId}_line_${index + 1}`,
        lineNumber: index + 1,
        lineType: lineType,
        accountCode: accountCode,
        description: description,
        debitAmount: isDebit ? amount : 0,
        creditAmount: !isDebit ? amount : 0,
        reference: `REF-${String(index + 1).padStart(3, "0")}`,
        costCenter: `CC${String((index % 5) + 1).padStart(3, "0")}`,
        profitCenter: `PC${String((index % 3) + 1).padStart(3, "0")}`,
        createdAt: new Date(2024, 8, 12 - (index % 10)),
      };
    });
  };

  // Generate JV header information
  const generateJVInfo = (jvId) => {
    // Extract JV number from ID (assuming format like jv_1, jv_2, etc.)
    const jvNumber = jvId ? jvId.replace('jv_', 'JV') : 'JV001';
    const paddedNumber = jvNumber.length > 2 ? jvNumber : jvNumber.padStart(5, '0');
    
    return {
      jvNumber: paddedNumber,
      documentType: "Journal Entry",
      status: ["Pending", "Approved", "Rejected"][Math.floor(Math.random() * 3)],
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
      const totalDebit = detailData.reduce((sum, item) => sum + item.debitAmount, 0);
      const totalCredit = detailData.reduce((sum, item) => sum + item.creditAmount, 0);
      
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
    if (filterType === 'search') {
      setSearch(value);
    }
  };

  const handleExport = () => {
    console.log("Export JV Detail clicked");
  };

  const handleBack = () => {
    router.push('/jv-status');
  };

  const getStatusColor = (status) => {
    const statusColors = {
      'Approved': '#e8f5e8',
      'Rejected': '#ffcdd2',
      'Pending': '#f4f5ba',
    };
    return statusColors[status] || '#f5f5f5';
  };

  const getStatusChip = (status) => {
    return (
      <Box
        sx={{
          display: 'inline-block',
          px: 1.5,
          py: 0.5,
          borderRadius: 1,
          backgroundColor: getStatusColor(status),
          color: '#333',
          fontSize: '0.75rem',
          fontWeight: 600,
          textTransform: 'uppercase',
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
      field: "lineType",
      headerName: "Line Type",
      flex: 1,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "accountCode",
      headerName: "Account Code",
      flex: 1.5,
      minWidth: 180,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "description",
      headerName: "Description",
      flex: 2,
      minWidth: 200,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "debitAmount",
      headerName: "Debit Amount",
      flex: 1,
      minWidth: 120,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => params.value > 0 ? `₹${params.value?.toLocaleString()}` : "-",
    },
    {
      field: "creditAmount",
      headerName: "Credit Amount",
      flex: 1,
      minWidth: 120,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => params.value > 0 ? `₹${params.value?.toLocaleString()}` : "-",
    },
    {
      field: "reference",
      headerName: "Reference",
      flex: 1,
      minWidth: 100,
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
  ];

  // Apply filtering and sorting to the data
  const dataFiltered = (() => {
    let filteredData = [...data];
    
    // Apply search filter if search term exists
    if (search) {
      filteredData = filteredData.filter((item) =>
        ['lineType', 'accountCode', 'description', 'reference']
          .some(field => 
            item[field]?.toString().toLowerCase().includes(search.toLowerCase())
          )
      );
    }
    
    // Apply sorting
    const comparator = getComparator('asc', 'lineNumber');
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
        <title>JV Detail - {jvInfo.jvNumber || 'Loading...'}</title>
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

        {/* Summary Cards */}
        {/* <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
          <Card sx={{ p: 2, flex: 1 }}>
            <Typography variant="h6" color="primary">Total Debit</Typography>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#4caf50' }}>
              ₹{jvInfo.totalDebit?.toLocaleString() || '0'}
            </Typography>
          </Card>
          <Card sx={{ p: 2, flex: 1 }}>
            <Typography variant="h6" color="primary">Total Credit</Typography>
            <Typography variant="h4" sx={{ fontWeight: 'bold', color: '#f44336' }}>
              ₹{jvInfo.totalCredit?.toLocaleString() || '0'}
            </Typography>
          </Card>
          <Card sx={{ p: 2, flex: 1 }}>
            <Typography variant="h6" color="primary">Balance</Typography>
            <Typography variant="h4" sx={{ 
              fontWeight: 'bold', 
              color: Math.abs((jvInfo.totalDebit || 0) - (jvInfo.totalCredit || 0)) < 1 ? '#4caf50' : '#ff9800'
            }}>
              ₹{Math.abs((jvInfo.totalDebit || 0) - (jvInfo.totalCredit || 0)).toLocaleString()}
            </Typography>
          </Card>
        </Box> */}

        <Card sx={{ mt: 2, p: 2 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginRight: "20px",
            }}
          >
            <FormTableToolbar
              search={search}
              onFilterChange={handleFilterChange}
              placeholder="Search JV entries..."
            />
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                fontSize: "0.8rem",
                fontWeight: "bold",
                cursor: "pointer",
                gap: "8px",
              }}
            >
              <span onClick={handleExport} style={{ color: "#167beb" }}>
                Export{" "}
                <img src={excel} style={{ width: "1.2rem", marginLeft: "5px" }} />
              </span>
            </div>
          </div>

          <Box sx={{ width: "100%" }}>
            <DataGrid
              rows={dataFiltered?.map((row, index) => ({
                id: row.id,
                ...row,
              })) || []}
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
              getRowClassName={(params) => {
                const lineType = params.row.lineType?.toLowerCase();
                if (lineType?.includes('debit')) return 'row-debit';
                if (lineType?.includes('credit')) return 'row-credit';
                if (lineType?.includes('adjustment')) return 'row-adjustment';
                return '';
              }}
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
                "& .MuiDataGrid-row.row-debit": {
                  backgroundColor: "#e8f5e8 !important",
                },
                "& .MuiDataGrid-row.row-credit": {
                  backgroundColor: "#fff3e0 !important",
                },
                "& .MuiDataGrid-row.row-adjustment": {
                  backgroundColor: "#f4f5ba !important",
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
              <JVDetailColorIndicators />
            </Box>
          </Box>
        </Card>
      </Container>
    </>
  );
}
