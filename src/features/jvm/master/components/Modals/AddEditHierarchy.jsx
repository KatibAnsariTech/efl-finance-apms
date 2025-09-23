import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  TextField,
  Button,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Autocomplete,
} from "@mui/material";
import { RxCross2 } from "react-icons/rx";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { userRequest } from "src/requestMethod";
import swal from "sweetalert";
import { showErrorMessage } from "src/utils/errorUtils";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  maxWidth: "600px",
  maxHeight: "90vh",
  bgcolor: "background.paper",
  borderRadius: 2,
  p: 3,
  overflow: "auto",
};

const schema = yup.object().shape({
  requester: yup.string().required("Requester is required"),
  approver1: yup.string().required("Approver 1 is required"),
  approver2: yup.string().required("Approver 2 is required"),
});

export default function AddEditHierarchy({
  handleClose,
  open,
  getData,
  editData,
}) {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const isEditMode = !!editData;

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      requester: "",
      approver1: "",
      approver2: "",
    },
  });

  useEffect(() => {
    if (open) {
      fetchUsers();
      if (isEditMode) {
        reset({
          requester: editData.requester || "",
          approver1: editData.approver1 || "",
          approver2: editData.approver2 || "",
        });
      } else {
        reset({
          requester: "",
          approver1: "",
          approver2: "",
        });
      }
    }
  }, [open, editData, isEditMode, reset]);

  const fetchUsers = async () => {
    try {
      const response = await userRequest.get("/admin/getAllUsers");
      if (response.data.success) {
        setUsers(response.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      showErrorMessage(error, "Error fetching users", swal);
    }
  };

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const payload = {
        requester: data.requester,
        approver1: data.approver1,
        approver2: data.approver2,
      };

      if (isEditMode) {
        await userRequest.put(`/jvm/updateMaster/${editData.id}`, payload);
        swal("Success!", "Hierarchy updated successfully!", "success");
      } else {
        await userRequest.post("/jvm/createMaster", {
          key: "Hierarchy",
          ...payload,
        });
        swal("Success!", "Hierarchy created successfully!", "success");
      }

      getData();
      handleClose();
    } catch (error) {
      console.error("Error saving hierarchy:", error);
      showErrorMessage(
        error,
        `Failed to ${isEditMode ? "update" : "create"} hierarchy. Please try again.`,
        swal
      );
    } finally {
      setLoading(false);
    }
  };

  const userOptions = users.map((user) => ({
    value: user.username || user.name,
    label: user.username || user.name,
  }));

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="hierarchy-modal-title"
    >
      <Box sx={style}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography id="hierarchy-modal-title" variant="h6" component="h2">
            {isEditMode ? "Edit Hierarchy" : "Add Hierarchy"}
          </Typography>
          <Button
            onClick={handleClose}
            sx={{ minWidth: "auto", p: 1 }}
            disabled={loading}
          >
            <RxCross2 size={20} />
          </Button>
        </Box>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Controller
                name="requester"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    {...field}
                    options={userOptions}
                    getOptionLabel={(option) => option.label || option}
                    value={
                      userOptions.find(
                        (option) => option.value === field.value
                      ) || null
                    }
                    onChange={(_, newValue) => {
                      field.onChange(newValue?.value || "");
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Requester"
                        error={!!errors.requester}
                        helperText={errors.requester?.message}
                        fullWidth
                      />
                    )}
                    disabled={loading}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="approver1"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    {...field}
                    options={userOptions}
                    getOptionLabel={(option) => option.label || option}
                    value={
                      userOptions.find(
                        (option) => option.value === field.value
                      ) || null
                    }
                    onChange={(_, newValue) => {
                      field.onChange(newValue?.value || "");
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Approver 1"
                        error={!!errors.approver1}
                        helperText={errors.approver1?.message}
                        fullWidth
                      />
                    )}
                    disabled={loading}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="approver2"
                control={control}
                render={({ field }) => (
                  <Autocomplete
                    {...field}
                    options={userOptions}
                    getOptionLabel={(option) => option.label || option}
                    value={
                      userOptions.find(
                        (option) => option.value === field.value
                      ) || null
                    }
                    onChange={(_, newValue) => {
                      field.onChange(newValue?.value || "");
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Approver 2"
                        error={!!errors.approver2}
                        helperText={errors.approver2?.message}
                        fullWidth
                      />
                    )}
                    disabled={loading}
                  />
                )}
              />
            </Grid>
          </Grid>

          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 2,
              mt: 4,
            }}
          >
            <Button
              variant="outlined"
              onClick={handleClose}
              disabled={loading}
              sx={{ minWidth: 100 }}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{ minWidth: 100 }}
            >
              {loading ? (
                <CircularProgress size={20} color="inherit" />
              ) : (
                isEditMode ? "Update" : "Create"
              )}
            </Button>
          </Box>
        </form>
      </Box>
    </Modal>
  );
}
