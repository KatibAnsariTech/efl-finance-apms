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

const menuItems = ["Requester", "Approver", "Admin", "Super Admin"];

export default function ImportPaymentUserManagement() {
  const [selectedTab, setSelectedTab] = useState(0);
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
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
        return "/imt/getAllUsersWithRoles?userType=REQUESTER";
      case 1:
        return "/imt/getAllUsersWithRoles?userType=APPROVER";
      case 2:
        return "/imt/getAllUsersWithRoles?userType=ADMIN";
      case 3:
        return "/imt/getAllUsersWithRoles?userType=SUPER_ADMIN";  
      default:
        return "/imt/getAllUsersWithRoles?userType=REQUESTER";
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
        await userRequest.delete(`/imt/deleteUser/${userRoleId}`);
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
    getData();
  }, [debouncedSearch, page, rowsPerPage]);


  const sortableColumns = ["username", "email"];

  const handleSort = (event, id) => {
    if (sortableColumns.includes(id)) {
      const isAsc = orderBy === id && order === "asc";
      setOrder(isAsc ? "desc" : "asc");
      setOrderBy(id);
    }
  };


  const handleFilterChange = (filterType, value) => {
    if (filterType === 'search') {
      setPage(0);
      setSearch(value);
    }
  };

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
      cellClassName: col.id === "department" ? "company-cell" : "",
      renderCell: (params) => {
      const col = columns.find((c) => c.id === params.field);

      // S.No
      if (params.field === "sno") {
          return page * rowsPerPage + params.api.getRowIndexRelativeToVisibleRows(params.id) + 1;
      }

      // CreatedAt formatting
      if (params.field === "createdAt") {
        return fDateTime(params.value);
      }

      // Username fallback
      if (params.field === "name") {
        return params.row.username || "-";
      }

      // 🔥 Department (Array)
      if (params.field === "departmentId") {
        return Array.isArray(params.row.departmentId)
          ? params.row.departmentId.map((d) => d.value).join(", ")
          : "-";
      }

      // 🔥 Import Type (Array)
      if (params.field === "importType") {
        return Array.isArray(params.row.importType)
          ? params.row.importType.map((d) => d.value).join(", ")
          : "-";
      }

      // 🔥 Scope (Array)
      if (params.field === "scope") {
        return Array.isArray(params.row.scope)
          ? params.row.scope.map((d) => d.value).join(", ")
          : "-";
      }

      // 🔥 Select Type (Single Object)
      if (params.field === "selectType") {
        return params.row.selectType?.value || "-";
      }

      // Default value or "-"
      return params.value || "-";
      }
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
            rows={data}
            columns={columns}
            getRowId={(row) => row.userRoleId}
            loading={loading}
            pagination
            paginationMode="server"
            rowCount={totalCount}
            paginationModel={{ page: page, pageSize: rowsPerPage }}
            onPaginationModelChange={(newModel) => {
              setPage(newModel.page);
              setRowsPerPage(newModel.pageSize);
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
              "& .company-cell": {
                whiteSpace: "pre-line",
                lineHeight: 1.4,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              },
            }}
          />
        </Box>
      </Card>
    </Container>
  );
}
