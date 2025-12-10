import * as React from "react";
import { useForm, Controller } from "react-hook-form";
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
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  OutlinedInput,
  ListItemText,
  Chip,
} from "@mui/material";
import FormHelperText from "@mui/material/FormHelperText";

function AddUserManagementAccess({ handleClose, open, editData, getData }) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors },
  } = useForm();

  const [saveLoading, setSaveLoading] = useState(false);
  const defaultTabs = ["Requester", "Approver"];
  const [tabOptions, setTabOptions] = useState(defaultTabs);

 useEffect(() => {
  if (editData) {
    console.log("editData",editData)
    // If editData contains tabs → use them, else use default
    const tabsToShow = Array.isArray(editData.tabs) && editData.tabs.length > 0
      ? editData.tabs
      : defaultTabs;
    console.log("tabsToShow",tabsToShow)
    // setTabOptions(tabsToShow);   // <-- update dropdown items
    setValue("subTabs", editData.tabs || []); // selected tabs
    setValue("email", editData.email);

  } else {
    reset();
    setSelectedUser(null);
    setTabOptions(defaultTabs);  // reset back to static tabs
  }
}, [editData, setValue, reset, open]);

  const handleSaveData = async (data) => {
  try {
    setSaveLoading(true);

    const payload = {
      email: data.email,
      place: data.place || "usermanagement",   // if you need place static or from a field
      tabs: data.subTabs || [],  // subTabs from multi select
    };

    if (editData) {
      // 👉 Update Access API
      await userRequest.put(`/imt/updateAccessPoint?id=${editData?._id}`, payload);
      swal("Updated!", "Access updated successfully!", "success");
    } else {
      // 👉 Create Access API
      await userRequest.post("/imt/createAccessPoint", payload);
      swal("Success!", "Access created successfully!", "success");
    }

    getData();
    reset();
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
            {editData ? "Edit Usermanagement Access" : "Add Usermanagement Access"}
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

          {/* 🔥 MULTI-SELECT WITH CAPSULE CHIPS */}
          <FormControl fullWidth error={!!errors.subTabs}>
            <InputLabel id="sub-tab-label">Select Tabs</InputLabel>

            <Controller
              name="subTabs"
              control={control}
              defaultValue={[]}
              rules={{ required: "Select tab is required" }}
              render={({ field }) => (
                <Select
                  {...field}
                  labelId="sub-tab-label"
                  label="Select Tabs"
                  multiple
                  disabled={false}
                  input={<OutlinedInput label="Select Tabs" />}
                  value={field.value || []}
                  onChange={(e) => field.onChange(e.target.value)}
                  renderValue={(selected) => (
                    <Box
                      sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 1,
                      }}
                    >
                      {selected.map((value) => (
                        <Chip
                          key={value}
                          label={value}
                          onDelete={() =>
                            field.onChange(
                              field.value.filter((item) => item !== value)
                            )
                          }
                          deleteIcon={<RxCross2 />}
                          sx={{
                            borderRadius: "20px",
                            paddingX: "4px",
                            backgroundColor: "#e8e8e8",
                            fontWeight: "bold",
                          }}
                        />
                      ))}
                    </Box>
                  )}
                >
                  {tabOptions.map((name) => (
                    <MenuItem key={name} value={name}>
                      <ListItemText primary={name} />
                    </MenuItem>
                  ))}
                </Select>
              )}
            />

            <FormHelperText>{errors.subTabs?.message}</FormHelperText>
          </FormControl>

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
            {saveLoading ? "Processing..." : editData ? "Update" : "Save"}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}

export default AddUserManagementAccess;

