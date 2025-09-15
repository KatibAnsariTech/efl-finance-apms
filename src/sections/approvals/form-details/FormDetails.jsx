import { Box, Grid, Paper, TextField, Typography } from "@mui/material";
import React from "react";
import { useRouter } from "src/routes/hooks";

function FormDetails({ data }) {
  const form = data?.formId || {};
  const router = useRouter();
  return (
    <div>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 2, sm: 2 },
          borderRadius: 4,
          width: "100%",
          maxWidth: "100%",
          // mt: 2,
          overflow: "hidden",
          backgroundColor: "transparent",
        }}
      >
        <Box sx={{ p: 0, pb: 2 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              // alignItems: "center",
            }}
          >
            <Box sx={{ p: 0, pb: 2 }}>
              <Typography variant="h5">Form Details</Typography>
              <Box
                sx={{
                  height: 2,
                  width: 120,
                  background: "#12368d",
                  borderRadius: 1,
                  mb: 1,
                }}
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                // alignItems: "center",
                cursor: "pointer",
                position: "relative",
                ml: 2,
                "&:hover .close-tooltip": { opacity: 1, pointerEvents: "auto" },
              }}
              onClick={() => router.push("/credit-deviation/request-status")}
            >
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="#e53935"
                stroke="#fff"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{ borderRadius: "50%" }}
              >
                <circle cx="12" cy="12" r="12" fill="#e53935" />
                <line x1="8" y1="8" x2="16" y2="16" />
                <line x1="16" y1="8" x2="8" y2="16" />
              </svg>
              <Box
                className="close-tooltip"
                sx={{
                  position: "absolute",
                  top: 0,
                  right: 35,
                  background: "#12368d",
                  color: "#fff",
                  px: 1.5,
                  py: 0.5,
                  borderRadius: 1,
                  fontSize: "0.85rem",
                  whiteSpace: "nowrap",
                  opacity: 0,
                  pointerEvents: "none",
                  transition: "opacity 0.2s",
                  zIndex: 10,
                }}
              >
                Back to requests page
              </Box>
            </Box>
          </Box>

          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="text"
                label="Channel"
                disabled
                value={form.channel?.value || "-"}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="text"
                label="Region"
                disabled
                value={form.region?.value || "-"}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="text"
                label="Financial Year"
                disabled
                value={form.fYear || "-"}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="text"
                label="Month"
                disabled
                value={form.month || "-"}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="text"
                label="Request Type"
                disabled
                value={
                  form.subtype === "Extension"
                    ? "Credit Request Extension"
                    : "Credit Request"
                }
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                type="text"
                label="Amount"
                disabled
                value={form.amount || "-"}
              />
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </div>
  );
}

export default FormDetails;
