import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { fDate, fTime } from "src/utils/format-time";
import { userRequest } from "src/requestMethod";
import swal from 'sweetalert';
import { showErrorMessage } from 'src/utils/errorUtils';

// Tab label to API endpoint mapping
const tabLabelToAPI = {
  "Document Type": "/admin/getAllDocumentTypes",
  "Posting Key": "/admin/getAllPostingKeys", 
  "Hierarchy": "/admin/getAllHierarchies"
};

const ImportPayment = ({ selectedTab, menuItems = [
  "Document Type",
  "Posting Key", 
  "Hierarchy"
] }) => {
  const [data, setData] = useState([]);
  const [rowCount, setRowCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5,
  });

  // Get API URL based on selected tab
  const getLogAPIURL = () => {
    const tabLabel = menuItems[selectedTab] || "Document Type";
    return tabLabelToAPI[tabLabel] || "/admin/getAllDocumentTypes";
  };

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await userRequest.get(getLogAPIURL(), {
        params: {
          page: paginationModel.page + 1,
          limit: paginationModel.pageSize,
        },
      });

      const result = res?.data?.data?.data || [];
      const total = res?.data?.data?.total || 0;

      const startIndex = paginationModel.page * paginationModel.pageSize;
      const dataWithSno = result.map((row, index) => ({
        ...row,
        id: row.id || row._id || `log-${index}`,
        sno: startIndex + index + 1,
      }));

      setData(dataWithSno);
      setRowCount(total);
    } catch (err) {
      console.error("Failed to fetch JVM logs:", err);
      showErrorMessage(err, "Failed to fetch JVM logs", swal);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [paginationModel, selectedTab]);

  const columns = [
    {
      field: "sno",
      headerName: "S.No",
      width: 100,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "createdAt",
      headerName: "Date",
      flex: 1,
      align: "center",
      headerAlign: "center",
      renderCell: (params) =>
        params.row?.createdAt ? fDate(params.row.createdAt) : "-",
    },
    {
      field: "time",
      headerName: "Time",
      flex: 1,
      align: "center",
      headerAlign: "center",
      renderCell: (params) =>
        params.row?.createdAt ? fTime(params.row.createdAt) : "-",
    },
    {
      field: "createdBy",
      headerName: "Created By",
      flex: 1.5,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        const createdBy = params.row?.createdBy || params.row?.uploadedBy || {};
        return (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              textAlign: "center",
              width: "100%",
              lineHeight: 1.4,
            }}
          >
            <span>{createdBy.username || createdBy.name || "-"}</span>
            <span style={{ fontSize: "11px", color: "#637381" }}>
              {createdBy.email || "-"}
            </span>
          </div>
        );
      },
    },
    {
      field: "updatedAt",
      headerName: "Last Updated",
      flex: 1,
      align: "center",
      headerAlign: "center",
      renderCell: (params) =>
        params.row?.updatedAt ? fDate(params.row.updatedAt) : "-",
    },
    {
      field: "status",
      headerName: "Status",
      flex: 1,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        const status = params.row?.status || params.row?.isActive;
        return (
          <span
            style={{
              padding: "4px 8px",
              borderRadius: "4px",
              fontSize: "12px",
              fontWeight: "bold",
              backgroundColor: status ? "#e8f5e8" : "#ffeaea",
              color: status ? "#2e7d32" : "#d32f2f",
            }}
          >
            {status ? "Active" : "Inactive"}
          </span>
        );
      },
    },
  ];

  return (
    <DataGrid
      rows={data}
      columns={columns}
      getRowId={(row) => row.id}
      loading={loading}
      pagination
      paginationMode="server"
      rowCount={rowCount}
      paginationModel={paginationModel}
      onPaginationModelChange={setPaginationModel}
      pageSizeOptions={[5, 10, 25]}
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
        "& .MuiDataGrid-row": {
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
      }}
    />
  );
};

export default ImportPayment;
