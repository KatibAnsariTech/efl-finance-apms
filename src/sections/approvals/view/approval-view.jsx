import React from "react";
import { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import { DataGrid } from "@mui/x-data-grid";
import Container from "@mui/material/Container";
import CircularIndeterminate from "src/utils/loader";
import FormTableToolbar from "../form-table-toolbar";
import { applyFilter, getComparator } from "src/utils/utils";
import excel from "../../../../public/assets/excel.svg";
import { publicRequest, userRequest } from "src/requestMethod";
import FilterModal from "../FilterModal";
import FormRequestTabs from "./form-request-tabs";
import { action } from "src/theme/palette";
import { format } from "date-fns";
import { useRouter } from "src/routes/hooks";
import ColorIndicators from "../colorIndicator";
import { useCounts } from "src/contexts/CountsContext";
import { Box } from "@mui/material";
import RequestModal from "../RequestModal";
import { fDateTime } from "src/utils/format-time";
import swal from 'sweetalert';
import { showErrorMessage } from 'src/utils/errorUtils';

export default function ApprovalPage() {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState("myAssigned");
  const [data, setData] = useState([]);
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [limit, setLimit] = useState(5);
  const [page, setPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState("createdAt");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [region, setRegion] = useState();
  const [status, setStatus] = useState();
  const [refund, setRefund] = useState();
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();
  const [openModal, setOpenModal] = useState(false);

  const [regionData, setRegionData] = React.useState();
  const { approvalCount } = useCounts();

  // Status color mapping
  const getStatusColor = (status) => {
    const normalizedStatus = (status || "").toLowerCase();
    switch (normalizedStatus) {
      case "pending":
        return "#f4f5ba";
      case "declined":
        return "#e6b2aa";
      case "approved":
        return "#baf5c2";
      case "clarification needed":
        return "#9be7fa";
      default:
        return "white";
    }
  };
  const menuItems = [
    { label: `Pending With Me${approvalCount > 0 ? ` (${approvalCount})` : ''}`, value: "myAssigned" },
    // { label: `Pending With Me`, value: "myAssigned" },
    { label: "All", value: "all" },
  ];

  const getRegionData = async () => {
    try {
      const res = await userRequest.get("/admin/getMasters?key=Region");
      setRegionData(res?.data?.data?.masters);
    } catch (err) {
      console.log("err:", err);
    }
  };

  useEffect(() => {
    getRegionData();
  }, []);

  const getData = async () => {
    try {
      setLoading(true);
      // Determine the API endpoint based on selectedTab
      // const endpoint =
      //   selectedTab === "myPending"
      //     ? "/admin/getPendingRequestForms?action=myPending"
      //     : `/admin/getForms?action=${selectedTab}`;
      const endpoint = `/admin/getPendingRequestForms?action=${selectedTab}`;
      const res = await userRequest.get(endpoint, {
        params: {
          page: page + 1,
          limit: rowsPerPage,
          search: debouncedSearch,
          sort: orderBy,
          // order: order,
          region: region,
          status,
          refund: refund,
          startDate: startDate,
          endDate: endDate,
        },
      });
      setLoading(false);
      setData(res?.data?.data);
      setTotalCount(res?.data?.data?.totalForms || 0);
    } catch (err) {
      console.log("err:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 600);

    return () => clearTimeout(handler);
  }, [search]);

  useEffect(() => {
    getData();
  }, [
    debouncedSearch,
    page,
    rowsPerPage,
    region,
    status,
    refund,
    startDate,
    endDate,
  ]);

  useEffect(() => {
    getData();
    setSearch("");
  }, [selectedTab]);

  const sortableColumns = ["createdAt", "customerName"];

  const handleSort = (event, id) => {
    if (sortableColumns.includes(id)) {
      const isAsc = orderBy === id && order === "asc";
      setOrder(isAsc ? "desc" : "asc");
      setOrderBy(id);
    }
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
    setRowsPerPage(rowsPerPage);
    setLimit(rowsPerPage);
    window.scrollTo(0, 0);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setLimit(parseInt(event.target.value));
    setRowsPerPage(parseInt(event.target.value));
  };

  const handleFilterChange = (field, value) => {
    setPage(0);
    setSearch(value);
  };

  const dataFiltered = applyFilter({
    inputData: data?.forms,
    comparator: getComparator(order, orderBy),
    search,
  });

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  let notFound = !dataFiltered.length;
  const headLabel = [
    { id: "createdAt", label: "Requested Date", minWidth: 200, sortable: true },
    { id: "slNo", label: "Request No.", minWidth: 160 },
    { id: "status", label: "Status", minWidth: 130 },
    { id: "customerCode", label: "Customer Code", minWidth: 140 },
    { id: "channel", label: "Channel", minWidth: 110 },
    { id: "region", label: "Region", minWidth: 110 },
    { id: "salesOffice", label: "Sales Office", minWidth: 130 },
    { id: "salesGroup", label: "Sales Group", minWidth: 130 },
    // { id: "financialYear", label: "Financial Year", minWidth: 130 },
    // { id: "month", label: "Month", minWidth: 110 },
    // { id: "amount", label: "Amount", minWidth: 120 },
    // { id: " pendingWith,", label: "Pending With", minWidth: 120 },4
  ];

  const params = new URLSearchParams({
    search: debouncedSearch,
    region: region || "",
    status: status || "",
    refund: refund || "",
    startDate: startDate || "",
    endDate: endDate || "",
    action: selectedTab || "",
  });

  const handleExport = async () => {
    try {
      const endpoint =
        selectedTab === "myPending"
          ? "/admin/exportPendingRequestFormsToExcel"
          : `/admin/exportFormsToExcel?${params.toString()}`;
      const exportResponse = await userRequest.get(endpoint, {
        responseType: "blob",
      });

      // Create a Blob object from the response data
      const blob = new Blob([exportResponse.data], {
        type: "application/octet-stream",
      });

      // Format date and time
      const now = new Date();
      const formattedDateTime = format(now, "yyyy-MM-dd_HH-mm-ss");

      // Capitalize tab name
      const tabLabel = selectedTab
        .replace(/([A-Z])/g, " $1")
        .replace(/^./, (str) => str.toUpperCase())
        .trim()
        .replace(/\s+/g, "_");

      const filename = `${tabLabel}_Export_${formattedDateTime}.xlsx`;

      // Create a URL for the blob and initiate download
      const downloadUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error exporting data:", error);
      showErrorMessage(error, "Error exporting data. Please try again later.", swal);
    }
  };

  const calculatePendingDays = (data) => {
    if (!data || !data.requestDetails) {
      return "N/A";
    }

    const currentDate = new Date();
    const steps = data.requestDetails;
    let lastApprovedStep = -1;
    let oldestPendingDate = null;

    // Identify the last approved step
    Object.keys(steps)
      .filter((key) => key.startsWith("step"))
      .sort(
        (a, b) =>
          parseInt(a.replace("step", ""), 10) -
          parseInt(b.replace("step", ""), 10)
      )
      .forEach((stepKey) => {
        const stepData = steps[stepKey];

        if (stepData.some((item) => item.status === "Approved")) {
          lastApprovedStep = parseInt(stepKey.replace("step", ""), 10);
        }
      });

    // Find the earliest pending step AFTER the last approved step
    Object.keys(steps)
      .filter((key) => key.startsWith("step"))
      .sort(
        (a, b) =>
          parseInt(a.replace("step", ""), 10) -
          parseInt(b.replace("step", ""), 10)
      )
      .forEach((stepKey) => {
        const stepNumber = parseInt(stepKey.replace("step", ""), 10);
        const stepData = steps[stepKey];

        // Skip steps that were approved already
        if (stepNumber <= lastApprovedStep) {
          return;
        }

        stepData.forEach((item) => {
          if (item.status === "Pending") {
            const stepDate = new Date(item.createdAt);
            if (!oldestPendingDate || stepDate < oldestPendingDate) {
              oldestPendingDate = stepDate;
            }
          }
        });
      });

    // Calculate pending days
    if (oldestPendingDate) {
      return Math.floor(
        (currentDate - oldestPendingDate) / (1000 * 60 * 60 * 24)
      );
    }

    return "N/A";
  };

  return (
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
            {/* {!["myAssigned", "myPending"].includes(selectedTab) && (
              <>
                <span onClick={handleOpen} style={{ color: "#167beb" }}>
                  Filter
                </span>
                |
              </>
            )}
            <span onClick={handleExport} style={{ color: "#167beb" }}>
              Export{" "}
              <img src={excel} style={{ width: "1.2rem", marginLeft: "5px" }} />
            </span> */}
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
            })) || []}
            columns={[
              {
                field: "createdAt",
                headerName: "Requested Date",
                flex: 1,
                minWidth: 200,
                align: "center",
                headerAlign: "center",
                renderCell: (params) => fDateTime(params.value),
              },
              {
                field: "slNo",
                headerName: "Request No.",
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
                    onClick={() => router.push(`/approvals/view/${params.row._id}`)}
                  >
                    {params.value}
                  </Box>
                ),
              },
              {
                field: "status",
                headerName: "Status",
                flex: 1,
                minWidth: 130,
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
                    onClick={() => {
                      setSelectedRowData(params.row);
                      setOpenModal(true);
                    }}
                  >
                    {params.value}
                  </Box>
                ),
              },
              {
                field: "customerCode",
                headerName: "Customer Code",
                flex: 1,
                minWidth: 140,
                align: "center",
                headerAlign: "center",
              },
              {
                field: "channel",
                headerName: "Channel",
                flex: 1,
                minWidth: 110,
                align: "center",
                headerAlign: "center",
              },
              {
                field: "region",
                headerName: "Region",
                flex: 1,
                minWidth: 110,
                align: "center",
                headerAlign: "center",
              },
              {
                field: "salesOffice",
                headerName: "Sales Office",
                flex: 1,
                minWidth: 140,
                align: "center",
                headerAlign: "center",
              },
              {
                field: "salesGroup",
                headerName: "Sales Group",
                flex: 1,
                minWidth: 140,
                align: "center",
                headerAlign: "center",
              },
            ]}
            getRowId={(row) => row?.id}
            loading={loading}
            pagination
            paginationMode="server"
            rowCount={totalCount}
            pageSizeOptions={[5, 10, 25]}
            autoHeight
            getRowClassName={(params) => {
              return params.row.backgroundColor ? "custom-row" : "";
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
              "& .custom-row": {
                backgroundColor: (theme) => theme.palette.background.paper,
              },
              "& .MuiDataGrid-row:hover": {
                backgroundColor: (theme) => theme.palette.action.hover,
              },
            }}
          />
        </Box>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <ColorIndicators />
        </Box>
      </Card>
      <RequestModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        rowData={selectedRowData}
        getRequestData={getData}
        selectedTab={selectedTab}
      />
    </Container>
  );
}
