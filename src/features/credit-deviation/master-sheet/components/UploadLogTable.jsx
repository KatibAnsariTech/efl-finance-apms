import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { fDate, fTime } from "src/utils/format-time";
import { userRequest } from "src/requestMethod";
import swal from 'sweetalert';
import { showErrorMessage } from 'src/utils/errorUtils';

// Permission value to tab label mapping (should match master-sheet-view)
const tabLabelToPermission = {
  "Controlled Cheque": "controlledCheque",
  "CF Master": "cfMaster",
  "DSO Benchmark": "dsobenchmark",
  "DSO Standards": "dsostandard",
};

const UploadLogTable = ({ selectedTab, menuItems = [
  "Controlled Cheque",
  "CF Master",
  "DSO Benchmark",
  "DSO Standards",
] }) => {
  const [data, setData] = useState([]);
  const [rowCount, setRowCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 5,
  });

  // Use menuItems and selectedTab to determine permission value
  const getUploadLogAPIURL = () => {
    const tabLabel = menuItems[selectedTab] || "Controlled Cheque";
    const permission = tabLabelToPermission[tabLabel] || "controlledCheque";
    if (permission === "cfMaster") return "/admin/getAllCFMasters";
    if (permission === "dsobenchmark") return "/admin/getAllDSOBenchmarks";
    if (permission === "dsostandard") return "/admin/getAllDSOStandards";
    return "/admin/getAllControlledCheques";
  };

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await userRequest.get(getUploadLogAPIURL(), {
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
        id: row.uploadId,
        sno: startIndex + index + 1,
      }));

      setData(dataWithSno);
      setRowCount(total);
    } catch (err) {
      console.error("Failed to fetch upload logs:", err);
      showErrorMessage(err, "Failed to fetch upload logs", swal);
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
      field: "uploadedBy",
      headerName: "Uploaded By",
      flex: 1.5,
      align: "center",
      headerAlign: "center",
      renderCell: (params) => {
        const uploadedBy = params.row?.uploadedBy || {};
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
            <span>{uploadedBy.username || "-"}</span>
            <span style={{ fontSize: "11px", color: "#637381" }}>
              {uploadedBy.email || "-"}
            </span>
          </div>
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

export default UploadLogTable;
