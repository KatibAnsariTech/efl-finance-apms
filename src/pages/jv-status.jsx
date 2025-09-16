import React from "react";
import { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import { DataGrid } from "@mui/x-data-grid";
import Container from "@mui/material/Container";
import CircularIndeterminate from "src/utils/loader";
import { FormTableToolbar } from "src/components/table";
import { applyFilter, getComparator } from "src/utils/utils";
import excel from "../../public/assets/excel.svg";
import { publicRequest, userRequest } from "src/requestMethod";
import FilterModal from "../sections/approvals/FilterModal";
import FormRequestTabs from "../sections/approvals/view/form-request-tabs";
import { action } from "src/theme/palette";
import { format } from "date-fns";
import { useRouter } from "src/routes/hooks";
import ColorIndicators from "../sections/approvals/colorIndicator";
import { useCounts } from "src/contexts/CountsContext";
import { Box } from "@mui/material";
import RequestModal from "../sections/approvals/RequestModal";
import { fDateTime } from "src/utils/format-time";
import swal from 'sweetalert';
import { showErrorMessage } from 'src/utils/errorUtils';
import { Helmet } from "react-helmet-async";

export default function JVStatusPage() {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [limit, setLimit] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState("");
  const [selectedTab, setSelectedTab] = useState("all");
  const [open, setOpen] = useState(false);
  const [region, setRegion] = useState("");
  const [status, setStatus] = useState("");
  const [refund, setRefund] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [regionData, setRegionData] = useState([]);
  const [approvalCount, setApprovalCount] = useState(0);

  const menuItems = [
    { label: "All", value: "all" },
  ];

  // Generate mock data for JV Status
  const generateMockData = (startIndex, count) => {
    const documentTypes = [
      "Invoice",
      "Credit Note",
      "Journal Entry",
      "Payment Voucher",
      "Receipt Voucher",
    ];
    const businessAreas = [
      "Sales",
      "Finance",
      "Operations",
      "Procurement",
      "Marketing",
    ];
    const accountTypes = ["Asset", "Liability", "Expense", "Revenue", "Equity"];
    const postingKeys = [
      "40 - Customer Invoice",
      "50 - Vendor Invoice",
      "11 - Cash Receipt",
      "21 - Cash Payment",
      "31 - Bank Receipt",
    ];
    const statuses = ["Draft", "Submitted", "Approved", "Rejected", "Pending", "In Review"];
    const companies = [
      "ABC Company Ltd",
      "XYZ Corporation",
      "DEF Industries",
      "GHI Suppliers",
      "JKL Enterprises",
      "MNO Solutions",
      "PQR Systems",
      "STU Technologies",
    ];

    return Array.from({ length: count }, (_, index) => {
      const globalIndex = startIndex + index;
      const docType = documentTypes[globalIndex % documentTypes.length];
      const businessArea = businessAreas[globalIndex % businessAreas.length];
      const accountType = accountTypes[globalIndex % accountTypes.length];
      const postingKey = postingKeys[globalIndex % postingKeys.length];
      const status = statuses[globalIndex % statuses.length];
      const company = companies[globalIndex % companies.length];
      const amount = Math.floor(Math.random() * 200000) + 10000;
      const date = new Date(2024, 8, 12 - (globalIndex % 30)); // Random dates in September 2024

      return {
        _id: `jv_${globalIndex + 1}`,
        slNo: `JV${String(globalIndex + 1).padStart(3, "0")}`,
        documentType: docType,
        documentDate: date,
        postingDate: date,
        businessArea: businessArea,
        accountType: accountType,
        postingKey: postingKey,
        vendorCustomerGLName: company,
        vendorCustomerGLNumber: `GL${String(globalIndex + 1).padStart(3, "0")}`,
        amount: amount,
        assignment: `Assignment ${globalIndex + 1}`,
        costCenter: `CC${String(globalIndex + 1).padStart(3, "0")}`,
        profitCenter: `PC${String(globalIndex + 1).padStart(3, "0")}`,
        specialGLIndication: `SGI${String(globalIndex + 1).padStart(3, "0")}`,
        referenceNumber: `REF${String(globalIndex + 1).padStart(3, "0")}`,
        personalNumber: `PN${String(globalIndex + 1).padStart(3, "0")}`,
        remarks: `Sample journal voucher entry ${
          globalIndex + 1
        } for ${docType.toLowerCase()} processing`,
        autoReversal: globalIndex % 3 === 0 ? "Y" : "N",
        status: status,
        createdAt: date,
        sno: globalIndex + 1,
      };
    });
  };

  const getData = async () => {
    setLoading(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      const newData = generateMockData(
        page * rowsPerPage,
        rowsPerPage
      );
      
      setData(newData);
      setTotalCount(1000); // Mock total count
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, [page, rowsPerPage, selectedTab]);

  const handleFilterChange = (filterType, value) => {
    if (filterType === 'search') {
      setSearch(value);
    }
  };

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleExport = () => {
    // Export functionality
    console.log("Export clicked");
  };

  const getStatusColor = (status) => {
    const statusColors = {
      'Draft': '#e3f2fd',
      'Submitted': '#fff3e0',
      'Approved': '#e8f5e8',
      'Rejected': '#ffebee',
      'Pending': '#f4f5ba',
      'In Review': '#e1f5fe',
    };
    return statusColors[status] || '#f5f5f5';
  };

  const getStatusChip = (status) => {
    const statusConfig = {
      Draft: { color: "default", label: "Draft" },
      Submitted: { color: "info", label: "Submitted" },
      Approved: { color: "success", label: "Approved" },
      Rejected: { color: "error", label: "Rejected" },
      Pending: { color: "warning", label: "Pending" },
      "In Review": { color: "primary", label: "In Review" },
    };

    const config = statusConfig[status] || { color: "default", label: status };
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
        {config.label}
      </Box>
    );
  };

  const columns = [
    {
      field: "createdAt",
      headerName: "Created Date",
      flex: 1,
      minWidth: 200,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => fDateTime(params.value),
    },
    {
      field: "slNo",
      headerName: "JV No.",
      flex: 1,
      minWidth: 160,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => (
        <Box
          sx={{
            cursor: "pointer",
            color: "#1976d2",
            textDecoration: "underline",
            textDecorationThickness: "2px",
            textUnderlineOffset: "4px",
            fontWeight: 600,
            "&:hover": { color: "#1565c0" },
          }}
          onClick={() => router.push(`/jvm/jv-status/view/${params.row._id}`)}
        >
          {params.value}
        </Box>
      ),
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      minWidth: 120,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => getStatusChip(params.value),
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
      field: "businessArea",
      headerName: "Business Area",
      flex: 1,
      minWidth: 120,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "vendorCustomerGLName",
      headerName: "Vendor/Customer/GL Name",
      flex: 1,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "amount",
      headerName: "Amount",
      flex: 1,
      minWidth: 100,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => `₹${params.value?.toLocaleString() || "0"}`,
    },
    {
      field: "referenceNumber",
      headerName: "Reference Number",
      flex: 1,
      minWidth: 120,
      align: "center",
      headerAlign: "center",
    },
  ];

  const dataFiltered = applyFilter(data, getComparator('desc', 'createdAt'), search, [
    'documentType',
    'businessArea',
    'vendorCustomerGLName',
    'referenceNumber',
    'slNo',
  ]);

  return (
    <>
      <Helmet>
        <title>JV's Status</title>
      </Helmet>
      
      <Container>
        <FormRequestTabs
          selectedTab={selectedTab}
          setSelectedTab={setSelectedTab}
          menuItems={menuItems}
          approvalCount={approvalCount}
        />
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
              placeholder="Search JVs..."
            />
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                alignItems: "center",
                fontSize: "0.8rem",
                fontWeight: "bold",
                cursor: "pointer",
                gap: "8px",
              }}
            >
              <span onClick={handleOpen} style={{ color: "#167beb" }}>
                Filter
              </span>
              |
              <span onClick={handleExport} style={{ color: "#167beb" }}>
                Export{" "}
                <img src={excel} style={{ width: "1.2rem", marginLeft: "5px" }} />
              </span>
            </div>
          </div>

          <FilterModal
            handleClose={handleClose}
            handleOpen={handleOpen}
            open={open}
            setRegion={setRegion}
            setStatus={setStatus}
            setRefund={setRefund}
            setStartDate={setStartDate}
            setEndDate={setEndDate}
            regionData={regionData}
          />

          <Box sx={{ width: "100%" }}>
            <DataGrid
              rows={dataFiltered?.map((row, index) => ({
                id: row._id,
                ...row,
                backgroundColor: getStatusColor(row.status),
                style: {
                  backgroundColor: getStatusColor(row.status),
                },
              })) || []}
              columns={columns}
              getRowId={(row) => row?.id}
              loading={loading}
              pagination
              paginationMode="server"
              rowCount={totalCount}
              paginationModel={{ page: page, pageSize: rowsPerPage }}
              onPaginationModelChange={(newModel) => {
                setPage(newModel.page);
                setRowsPerPage(newModel.pageSize);
                setLimit(newModel.pageSize);
              }}
              pageSizeOptions={[5, 10, 25, 50]}
              autoHeight
              getRowClassName={(params) => {
                const status = params.row.status?.toLowerCase();
                if (status === 'pending') return 'row-pending';
                if (status === 'rejected') return 'row-rejected';
                if (status === 'approved') return 'row-approved';
                if (status === 'draft') return 'row-draft';
                if (status === 'submitted') return 'row-submitted';
                if (status === 'in review') return 'row-in-review';
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
                "& .MuiDataGrid-row.row-pending": {
                  backgroundColor: "#f4f5ba !important",
                },
                "& .MuiDataGrid-row.row-rejected": {
                  backgroundColor: "#e6b2aa !important",
                },
                "& .MuiDataGrid-row.row-approved": {
                  backgroundColor: "#baf5c2 !important",
                },
                "& .MuiDataGrid-row.row-draft": {
                  backgroundColor: "#e3f2fd !important",
                },
                "& .MuiDataGrid-row.row-submitted": {
                  backgroundColor: "#fff3e0 !important",
                },
                "& .MuiDataGrid-row.row-in-review": {
                  backgroundColor: "#e1f5fe !important",
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
