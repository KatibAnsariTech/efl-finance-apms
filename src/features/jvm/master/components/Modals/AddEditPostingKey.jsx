import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import swal from "sweetalert";
import { userRequest } from "src/requestMethod";
import { showErrorMessage } from "src/utils/errorUtils";

const postingKeySchema = yup.object().shape({
  postingKey: yup.string().required("Posting Key is required"),
  description: yup.string().required("Description is required"),
  debitCredit: yup.string().required("Debit/Credit is required"),
  isActive: yup.boolean(),
});

const debitCreditOptions = [
  { value: "Debit", label: "Debit" },
  { value: "Credit", label: "Credit" },
];

export default function AddEditPostingKey({ open, handleClose, getData, editData }) {
  const [loading, setLoading] = useState(false);
  const isEditMode = !!editData;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
    watch,
  } = useForm({
    resolver: yupResolver(postingKeySchema),
    defaultValues: {
      postingKey: "",
      description: "",
      debitCredit: "",
      isActive: true,
    },
  });

  useEffect(() => {
    if (editData) {
      setValue("postingKey", editData.postingKey || "");
      setValue("description", editData.description || "");
      setValue("debitCredit", editData.debitCredit || "");
      setValue("isActive", editData.isActive !== undefined ? editData.isActive : true);
    } else {
      reset();
    }
  }, [editData, setValue, reset]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const payload = {
        key: "PostingKey",
        value: data.postingKey,
        description: data.description,
        debitCredit: data.debitCredit,
        isActive: data.isActive,
      };

      if (isEditMode) {
        await userRequest.put(`/admin/updateMaster?id=${editData._id}`, payload);
        await swal({
          title: "Success!",
          text: "Posting Key updated successfully!",
          icon: "success",
          button: "OK",
        });
      } else {
        await userRequest.post("/admin/createMasters", payload);
        await swal({
          title: "Success!",
          text: "Posting Key created successfully!",
          icon: "success",
          button: "OK",
        });
      }
      
      getData();
      handleClose();
    } catch (error) {
      showErrorMessage(error, `Failed to ${isEditMode ? "update" : "create"} Posting Key`, swal);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          {isEditMode ? "Edit Posting Key" : "Add Posting Key"}
        </Typography>
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3, pt: 1 }}>
            <TextField
              fullWidth
              label="Posting Key"
              {...register("postingKey")}
              error={!!errors.postingKey}
              helperText={errors.postingKey?.message}
              disabled={loading}
              placeholder="e.g., 40, 50, 60"
            />

            <TextField
              fullWidth
              label="Description"
              {...register("description")}
              error={!!errors.description}
              helperText={errors.description?.message}
              disabled={loading}
              multiline
              rows={3}
              placeholder="Enter description for the posting key"
            />

            <FormControl fullWidth error={!!errors.debitCredit}>
              <InputLabel>Debit/Credit</InputLabel>
              <Select
                {...register("debitCredit")}
                value={watch("debitCredit") || ""}
                onChange={(e) => setValue("debitCredit", e.target.value)}
                disabled={loading}
                label="Debit/Credit"
              >
                {debitCreditOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
              {errors.debitCredit && (
                <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.5 }}>
                  {errors.debitCredit.message}
                </Typography>
              )}
            </FormControl>

            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <input
                type="checkbox"
                {...register("isActive")}
                disabled={loading}
                style={{ transform: "scale(1.2)" }}
              />
              <Typography variant="body2">Active</Typography>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 1 }}>
          <Button onClick={handleClose} disabled={loading}>
            Cancel
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading}
            startIcon={loading && <CircularProgress size={20} />}
          >
            {loading ? "Saving..." : isEditMode ? "Update" : "Create"}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
}
