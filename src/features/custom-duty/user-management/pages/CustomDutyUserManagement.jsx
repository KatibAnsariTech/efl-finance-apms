import React, { lazy, Suspense, useCallback } from "react";
import { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import { DataGrid } from "@mui/x-data-grid";
import Container from "@mui/material/Container";
import CircularIndeterminate from "src/utils/loader";
import { FormTableToolbar } from "src/components/table";
import { userRequest } from "src/requestMethod";
import UserManagementTabs from "../components/UserManagementTabs";
import { headLabel } from "../components/getHeadLabel";
import { Box, IconButton, Tooltip, Chip } from "@mui/material";
import Iconify from "src/components/iconify";
import { fDateTime } from "src/utils/format-time";
import swal from "sweetalert";
import { showErrorMessage } from "src/utils/errorUtils";

const AddRequester = lazy(() => import("../components/Modals/AddRequester"));
const AddAdmin = lazy(() => import("../components/Modals/AddAdmin"));
const AddApprover = lazy(() => import("../components/Modals/AddApprover"));

const menuItems = ["Requester", "Approver", "Admin"];

export default function CustomDutyUserManagement() {
  const [selectedTab, setSelectedTab] = useState(0);
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [editData, setEditData] = useState(null);
  const [open, setOpen] = useState(false);
  const selectedCategory = menuItems[selectedTab];


  const handleEdit = (row, event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    setEditData(row);
    setOpen(true);
  };

  const handleOpen = () => {
    setEditData(null);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setEditData(null);
  };

  const getAPIURL = useCallback(() => {
    switch (selectedTab) {
      case 0:
        return "/custom/getAllUsersWithRoles?userType=REQUESTER";
      case 1:
        return "/custom/getAllUsersWithRoles?userType=APPROVER";
      case 2:
        return "/custom/getAllUsersWithRoles?userType=ADMIN";
      default:
        return "/custom/getAllUsersWithRoles?userType=REQUESTER";
    }
  }, [selectedTab]);

  const getData = useCallback(async () => {
    try {
      setLoading(true);
      const res = await userRequest.get(getAPIURL(), {
        params: {
          page: page + 1,
          limit: rowsPerPage,
          search: debouncedSearch,
          _t: Date.now(),
        },
      });

      setData(res?.data?.data?.users || []);
      setTotalCount(res?.data?.data?.pagination?.total || 0);
      setLoading(false);
    } catch (err) {
      setLoading(false);
    }
  }, [getAPIURL, page, rowsPerPage, debouncedSearch]);

  const handleDelete = async (userRoleId) => {
    try {
      const result = await swal({
        title: "Are you sure?",
        text: "You won't be able to revert this action!",
        icon: "warning",
        buttons: true,
        dangerMode: true,
      });

      if (result) {
        await userRequest.delete(`/custom/deleteUser/${userRoleId}`);
        swal("Deleted!", "User has been deleted successfully.", "success");
        getData();
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      swal("Error!", "Failed to delete user. Please try again.", "error");
    }
  };

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(search);
    }, 600);

    return () => clearTimeout(handler);
  }, [search]);

  useEffect(() => {
    setData([]);
    setTotalCount(0);
    setSearch("");
    setPage(0);
    setLoading(true);
    getData();
  }, [selectedTab]);

  useEffect(() => {
    if (search !== "") {
      getData();
    }
  }, [getData]);


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
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleFilterChange = (filterType, value) => {
    if (filterType === 'search') {
      setPage(0);
      setSearch(value);
    }
  };

  const dataFiltered = data;

  const columns = headLabel(selectedTab)
    .filter((col) => col.id !== "action")
    .map((col) => ({
      field: col.name || col.id,
      headerName: col.label,
      width: col.minWidth || 150,
      minWidth: col.minWidth || 100,
      sortable: col.sortable !== false,
      align: col.align || "center",
      headerAlign: col.align || "center",
      resizable: true,
      renderCell: (params) => {
        if (col.id === "sno") {
          const rowIndex = data.findIndex(row => row._id === params.id);
          return rowIndex !== -1 ? page * rowsPerPage + rowIndex + 1 : 1;
        }
        if (col.id === "createdAt") {
          return fDateTime(params.value);
        }
        if (col.id === "userType") {
          return (
            <Chip
              label={params.value}
              color={
                params.value === "ADMIN"
                  ? "error"
                  : params.value === "APPROVER"
                  ? "warning"
                  : params.value === "REQUESTER"
                  ? "info"
                  : "default"
              }
              size="small"
            />
          );
        }
        if (col.id === "name") {
          return params.row.username || "-";
        }
        if (col.id === "mastersheetPermissions") {
          return Array.isArray(params.value) && params.value.length > 0
            ? params.value.join(", ")
            : "-";
        }
        return params.value || "-";
      },
    }));

  columns.push({
    field: "actions",
    headerName: "Actions",
    width: 120,
    sortable: false,
    align: "center",
    headerAlign: "center",
    cellClassName: "actions-cell",
    renderCell: (params) => (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          gap: 1,
          height: "100%",
        }}
        onClick={(event) => event.stopPropagation()}
      >
        <Tooltip title="Edit">
          <IconButton
            size="small"
            onClick={(event) => {
              event.stopPropagation();
              handleEdit(params.row, event);
            }}
            sx={{
              color: "primary.main",
              "&:hover": {
                backgroundColor: "primary.lighter",
              },
            }}
          >
            <Iconify icon="eva:edit-fill" />
          </IconButton>
        </Tooltip>
        <Tooltip title="Delete">
          <IconButton
            size="small"
            onClick={(event) => {
              event.stopPropagation();
              handleDelete(params.row.userRoleId);
            }}
            sx={{
              color: "error.main",
              "&:hover": {
                backgroundColor: "error.lighter",
              },
            }}
          >
            <Iconify icon="eva:trash-2-fill" />
          </IconButton>
        </Tooltip>
      </Box>
    ),
  });

  return (
    <Container maxWidth="xl">
      <UserManagementTabs
        selectedTab={selectedTab}
        setSelectedTab={setSelectedTab}
        menuItems={menuItems}
      />
      <Card sx={{ p: 3 }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <FormTableToolbar
            search={search}
            onFilterChange={handleFilterChange}
            placeholder={`Search ${selectedCategory.toLowerCase()}s...`}
          />
          <div
            style={{
              fontSize: "0.8rem",
              fontWeight: "bold",
              cursor: "pointer",
              color: "#167beb",
            }}
          >
            <span onClick={handleOpen}>Add {selectedCategory}</span>
          </div>
        </div>

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

        <Box sx={{ width: "100%" }}>
          <DataGrid
            rows={dataFiltered}
            columns={columns}
            getRowId={(row) => row.userRoleId}
            loading={loading}
            pagination
            paginationMode="server"
            rowCount={totalCount}
            paginationModel={{ page: page, pageSize: rowsPerPage }}
            onPaginationModelChange={(newModel) => {
              handleChangePage(null, newModel.page);
              handleChangeRowsPerPage({ target: { value: newModel.pageSize } });
            }}
            pageSizeOptions={[5, 10, 25, 50]}
            disableRowSelectionOnClick
            disableColumnResize={false}
            autoHeight
            sx={{
              "& .MuiDataGrid-root": {
                tableLayout: "fixed",
              },
              "& .MuiDataGrid-cell": {
                "&:focus": { outline: "none" },
                "&:focus-visible": { outline: "none" },
              },
              "& .MuiDataGrid-row": {
                "&:focus": { outline: "none" },
                "&:focus-visible": { outline: "none" },
              },
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "#f5f6f8",
                fontWeight: "bold",
                color: "#637381",
              },
              "& .MuiDataGrid-columnSeparator": {
                display: "none",
              },
              "& .MuiDataGrid-columnHeader:hover .MuiDataGrid-columnSeparator": {
                display: "block",
                opacity: 0.3,
                color: "#637381",
              },
              "& .actions-cell": {
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: "8px 0",
              },
            }}
          />
        </Box>
      </Card>
    </Container>
  );
}
