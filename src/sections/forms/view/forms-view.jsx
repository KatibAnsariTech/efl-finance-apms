import React from "react";
import { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import Table from "@mui/material/Table";
import Container from "@mui/material/Container";
import TableBody from "@mui/material/TableBody";
import TableContainer from "@mui/material/TableContainer";
import TablePagination from "@mui/material/TablePagination";
import Scrollbar from "src/components/scrollbar";
import CircularIndeterminate from "src/utils/loader";
import FormTableToolbar from "../form-table-toolbar";
import FormTableHead from "../form-table-head";
import FormTableRow from "../form-table-row";
import { applyFilter, getComparator } from "src/utils/utils";
import excel from "../../../../public/assets/excel.svg";
import TableNoData from "../table-no-data";
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

export default function FormPage() {
  const { clarificationCount } = useCounts();
  const menuItems = [
    {
      label: `Clarification Needed${
        clarificationCount > 0 ? ` (${clarificationCount})` : ""
      }`,
      value: "myPending",
    },
    { label: "My Requests", value: "myRaised" },
  ];
  const [selectedTab, setSelectedTab] = useState("myPending");
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
  const router = useRouter();

  const [regionData, setRegionData] = React.useState();

  const getRegionData = async () => {
    try {
      const res = await userRequest.get("/admin/getMasters?key=Region");
      setRegionData(res?.data?.data?.masters);
    } catch (err) {
      console.log("err:", err);
    }
  };

  React.useEffect(() => {
    getRegionData();
  }, []);

  React.useEffect(() => {
    setData([]);
  }, [selectedTab]);

  const getData = async () => {
    try {
      setLoading(true);
      // Determine the API endpoint based on selectedTab
      const endpoint =
        selectedTab === "myRaised"
          ? "/admin/getForms?action=myRaised"
          : `/admin/getInitiatedRequestForms`;

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
    { id: "status", label: "Status", minWidth: 180 },
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
      toast.error("Error exporting data. Please try again later.");
    }
  };

  return (
    <Container>
      <FormRequestTabs
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
        menuItems={menuItems}
        clarificationCount={clarificationCount}
      />
      <Card>
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

        <Scrollbar>
          {loading && <CircularIndeterminate />}
          {!loading && (
            <TableContainer sx={{ overflow: "unset" }}>
              <Table sx={{ minWidth: 800 }}>
                <FormTableHead
                  order={order}
                  orderBy={orderBy}
                  rowCount={data?.length}
                  onRequestSort={handleSort}
                  headLabel={headLabel}
                />
                <TableBody>
                  {dataFiltered &&
                    dataFiltered.map((row) => (
                      <FormTableRow
                        key={row?._id}
                        createdAt={row?.createdAt}
                        slNo={row?.slNo}
                        status={row?.status || ""}
                        customerCode={row?.customerCode || ""}
                        channel={row?.channel || ""}
                        region={row?.region || ""}
                        salesOffice={row?.salesOffice || ""}
                        salesGroup={row?.salesGroup || ""}
                        onClick={() => {
                          setSelectedRowData(row);
                          setOpenModal(true);
                        }}
                        onSLClick={() => {
                          router.push(`/request-status/view/${row?._id}`);
                        }}
                        selectedTab={selectedTab}
                      />
                    ))}

                  {notFound && <TableNoData query={search} />}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Scrollbar>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <ColorIndicators />
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
            }}
          >
            {/* <ColorIndicators /> */}
            <TablePagination
              page={page}
              component="div"
              count={totalCount}
              rowsPerPage={rowsPerPage}
              onPageChange={handleChangePage}
              rowsPerPageOptions={[5, 10, 25]}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          </div>
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
