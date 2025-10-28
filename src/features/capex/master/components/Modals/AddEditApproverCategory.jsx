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

function AddEditApproverCategory({ handleClose, open, editData: categoryData, getData }) {
  const { register, handleSubmit, reset, setValue, control } = useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (categoryData) {
      setValue("category", categoryData.category || categoryData.name);
      setValue("management", categoryData.management || categoryData.approver);
      setValue("status", categoryData.status || (categoryData.isActive ? "ACTIVE" : "INACTIVE"));
    } else {
      reset();
    }
  }, [categoryData, setValue, reset]);

  const handleSaveData = async (data) => {
    try {
      const formattedData = {
        category: data.category,
        management: data.management,
        status: data.status,
      };
      
      if (categoryData?._id) {
        // Update existing approver category
        await userRequest.put(`/capex/updateApproverCategory/${categoryData._id}`, formattedData);
        getData();
        swal("Updated!", "Approver Category data updated successfully!", "success");
      } else {
        // Create new approver category
        await userRequest.post("/capex/createApproverCategory", formattedData);
        getData();
        swal("Success!", "Approver Category data saved successfully!", "success");
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
            {categoryData ? "Edit Approver Category" : "Add Approver Category"}
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
            id="category"
            label="Category"
            {...register("category", { required: true })}
            fullWidth
            required
          />
          <TextField
            id="management"
            label="Management"
            {...register("management", { required: true })}
            fullWidth
            required
            helperText="e.g., CEO / MD, CFO, Respective Ex-com, Finance controller"
          />
          <TextField
            id="status"
            label="Status"
            {...register("status", { required: true })}
            select
            fullWidth
            required
            SelectProps={{
              native: true,
            }}
          >
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </TextField>
          <Button
            sx={{ marginTop: "20px", height: "50px" }}
            variant="contained"
            color="primary"
            type="submit"
          >
            {categoryData ? "Update" : "Save"}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}

export default AddEditApproverCategory;
