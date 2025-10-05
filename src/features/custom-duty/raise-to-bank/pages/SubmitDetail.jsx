import React, { useState, useEffect, useCallback } from "react";
import {
  Box,
  Card,
  Container,
  Typography,
  CircularProgress,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { userRequest } from "src/requestMethod";
import { fDateTime } from "src/utils/format-time";
import { useRouter } from "src/routes/hooks";
import { useParams } from "react-router-dom";
import { RequestColumns } from "../components/SubmitDetailColumns";
import RequestStatus from "../components/RequestStatus";

export default function SubmitDetail() {
  const router = useRouter();
  const { id } = useParams();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitRequestData, setSubmitRequestData] = useState(null);

  const [page, setPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openModal, setOpenModal] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState(null);

  const getData = async (pageNum = 1) => {
    try {
      setLoading(true);

      const page = pageNum;
      const limit = rowsPerPage;
      
      let apiData;
      let totalCount;

      try {
        const response = await userRequest.get(
          `https://68cce4b9da4697a7f303dd30.mockapi.io/requests/request-data`,
          {
            params: {
              page: page,
              limit: limit
            }
          }
        );
        apiData = response.data;
        totalCount = response.headers['x-total-count'] || 100;
      } catch (userRequestError) {
        const fetchResponse = await fetch(
          `https://68cce4b9da4697a7f303dd30.mockapi.io/requests/request-data?page=${page}&limit=${limit}`
        );
        const fetchData = await fetchResponse.json();
        apiData = fetchData;
        totalCount = 100;
      }

      const transformedData = apiData.map((item, index) => ({
        id: item.id,
        requestNo: `REQ${String(item.requestNo).padStart(6, "0")}`,
        requestedDate: new Date(item.requestedDate * 1000).toISOString(),
        boeNumber: `BOE${String(item.boeNumber).padStart(4, "0")}`,
        challanNumber: `CHL${String(item.challanNumber).padStart(4, "0")}`,
        transactionType: item.transactionType,
        transactionDate: new Date(item.transactionDate * 1000).toISOString(),
        transactionAmount: parseFloat(item.transactionAmount),
        status: item.status,
        company: item.company,
        description: item.description,
      }));

      setData(transformedData);
      setTotalCount(totalCount);
    } catch (err) {
      setData([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  const getSubmitRequestData = async () => {
    try {
      const response = await userRequest.get(
        `https://68cce4b9da4697a7f303dd30.mockapi.io/requests/request-data/${id}`
      );
      setSubmitRequestData(response.data);
    } catch (error) {
      setSubmitRequestData({
        id: id,
        submitRequestNo: `2056627067`,
        totalRecords: Math.floor(Math.random() * 50) + 20,
        submitDate: new Date().toISOString(),
        submittedBy: "shweta@efl.com",
      });
    }
  };

  useEffect(() => {
    setPage(0);
    setData([]);
    setLoading(true);
    getSubmitRequestData();
    getData(1);
  }, [id]);

  const handlePageChange = (newPage) => {
    setPage(newPage);
    getData(newPage + 1); // API uses 1-based pagination
  };

  const handleRowsPerPageChange = (newRowsPerPage) => {
    setRowsPerPage(newRowsPerPage);
    setPage(0);
    getData(1);
  };

  const handleRequestClick = (rowData) => {
    setSelectedRowData(rowData);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedRowData(null);
  };

  const columns = RequestColumns({
    onRequestClick: handleRequestClick,
  });

  return (
    <Container sx={{mb: -15 }}>
      <Card sx={{ mt: 2, p: 2 }}>
        <Box
          sx={{
            width: "100%",
            height: "calc(100vh - 160px)",
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
            paginationModel={{ page: page, pageSize: rowsPerPage }}
            onPaginationModelChange={(newModel) => {
              handlePageChange(newModel.page);
              handleRowsPerPageChange(newModel.pageSize);
            }}
            pageSizeOptions={[5, 10, 25, 50]}
            sx={{
              "& .MuiDataGrid-cell": {
                "&:focus": { outline: "none" },
                "&:focus-visible": { outline: "none" },
              },
              "& .MuiDataGrid-cell[data-field='requestNo']": {
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              },
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "#f5f6f8",
                fontWeight: "bold",
                color: "#637381",
              },
              "& .MuiDataGrid-columnHeader[data-field='requestNo']": {
                justifyContent: "center",
                display: "flex",
                alignItems: "center",
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
                backgroundColor: (theme) => theme.palette.action.hover,
                opacity: 0.8,
              },
            }}
          />
        </Box>
      </Card>
      
      <RequestStatus
        open={openModal}
        onClose={handleCloseModal}
        rowData={selectedRowData}
        getRequestData={getData}
        selectedTab="submitDetail"
      />
    </Container>
  );
}
