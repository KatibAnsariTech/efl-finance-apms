  import React, { useCallback } from "react";
import { useState, useEffect, useMemo } from "react";
import Card from "@mui/material/Card";
import { DataGrid } from "@mui/x-data-grid";
import Container from "@mui/material/Container";
import CircularIndeterminate from "src/utils/loader";
import { FormTableToolbar } from "src/components/table";
import { userRequest } from "src/requestMethod";
import { useRouter } from "src/routes/hooks";
import { Box } from "@mui/material";
import { Helmet } from "react-helmet-async";
import { useParams } from "react-router-dom";
import { AutoReversalForm } from "../components/AutoReversalDetail";
import swal from "sweetalert";
import { showErrorMessage } from "src/utils/errorUtils";
import { AutoReversalDetailsColumns } from "../components/AutoReversalDetailsColumns";
// import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function AutoReversalDetails() {
  const router = useRouter();
  const { arId } = useParams();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [arInfo, setArInfo] = useState({});

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  const getData = useCallback(async () => {
    setLoading(true);
    try {
      if (!arId) {
        throw new Error("No groupId available to fetch form items");
      }

      const response = await userRequest.get(`jvm/getFormItemsByGroupId`, {
        params: {
          groupId: arId,
          page: page + 1,
          limit: rowsPerPage,
          search: debouncedSearch || undefined,
        },
      });

      if (response.data.statusCode === 200) {
        const responseData = response.data.data;
        const apiData = responseData.items || [];
        const pagination = responseData.pagination || {};

        const processedData = apiData.map((row, index) => ({
          ...row,
          id: row._id || row.itemId || `row_${index}`,
          lineNumber: (page * rowsPerPage) + index + 1,
          postingDate: new Date(row.postingDate),
          documentDate: new Date(row.documentDate),
          initiatedDate: new Date(row.createdAt),
          createdAt: new Date(row.createdAt),
        }));

        setData(processedData);
        setTotalCount(pagination.totalItems || 0);
      } else {
        throw new Error(
          response.data.message || "Failed to fetch form items"
        );
      }
    } catch (error) {
      console.error("Error fetching form items:", error);
      showErrorMessage(error, "Failed to fetch form items", swal);
    } finally {
      setLoading(false);
    }
  }, [arId, debouncedSearch, page, rowsPerPage]);

  const getRequestInfo = useCallback(async () => {
    try {
      if (!arId) {
        return;
      }

      const response = await userRequest.get(
        `jvm/getRequestInfoByGroupId?groupId=${arId}`
      );

      if (response.data.statusCode === 200) {
        const requestData = response.data.data;
        
        const arHeaderInfo = {
          requestNo: requestData.groupId || arId,
          status: requestData.status || "Unknown",
          totalDebit: 0,
          totalCredit: 0,
          createdDate: new Date(requestData.createdAt || new Date()),
          initiatedDate: new Date(requestData.createdAt || new Date()),
          documentDate: new Date(requestData.documentDate || requestData.createdAt || new Date()),
          postingDate: new Date(requestData.postingDate || requestData.createdAt || new Date()),
          startDate: null,
          endDate: null,
          requesterId: requestData.requesterId || null,
          groupId: requestData.groupId || arId,
          parentId: requestData.parentId || null,
          mainTableId: requestData._id || null,
          autoReversal: requestData.autoReversal || "N",
          steps: requestData.steps || [],
          currentStep: requestData.currentStep || 0,
        };

        setArInfo(arHeaderInfo);
      } else {
        throw new Error(
          response.data.message || "Failed to fetch request info"
        );
      }
    } catch (err) {
      console.error("Error fetching request info:", err);
      showErrorMessage(err, "Failed to fetch request details", swal);
    }
  }, [arId]);

  useEffect(() => {
    if (arId) {
      getRequestInfo();
    }
  }, [arId]);

  useEffect(() => {
    if (arId) {
      getData();
    }
  }, [arId, getData]);

  const handleFilterChange = (filterType, value) => {
    if (filterType === "search") {
      setSearch(value);
      setPage(0);
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      setLoading(true);

      const reversalId = arInfo.mainTableId || arId;

      if (!reversalId) {
        throw new Error("No reversal ID available for submission");
      }

      const submissionData = {
        reversalDate:
          formData.reversalDate || new Date().getFullYear().toString(),
        fiscalYear: formData.fiscalYear || new Date().getFullYear().toString(),
      };

      const response = await userRequest.post(
        `jvm/submitReversal/${reversalId}`,
        submissionData
      );

      if (response.data.statusCode === 200) {
        swal({
          title: "Success",
          text: "Reversal submitted successfully!",
          icon: "success",
          buttons: true,
        }).then(() => {
          router.push("/jvm/auto-reversal");
        });
      } else {
        throw new Error(response.data.message || "Failed to submit reversal");
      }
    } catch (error) {
      console.error("Error submitting reversal:", error);
      showErrorMessage(error, "Failed to submit reversal", swal);
    } finally {
      setLoading(false);
    }
  };

  const columns = AutoReversalDetailsColumns();

  return (
    <>
      <Helmet>
        <title>Auto Reversal Detail</title>
      </Helmet>

      <Container>
        <AutoReversalForm
          onSubmit={handleFormSubmit}
          initialData={{
            initiatedDate: arInfo.initiatedDate,
            documentDate: arInfo.documentDate,
            postingDate: arInfo.postingDate,
            fiscalYear:
              arInfo.fiscalYear || new Date().getFullYear().toString(),
            reversalRemarks: arInfo.reversalRemarks || "",
          }}
        />

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
              placeholder="Search"
            />
          </Box>

          <Box sx={{ width: "100%" }}>
            <DataGrid
              rows={data || []}
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
