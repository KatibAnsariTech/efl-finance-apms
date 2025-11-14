import React from "react";
import {
  Box,
  Typography,
  Grid,
} from "@mui/material";
import { Controller } from "react-hook-form";
import { CustomTextField, CustomSelect } from "./CustomFields";

export default function ModificationUpgradeSection({ control, errors, watch }) {
  const modificationOrUpgrade = watch("modificationOrUpgrade");
  const showAdditionalFields = modificationOrUpgrade === "Yes";

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 3, fontWeight: "bold" }}>
        Modification or Upgrade
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
            <Controller
            name="modificationOrUpgrade"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <CustomSelect
                value={field.value || null}
                onChange={(event, newValue) => {
                  field.onChange(newValue || "");
                }}
                label="Modification or Upgrade *"
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
        <Grid item xs={12} md={6}></Grid>

        {showAdditionalFields && (
          <>
            <Grid item xs={12} md={6}>
              <Controller
                name="challengesInPresentSystem"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <CustomTextField
                    {...field}
                    label="Challenges in Present System *"
                    fullWidth
                    variant="outlined"
                    multiline
                    rows={2}
                    error={!!error}
                    helperText={error?.message}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="previousModificationHistory"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <CustomTextField
                    {...field}
                    label="Previous Modification History *"
                    fullWidth
                    variant="outlined"
                    multiline
                    rows={2}
                    error={!!error}
                    helperText={error?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="vendorOEM"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <CustomTextField
                    {...field}
                    label="Vendor - OEM *"
                    fullWidth
                    variant="outlined"
                    error={!!error}
                    helperText={error?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="oldPOReference"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <CustomTextField
                    {...field}
                    label="OLD PO Reference *"
                    fullWidth
                    variant="outlined"
                    error={!!error}
                    helperText={error?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="oldAssetCode"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <CustomTextField
                    {...field}
                    label="OLD Asset Code *"
                    fullWidth
                    variant="outlined"
                    error={!!error}
                    helperText={error?.message}
                  />
                )}
              />
            </Grid>
          </>
        )}
      </Grid>
    </Box>
  );
}
