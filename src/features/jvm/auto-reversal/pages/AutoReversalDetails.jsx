import React from "react";
import { useState, useEffect } from "react";
import Card from "@mui/material/Card";
import { DataGrid } from "@mui/x-data-grid";
import Container from "@mui/material/Container";
import CircularIndeterminate from "src/utils/loader";
import { FormTableToolbar } from "src/components/table";
import { getComparator } from "src/utils/utils";
import { userRequest } from "src/requestMethod";
import { useRouter } from "src/routes/hooks";
import { Box, Tooltip, Typography, IconButton } from "@mui/material";
import { fDateTime } from "src/utils/format-time";
import { Helmet } from "react-helmet-async";
import { useParams, useLocation } from "react-router-dom";
import { AutoReversalForm } from "../components/AutoReversalDetail";
import swal from "sweetalert";
import { showErrorMessage } from "src/utils/errorUtils";
import { AutoReversalDetailsColumns } from "../components/AutoReversalDetailsColumns";
// import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function AutoReversalDetails() {
  const router = useRouter();
  const { arId } = useParams();
  const location = useLocation();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [totalCount, setTotalCount] = useState(0);
  const [search, setSearch] = useState("");
  const [arInfo, setArInfo] = useState({});

  const getData = async () => {
    setLoading(true);
    try {
      // Get groupId from passed data or use arId as fallback
      let groupId = null;

      // Check if we have data passed from the previous page
      let passedData = location.state;

      // If location.state is null, try to get data from localStorage
      if (!passedData) {
        const storedData = localStorage.getItem("arDetailData");
        if (storedData) {
          try {
            passedData = JSON.parse(storedData);
            // Clear the stored data after retrieving
            localStorage.removeItem("arDetailData");
          } catch (error) {
            console.error("Error parsing stored data:", error);
          }
        }
      }

      if (passedData && passedData.groupId) {
        groupId = passedData.groupId;
      } else if (arId) {
        // Use arId as groupId if no passed data
        groupId = arId;
      }

      if (groupId) {
        // Call the API to get form items by groupId
        const response = await userRequest.get(`jvm/getFormItemsByGroupId`, {
          params: {
            groupId: groupId,
            page: 1,
            limit: 10, // Get 10 items
          },
        });

        if (response.data.statusCode === 200) {
          const responseData = response.data.data;
          const apiData = responseData.items || [];
          const pagination = responseData.pagination || {};

          // Get main table data from passed data (from AutoReversal table)
          const mainTableData = passedData || {};

          // Process the API response data
          const processedData = apiData.map((row, index) => ({
            ...row,
            id: row._id || row.itemId || `row_${index}`,
            lineNumber: index + 1,
            // Use main table data for these dates
            postingDate: new Date(
              mainTableData.postingDate ||
                mainTableData.createdAt ||
                row.createdAt
            ),
            documentDate: new Date(
              mainTableData.documentDate ||
                mainTableData.createdAt ||
                row.createdAt
            ),
            initiatedDate: new Date(mainTableData.createdAt || row.createdAt), // Use createdAt as initiated date
            createdAt: new Date(row.createdAt),
          }));

          // Create AR info from main table data (passed from AutoReversal)
          const arHeaderInfo = {
            requestNo: mainTableData.requestNo || groupId,
            status: mainTableData.status || "Unknown",
            totalDebit: mainTableData.totalDebit || 0,
            totalCredit: mainTableData.totalCredit || 0,
            createdDate: new Date(mainTableData.createdAt || new Date()),
            initiatedDate: new Date(mainTableData.createdAt || new Date()),
            documentDate: new Date(
              mainTableData.documentDate ||
                mainTableData.createdAt ||
                new Date()
            ),
            postingDate: new Date(
              mainTableData.postingDate || mainTableData.createdAt || new Date()
            ),
            startDate: mainTableData.startDate
              ? new Date(mainTableData.startDate)
              : null,
            endDate: mainTableData.endDate
              ? new Date(mainTableData.endDate)
              : null,
            requesterId: mainTableData.requesterId || null,
            groupId: mainTableData.groupId || groupId,
            parentId: mainTableData.parentId || null,
            mainTableId: mainTableData._id || null, // Store the main table's _id
          };

          setData(processedData);
          setArInfo(arHeaderInfo);
          setTotalCount(pagination.totalItems || processedData.length);
        } else {
          throw new Error(
            response.data.message || "Failed to fetch form items"
          );
        }
      } else {
        // If no groupId, try to use passed data directly
        if (passedData && passedData.groupId) {
          groupId = passedData.groupId;
          // Retry with the groupId from passed data
          const response = await userRequest.get(`jvm/getFormItemsByGroupId`, {
            params: {
              groupId: groupId,
              page: 1,
              limit: 10,
            },
          });

          if (response.data.statusCode === 200) {
            const responseData = response.data.data;
            const apiData = responseData.items || [];
            const pagination = responseData.pagination || {};

            const processedData = apiData.map((row, index) => ({
              ...row,
              id: row._id || row.itemId || `row_${index}`,
              lineNumber: index + 1,
              postingDate: new Date(
                passedData.postingDate || passedData.createdAt || row.createdAt
              ),
              documentDate: new Date(
                passedData.documentDate || passedData.createdAt || row.createdAt
              ),
              initiatedDate: new Date(passedData.createdAt || row.createdAt),
              createdAt: new Date(row.createdAt),
            }));

            const arHeaderInfo = {
              requestNo: passedData.requestNo || groupId,
              status: passedData.status || "Unknown",
              totalDebit: passedData.totalDebit || 0,
              totalCredit: passedData.totalCredit || 0,
              createdDate: new Date(passedData.createdAt || new Date()),
              initiatedDate: new Date(passedData.createdAt || new Date()),
              documentDate: new Date(
                passedData.documentDate || passedData.createdAt || new Date()
              ),
              postingDate: new Date(
                passedData.postingDate || passedData.createdAt || new Date()
              ),
              startDate: passedData.startDate
                ? new Date(passedData.startDate)
                : null,
              endDate: passedData.endDate ? new Date(passedData.endDate) : null,
              requesterId: passedData.requesterId || null,
              groupId: passedData.groupId || groupId,
              parentId: passedData.parentId || null,
              mainTableId: passedData._id || null, // Store the main table's _id
            };

            setData(processedData);
            setArInfo(arHeaderInfo);
            setTotalCount(pagination.totalItems || processedData.length);
          } else {
            throw new Error(
              response.data.message || "Failed to fetch form items"
            );
          }
        } else {
          throw new Error("No groupId available to fetch form items");
        }
      }
    } catch (error) {
      console.error("Error fetching form items:", error);
      showErrorMessage(error, "Failed to fetch form items", swal);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (arId) {
      getData();
    }
  }, [arId, page, rowsPerPage]);

  const handleFilterChange = (filterType, value) => {
    if (filterType === "search") {
      setSearch(value);
    }
  };

  const handleFormSubmit = async (formData) => {
    try {
      setLoading(true);

      // Get the reversal ID from the main table data (arInfo)
      const reversalId = arInfo.mainTableId || arId;

      if (!reversalId) {
        throw new Error("No reversal ID available for submission");
      }

      // Prepare the submission data
      const submissionData = {
        reversalRemarks:
          formData.reversalRemarks || "Reversal processed successfully",
        reversalDate:
          formData.reversalDate || new Date().getFullYear().toString(),
        fiscalYear: formData.fiscalYear || new Date().getFullYear().toString(),
      };

      // Call the submitReversal API
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

  // Get columns from separate file
  const columns = AutoReversalDetailsColumns();

  // Apply filtering and sorting to the data
  const dataFiltered = (() => {
    let filteredData = [...data];

    // Apply search filter if search term exists
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

    // Apply sorting
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
        <title>Auto Reversal Detail</title>
      </Helmet>

      <Container>
        {/* Auto-Reversal Form */}
        <AutoReversalForm
          onSubmit={handleFormSubmit}
          initialData={{
            initiatedDate: arInfo.initiatedDate,
            documentDate: arInfo.documentDate,
            postingDate: arInfo.postingDate,
            fiscalYear:
              arInfo.fiscalYear || new Date().getFullYear().toString(),
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
              rows={dataFiltered || []}
              columns={columns}
              getRowId={(row) => row?.id}
              loading={loading}
              pagination
              paginationMode="client"
              rowCount={dataFiltered.length}
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
