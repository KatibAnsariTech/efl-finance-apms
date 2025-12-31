import React from "react";
import {
  Box,
  Container,
  Grid,
  Paper,
  Typography,
  TextField,
  Divider,
} from "@mui/material";
import { Helmet } from "react-helmet-async";
import { fDateTime } from "src/utils/format-time";

export default function APMSRequestDetails({ defaultValues }) {
  if (!defaultValues) return null;

  return (
    <>
      <Helmet>
        <title>APMS | View Request</title>
      </Helmet>

      <Container maxWidth="md">
        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: 3,
            boxShadow:
              "0px 20px 45px rgba(15,41,88,0.08), 0px 2px 6px rgba(15,41,88,0.04)",
          }}
        >
          <Typography variant="h5" fontWeight={600} mb={2}>
            APMS Request Details
          </Typography>

          <Divider sx={{ my: 3 }} />

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Request No"
                fullWidth
                value={defaultValues.requestNo}
                InputProps={{ readOnly: true }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Status"
                fullWidth
                value={defaultValues.status}
                InputProps={{ readOnly: true }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Advance Type"
                fullWidth
                value={defaultValues.advanceType}
                InputProps={{ readOnly: true }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Raised On"
                fullWidth
                value={fDateTime(defaultValues.createdAt)}
                InputProps={{ readOnly: true }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Purpose"
                fullWidth
                multiline
                minRows={3}
                value={defaultValues.purpose}
                InputProps={{ readOnly: true }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Requested Amount"
                fullWidth
                value={`₹${defaultValues.requestedAmount?.toLocaleString()}`}
                InputProps={{ readOnly: true }}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                label="Approved Amount"
                fullWidth
                value={
                  defaultValues.approvedAmount
                    ? `₹${defaultValues.approvedAmount.toLocaleString()}`
                    : "-"
                }
                InputProps={{ readOnly: true }}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                label="Settlement Status"
                fullWidth
                value={defaultValues.settlementStatus || "Not Settled"}
                InputProps={{ readOnly: true }}
              />
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </>
  );
}
