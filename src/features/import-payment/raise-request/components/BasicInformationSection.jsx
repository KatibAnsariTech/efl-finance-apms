import React from "react";
import { Box, Typography, Grid } from "@mui/material";
import { Controller } from "react-hook-form";
import { CustomTextField } from "./CustomFields";

export default function BasicInformationSection({ control, errors }) {
  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 3, fontWeight: "bold" }}>
        Basic Information
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Controller
            name="proposedSpoc"
            control={control}
            render={({ field }) => (
              <CustomTextField
                {...field}
                label="Proposed SPOC"
                fullWidth
                variant="outlined"
              />
            )}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Controller
            name="date"
            control={control}
            render={({ field }) => (
              <CustomTextField
                {...field}
                label="Date"
                fullWidth
                variant="outlined"
                type="datetime-local"
              />
            )}
          />
        </Grid>

        <Grid item xs={12} md={6}>
            <Controller
            name="businessVertical"
            control={control}
            rules={{ required: "Business Vertical is required" }}
            render={({ field }) => (
              <CustomTextField
                {...field}
                label="Business Vertical *"
                fullWidth
                variant="outlined"
                error={!!errors.businessVertical}
                helperText={errors.businessVertical?.message}
              />
            )}
          />
        </Grid>

        <Grid item xs={12} md={6}>
            <Controller
            name="location"
            control={control}
            rules={{ required: "Location is required" }}
            render={({ field }) => (
              <CustomTextField
                {...field}
                label="Location *"
                fullWidth
                variant="outlined"
                error={!!errors.location}
                helperText={errors.location?.message}
              />
            )}
          />
        </Grid>

        <Grid item xs={12} md={6}>
            <Controller
            name="function"
            control={control}
            rules={{ required: "Function is required" }}
            render={({ field }) => (
              <CustomTextField
                {...field}
                label="Function *"
                fullWidth
                variant="outlined"
                error={!!errors.function}
                helperText={errors.function?.message}
              />
            )}
          />
        </Grid>

        <Grid item xs={12} md={6}>
            <Controller
            name="businessPlantCode"
            control={control}
            rules={{ required: "Business / Plant Code is required" }}
            render={({ field }) => (
              <CustomTextField
                {...field}
                label="Business / Plant Code *"
                fullWidth
                variant="outlined"
                error={!!errors.businessPlantCode}
                helperText={errors.businessPlantCode?.message}
              />
            )}
          />
        </Grid>

        <Grid item xs={12} md={6}>
            <Controller
            name="contactPersonName"
            control={control}
            render={({ field }) => (
              <CustomTextField
                {...field}
                label="Contact Person Name"
                fullWidth
                variant="outlined"
              />
            )}
          />
        </Grid>

        <Grid item xs={12} md={6}>
            <Controller
            name="contactPersonNumber"
            control={control}
            render={({ field }) => (
              <CustomTextField
                {...field}
                label="Contact Person Number"
                fullWidth
                variant="outlined"
              />
            )}
          />
        </Grid>

        <Grid item xs={12} md={6}>
            <Controller
            name="deliveryAddress"
            control={control}
            render={({ field }) => (
              <CustomTextField
                {...field}
                label="Delivery Address"
                fullWidth
                variant="outlined"
              />
            )}
          />
        </Grid>

        <Grid item xs={12} md={6}>
            <Controller
            name="state"
            control={control}
            render={({ field }) => (
              <CustomTextField
                {...field}
                label="State"
                fullWidth
                variant="outlined"
              />
            )}
          />
        </Grid>

        <Grid item xs={12} md={6}>
            <Controller
            name="postalCode"
            control={control}
            render={({ field }) => (
              <CustomTextField
                {...field}
                label="Postal Code"
                fullWidth
                variant="outlined"
              />
            )}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Controller
            name="country"
            control={control}
            render={({ field }) => (
              <CustomTextField
                {...field}
                label="Country"
                fullWidth
                variant="outlined"
                disabled
              />
            )}
          />
        </Grid>
      </Grid>
    </Box>
  );
}

