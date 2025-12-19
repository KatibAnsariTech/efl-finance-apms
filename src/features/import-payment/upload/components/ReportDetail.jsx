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
                 {/* Out Put Document */}
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
