import React, { useCallback, useRef, useState, useEffect } from "react";
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
import { useForm, Controller, Watch } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import swal from "sweetalert";
import { userRequest } from "src/requestMethod";

import { importPaymentRequestSchema } from "../utils/validationSchemas";

// ------------------- FILE UPLOAD FUNCTION ------------------------
const uploadFilesToServer = async (files) => {
  const uploadedURLs = [];

  for (const file of files) {
    const formData = new FormData();
    formData.append("file", file);

    const res = await userRequest.post("/util/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });

    // 👍 Using A option → file URL from res.data.data
    uploadedURLs.push(res.data.data);
  }

  return uploadedURLs;
};

// ------------------- REUSABLE DROPZONE COMPONENT ------------------------
const UploadDropZone = ({ label, helperText, value = [], error, onChange }) => {
  const inputRef = useRef(null);

  const handleFiles = useCallback(
    async (files) => {
      const fileArray = Array.from(files || []);

      const uploadedUrls = await uploadFilesToServer(fileArray);

      onChange(uploadedUrls);
    },
    [onChange]
  );

  const onDrop = (event) => {
    event.preventDefault();
    handleFiles(event.dataTransfer.files);
  };

  const onFileInputChange = (event) => {
    handleFiles(event.target.files);
  };

  return (
    <Box
      onDrop={onDrop}
      onDragOver={(e) => e.preventDefault()}
      sx={{
        border: "1px dashed",
        borderColor: error ? "error.main" : "divider",
        borderRadius: 3,
        p: 4,
        backgroundColor: "#F9FAFC",
        textAlign: "center",
      }}
    >
      <input ref={inputRef} type="file" multiple hidden onChange={onFileInputChange} />

      <CloudUploadOutlinedIcon color="primary" fontSize="large" />

      <Typography variant="subtitle1" sx={{ mt: 2, fontWeight: 600 }}>
        {label} *
      </Typography>

      <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
        Upload files or drag and drop
      </Typography>

      <Button
        variant="outlined"
        size="small"
        sx={{ mt: 2 }}
        onClick={() => inputRef.current?.click()}
      >
        Upload Files
      </Button>

      {value?.length > 0 && (
        <Stack spacing={1.5} sx={{ mt: 3 }}>
          {value.map((url, index) => {
            const fileName = url.split("/").pop();
            return <Chip key={index} label={fileName} variant="outlined" />;
          })}
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

// ===================================================================
export default function IMTRaiseRequest() {
  const [departmentOptions, setDepartmentOptions] = useState([]);
  const [scopeOptions, setScopesOptions] = useState([]);
  const [importTypeOptions, setImportTypesOptions] = useState([]);
  const [vendorOptions, setVendorsOptions] = useState([]);
  const [currencyOptions, setCurrencyOptions] = useState([]);
  const [purchaseTypeOptions, setPurchaseTypeOptions] = useState([]);
  const [filteredScopeOptions, setFilteredScopeOptions] = useState([]);

  const [loadingDropdowns, setLoadingDropdowns] = useState(true);

  // ------------------- FETCH ALL DROPDOWNS IN PARALLEL ------------------------
  useEffect(() => {
  const fetchData = async () => {
  try {
    const [
      dept,
      impType,
      scope,
      type,
      vendors,
      currencies,
    ] = await Promise.all([
      userRequest.get("/imt/getMasters?key=Department&page=1&limit=100"),
      userRequest.get("/imt/getMasters?key=importtype&page=1&limit=100"),
      userRequest.get("/imt/getMasters?key=Scope&page=1&limit=100"),
      userRequest.get("/imt/getMasters?key=Type&page=1&limit=100"),
      userRequest.get("/imt/getVendors?page=1&limit=100"),
      userRequest.get("/imt/getCurrencies?page=1&limit=100"),
    ]);

    // store entire objects so we have _id for payload
    setDepartmentOptions(dept.data.data.masters);        // [{ _id, key, value }, ...]
    setImportTypesOptions(impType.data.data.masters);
    setScopesOptions(scope.data.data.masters);
    setPurchaseTypeOptions(type.data.data.masters);
    setVendorsOptions(vendors.data.data.vendors);        // [{ _id, name, ... }, ... ]
    // setVendorsOptions(vendors.data.data.vendors.map((i) => i.name));
    
    setCurrencyOptions(
      currencies.data.data.currencies.map((item) => ({
        value: item._id,
        label: item.name,
        rate: item.exchangeRate,
      }))
    );
  } catch (error) {
    swal("Error", "Failed to load dropdown values!", "error");
  } finally {
    setLoadingDropdowns(false);
  }
};
  fetchData();
  }, []);


  // ------------------- FORM HOOK ------------------------
  const { control, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm({
  resolver: yupResolver(importPaymentRequestSchema),
  mode: "onBlur",
  defaultValues: {
    department: "",
    importType: "",
    type: "",
    scope: "",
    poDate: null,
    poNumber: "",
    vendorId: "",
    grnDate: null,
    poAmount: 0,
    currencyId: "",
    advAmount: 0,
    advPercentage: 0,
    paymentTerms: "",
    poDocument: [],
    piDocument: [],
  },
  });

  const selectedType = watch("type");
  const poAmountValue = watch("poAmount");
  const advAmountValue = watch("advAmount");
  const advPercentageValue = watch("advPercentage");

  const toNumber = (value) => {
    const num = Number(value);
    return Number.isFinite(num) ? num : 0;
  };

  const updateAdvancePercentage = (poVal, advVal) => {
    const po = toNumber(poVal);
    const adv = toNumber(advVal);
    if (po <= 0) {
      setValue("advPercentage", 0, { shouldValidate: true, shouldDirty: true });
      return;
    }
    const pct = (adv / po) * 100;
    setValue("advPercentage", Number(pct.toFixed(2)), { shouldValidate: true, shouldDirty: true });
  };

  const updateAdvanceAmount = (poVal, pctVal) => {
    const po = toNumber(poVal);
    const pct = toNumber(pctVal);
    const adv = (po * pct) / 100;
    setValue("advAmount", Number(adv.toFixed(2)), { shouldValidate: true, shouldDirty: true });
  };

useEffect(() => {
  if (!selectedType) {
    setFilteredScopeOptions(scopeOptions);
    return;
  }

  // Find selected type object
  const typeObj = purchaseTypeOptions.find(t => t._id === selectedType);

  if (!typeObj?.other?.length) {
    setFilteredScopeOptions([]);
    return;
  }

  // Extract allowed scope IDs from Type.other
  const allowedScopeIds = typeObj.other.map(item => item._id);

  // Filter from all scope list
  const filtered = scopeOptions.filter(scope => 
    allowedScopeIds.includes(scope._id)
  );

  setFilteredScopeOptions(filtered);
}, [selectedType, purchaseTypeOptions, scopeOptions]);



  // ------------------- FINAL SUBMIT ------------------------
 const onSubmit = async (data) => {
  console.log("Final Submit Payload:", data);
    const payload = {
    ...data,
    poDocument: Array.isArray(data.poDocument) 
      ? data.poDocument[0]  // OR .join(",")
      : data.poDocument,

    piDocument: Array.isArray(data.piDocument)
      ? data.piDocument[0]  // OR .join(",")
      : data.piDocument,
  };

  try {
    const res = await userRequest.post("/imt/createRequest", payload);

    if (res.data.success === true) {
      swal("Success!", "Import payment request submitted successfully!", "success");

      // RESET FORM AFTER SUCCESS
      reset();
    }
  } catch (error) {
    console.error("Submit Error:", error);
  }
};


  // ===================================================================
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
                {/* HEADER */}
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
                  <Box>
                    <Typography variant="h5" fontWeight={600}>
                      Import / Advance Request
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Fill the required details below to proceed with the request.
                    </Typography>
                  </Box>

                  <Button type="submit" variant="contained" size="large">
                    Submit Request
                  </Button>
                </Box>

                <Divider sx={{ my: 3 }} />

                {/* ALL FORM FIELDS */}
                <Grid container spacing={3}>

                  {/* Assigned Department */}
                  <Grid item xs={12} md={6}>
                    <Controller
                      name="department"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          select fullWidth label="Assigned Department"
                          error={!!errors.department}
                          helperText={errors.department?.message}
                        >
                          {departmentOptions.map((o) => (
                            <MenuItem key={o._id} value={o._id}>{o.value}</MenuItem>
                          ))}
                        </TextField>
                      )}
                    />
                  </Grid>

                  {/* Type of Import */}
                  <Grid item xs={12} md={6}>
                    <Controller
                      name="importType"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          select fullWidth label="Type of Import"
                          error={!!errors.importType}
                          helperText={errors.importType?.message}
                        >
                          {importTypeOptions.map((o) => (
                            <MenuItem key={o._id} value={o._id}>{o.value}</MenuItem>
                          ))}
                        </TextField>
                      )}
                    />
                  </Grid>

                  {/* Select Type */}
                  <Grid item md={6}>
                    <Controller
                      name="type"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          select fullWidth label="Select Type"
                          error={!!errors.type}
                          helperText={errors.type?.message}
                        >
                          {purchaseTypeOptions.map((o) => (
                            <MenuItem key={o._id} value={o._id}>{o.value}</MenuItem>
                          ))}
                        </TextField>
                      )}
                    />
                  </Grid>

                  {/* Scope */}
                  <Grid item xs={12} md={6}>
                    <Controller
                      name="scope"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          select fullWidth label="Scope"
                          error={!!errors.scope}
                          helperText={errors.scope?.message}
                        >
                          {filteredScopeOptions.map((o) => (
                            <MenuItem key={o._id} value={o._id}>{o.value}</MenuItem>
                          ))}
                        </TextField>
                      )}
                    />
                  </Grid>

                  {/* PO Date */}
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

                  {/* PO Number */}
                  <Grid item xs={12} md={6}>
                    <Controller
                      name="poNumber"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field} fullWidth label="PO Number"
                          error={!!errors.poNumber}
                          helperText={errors.poNumber?.message}
                        />
                      )}
                    />
                  </Grid>

                  {/* Party / Vendor */}
                  <Grid item xs={12} md={6}>
                    <Controller
                      name="vendorId"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          select fullWidth label="Party Name (Vendor)"
                          error={!!errors.vendorId}
                          helperText={errors.vendorId?.message}
                        >
                          {vendorOptions.map((o) => (
                            <MenuItem key={o._id} value={o._id}>{o.name}</MenuItem>
                          ))}
                        </TextField>
                      )}
                    />
                  </Grid>

                  {/* GRN Date */}
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

                  {/* PO Amount */}
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
                                {/* <AttachMoneyIcon fontSize="small" /> */}
                              </InputAdornment>
                            ),
                          }}
                          error={!!errors.poAmount}
                          helperText={errors.poAmount?.message}
                          onChange={(e) => {
                            field.onChange(e);
                            updateAdvancePercentage(e.target.value, advAmountValue);
                            updateAdvanceAmount(e.target.value, advPercentageValue);
                          }}
                        />
                      )}
                    />
                  </Grid>

                  {/* Currency */}
                  <Grid item xs={12} md={6}>
                    <Controller
                      name="currencyId"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          select fullWidth label="Currency Type"
                          error={!!errors.currencyId}
                          helperText={errors.currencyId?.message}
                        >
                          {currencyOptions.map((o) => (
                            <MenuItem key={o.value} value={o.value}>
                              {o.label}
                            </MenuItem>
                          ))}
                        </TextField>
                      )}
                    />
                  </Grid>
                  
                  {/* Advance Percentage */}
                  <Grid item xs={12} md={6}>
                    <Controller
                      name="advPercentage"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          fullWidth
                          type="number"
                          label="Advance Percentage"
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="end">%</InputAdornment>
                            ),
                          }}
                          error={!!errors.advPercentage}
                          helperText={errors.advPercentage?.message}
                          onChange={(e) => {
                            field.onChange(e);
                            updateAdvanceAmount(poAmountValue, e.target.value);
                          }}
                        />
                      )}
                    />
                  </Grid>

                  {/* Advance Amount */}
                  <Grid item xs={12} md={6}>
                    <Controller
                      name="advAmount"
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
                                {/* <AttachMoneyIcon fontSize="small" /> */}
                              </InputAdornment>
                            ),
                          }}
                          error={!!errors.advAmount}
                          helperText={errors.advAmount?.message}
                          onChange={(e) => {
                            field.onChange(e);
                            updateAdvancePercentage(poAmountValue, e.target.value);
                          }}
                        />
                      )}
                    />
                  </Grid>

                  {/* Payment Terms */}
                  <Grid item xs={12}>
                    <Controller
                      name="paymentTerms"
                      control={control}
                      render={({ field }) => (
                        <TextField
                          {...field}
                          multiline minRows={4} fullWidth
                          label="Payment Terms"
                          error={!!errors.paymentTerms}
                          helperText={errors.paymentTerms?.message}
                        />
                      )}
                    />
                  </Grid>

                  {/* PO UPLOAD */}
                  <Grid item xs={12} md={6}>
                    <Controller
                      name="poDocument"
                      control={control}
                      render={({ field }) => (
                        <UploadDropZone
                          label="PO Upload"
                          helperText="PDF, PNG, JPG up to 10MB"
                          value={field.value}
                          onChange={field.onChange}
                          error={errors.poDocument?.message}
                        />
                      )}
                    />
                  </Grid>

                  {/* PI UPLOAD */}
                  <Grid item xs={12} md={6}>
                    <Controller
                      name="piDocument"
                      control={control}
                      render={({ field }) => (
                        <UploadDropZone
                          label="PI Upload"
                          helperText="PDF, PNG, JPG up to 10MB"
                          value={field.value}
                          onChange={field.onChange}
                          error={errors.piDocument?.message}
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

