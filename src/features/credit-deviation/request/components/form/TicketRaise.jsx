import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  FormHelperText,
  Grid,
  Button,
  Stack,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import { useForm, FormProvider, Controller } from "react-hook-form";
import Iconify from "src/components/iconify";
import { userRequest } from "src/requestMethod";
import { useAccount } from "src/hooks/use-account";

export default function TicketRaise({ onSubmit }) {
  const methods = useForm({ mode: "onChange" });
  const { watch } = methods;
  const user = useAccount();
  const [loading, setLoading] = useState(false);
  const selectedRegion = watch("region");
  const selectedSalesOffice = watch("salesOffice");

  // Use user data for dropdowns
  const regionData = user?.region || [];
  const channelData = (user?.requestType && user.requestType[0]?.other) || [];
  const salesOffices =
    user?.salesOffice?.filter((office) =>
      office.other?.some((o) => o._id === selectedRegion)
    ) || [];
  const salesGroups =
    user?.salesGroup?.filter((group) =>
      group.other?.some((o) => o._id === selectedSalesOffice)
    ) || [];

  const {
    control,
    register,
    handleSubmit,
    formState: { errors },
  } = methods;

  const handleFormSubmit = (data) => {
    const channelObj = channelData.find((c) => c._id === data.channel);
    const regionObj = regionData.find((r) => r._id === data.region);
    const salesOfficeObj = salesOffices.find((o) => o._id === data.salesOffice);
    const salesGroupObj = salesGroups.find((g) => g._id === data.salesGroup);

    const enrichedData = {
      ...data,
      channelObj,
      regionObj,
      salesOfficeObj,
      salesGroupObj,
    };
    if (onSubmit) onSubmit(enrichedData);
  };

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="60vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <FormProvider {...methods}>
      <Box
        component="form"
        noValidate
        onSubmit={handleSubmit(handleFormSubmit)}
      >
        <Paper
          elevation={6}
          sx={{
            p: { xs: 2, sm: 4 },
            borderRadius: 4,
            width: "100%",
            maxWidth: "100%",
            overflow: "hidden",
          }}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            mb={1}
          >
            <Stack direction="column" spacing={1}>
              <Typography variant="h4" fontWeight={700} mb={1} color="#0f172a">
                Credit Limit Request
              </Typography>
              <Typography variant="subtitle1" color="text.secondary" mb={2}>
                Request your limit below
              </Typography>
            </Stack>

            <Button
              type="submit"
              variant="contained"
              color="primary"
              sx={{ px: 6, py: 1.5, fontWeight: 600 }}
            >
              Submit
            </Button>
          </Stack>

          <Box
            sx={{
              height: 2,
              width: 70,
              background: "#12368d",
              borderRadius: 1,
              mb: 3,
            }}
          />

          <Grid container spacing={3}>
            {/* Channel */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!errors.channel}>
                <InputLabel id="channel-label">Channel</InputLabel>
                <Controller
                  name="channel"
                  control={control}
                  defaultValue=""
                  rules={{ required: "Please select a channel" }}
                  render={({ field }) => (
                    <Select
                      labelId="channel-label"
                      label="Channel"
                      {...field}
                      startAdornment={
                        <InputAdornment position="start">
                          <Iconify
                            icon="mdi:store-outline"
                            width={22}
                            sx={{ color: "#1877f2" }}
                          />
                        </InputAdornment>
                      }
                    >
                      {channelData.map((channel) => (
                        <MenuItem key={channel._id} value={channel._id}>
                          {channel.value}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
                {errors.channel && (
                  <FormHelperText>{errors.channel.message}</FormHelperText>
                )}
              </FormControl>
            </Grid>

            {/* Region */}
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!errors.region}>
                <InputLabel id="region-label">Region</InputLabel>
                <Controller
                  name="region"
                  control={control}
                  defaultValue=""
                  rules={{ required: "Please select a region" }}
                  render={({ field }) => (
                    <Select
                      labelId="region-label"
                      label="Region"
                      {...field}
                      startAdornment={
                        <InputAdornment position="start">
                          <Iconify
                            icon="mdi:map-marker"
                            width={22}
                            sx={{ color: "#1877f2" }}
                          />
                        </InputAdornment>
                      }
                    >
                      {regionData.map((region) => (
                        <MenuItem key={region._id} value={region._id}>
                          {region.value}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
                {errors.region && (
                  <FormHelperText>{errors.region.message}</FormHelperText>
                )}
              </FormControl>
            </Grid>

            {/* Sales Office */}
            <Grid item xs={12} md={6}>
              <FormControl
                fullWidth
                error={!!errors.salesOffice}
                disabled={!selectedRegion}
              >
                <InputLabel id="office-label">Sales Office</InputLabel>
                <Controller
                  name="salesOffice"
                  control={control}
                  defaultValue=""
                  rules={{ required: "Please select a sales office" }}
                  render={({ field }) => (
                    <Select
                      labelId="office-label"
                      label="Sales Office"
                      {...field}
                      startAdornment={
                        <InputAdornment position="start">
                          <Iconify
                            icon="mdi:office-building"
                            width={22}
                            sx={{ color: "#1877f2" }}
                          />
                        </InputAdornment>
                      }
                    >
                      {salesOffices.map((office) => (
                        <MenuItem key={office._id} value={office._id}>
                          {office.value}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
                {errors.salesOffice && (
                  <FormHelperText>{errors.salesOffice.message}</FormHelperText>
                )}
              </FormControl>
            </Grid>

            {/* Sales Group */}
            <Grid item xs={12} md={6}>
              <FormControl
                fullWidth
                error={!!errors.salesGroup}
                disabled={!selectedSalesOffice}
              >
                <InputLabel id="group-label">Sales Group</InputLabel>
                <Controller
                  name="salesGroup"
                  control={control}
                  defaultValue=""
                  rules={{ required: "Please select a sales group" }}
                  render={({ field }) => (
                    <Select
                      labelId="group-label"
                      label="Sales Group"
                      {...field}
                      startAdornment={
                        <InputAdornment position="start">
                          <Iconify
                            icon="mdi:account-group"
                            width={22}
                            sx={{ color: "#1877f2" }}
                          />
                        </InputAdornment>
                      }
                    >
                      {salesGroups.map((group) => (
                        <MenuItem key={group._id} value={group._id}>
                          {group.value}
                        </MenuItem>
                      ))}
                    </Select>
                  )}
                />
                {errors.salesGroup && (
                  <FormHelperText>{errors.salesGroup.message}</FormHelperText>
                )}
              </FormControl>
            </Grid>

            {/* Customer Code */}
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Customer Code"
                type="number"
                {...register("customerCode", {
                  required: "Customer Code is required",
                  setValueAs: (value) => (value ? String(value) : ""),
                })}
                error={!!errors.customerCode}
                helperText={errors.customerCode?.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Iconify
                        icon="mdi:account-key"
                        width={22}
                        sx={{ color: "#1877f2" }}
                      />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
          </Grid>
        </Paper>
      </Box>
    </FormProvider>
  );
}
