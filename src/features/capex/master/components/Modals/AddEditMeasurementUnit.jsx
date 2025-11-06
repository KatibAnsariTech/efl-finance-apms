import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { RxCross2 } from "react-icons/rx";
import swal from "sweetalert";
import { userRequest } from "src/requestMethod";
import { showErrorMessage } from "src/utils/errorUtils";

function AddEditMeasurementUnit({ handleClose, open, editData: unitData, getData }) {
  const { register, handleSubmit, reset, setValue, control } = useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (unitData) {
      setValue("unit", unitData.unit || unitData.unitName || unitData.name || "");
      setValue("abbr", unitData.abbr || unitData.abbreviation || "");
    } else {
      reset();
    }
  }, [unitData, setValue, reset]);

  const handleSaveData = async (data) => {
    setLoading(true);
    try {
      const formattedData = {
        unit: data.unit,
        abbr: data.abbr,
      };
      
      if (unitData?._id) {
        await userRequest.put(`cpx/updateMeasurementUnit/${unitData._id}`, formattedData);
        swal("Updated!", "Measurement Unit data updated successfully!", "success");
      } else {
        await userRequest.post("cpx/createMeasurementUnit", formattedData);
        swal("Success!", "Measurement Unit data saved successfully!", "success");
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
            {unitData ? "Edit Measurement Unit" : "Add Measurement Unit"}
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
            id="unit"
            label="Unit Name"
            {...register("unit", { required: true })}
            fullWidth
            required
            helperText="e.g., Kilogram, Meter, Liter"
          />
          <TextField
            id="abbr"
            label="Abbreviation"
            {...register("abbr", { required: true })}
            fullWidth
            required
            helperText="e.g., Nos, Kg, L"
          />
          <Button
            sx={{ marginTop: "20px", height: "50px" }}
            variant="contained"
            color="primary"
            type="submit"
            disabled={loading}
          >
            {loading ? "Saving..." : unitData ? "Update" : "Save"}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}

export default AddEditMeasurementUnit;
