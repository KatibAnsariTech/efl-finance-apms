import {
  Box,
  Divider,
  Grid,
  Paper,
  Stack,
  Typography,
  CircularProgress,
} from "@mui/material";
import React, { useMemo } from "react";
import { fDateTime } from "src/utils/format-time";

function ApprovalHistory({ approvalData, loading, error }) {
  const steps = useMemo(() => {
    if (!approvalData) return [];

    const derived = [];

    // Step 1: Raised by requester
    const requester = approvalData.requester || approvalData.requesterId || approvalData.reportRaisedId;
    derived.push({
      title: "Step 1",
      statusLabel: "Raised By",
      actor:
        requester?.username && requester?.email
          ? `${requester.username}(${requester.email})`
          : requester?.username || requester?.email || "-",
      comment: approvalData?.requesterRemark || approvalData?.reportId?.requesterRemark,
      assignedOn: approvalData?.createdAt,
      actionedOn: approvalData?.createdAt,
      isPending: false,
    });

    // Steps from new IMT shape: steps[].approvals[]
    if (Array.isArray(approvalData?.steps)) {
      approvalData.steps.forEach((step, idx) => {
        const level = `Step ${idx + 2}`;
        (step.approvals || []).forEach((appr, aIdx) => {
          const approver = appr.approverId || {};
          derived.push({
            title: level,
            statusLabel: formatStatus(appr.status),
            actor:
              approver.username && approver.email
                ? `${approver.username}(${approver.email})`
                : approver.username || approver.email || "-",
            comment: appr.comment,
            assignedOn: appr.created || step.createdAt,
            actionedOn: appr.status === "Pending" ? null : appr.updated || step.updatedAt,
            isPending: appr.status === "Pending",
            key: `${level}-${aIdx}`,
          });
        });
      });
    }

    // Legacy shape fallback: hierarchy
    if (!derived.length && Array.isArray(approvalData?.hierarchy)) {
      approvalData.hierarchy.forEach((step, idx) => {
        derived.push({
          title: `Step ${idx + 2}`,
          statusLabel: formatStatus(step.status),
          actor:
            step?.approverId?.username && step?.approverId?.email
              ? `${step.approverId.username}(${step.approverId.email})`
              : step?.approverId?.username || step?.approverId?.email || "-",
          comment: step.comment,
          assignedOn: step.createdAt,
          actionedOn: step.status === "Pending" ? null : step.updatedAt,
          isPending: step.status === "Pending",
          key: `legacy-${idx}`,
        });
      });
    }

    return derived;
  }, [approvalData]);

  if (loading) {
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
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
            <CircularProgress />
          </Box>
        </Box>
      </Paper>
    );
  }

  if (error) {
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
          <Typography color="error">{error}</Typography>
        </Box>
      </Paper>
    );
  }

  if (!approvalData) {
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
          <Typography>No approval history available.</Typography>
        </Box>
      </Paper>
    );
  }

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
      <Box sx={{ p: 0, py: 2 }}>
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
            {!steps.length && (
              <Typography sx={{ my: "auto" }}>
                No approval history yet.
              </Typography>
            )}
            {steps.map((step, idx) => (
              <Box key={step.key || idx} mb={2}>
                <Typography variant="subtitle1" fontWeight={600}>
                  {step.title || `Step ${idx + 1}`}
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                  <Typography fontWeight="bold" color="text.primary">
                    {step.statusLabel}
                  </Typography>
                  {step.actor && <Typography>{step.isPending ? "at" : "by"}</Typography>}
                  {step.actor && <Typography>{step.actor}</Typography>}
                  {step.comment && <Typography>with comment:</Typography>}
                </Stack>
                {step.comment && (
                  <Box
                    sx={{
                      borderLeft: "6px solid grey",
                      px: 2,
                      my: 1,
                      ml: 2,
                      whiteSpace: "pre-wrap",
                      wordBreak: "break-word",
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
                    borderRadius: 1,
                    px: 2,
                    py: 1,
                    mt: 1,
                    alignItems: "center",
                    flexWrap: "wrap",
                  }}
                >
                  {step.assignedOn && (
                    <Typography variant="body2" color="text.secondary">
                      <strong>{step.isPending ? "Assigned On:" : "Raised at:"}</strong>{" "}
                      {fDateTime(step.assignedOn)}
                    </Typography>
                  )}
                  {step.actionedOn && (
                    <Typography variant="body2" color="text.secondary">
                      <strong>Actioned On:</strong> {fDateTime(step.actionedOn)}
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

export default ApprovalHistory;

const formatStatus = (value) => {
  if (!value) return "Pending";
  return value.toString().replace(/_/g, " ").toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
};