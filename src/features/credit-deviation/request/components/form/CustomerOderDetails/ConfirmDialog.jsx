import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Slide,
} from "@mui/material";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";

const ConfirmDialog = ({
  open,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  score,
  agreement = "No",
  amount = 0,
}) => {
  const isAgreementMissing = /(^|\s)(no|not)(\s|$)/i.test(agreement);
  const getScoreColor = () => {
    if (isAgreementMissing) return "error.main";
    if (score === 7) return "error.main";
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      TransitionComponent={Slide}
      TransitionProps={{ direction: "up" }}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          p: 2,
        },
      }}
    >
      <DialogTitle>
        <Box display="flex" alignItems="center" gap={1}>
          <WarningAmberRoundedIcon color="warning" />
          <Typography variant="h6">{title}</Typography>
        </Box>
      </DialogTitle>

      <DialogContent>
        <Typography variant="subtitle1" color="text.primary" mb={2}>
          {message}
        </Typography>

        <Box display="flex" justifyContent="start" mb={1} gap={1}>
          <Typography variant="subtitle1" color="text.primary">
            Rist Analysis Score:
          </Typography>
          <Typography fontWeight={600} color={getScoreColor(score)}>
            {/* <Typography fontWeight={600}> */}
            {score} / 7
          </Typography>
        </Box>

        <Box display="flex" justifyContent="start" mb={1} gap={1}>
          <Typography variant="subtitle1" color="text.primary">
            Agreement:
          </Typography>
          <Typography
            fontWeight={500}
            color={isAgreementMissing ? "error.main" : "text.primary"}
          >
            {agreement}
          </Typography>
        </Box>
        <Box display="flex" justifyContent="start" mb={1} gap={1}>
          <Typography variant="subtitle1" color="text.primary">
            Total Order Value:
          </Typography>
          <Typography fontWeight={500}>
            {typeof amount === "number"
              ? amount.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })
              : amount}
          </Typography>
        </Box>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} color="inherit" variant="outlined">
          {cancelText}
        </Button>
        <Button
          onClick={onConfirm}
          color="primary"
          variant="contained"
          sx={{ ml: 1 }}
        >
          {confirmText}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
