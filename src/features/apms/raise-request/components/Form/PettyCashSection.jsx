import React from "react";
import {
  Grid,
  Typography,
  Button,
  Divider,
  CircularProgress,
} from "@mui/material";
import { Controller } from "react-hook-form";
import CustomTextField from "../CustomFields/CustomTextField";
import CustomSelect from "../CustomFields/CustomSelect";

export default function PettyCashSection({
  control,
  errors,
  onSubmit,
  onSaveDraft,
  loading,
}) {
  return (
    <>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Petty Cash Settlement Expenses
      </Typography>

      <Grid container spacing={2}>
        <Grid item xs={12} md={3}>
          <Controller
            name="initiator"
            control={control}
            render={({ field }) => (
              <CustomTextField {...field} label="Initiator" disabled />
            )}
          />
        </Grid>

        <Grid item xs={12} md={3}>
          <Controller
            name="businessArea"
            control={control}
            render={({ field }) => (
              <CustomSelect
                {...field}
                label="Business Area"
                required
                error={!!errors.businessArea}
                helperText={errors.businessArea?.message}
              />
            )}
          />
        </Grid>

        <Grid item xs={12} md={3}>
          <Controller
            name="businessPlace"
            control={control}
            render={({ field }) => (
              <CustomSelect {...field} label="Business Place" />
            )}
          />
        </Grid>

        <Grid item xs={12} md={3}>
          <Controller
            name="eflLocation"
            control={control}
            render={({ field }) => (
              <CustomSelect {...field} label="EFL Location Name" />
            )}
          />
        </Grid>

        <Grid item xs={12} md={3}>
          <Controller
            name="paidToName"
            control={control}
            render={({ field }) => (
              <CustomSelect {...field} label="Paid To Name" required />
            )}
          />
        </Grid>

        <Grid item xs={12} md={3}>
          <Controller
            name="employeeCode"
            control={control}
            render={({ field }) => (
              <CustomSelect {...field} label="Employee Code" required />
            )}
          />
        </Grid>

        <Grid item xs={12} md={3}>
          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <CustomSelect {...field} label="Type" />
            )}
          />
        </Grid>

        <Grid item xs={12} md={3}>
          <Controller
            name="approverName"
            control={control}
            render={({ field }) => (
              <CustomSelect {...field} label="Approver Name" />
            )}
          />
        </Grid>

        <Grid item xs={12} md={3}>
          <Controller
            name="region"
            control={control}
            render={({ field }) => (
              <CustomSelect {...field} label="Region" required />
            )}
          />
        </Grid>
      </Grid>

      {/* ACTION BUTTONS – ADDED ONLY */}
      <Divider sx={{ my: 3 }} />

      <Grid container justifyContent="flex-end" spacing={2}>
        <Grid item>
          <Button variant="outlined" onClick={onSaveDraft}>
            Save Draft
          </Button>
        </Grid>
        <Grid item>
          <Button
            variant="contained"
            onClick={onSubmit}
            disabled={loading}
            startIcon={loading && <CircularProgress size={18} />}
          >
            Submit
          </Button>
        </Grid>
      </Grid>
    </>
  );
}
