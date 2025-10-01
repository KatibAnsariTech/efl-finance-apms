import { Box, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";

const DataGridComponent = ({ 
  data, 
  columns, 
  loading, 
  onUpdateEntry,
  page,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange
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
        pagination
        paginationMode="client"
        rowCount={data.length}
        paginationModel={{ page: page, pageSize: rowsPerPage }}
        onPaginationModelChange={(newModel) => {
          onPageChange(newModel.page);
          onRowsPerPageChange(newModel.pageSize);
        }}
        pageSizeOptions={[5, 10, 25, 50]}
        hideFooter={false}
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
          "& .MuiDataGrid-footerContainer": {
            borderTop: "1px solid #e0e0e0",
            backgroundColor: "#fafafa",
          },
          "& .MuiTablePagination-root": {
            color: "#637381",
          },
        }}
      />
    </Box>
  );
};

export default DataGridComponent;
