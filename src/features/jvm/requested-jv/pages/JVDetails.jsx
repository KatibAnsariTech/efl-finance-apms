import React from "react";
import { useState, useEffect, useCallback } from "react";
import Card from "@mui/material/Card";
import { DataGrid } from "@mui/x-data-grid";
import Container from "@mui/material/Container";
import CircularIndeterminate from "src/utils/loader";
import { FormTableToolbar } from "src/components/table";
import { getComparator } from "src/utils/utils";
import { useRouter } from "src/routes/hooks";
import { Box, Tooltip, Typography, IconButton } from "@mui/material";
import { fDateTime } from "src/utils/format-time";
import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";
import { userRequest } from "src/requestMethod";
import { JVDetailsColumns } from "../components/JVDetailsColumns";
import JVCurrentStatus from "../components/JVCurrentStatus";
import swal from "sweetalert";
import { showErrorMessage } from "src/utils/errorUtils";

export default function JVDetails() {
  const router = useRouter();
  const { jvId } = useParams();
  const id = jvId;
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState("");
  const [jvData, setJvData] = useState(null);

  const getData = useCallback(async (pageNum = 1, limit = rowsPerPage) => {
    setLoading(true);
    try {
      if (!id) return;

      const response = await userRequest.get(
        `jvm/getFormItemsByGroupId?groupId=${id}&page=${pageNum}&limit=${limit}`
      );

      if (response.data.statusCode === 200) {
        const { items, pagination } = response.data.data;

        const data = items.map((item, index) => ({
          ...item,
          id: item._id,
          lineNumber: (pageNum - 1) * limit + index + 1,
        }));

        setData(data);
        setTotalCount(pagination.totalItems);
      } else {
        throw new Error(response.data.message || "Failed to fetch form items");
      }
    } catch (error) {
      console.error("Error fetching JV detail data:", error);
      setData([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  }, [id, rowsPerPage]);
  const getRequestInfo = useCallback(async () => {
    try {
      if (!id) {
        setJvData(null);
        return;
      }

      const response = await userRequest.get(
        `jvm/getRequestInfoByGroupId?groupId=${id}`
      );

      if (response.data.statusCode === 200) {
        const requestData = response.data.data;

        // Store the full JV data for CurrentStatus component
        setJvData(requestData);
      } else {
        throw new Error(
          response.data.message || "Failed to fetch request info"
        );
      }
    } catch (err) {
      console.error("Error fetching request info:", err);
      showErrorMessage(err, "Failed to fetch request details", swal);
      setJvData(null);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      getRequestInfo();
    }
  }, [id, getRequestInfo]);

  useEffect(() => {
    if (id) {
      getData(page + 1, rowsPerPage);
    }
  }, [id, page, rowsPerPage, getData]);

  const handleFilterChange = (filterType, value) => {
    if (filterType === "search") {
      setSearch(value);
    }
  };


  const handleBack = () => {
    router.push("/jvm/requested-jvs");
  };

  const getStatusColor = (status) => {
    const statusColors = {
      Approved: "#e8f5e8",
      Rejected: "#ffcdd2",
      Pending: "#f4f5ba",
    };
    return statusColors[status] || "#f5f5f5";
  };

  const getStatusChip = (status) => {
    return (
      <Box
        sx={{
          display: "inline-block",
          px: 1.5,
          py: 0.5,
          borderRadius: 1,
          backgroundColor: getStatusColor(status),
          color: "#333",
          fontSize: "0.75rem",
          fontWeight: 600,
          textTransform: "uppercase",
        }}
      >
        {status}
      </Box>
    );
  };

  // Get columns from separate file
  const columns = JVDetailsColumns();

  const dataFiltered = (() => {
    let filteredData = [...data];

    if (search) {
      filteredData = filteredData.filter((item) =>
        [
          "sNo",
          "documentType",
          "businessArea",
          "accountType",
          "postingKey",
          "vendorCustomerGLNumber",
          "vendorCustomerGLName",
          "assignment",
          "profitCenter",
          "specialGLIndication",
          "referenceNumber",
          "remarks",
          "costCenter",
          "personalNumber",
          "autoReversal",
        ].some((field) =>
          item[field]?.toString().toLowerCase().includes(search.toLowerCase())
        )
      );
    }

    const comparator = getComparator("asc", "lineNumber");
    const stabilizedThis = filteredData.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });

    return stabilizedThis.map((el) => el[0]);
  })();

  return (
    <>
      <Helmet>
        <title>JV Detail</title>
      </Helmet>

      <Container>
        <Card sx={{ mt: 2, p: 2 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <FormTableToolbar
              search={search}
              onFilterChange={handleFilterChange}
              placeholder="Search by JV No, document type, GL account, remarks, reference..."
            />
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                position: "relative",
                "&:hover .close-tooltip": { opacity: 1, pointerEvents: "auto" },
                mr: 1,
              }}
              onClick={handleBack}
            >
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="#e53935"
                stroke="#fff"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ borderRadius: "50%" }}
              >
                <circle cx="12" cy="12" r="12" fill="#e53935" />
                <line x1="8" y1="8" x2="16" y2="16" />
                <line x1="16" y1="8" x2="8" y2="16" />
              </svg>
              <Box
                className="close-tooltip"
                sx={{
                  position: "absolute",
                  top: 0,
                  right: 35,
                  background: "#12368d",
                  color: "#fff",
                  px: 1.5,
                  py: 0.5,
                  borderRadius: 1,
                  fontSize: "0.85rem",
                  whiteSpace: "nowrap",
                  opacity: 0,
                  pointerEvents: "none",
                  transition: "opacity 0.2s",
                  zIndex: 10,
                }}
              >
                Back to JV Status
              </Box>
            </Box>
          </Box>

          <Box sx={{ width: "100%" }}>
            <DataGrid
              rows={dataFiltered || []}
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
              }}
              pageSizeOptions={[5, 10, 25, 50]}
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
          {/* Approval History */}
          {jvData && (
            <Box sx={{ mt: 3 }}>
              <JVCurrentStatus steps={jvData.steps || []} data={jvData} />
            </Box>
          )}
        </Card>
      </Container>
    </>
  );
}
