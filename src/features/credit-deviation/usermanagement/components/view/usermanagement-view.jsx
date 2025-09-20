import React, { lazy, Suspense, useRef } from "react";
import { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import { DataGrid } from "@mui/x-data-grid";
import Container from "@mui/material/Container";
import CircularIndeterminate from "src/utils/loader";
import { FormTableToolbar } from "src/components/table";
import { applyFilter, getComparator } from "src/utils/utils";
import { userRequest } from "src/requestMethod";
import MasterTabs from "../master-tab";
import { headLabel } from "./getHeadLabel";
import { Box, IconButton, Tooltip, Chip } from "@mui/material";

// Permission mapping for display
const permissionLabels = {
  controlledCheque: "Controlled Cheque",
  cfMaster: "CF Master",
  dsobenchmark: "DSO Benchmark",
  dsostandard: "DSO Standard",
};
import Iconify from "src/components/iconify";
import { fDateTime } from "src/utils/format-time";
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

  const handleEdit = (row, event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
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

        <Box sx={{ width: "100%" }}>
          <DataGrid
            rows={
              dataFiltered?.map((row, index) => ({
                id: row._id,
                sno: page * rowsPerPage + index + 1,
                ...row,
              })) || []
            }
            columns={[
              ...headLabel(selectedTab)
                .filter((col) => col.id !== "action") // Filter out the action column from headLabel
                .map((col) => ({
                  field: col.name || col.id, // Use col.name if available, otherwise col.id
                  headerName: col.label,
                  width: col.width || 150,
                  minWidth: col.minWidth || 100,
                  // maxWidth: col.maxWidth || 300,
                  sortable: col.sortable !== false,
                  align: col.align || "center",
                  headerAlign: col.align || "center",
                  resizable: true,
                  renderCell: (params) => {
                    if (col.id === "createdAt") {
                      return fDateTime(params.value);
                    }
                    if (col.id === "userType") {
                      return (
                        <Chip
                          label={params.value}
                          color={
                            params.value === "SUPER_ADMIN"
                              ? "error"
                              : params.value === "ADMIN"
                              ? "warning"
                              : params.value === "APPROVER"
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
                      if (
                        !params.value ||
                        !Array.isArray(params.value) ||
                        params.value.length === 0
                      ) {
                        return "-";
                      }
                      return params.value
                        .map((permission) => permissionLabels[permission] || permission)
                        .join(", ");
                    }
                    return params.value;
                  },
                })),
              {
                field: "action",
                headerName: "Actions",
                width: 120,
                sortable: false,
                align: "center",
                headerAlign: "center",
                disableColumnMenu: true,
                disableReorder: true,
                disableExport: true,
                renderCell: (params) => (
                  <Box
                    onClick={(event) => event.stopPropagation()}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Tooltip title="Edit">
                      <IconButton
                        size="small"
                        onClick={(event) => handleEdit(params.row, event)}
                        sx={{ mr: 1 }}
                      >
                        <Iconify
                          icon="eva:edit-fill"
                          sx={{ color: "primary.main" }}
                        />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        size="small"
                        onClick={(event) => {
                          event.stopPropagation();
                          handleDelete(params.row._id);
                        }}
                        sx={{ color: "error.main" }}
                      >
                        <Iconify icon="eva:trash-2-outline" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                ),
              },
            ]}
            getRowId={(row) => row?.id}
            loading={loading}
            pagination
            paginationMode="server"
            rowCount={totalCount}
            pageSizeOptions={[5, 10, 25]}
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
            }}
          />
        </Box>
      </Card>
    </Container>
  );
}
