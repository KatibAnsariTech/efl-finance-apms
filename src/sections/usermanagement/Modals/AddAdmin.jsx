import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { RxCross2 } from "react-icons/rx";
import swal from "sweetalert";
import { userRequest } from "src/requestMethod";
import {
  Chip,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  OutlinedInput,
  Select,
} from "@mui/material";
import { showErrorMessage } from "src/utils/errorUtils";

const permissionOptions = [
  { value: "controlledCheque", label: "Controlled Cheque" },
  { value: "cfMaster", label: "CF Master" },
  { value: "dsobenchmark", label: "DSO Benchmark" },
  { value: "dsostandard", label: "DSO Standard" },
];

function AddAdmin({ handleClose, open, editData, getData }) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors },
  } = useForm();

  const [openPermissionList, setOpenPermissionList] = useState(false);

  useEffect(() => {
    if (editData) {
      setValue("username", editData.username);
      setValue("email", editData.email);
      setValue(
        "mastersheetPermissions",
        Array.isArray(editData.mastersheetPermissions)
          ? editData.mastersheetPermissions
          : []
      );
    } else {
      reset();
    }
  }, [editData, setValue, reset]);

  const handleSaveData = async (data) => {
    try {
      const formattedData = {
        userType: "ADMIN",
        password: "password123",
        ...data,
      };
      if (editData?._id) {
        await userRequest.put(`/admin/updateAdmin?id=${editData?._id}`, data);
        getData();
        swal("Updated!", "User updated successfully!", "success");
      } else {
        await userRequest.post("/admin/createAdmin", formattedData);
        getData();
        swal("Success!", "User saved successfully!", "success");
      }

      reset();
      handleClose();
    } catch (error) {
      console.error("Error saving data:", error);
      showErrorMessage(error, "Error saving data. Please try again later.", swal);
    }
  };

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "50%",
          bgcolor: "background.paper",
          borderRadius: 5,
          p: 4,
        }}
      >
        <Typography
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span style={{ fontSize: "24px", fontWeight: "bolder" }}>
            {editData ? "Edit Super Admin" : "Add Super Admin"}
          </span>
          <RxCross2
            onClick={handleClose}
            style={{
              color: "#B22222",
              fontWeight: "bolder",
              cursor: "pointer",
              height: "24px",
              width: "24px",
            }}
          />
        </Typography>
        <Box
          component="form"
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            mt: 4,
            width: "100%",
          }}
          onSubmit={handleSubmit(handleSaveData)}
          noValidate
        >
          <TextField
            id="username"
            label="Name"
            {...register("username", { required: true })}
            error={!!errors.username}
            helperText={errors.username ? "Name is required" : ""}
            fullWidth
          />
          <TextField
            id="email"
            label="Email"
            {...register("email", { required: true })}
            error={!!errors.email}
            helperText={errors.email ? "Email is required" : ""}
            fullWidth
          />
          <FormControl fullWidth>
            <InputLabel id="permission-label">
              Master Sheet Permissions
            </InputLabel>
            <Controller
              name="mastersheetPermissions"
              control={control}
              defaultValue={[]}
              render={({ field }) => (
                <Select
                  labelId="permission-label"
                  multiple
                  input={<OutlinedInput label="Master Sheet Permissions" />}
                  open={openPermissionList}
                  onOpen={() => setOpenPermissionList(true)}
                  onClose={() => setOpenPermissionList(false)}
                  value={field.value || []}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                    setOpenPermissionList(false);
                  }}
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                      {selected.map((value) => {
                        const optionLabel =
                          permissionOptions.find((o) => o.value === value)?.label ||
                          value;
                        return (
                          <Chip
                            key={value}
                            label={optionLabel}
                            onDelete={() =>
                              field.onChange(
                                field.value.filter((v) => v !== value)
                              )
                            }
                            onMouseDown={(e) => e.stopPropagation()}
                          />
                        );
                      })}
                    </Box>
                  )}
                >
                  {permissionOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      <ListItemText primary={option.label} />
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
          </FormControl>

          <Button
            sx={{ marginTop: "20px", height: "50px" }}
            variant="contained"
            color="primary"
            type="submit"
          >
            {editData ? "Update" : "Save"}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}

export default AddAdmin;
