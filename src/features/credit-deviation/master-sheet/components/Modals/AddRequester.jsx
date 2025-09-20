import { useForm, Controller } from "react-hook-form";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { RxCross2 } from "react-icons/rx";
import swal from "sweetalert";
import { userRequest } from "src/requestMethod";
import {
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  OutlinedInput,
  ListItemText,
  Chip,
} from "@mui/material";
import { useEffect, useState } from "react";

function AddRequester({ handleClose, open, editData, getData }) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors },
  } = useForm();

  const [requestTypeOptions, setRequestTypeOptions] = useState([]);
  const [regionOptions, setRegionOptions] = useState([]);
  const [openRegionSelect, setOpenRegionSelect] = useState(false);

  // Fetch options when modal opens
  useEffect(() => {
    if (open) {
      const fetchOptions = async () => {
        try {
          const [requestTypeRes, regionRes] = await Promise.all([
            userRequest.get("/admin/getMasters?key=RequestType"),
            userRequest.get("/admin/getMasters?key=Region"),
          ]);

          setRequestTypeOptions(
            requestTypeRes?.data?.data?.masters?.map((item) => ({
              value: item._id,
              label: item.label || item.value || item._id,
            })) || []
          );

          setRegionOptions(
            regionRes?.data?.data?.masters?.map((item) => ({
              value: item._id,
              label: item.label || item.value || item._id,
            })) || []
          );
        } catch (err) {
          setRequestTypeOptions([]);
          setRegionOptions([]);
        }
      };

      fetchOptions();
    }
  }, [open]);

  // Set form values after options are available
  useEffect(() => {
    if (editData && requestTypeOptions.length && regionOptions.length) {
      setValue("username", editData.username || "");
      setValue("email", editData.email || "");
      setValue(
        "region",
        (editData.region || []).map((r) => r._id)
      );
      setValue(
        "requestType",
        (editData.requestType || []).map((r) => r._id)
      );
    } else if (!editData) {
      reset();
    }
  }, [editData, requestTypeOptions, regionOptions, setValue, reset]);

  const handleSaveData = async (data) => {
    try {
      const formattedData = {
        userType: "REQUESTER",
        password: "password123",
        ...data,
      };

      if (editData?._id) {
        await userRequest.put(`/admin/updateAdmin?id=${editData._id}`, data);
        getData();
        swal("Updated!", "Requester data updated successfully!", "success");
      } else {
        await userRequest.post("/admin/createAdmin", formattedData);
        // console.log("Saving new requester data:", formattedData);
        getData();
        swal("Success!", "Requester data saved successfully!", "success");
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
            {editData ? "Edit Requester" : "Add Requester"}
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
          sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 4 }}
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

          {/* Request Type */}
          <FormControl fullWidth>
            <InputLabel id="request-type-label">Request Type</InputLabel>
            <Controller
              name="requestType"
              control={control}
              defaultValue={[]}
              render={({ field }) => (
                <Select
                  labelId="request-type-label"
                  multiple
                  label="Request Type"
                  input={<OutlinedInput label="Request Type" />}
                  value={field.value || []}
                  onChange={(e) => field.onChange(e.target.value)}
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                      {selected.map((value) => {
                        const label =
                          requestTypeOptions.find((o) => o.value === value)
                            ?.label || value;
                        return (
                          <Chip
                            key={value}
                            label={label}
                            onDelete={() => {
                              field.onChange(
                                field.value.filter((v) => v !== value)
                              );
                            }}
                            onMouseDown={(e) => e.stopPropagation()}
                          />
                        );
                      })}
                    </Box>
                  )}
                >
                  {requestTypeOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      <ListItemText primary={option.label} />
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
          </FormControl>

          {/* Region */}
          <FormControl fullWidth>
            <InputLabel id="region-label">Region</InputLabel>
            <Controller
              name="region"
              control={control}
              defaultValue={[]}
              render={({ field }) => (
                <Select
                  labelId="region-label"
                  multiple
                  label="Region"
                  input={<OutlinedInput label="Region" />}
                  open={openRegionSelect}
                  onOpen={() => setOpenRegionSelect(true)}
                  onClose={() => setOpenRegionSelect(false)}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                    setOpenRegionSelect(false);
                  }}
                  value={field.value || []}
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                      {selected.map((value) => {
                        const label =
                          regionOptions.find((o) => o.value === value)?.label ||
                          value;
                        return (
                          <Chip
                            key={value}
                            label={label}
                            onDelete={() => {
                              field.onChange(
                                field.value.filter((v) => v !== value)
                              );
                            }}
                            onMouseDown={(e) => e.stopPropagation()}
                          />
                        );
                      })}
                    </Box>
                  )}
                >
                  {regionOptions.map((option) => (
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

export default AddRequester;
