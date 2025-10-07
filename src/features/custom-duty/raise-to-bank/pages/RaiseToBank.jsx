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
import { SubmittedColumns } from "../components/RaiseToBankColumns";

export default function RaiseToBank() {
  const router = useRouter();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const getData = async (pageNum = 1) => {
    try {
      setLoading(true);

      const page = pageNum;
      const limit = rowsPerPage;
      
      const response = await userRequest.get(
        `custom/getRaisedToBankRecords`,
        {
          params: {
            page: page,
            limit: limit
          }
        }
      );

      const apiData = response.data?.data || response.data || [];
      const totalCount = response.data?.totalCount || response.data?.total || apiData.length;

      setData(apiData);
      setTotalCount(totalCount);
    } catch (err) {
      console.error('Error fetching raised to bank records:', err);
      setData([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(0);
    setData([]);
    setLoading(true);
    getData(1);
  }, []);

  const handlePageChange = (newPage) => {
    setPage(newPage);
    getData(newPage + 1);
  };

  const handleRowsPerPageChange = (newRowsPerPage) => {
    setRowsPerPage(newRowsPerPage);
    setPage(0);
    getData(1);
  };

  const columns = SubmittedColumns();

  return (
    <Container sx={{ mb: -15 }}>
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
              "& .MuiDataGrid-cell[data-field='submitRequestNo']": {
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              },
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: "#f5f6f8",
                fontWeight: "bold",
                color: "#637381",
              },
              "& .MuiDataGrid-columnHeader[data-field='submitRequestNo']": {
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
    </Container>
  );
}
