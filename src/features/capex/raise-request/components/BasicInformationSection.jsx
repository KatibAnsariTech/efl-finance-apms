// import React from "react";
// import { Box, Typography, Grid, MenuItem } from "@mui/material";
// import { Controller } from "react-hook-form";
// import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
// import { CustomTextField, CustomSelect } from "./CustomFields";

// export default function BasicInformationSection({ control, errors }) {
//   return (
//     <Box>
//       <Typography variant="h6" sx={{ mb: 3, fontWeight: "bold" }}>
//         Basic Information
//       </Typography>
//       <Grid container spacing={3}>
//         <Grid item xs={12} md={6}>
//           <Controller
//             name="proposedSpoc"
//             control={control}
//             render={({ field }) => (
//               <CustomTextField
//                 {...field}
//                 label="Proposed SPOC"
//                 fullWidth
//                 variant="outlined"
//               />
//             )}
//           />
//         </Grid>

//         <Grid item xs={12} md={6}>
//           <Controller
//             name="date"
//             control={control}
//             render={({ field }) => (
//               <DateTimePicker
//                 {...field}
//                 label="Date"
//                 slotProps={{
//                   textField: {
//                     fullWidth: true,
//                     variant: "outlined",
//                     sx: {
//                       "& .MuiInputLabel-root": {
//                         fontSize: "0.875rem",
//                       },
//                     },
//                   },
//                 }}
//               />
//             )}
//           />
//         </Grid>

//         <Grid item xs={12} md={6}>
//             <Controller
//             name="businessVertical"
//             control={control}
//             rules={{ required: "Business Vertical is required" }}
//             render={({ field }) => (
//               <CustomSelect
//                 {...field}
//                 label="Business Vertical *"
//                 error={!!errors.businessVertical}
//               >
//                 <MenuItem value="">Select Business Vertical</MenuItem>
//               </CustomSelect>
//             )}
//           />
//         </Grid>

//         <Grid item xs={12} md={6}>
//             <Controller
//             name="location"
//             control={control}
//             rules={{ required: "Location is required" }}
//             render={({ field }) => (
//               <CustomSelect
//                 {...field}
//                 label="Location *"
//                 error={!!errors.location}
//               >
//                 <MenuItem value="">Select Location</MenuItem>
//               </CustomSelect>
//             )}
//           />
//         </Grid>

//         <Grid item xs={12} md={6}>
//             <Controller
//             name="function"
//             control={control}
//             rules={{ required: "Function is required" }}
//             render={({ field }) => (
//               <CustomSelect
//                 {...field}
//                 label="Function *"
//                 error={!!errors.function}
//               >
//                 <MenuItem value="">Select Function</MenuItem>
//               </CustomSelect>
//             )}
//           />
//         </Grid>

//         <Grid item xs={12} md={6}>
//             <Controller
//             name="businessPlantCode"
//             control={control}
//             rules={{ required: "Business / Plant Code is required" }}
//             render={({ field }) => (
//               <CustomSelect
//                 {...field}
//                 label="Business / Plant Code *"
//                 error={!!errors.businessPlantCode}
//               >
//                 <MenuItem value="">Select Business / Plant Code</MenuItem>
//               </CustomSelect>
//             )}
//           />
//         </Grid>

//         <Grid item xs={12} md={6}>
//             <Controller
//             name="contactPersonName"
//             control={control}
//             render={({ field }) => (
//               <CustomTextField
//                 {...field}
//                 label="Contact Person Name"
//                 fullWidth
//                 variant="outlined"
//               />
//             )}
//           />
//         </Grid>

//         <Grid item xs={12} md={6}>
//             <Controller
//             name="contactPersonNumber"
//             control={control}
//             render={({ field }) => (
//               <CustomSelect
//                 {...field}
//                 label="Contact Person Number"
//               >
//                 <MenuItem value="">Select Contact Number</MenuItem>
//               </CustomSelect>
//             )}
//           />
//         </Grid>

//         <Grid item xs={12} md={6}>
//             <Controller
//             name="deliveryAddress"
//             control={control}
//             render={({ field }) => (
//               <CustomSelect
//                 {...field}
//                 label="Delivery Address"
//               >
//                 <MenuItem value="">Select Delivery Address</MenuItem>
//               </CustomSelect>
//             )}
//           />
//         </Grid>

//         <Grid item xs={12} md={6}>
//             <Controller
//             name="state"
//             control={control}
//             render={({ field }) => (
//               <CustomSelect
//                 {...field}
//                 label="State"
//               >
//                 <MenuItem value="">Select State</MenuItem>
//               </CustomSelect>
//             )}
//           />
//         </Grid>

//         <Grid item xs={12} md={6}>
//             <Controller
//             name="postalCode"
//             control={control}
//             render={({ field }) => (
//               <CustomSelect
//                 {...field}
//                 label="Postal Code"
//               >
//                 <MenuItem value="">Select Postal Code</MenuItem>
//               </CustomSelect>
//             )}
//           />
//         </Grid>

//         <Grid item xs={12} md={6}>
//           <Controller
//             name="country"
//             control={control}
//             render={({ field }) => (
//               <CustomTextField
//                 {...field}
//                 label="Country"
//                 fullWidth
//                 variant="outlined"
//                 disabled
//               />
//             )}
//           />
//         </Grid>
//       </Grid>
//     </Box>
//   );
// }




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

