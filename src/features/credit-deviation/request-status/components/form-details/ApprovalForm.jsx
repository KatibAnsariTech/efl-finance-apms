import {
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  Paper,
  CircularProgress,
} from "@mui/material";
import { useAccount } from "src/hooks/use-account";
import { useFormContext } from "react-hook-form";

import { useState } from "react";

const ApprovalForm = ({
  data,
  register,
  errors,
  handleTaskAction,
  buttonLoading,
}) => {
  const user = useAccount();
  const isRequester = user?.userType === "REQUESTER";
  const isApprover = user?.userType === "APPROVER";
  const { setError, getValues, clearErrors } = useFormContext();

  const handleActionClick = (actionType) => {
    const comment = getValues("comment")?.trim();
    if (
      ["declined", "moreInfo", "submitResponse"].includes(actionType) &&
      !comment
    ) {
      setError("comment", {
        type: "manual",
        message: "Comment is required",
      });
      return;
    }
    clearErrors("comment");
    handleTaskAction({ actionType });
  };

  return (
    <Paper
      elevation={3}
      sx={{
        width: { xs: "95%", lg: "97%", xl: "98%" },
        mx: "auto",
        p: 3,
        border: "1px solid #ccc",
        borderRadius: 2,
      }}
    >
      <Typography variant="h6" color="textSecondary" gutterBottom>
        Request No. #{data?.formId?.slNo}
      </Typography>
      <Typography variant="body2" color="textSecondary" gutterBottom>
        Leave a comment with your response
      </Typography>

      <Box component="form" noValidate>
        <TextField
          {...register("comment")}
          id="comment"
          placeholder="Comment..."
          multiline
          minRows={4}
          fullWidth
          variant="filled"
          error={!!errors.comment}
          helperText={errors.comment?.message}
          sx={{ backgroundColor: "#f3f4f6", mt: 2 }}
        />

        <Stack direction="row" spacing={2} sx={{ mt: 3 }}>
          {/* { isApprover && (
            <>
              <Button
                type="button"
                variant="contained"
                color="success"
                onClick={() => handleActionClick("approved")}
                disabled={buttonLoading === "approved"}
              >
                {buttonLoading === "approved" ? (
                  <CircularProgress size={20} sx={{ color: "#fff" }} />
                ) : (
                  "Accept"
                )}
              </Button>
              <Button
                type="button"
                variant="contained"
                color="error"
                onClick={() => handleActionClick("declined")}
                disabled={buttonLoading === "declined"}
              >
                {buttonLoading === "declined" ? (
                  <CircularProgress size={20} sx={{ color: "#fff" }} />
                ) : (
                  "Reject"
                )}
              </Button>
              <Button
                type="button"
                variant="contained"
                color="warning"
                onClick={() => handleActionClick("moreInfo")}
                disabled={buttonLoading === "moreInfo"}
                sx={{color:"#fff"}}
              >
                {buttonLoading === "moreInfo" ? (
                  <CircularProgress size={20} sx={{ color: "#fff" }} />
                ) : (
                  "Raise Query"
                )}
              </Button>
            </>
          )} */}
          {isRequester && (
            <Button
              type="button"
              variant="contained"
              color="primary"
              onClick={() => handleActionClick("submitResponse")}
              disabled={buttonLoading === "submitResponse"}
            >
              {buttonLoading === "submitResponse" ? (
                <CircularProgress size={20} sx={{ color: "#fff" }} />
              ) : (
                "Submit Response"
              )}
            </Button>
          )}
        </Stack>
      </Box>
    </Paper>
  );
};

export default ApprovalForm;
