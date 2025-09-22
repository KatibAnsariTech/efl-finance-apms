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

const autoReversalOptions = [
  { value: "Y", label: "Yes" },
  { value: "N", label: "No" },
];

export default function AutoReversalModal({
  open,
  onClose,
  onSuccess,
  editData,
  mode = "add",
}) {
  const isEditMode = mode === "edit";

  const [formData, setFormData] = useState({
    srNo: "",
    documentType: "",
    documentDate: new Date(),
    businessArea: "",
    accountType: "",
    postingKey: "",
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
    autoReversal: "Y", // Default to Yes for auto reversal
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open) {
      if (isEditMode && editData) {
        // Populate form with edit data
        setFormData({
          srNo: editData.srNo || "",
          documentType: editData.documentType || "",
          documentDate: editData.documentDate
            ? new Date(editData.documentDate)
            : new Date(),
          businessArea: editData.businessArea || "",
          accountType: editData.accountType || "",
          postingKey: editData.postingKey || "",
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
          autoReversal: editData.autoReversal || "Y",
        });
      } else {
        // Reset form for add mode
        setFormData({
          srNo: "",
          documentType: "",
          documentDate: new Date(),
          businessArea: "",
          accountType: "",
          postingKey: "",
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
          autoReversal: "Y",
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

    if (!formData.srNo.trim()) newErrors.srNo = "Serial Number is required";
    if (!formData.documentType)
      newErrors.documentType = "Document Type is required";
    if (!formData.documentDate)
      newErrors.documentDate = "Document Date is required";
    if (!formData.businessArea.trim())
      newErrors.businessArea = "Business Area is required";
    if (!formData.accountType)
      newErrors.accountType = "Account Type is required";
    if (!formData.postingKey) newErrors.postingKey = "Posting Key is required";
    if (!formData.vendorCustomerGLNumber.trim())
      newErrors.vendorCustomerGLNumber =
        "Vendor/Customer/GL Number is required";
    if (!formData.amount || formData.amount <= 0)
      newErrors.amount = "Amount is required and must be greater than 0";
    if (!formData.assignment.trim())
      newErrors.assignment = "Assignment is required";
    if (!formData.profitCenter.trim())
      newErrors.profitCenter = "Profit Center is required";
    if (!formData.specialGLIndication.trim())
      newErrors.specialGLIndication = "Special GL Indication is required";
    if (!formData.referenceNumber.trim())
      newErrors.referenceNumber = "Reference Number is required";
    if (!formData.remarks.trim()) newErrors.remarks = "Remarks is required";
    if (!formData.postingDate)
      newErrors.postingDate = "Posting Date is required";
    if (!formData.vendorCustomerGLName.trim())
      newErrors.vendorCustomerGLName = "Vendor/Customer/GL Name is required";
    if (!formData.costCenter.trim())
      newErrors.costCenter = "Cost Center is required";
    if (!formData.personalNumber.trim())
      newErrors.personalNumber = "Personal Number is required";

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
          "https://crd-test-2ib6.onrender.com/api/v1/auto-reversals";
        const id = editData?._id || editData?.id || editData?.srNo;
        await axios.put(`${BASE_URL}/${id}`, submitData);
        onSuccess();
      } else {
        // Create new record
        onSuccess(submitData);
      }
    } catch (error) {
      console.error(
        `Error ${isEditMode ? "updating" : "creating"} auto reversal:`,
        error
      );
      showErrorMessage(
        error,
        `Failed to ${isEditMode ? "update" : "create"} auto reversal`,
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
            {isEditMode ? (
              `Edit Auto Reversal - ${editData?.srNo || ""}`
            ) : (
              <>
                Add Auto Reversal
                <br />
                Today Date:{" "}
                {new Date().toLocaleDateString("en-GB", {
                  day: "2-digit",
                  month: "short",
                  year: "numeric",
                })}
              </>
            )}
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
                  label="Sr.No *"
                  value={formData.srNo}
                  onChange={(e) => handleChange("srNo", e.target.value)}
                  error={!!errors.srNo}
                  helperText={errors.srNo}
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

              {/* Row 2: Business Area, Account Type, Posting Key, Auto Reversal */}
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  size="small"
                  label="Business Area *"
                  value={formData.businessArea}
                  onChange={(e) => handleChange("businessArea", e.target.value)}
                  error={!!errors.businessArea}
                  helperText={errors.businessArea}
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
                <FormControl
                  fullWidth
                  error={!!errors.autoReversal}
                  size="small"
                >
                  <InputLabel>Auto Reversal *</InputLabel>
                  <Select
                    value={formData.autoReversal}
                    onChange={(e) =>
                      handleChange("autoReversal", e.target.value)
                    }
                    label="Auto Reversal *"
                  >
                    {autoReversalOptions.map((option) => (
                      <MenuItem key={option.value} value={option.value}>
                        {option.label}
                      </MenuItem>
                    ))}
                  </Select>
                  {errors.autoReversal && (
                    <Typography
                      variant="caption"
                      color="error"
                      sx={{ mt: 0.5, ml: 1.5, fontSize: "0.75rem" }}
                    >
                      {errors.autoReversal}
                    </Typography>
                  )}
                </FormControl>
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
                  value={formData.amount}
                  onChange={(e) => handleChange("amount", e.target.value)}
                  error={!!errors.amount}
                  helperText={errors.amount}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  size="small"
                  label="Assignment *"
                  value={formData.assignment}
                  onChange={(e) => handleChange("assignment", e.target.value)}
                  error={!!errors.assignment}
                  helperText={errors.assignment}
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
                  error={!!errors.costCenter}
                  helperText={errors.costCenter}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  size="small"
                  label="Profit Center *"
                  value={formData.profitCenter}
                  onChange={(e) => handleChange("profitCenter", e.target.value)}
                  error={!!errors.profitCenter}
                  helperText={errors.profitCenter}
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
                  error={!!errors.specialGLIndication}
                  helperText={errors.specialGLIndication}
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

              {/* Row 5: Personal Number, Remarks */}
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  size="small"
                  label="Personal Number *"
                  value={formData.personalNumber}
                  onChange={(e) =>
                    handleChange("personalNumber", e.target.value)
                  }
                  error={!!errors.personalNumber}
                  helperText={errors.personalNumber}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={9}>
                <TextField
                  fullWidth
                  size="small"
                  label="Remarks *"
                  multiline
                  rows={2}
                  value={formData.remarks}
                  onChange={(e) => handleChange("remarks", e.target.value)}
                  error={!!errors.remarks}
                  helperText={errors.remarks}
                />
              </Grid>

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
