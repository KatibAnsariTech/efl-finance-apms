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
  Autocomplete,
  Chip,
  FormHelperText,
} from "@mui/material";
import { useEffect, useState } from "react";
import { showErrorMessage } from "src/utils/errorUtils";

function AddRequester({ handleClose, open, editData, getData }) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors },
  } = useForm();

  const [companyOptions, setCompanyOptions] = useState([]);

  useEffect(() => {
    if (open) {
      const fetchOptions = async () => {
        try {
          const companyRes = await userRequest.get("/jvm/getMasters?key=Company&page=1&limit=1000");
          setCompanyOptions(
            companyRes?.data?.data?.masters?.map((item) => ({
              value: item._id,
              label: item.value || item.label || item._id,
            })) || []
          );
        } catch (err) {
          setCompanyOptions([]);
        }
      };
      fetchOptions();
    }
  }, [open]);

  // Pre-fill username and email immediately
  useEffect(() => {
    if (editData) {
      setValue("username", editData.username || "");
      setValue("email", editData.email || "");
    } else {
      reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editData, setValue, reset]);

  // Pre-fill company when options are loaded
  useEffect(() => {
    if (editData && companyOptions.length > 0) {
      // Set company if available - handle both object and array formats
      if (Array.isArray(editData.company) && editData.company.length > 0) {
        // If company is an array, map to company option objects
        const selectedCompanies = editData.company
          .map((comp) => {
            const companyId = typeof comp === 'string' ? comp : comp?._id;
            return companyOptions.find((opt) => opt.value === companyId);
          })
          .filter(Boolean);
        setValue("company", selectedCompanies);
      } else if (editData.company?._id) {
        // Single company object
        const companyOption = companyOptions.find(
          (opt) => opt.value === editData.company._id
        );
        setValue("company", companyOption ? [companyOption] : []);
      } else if (editData.companyId) {
        // Single company ID
        const companyOption = companyOptions.find(
          (opt) => opt.value === editData.companyId
        );
        setValue("company", companyOption ? [companyOption] : []);
      } else {
        setValue("company", []);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editData, companyOptions, setValue]);

  const handleSaveData = async (data) => {
    try {
      // Extract company IDs from selected company options
      const companyIds = Array.isArray(data.company)
        ? data.company.map((comp) => (typeof comp === 'object' ? comp.value : comp))
        : [];

      const userId = editData?._id || editData?.userRoleId || editData?.userId;
      if (userId) {
        // Update: no password, company as array of IDs
        const updateData = {
          username: data.username,
          email: data.email,
          company: companyIds,
        };
        await userRequest.put(`/jvm/updateUser/${userId}`, updateData);
        getData();
        swal("Updated!", "Requester data updated successfully!", "success");
      } else {
        // Create: include password, company as array of IDs
        const createData = {
          username: data.username,
          email: data.email,
          password: "password123",
          company: companyIds,
        };
        await userRequest.post("/jvm/createUser", createData);
        getData();
        swal("Success!", "Requester data saved successfully!", "success");
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

          {/* Company - Multiple Autocomplete */}
          <Controller
            name="company"
            control={control}
            defaultValue={[]}
            rules={{
              validate: (value) => {
                if (!value || (Array.isArray(value) && value.length === 0)) {
                  return "At least one company is required";
                }
                return true;
              },
            }}
            render={({ field: { onChange, value } }) => (
              <Autocomplete
                multiple
                options={companyOptions}
                getOptionLabel={(option) => option.label || option.value || ""}
                value={value || []}
                onChange={(event, newValue) => {
                  onChange(newValue);
                }}
                isOptionEqualToValue={(option, val) => option.value === val.value}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Company"
                    error={!!errors.company}
                  />
                )}
                renderTags={(tagValue, getTagProps) =>
                  tagValue.map((option, index) => (
                    <Chip
                      label={option.label || option.value}
                      {...getTagProps({ index })}
                      key={option.value}
                    />
                  ))
                }
              />
            )}
          />
          {errors.company && (
            <FormHelperText error sx={{ mt: -1, ml: 1.75 }}>
              {errors.company.message}
            </FormHelperText>
          )}

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
