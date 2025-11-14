import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Grid,
} from "@mui/material";
import { Controller } from "react-hook-form";
import { CustomTextField, CustomSelect } from "./CustomFields";
import { userRequest } from "src/requestMethod";

export default function BasicInformationSection({ control, errors }) {
  const [plantCodes, setPlantCodes] = useState([]);
  const [plantCodesLoading, setPlantCodesLoading] = useState(false);
  const [businessVerticals, setBusinessVerticals] = useState([]);
  const [businessVerticalsLoading, setBusinessVerticalsLoading] =
    useState(false);
  const [locations, setLocations] = useState([]);
  const [locationsLoading, setLocationsLoading] = useState(false);
  const [functions, setFunctions] = useState([]);
  const [functionsLoading, setFunctionsLoading] = useState(false);

  useEffect(() => {
    const fetchAllData = async () => {
      setPlantCodesLoading(true);
      setBusinessVerticalsLoading(true);
      setLocationsLoading(true);
      setFunctionsLoading(true);

      try {
        const [plantCodesRes, bvRes, locRes, funcRes] = await Promise.all([
          userRequest.get("cpx/getPlantCodes", {
            params: { page: 1, limit: 100 },
          }),
          userRequest.get("cpx/getBusinessVerticals", {
            params: { page: 1, limit: 100 },
          }),
          userRequest.get("cpx/getLocations", {
            params: { page: 1, limit: 100 },
          }),
          userRequest.get("cpx/getBusinessFunctions", {
            params: { page: 1, limit: 100 },
          }),
        ]);

        setPlantCodes(
          plantCodesRes.data.data?.items || plantCodesRes.data.data || []
        );
        setBusinessVerticals(bvRes.data.data?.items || bvRes.data.data || []);
        setLocations(locRes.data.data?.items || locRes.data.data || []);
        setFunctions(funcRes.data.data?.items || funcRes.data.data || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setPlantCodesLoading(false);
        setBusinessVerticalsLoading(false);
        setLocationsLoading(false);
        setFunctionsLoading(false);
      }
    };

    fetchAllData();
  }, []);

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
                disabled
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
                disabled
              />
            )}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Controller
            name="businessVertical"
            control={control}
            rules={{ required: "Business Vertical is required" }}
            render={({ field, fieldState: { error } }) => {
              const selectedValue =
                typeof field.value === "string" && field.value
                  ? businessVerticals.find((bv) => bv._id === field.value) ||
                    null
                  : field.value || null;

              return (
                <CustomSelect
                  value={selectedValue}
                  options={businessVerticals}
                  loading={businessVerticalsLoading}
                  onChange={(event, newValue) => {
                    field.onChange(newValue?._id || newValue || "");
                  }}
                  label="Business Vertical *"
                  error={!!error}
                  helperText={error?.message}
                />
              );
            }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Controller
            name="location"
            control={control}
            rules={{ required: "Location is required" }}
            render={({ field, fieldState: { error } }) => {
              const selectedValue =
                typeof field.value === "string" && field.value
                  ? locations.find((loc) => loc._id === field.value) || null
                  : field.value || null;

              return (
                <CustomSelect
                  value={selectedValue}
                  options={locations}
                  loading={locationsLoading}
                  onChange={(event, newValue) => {
                    field.onChange(newValue?._id || newValue || "");
                  }}
                  renderOption={(props, option) => {
                    const parts = [
                      option.location,
                      option.deliveryAddress,
                      option.postalCode,
                      option.state,
                    ].filter(Boolean);
                    return (
                      <Box component="li" {...props}>
                        <Typography variant="body2">
                          {parts.join(", ") || "-"}
                        </Typography>
                      </Box>
                    );
                  }}
                  label="Location *"
                  error={!!error}
                  helperText={error?.message}
                />
              );
            }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Controller
            name="function"
            control={control}
            rules={{ required: "Function is required" }}
            render={({ field, fieldState: { error } }) => {
              const selectedValue =
                typeof field.value === "string" && field.value
                  ? functions.find((func) => func._id === field.value) || null
                  : field.value || null;

              return (
                <CustomSelect
                  value={selectedValue}
                  options={functions}
                  loading={functionsLoading}
                  onChange={(event, newValue) => {
                    field.onChange(newValue?._id || newValue || "");
                  }}
                  label="Function *"
                  error={!!error}
                  helperText={error?.message}
                />
              );
            }}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Controller
            name="businessPlantCode"
            control={control}
            rules={{ required: "Business / Plant Code is required" }}
            render={({ field, fieldState: { error } }) => {
              // Find the selected option if value is a string (ID)
              const selectedValue =
                typeof field.value === "string" && field.value
                  ? plantCodes.find((pc) => pc._id === field.value) || null
                  : field.value || null;

              return (
                <CustomSelect
                  value={selectedValue}
                  options={plantCodes}
                  loading={plantCodesLoading}
                  onChange={(event, newValue) => {
                    field.onChange(newValue?._id || newValue || "");
                  }}
                  label="Business / Plant Code *"
                  error={!!error}
                  helperText={error?.message}
                />
              );
            }}
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
