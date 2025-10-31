import React, { useState, useEffect } from "react";
import { DataGrid, GridActionsCellItem } from "@mui/x-data-grid";
import { 
  IconButton, 
  Box, 
  Typography, 
  Chip, 
  Card, 
  CardContent,
  Tooltip,
  Stack
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Iconify from "src/components/iconify";
import { userRequest } from "src/requestMethod";
import { fDate } from "src/utils/format-time";
import { fCurrency } from "src/utils/format-number";
import swal from "sweetalert";
import { showErrorMessage } from "src/utils/errorUtils";
import CircularIndeterminate from "src/utils/loader";

export default function ApprovalAuthorityTable({ 
  handleEdit: parentHandleEdit, 
  handleDelete: parentHandleDelete, 
  refreshTrigger, 
  tabChangeTrigger 
}) {
  const theme = useTheme();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [rowCount, setRowCount] = useState(0);
  const [approverCategories, setApproverCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);

  const fetchApproverCategories = async () => {
    setCategoriesLoading(true);
    try {
      const response = await userRequest.get("/cpx/getApproverCategories", {
        params: {
          page: 1,
          limit: 100, // Fetch all categories
        },
      });

      const categories = response.data.data.items || response.data.data.approverCategories || [];
      // Filter only active categories if needed, or show all
      setApproverCategories(categories);
    } catch (error) {
      console.error("Error fetching Approver Categories:", error);
      showErrorMessage(error, "Error fetching Approver Categories", swal);
      setApproverCategories([]);
    } finally {
      setCategoriesLoading(false);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await userRequest.get("/cpx/getApproverAuthorities", {
        params: {
          page: page + 1,
          limit: rowsPerPage,
        },
      });

      const apiData = response.data.data.items || response.data.data.approvalAuthority || [];
      const totalCount = response.data.data.pagination?.total || 0;

      const mappedData = apiData.map((item, index) => {
        const rowData = {
          id: item._id,
          limitFrom: item.limitFrom || item.valueFrom || 0,
          limitTo: item.limitTo || item.valueTo || null,
          ...item,
        };

        // Map approvers to row data based on category IDs
        if (item.approvers && Array.isArray(item.approvers)) {
          item.approvers.forEach((approver) => {
            const categoryId = approver.approverCategory?._id;
            if (categoryId) {
              // Store the willApprove status using category ID as key
              rowData[`approver_${categoryId}`] = approver.willApprove || false;
            }
          });
        }

        return rowData;
      });

      setData(mappedData);
      setRowCount(totalCount);
    } catch (error) {
      console.error("Error fetching Approval Authority data:", error);
      showErrorMessage(error, "Error fetching Approval Authority data", swal);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApproverCategories();
  }, []);

  useEffect(() => {
    fetchData();
  }, [page, rowsPerPage, refreshTrigger]);

  useEffect(() => {
    if (tabChangeTrigger > 0 || refreshTrigger > 0) {
      setPage(0);
    }
  }, [tabChangeTrigger, refreshTrigger]);

  const handleEdit = (id) => {
    if (parentHandleEdit) {
      const rowData = data.find(item => item.id === id);
      parentHandleEdit(rowData);
    } else {
      alert(`Edit Approval Authority: ${id}`);
    }
  };

  const handleDelete = (id) => {
    if (parentHandleDelete) {
      parentHandleDelete(id);
    } else {
      alert(`Delete Approval Authority: ${id}`);
    }
  };

  const formatCurrency = (value) => {
    if (value >= 10000000) {
      return `${(value / 10000000).toFixed(1)} Cr`;
    } else if (value >= 100000) {
      return `${(value / 100000).toFixed(1)} L`;
    } else {
      return `${value.toLocaleString()}`;
    }
  };

  const getValueRangeText = (limitFrom, limitTo) => {
    const fromText = formatCurrency(limitFrom);
    const toText = limitTo ? formatCurrency(limitTo) : "Above";
    return `${fromText} - ${toText}`;
  };

  const ApprovalChip = ({ approved, label }) => (
    <Chip
      label={approved ? "Required" : "Not Required"}
      size="small"
      color={approved ? "success" : "default"}
      variant={approved ? "filled" : "outlined"}
      sx={{
        fontSize: "11px",
        height: "24px",
        fontWeight: 500,
        minWidth: "80px",
      }}
    />
  );

  // Build dynamic columns based on approver categories
  const buildColumns = () => {
    const baseColumns = [
      {
        field: "valueRange",
        headerName: "Project Value Range (INR)",
        minWidth: 200,
        flex: 1,
        sortable: false,
        align: "center",
        headerAlign: "center",
        renderCell: (params) => (
          <Box sx={{ 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "center",
            height: "100%",
            textAlign: "center" 
          }}>
            <Typography variant="body2" sx={{ fontWeight: 600, color: "primary.main" }}>
              {getValueRangeText(params.row.limitFrom, params.row.limitTo)}
            </Typography>
          </Box>
        ),
      },
    ];

    // Sort approver categories: A (topmost hierarchy) should show last
    // Sort in reverse alphabetical order so A appears last
    const sortedCategories = [...approverCategories].sort((a, b) => {
      const categoryA = (a.category || a.name || "").toUpperCase();
      const categoryB = (b.category || b.name || "").toUpperCase();
      return categoryB.localeCompare(categoryA);
    });

    // Add dynamic columns for each approver category
    const dynamicColumns = sortedCategories.map((category) => {
      const categoryId = category._id;
      const headerName = category.category || category.name || "Unknown";
      const management = category.management || "";
      const fullHeaderName = management ? `${headerName} (${management})` : headerName;

      return {
        field: `approver_${categoryId}`,
        headerName: fullHeaderName,
        width: 150,
        sortable: false,
        align: "center",
        headerAlign: "center",
        renderCell: (params) => {
          const willApprove = params.value || false;
          return <ApprovalChip approved={willApprove} label={headerName} />;
        },
      };
    });

    // Add actions column
    const actionsColumn = {
      field: "actions",
      headerName: "Actions",
      width: 120,
      sortable: false,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => [
        <GridActionsCellItem
          key="edit"
          icon={
            <Tooltip title="Edit">
              <IconButton color="primary" size="small">
                <Iconify icon="eva:edit-fill" />
              </IconButton>
            </Tooltip>
          }
          label="Edit"
          onClick={() => handleEdit(params.id)}
        />,
        <GridActionsCellItem
          key="delete"
          icon={
            <Tooltip title="Delete">
              <IconButton color="error" size="small">
                <Iconify icon="eva:trash-2-fill" />
              </IconButton>
            </Tooltip>
          }
          label="Delete"
          onClick={() => handleDelete(params.id)}
        />,
      ],
    };

    return [...baseColumns, ...dynamicColumns, actionsColumn];
  };

  const columns = buildColumns();

  if (loading || categoriesLoading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: 400 }}>
        <CircularIndeterminate />
      </Box>
    );
  }

  return (
    <Card sx={{ boxShadow: 3, borderRadius: 2 }}>
      <CardContent sx={{ p: 0 }}>
        <Box sx={{ width: "100%" }}>
          <DataGrid
            rows={data}
            columns={columns}
            page={page}
            pageSize={rowsPerPage}
            rowsPerPageOptions={[5, 10, 25, 50]}
            onPageChange={(newPage) => setPage(newPage)}
            onPageSizeChange={(newPageSize) => {
              setRowsPerPage(newPageSize);
              setPage(0);
            }}
            rowCount={rowCount}
            paginationMode="server"
            loading={loading}
            autoHeight
            disableSelectionOnClick
            sx={{
              border: "none",
              "& .MuiDataGrid-cell": {
                borderBottom: "1px solid #f0f0f0",
              },
              "& .MuiDataGrid-columnHeaders": {
                backgroundColor: theme.palette.grey[50],
                borderBottom: "2px solid #e0e0e0",
                fontWeight: 600,
              },
              "& .MuiDataGrid-row:hover": {
                backgroundColor: theme.palette.action.hover,
              },
            }}
          />
        </Box>
      </CardContent>
    </Card>
  );
}
