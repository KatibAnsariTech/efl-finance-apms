import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  FormControlLabel,
  Switch,
} from "@mui/material";

export default function AddEditCompany({ open, handleClose, editData, getData }) {
  const [formData, setFormData] = useState({
    companyName: "",
    govtIdentifier: "",
    bankAccountNumber: "",
    isActive: true,
  });

  useEffect(() => {
    if (editData) {
      setFormData({
        companyName: editData.companyName || "",
        govtIdentifier: editData.govtIdentifier || "",
        bankAccountNumber: editData.bankAccountNumber || "",
        isActive: editData.isActive !== undefined ? editData.isActive : true,
      });
    } else {
      setFormData({
        companyName: "",
        govtIdentifier: "",
        bankAccountNumber: "",
        isActive: true,
      });
    }
  }, [editData, open]);

  const handleChange = (field) => (event) => {
    const value = event.target.type === "checkbox" ? event.target.checked : event.target.value;
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      console.log("Saving company:", formData);
      await new Promise(resolve => setTimeout(resolve, 1000));
      getData();
      handleClose();
    } catch (error) {
      console.error("Error saving company:", error);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        {editData ? "Edit Company" : "Add Company"}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 2 }}>
          <TextField
            fullWidth
            label="Company Name"
            value={formData.companyName}
            onChange={handleChange("companyName")}
            margin="normal"
            required
          />
          <TextField
            fullWidth
            label="Govt Identifier (Code)"
            value={formData.govtIdentifier}
            onChange={handleChange("govtIdentifier")}
            margin="normal"
            required
            helperText="GST number or other government identifier"
          />
          <TextField
            fullWidth
            label="Bank Account Number"
            value={formData.bankAccountNumber}
            onChange={handleChange("bankAccountNumber")}
            margin="normal"
            required
            type="number"
            inputProps={{ pattern: "[0-9]*" }}
          />
          <FormControlLabel
            control={
              <Switch
                checked={formData.isActive}
                onChange={handleChange("isActive")}
              />
            }
            label="Active"
            sx={{ mt: 2 }}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={handleSubmit} variant="contained">
          {editData ? "Update" : "Add"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
