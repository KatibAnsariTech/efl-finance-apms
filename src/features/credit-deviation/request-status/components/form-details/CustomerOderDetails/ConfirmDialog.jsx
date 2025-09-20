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

const getScoreColor = (score) => {
  if (score >= 6) return "success.main";
  if (score >= 4) return "warning.main";
  return "error.main";
};

const ConfirmDialog = ({
  open,
  onClose,
  onConfirm,
  title = "Confirm Action",
  message = "Are you sure you want to proceed?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  score = 6,
  agreement = "Agreement is not present",
}) => {
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
        <Typography variant="body1" color="text.secondary" mb={2}>
          {message}
        </Typography>

        <Box display="flex" justifyContent="start" mb={1}>
          <Typography variant="subtitle1" color="text.secondary" width={"28%"}>
            Score:
          </Typography>
          <Typography fontWeight={600} color={getScoreColor(score)}>
            {score} / 7
          </Typography>
        </Box>

        <Box display="flex" justifyContent="start" mb={1}>
          <Typography variant="subtitle1" color="text.secondary" width={"28%"}>
            Agreement:
          </Typography>
          <Typography
            fontWeight={500}
            color={agreement.includes("not") ? "error.main" : "success.main"}
          >
            {agreement}
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
