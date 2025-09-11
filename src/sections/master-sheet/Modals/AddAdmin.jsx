import * as React from "react";
import { useForm } from "react-hook-form";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { RxCross2 } from "react-icons/rx";
import swal from "sweetalert";
import { userRequest } from "src/requestMethod";

function AddSuperAmin({ handleClose, open, editData, getData }) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  React.useEffect(() => {
    if (editData) {
      setValue("username", editData.username);
      setValue("email", editData.email);
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
        await userRequest.put(
          `/admin/updateAdmin?id=${editData?._id}`,
          data
        );
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
      swal("Error", "Error saving data. Please try again later.", "error");
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

export default AddSuperAmin;
