import { Box, Divider, Grid, Paper, Stack, Typography } from "@mui/material";
import React from "react";
import { fDateTime } from "src/utils/format-time";

function JVCurrentStatus({ steps = [], data }) {
  return (
    <Paper
      elevation={0}
      sx={{
        width: "100%",
        maxWidth: "100%",
        pl: 3,
        // mt: 2,
        overflow: "hidden",
        backgroundColor: "transparent",
      }}
    >
      <Box sx={{ p: 0, pb: 2 }}>
        <Typography variant="h5">Approval History</Typography>
        <Box
          sx={{
            height: 2,
            width: 160,
            background: "#12368d",
            borderRadius: 1,
            mb: 2,
          }}
        />

        <Grid container spacing={3} p={2}>
          <Box
            sx={{
              border: "1px dashed grey",
              p: 2,
              display: "flex",
              flexDirection: "column",
              width: "100%",
              maxWidth: "100%",
              borderRadius: 2,
              mt: 1,
            }}
          >
            <Box mb={2}>
              <Typography variant="subtitle1" fontWeight={600}>
                Step 1
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography fontWeight="bold" color="text.primary">
                  Raised By
                </Typography>
                <Typography>{data?.requesterId?.username}</Typography>
                {data?.formId?.requesterRemark &&<Typography>with comment:</Typography>}
              </Stack>
              <Box
                sx={{
                  borderLeft: "6px solid grey",
                  px: 2,
                  my: 1,
                  ml: 2,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                <Typography>{data?.formId?.requesterRemark}</Typography>
              </Box>

              <Divider sx={{ my: 1 }} />
              <Stack
                direction="row"
                spacing={3}
                sx={{
                  // backgroundColor: "#f5f5f5",
                  borderRadius: 1,
                  px: 2,
                  py: 1,
                  mt: 1,
                  alignItems: "center",
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  <strong>Raised at:</strong> {fDateTime(data?.createdAt)}
                </Typography>
              </Stack>
            </Box>
            {steps.length === 0 && (
              <Typography sx={{ my: "auto" }}>
                No approval history yet.
              </Typography>
            )}
            {steps.map((step, idx) => (
              <Box key={idx} mb={2}>
                <Typography variant="subtitle1" fontWeight={600}>
                  {`Step ${idx + 2}`}
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Typography fontWeight="bold" color="text.primary">
                    {step.status}
                  </Typography>
                  {step.approverId?.username && (
                    <Typography>
                      {step.status === "Approved"
                        ? "by"
                        : step.status === "Submit Response"
                        ? "by"
                        : "at"}
                    </Typography>
                  )}
                  {step.approverId?.username && (
                    <Typography>
                      {step?.approverId?.username }
                      ({step?.approverId?.email})
                    </Typography>
                  )}
                  {step.comment && <Typography>with comment:</Typography>}
                </Stack>
                {step.comment && (
                  <Box
                    sx={{
                      borderLeft: "6px solid grey",
                      px: 2,
                      my: 1,
                      ml: 2,
                      whiteSpace: "nowrap",
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                    }}
                  >
                    <Typography>{step.comment}</Typography>
                  </Box>
                )}
                <Divider sx={{ my: 1 }} />
                <Stack
                  direction="row"
                  spacing={3}
                  sx={{
                    // backgroundColor: "#f5f5f5",
                    borderRadius: 1,
                    px: 2,
                    py: 1,
                    mt: 1,
                    alignItems: "center",
                  }}
                >
                  <Typography variant="body2" color="text.secondary">
                    <strong>Assigned On:</strong> {fDateTime(step.createdAt)}
                  </Typography>
                  {step?.status !== "Pending" && (
                    <Typography variant="body2" color="text.secondary">
                      <strong>Actioned On:</strong> {fDateTime(step.updatedAt)}
                    </Typography>
                  )}
                </Stack>
              </Box>
            ))}
          </Box>
        </Grid>
      </Box>
    </Paper>
  );
}

export default JVCurrentStatus;
