import React, { useState, useEffect, useCallback } from "react";
import Card from "@mui/material/Card";
import { DataGrid } from "@mui/x-data-grid";
import Container from "@mui/material/Container";
import { Box, Button, Typography } from "@mui/material";
import { userRequest } from "src/requestMethod";
import { showErrorMessage } from "src/utils/errorUtils";
import { Helmet } from "react-helmet-async";
import { JVMReportColumns } from "../components/JVMReportColumns";
import swal from "sweetalert";
import { FilterList } from "@mui/icons-material";
import FilterModal from "../../requested-jv/components/FilterModal";

export default function JVMReport() {
  const [allData, setAllData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openFilterModal, setOpenFilterModal] = useState(false);
  const [filterStartDate, setFilterStartDate] = useState("");
  const [filterEndDate, setFilterEndDate] = useState("");

  const fetchSAPData = async (groupId) => {
    try {
      const response = await userRequest.get(
        `jvm/getSapApiLogByGroupId?groupId=${groupId}`
      );
      if (response.data.statusCode === 200 && response.data.data) {
        return {
          sapStatus: response.data.data.EV_STATUS || "-",
          sapNumber: response.data.data.EV_ACCOUNTING_DOCUMENT_NUMBER || "-",
          sapMessage: response.data.data.EV_MESSAGE || "-",
        };
      }
    } catch (error) {
      const isNotFound =
        error.response?.data?.statusCode === 404 ||
        error.response?.data?.message?.toLowerCase().includes(
          "no sap api log found"
        );
      if (!isNotFound) {
        console.error("Error fetching SAP data for groupId:", groupId, error);
      }
    }
    return {
      sapStatus: "-",
      sapNumber: "-",
      sapMessage: "-",
    };
  };

  const getData = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: 1,
        limit: 10000,
      };

      if (filterStartDate) params.startDate = filterStartDate;
      if (filterEndDate) params.endDate = filterEndDate;

      const response = await userRequest.get("jvm/getForms", { params });

      if (response.data.statusCode === 200) {
        const apiData = response.data.data.data;
        const pagination = response.data.data.pagination;

        const reportData = [];

        for (const parentItem of apiData) {
          const parentId = parentItem.parentId;
          const parentData = {
            parentId,
            parentCreatedAt: parentItem.createdAt,
            parentStatus: parentItem.status,
            parentTotalDebit: parentItem.totalDebit || 0,
            parentTotalCredit: parentItem.totalCredit || 0,
            autoReversal: parentItem.autoReversal || false,
          };

          try {
            const groupsResponse = await userRequest.get(
              `jvm/getFormsByParentId?parentId=${parentId}`,
              {
                params: {
                  page: 1,
                  limit: 1000,
                },
              }
            );

            if (
              groupsResponse.data.statusCode === 200 &&
              groupsResponse.data.data.data
            ) {
              const groups = groupsResponse.data.data.data;

              for (const group of groups) {
                const groupId = group.groupId;
                const groupData = {
                  ...parentData,
                  groupId,
                  groupCreatedAt: group.createdAt,
                  groupTotalDebit: group.totalDebit || 0,
                  groupTotalCredit: group.totalCredit || 0,
                };

                const sapData = await fetchSAPData(groupId);
                const sapDataObj = {
                  sapStatus: sapData.sapStatus,
                  sapNumber: sapData.sapNumber,
                  sapMessage: sapData.sapMessage,
                };

                try {
                  const detailsResponse = await userRequest.get(
                    `jvm/getFormItemsByGroupId?groupId=${groupId}`,
                    {
                      params: {
                        page: 1,
                        limit: 1000,
                      },
                    }
                  );

                  if (
                    detailsResponse.data.statusCode === 200 &&
                    detailsResponse.data.data.items
                  ) {
                    const details = detailsResponse.data.data.items;

                    if (details.length === 0) {
                      reportData.push({
                        ...groupData,
                        ...sapDataObj,
                        id: `${parentId}-${groupId}-empty`,
                      });
                    } else {
                      for (const detail of details) {
                        reportData.push({
                          ...groupData,
                          ...sapDataObj,
                          ...detail,
                          id: detail._id || `${parentId}-${groupId}-${detail.slNo || Math.random()}`,
                        });
                      }
                    }
                  } else {
                    reportData.push({
                      ...groupData,
                      ...sapDataObj,
                      id: `${parentId}-${groupId}-no-details`,
                    });
                  }
                } catch (error) {
                  console.error(
                    "Error fetching details for groupId:",
                    groupId,
                    error
                  );
                  reportData.push({
                    ...groupData,
                    ...sapDataObj,
                    id: `${parentId}-${groupId}-error`,
                  });
                }
              }
            }
          } catch (error) {
            console.error("Error fetching groups for parentId:", parentId, error);
          }
        }

        setAllData(reportData);
      } else {
        throw new Error(response.data.message || "Failed to fetch data");
      }
    } catch (error) {
      console.error("Error fetching report data:", error);
      showErrorMessage(error, "Failed to fetch JVM report data", swal);
      setAllData([]);
    } finally {
      setLoading(false);
    }
  }, [filterStartDate, filterEndDate]);

  useEffect(() => {
    getData();
  }, [getData]);

  const handleOpenFilterModal = () => {
    setOpenFilterModal(true);
  };

  const handleCloseFilterModal = () => {
    setOpenFilterModal(false);
  };

  const columns = JVMReportColumns();

  return (
    <>
      <Helmet>
        <title>JVM Report</title>
      </Helmet>

      <Container>
        <Box sx={{ mt: 2, mb: 2 }}>
          <Typography variant="h4" sx={{ fontWeight: "bold", mb: 1 }}>
            JVM Report
          </Typography>
          <Typography variant="body2" sx={{ color: "text.secondary" }}>
            Comprehensive report merging data from Requested JVs, JVs by Group,
            JV Details, and SAP Status
          </Typography>
        </Box>

        <Card sx={{ mt: 2, p: 2 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              alignItems: "center",
              marginRight: "20px",
              mb: 1,
            }}
          >
            <Button
              variant="text"
              size="small"
              startIcon={<FilterList />}
              onClick={handleOpenFilterModal}
              sx={{
                ml: 2,
                backgroundColor: "transparent",
                minHeight: "auto",
                height: "32px",
                py: 0.5,
                px: 1,
                "&:hover": {
                  backgroundColor: "rgba(0, 0, 0, 0.04)",
                  height: "32px",
                  minHeight: "auto",
                },
                "&:focus": {
                  outline: "none",
                },
                "&:focus-visible": {
                  outline: "none",
                },
              }}
            >
              Filter
            </Button>
          </Box>

          <Box sx={{ width: "100%" }}>
            <DataGrid
              rows={allData || []}
              columns={columns}
              getRowId={(row) => row?.id}
              loading={loading}
              pagination
              paginationMode="client"
              pageSizeOptions={[5, 10, 25, 50, 100]}
              initialState={{
                pagination: {
                  paginationModel: { page: 0, pageSize: 10 },
                },
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
              }}
            />
          </Box>
        </Card>

        <FilterModal
          open={openFilterModal}
          handleClose={handleCloseFilterModal}
          setStartDate={setFilterStartDate}
          setEndDate={setFilterEndDate}
        />
      </Container>
    </>
  );
}
