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
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = () => {
    console.log("Form submitted with data:", formData);
    if (onSubmit) {
      onSubmit(formData);
    }
  };

  return (
    <Card sx={{ mt: 2, p: 3, mb: 2 }}>
      {/* <Typography variant="h5" sx={{ mb: 3, textAlign: 'center', fontWeight: 'bold', color: '#333' }}>
        AUTO-REVERSAL FORM
      </Typography> */}
      
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Grid container spacing={3}>
          {/* User and General Information Section */}
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ mb: 2, color: '#1976d2', fontWeight: 'bold' }}>
              User and General Information
            </Typography>
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
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
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
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
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
                <FormControl fullWidth>
                  <InputLabel>Fiscal Year *</InputLabel>
                  <Select
                    value={formData.fiscalYear}
                    onChange={(e) => handleFormChange('fiscalYear', e.target.value)}
                    label="Fiscal Year *"
                  >
                    <MenuItem value="2023">2023</MenuItem>
                    <MenuItem value="2024">2024</MenuItem>
                    <MenuItem value="2025">2025</MenuItem>
                    <MenuItem value="2026">2026</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Grid>

          {/* Auto-Reversal Details Section */}
          <Grid item xs={12}>
            <Typography variant="h6" sx={{ mb: 2, color: '#1976d2', fontWeight: 'bold' }}>
              Auto-Reversal Details
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={2}>
                <TextField
                  fullWidth
                  label="WID"
                  value="73050"
                  InputProps={{
                    readOnly: true,
                  }}
                  sx={{
                    '& .MuiInputBase-input': {
                      backgroundColor: '#f5f5f5',
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <DatePicker
                  label="Document Date"
                  value={new Date('2025-09-01')}
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
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <DatePicker
                  label="Posting Date"
                  value={new Date('2025-09-01')}
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
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <TextField
                  fullWidth
                  label="SAP Document Number"
                  value="21002006"
                  InputProps={{
                    readOnly: true,
                  }}
                  sx={{
                    '& .MuiInputBase-input': {
                      backgroundColor: '#f5f5f5',
                    }
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <TextField
                  fullWidth
                  label="Reversal Reason"
                  value={formData.reversalReason}
                  onChange={(e) => handleFormChange('reversalReason', e.target.value)}
                  placeholder="Enter reversal reason"
                />
              </Grid>
              <Grid item xs={12} sm={6} md={2}>
                <DatePicker
                  label="Reversal Posting Date"
                  value={formData.reversalPostingDate}
                  onChange={(newValue) => handleFormChange('reversalPostingDate', newValue)}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      placeholder: "Select date"
                    }
                  }}
                />
              </Grid>
            </Grid>
          </Grid>

          {/* Submit Button */}
          <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
            <Button
              variant="contained"
              onClick={handleSubmit}
              sx={{
                backgroundColor: '#1976d2',
                '&:hover': {
                  backgroundColor: '#1565c0',
                },
                px: 4,
                py: 1.5,
                fontSize: '1rem',
                fontWeight: 'bold'
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
