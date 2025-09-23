import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Grid,
  Card,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

export default function AutoReversalForm({ onSubmit, initialData = {} }) {
  // Form state for editable fields
  const [formData, setFormData] = useState({
    fiscalYear: initialData.fiscalYear || "2024",
    reversalReason: initialData.reversalReason || "",
    reversalPostingDate: initialData.reversalPostingDate || null,
  });

  const handleFormChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = () => {
    console.log("Form submitted with data:", formData);
    if (onSubmit) {
      onSubmit(formData);
    }
  };

  const handleBack = () => {
    router.push("/jvm/auto-reversal");
  };

  return (
    <Card sx={{ mt: 2, p: 3, mb: 2 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent:"flex-end",
          cursor: "pointer",
          position: "relative",
          "&:hover .close-tooltip": { opacity: 1, pointerEvents: "auto" },
          mr: 1,
          mb:3
        }}
        onClick={handleBack}
      >
        <svg
          width="28"
          height="28"
          viewBox="0 0 24 24"
          fill="#e53935"
          stroke="#fff"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          style={{ borderRadius: "50%" }}
        >
          <circle cx="12" cy="12" r="12" fill="#e53935" />
          <line x1="8" y1="8" x2="16" y2="16" />
          <line x1="16" y1="8" x2="8" y2="16" />
        </svg>
        <Box
          className="close-tooltip"
          sx={{
            position: "absolute",
            top: 0,
            right: 35,
            background: "#12368d",
            color: "#fff",
            px: 1.5,
            py: 0.5,
            borderRadius: 1,
            fontSize: "0.85rem",
            whiteSpace: "nowrap",
            opacity: 0,
            pointerEvents: "none",
            transition: "opacity 0.2s",
            zIndex: 10,
          }}
        >
          Back to Auto Reversal Status
        </Box>
      </Box>

      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Grid container spacing={3}>
          {/* User and General Information Section */}
          <Grid item xs={12}>
            <Grid container spacing={2}>
              {/* <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  label="User Name"
                  value="Rohan Bhagwat"
                  InputProps={{
                    readOnly: true,
                  }}
                  sx={{
                    '& .MuiInputBase-input': {
                      backgroundColor: '#f5f5f5',
                    }
                  }}
                />
              </Grid> */}
              {/* <Grid item xs={12} sm={6} md={3}>
                <DatePicker
                  label="Initiated Date"
                  value={new Date('2025-09-19')}
                  readOnly
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      sx: {
                        '& .MuiInputBase-input': {
                          backgroundColor: '#f5f5f5',
                        }
                      }
                    }
                  }}
                />
              </Grid> */}
              {/* <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  label="Company Code"
                  value="EFL"
                  InputProps={{
                    readOnly: true,
                  }}
                  sx={{
                    '& .MuiInputBase-input': {
                      backgroundColor: '#f5f5f5',
                    }
                  }}
                />
              </Grid> */}
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  size="small"
                  label="WID"
                  value="73050"
                  InputProps={{
                    readOnly: true,
                  }}
                  sx={{
                    "& .MuiInputBase-input": {
                      backgroundColor: "#f5f5f5",
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <DatePicker
                  label="Document Date"
                  value={new Date("2025-09-01")}
                  readOnly
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      size: "small",
                      sx: {
                        "& .MuiInputBase-input": {
                          backgroundColor: "#f5f5f5",
                        },
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <DatePicker
                  label="Posting Date"
                  value={new Date("2025-09-01")}
                  readOnly
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      size: "small",
                      sx: {
                        "& .MuiInputBase-input": {
                          backgroundColor: "#f5f5f5",
                        },
                      },
                    },
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  size="small"
                  label="SAP Document Number"
                  value="21002006"
                  InputProps={{
                    readOnly: true,
                  }}
                  sx={{
                    "& .MuiInputBase-input": {
                      backgroundColor: "#f5f5f5",
                    },
                  }}
                />
              </Grid>
            </Grid>
          </Grid>

          {/* Auto-Reversal Details Section */}
          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl fullWidth size="small">
                  <InputLabel>Fiscal Year *</InputLabel>
                  <Select
                    value={formData.fiscalYear}
                    onChange={(e) =>
                      handleFormChange("fiscalYear", e.target.value)
                    }
                    label="Fiscal Year *"
                  >
                    <MenuItem value="2023">2023</MenuItem>
                    <MenuItem value="2024">2024</MenuItem>
                    <MenuItem value="2025">2025</MenuItem>
                    <MenuItem value="2026">2026</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <TextField
                  fullWidth
                  size="small"
                  label="Reversal Reason"
                  value={formData.reversalReason}
                  onChange={(e) =>
                    handleFormChange("reversalReason", e.target.value)
                  }
                  placeholder="Enter reversal reason"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <DatePicker
                  label="Reversal Posting Date"
                  value={formData.reversalPostingDate}
                  onChange={(newValue) =>
                    handleFormChange("reversalPostingDate", newValue)
                  }
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      size: "small",
                      placeholder: "Select date",
                    },
                  }}
                />
              </Grid>
            </Grid>
          </Grid>

          {/* Submit Button */}
          <Grid
            // item`
            xs={12}
            sx={{ display: "flex", justifyContent: "flex-end", mt: 1 }}
          >
            <Button
              variant="contained"
              size="small"
              onClick={handleSubmit}
              sx={{
                backgroundColor: "#1976d2",
                "&:hover": {
                  backgroundColor: "#1565c0",
                },
                px: 6,
                py: 2.5,
                fontSize: "0.875rem",
                fontWeight: "bold",
                height: "32px",
              }}
            >
              Submit
            </Button>
          </Grid>
        </Grid>
      </LocalizationProvider>
    </Card>
  );
}
