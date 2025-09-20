import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { RxCross2 } from "react-icons/rx";
import swal from "sweetalert";
import { userRequest } from "src/requestMethod";
import {
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
  ListItemText,
} from "@mui/material";
import { showErrorMessage } from "src/utils/errorUtils";

function AddApprover({ handleClose, open, editData: editData, getData }) {
  const { register, handleSubmit, reset, setValue, control } = useForm({
    defaultValues: {
      region: [],
    },
  });
  const [regionOptions, setRegionOptions] = useState([]);
  const [openRegionSelect, setOpenRegionSelect] = useState(false);

  useEffect(() => {
    if (open) {
      async function fetchRegion() {
        try {
          const res = await userRequest.get("/admin/getMasters?key=Region");
          setRegionOptions(
            res?.data?.data?.masters?.map((item) => ({
              value: item._id,
              label: item.label || item.value || item._id,
            })) || []
          );
        } catch (err) {
          setRegionOptions([]);
        }
      }
      fetchRegion();
    }
  }, [open]);

  useEffect(() => {
    const prefill = async () => {
      if (editData) {
        setValue("username", editData.username || "");
        setValue("email", editData.email || "");
        const regionIds = Array.isArray(editData.region)
          ? editData.region.map((r) => r._id)
          : [];
        setValue("region", regionIds);
      } else {
        reset();
      }
    };
    prefill();
  }, [editData, setValue, reset]);

  const handleSaveData = async (data) => {
    try {
      const formattedData = {
        userType: "APPROVER",
        password: "password123",
        ...data,
      };

      if (editData?._id) {
        await userRequest.put(`/admin/updateAdmin?id=${editData._id}`, data);
        getData();
        swal("Updated!", "Approver data updated successfully!", "success");
      } else {
        await userRequest.post("/admin/createAdmin", formattedData);
        getData();
        swal("Success!", "Approver data saved successfully!", "success");
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
            {editData ? "Edit Approver" : "Add Approver"}
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
                  input={<OutlinedInput label="Region" />}
                  open={openRegionSelect}
                  onOpen={() => setOpenRegionSelect(true)}
                  onClose={() => setOpenRegionSelect(false)}
                  value={field.value || []}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                    setOpenRegionSelect(false);
                  }}
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                      {selected.map((value) => {
                        const optionLabel =
                          regionOptions.find((o) => o.value === value)?.label ||
                          value;
                        return (
                          <Chip
                            key={value}
                            label={optionLabel}
                            onDelete={() =>
                              field.onChange(
                                field.value.filter((v) => v !== value)
                              )
                            }
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

          <TextField id="username" label="Name" {...register("username")} fullWidth />

          <TextField
            id="email"
            label="Email"
            {...register("email")}
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

export default AddApprover;
