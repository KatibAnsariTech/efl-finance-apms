import React from "react";
import {
  Box,
  Typography,
  Grid,
  Tooltip,
  InputAdornment,
} from "@mui/material";
import { HelpOutline } from "@mui/icons-material";
import { Controller } from "react-hook-form";
import { CustomTextField, CustomSelect } from "./CustomFields";

export default function FinanceAspectSection({ control, readOnly = false }) {
  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 3, fontWeight: "bold" }}>
        Finance Aspect
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Controller
            name="reasonForNeed"
            control={control}
            rules={{ required: "Reason For Need is required" }}
            render={({ field, fieldState: { error } }) => (
              <CustomTextField
                {...field}
                label="Reason For Need *"
                fullWidth
                variant="outlined"
                error={!!error}
                helperText={error?.message}
              />
            )}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <Controller
            name="benefitsOnInvestment"
            control={control}
            rules={{ required: "Benefits on Investment is required" }}
            render={({ field, fieldState: { error } }) => (
              <CustomTextField
                {...field}
                label="Benefits on Investment *"
                fullWidth
                variant="outlined"
                error={!!error}
                helperText={error?.message}
              />
            )}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <Controller
            name="budgetBasicCost"
            control={control}
            rules={{ required: "Budget Basic Cost is required" }}
            render={({ field, fieldState: { error } }) => (
              <CustomTextField
                {...field}
                label="Budget Basic Cost *"
                fullWidth
                variant="outlined"
                error={!!error}
                helperText={error?.message}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Tooltip title="Enter budget basic cost">
                        <HelpOutline sx={{ fontSize: 18, cursor: "help" }} />
                      </Tooltip>
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <Controller
            name="impactOnBusiness"
            control={control}
            rules={{ required: "Impact on Business is required" }}
            render={({ field, fieldState: { error } }) => (
              <CustomTextField
                {...field}
                label="Impact on Business Profit / Production / Etc *"
                fullWidth
                variant="outlined"
                error={!!error}
                helperText={error?.message}
              />
            )}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <Controller
            name="newAssetCode"
            control={control}
            render={({ field }) => (
              <CustomTextField
                {...field}
                label="New Asset Code"
                fullWidth
                variant="outlined"
              />
            )}
          />
        </Grid>

        <Grid item xs={12} md={4}>
            <Controller
            name="businessCaseROI"
            control={control}
            rules={{ required: "Business Case with ROI/Payback is required" }}
            render={({ field, fieldState: { error } }) => (
              <CustomSelect
                value={field.value || null}
                onChange={(event, newValue) => {
                  field.onChange(newValue || "");
                }}
                label="Business Case with ROI/Payback Calculations Available *"
                error={!!error}
                helperText={error?.message}
                options={["", "Yes", "No"]}
                getOptionLabel={(option) => {
                  if (option === "") return "Select Option";
                  return option;
                }}
              />
            )}
          />
        </Grid>
      </Grid>
    </Box>
  );
}

