import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { Autocomplete, CircularProgress } from "@mui/material";
import { RxCross2 } from "react-icons/rx";
import swal from "sweetalert";
import { showErrorMessage } from "src/utils/errorUtils";
import { userRequest } from "src/requestMethod";

function AddEditMajorPosition({ handleClose, open, editData: positionData, getData, departments = [], departmentsLoading = false }) {
  const { register, handleSubmit, reset, setValue, control } = useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (positionData && departments.length > 0 && !departmentsLoading) {
      setValue("name", positionData.name || "");
      // Handle department - it can be an object with _id and name, or just an _id
      if (positionData.department) {
        if (typeof positionData.department === 'object' && positionData.department._id) {
          // It's already an object, find the matching department
          const foundDepartment = departments.find(
            (dept) => dept._id === positionData.department._id
          );
          setValue("department", foundDepartment || null);
        } else if (typeof positionData.department === 'string') {
          // It's an ID string, find the matching department
          const foundDepartment = departments.find(
            (dept) => dept._id === positionData.department || dept.name === positionData.department
          );
          setValue("department", foundDepartment || null);
        }
      } else {
        setValue("department", null);
      }
    } else if (positionData && departments.length === 0 && !departmentsLoading) {
      setValue("name", positionData.name || "");
      setValue("department", null);
    } else if (!positionData) {
      reset();
    }
  }, [positionData, departments, departmentsLoading, setValue, reset]);

  const handleSaveData = async (data) => {
    setLoading(true);
    try {
      const formattedData = {
        name: data.name,
        department: data.department?._id || data.department || "",
      };
      
      if (positionData?._id) {
        await userRequest.put(`cpx/updateMajorPosition/${positionData._id}`, formattedData);
        swal("Updated!", "Position data updated successfully!", "success");
      } else {
        await userRequest.post("cpx/createMajorPosition", formattedData);
        swal("Success!", "Position data saved successfully!", "success");
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
            {positionData ? "Edit Position" : "Add Position"}
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
            id="name"
            label="Position"
            {...register("name", { required: true })}
            fullWidth
            required
          />
          <Controller
            name="department"
            control={control}
            rules={{ required: "Department is required" }}
            render={({ field: { onChange, value, ...field } }) => (
              <Autocomplete
                {...field}
                options={departments}
                getOptionLabel={(option) => option?.name || ""}
                isOptionEqualToValue={(option, value) => option?._id === value?._id}
                value={value || null}
                onChange={(event, newValue) => {
                  onChange(newValue);
                }}
                loading={departmentsLoading}
                disabled={loading || departmentsLoading}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Department"
                    required
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {departmentsLoading ? <CircularProgress size={20} /> : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
              />
            )}
          />
          <Button
            sx={{ marginTop: "20px", height: "50px" }}
            variant="contained"
            color="primary"
            type="submit"
            disabled={loading || departmentsLoading}
          >
            {loading ? "Saving..." : positionData ? "Update" : "Save"}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}

export default AddEditMajorPosition;

