import React, { useState, useEffect } from "react";

// DEVELOPMENT MODE: This modal uses console logging instead of API calls
// for testing purposes. Replace with actual API calls when backend is ready.

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

const autoReversalOptions = [
  { value: "Y", label: "Yes" },
  { value: "N", label: "No" },
];

export default function EditJVModal({ open, onClose, onSuccess, editData }) {
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
    autoReversal: "N",
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (open && editData) {
      // Populate form with edit data
      setFormData({
        srNo: editData.srNo || "",
        documentType: editData.documentType || "",
        documentDate: editData.documentDate ? new Date(editData.documentDate) : new Date(),
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
        postingDate: editData.postingDate ? new Date(editData.postingDate) : new Date(),
        vendorCustomerGLName: editData.vendorCustomerGLName || "",
        costCenter: editData.costCenter || "",
        personalNumber: editData.personalNumber || "",
        autoReversal: editData.autoReversal || "N",
      });
      setErrors({});
    }
  }, [open, editData]);

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
    if (!formData.documentType) newErrors.documentType = "Document Type is required";
    if (!formData.businessArea.trim()) newErrors.businessArea = "Business Area is required";
    if (!formData.accountType) newErrors.accountType = "Account Type is required";
    if (!formData.postingKey) newErrors.postingKey = "Posting Key is required";
    if (!formData.vendorCustomerGLNumber.trim()) newErrors.vendorCustomerGLNumber = "Vendor/Customer/GL Number is required";
    if (!formData.amount || formData.amount <= 0) newErrors.amount = "Amount must be greater than 0";
    if (!formData.assignment.trim()) newErrors.assignment = "Assignment is required";
    if (!formData.costCenter.trim()) newErrors.costCenter = "Cost Center is required";
    if (!formData.profitCenter.trim()) newErrors.profitCenter = "Profit Center is required";
    if (!formData.specialGLIndication.trim()) newErrors.specialGLIndication = "Special GL Indication is required";
    if (!formData.referenceNumber.trim()) newErrors.referenceNumber = "Reference Number is required";
    if (!formData.personalNumber.trim()) newErrors.personalNumber = "Personal Number is required";
    if (!formData.remarks.trim()) newErrors.remarks = "Remarks is required";

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
        documentDate: formData.documentDate.toISOString(),
        postingDate: formData.postingDate.toISOString(),
        amount: parseFloat(formData.amount),
      };

      const BASE_URL = "https://crd-test-2ib6.onrender.com/api/v1/journal-vouchers";
      const id = editData?._id || editData?.id || editData?.srNo;
      await axios.put(`${BASE_URL}/${id}`, submitData);

      onSuccess();
    } catch (error) {
      console.error("Error updating journal voucher:", error);
      showErrorMessage(error, "Failed to update journal voucher", swal);
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
            Edit Journal Voucher - {editData?.srNo || ""}
          </Typography>
          <IconButton onClick={onClose} sx={{ color: "#B22222" }}>
            <RxCross2 size={20} />
          </IconButton>
        </Box>

        <LocalizationProvider dateAdapter={AdapterDateFns}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Serial Number"
                value={formData.srNo}
                onChange={(e) => handleChange("srNo", e.target.value)}
                error={!!errors.srNo}
                helperText={errors.srNo}
                size="small"
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small" error={!!errors.documentType}>
                <InputLabel>Document Type</InputLabel>
                <Select
                  value={formData.documentType}
                  onChange={(e) => handleChange("documentType", e.target.value)}
                  label="Document Type"
                >
                  {documentTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
                {errors.documentType && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.75 }}>
                    {errors.documentType}
                  </Typography>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <DatePicker
                label="Document Date"
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
                label="Posting Date"
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

            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Business Area"
                value={formData.businessArea}
                onChange={(e) => handleChange("businessArea", e.target.value)}
                error={!!errors.businessArea}
                helperText={errors.businessArea}
                size="small"
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small" error={!!errors.accountType}>
                <InputLabel>Account Type</InputLabel>
                <Select
                  value={formData.accountType}
                  onChange={(e) => handleChange("accountType", e.target.value)}
                  label="Account Type"
                >
                  {accountTypes.map((type) => (
                    <MenuItem key={type} value={type}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
                {errors.accountType && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.75 }}>
                    {errors.accountType}
                  </Typography>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small" error={!!errors.postingKey}>
                <InputLabel>Posting Key</InputLabel>
                <Select
                  value={formData.postingKey}
                  onChange={(e) => handleChange("postingKey", e.target.value)}
                  label="Posting Key"
                >
                  {postingKeys.map((key) => (
                    <MenuItem key={key} value={key}>
                      {key}
                    </MenuItem>
                  ))}
                </Select>
                {errors.postingKey && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.75 }}>
                    {errors.postingKey}
                  </Typography>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <FormControl fullWidth size="small" error={!!errors.autoReversal}>
                <InputLabel>Auto Reversal</InputLabel>
                <Select
                  value={formData.autoReversal}
                  onChange={(e) => handleChange("autoReversal", e.target.value)}
                  label="Auto Reversal"
                >
                  {autoReversalOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </Select>
                {errors.autoReversal && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.75 }}>
                    {errors.autoReversal}
                  </Typography>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} sm={6} md={6}>
              <TextField
                fullWidth
                label="Vendor/Customer/GL Name"
                value={formData.vendorCustomerGLName}
                onChange={(e) => handleChange("vendorCustomerGLName", e.target.value)}
                error={!!errors.vendorCustomerGLName}
                helperText={errors.vendorCustomerGLName}
                size="small"
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Vendor/Customer/GL Number"
                value={formData.vendorCustomerGLNumber}
                onChange={(e) => handleChange("vendorCustomerGLNumber", e.target.value)}
                error={!!errors.vendorCustomerGLNumber}
                helperText={errors.vendorCustomerGLNumber}
                size="small"
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Amount"
                type="number"
                value={formData.amount}
                onChange={(e) => handleChange("amount", e.target.value)}
                error={!!errors.amount}
                helperText={errors.amount}
                size="small"
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Assignment"
                value={formData.assignment}
                onChange={(e) => handleChange("assignment", e.target.value)}
                error={!!errors.assignment}
                helperText={errors.assignment}
                size="small"
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Cost Center"
                value={formData.costCenter}
                onChange={(e) => handleChange("costCenter", e.target.value)}
                error={!!errors.costCenter}
                helperText={errors.costCenter}
                size="small"
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Profit Center"
                value={formData.profitCenter}
                onChange={(e) => handleChange("profitCenter", e.target.value)}
                error={!!errors.profitCenter}
                helperText={errors.profitCenter}
                size="small"
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Special GL Indication"
                value={formData.specialGLIndication}
                onChange={(e) => handleChange("specialGLIndication", e.target.value)}
                error={!!errors.specialGLIndication}
                helperText={errors.specialGLIndication}
                size="small"
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Reference Number"
                value={formData.referenceNumber}
                onChange={(e) => handleChange("referenceNumber", e.target.value)}
                error={!!errors.referenceNumber}
                helperText={errors.referenceNumber}
                size="small"
              />
            </Grid>

            <Grid item xs={12} sm={6} md={3}>
              <TextField
                fullWidth
                label="Personal Number"
                value={formData.personalNumber}
                onChange={(e) => handleChange("personalNumber", e.target.value)}
                error={!!errors.personalNumber}
                helperText={errors.personalNumber}
                size="small"
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Remarks"
                multiline
                rows={3}
                value={formData.remarks}
                onChange={(e) => handleChange("remarks", e.target.value)}
                error={!!errors.remarks}
                helperText={errors.remarks}
                size="small"
              />
            </Grid>
          </Grid>

          <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 3 }}>
            <Button
              variant="outlined"
              onClick={onClose}
              disabled={loading}
              sx={{ minWidth: 100 }}
            >
              Cancel
            </Button>
            <Button
              variant="contained"
              onClick={handleSubmit}
              disabled={loading}
              startIcon={loading ? <CircularProgress size={16} /> : <Iconify icon="eva:save-fill" />}
              sx={{ minWidth: 100 }}
            >
              {loading ? "Updating..." : "Update"}
            </Button>
          </Box>
        </LocalizationProvider>
      </Box>
    </Modal>
  );
}
