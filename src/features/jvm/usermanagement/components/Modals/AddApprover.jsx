import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { RxCross2 } from "react-icons/rx";
import swal from "sweetalert";
import { userRequest } from "src/requestMethod";
import { showErrorMessage } from "src/utils/errorUtils";

function AddApprover({ handleClose, open, editData: editData, getData }) {
  const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm();

  useEffect(() => {
    const prefill = async () => {
      if (editData) {
        setValue("username", editData.username || "");
        setValue("email", editData.email || "");
      } else {
        reset();
      }
    };
    prefill();
  }, [editData, setValue, reset]);

  const handleSaveData = async (data) => {
    try {
      const userId = editData?._id || editData?.userRoleId || editData?.userId;
      if (userId) {
        // Update: no password
        const updateData = {
          username: data.username,
          email: data.email,
        };
        await userRequest.put(`/jvm/updateUser/${userId}`, updateData);
        getData();
        swal("Updated!", "Approver data updated successfully!", "success");
      } else {
        // Create: include password
        const createData = {
          username: data.username,
          email: data.email,
          password: "password123",
        };
        await userRequest.post("/jvm/createUser", createData);
        getData();
        swal("Success!", "Approver data saved successfully!", "success");
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
            {editData ? "Edit Approver" : "Add Approver"}
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
        >
          <TextField 
            id="username" 
            label="Name" 
            {...register("username", { required: "Name is required" })} 
            error={!!errors.username}
            helperText={errors.username?.message}
            fullWidth 
          />

          <TextField
            id="email"
            label="Email"
            type="email"
            {...register("email", { 
              required: "Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email format"
              }
            })}
            error={!!errors.email}
            helperText={errors.email?.message}
            fullWidth
          />

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

export default AddApprover;
