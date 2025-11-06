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

function AddEditApproverCategory({ handleClose, open, editData: categoryData, getData }) {
  const { register, handleSubmit, reset, setValue } = useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (categoryData) {
      setValue("category", categoryData.category || categoryData.name || "");
      setValue("management", categoryData.management || categoryData.approver || "");
    } else {
      reset();
    }
  }, [categoryData, setValue, reset]);

  const handleSaveData = async (data) => {
    setLoading(true);
    try {
      const formattedData = {
        category: data.category,
        management: data.management,
      };
      
      if (categoryData?._id) {
        await userRequest.put(`cpx/updateApproverCategory/${categoryData._id}`, formattedData);
        swal("Updated!", "Approver Category data updated successfully!", "success");
      } else {
        await userRequest.post("cpx/createApproverCategory", formattedData);
        swal("Success!", "Approver Category data saved successfully!", "success");
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
            helperText="e.g., Admin, CEO / MD, CFO"
          />
          <Button
            sx={{ marginTop: "20px", height: "50px" }}
            variant="contained"
            color="primary"
            type="submit"
            disabled={loading}
          >
            {loading ? "Saving..." : categoryData ? "Update" : "Save"}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}

export default AddEditApproverCategory;
