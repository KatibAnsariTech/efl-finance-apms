import React from "react";
import {
  Box,
  Typography,
  Grid,
  MenuItem,
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
            rules={{ required: "Modification or Upgrade is required" }}
            render={({ field }) => (
              <CustomSelect
                {...field}
                label="Modification or Upgrade *"
                error={!!errors.modificationOrUpgrade}
              >
                <MenuItem value="">Select Option</MenuItem>
                <MenuItem value="Yes">Yes</MenuItem>
                <MenuItem value="No">No</MenuItem>
              </CustomSelect>
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
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    label="Challenges in Present System"
                    fullWidth
                    variant="outlined"
                    multiline
                    rows={2}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Controller
                name="previousModificationHistory"
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    label="Previous Modification History"
                    fullWidth
                    variant="outlined"
                    multiline
                    rows={2}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="vendorOEM"
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    label="Vendor - OEM"
                    fullWidth
                    variant="outlined"
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="oldPOReference"
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    label="OLD PO Reference"
                    fullWidth
                    variant="outlined"
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="oldAssetCode"
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    label="OLD Asset Code"
                    fullWidth
                    variant="outlined"
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
