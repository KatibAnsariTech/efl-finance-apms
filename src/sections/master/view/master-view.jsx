import React, { lazy, Suspense } from "react";
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
import AddEditSalesOffice from "../Modals/AddEditSalesOffice";
import AddEditSalesGroup from "../Modals/AddEditSalesGroup";
import AddEditSBU from "../Modals/AddEditSBU";
const AddEditRegion = lazy(() => import("../Modals/AddEditRegion"));
const AddEditChannel = lazy(() => import("../Modals/AddEditChannel"));
const AddEditRequestType = lazy(() => import("../Modals/AddEditRequestType"));
const AddEditApproverType = lazy(() => import("../Modals/AddEditApproverType"));
const AddEditApprover = lazy(() => import("../Modals/AddEditApprover"));

const menuItems = [
  "Region",
  "SBU",
  "Channel",
  "Requester Type",
  "Sales Office",
  "Sales Group",
  // "Approver Type",
  // "Approver",
];

export default function MasterView() {
  const [selectedTab, setSelectedTab] = useState(0);
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [order, setOrder] = useState("desc");
  const [orderBy, setOrderBy] = useState("createdAt");
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [editData, setEditData] = useState(null);
  const selectedCategory = menuItems[selectedTab];

  const handleEdit = (row) => {
    setEditData(row);
    setOpen(true);
  };

  const getAPIURL = () => {
    // switch (selectedTab) {
    //   case 0:
    //     return "/admin/getMasters?key=Region";
    //   case 1:
    //     return "/admin/getMasters?key=Warehouse";
    //   case 2:
    //     return "/admin/getMasters?key=Plant";
    //   default:
    //     return "/admin/getMasters?key=Warehouse";
    // }
    if(selectedCategory === "Approver Type"){
      return "/admin/getMasters?key=Region"
    }
    else if(selectedCategory === "Approver"){
      return "/admin/getMasters?key=Region"
    } else{
      return `/admin/getMasters?key=${getKey()}`
    }

  };

    const getKey = () => {
    switch (selectedTab) {
      case 0:
        return "Region";
      case 1:
        return "SBU";
      case 2:
        return "Channel";
      case 3:
        return "RequestType";
      case 4:
        return "SalesOffice";
      case 5:
        return "SalesGroup";
      default:
        return "RequestType";
    }
  };

  const getData = async () => {
    try {
      setLoading(true);
      // const cleanedKey = selectedCategory.split(" ").join("");
      // const res = await userRequest.get(`/admin/getMasters?key=${getKey()}`, {
      const res = await userRequest.get(getAPIURL(), {
        params: {
          page: page + 1,
          limit: rowsPerPage,
          search: debouncedSearch,
        },
      });
      setLoading(false);
      setData(res?.data?.data?.masters);
      setTotalCount(res?.data?.data?.pagination?.total || 0);
    } catch (err) {
      console.log("err:", err);
      setLoading(false);
    } finally {
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
  }, [debouncedSearch, page, rowsPerPage]);

  useEffect(() => {
    getData();
    setSearch("");
  }, [selectedTab]);

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
            <AddEditRegion
              handleClose={handleClose}
              open={open}
              getData={getData}
              editData={editData}
            />
          </Suspense>
        )}

        {open && selectedTab === 1 && (
          <Suspense fallback={<CircularIndeterminate />}>
            <AddEditSBU
              handleClose={handleClose}
              open={open}
              getData={getData}
              editData={editData}
            />
          </Suspense>
        )}
        {open && selectedTab === 2 && (
          <Suspense fallback={<CircularIndeterminate />}>
            <AddEditChannel
              handleClose={handleClose}
              open={open}
              getData={getData}
              editData={editData}
            />
          </Suspense>
        )}
        {open && selectedTab === 3 && (
          <Suspense fallback={<CircularIndeterminate />}>
            <AddEditRequestType
              handleClose={handleClose}
              open={open}
              getData={getData}
              editData={editData}
            />
          </Suspense>
        )}
        {open && selectedTab === 4 && (
          <Suspense fallback={<CircularIndeterminate />}>
            <AddEditSalesOffice
              handleClose={handleClose}
              open={open}
              getData={getData}
              editData={editData}
            />
          </Suspense>
        )}
        {open && selectedTab === 5 && (
          <Suspense fallback={<CircularIndeterminate />}>
            <AddEditSalesGroup
              handleClose={handleClose}
              open={open}
              getData={getData}
              editData={editData}
            />
          </Suspense>
        )}
        {open && selectedTab === 6 && (
          <Suspense fallback={<CircularIndeterminate />}>
            <AddEditApproverType
              handleClose={handleClose}
              open={open}
              getData={getData}
              editData={editData}
            />
          </Suspense>
        )}
        {open && selectedTab === 7 && (
          <Suspense fallback={<CircularIndeterminate />}>
            <AddEditApprover
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
