import React, { lazy, Suspense, useRef } from "react";
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
import TableNoData from "../table-no-data";
import { userRequest } from "src/requestMethod";
import MasterTabs from "../master-tab";
import { headLabel } from "./getHeadLabel";
const AddRequester = lazy(() => import("../Modals/AddRequester"));
const AddAdmin = lazy(() => import("../Modals/AddAdmin"));
const AddSuperAdmin = lazy(() => import("../Modals/AddSuperAdmin"));
const AddApprover = lazy(() => import("../Modals/AddApprover"));

const menuItems = ["Requester", "Approver", "Admin", "Super Admin"];

export default function UserManagementView() {
  const [selectedTab, setSelectedTab] = useState(0);
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState("createdAt");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [editData, setEditData] = useState(null);
  const selectedCategory = menuItems[selectedTab];

  // Ref to store the current AbortController
  const abortControllerRef = useRef(null);

  const handleEdit = (row) => {
    setEditData(row);
    setOpen(true);
  };

  const getAPIURL = () => {
    switch (selectedTab) {
      case 0:
        return "/admin/getAllAdmins?type=REQUESTER";
      case 1:
        return "/admin/getAllAdmins?type=APPROVER";
      case 2:
        return "/admin/getAllAdmins?type=ADMIN";
      case 3:
        return "/admin/getAllAdmins?type=SUPER_ADMIN";
      default:
        return "/admin/getAllAdmins?type=REQUESTER";
    }
  };

  const getData = async () => {
    try {
      // Cancel any previous request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create new AbortController for this request
      const abortController = new AbortController();
      abortControllerRef.current = abortController;

      setLoading(true);
      const res = await userRequest.get(getAPIURL(), {
        params: {
          page: page + 1,
          limit: rowsPerPage,
          search: debouncedSearch,
        },
        signal: abortController.signal,
      });

      // Only update state if request wasn't aborted
      if (!abortController.signal.aborted) {
        setData(res?.data?.data?.admins || []);
        setTotalCount(res?.data?.data?.total || 0);
        setLoading(false);
      }
    } catch (err) {
      // Don't update state if request was aborted
      if (err.name !== "AbortError") {
        console.log("err:", err);
        setLoading(false);
      }
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
  }, [debouncedSearch, page, rowsPerPage]);

  useEffect(() => {
    // Reset data and loading state when switching tabs
    setData([]);
    setTotalCount(0);
    getData();
    setSearch("");
  }, [selectedTab]);

  // Cleanup effect to cancel any pending requests when component unmounts
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const sortableColumns = ["username", "email"];

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
    window.scrollTo(0, 0);
  };

  const handleChangeRowsPerPage = (event) => {
    setPage(0);
    setRowsPerPage(parseInt(event.target.value));
  };

  const handleFilterChange = (field, value) => {
    setPage(0);
    setSearch(value);
  };

  const dataFiltered = applyFilter({
    inputData: data,
    comparator: getComparator(order, orderBy),
    search,
  });

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => {
    setOpen(false);
    setEditData(null);
  };

  let notFound = !dataFiltered.length && !!search;

  return (
    <Container>
      <MasterTabs
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
        menuItems={menuItems}
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
            <span onClick={handleOpen} style={{ color: "#167beb" }}>
              Add {menuItems[selectedTab]}
            </span>
          </div>
        </div>
        {/* {open && (
          <Suspense fallback={<CircularIndeterminate />}>
            <RegionModal
              handleClose={handleClose}
            //   handleOpen={handleOpen}
              open={open}
              getData={getData}
              selectedTab={selectedTab}
            />
          </Suspense>
        )} */}

        {/* Conditionally render modals based on selected tab */}
        {open && selectedTab === 0 && (
          <Suspense fallback={<CircularIndeterminate />}>
            <AddRequester
              handleClose={handleClose}
              open={open}
              getData={getData}
              editData={editData}
            />
          </Suspense>
        )}

        {open && selectedTab === 1 && (
          <Suspense fallback={<CircularIndeterminate />}>
            <AddApprover
              handleClose={handleClose}
              open={open}
              getData={getData}
              editData={editData}
            />
          </Suspense>
        )}
        {open && selectedTab === 2 && (
          <Suspense fallback={<CircularIndeterminate />}>
            <AddAdmin
              handleClose={handleClose}
              open={open}
              getData={getData}
              editData={editData}
            />
          </Suspense>
        )}
        {open && selectedTab === 3 && (
          <Suspense fallback={<CircularIndeterminate />}>
            <AddSuperAdmin
              handleClose={handleClose}
              open={open}
              getData={getData}
              editData={editData}
            />
          </Suspense>
        )}

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
                  headLabel={headLabel(selectedTab)}
                />
                <TableBody>
                  {dataFiltered &&
                    dataFiltered.map((row, index) => (
                      <FormTableRow
                        key={row?._id}
                        sno={page * rowsPerPage + index + 1}
                        rowData={row}
                        columns={headLabel(selectedTab)}
                        onDelete={getData}
                        selectedTab={selectedTab}
                        onEdit={handleEdit}
                      />
                    ))}

                  {notFound && <TableNoData query={search} />}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Scrollbar>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
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
      </Card>
    </Container>
  );
}
