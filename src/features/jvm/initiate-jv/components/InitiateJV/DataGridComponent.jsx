import { Box, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

const DataGridComponent = ({ 
  data, 
  columns, 
  loading, 
  onUpdateEntry 
}) => {
  return (
    <Box
      sx={{
        height: "calc(100vh - 220px)",
        marginBottom: { xs: "0px", sm: "0px" },
        minHeight: "300px",
        maxHeight: "70vh",
      }}
    >
      <DataGrid
        rows={data}
        columns={columns}
        getRowId={(row) => row._id || row.slNo}
        loading={loading}
        pagination={false}
        disableRowSelectionOnClick
        disableRowClick
        columnResize
        disableColumnResize={false}
        autoHeight={false}
        columnResizeMode="onResize"
        editMode="cell"
        processRowUpdate={(updatedRow, originalRow) => {
          onUpdateEntry(updatedRow);
          return updatedRow;
        }}
        onProcessRowUpdateError={(error) => {
          console.error("Error updating row:", error);
        }}
        slots={{
          footer: () => (
            <Box
              sx={{
                py: 2,
                pl: 2,
                pr: 1,
                display: "flex",
                alignItems: "center",
              }}
            >
              <Typography
                variant="body2"
                sx={{ fontSize: "0.875rem", fontWeight: 700 }}
              >
                Total Records: {data.length}
              </Typography>
            </Box>
          ),
        }}
        sx={{
          height: "100%",
          border: "none",
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
          "& .MuiDataGrid-cell:focus": {
            outline: "none",
          },
          "& .MuiDataGrid-row:hover": {
            backgroundColor: "rgba(0, 0, 0, 0.04)",
          },
        }}
      />
    </Box>
  );
};

export default DataGridComponent;
