import * as React from "react";
import { useForm } from "react-hook-form";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { RxCross2 } from "react-icons/rx";
import swal from "sweetalert";
import { userRequest } from "src/requestMethod";
import { showErrorMessage } from "src/utils/errorUtils";
import { useState, useEffect } from "react";

function AddOutPutDocumentAccess({ handleClose, open, editData, getData }) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm();

  const [selectedUser, setSelectedUser] = useState(null);
  const [saveLoading, setSaveLoading] = useState(false);

  // ------------------------------
  // Load data when modal opens
  // ------------------------------
  useEffect(() => {
    if (editData) {
      const currentUser = {
        email: editData.email,
      };
      setSelectedUser(currentUser);
      setValue("email", editData.email);
    } else {
      reset();
      setSelectedUser(null);
    }
  }, [editData, open, setValue, reset]);

  // ------------------------------
  // Submit Handler
  // ------------------------------
  const handleSaveData = async (data) => {
    try {
      setSaveLoading(true);

      const payload = {
        email: data.email,
        place: "output_document",
        // userType: "SUPER_ADMIN",
        tabs:[]
      };

      if (editData?.userRoleId) {
        // Update access point
        await userRequest.put("/imt/updateAccessPoint", payload);
        swal("Updated!", "Access point updated successfully!", "success");
      } else {
        // Create new access
        await userRequest.post("/imt/createAccessPoint", payload);
        swal("Success!", "Access point assigned successfully!", "success");
      }

      getData();
      reset();
      setSelectedUser(null);
      handleClose();
    } catch (error) {
      console.error("Error saving data:", error);
      showErrorMessage(error, "Error saving data. Please try again later.", swal);
    } finally {
      setSaveLoading(false);
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
            {editData ? "Edit Report Access" : "Add Report Access"}
          </span>

          <RxCross2
            onClick={handleClose}
            style={{
              color: "#B22222",
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
          {/* EMAIL FIELD */}
          <TextField
            label="Enter Email Address"
            fullWidth
            required
            disabled={false}
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Enter a valid email address",
              },
            })}
            error={!!errors.email}
            helperText={errors.email?.message}
          />

          {/* SUBMIT BUTTON */}
          <Button
            sx={{ marginTop: "20px", height: "50px" }}
            variant="contained"
            color="primary"
            type="submit"
            disabled={saveLoading}
            startIcon={
              saveLoading ? <CircularProgress size={20} color="inherit" /> : null
            }
          >
            {saveLoading
              ? "Processing..."
              : editData
              ? "Update"
              : "Save"}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}

export default AddOutPutDocumentAccess;