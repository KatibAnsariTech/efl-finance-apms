import React, { useState, useEffect } from "react";
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

function AddEditLocation({ handleClose, open, editData: locationData, getData }) {
  const { register, handleSubmit, reset, setValue } = useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (locationData) {
      setValue("location", locationData.location || "");
      setValue("deliveryAddress", locationData.deliveryAddress || "");
      setValue("postalCode", locationData.postalCode || "");
      setValue("state", locationData.state || "");
      setValue("country", locationData.country || "");
    } else {
      reset({
        location: "",
        deliveryAddress: "",
        postalCode: "",
        state: "",
        country: "",
      });
    }
  }, [locationData, setValue, reset]);

  const handleSaveData = async (data) => {
    setLoading(true);
    try {
      const formattedData = {
        location: data.location,
        deliveryAddress: data.deliveryAddress,
        postalCode: data.postalCode,
        state: data.state,
        country: data.country || "",
      };
      
      if (locationData?._id) {
        await userRequest.put(`cpx/updateLocation/${locationData._id}`, formattedData);
        swal("Updated!", "Location data updated successfully!", "success");
      } else {
        await userRequest.post("cpx/createLocation", formattedData);
        swal("Success!", "Location data saved successfully!", "success");
      }

      reset();
      handleClose();
      getData();
    } catch (error) {
      console.error("Error saving data:", error);
      showErrorMessage(error, "Error saving data. Please try again later.", swal);
    } finally {
      setLoading(false);
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
            {locationData ? "Edit Location" : "Add Location"}
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
            id="location"
            label="Location"
            {...register("location", { required: true })}
            fullWidth
            required
          />
          <TextField
            id="deliveryAddress"
            label="Delivery Address"
            {...register("deliveryAddress", { required: true })}
            fullWidth
            required
          />
          <TextField
            id="postalCode"
            label="Postal Code"
            {...register("postalCode", { required: true })}
            fullWidth
            required
          />
          <TextField
            id="state"
            label="State"
            {...register("state", { required: true })}
            fullWidth
            required
          />
          <TextField
            id="country"
            label="Country"
            {...register("country", { required: true })}
            fullWidth
            required
          />
          <Button
            sx={{ marginTop: "20px", height: "50px" }}
            variant="contained"
            color="primary"
            type="submit"
            disabled={loading}
          >
            {loading ? "Saving..." : locationData ? "Update" : "Save"}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}

export default AddEditLocation;






