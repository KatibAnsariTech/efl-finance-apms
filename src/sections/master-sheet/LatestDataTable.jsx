import React, { useEffect, useState } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { Box } from "@mui/material";
import { userRequest } from "src/requestMethod";
import swal from 'sweetalert';
import { showErrorMessage } from 'src/utils/errorUtils';

export default function LatestDataTable({
  selectedTab,
  paginationModel,
  setPaginationModel,
  headLabel,
  apiUrl,
  onDataUpdate,
  refreshKey,
  menuItems,
}) {
  const [data, setData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const getData = async () => {
    try {
      setLoading(true);
      const res = await userRequest.get(apiUrl, {
        params: {
          page: paginationModel.page + 1,
          limit: paginationModel.pageSize,
        },
      });

      const result = res?.data?.data?.data || [];
      const startIndex = paginationModel.page * paginationModel.pageSize;
      const dataWithSno = result.map((item, index) => ({
        ...item,
        sno: startIndex + index + 1,
      }));

      setData(dataWithSno);
      setTotalCount(res?.data?.data?.total || 0);
      onDataUpdate?.(dataWithSno);
    } catch (error) {
      console.error("LatestData fetch failed", error);
      showErrorMessage(error, "Failed to fetch latest data", swal);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, [paginationModel, selectedTab, refreshKey]);

  const renderControlCheque = (params) => {
    const value = params.value;
    const isYes = value === "Yes";
    
    return (
      <Box
        sx={{
          color: isYes ? "inherit" : "#d32f2f",
          fontWeight: isYes ? "inherit" : "bold",
        }}
      >
        {isYes ? value : "No"}
      </Box>
    );
  };

  const columns = headLabel(selectedTab, menuItems).map((col) => {
    const columnConfig = {
      field: col.id,
      headerName: col.label,
      flex: 1,
      sortable: col.sortable !== false,
      align: col.align || "center",
      headerAlign: col.align || "center",
      minWidth: col.minWidth || 100,
    };

    if (col.id === "chequeAvailability") {
      columnConfig.renderCell = renderControlCheque;
    }

    return columnConfig;
  });

  return (
    <DataGrid
      rows={data}
      columns={columns}
      getRowId={(row) => row?.sno}
      loading={loading}
      pagination
      paginationMode="server"
      rowCount={totalCount}
      paginationModel={paginationModel}
      onPaginationModelChange={setPaginationModel}
      pageSizeOptions={[5, 10, 25]}
      autoHeight
      disableRowSelectionOnClick
      sx={{
        "& .MuiDataGrid-cell": {
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
      }}
    />
  );
}
