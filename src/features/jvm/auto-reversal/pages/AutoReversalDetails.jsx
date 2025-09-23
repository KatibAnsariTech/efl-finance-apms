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
import { useParams, useLocation } from "react-router-dom";
import { AutoReversalForm } from "../components/AutoReversalDetail";
// import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function AutoReversalDetails() {
  const router = useRouter();
  const { arId } = useParams();
  const location = useLocation();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState("");
  const [arInfo, setArInfo] = useState({});

  // Generate mock detailed data for a specific Auto Reversal
  const generateARDetailData = (arId, count = 8) => {
    // Extract AR number for consistent data
    const arNumber = arId ? arId.replace("ar_", "AR") : "AR001";
    const paddedNumber =
      arNumber.length > 2 ? arNumber : arNumber.padStart(5, "0");

    // Create realistic Auto Reversal entries that balance
    const entries = [
      // Debit entries
      {
        lineType: "Debit Entry",
        accountCode: "5001 - Office Equipment",
        description: "Auto reversal of computer equipment purchase",
        debitAmount: 50000,
        creditAmount: 0,
        reference: "AR-2024-001",
        costCenter: "IT001",
        profitCenter: "MAIN",
        glAccount: "5001",
        postingDate: new Date(2024, 8, 12),
      },
      {
        lineType: "Debit Entry",
        accountCode: "4001 - Office Supplies",
        description: "Auto reversal of stationery purchase",
        debitAmount: 5000,
        creditAmount: 0,
        reference: "AR-2024-002",
        costCenter: "ADMIN001",
        profitCenter: "MAIN",
        glAccount: "4001",
        postingDate: new Date(2024, 8, 12),
      },
      {
        lineType: "Debit Entry",
        accountCode: "4002 - Travel Expenses",
        description: "Auto reversal of travel reimbursement",
        debitAmount: 15000,
        creditAmount: 0,
        reference: "AR-2024-003",
        costCenter: "SALES001",
        profitCenter: "MAIN",
        glAccount: "4002",
        postingDate: new Date(2024, 8, 12),
      },
      {
        lineType: "Debit Entry",
        accountCode: "4003 - Training Expenses",
        description: "Auto reversal of training program",
        debitAmount: 25000,
        creditAmount: 0,
        reference: "AR-2024-004",
        costCenter: "HR001",
        profitCenter: "MAIN",
        glAccount: "4003",
        postingDate: new Date(2024, 8, 12),
      },
      // Credit entries
      {
        lineType: "Credit Entry",
        accountCode: "1002 - Bank Account",
        description: "Auto reversal payment to bank account",
        debitAmount: 0,
        creditAmount: 95000,
        reference: "AR-2024-005",
        costCenter: "FIN001",
        profitCenter: "MAIN",
        glAccount: "1002",
        postingDate: new Date(2024, 8, 12),
      },
    ];

    return entries.map((entry, index) => ({
      id: `${arId}_line_${index + 1}`,
      arNumber: paddedNumber,
      lineNumber: index + 1,
      ...entry,
      createdBy: "System Auto Reversal",
      createdAt: new Date(2024, 8, 12),
    }));
  };

  // Generate AR header information
  const generateARInfo = (arId) => {
    // Extract AR number from ID (assuming format like ar_1, ar_2, etc.)
    const arNumber = arId ? arId.replace("ar_", "AR") : "AR001";
    const paddedNumber =
      arNumber.length > 2 ? arNumber : arNumber.padStart(5, "0");

    return {
      arNumber: paddedNumber,
      documentType: "Auto Reversal Entry",
      status: ["Pending", "Approved", "Rejected"][
        Math.floor(Math.random() * 3)
      ],
      businessArea: "Finance",
      totalDebit: 0, // Will be calculated
      totalCredit: 0, // Will be calculated
      createdDate: new Date(2024, 8, 12),
      createdBy: "System Auto Reversal",
      description: `Auto reversal entry for ${paddedNumber}`,
    };
  };

  const getData = async () => {
    setLoading(true);
    try {
      // Check if we have data passed from the previous page
      let passedData = location.state;
      console.log("Location state:", passedData);
      
      // If location.state is null, try to get data from localStorage
      if (!passedData) {
        const storedData = localStorage.getItem('arDetailData');
        if (storedData) {
          try {
            passedData = JSON.parse(storedData);
            console.log("Retrieved data from localStorage:", passedData);
            // Clear the stored data after retrieving
            localStorage.removeItem('arDetailData');
          } catch (error) {
            console.error("Error parsing stored data:", error);
          }
        }
      }
      
      if (passedData && passedData.rows && Array.isArray(passedData.rows) && passedData.rows.length > 0) {
        // Use the passed data from API directly
        const apiRows = passedData.rows;
        console.log("API Rows received:", apiRows);
        
        // Process API rows data with minimal transformation
        const processedData = apiRows.map((row, index) => ({
          ...row,
          id: row._id || `row_${index}`,
          lineNumber: index + 1,
          postingDate: new Date(row.postingDate || row.createdAt),
          createdAt: new Date(row.createdAt),
        }));
        
        console.log("Processed data:", processedData);

        // Create AR info from passed data
        const arHeaderInfo = {
          requestNo: passedData.requestNo,
          status: passedData.status,
          totalDebit: passedData.totalDebit || 0,
          totalCredit: passedData.totalCredit || 0,
          createdDate: new Date(passedData.createdAt),
        };

        setData(processedData);
        setArInfo(arHeaderInfo);
        setTotalCount(processedData.length);
      } else {
        // Fallback to mock data if no data passed
        console.log("Using fallback mock data - no passedData or rows found");
        const detailData = generateARDetailData(arId, 15);
        const arHeaderInfo = generateARInfo(arId);

      // Calculate totals
      const totalDebit = detailData.reduce(
        (sum, item) => sum + item.debitAmount,
        0
      );
      const totalCredit = detailData.reduce(
        (sum, item) => sum + item.creditAmount,
        0
      );

      arHeaderInfo.totalDebit = totalDebit;
      arHeaderInfo.totalCredit = totalCredit;

      setData(detailData);
      setArInfo(arHeaderInfo);
      setTotalCount(detailData.length);
      }
    } catch (error) {
      console.error("Error fetching AR detail data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (arId) {
      getData();
    }
  }, [arId, page, rowsPerPage]);

  const handleFilterChange = (filterType, value) => {
    if (filterType === "search") {
      setSearch(value);
    }
  };

  const handleFormSubmit = (formData) => {
    console.log("Form submitted with data:", formData);
    // Add your submit logic here
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

  // Custom ColorIndicators component for AR Detail
  const ARDetailColorIndicators = () => {
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
      field: "sNo",
      headerName: "AR No",
      flex: 1,
      minWidth: 120,
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
        const formattedAmount = `₹${Math.abs(amount)?.toLocaleString()}`;
        return amount >= 0 ? formattedAmount : `(${formattedAmount})`;
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
    {
      field: "autoReversal",
      headerName: "Auto Reversal",
      flex: 1,
      minWidth: 120,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Box
          sx={{
            display: "inline-block",
            px: 1,
            py: 0.5,
            borderRadius: 1,
            backgroundColor: params.value === "Y" ? "#e8f5e8" : "#f5f5f5",
            color: params.value === "Y" ? "#2e7d32" : "#666",
            fontSize: "0.75rem",
            fontWeight: 600,
            textTransform: "uppercase",
          }}
        >
          {params.value}
        </Box>
      ),
    },
  ];

  // Apply filtering and sorting to the data
  const dataFiltered = (() => {
    let filteredData = [...data];

    // Apply search filter if search term exists
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
        <title>Auto Reversal Detail</title>
      </Helmet>

      <Container>
        {/* Auto-Reversal Form */}
        <AutoReversalForm onSubmit={handleFormSubmit} />

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
              placeholder="Search by AR No, document type, GL account, remarks, reference..."
            />
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
              {/* <ARDetailColorIndicators /> */}
            </Box>
          </Box>
        </Card>
      </Container>
    </>
  );
}
