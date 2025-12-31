import React, { lazy, Suspense } from "react";
import { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import { DataGrid } from "@mui/x-data-grid";
import Container from "@mui/material/Container";
import CircularIndeterminate from "src/utils/loader";
import { FormTableToolbar } from "src/components/table";
import { applyFilter, getComparator } from "src/utils/utils";
import { userRequest } from "src/requestMethod";
import MasterTabs from "./master-tab";
import { headLabel } from "./getHeadLabel";
import { Box, IconButton, Tooltip, Chip } from "@mui/material";
import swal from "sweetalert";
import { showErrorMessage } from "src/utils/errorUtils";

// Permission mapping for display
const permissionLabels = {
  controlledCheque: "Controlled Cheque",
  cfMaster: "CF Master",
  dsobenchmark: "DSO Benchmark",
  dsostandard: "DSO Standard",
};
import Iconify from "src/components/iconify";
import { fDateTime } from "src/utils/format-time";
const AddUser = lazy(() => import("./Modals/AddUser"));

const menuItems = ["Users"]; // Admin and Super Admin tabs hidden for now

export default function APMSUserManagementView() {
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

  const handleEdit = (row, event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    setEditData(row);
    setOpen(true);
  };

  const handleDelete = async (row) => {
    try {
      const result = await swal({
        title: "Warning!",
        text: `Are you sure you want to delete this user?`,
        icon: "warning",
        buttons: {
          cancel: {
            text: "Cancel",
            value: false,
            visible: true,
            className: "",
            closeModal: true,
          },
          confirm: {
            text: "Delete",
            value: true,
            visible: true,
            className: "",
            closeModal: true,
          },
        },
        dangerMode: true,
      });

      if (result) {
        // The id can be either userId or userRoleId
        const userId = row?._id || row?.userRoleId || row?.userId;
        
        if (!userId) {
          swal("Error!", "Unable to find user ID. Please try again.", "error");
          return;
        }

        await userRequest.delete(`/apms/deleteUser/${userId}`);
        swal("Deleted!", "User has been deleted successfully.", "success");
        getData();
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      showErrorMessage(error, "Failed to delete user. Please try again.", swal);
    }
  };

  const getAPIURL = () => {
    // Base URL for getting apms users
    return "apms/getAPMSUsers";
  };

  const getUserTypeFilter = () => {
    switch (selectedTab) {
      case 0: // Users tab - REQUESTER and APPROVER
        return "REQUESTER,APPROVER";
      case 1: // Admin tab
        return "ADMIN";
      case 2: // Super Admin tab
        return "SUPER_ADMIN";
      default:
        return "REQUESTER,APPROVER";
    }
  };

  const getData = async () => {
    try {
      setLoading(true);
      const userTypeFilter = getUserTypeFilter();
      const params = {
        page: page + 1,
        limit: rowsPerPage,
        search: debouncedSearch,
      };

      // Add userType filter if not empty
      if (userTypeFilter) {
        params.userType = userTypeFilter;
      }

      const res = await userRequest.get(getAPIURL(), { params });

      // JVM API response structure: data.data.data and data.data.pagination
      setData(res?.data?.data?.data || []);
      setTotalCount(res?.data?.data?.pagination?.totalCount || 0);
      setLoading(false);
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
  }, [debouncedSearch, page, rowsPerPage, selectedTab]);

  useEffect(() => {
    // Reset data and loading state when switching tabs
    setData([]);
    setTotalCount(0);
    setPage(0);
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

  const getAddButtonText = () => {
    switch (selectedTab) {
      case 0:
        return "Add User";
      case 1:
        return "Add Admin";
      case 2:
        return "Add Super Admin";
      default:
        return "Add User";
    }
  };

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
          <Box
            onClick={handleOpen}
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "0.875rem",
              fontWeight: 600,
              cursor: "pointer",
              color: "primary.main",
              "&:hover": {
                textDecoration: "underline",
              },
            }}
          >
            {getAddButtonText()}
          </Box>
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

        {/* Unified Add User Modal */}
        {open && (
          <Suspense fallback={<CircularIndeterminate />}>
            <AddUser
              handleClose={handleClose}
              open={open}
              getData={getData}
              editData={editData}
              selectedTab={selectedTab}
            />
          </Suspense>
        )}

        <Box sx={{ width: "100%" }}>
          <DataGrid
            rows={
              dataFiltered?.map((row, index) => ({
                id: row._id || row.userRoleId || row.userId || `row-${index}`,
                sno: page * rowsPerPage + index + 1,
                ...row,
              })) || []
            }
            columns={[
              ...headLabel(selectedTab)
                .filter((col) => col.id !== "action")
                .map((col) => ({
                  field: col.name || col.id, 
                  headerName: col.label,
                  width: col.width || col.minWidth || 150,
                  minWidth: col.minWidth || 100,
                  flex: col.id === "email" || col.id === "name" ? 1 : undefined,
                  sortable: col.sortable !== false,
                  align: col.align || (col.id === "sno" ? "center" : "left"),
                  headerAlign: col.align || (col.id === "sno" ? "center" : "left"),
                  resizable: true,
                  renderCell: (params) => {
                    if (col.id === "createdAt") {
                      return fDateTime(params.value);
                    }
                    if (col.id === "userType") {
                      // Handle userType as array or string
                      const userTypes = Array.isArray(params.value) ? params.value : (params.value ? [params.value] : []);
                      if (userTypes.length === 0) return "-";
                      
                      return (
                        <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap", justifyContent: col.align === "center" ? "center" : "flex-start" }}>
                          {userTypes.map((type, index) => (
                            <Chip
                              key={index}
                              label={type}
                              variant="outlined"
                              color={
                                type === "SUPER_ADMIN"
                                  ? "error"
                                  : type === "ADMIN"
                                  ? "warning"
                                  : "default"
                              }
                              size="small"
                              sx={{ 
                                fontSize: "0.75rem",
                                backgroundColor: "transparent",
                                ...(type === "APPROVER" && {
                                  borderColor: "rgba(0, 0, 0, 0.23)",
                                  color: "rgba(0, 0, 0, 0.87)",
                                }),
                                "& .MuiChip-label": {
                                  padding: "0 8px",
                                }
                              }}
                            />
                          ))}
                        </Box>
                      );
                    }
                    if (col.id === "name") {
                      return (
                        <Box sx={{ textAlign: col.align === "center" ? "center" : "left" }}>
                          {params.row.username || "-"}
                        </Box>
                      );
                    }
                    if (col.id === "email") {
                      return (
                        <Box sx={{ textAlign: col.align === "center" ? "center" : "left" }}>
                          {params.value || "-"}
                        </Box>
                      );
                    }
                    if (col.id === "company") {
                      // Handle company display - can be array or single object
                      if (!params.value) {
                        return (
                          <Box sx={{ textAlign: col.align === "center" ? "center" : "left", color: "text.secondary" }}>
                            -
                          </Box>
                        );
                      }
                      
                      let companyNames = [];
                      
                      if (Array.isArray(params.value)) {
                        if (params.value.length === 0) {
                          return (
                            <Box sx={{ textAlign: col.align === "center" ? "center" : "left", color: "text.secondary" }}>
                              -
                            </Box>
                          );
                        }
                        // If array contains objects with name/value property
                        companyNames = params.value.map((comp) => {
                          if (typeof comp === 'string') return comp;
                          return comp?.name || comp?.value || comp?.label || "-";
                        });
                      } else if (typeof params.value === 'object') {
                        // Single company object
                        const companyName = params.value?.name || params.value?.value || params.value?.label || "-";
                        companyNames = [companyName];
                      } else {
                        // Single string value
                        companyNames = [params.value];
                      }
                      
                      return (
                        <Box sx={{ display: "flex", gap: 0.5, flexWrap: "wrap", justifyContent: col.align === "center" ? "center" : "flex-start" }}>
                          {companyNames.map((companyName, index) => (
                            <Chip
                              key={index}
                              label={companyName}
                              variant="outlined"
                              size="small"
                              sx={{ 
                                fontSize: "0.75rem",
                                backgroundColor: "transparent",
                                "& .MuiChip-label": {
                                  padding: "0 8px",
                                }
                              }}
                            />
                          ))}
                        </Box>
                      );
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
              // Show actions column for all tabs
              {
                field: "action",
                headerName: "Actions",
                width: 120,
                minWidth: 120,
                sortable: false,
                align: "center",
                headerAlign: "center",
                disableColumnMenu: true,
                disableReorder: true,
                disableExport: true,
                pinned: "right",
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
                          handleDelete(params.row);
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
            paginationModel={{ page, pageSize: rowsPerPage }}
            onPaginationModelChange={({ page: nextPage, pageSize }) => {
              setPage(nextPage);
              setRowsPerPage(pageSize);
              window.scrollTo(0, 0);
            }}
            pageSizeOptions={[5, 10, 25]}
            autoHeight
            disableRowSelectionOnClick
            sx={{
              "& .MuiDataGrid-cell": {
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
                fontWeight: 600,
                color: "#637381",
                borderBottom: "2px solid #e0e0e0",
              },
              "& .MuiDataGrid-columnHeaderTitle": {
                fontWeight: 600,
              },
              "& .MuiDataGrid-row": {
                "&:hover": {
                  backgroundColor: "#f9fafb",
                },
                "&:focus": {
                  outline: "none",
                },
                "&:focus-visible": {
                  outline: "none",
                },
              },
              "& .MuiDataGrid-cellContent": {
                overflow: "visible",
              },
            }}
          />
        </Box>
      </Card>
    </Container>
  );
}
