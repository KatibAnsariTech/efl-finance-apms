import React, { useState, useEffect } from "react";

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
import axios from "axios";
import swal from "sweetalert";
import { showErrorMessage } from "src/utils/errorUtils";
import Iconify from "src/components/iconify/iconify";

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

const documentTypes = [
  "Invoice",
  "Credit Note",
  "Debit Note",
  "Journal Entry",
  "Payment Voucher",
  "Receipt Voucher",
];

const accountTypes = ["Asset", "Liability", "Equity", "Revenue", "Expense"];

const postingKeys = [
  "40 - Customer Invoice",
  "50 - Vendor Invoice",
  "11 - Cash Receipt",
  "21 - Cash Payment",
  "31 - Bank Receipt",
  "41 - Bank Payment",
];

const typeOptions = ["Debit", "Credit"];

export default function JVModal({
  open,
  onClose,
  onSuccess,
  editData,
  mode = "add",
}) {
  const isEditMode = mode === "edit";

  const [formData, setFormData] = useState({
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

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open) {
      if (isEditMode && editData) {
        // Populate form with edit data
        setFormData({
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
        setFormData({
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
      setErrors({});
    }
  }, [open, editData, isEditMode]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.slNo.trim()) newErrors.slNo = "Serial Number is required";
    if (!formData.documentType)
      newErrors.documentType = "Document Type is required";
    if (!formData.documentDate)
      newErrors.documentDate = "Document Date is required";
    if (!formData.businessArea.trim())
      newErrors.businessArea = "Business Area is required";
    else if (!/^[A-Za-z0-9]{4}$/.test(formData.businessArea.trim()))
      newErrors.businessArea = "Business Area must be exactly 4 alphanumeric characters";
    if (!formData.accountType)
      newErrors.accountType = "Account Type is required";
    if (!formData.postingKey) newErrors.postingKey = "Posting Key is required";
    if (!formData.type) newErrors.type = "Type is required";
    if (!formData.vendorCustomerGLNumber.trim())
      newErrors.vendorCustomerGLNumber =
        "Vendor/Customer/GL Number is required";
    
    // Amount validation - number with 2 decimal places
    if (!formData.amount || formData.amount <= 0)
      newErrors.amount = "Amount is required and must be greater than 0";
    else if (!/^\d+(\.\d{1,2})?$/.test(formData.amount.toString()))
      newErrors.amount = "Amount must be a number with maximum 2 decimal places";
    
    // Assignment validation - mandatory 25 characters
    if (!formData.assignment.trim())
      newErrors.assignment = "Assignment is required";
    else if (formData.assignment.trim().length !== 25)
      newErrors.assignment = "Assignment must be exactly 25 characters";
    
    // Remarks validation - 50 characters maximum
    if (!formData.remarks.trim()) 
      newErrors.remarks = "Remarks is required";
    else if (formData.remarks.trim().length > 50)
      newErrors.remarks = "Remarks must not exceed 50 characters";
    
    // Cost Center validation - 10 characters (numbers only)
    if (!formData.costCenter.trim())
      newErrors.costCenter = "Cost Center is required";
    else if (!/^\d{1,10}$/.test(formData.costCenter.trim()))
      newErrors.costCenter = "Cost Center must be 1-10 digits only";
    
    // Profit Center validation - 6 characters (numbers only)
    if (!formData.profitCenter.trim())
      newErrors.profitCenter = "Profit Center is required";
    else if (!/^\d{6}$/.test(formData.profitCenter.trim()))
      newErrors.profitCenter = "Profit Center must be exactly 6 digits";
    
    // Special GL Indication validation - single character
    if (!formData.specialGLIndication.trim())
      newErrors.specialGLIndication = "Special GL Indication is required";
    else if (formData.specialGLIndication.trim().length !== 1)
      newErrors.specialGLIndication = "Special GL Indication must be exactly 1 character";
    
    // Personal Number validation - 7 digits only
    if (!formData.personalNumber.trim())
      newErrors.personalNumber = "Personal Number is required";
    else if (!/^\d{7}$/.test(formData.personalNumber.trim()))
      newErrors.personalNumber = "Personal Number must be exactly 7 digits";
    
    // Reference Number - free field (no validation needed)
    if (!formData.referenceNumber.trim())
      newErrors.referenceNumber = "Reference Number is required";
    
    if (!formData.postingDate)
      newErrors.postingDate = "Posting Date is required";
    if (!formData.vendorCustomerGLName.trim())
      newErrors.vendorCustomerGLName = "Vendor/Customer/GL Name is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);

      const submitData = {
        ...formData,
        documentDate: formData.documentDate.toISOString().split("T")[0], // Format as YYYY-MM-DD
        postingDate: formData.postingDate.toISOString().split("T")[0], // Format as YYYY-MM-DD
        amount: parseFloat(formData.amount),
      };

      if (isEditMode) {
        // Update existing record
        const BASE_URL =
          "https://crd-test-2ib6.onrender.com/api/v1/journal-vouchers";
        const id = editData?._id || editData?.id || editData?.sNo;
        await axios.put(`${BASE_URL}/${id}`, submitData);
        onSuccess();
      } else {
        // Create new record
        onSuccess(submitData);
      }
    } catch (error) {
      console.error(
        `Error ${isEditMode ? "updating" : "creating"} journal voucher:`,
        error
      );
      showErrorMessage(
        error,
        `Failed to ${isEditMode ? "update" : "create"} journal voucher`,
        swal
      );
    } finally {
      setLoading(false);
    }
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
                <TextField
                  fullWidth
                  size="small"
                  label="S No *"
                  value={formData.slNo}
                  onChange={(e) => handleChange("slNo", e.target.value)}
                  error={!!errors.slNo}
                  helperText={errors.slNo}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl
                  fullWidth
                  error={!!errors.documentType}
                  size="small"
                >
                  <InputLabel>Document Type *</InputLabel>
                  <Select
                    value={formData.documentType}
                    onChange={(e) =>
                      handleChange("documentType", e.target.value)
                    }
                    label="Document Type *"
                  >
                    {documentTypes.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                {errors.documentType && (
                  <Typography
                    variant="caption"
                    color="error"
                    sx={{ mt: 0.5, ml: 1.5, fontSize: "0.75rem" }}
                  >
                    {errors.documentType}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <DatePicker
                  label="Document Date *"
                  value={formData.documentDate}
                  onChange={(date) => handleChange("documentDate", date)}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      size: "small",
                      error: !!errors.documentDate,
                      helperText: errors.documentDate,
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <DatePicker
                  label="Posting Date *"
                  value={formData.postingDate}
                  onChange={(date) => handleChange("postingDate", date)}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      size: "small",
                      error: !!errors.postingDate,
                      helperText: errors.postingDate,
                    },
                  }}
                />
              </Grid>

              {/* Row 2: Business Area, Account Type, Posting Key, Auto Reversal (Edit only) */}
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  size="small"
                  label="Business Area *"
                  value={formData.businessArea}
                  onChange={(e) => handleChange("businessArea", e.target.value)}
                  error={!!errors.businessArea}
                  helperText={errors.businessArea || "Exactly 4 characters required"}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl
                  fullWidth
                  error={!!errors.accountType}
                  size="small"
                >
                  <InputLabel>Account Type *</InputLabel>
                  <Select
                    value={formData.accountType}
                    onChange={(e) =>
                      handleChange("accountType", e.target.value)
                    }
                    label="Account Type *"
                  >
                    {accountTypes.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                {errors.accountType && (
                  <Typography
                    variant="caption"
                    color="error"
                    sx={{ mt: 0.5, ml: 1.5, fontSize: "0.75rem" }}
                  >
                    {errors.accountType}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth error={!!errors.postingKey} size="small">
                  <InputLabel>Posting Key *</InputLabel>
                  <Select
                    value={formData.postingKey}
                    onChange={(e) => handleChange("postingKey", e.target.value)}
                    label="Posting Key *"
                  >
                    {postingKeys.map((key) => (
                      <MenuItem key={key} value={key}>
                        {key}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                {errors.postingKey && (
                  <Typography
                    variant="caption"
                    color="error"
                    sx={{ mt: 0.5, ml: 1.5, fontSize: "0.75rem" }}
                  >
                    {errors.postingKey}
                  </Typography>
                )}
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth error={!!errors.type} size="small">
                  <InputLabel>Type *</InputLabel>
                  <Select
                    value={formData.type}
                    onChange={(e) => handleChange("type", e.target.value)}
                    label="Type *"
                  >
                    {typeOptions.map((type) => (
                      <MenuItem key={type} value={type}>
                        {type}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                {errors.type && (
                  <Typography
                    variant="caption"
                    color="error"
                    sx={{ mt: 0.5, ml: 1.5, fontSize: "0.75rem" }}
                  >
                    {errors.type}
                  </Typography>
                )}
              </Grid>

              {/* Row 3: Vendor/Customer/GL Name, Vendor/Customer/GL Number, Amount, Assignment */}
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  size="small"
                  label="Vendor/Customer/GL Name *"
                  value={formData.vendorCustomerGLName}
                  onChange={(e) =>
                    handleChange("vendorCustomerGLName", e.target.value)
                  }
                  error={!!errors.vendorCustomerGLName}
                  helperText={errors.vendorCustomerGLName}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  size="small"
                  label="Vendor/Customer/GL Number *"
                  value={formData.vendorCustomerGLNumber}
                  onChange={(e) =>
                    handleChange("vendorCustomerGLNumber", e.target.value)
                  }
                  error={!!errors.vendorCustomerGLNumber}
                  helperText={errors.vendorCustomerGLNumber}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  size="small"
                  label="Amount *"
                  type="number"
                  inputProps={{ step: "0.01", min: "0" }}
                  value={formData.amount}
                  onChange={(e) => handleChange("amount", e.target.value)}
                  error={!!errors.amount}
                  helperText={errors.amount || "Amount with 2 decimal places"}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  size="small"
                  label="Assignment *"
                  value={formData.assignment}
                  onChange={(e) => handleChange("assignment", e.target.value)}
                  inputProps={{ maxLength: 25 }}
                  error={!!errors.assignment}
                  helperText={errors.assignment || "Exactly 25 characters required"}
                />
              </Grid>

              {/* Row 4: Cost Center, Profit Center, Special GL Indication, Reference Number */}
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  size="small"
                  label="Cost Center *"
                  value={formData.costCenter}
                  onChange={(e) => handleChange("costCenter", e.target.value)}
                  inputProps={{ maxLength: 10, pattern: "[0-9]*" }}
                  error={!!errors.costCenter}
                  helperText={errors.costCenter || "1-10 digits only"}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  size="small"
                  label="Profit Center *"
                  value={formData.profitCenter}
                  onChange={(e) => handleChange("profitCenter", e.target.value)}
                  inputProps={{ maxLength: 6, pattern: "[0-9]*" }}
                  error={!!errors.profitCenter}
                  helperText={errors.profitCenter || "Exactly 6 digits required"}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  size="small"
                  label="Special GL Indication *"
                  value={formData.specialGLIndication}
                  onChange={(e) =>
                    handleChange("specialGLIndication", e.target.value)
                  }
                  inputProps={{ maxLength: 1 }}
                  error={!!errors.specialGLIndication}
                  helperText={errors.specialGLIndication || "Single character only"}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  size="small"
                  label="Reference Number *"
                  value={formData.referenceNumber}
                  onChange={(e) =>
                    handleChange("referenceNumber", e.target.value)
                  }
                  error={!!errors.referenceNumber}
                  helperText={errors.referenceNumber}
                />
              </Grid>

              {/* Row 5: Personal Number, Remarks, Upload Documents (Add only) */}
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  size="small"
                  label="Personal Number *"
                  value={formData.personalNumber}
                  onChange={(e) =>
                    handleChange("personalNumber", e.target.value)
                  }
                  inputProps={{ maxLength: 7, pattern: "[0-9]*" }}
                  error={!!errors.personalNumber}
                  helperText={errors.personalNumber || "Exactly 7 digits required"}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={6}>
                <TextField
                  fullWidth
                  size="small"
                  label="Remarks *"
                  multiline
                  rows={2}
                  value={formData.remarks}
                  onChange={(e) => handleChange("remarks", e.target.value)}
                  inputProps={{ maxLength: 50 }}
                  error={!!errors.remarks}
                  helperText={errors.remarks || `${formData.remarks.length}/50 characters`}
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
                      onClick={handleSubmit}
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
