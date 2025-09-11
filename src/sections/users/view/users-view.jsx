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
import { userRequest } from "src/requestMethod";
import AddUserModal from "../AddUserModal";
import UsersTabs from "../users-tab";
import { set } from "lodash";

const menuItems = ["Admin User", "Normal User"];

export default function UsersView() {
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

  const getData = async () => {
    try {
      setLoading(true);
      const res = await userRequest.get("admin/getAllAdmins", {
        params: {
          page: page + 1,
          limit: rowsPerPage,
          search: debouncedSearch,
          type: selectedTab === 0 ? "SUPER_ADMIN" : "ADMIN",
        },
      });
      setLoading(false);
      setData(res?.data?.data);
      setTotalCount(res?.data?.data?.total || 0);
    } catch (err) {
      console.log("err:", err);
      setLoading(false);
    }finally{
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
    inputData: data?.admins,
    comparator: getComparator(order, orderBy),
    search,
  });

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  let notFound = !dataFiltered.length && !!search;

  // console.log(notFound);
  const headLabel = [
    { id: "sno", label: "S.No.", minWidth: 90, align: "center" },
    { id: "username", label: "User Name", minWidth: 180 },
    { id: "email", label: "Email", minWidth: 180 },
    { id: "action", label: "Action", minWidth: 180 },
  ];

  const params = new URLSearchParams({
    search: debouncedSearch,
    type: selectedTab === 0 ? "SUPER_ADMIN" : "ADMIN",
  });

  const handleExport = async () => {
    try {
      const exportResponse = await userRequest.get(
        `/admin/exportAdminsToExcel?${params.toString()}`,
        {
          responseType: "blob",
        }
      );

      // Create a Blob object from the response data
      const blob = new Blob([exportResponse.data], {
        type: "application/octet-stream",
      });

      // Create a URL for the blob and initiate download
      const downloadUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = selectedTab === 0 ? "Super_Admins.xlsx" : "Admins.xlsx",
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
      <UsersTabs
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
              Add User
            </span>
            |
            <span onClick={handleExport} style={{ color: "#167beb" }}>
              Export{" "}
              <img src={excel} style={{ width: "1.2rem", marginLeft: "5px" }} />
            </span>
          </div>
        </div>

        <AddUserModal
          handleClose={handleClose}
          handleOpen={handleOpen}
          open={open}
          getData={getData}
          selectedTab={selectedTab}
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
                    dataFiltered.map((row, index) => (
                      <FormTableRow
                        key={row?._id}
                        sno={page * rowsPerPage + index + 1}
                        username={row?.username}
                        email={row?.email}
                        userId={row?._id}
                        onDelete={getData}
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
      </Card>
    </Container>
  );
}
