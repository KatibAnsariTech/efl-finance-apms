import React, { useState, useEffect, useCallback } from "react";
import { Box, Card, Container } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { userRequest } from "src/requestMethod";
import { useRouter } from "src/routes/hooks";
import { showErrorMessage } from "src/utils/errorUtils";
import { RequestColumns } from "../components/RequestColumns";
import { JVDetailsColumns } from "../components/JVDetailsColumns";
import RequestStatus from "../components/RequestStatus";
import ColorIndicators from "../components/ColorIndicators";
import CloseButton from "src/routes/components/CloseButton";
import { Helmet } from "react-helmet-async";
import { useParams } from "src/routes/hooks";
import swal from "sweetalert";

export default function JVDetails() {
  const router = useRouter();
  const { parentId, groupId } = useParams();

  const requestId = groupId;
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openModal, setOpenModal] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState(null);

  const handleBack = () => {
    router.back();
  };

  const getFormItems = useCallback(
    async (pageNum = 1) => {
      try {
        setLoading(true);

        if (!requestId) {
          setData([]);
          return;
        }

        const response = await userRequest.get(
          `jvm/getFormItemsByGroupId?groupId=${requestId}`,
          {
            params: {
              page: pageNum,
              limit: rowsPerPage,
            },
          }
        );

        if (response.data.statusCode === 200) {
          const items = response.data.data.items || [];
          const pagination = response.data.data.pagination || {};
          const totalItems = pagination.totalItems || 0;

          const dataWithLineNumbers = items.map((item, index) => {
            const lineNumber = (pageNum - 1) * rowsPerPage + index + 1;
            return {
              ...item,
              id: item._id || item.itemId || `${pageNum}-${index}`,
              lineNumber: lineNumber,
            };
          });

          setData(dataWithLineNumbers);
          setTotalCount(totalItems);
        } else {
          throw new Error(
            response.data.message || "Failed to fetch form items"
          );
        }
      } catch (err) {
        console.error("Error fetching form items:", err);
        showErrorMessage(err, "Failed to fetch form details", swal);
        setData([]);
        setTotalCount(0);
      } finally {
        setLoading(false);
      }
    },
    [requestId, rowsPerPage]
  );

  const getData = useCallback(
    async (pageNum = 1) => {
      await getFormItems(pageNum);
    },
    [getFormItems]
  );

  useEffect(() => {
    if (requestId) {
      setPage(0);
      setData([]);
      setLoading(true);
      getFormItems(1);
    }
  }, [requestId, getFormItems]);

  useEffect(() => {
    if (requestId && page > 0) {
      getFormItems(page + 1);
    }
  }, [page, rowsPerPage, requestId, getFormItems]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const handleRowsPerPageChange = (newRowsPerPage) => {
    setRowsPerPage(newRowsPerPage);
    setPage(0);
  };

  const handleRequestClick = (rowData) => {
    setSelectedRowData(rowData);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedRowData(null);
  };

  const columns = JVDetailsColumns();

  return (
    <>
      <Helmet>
        <title>JV Details - {groupId}</title>
      </Helmet>

      <Container>
        <Card sx={{ mt: 2, p: 2 }}>
          <Box
            sx={{
              mb: 2,
              display: "flex",
              alignItems: "center",
              justifyContent: "flex-end",
            }}
          >
            <CloseButton
              onClick={() => router.back()}
              tooltip="Back to Requests"
            />
          </Box>
          <Box
            sx={{
              width: "100%",
              minHeight: 200,
            }}
          >
            <DataGrid
              rows={data}
              columns={columns}
              loading={loading}
              disableRowSelectionOnClick
              pagination
              paginationMode="server"
              rowCount={totalCount}
              autoHeight
              paginationModel={{ page: page, pageSize: rowsPerPage }}
              onPaginationModelChange={(newModel) => {
                if (newModel.page !== page) {
                  handlePageChange(newModel.page);
                }
                if (newModel.pageSize !== rowsPerPage) {
                  handleRowsPerPageChange(newModel.pageSize);
                }
              }}
              pageSizeOptions={[5, 10, 25, 50]}
              getRowClassName={(params) => {
                const status = params.row.status?.toLowerCase();
                if (status === "pending") return "row-pending";
                if (status === "rejected") return "row-rejected";
                if (status === "approved") return "row-approved";
                if (status === "declined") return "row-declined";
                if (status === "draft") return "row-draft";
                if (status === "submitted") return "row-submitted";
                return "";
              }}
              columnResizeMode="onResize"
              disableColumnResize={false}
              disableColumnSort={false}
              sortModel={[{ field: "lineNumber", sort: "asc" }]}
              sx={{
                "& .MuiDataGrid-cell": {
                  "&:focus": { outline: "none" },
                  "&:focus-visible": { outline: "none" },
                  display: "flex",
                  alignItems: "center",
                },
                "& .MuiDataGrid-cell[data-field='sNo']": {
                  paddingLeft: "16px",
                },
                "& .MuiDataGrid-columnHeaders": {
                  backgroundColor: "#f5f6f8",
                  fontWeight: "bold",
                  color: "#637381",
                },
                "& .MuiDataGrid-columnHeader[data-field='sNo']": {
                  paddingLeft: "16px",
                },
                "& .MuiDataGrid-columnHeaderTitle": {
                  width: "100%",
                  textAlign: "center",
                },
                "& .MuiDataGrid-row": {
                  "&:focus": { outline: "none" },
                  "&:focus-visible": { outline: "none" },
                },
                "& .MuiDataGrid-row:hover": {
                  backgroundColor: "rgba(0, 0, 0, 0.04)",
                },
                "& .row-pending": {
                  backgroundColor: "#f4f5ba !important",
                },
                "& .row-rejected": {
                  backgroundColor: "#e6b2aa !important",
                },
                "& .row-approved": {
                  backgroundColor: "#baf5c2 !important",
                },
                "& .row-declined": {
                  backgroundColor: "#e6b2aa !important",
                },
                "& .row-draft": {
                  backgroundColor: "#e0e0e0 !important",
                },
                "& .row-submitted": {
                  backgroundColor: "#bbdefb !important",
                },
              }}
            />
          </Box>
          <Box
            sx={{
              position: "relative",
              height: "52px",
              marginTop: "-52px",
              display: "flex",
              alignItems: "center",
              paddingLeft: "16px",
              zIndex: 0,
              pointerEvents: "none",
            }}
          >
            <Box sx={{ pointerEvents: "auto" }}>
              <ColorIndicators />
            </Box>
          </Box>
        </Card>

        <RequestStatus
          open={openModal}
          onClose={handleCloseModal}
          rowData={selectedRowData}
          getRequestData={getData}
          selectedTab="requests"
        />
      </Container>
    </>
  );
}
