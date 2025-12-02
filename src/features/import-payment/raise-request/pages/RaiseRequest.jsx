import React, { useCallback, useRef } from "react";
import { Helmet } from "react-helmet-async";
import {
  Box,
  Button,
  Chip,
  Container,
  Divider,
  Grid,
  InputAdornment,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { importPaymentRequestSchema } from "../utils/validationSchemas";
import swal from "sweetalert";

const departmentOptions = ["Operations", "Finance", "Supply Chain", "Commercial"];
const scopeOptions = ["Advance Payment", "Balance Payment"];
const importTypeOptions = ["Advance Payment", "Standard Import", "LC Payment"];
const purchaseTypeOptions = ["Goods", "Services"];
const currencyOptions = [
  { value: "USD", label: "USD - US Dollar" },
  { value: "INR", label: "INR - Indian Rupee" },
  { value: "EUR", label: "EUR - Euro" },
];
const vendorOptions = ["Select Vendor from Master", "Vendor One", "Vendor Two"];

const formatFileSize = (size) => {
  if (!size && size !== 0) return "";
  const kb = size / 1024;
  if (kb < 1024) return `${kb.toFixed(1)} KB`;
  return `${(kb / 1024).toFixed(2)} MB`;
};

const UploadDropZone = ({ label, helperText, value = [], error, onChange }) => {
  const inputRef = useRef(null);

  const handleFiles = useCallback(
    (files) => {
      const normalized = Array.from(files || []);
      onChange(normalized);
    },
    [onChange]
  );

  const onDrop = useCallback(
    (event) => {
      event.preventDefault();
      handleFiles(event.dataTransfer.files);
    },
    [handleFiles]
  );

  const onFileInputChange = useCallback(
    (event) => {
      handleFiles(event.target.files);
    },
    [handleFiles]
  );

  const removeFile = (index) => {
    const updated = value.filter((_, fileIndex) => fileIndex !== index);
    onChange(updated);
  };

  return (
    <Box
      onDrop={onDrop}
      onDragOver={(event) => event.preventDefault()}
      sx={{
        border: "1px dashed",
        borderColor: error ? "error.main" : "divider",
        borderRadius: 3,
        p: 4,
        textAlign: "center",
        backgroundColor: "#F9FAFC",
      }}
    >
      <input
        ref={inputRef}
        type="file"
        multiple
        hidden
        onChange={onFileInputChange}
      />
      <CloudUploadOutlinedIcon color="primary" fontSize="large" />
      <Typography variant="subtitle1" sx={{ mt: 2, fontWeight: 600 }}>
        {label} *
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
        Upload files or drag and drop
      </Typography>
      <Typography variant="caption" color="text.secondary">
        {helperText}
      </Typography>
      <Box sx={{ mt: 2 }}>
        <Button
          variant="outlined"
          size="small"
          onClick={() => inputRef.current?.click()}
        >
          Upload files
        </Button>
      </Box>
      {value?.length > 0 && (
        <Stack spacing={1.5} sx={{ mt: 3 }}>
          {value.map((file, index) => (
            <Chip
              key={`${file.name}-${index}`}
              label={`${file.name} • ${formatFileSize(file.size)}`}
              onDelete={() => removeFile(index)}
              variant="outlined"
            />
          ))}
        </Stack>
      )}
      {error && (
        <Typography variant="caption" color="error" display="block" sx={{ mt: 1 }}>
          {error}
        </Typography>
      )}
    </Box>
  );
};

export default function IMTRaiseRequest() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(importPaymentRequestSchema),
    mode: "onBlur",
    defaultValues: {
      assignedDepartment: "",
      typeOfImport: "Advance Payment",
      department: "Operations",
      scope: "Advance Payment",
      selectType: "Goods",
      poDate: null,
      poNumber: "",
      partyName: "",
      grnDate: null,
      poAmount: 0,
      currencyType: "USD",
      advanceAmount: 0,
      advancePercentage: 0,
      paymentTerms: "",
      poUpload: [],
      piUpload: [],
    },
  });

  const onSubmit = (data) => {
    console.table(data);
    swal("Success!", "Import payment request submitted successfully!", "success");
  };

  return (
    <>
      <Helmet>
        <title>Import Payment | Raise Request</title>
      </Helmet>
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Box sx={{ backgroundColor: "#F4F6F8", minHeight: "100vh", py: 4 }}>
          <Container maxWidth="lg">
            <Box component="form" onSubmit={handleSubmit(onSubmit)}>
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 3, md: 4 },
                  borderRadius: 4,
                  boxShadow:
                    "0px 20px 45px rgba(15, 41, 88, 0.08), 0px 2px 6px rgba(15, 41, 88, 0.04)",
                  backgroundColor: "#fff",
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "space-between",
                    gap: 2,
                  }}
                >
                  <Box>
                    <Typography variant="h5" fontWeight={600}>
                      Import / Advance Request
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      Fill the required details below to proceed with the request.
                    </Typography>
                  </Box>
                  <Button type="submit" variant="contained" size="large">
                    Submit Request
                  </Button>
                </Box>

                <Divider sx={{ my: 3 }} />

                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Controller
                      name="assignedDepartment"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          select
                          fullWidth
                          label="Assigned Department"
                          placeholder="Select Department"
                          error={!!errors.assignedDepartment}
                          helperText={errors.assignedDepartment?.message}
                        >
                          {departmentOptions.map((option) => (
                            <MenuItem key={option} value={option}>
                              {option}
                            </MenuItem>
                          ))}
                        </TextField>
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Controller
                      name="typeOfImport"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          select
                          fullWidth
                          label="Type of Import"
                          error={!!errors.typeOfImport}
                          helperText={errors.typeOfImport?.message}
                        >
                          {importTypeOptions.map((option) => (
                            <MenuItem key={option} value={option}>
                              {option}
                            </MenuItem>
                          ))}
                        </TextField>
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Controller
                      name="department"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          select
                          fullWidth
                          label="Department"
                          disabled
                          helperText="Auto-selected based on your role"
                        >
                          {departmentOptions.map((option) => (
                            <MenuItem key={option} value={option}>
                              {option}
                            </MenuItem>
                          ))}
                        </TextField>
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Controller
                      name="scope"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          select
                          fullWidth
                          label="Scope (Dependent on Type)"
                          error={!!errors.scope}
                          helperText={errors.scope?.message}
                        >
                          {scopeOptions.map((option) => (
                            <MenuItem key={option} value={option}>
                              {option}
                            </MenuItem>
                          ))}
                        </TextField>
                      )}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Controller
                      name="selectType"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          select
                          fullWidth
                          label="Select Type"
                          error={!!errors.selectType}
                          helperText={errors.selectType?.message}
                        >
                          {purchaseTypeOptions.map((option) => (
                            <MenuItem key={option} value={option}>
                              {option}
                            </MenuItem>
                          ))}
                        </TextField>
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Controller
                      name="poDate"
                      control={control}
                      render={({ field }) => (
                        <DatePicker
                          {...field}
                          label="PO Date"
                          format="dd/MM/yyyy"
                          slotProps={{
                            textField: {
                              fullWidth: true,
                              error: !!errors.poDate,
                              helperText: errors.poDate?.message,
                            },
                          }}
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Controller
                      name="poNumber"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          label="PO Number"
                          placeholder="e.g. PO-2024-8892"
                          error={!!errors.poNumber}
                          helperText={errors.poNumber?.message}
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Controller
                      name="partyName"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          select
                          fullWidth
                          label="Party Name (Vendor)"
                          error={!!errors.partyName}
                          helperText={errors.partyName?.message}
                        >
                          {vendorOptions.map((option) => (
                            <MenuItem key={option} value={option}>
                              {option}
                            </MenuItem>
                          ))}
                        </TextField>
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Controller
                      name="grnDate"
                      control={control}
                      render={({ field }) => (
                        <DatePicker
                          {...field}
                          label="GRN Date"
                          format="dd/MM/yyyy"
                          slotProps={{
                            textField: {
                              fullWidth: true,
                              error: !!errors.grnDate,
                              helperText: errors.grnDate?.message,
                            },
                          }}
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Controller
                      name="poAmount"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          type="number"
                          label="PO Amount"
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <AttachMoneyIcon fontSize="small" />
                              </InputAdornment>
                            ),
                          }}
                          error={!!errors.poAmount}
                          helperText={errors.poAmount?.message}
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Controller
                      name="currencyType"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          select
                          fullWidth
                          label="Currency Type"
                          error={!!errors.currencyType}
                          helperText={errors.currencyType?.message}
                        >
                          {currencyOptions.map((option) => (
                            <MenuItem key={option.value} value={option.value}>
                              {option.label}
                            </MenuItem>
                          ))}
                        </TextField>
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Controller
                      name="advanceAmount"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          type="number"
                          label="Advance Amount"
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                <AttachMoneyIcon fontSize="small" />
                              </InputAdornment>
                            ),
                          }}
                          error={!!errors.advanceAmount}
                          helperText={errors.advanceAmount?.message}
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Controller
                      name="advancePercentage"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          type="number"
                          label="Advance Percentage"
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">
                                Percent %
                              </InputAdornment>
                            ),
                          }}
                          error={!!errors.advancePercentage}
                          helperText={errors.advancePercentage?.message}
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Controller
                      name="paymentTerms"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          multiline
                          minRows={4}
                          fullWidth
                          label="Payment Terms"
                          placeholder="Write text"
                          error={!!errors.paymentTerms}
                          helperText={errors.paymentTerms?.message}
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Controller
                      name="poUpload"
                      control={control}
                      render={({ field }) => (
                        <UploadDropZone
                          label="PO Upload"
                          helperText="PDF, PNG, JPG up to 10MB (PO required)"
                          value={field.value}
                          onChange={field.onChange}
                          error={errors.poUpload?.message}
                        />
                      )}
                    />
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Controller
                      name="piUpload"
                      control={control}
                      render={({ field }) => (
                        <UploadDropZone
                          label="PI Upload"
                          helperText="PDF, PNG, JPG up to 10MB (PI required)"
                          value={field.value}
                          onChange={field.onChange}
                          error={errors.piUpload?.message}
                        />
                      )}
                    />
                  </Grid>
                </Grid>
              </Paper>
            </Box>
          </Container>
        </Box>
      </LocalizationProvider>
    </>
  );
}
