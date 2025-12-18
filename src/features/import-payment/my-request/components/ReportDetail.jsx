// import React from "react";
// import { Helmet } from "react-helmet-async";
// import {
//   Box,
//   Button,
//   Chip,
//   Container,
//   Divider,
//   Grid,
//   InputAdornment,
//   MenuItem,
//   Paper,
//   Stack,
//   TextField,
//   Typography,
// } from "@mui/material";
// import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
// import { DatePicker } from "@mui/x-date-pickers/DatePicker";
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

// export default function IMTReportDetails({defaultValues}) {
//   console.log("defaultValues",JSON.stringify(defaultValues))
//   return (
//     <>
//       <Helmet>
//         <title>Import Payment | Raise Request</title>
//       </Helmet>

//       <LocalizationProvider dateAdapter={AdapterDateFns}>
//         <Box sx={{ backgroundColor: "#F4F6F8", minHeight: "100vh", py: 4 }}>
//           <Container maxWidth="lg">
//             <Box component="form">
//               <Paper
//                 elevation={0}
//                 sx={{
//                   p: { xs: 3, md: 4 },
//                   borderRadius: 4,
//                   boxShadow:
//                     "0px 20px 45px rgba(15, 41, 88, 0.08), 0px 2px 6px rgba(15, 41, 88, 0.04)",
//                   backgroundColor: "#fff",
//                 }}
//               >
//                 {/* HEADER */}
//                 <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
//                   <Box>
//                     <Typography variant="h5" fontWeight={600}>
//                       Import / Advance Request
//                     </Typography>
//                   </Box>
//                 </Box>

//                 <Divider sx={{ my: 3 }} />

//                 {/* ALL FORM FIELDS */}
//                 <Grid container spacing={3}>

//                   {/* Assigned Department */}
//                   <Grid item xs={12} md={6}>
//                     <Controller
//                       name="department"
//                       render={({ field }) => (
//                         <TextField
//                           {...field}
//                           select fullWidth label="Assigned Department"
//                           error={!!errors.department}
//                           helperText={errors.department?.message}
//                         >
//                           {departmentOptions.map((o) => (
//                             <MenuItem key={o._id} value={o._id}>{o.value}</MenuItem>
//                           ))}
//                         </TextField>
//                       )}
//                     />
//                   </Grid>

//                   {/* Type of Import */}
//                   <Grid item xs={12} md={6}>
//                     <Controller
//                       name="importType"
//                       render={({ field }) => (
//                         <TextField
//                           {...field}
//                           select fullWidth label="Type of Import"
//                           error={!!errors.importType}
//                           helperText={errors.importType?.message}
//                         >
//                           {importTypeOptions.map((o) => (
//                             <MenuItem key={o._id} value={o._id}>{o.value}</MenuItem>
//                           ))}
//                         </TextField>
//                       )}
//                     />
//                   </Grid>

//                   {/* Department (disabled) */}
//                   <Grid item xs={12} md={6}>
//                     <Controller
//                       name="department"
//                       render={({ field }) => (
//                         <TextField
//                           {...field}
//                           select disabled fullWidth label="Department"
//                         >
//                           {departmentOptions.map((o) => (
//                             <MenuItem key={o._id} value={o._id}>{o.value}</MenuItem>
//                           ))}
//                         </TextField>
//                       )}
//                     />
//                   </Grid>

//                   {/* Scope */}
//                   <Grid item xs={12} md={6}>
//                     <Controller
//                       name="scope"
//                       render={({ field }) => (
//                         <TextField
//                           {...field}
//                           select fullWidth label="Scope"
//                           error={!!errors.scope}
//                           helperText={errors.scope?.message}
//                         >
//                           {scopeOptions.map((o) => (
//                             <MenuItem key={o._id} value={o._id}>{o.value}</MenuItem>
//                           ))}
//                         </TextField>
//                       )}
//                     />
//                   </Grid>

//                   {/* Select Type */}
//                   <Grid item xs={12}>
//                     <Controller
//                       name="type"
//                       render={({ field }) => (
//                         <TextField
//                           {...field}
//                           select fullWidth label="Select Type"
//                           error={!!errors.type}
//                           helperText={errors.type?.message}
//                         >
//                           {purchaseTypeOptions.map((o) => (
//                             <MenuItem key={o._id} value={o._id}>{o.value}</MenuItem>
//                           ))}
//                         </TextField>
//                       )}
//                     />
//                   </Grid>

//                   {/* PO Date */}
//                   <Grid item xs={12} md={6}>
//                     <Controller
//                       name="poDate"
//                       render={({ field }) => (
//                         <DatePicker
//                           {...field}
//                           label="PO Date"
//                           format="dd/MM/yyyy"
//                           slotProps={{
//                             textField: {
//                               fullWidth: true,
//                               error: !!errors.poDate,
//                               helperText: errors.poDate?.message,
//                             },
//                           }}
//                         />
//                       )}
//                     />
//                   </Grid>

//                   {/* PO Number */}
//                   <Grid item xs={12} md={6}>
//                     <Controller
//                       name="poNumber"
//                       render={({ field }) => (
//                         <TextField
//                           {...field} fullWidth label="PO Number"
//                           error={!!errors.poNumber}
//                           helperText={errors.poNumber?.message}
//                         />
//                       )}
//                     />
//                   </Grid>

//                   {/* Party / Vendor */}
//                   <Grid item xs={12} md={6}>
//                     <Controller
//                       name="vendorId"
//                       render={({ field }) => (
//                         <TextField
//                           {...field}
//                           select fullWidth label="Party Name (Vendor)"
//                           error={!!errors.vendorId}
//                           helperText={errors.vendorId?.message}
//                         >
//                           {vendorOptions.map((o) => (
//                             <MenuItem key={o} value={o}>{o}</MenuItem>
//                           ))}
//                         </TextField>
//                       )}
//                     />
//                   </Grid>

//                   {/* GRN Date */}
//                   <Grid item xs={12} md={6}>
//                     <Controller
//                       name="grnDate"
//                       render={({ field }) => (
//                         <DatePicker
//                           {...field}
//                           label="GRN Date"
//                           format="dd/MM/yyyy"
//                           slotProps={{
//                             textField: {
//                               fullWidth: true,
//                               error: !!errors.grnDate,
//                               helperText: errors.grnDate?.message,
//                             },
//                           }}
//                         />
//                       )}
//                     />
//                   </Grid>

//                   {/* PO Amount */}
//                   <Grid item xs={12} md={6}>
//                     <Controller
//                       name="poAmount"
//                       render={({ field }) => (
//                         <TextField
//                           {...field} fullWidth type="number" label="PO Amount"
//                           InputProps={{
//                             startAdornment: (
//                               <InputAdornment position="start">
//                                 <AttachMoneyIcon fontSize="small" />
//                               </InputAdornment>
//                             ),
//                           }}
//                           error={!!errors.poAmount}
//                           helperText={errors.poAmount?.message}
//                         />
//                       )}
//                     />
//                   </Grid>

//                   {/* Currency */}
//                   <Grid item xs={12} md={6}>
//                     <Controller
//                       name="currencyId"
//                       render={({ field }) => (
//                         <TextField
//                           {...field}
//                           select fullWidth label="Currency Type"
//                           error={!!errors.currencyId}
//                           helperText={errors.currencyId?.message}
//                         >
//                           {currencyOptions.map((o) => (
//                             <MenuItem key={o.value} value={o.value}>
//                               {o.label}
//                             </MenuItem>
//                           ))}
//                         </TextField>
//                       )}
//                     />
//                   </Grid>

//                   {/* Advance Amount */}
//                   <Grid item xs={12} md={6}>
//                     <Controller
//                       name="advAmount"
//                       render={({ field }) => (
//                         <TextField
//                           {...field}
//                           fullWidth type="number" label="Advance Amount"
//                           InputProps={{
//                             startAdornment: (
//                               <InputAdornment position="start">
//                                 <AttachMoneyIcon fontSize="small" />
//                               </InputAdornment>
//                             ),
//                           }}
//                           error={!!errors.advAmount}
//                           helperText={errors.advAmount?.message}
//                         />
//                       )}
//                     />
//                   </Grid>

//                   {/* Advance Percentage */}
//                   <Grid item xs={12} md={6}>
//                     <Controller
//                       name="advPercentage"
//                       render={({ field }) => (
//                         <TextField
//                           {...field} fullWidth type="number" label="Advance Percentage"
//                           InputProps={{
//                             endAdornment: (
//                               <InputAdornment position="end">%</InputAdornment>
//                             ),
//                           }}
//                           error={!!errors.advPercentage}
//                           helperText={errors.advPercentage?.message}
//                         />
//                       )}
//                     />
//                   </Grid>

//                   {/* Payment Terms */}
//                   <Grid item xs={12}>
//                     <Controller
//                       name="paymentTerms"
//                       render={({ field }) => (
//                         <TextField
//                           {...field}
//                           multiline minRows={4} fullWidth
//                           label="Payment Terms"
//                           error={!!errors.paymentTerms}
//                           helperText={errors.paymentTerms?.message}
//                         />
//                       )}
//                     />
//                   </Grid>

//                   {/* PO UPLOAD */}
//                   <Grid item xs={12} md={6}>
//                     <Controller
//                       name="poDocument"
//                       render={({ field }) => (
//                         <UploadDropZone
//                           label="PO Upload"
//                           helperText="PDF, PNG, JPG up to 10MB"
//                           value={field.value}
//                           onChange={field.onChange}
//                           error={errors.poDocument?.message}
//                         />
//                       )}
//                     />
//                   </Grid>

//                   {/* PI UPLOAD */}
//                   <Grid item xs={12} md={6}>
//                     <Controller
//                       name="piDocument"
//                       render={({ field }) => (
//                         <UploadDropZone
//                           label="PI Upload"
//                           helperText="PDF, PNG, JPG up to 10MB"
//                           value={field.value}
//                           onChange={field.onChange}
//                           error={errors.piDocument?.message}
//                         />
//                       )}
//                     />
//                   </Grid>

//                 </Grid>
//               </Paper>
//             </Box>
//           </Container>
//         </Box>
//       </LocalizationProvider>
//     </>
//   );
// }

import React from "react";
import { Helmet } from "react-helmet-async";
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  TextField,
  Divider,
  Link,
} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

export default function IMTReportDetails({ defaultValues }) {
  if (!defaultValues) return null;

  const formatDate = (date) =>
    date ? new Date(date).toLocaleDateString("en-GB") : "-";

  return (
    <>
      <Helmet>
        <title>Import Payment | View Request</title>
      </Helmet>

      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <Box sx={{ minHeight: "100vh", py: 4 }}>
          <Container maxWidth="lg">
            <Paper
              elevation={0}
              sx={{
                p: { xs: 3, md: 4 },
                borderRadius: 4,
                boxShadow:
                  "0px 20px 45px rgba(15,41,88,0.08), 0px 2px 6px rgba(15,41,88,0.04)",
                backgroundColor: "#fff",
              }}
            >
              {/* Header */}
              <Typography variant="h5" fontWeight={600} mb={2}>
                Import / Advance Request 
              </Typography>

              <Divider sx={{ my: 3 }} />

              {/* FORM DISPLAY */}
              <Grid container spacing={3}>

                {/* Request No */}
                {/* <Grid item xs={12} md={6}>
                  <TextField
                    label="Request No"
                    fullWidth
                    value={defaultValues.requestNo}
                    InputProps={{ readOnly: true }}
                  />
                </Grid> */}

                {/* Status */}
                {/* <Grid item xs={12} md={6}>
                  <TextField
                    label="Status"
                    fullWidth
                    value={defaultValues.status}
                    InputProps={{ readOnly: true }}
                  />
                </Grid> */}

                {/* Department */}
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Department"
                    fullWidth
                    value={defaultValues.department}
                    InputProps={{ readOnly: true }}
                  />
                </Grid>

                {/* Import Type */}
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Import Type"
                    fullWidth
                    value={defaultValues.importType}
                    InputProps={{ readOnly: true }}
                  />
                </Grid>

                {/* Type */}
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Type"
                    fullWidth
                    value={defaultValues.type}
                    InputProps={{ readOnly: true }}
                  />
                </Grid>

                {/* Scope */}
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Scope"
                    fullWidth
                    value={defaultValues.scope}
                    InputProps={{ readOnly: true }}
                  />
                </Grid>

                {/* PO Date */}
                <Grid item xs={12} md={6}>
                  <TextField
                    label="PO Date"
                    fullWidth
                    value={formatDate(defaultValues.poDate)}
                    InputProps={{ readOnly: true }}
                  />
                </Grid>

                {/* PO Number */}
                <Grid item xs={12} md={6}>
                  <TextField
                    label="PO Number"
                    fullWidth
                    value={defaultValues.poNumber}
                    InputProps={{ readOnly: true }}
                  />
                </Grid>

                {/* Vendor */}
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Vendor"
                    fullWidth
                    value={
                      defaultValues.vendorId?.name +
                      " (" +
                      defaultValues.vendorId?.email +
                      ")"
                    }
                    InputProps={{ readOnly: true }}
                  />
                </Grid>

                {/* GRN Date */}
                <Grid item xs={12} md={6}>
                  <TextField
                    label="GRN Date"
                    fullWidth
                    value={formatDate(defaultValues.grnDate)}
                    InputProps={{ readOnly: true }}
                  />
                </Grid>

                {/* PO Amount */}
                <Grid item xs={12} md={6}>
                  <TextField
                    label="PO Amount"
                    fullWidth
                    value={defaultValues.poAmount}
                    InputProps={{ readOnly: true }}
                  />
                </Grid>

                {/* Currency */}
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Currency"
                    fullWidth
                    value={defaultValues.currencyId}
                    InputProps={{ readOnly: true }}
                  />
                </Grid>

                {/* Advance Amount */}
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Advance Amount"
                    fullWidth
                    value={defaultValues.advAmount}
                    InputProps={{ readOnly: true }}
                  />
                </Grid>

                {/* Advance % */}
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Advance Percentage"
                    fullWidth
                    value={defaultValues.advPercentage + "%"}
                    InputProps={{ readOnly: true }}
                  />
                </Grid>

                {/* Payment Terms */}
                <Grid item xs={12}>
                  <TextField
                    label="Payment Terms"
                    fullWidth
                    multiline
                    minRows={3}
                    value={defaultValues.paymentTerms}
                    InputProps={{ readOnly: true }}
                  />
                </Grid>

                {/* PO Document */}
                <Grid item xs={12} md={4}>
                  <Typography fontWeight={600}>PO Document</Typography>
                  <Link
                    href={defaultValues.poDocument}
                    target="_blank"
                    rel="noopener"
                    underline="hover"
                  >
                    View File
                  </Link>
                </Grid>

                {/* PI Document */}
                <Grid item xs={12} md={4}>
                  <Typography fontWeight={600}>PI Document</Typography>
                  <Link
                    href={defaultValues.piDocument}
                    target="_blank"
                    rel="noopener"
                    underline="hover"
                  >
                    View File
                  </Link>
                </Grid>
                 <Grid item xs={12} md={4}>
                  <Typography fontWeight={600}>Output Document</Typography>
                  <Link
                    href={defaultValues.outputDocument}
                    target="_blank"
                    rel="noopener"
                    underline="hover"
                  >
                    View File
                  </Link>
                </Grid>
              </Grid>
            </Paper>
          </Container>
        </Box>
      </LocalizationProvider>
    </>
  );
}
