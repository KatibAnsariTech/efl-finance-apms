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
} from "@mui/material";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import swal from "sweetalert";
import { userRequest } from "src/requestMethod";
import { showErrorMessage } from "src/utils/errorUtils";

const documentTypeSchema = yup.object().shape({
  documentType: yup.string().required("Document Type is required"),
  description: yup.string().required("Description is required"),
  isActive: yup.boolean(),
});

export default function AddEditDocumentType({ open, handleClose, getData, editData }) {
  const [loading, setLoading] = useState(false);
  const isEditMode = !!editData;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue,
  } = useForm({
    resolver: yupResolver(documentTypeSchema),
    defaultValues: {
      documentType: "",
      description: "",
      isActive: true,
    },
  });

  useEffect(() => {
    if (editData) {
      setValue("documentType", editData.documentType || "");
      setValue("description", editData.description || "");
      setValue("isActive", editData.isActive !== undefined ? editData.isActive : true);
    } else {
      reset();
    }
  }, [editData, setValue, reset]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const payload = {
        key: "DocumentType",
        value: data.documentType,
        description: data.description,
        isActive: data.isActive,
      };

      if (isEditMode) {
        await userRequest.put(`/admin/updateMaster?id=${editData._id}`, payload);
        await swal({
          title: "Success!",
          text: "Document Type updated successfully!",
          icon: "success",
          button: "OK",
        });
      } else {
        await userRequest.post("/admin/createMasters", payload);
        await swal({
          title: "Success!",
          text: "Document Type created successfully!",
          icon: "success",
          button: "OK",
        });
      }
      
      getData();
      handleClose();
    } catch (error) {
      showErrorMessage(error, `Failed to ${isEditMode ? "update" : "create"} Document Type`, swal);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          {isEditMode ? "Edit Document Type" : "Add Document Type"}
        </Typography>
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3, pt: 1 }}>
            <TextField
              fullWidth
              label="Document Type"
              {...register("documentType")}
              error={!!errors.documentType}
              helperText={errors.documentType?.message}
              disabled={loading}
              placeholder="e.g., DR, CR, AB"
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
              placeholder="Enter description for the document type"
            />

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
