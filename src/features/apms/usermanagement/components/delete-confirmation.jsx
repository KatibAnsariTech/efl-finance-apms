import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import React, { useState } from "react";

function DeleteConfirmation({
  openDeleteDialog,
  setOpenDeleteDialog,
  handleDelete,
}) {
  const handleCloseDeleteDialog = () => setOpenDeleteDialog(false);

  return (
    <Dialog open={openDeleteDialog} onClose={handleCloseDeleteDialog}>
      <DialogTitle>Confirm Deletion</DialogTitle>
      <DialogContent>
        <Typography>Are you sure you want to delete this item?</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCloseDeleteDialog}>Cancel</Button>
        <Button color="error" onClick={handleDelete} variant="contained">
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default DeleteConfirmation;
