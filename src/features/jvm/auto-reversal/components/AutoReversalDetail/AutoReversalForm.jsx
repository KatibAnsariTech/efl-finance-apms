import React from "react";
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
import { useRouter } from "src/routes/hooks";
import { useForm, Controller } from "react-hook-form";

export default function AutoReversalForm({ onSubmit, initialData = {}, canSubmit = true }) {
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      fiscalYear: initialData.fiscalYear || new Date().getFullYear().toString(),
      reversalRemarks: initialData.reversalRemarks || "",
      reversalDate: initialData.reversalPostingDate || null,
    },
  });

  const handleBack = () => {
    router.push("/jvm/auto-reversal");
  };

  return (
    <Card sx={{ mt: 2, p: 3, mb: 2 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          cursor: "pointer",
          position: "relative",
          "&:hover .close-tooltip": { opacity: 1, pointerEvents: "auto" },
          mr: 1,
          mb: 3,
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
                  size="small"
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
              <Grid item xs={12} sm={6} md={3}>
                <DatePicker
                  label="Initiated Date"
                  value={initialData.initiatedDate || new Date()}
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
                  label="Company Code"
                  value="EFL"
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
              {/* <Grid item xs={12} sm={6} md={3}>
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
              </Grid> */}
              <Grid item xs={12} sm={6} md={3}>
                <DatePicker
                  label="Document Date"
                  value={initialData.documentDate || new Date()}
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
                  value={initialData.postingDate || new Date()}
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
            </Grid>
          </Grid>

          {/* Auto-Reversal Details Section */}
          <Grid item xs={12}>
            <Grid container spacing={2}>
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
              <Grid item xs={12} sm={6} md={3}>
                <Controller
                  name="fiscalYear"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      size="small"
                      label="Fiscal Year *"
                      type="number"
                      placeholder={new Date().getFullYear().toString()}
                      inputProps={{
                        min: 2000,
                        max: 2100,
                        step: 1,
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <FormControl
                  fullWidth
                  size="small"
                  disabled
                >
                  <InputLabel>Reversal Remarks</InputLabel>
                  <Select
                    value={initialData.reversalRemarks || ""}
                    label="Reversal Remarks"
                    disabled
                    sx={{
                      "& .MuiInputBase-input": {
                        backgroundColor: "#f5f5f5",
                      },
                    }}
                  >
                    <MenuItem value="01">01 - Existing Posting</MenuItem>
                    <MenuItem value="02">02 - New Posting Date</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={6} md={3}>
                <Controller
                  name="reversalDate"
                  control={control}
                  render={({ field }) => (
                    <DatePicker
                      {...field}
                      label="Reversal Posting Date"
                      value={
                        initialData.reversalRemarks === "01" 
                          ? (initialData.postingDate ? new Date(initialData.postingDate) : new Date())
                          : field.value
                      }
                      disabled={initialData.reversalRemarks === "01"}
                      slotProps={{
                        textField: {
                          fullWidth: true,
                          size: "small",
                          placeholder: "Select date",
                          sx: initialData.reversalRemarks === "01" ? {
                            "& .MuiInputBase-input": {
                              backgroundColor: "#f5f5f5",
                            },
                          } : {},
                        },
                      }}
                    />
                  )}
                />
              </Grid>
            </Grid>
          </Grid>

          {/* Submit Button */}
          <Grid
            // item`
            xs={12}
            sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}
          >
            {canSubmit && (
              <Button
                variant="contained"
                size="small"
                onClick={handleSubmit(onSubmit)}
                sx={{
                  backgroundColor: "#1976d2",
                  "&:hover": {
                    backgroundColor: "#1565c0",
                  },
                  px: 10,
                  py: 2.5,
                  fontSize: "0.875rem",
                  fontWeight: "bold",
                  height: "32px",
                }}
              >
                Submit
              </Button>
            )}
          </Grid>
        </Grid>
      </LocalizationProvider>
    </Card>
  );
}
