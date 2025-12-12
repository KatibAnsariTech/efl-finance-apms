import { Box, Divider, Grid, Paper, Stack, Typography } from "@mui/material";
import React from "react";
import { fDateTime } from "src/utils/format-time";

function RequestCurrentStatus({ steps = [], data }) {
  // Find the "Submitted" step (level 0) to get requester info from approvers array
  const submittedStep = steps.find(step => step.level === 0 || step.status === "Submitted");
  const requester = submittedStep?.approverPositionId?.approvers?.[0] || 
                    submittedStep?.approverId?.[0] ||
                    data?.requester ||
                    data?.requesterId?.user;

  return (
    <Paper
      elevation={0}
      sx={{
        width: "100%",
        maxWidth: "100%",
        pl: 3,
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
                <Typography>
                  {requester?.username || requester?.name}
                  {requester?.email
                    ? ` (${requester?.email})`
                    : ""}
                </Typography>
                {data?.requesterRemark && (
                  <Typography>with comment:</Typography>
                )}
              </Stack>
              {data?.requesterRemark && (
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
                  <Typography>{data?.requesterRemark}</Typography>
                </Box>
              )}

              <Divider sx={{ my: 1 }} />
              <Stack
                direction="row"
                spacing={3}
                sx={{
                  borderRadius: 1,
                  px: 2,
                  py: 1,
                  mt: 1,
                  alignItems: "center",
                }}
              >
                <Typography variant="body2" color="text.secondary">
                  <strong>Raised at:</strong>{" "}
                  {fDateTime(
                    submittedStep?.assignedAt ||
                      submittedStep?.createdAt ||
                      data?.createdAt ||
                      data?.formId?.createdAt
                  )}
                </Typography>
              </Stack>
            </Box>
            {steps.length === 0 && (
              <Typography sx={{ my: "auto" }}>
                No approval history yet.
              </Typography>
            )}
            {steps
              .filter(step => step.level !== 0 && step.status !== "Submitted")
              .map((step, idx) => {
              // Handle both old structure (approverId) and new structure (approverPositionId.approvers)
              let approver;
              if (step.approverPositionId?.approvers) {
                approver = Array.isArray(step.approverPositionId.approvers) && step.approverPositionId.approvers.length > 0
                  ? step.approverPositionId.approvers[0]
                  : step.approverPositionId.approvers;
              } else if (step.approverId) {
                approver = Array.isArray(step.approverId) && step.approverId.length > 0
                  ? step.approverId[0]
                  : step.approverId;
              }

              // Check if this is a clarification step
              const isClarification = step.isClarification || step.status === "Clarification_Needed" || step.status === "Clarification_Responded";
              // Show "Raised By" when status is "Submitted", otherwise show the status
              const statusDisplay = step.status === "Submitted" 
                ? "Raised By" 
                : step.status?.replace("_", " ");

              return (
                <Box key={step._id || idx} mb={2}>
                  <Typography variant="subtitle1" fontWeight={600}>
                    Step {idx + 2}
                  </Typography>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography 
                      fontWeight="bold" 
                      color={step.status === "Approved" ? "success.main" : step.status === "Pending" ? "warning.main" : "text.primary"}
                    >
                      {statusDisplay}
                    </Typography>
                    {approver?.username && (
                      <Typography>
                        {step.status === "Approved"
                          ? "by"
                          : step.status === "Submit Response" || step.status === "Clarification_Responded"
                          ? "by"
                          : "at"}
                      </Typography>
                    )}
                    {approver?.username && (
                      <Typography>
                        {approver?.username}
                        {approver?.email ? ` (${approver?.email})` : ""}
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
                  {step.responseComment && (
                    <Box
                      sx={{
                        borderLeft: "6px solid green",
                        px: 2,
                        my: 1,
                        ml: 2,
                        whiteSpace: "nowrap",
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                      }}
                    >
                      <Typography><strong>Response:</strong> {step.responseComment}</Typography>
                    </Box>
                  )}
                  <Divider sx={{ my: 1 }} />
                  <Stack
                    direction="row"
                    spacing={3}
                    sx={{
                      borderRadius: 1,
                      px: 2,
                      py: 1,
                      mt: 1,
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      <strong>Assigned On:</strong> {fDateTime(step.assignedAt || step.createdAt)}
                    </Typography>
                    {step?.status !== "Pending" && (step?.completedAt || step?.updatedAt) && (
                      <Typography variant="body2" color="text.secondary">
                        <strong>Actioned On:</strong> {fDateTime(step.completedAt || step.updatedAt)}
                      </Typography>
                    )}
                  </Stack>
                </Box>
              );
            })}
          </Box>
        </Grid>
      </Box>
    </Paper>
  );
}

export default RequestCurrentStatus;


