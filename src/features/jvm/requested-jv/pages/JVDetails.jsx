import React from "react";
import { useState, useEffect, useCallback } from "react";
import Card from "@mui/material/Card";
import { DataGrid } from "@mui/x-data-grid";
import Container from "@mui/material/Container";
import CircularIndeterminate from "src/utils/loader";
import { FormTableToolbar } from "src/components/table";
import { getComparator } from "src/utils/utils";
import { useRouter } from "src/routes/hooks";
import { Box, IconButton } from "@mui/material";
import CloseButton from "src/routes/components/CloseButton";
import { Helmet } from "react-helmet-async";
import { useParams } from "src/routes/hooks";
import { userRequest } from "src/requestMethod";
import { JVDetailsColumns } from "../../components/JVDetailsColumns";
import swal from "sweetalert";
import { showErrorMessage } from "src/utils/errorUtils";

export default function JVDetails() {
  const router = useRouter();
  const { parentId, groupId } = useParams();
  const id = groupId;
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState("");

  const getData = useCallback(
    async (pageNum = 1, limit = rowsPerPage) => {
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
          throw new Error(
            response.data.message || "Failed to fetch form items"
          );
        }
      } catch (error) {
        setData([]);
        setTotalCount(0);
      } finally {
        setLoading(false);
      }
    },
    [id, rowsPerPage]
  );

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
              justifyContent: "flex-end",
              alignItems: "center",
              mb: 2,
            }}
          >
            <CloseButton
              onClick={() => router.back()}
              tooltip="Back to JVs by Group"
            />
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
        </Card>
      </Container>
    </>
  );
}
