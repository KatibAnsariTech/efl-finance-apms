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
import { useSearchParams, useLocation } from "react-router-dom";
import { userRequest } from "src/requestMethod";
// import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function JVDetails() {
  const router = useRouter();
  const [searchParams] = useSearchParams();
  const id = searchParams.get('id');
  const location = useLocation();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState("");
  const [jvInfo, setJvInfo] = useState({});
  const [groupId, setGroupId] = useState(null);

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

  // Function to fetch data from API
  const fetchFormByGroupId = async (groupId) => {
    try {
      const response = await userRequest.get(`jvm/getFormByGroupId?groupId=${groupId}`);
      console.log("API Response:", response.data);
      
      // Handle the response structure: { statusCode, data: [...], message, success }
      if (response.data && response.data.success && Array.isArray(response.data.data)) {
        return response.data.data;
      } else {
        throw new Error("Invalid API response format");
      }
    } catch (error) {
      console.error("Error fetching form by group ID:", error);
      throw error;
    }
  };

  const getData = async () => {
    setLoading(true);
    try {
      // Log the id extracted from URL
      console.log("id from URL params:", id);
      
      // Check if we have data passed from the previous page
      let passedData = location.state;
      console.log("Location state:", passedData);
      
      // If location.state is null, try to get data from localStorage
      if (!passedData) {
        const storedData = localStorage.getItem('jvDetailData');
        if (storedData) {
          try {
            passedData = JSON.parse(storedData);
            console.log("Retrieved data from localStorage:", passedData);
            // Clear the stored data after retrieving
            localStorage.removeItem('jvDetailData');
          } catch (error) {
            console.error("Error parsing stored data:", error);
          }
        }
      }
      
      // Check if we have a groupId to fetch from API
      // Use id from URL as groupId if no groupId is provided in passedData
      const currentGroupId = passedData?.groupId || groupId || id;
      
      if (currentGroupId) {
        console.log("Fetching data for groupId:", currentGroupId);
        const apiResponse = await fetchFormByGroupId(currentGroupId);
        
        // Process the API response data
        if (apiResponse && Array.isArray(apiResponse)) {
          const processedData = apiResponse.map((row, index) => ({
            ...row,
            id: row._id || `row_${index}`,
            lineNumber: index + 1,
            postingDate: row.postingDate ? new Date(row.postingDate) : new Date(),
            createdAt: row.createdAt ? new Date(row.createdAt) : new Date(),
            // Map the 'type' field to match our table expectations
            lineType: row.type === 'Debit' ? 'Debit Entry' : 'Credit Entry',
          }));
          
          // Calculate totals from the API data
          const totalDebit = processedData
            .filter(item => item.type === 'Debit')
            .reduce((sum, item) => sum + (item.amount || 0), 0);
          const totalCredit = processedData
            .filter(item => item.type === 'Credit')
            .reduce((sum, item) => sum + (item.amount || 0), 0);
          
          console.log("Processed API data:", processedData);
          console.log("Total Debit:", totalDebit);
          console.log("Total Credit:", totalCredit);
          
          // Create JV info from API data
          const jvHeaderInfo = {
            requestNo: passedData?.requestNo || currentGroupId,
            status: passedData?.status || processedData[0]?.status || "Active",
            totalDebit: totalDebit,
            totalCredit: totalCredit,
            createdDate: new Date(),
          };

          setData(processedData);
          setJvInfo(jvHeaderInfo);
          setTotalCount(processedData.length);
          setGroupId(currentGroupId);
        } else {
          throw new Error("Invalid API response format");
        }
      } else if (passedData && passedData.rows && Array.isArray(passedData.rows) && passedData.rows.length > 0) {
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

        // Create JV info from passed data
        const jvHeaderInfo = {
          requestNo: passedData.requestNo,
          status: passedData.status,
          totalDebit: passedData.totalDebit || 0,
          totalCredit: passedData.totalCredit || 0,
          createdDate: new Date(passedData.createdAt),
        };

        setData(processedData);
        setJvInfo(jvHeaderInfo);
        setTotalCount(processedData.length);
      } else {
        // Fallback to mock data if no data passed
        console.log("Using fallback mock data - no passedData or rows found");
        const detailData = generateJVDetailData(id, 15);
        const jvHeaderInfo = generateJVInfo(id);

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
      }
    } catch (error) {
      console.error("Error fetching JV detail data:", error);
      // Fallback to mock data on error
      const detailData = generateJVDetailData(id, 15);
      const jvHeaderInfo = generateJVInfo(id);

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
        
        // For Debit entries, show positive amount
        // For Credit entries, show negative amount (in parentheses)
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
