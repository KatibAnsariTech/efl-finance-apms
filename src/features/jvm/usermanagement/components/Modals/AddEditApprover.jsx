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
} from "@mui/material";
import { showErrorMessage } from "src/utils/errorUtils";

function AddEditApprover({ handleClose, open, editData: editData, getData }) {
  const { register, handleSubmit, reset, setValue, control } = useForm();
  const [regionOptions, setRegionOptions] = useState([]);
  const [channelOptions, setChannelOptions] = useState([]);

  useEffect(() => {
    async function fetchRegion() {
      try {
        const res = await userRequest.get("/admin/getMasters?key=Region");
        setRegionOptions(res?.data?.data?.masters || []);
      } catch (err) {
        setRegionOptions([]);
      }
    }
    fetchRegion();
  }, []);
  useEffect(() => {
    async function fetchCategory() {
      try {
        const res = await userRequest.get("/admin/getMasters?key=Channel");
        setChannelOptions(res?.data?.data?.masters || []);
      } catch (err) {
        setChannelOptions([]);
      }
    }
    fetchCategory();
  }, []);

  useEffect(() => {
    if (editData) {
      setValue("value", editData.value);
      const otherIds = (editData.other || []).map((item) =>
        typeof item === "object" ? item._id : item
      );
      setValue("other", otherIds);
      setValue("category", editData.category._id || "");
    } else {
      reset();
    }
  }, [editData, setValue, reset]);

  const handleSaveData = async (data) => {
    try {
      const formattedData = {
        key: "SalesOffice",
        value: data.value,
        other: data.other || [],
        category: data.category,
      };
      if (editData?._id) {
        await userRequest.put(
          `/admin/updateMaster?id=${editData._id}`,
          formattedData
        );
        getData();
        swal("Updated!", "Sales Office data updated successfully!", "success");
      } else {
        await userRequest.post("/admin/createMasters", formattedData);
        getData();
        swal("Success!", "Sales Office data saved successfully!", "success");
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
            {editData ? "Edit Sales Office" : "Add Sales Office"}
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
              name="other"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <Select
                  labelId="region-label"
                  value={field.value}
                  onChange={field.onChange}
                  label="Region"
                >
                  {regionOptions.map((option) => (
                    <MenuItem key={option._id} value={option._id}>
                      {option.value}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
          </FormControl>

          <TextField
            id="value"
            label="Name"
            {...register("value")}
            fullWidth
          />

          <TextField
            id="value"
            label="Email"
            {...register("value")}
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

export default AddEditApprover;
