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
import CloseButton from "src/routes/components/CloseButton";

export default function SubmitDetail() {
  const router = useRouter();
  const { finalRequestNo } = useParams();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [openModal, setOpenModal] = useState(false);
  const [selectedRowData, setSelectedRowData] = useState(null);

  const getData = async (pageNum = 1, pageSize = rowsPerPage) => {
    try {
      setLoading(true);

      const page = pageNum;
      const limit = pageSize;
      
      const response = await userRequest.get(
        `custom/getRaisedToBankByFinalReqNo/${finalRequestNo}`,
        {
          params: {
            page: page,
            limit: limit
          }
        }
      );

      if (response.data?.statusCode === 200 && response.data?.data) {
        const { items, pagination } = response.data.data;
        
        const mappedData = items.map((item) => ({
          _id: item._id,
          requestNo: item.requestNo,
          challanNo: item.challanNo,
          documentNo: item.documentNo,
          typeOfTransaction: item.typeOfTransaction,
          transactionAmount: item.transactionAmount,
          transactionDate: item.transactionDate,
          companyId: item.companyId,
          description: item.description,
          referenceId: item.referenceId,
          icegateAckNo: item.icegateAckNo,
          formStatus: item.formStatus,
          requesterId: item.requesterId,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt,
        }));

        setData(mappedData);
        setTotalCount(pagination?.total || mappedData.length);
      } else {
        setData([]);
        setTotalCount(0);
      }
    } catch (err) {
      console.error('Error fetching raised to bank detail records:', err);
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
  }, [finalRequestNo]);

  const handlePaginationModelChange = (newModel) => {
    const { page: newPage, pageSize: newPageSize } = newModel;
    
    // Handle page size change
    if (newPageSize !== rowsPerPage) {
      setRowsPerPage(newPageSize);
      setPage(0);
      getData(1, newPageSize);
    }
    // Handle page change (only if page size hasn't changed)
    else if (newPage !== page) {
      setPage(newPage);
      getData(newPage + 1, newPageSize);
    }
  };

  const handleRequestClick = (rowData) => {
    setSelectedRowData(rowData);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedRowData(null);
  };

  const handleBack = () => {
    router.push('/custom-duty/raise-to-bank');
  };

  const columns = RequestColumns({
    onRequestClick: handleRequestClick,
  });

  return (
    <Container sx={{mb: -15 }}>
      <Card sx={{ mt: 2, p: 2, position: 'relative' }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
          <CloseButton
            onClick={handleBack}
            tooltip="Back to Raise to Bank"
          />
        </Box>
        <Box
          sx={{
            width: "100%",
          }}
        >
          <DataGrid
            rows={data}
            columns={columns}
            getRowId={(row) => row._id || row.id}
            loading={loading}
            disableRowSelectionOnClick
            pagination
            paginationMode="server"
            rowCount={totalCount}
            paginationModel={{ page: page, pageSize: rowsPerPage }}
            onPaginationModelChange={handlePaginationModelChange}
            pageSizeOptions={[5, 10, 25, 50]}
            autoHeight={true}
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
