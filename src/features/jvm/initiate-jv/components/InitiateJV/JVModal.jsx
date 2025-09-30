import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";

import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormControlLabel,
  Switch,
  IconButton,
  Paper,
  CircularProgress,
} from "@mui/material";
import { RxCross2 } from "react-icons/rx";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import swal from "sweetalert";
import { showErrorMessage } from "src/utils/errorUtils";
import Iconify from "src/components/iconify/iconify";
import { jvEntrySchema } from "../../../utils/validationSchemas";
import { userRequest } from "src/requestMethod";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  maxWidth: "1200px",
  maxHeight: "90vh",
  bgcolor: "background.paper",
  borderRadius: 2,
  p: 3,
  overflow: "auto",
};

// Master data will be fetched from API

const typeOptions = ["Debit", "Credit"];

export default function JVModal({
  open,
  onClose,
  onSuccess,
  editData,
  mode = "add",
  existingData = [],
}) {
  const isEditMode = mode === "edit";

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
    watch,
    setValue,
  } = useForm({
    resolver: yupResolver(jvEntrySchema),
    context: {
      existingData,
      isEditMode,
      currentEntryId: editData?._id || null,
    },
    defaultValues: {
      slNo: "",
      documentType: "",
      documentDate: new Date(),
      businessArea: "",
      accountType: "",
      postingKey: "",
      type: "",
      vendorCustomerGLNumber: "",
      amount: "",
      assignment: "",
      profitCenter: "",
      specialGLIndication: "",
      referenceNumber: "",
      remarks: "",
      postingDate: new Date(),
      vendorCustomerGLName: "",
      costCenter: "",
      personalNumber: "",
    },
  });

  const [loading, setLoading] = useState(false);
  
  // Master data state
  const [documentTypes, setDocumentTypes] = useState([]);
  const [accountTypes, setAccountTypes] = useState([]);
  const [postingKeys, setPostingKeys] = useState([]);
  const [specialGLIndications, setSpecialGLIndications] = useState([]);
  const [masterDataLoading, setMasterDataLoading] = useState(false);

  useEffect(() => {
    if (open) {
      if (isEditMode && editData) {
        // Populate form with edit data
        reset({
          slNo: editData.slNo || "",
          documentType: editData.documentType || "",
          documentDate: editData.documentDate
            ? new Date(editData.documentDate)
            : new Date(),
          businessArea: editData.businessArea || "",
          accountType: editData.accountType || "",
          postingKey: editData.postingKey || "",
          type: editData.type || "",
          vendorCustomerGLNumber: editData.vendorCustomerGLNumber || "",
          amount: editData.amount || "",
          assignment: editData.assignment || "",
          profitCenter: editData.profitCenter || "",
          specialGLIndication: editData.specialGLIndication || "",
          referenceNumber: editData.referenceNumber || "",
          remarks: editData.remarks || "",
          postingDate: editData.postingDate
            ? new Date(editData.postingDate)
            : new Date(),
          vendorCustomerGLName: editData.vendorCustomerGLName || "",
          costCenter: editData.costCenter || "",
          personalNumber: editData.personalNumber || "",
        });
      } else {
        // Reset form for add mode
        reset({
          slNo: "",
          documentType: "",
          documentDate: new Date(),
          businessArea: "",
          accountType: "",
          postingKey: "",
          type: "",
          vendorCustomerGLNumber: "",
          amount: "",
          assignment: "",
          profitCenter: "",
          specialGLIndication: "",
          referenceNumber: "",
          remarks: "",
          postingDate: new Date(),
          vendorCustomerGLName: "",
          costCenter: "",
          personalNumber: "",
        });
      }
    }
  }, [open, editData, isEditMode, reset]);


  useEffect(() => {
    const fetchMasterData = async () => {
      if (open) {
        setMasterDataLoading(true);
        try {
          const [documentTypesRes, accountTypesRes, postingKeysRes, specialGLRes] = await Promise.all([
            userRequest.get("/jvm/getMasters?key=DocumentType"),
            userRequest.get("/jvm/getMasters?key=AccountType"),
            userRequest.get("/jvm/getMasters?key=PostingKey"),
            userRequest.get("/jvm/getMasters?key=SpecialGLIndication")
          ]);

          if (documentTypesRes.data.success) {
            setDocumentTypes(documentTypesRes.data.data.masters.map(item => item.value));
          }
          if (accountTypesRes.data.success) {
            setAccountTypes(accountTypesRes.data.data.masters.map(item => item.value));
          }
          if (postingKeysRes.data.success) {
            setPostingKeys(postingKeysRes.data.data.masters.map(item => item.value));
          }
          if (specialGLRes.data.success) {
            setSpecialGLIndications(specialGLRes.data.data.masters.map(item => item.value));
          }
        } catch (error) {
          console.error("Error fetching master data:", error);
          showErrorMessage(error, "Error loading master data", swal);
        } finally {
          setMasterDataLoading(false);
        }
      }
    };

    fetchMasterData();
  }, [open]);

  const onSubmit = (data) => {
    setLoading(true);

    const submitData = {
      ...data,
      documentDate: data.documentDate.toISOString().split("T")[0], // Format as YYYY-MM-DD
      postingDate: data.postingDate.toISOString().split("T")[0], // Format as YYYY-MM-DD
      amount: parseFloat(data.amount),
    };

    if (isEditMode) {
      // Update existing record in local state
      onSuccess(submitData, 'edit');
    } else {
      // Create new record in local state
      onSuccess(submitData, 'create');
    }
    
    setLoading(false);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="body2" sx={{ fontWeight: "bold" }}>
            Today Date:{" "}
            {new Date().toLocaleDateString("en-GB", {
              day: "2-digit",
              month: "short",
              year: "numeric",
            })}
          </Typography>
          <IconButton onClick={onClose} sx={{ color: "#B22222" }}>
            <RxCross2 size={20} />
          </IconButton>
        </Box>

        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Paper sx={{ p: 2, mb: 2 }}>
            <Grid container spacing={2}>
              {/* Row 1: Sr.No, Document Type, Document Date, Posting Date */}
              <Grid item xs={12} sm={6} md={3}>
                <Controller
                  name="slNo"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      {...field}
                      fullWidth
                      size="small"
                      label="S No *"
                      type="number"
                      inputProps={{ min: 1, max: 950 }}
                      error={!!error}
                      helperText={error?.message || "Max 950 entries per serial number"}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Controller
                  name="documentType"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <FormControl
                      fullWidth
                      error={!!error}
                      size="small"
                    >
                      <InputLabel>Document Type *</InputLabel>
                      <Select
                        {...field}
                        label="Document Type *"
                        disabled={masterDataLoading}
                      >
                        {masterDataLoading ? (
                          <MenuItem disabled>
                            <CircularProgress size={20} />
                            Loading...
                          </MenuItem>
                        ) : (
                          documentTypes.map((type) => (
                            <MenuItem key={type} value={type}>
                              {type}
                            </MenuItem>
                          ))
                        )}
                      </Select>
                    </FormControl>
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Controller
                  name="documentDate"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <DatePicker
                      {...field}
                      label="Document Date *"
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          size: "small",
                          error: !!error,
                          helperText: error?.message,
                        },
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Controller
                  name="postingDate"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <DatePicker
                      {...field}
                      label="Posting Date *"
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          size: "small",
                          error: !!error,
                          helperText: error?.message,
                        },
                      }}
                    />
                  )}
                />
              </Grid>

              {/* Row 2: Business Area, Account Type, Posting Key, Auto Reversal (Edit only) */}
              <Grid item xs={12} sm={6} md={3}>
                <Controller
                  name="businessArea"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      {...field}
                      fullWidth
                      size="small"
                      label="Business Area *"
                      error={!!error}
                      helperText={error?.message || "Exactly 4 characters required"}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Controller
                  name="accountType"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <FormControl
                      fullWidth
                      error={!!error}
                      size="small"
                    >
                      <InputLabel>Account Type *</InputLabel>
                      <Select
                        {...field}
                        label="Account Type *"
                        disabled={masterDataLoading}
                      >
                        {masterDataLoading ? (
                          <MenuItem disabled>
                            <CircularProgress size={20} />
                            Loading...
                          </MenuItem>
                        ) : (
                          accountTypes.map((type) => (
                            <MenuItem key={type} value={type}>
                              {type}
                            </MenuItem>
                          ))
                        )}
                      </Select>
                    </FormControl>
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Controller
                  name="postingKey"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <FormControl fullWidth error={!!error} size="small">
                      <InputLabel>Posting Key *</InputLabel>
                      <Select
                        {...field}
                        label="Posting Key *"
                        disabled={masterDataLoading}
                      >
                        {masterDataLoading ? (
                          <MenuItem disabled>
                            <CircularProgress size={20} />
                            Loading...
                          </MenuItem>
                        ) : (
                          postingKeys.map((key) => (
                            <MenuItem key={key} value={key}>
                              {key}
                            </MenuItem>
                          ))
                        )}
                      </Select>
                    </FormControl>
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Controller
                  name="type"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <FormControl fullWidth error={!!error} size="small">
                      <InputLabel>Type *</InputLabel>
                      <Select
                        {...field}
                        label="Type *"
                      >
                        {typeOptions.map((type) => (
                          <MenuItem key={type} value={type}>
                            {type}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                />
              </Grid>

              {/* Row 3: Vendor/Customer/GL Name, Vendor/Customer/GL Number, Amount, Assignment */}
              <Grid item xs={12} sm={6} md={3}>
                <Controller
                  name="vendorCustomerGLName"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      {...field}
                      fullWidth
                      size="small"
                      label="Vendor/Customer/GL Name *"
                      error={!!error}
                      helperText={error?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Controller
                  name="vendorCustomerGLNumber"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      {...field}
                      fullWidth
                      size="small"
                      label="Vendor/Customer/GL Number *"
                      error={!!error}
                      helperText={error?.message}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Controller
                  name="amount"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      {...field}
                      fullWidth
                      size="small"
                      label="Amount *"
                      type="number"
                      inputProps={{ step: "0.01", min: "0" }}
                      error={!!error}
                      helperText={error?.message || "Amount with 2 decimal places"}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Controller
                  name="assignment"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      {...field}
                      fullWidth
                      size="small"
                      label="Assignment *"
                      inputProps={{ maxLength: 25 }}
                      error={!!error}
                      helperText={error?.message || "Exactly 25 characters required"}
                    />
                  )}
                />
              </Grid>

              {/* Row 4: Cost Center, Profit Center, Special GL Indication, Reference Number */}
              <Grid item xs={12} sm={6} md={3}>
                <Controller
                  name="costCenter"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      {...field}
                      fullWidth
                      size="small"
                      label="Cost Center *"
                      inputProps={{ maxLength: 10, pattern: "[0-9]*" }}
                      error={!!error}
                      helperText={error?.message || "1-10 digits only"}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Controller
                  name="profitCenter"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      {...field}
                      fullWidth
                      size="small"
                      label="Profit Center *"
                      inputProps={{ maxLength: 6, pattern: "[0-9]*" }}
                      error={!!error}
                      helperText={error?.message || "Exactly 6 digits required"}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Controller
                  name="specialGLIndication"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <FormControl
                      fullWidth
                      error={!!error}
                      size="small"
                    >
                      <InputLabel>Special GL Indication *</InputLabel>
                      <Select
                        {...field}
                        label="Special GL Indication *"
                        disabled={masterDataLoading}
                      >
                        {masterDataLoading ? (
                          <MenuItem disabled>
                            <CircularProgress size={20} />
                            Loading...
                          </MenuItem>
                        ) : (
                          specialGLIndications.map((indication) => (
                            <MenuItem key={indication} value={indication}>
                              {indication}
                            </MenuItem>
                          ))
                        )}
                      </Select>
                    </FormControl>
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Controller
                  name="referenceNumber"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      {...field}
                      fullWidth
                      size="small"
                      label="Reference Number *"
                      error={!!error}
                      helperText={error?.message}
                    />
                  )}
                />
              </Grid>

              {/* Row 5: Personal Number, Remarks, Upload Documents (Add only) */}
              <Grid item xs={12} sm={6} md={3}>
                <Controller
                  name="personalNumber"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      {...field}
                      fullWidth
                      size="small"
                      label="Personal Number *"
                      inputProps={{ maxLength: 7, pattern: "[0-9]*" }}
                      error={!!error}
                      helperText={error?.message || "Exactly 7 digits required"}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={6}>
                <Controller
                  name="remarks"
                  control={control}
                  render={({ field, fieldState: { error } }) => (
                    <TextField
                      {...field}
                      fullWidth
                      size="small"
                      label="Remarks *"
                      multiline
                      rows={2}
                      inputProps={{ maxLength: 50 }}
                      error={!!error}
                      helperText={error?.message || `${field.value?.length || 0}/50 characters`}
                    />
                  )}
                />
              </Grid>
              {!isEditMode && (
                <Grid item xs={12} sm={6} md={3}>
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}
                  >
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ fontSize: "0.875rem" }}
                    >
                      Upload Supporting Documents (if any)
                    </Typography>
                    <Button
                      variant="outlined"
                      size="small"
                      endIcon={<Iconify icon="eva:download-fill" />}
                      sx={{ alignSelf: "flex-start", fontSize: "0.875rem" }}
                    >
                      Choose File
                    </Button>
                  </Box>
                </Grid>
              )}

              {/* Action Buttons */}
              <Grid item xs={12} sm={12} md={12}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "flex-end",
                    gap: 3,
                    width: "100%",
                  }}
                >
                  <Box sx={{ display: "flex", gap: 2 }}>
                    {isEditMode && (
                      <Button
                        variant="outlined"
                        onClick={onClose}
                        disabled={loading}
                        sx={{ minWidth: 100 }}
                      >
                        Cancel
                      </Button>
                    )}
                    <Button
                      variant="contained"
                      size="small"
                      onClick={handleSubmit(onSubmit)}
                      disabled={loading}
                      startIcon={
                        loading ? <CircularProgress size={16} /> : null
                      }
                      sx={{
                        minWidth: isEditMode ? 100 : 250,
                        height: 36,
                        fontSize: "0.875rem",
                      }}
                    >
                      {loading
                        ? isEditMode
                          ? "Updating..."
                          : "Adding..."
                        : isEditMode
                        ? "Update"
                        : "Add Record"}
                    </Button>
                  </Box>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </LocalizationProvider>
      </Box>
    </Modal>
  );
}
