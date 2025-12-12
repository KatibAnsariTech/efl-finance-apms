import React, { useState } from "react";
import {
  Box,
  Stack,
  Button,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { userRequest } from "src/requestMethod";
import swal from "sweetalert";

const ReportAction = ({ requestNo, onActionComplete }) => {
  const [approveLoading, setApproveLoading] = useState(false);
  const [rejectLoading, setRejectLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm({
    defaultValues: {
      comment: "",
    },
  });

  const commentValue = watch("comment");

  const handleApprovalAction = async (action) => {
    try {
      if (action === "approved") {
        setApproveLoading(true);
      } else {
        setRejectLoading(true);
      }

      const requestData = {
        requestNo: requestNo,
        comment: commentValue || "No comment provided",
      };

      let response;
      if (action === "approved") {
        response = await userRequest.post(
          `/imt/acceptForm`,
          requestData
        );
      } else {
        response = await userRequest.post(
          `/imt/declineForm`,
          requestData
        );
      }

      if (response.data?.success) {
        swal("Success", `Request ${action} successfully!`, "success");
        reset();
        if (onActionComplete) {
          onActionComplete(action);
        }
      } else {
        throw new Error(
          response.data?.message || `Failed to ${action} request`
        );
      }
    } catch (error) {
      console.error(`Error ${action} request:`, error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        `Failed to ${action} request`;
      swal("Error", errorMessage, "error");
    } finally {
      setApproveLoading(false);
      setRejectLoading(false);
    }
  };

  return (
    <Box sx={{ mt: 3, p: 2, backgroundColor: "#f8f9fa", borderRadius: 1 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Box sx={{ pl: 0 }}>
          <Typography variant="h5">Action</Typography>
          <Box
            sx={{
              height: 2,
              width: "100%",
              background: "#12368d",
              borderRadius: 1,
              mb: 2,
            }}
          />
        </Box>

        <Stack direction="row" spacing={2}>
          <Button
            variant="contained"
            color="success"
            onClick={handleSubmit(() => handleApprovalAction("approved"))}
            disabled={approveLoading || rejectLoading}
            startIcon={approveLoading ? <CircularProgress size={20} /> : null}
            sx={{ minWidth: 120 }}
          >
            {approveLoading ? "Processing..." : "Approved"}
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleSubmit(() => handleApprovalAction("rejected"))}
            disabled={approveLoading || rejectLoading}
            startIcon={rejectLoading ? <CircularProgress size={20} /> : null}
            sx={{ minWidth: 120 }}
          >
            {rejectLoading ? "Processing..." : "Rejected"}
          </Button>
        </Stack>
      </Stack>

      <Typography variant="body2" sx={{ mb: 2, color: "#666" }}>
        Leave a comment with your response{" "}
        <span style={{ color: "red" }}>*</span>
      </Typography>

      <Controller
        name="comment"
        control={control}
        rules={{
          required: "Comment is required",
          minLength: {
            value: 3,
            message: "Comment must be at least 3 characters",
          },
        }}
        render={({ field }) => (
          <TextField
            {...field}
            fullWidth
            multiline
            rows={3}
            placeholder="Enter your comment..."
            sx={{ mb: 2, backgroundColor: "#fff" }}
            error={!!errors.comment}
            helperText={errors.comment?.message}
          />
        )}
      />
    </Box>
  );
};

export default ReportAction;
