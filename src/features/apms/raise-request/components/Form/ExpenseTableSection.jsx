import React, { useState, useMemo } from "react";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TextField,
  Button,
  IconButton,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import DownloadIcon from "@mui/icons-material/Download";
import * as XLSX from "xlsx";

const createEmptyRow = () => ({
  invoiceNo: "",
  invoiceDate: "",
  expenseType: "",
  inrValue: "",
  remark: "",
});

export default function ExpenseTableSection() {
  const [rows, setRows] = useState([createEmptyRow()]);
  const [uploadedData, setUploadedData] = useState(null);

  /* ---------- Derived States ---------- */

  const hasData = useMemo(
    () =>
      rows.some(
        (row) =>
          row.invoiceNo ||
          row.invoiceDate ||
          row.expenseType ||
          row.inrValue ||
          row.remark
      ),
    [rows]
  );

  /* ---------- Row Handlers ---------- */

  const handleChange = (index, field, value) => {
    setRows((prev) =>
      prev.map((row, i) =>
        i === index ? { ...row, [field]: value } : row
      )
    );
  };

  const addRow = () => {
    setRows((prev) => [...prev, createEmptyRow()]);
  };

  const removeRow = (index) => {
    setRows((prev) => prev.filter((_, i) => i !== index));
  };

  /* ---------- Upload ---------- */

  const handleUpload = () => {
    if (!hasData) return;

    const filteredRows = rows.filter(
      (row) =>
        row.invoiceNo ||
        row.invoiceDate ||
        row.expenseType ||
        row.inrValue ||
        row.remark
    );

    const payload = {
      uploadedAt: new Date().toISOString(),
      totalRows: filteredRows.length,
      data: filteredRows,
    };

    console.log("UPLOADED JSON PAYLOAD:", payload);

    // simulate successful upload
    setUploadedData(filteredRows);
  };

  /* ---------- Download ---------- */

  const exportFile = (type) => {
    const worksheet = XLSX.utils.json_to_sheet(uploadedData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Expenses");

    XLSX.writeFile(
      workbook,
      `expense-data.${type === "csv" ? "csv" : "xlsx"}`,
      { bookType: type }
    );
  };

  return (
    <Paper
      sx={{
        mt: 4,
        p: 2,
        borderRadius: "12px",
        boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
      }}
    >
      {/* TOP BAR */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        mb={2}
      >
        <Stack direction="row" spacing={1}>
          <Button startIcon={<AddIcon />} onClick={addRow}>
            Add Row
          </Button>

          <Button
            variant="contained"
            startIcon={<CloudUploadIcon />}
            onClick={handleUpload}
            disabled={!hasData}
          >
            Upload
          </Button>
        </Stack>

        {/* DOWNLOAD AFTER UPLOAD */}
        {uploadedData && (
          <Stack direction="row" spacing={1}>
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={() => exportFile("xlsx")}
            >
              Download XLSX
            </Button>
            <Button
              variant="outlined"
              startIcon={<DownloadIcon />}
              onClick={() => exportFile("csv")}
            >
              Download CSV
            </Button>
          </Stack>
        )}
      </Stack>

      {uploadedData && (
        <Typography
          sx={{ mb: 1, fontSize: 13, color: "success.main" }}
        >
          Upload successful. {uploadedData.length} rows processed.
        </Typography>
      )}

      {/* TABLE */}
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Invoice No</TableCell>
            <TableCell>Invoice Date</TableCell>
            <TableCell>Type of Expense</TableCell>
            <TableCell>INR Value</TableCell>
            <TableCell>Remark</TableCell>
            <TableCell>Action</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {rows.map((row, index) => (
            <TableRow key={index}>
              <TableCell>
                <TextField
                  size="small"
                  value={row.invoiceNo}
                  onChange={(e) =>
                    handleChange(index, "invoiceNo", e.target.value)
                  }
                />
              </TableCell>

              <TableCell>
                <TextField
                  type="date"
                  size="small"
                  InputLabelProps={{ shrink: true }}
                  value={row.invoiceDate}
                  onChange={(e) =>
                    handleChange(index, "invoiceDate", e.target.value)
                  }
                />
              </TableCell>

              <TableCell>
                <TextField
                  size="small"
                  value={row.expenseType}
                  onChange={(e) =>
                    handleChange(index, "expenseType", e.target.value)
                  }
                />
              </TableCell>

              <TableCell>
                <TextField
                  size="small"
                  type="number"
                  value={row.inrValue}
                  onChange={(e) =>
                    handleChange(index, "inrValue", e.target.value)
                  }
                />
              </TableCell>

              <TableCell>
                <TextField
                  size="small"
                  value={row.remark}
                  onChange={(e) =>
                    handleChange(index, "remark", e.target.value)
                  }
                />
              </TableCell>

              <TableCell>
                <IconButton
                  color="error"
                  onClick={() => removeRow(index)}
                >
                  <DeleteOutlineIcon />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
}
