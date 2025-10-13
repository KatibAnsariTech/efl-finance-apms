import React, { useCallback } from "react";
import { useState, useEffect, useMemo } from "react";
import Card from "@mui/material/Card";
import { DataGrid } from "@mui/x-data-grid";
import Container from "@mui/material/Container";
import { FormTableToolbar } from "src/components/table";
import { userRequest } from "src/requestMethod";
import { useRouter } from "src/routes/hooks";
import { Box } from "@mui/material";
import { Helmet } from "react-helmet-async";
import { useParams, useLocation } from "react-router-dom";
import { AutoReversalForm } from "../components/AutoReversalDetail";
import swal from "sweetalert";
import { showErrorMessage } from "src/utils/errorUtils";
import { AutoReversalDetailsColumns } from "../components/AutoReversalDetailsColumns";
import { useJVM } from "src/contexts/JVMContext";
import ColorIndicators from "../components/ColorIndicators";

export default function AutoReversalDetails() {
  const router = useRouter();
  const { arId } = useParams();
  const { fetchJVMRequestCounts } = useJVM();
  const location = useLocation();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [arInfo, setArInfo] = useState({});
  

  const rowData = location.state || {};
  const reversalId = rowData._id; 
  const groupId = rowData.groupId; 

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 500);

    return () => clearTimeout(timer);
  }, [search]);

  const getData = useCallback(async () => {
    setLoading(true);
    try {
      if (!groupId) {
        throw new Error("No groupId available to fetch form items");
      }

      const response = await userRequest.get(`jvm/getFormItemsByGroupId`, {
        params: {
          groupId: groupId,
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
          lineNumber: page * rowsPerPage + index + 1,
          postingDate: new Date(row.postingDate),
          documentDate: new Date(row.documentDate),
          initiatedDate: new Date(row.createdAt),
          createdAt: new Date(row.createdAt),
        }));

        setData(processedData);
        setTotalCount(pagination.totalItems || 0);
      } else {
        throw new Error(response.data.message || "Failed to fetch form items");
      }
    } catch (error) {
      console.error("Error fetching form items:", error);
      showErrorMessage(error, "Failed to fetch form items", swal);
    } finally {
      setLoading(false);
    }
  }, [groupId, debouncedSearch, page, rowsPerPage]);

  const getRequestInfo = useCallback(async () => {
    try {
      if (!groupId) {
        return;
      }

      const response = await userRequest.get(
        `jvm/getReversalByGroupId?groupId=${groupId}`
      );

      if (response.data.statusCode === 200 || response.data.success) {
        const requestData = response.data.data;
        setArInfo(requestData || {});
      } else {
        throw new Error(
          response.data.message || "Failed to fetch request info"
        );
      }
    } catch (err) {
      console.error("Error fetching request info:", err);
      showErrorMessage(err, "Failed to fetch request details", swal);
    }
  }, [groupId]);

  useEffect(() => {
    if (groupId) {
      getRequestInfo();
    }
  }, [groupId, getRequestInfo]);

  useEffect(() => {
    if (groupId) {
      getData();
    }
  }, [groupId, getData]);

  const handleFilterChange = (filterType, value) => {
    if (filterType === "search") {
      setSearch(value);
      setPage(0);
    }
  };

  const handleFormSubmit = async (data) => {
    try {
      setLoading(true);

      if (!reversalId) {
        throw new Error("No reversal ID available for submission");
      }

      const submissionData = {
        reversalDate: data.reversalDate,
        fiscalYear: data.fiscalYear,
      };

      const response = await userRequest.post(
        `jvm/submitReversal/${reversalId}`,
        submissionData
      );

      if (response.data.statusCode === 200) {
        await Promise.all([getRequestInfo(), getData()]);
        await fetchJVMRequestCounts();
        swal({
          title: "Success",
          text: "Reversal submitted successfully!",
          icon: "success",
          buttons: true,
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
          canSubmit={(arInfo?.status || "") === "Pending"}
          initialData={{
            initiatedDate: arInfo.initiatedDate ? new Date(arInfo.initiatedDate) : (arInfo.createdAt ? new Date(arInfo.createdAt) : undefined),
            documentDate: arInfo.documentDate ? new Date(arInfo.documentDate) : undefined,
            sapDocumentNumber: arInfo.sapDocumentNumber || "",
            postingDate: arInfo.postingDate ? new Date(arInfo.postingDate) : undefined,
            reversalDate:
              arInfo.reversalRemarks === "02" || arInfo.reversalRemarks === 2
                ? (arInfo.reversalDate ? new Date(arInfo.reversalDate) : undefined)
                : (arInfo.postingDate ? new Date(arInfo.postingDate) : undefined),
            fiscalYear: new Date().getFullYear().toString(),
            reversalRemarks: arInfo.reversalRemarks || "",
            isReversalRemarks02:
              arInfo.reversalRemarks === "02" || arInfo.reversalRemarks === 2,
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
            {/* <FormTableToolbar
              search={search}
              onFilterChange={handleFilterChange}
              placeholder="Search"
            /> */}
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
              getRowClassName={(params) => {
                const status = params.row.status?.toLowerCase();
                if (status === "active") return "row-active";
                if (status === "completed") return "row-completed";
                return "";
              }}
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
                "& .row-active": {
                  backgroundColor: "#bbdefb !important",
                },
                "& .row-completed": {
                  backgroundColor: "#baf5c2 !important",
                },
              }}
            />
          </Box>
          <Box
            sx={{
              position: "relative",
              height: "52px", // Match DataGrid footer height
              marginTop: "-52px", // Overlap with DataGrid footer
              display: "flex",
              alignItems: "center",
              paddingLeft: "16px",
              zIndex: 0, // Lower z-index so pagination is clickable
              pointerEvents: "none", // Allow clicks to pass through
            }}
          >
            <Box sx={{ pointerEvents: "auto" }}>
              <ColorIndicators />
            </Box>
          </Box>
        </Card>
      </Container>
    </>
  );
}
