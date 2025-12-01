import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Autocomplete from "@mui/material/Autocomplete";
import CircularProgress from "@mui/material/CircularProgress";
import { RxCross2 } from "react-icons/rx";
import swal from "sweetalert";
import { userRequest } from "src/requestMethod";
import { showErrorMessage } from "src/utils/errorUtils";

function AddEditPlantCode({ handleClose, open, editData: plantCodeData, getData }) {
  const { register, handleSubmit, reset, setValue, control } = useForm();
  const [loading, setLoading] = useState(false);
  const [businessVerticals, setBusinessVerticals] = useState([]);
  const [locations, setLocations] = useState([]);
  const [businessVerticalsLoading, setBusinessVerticalsLoading] = useState(false);
  const [locationsLoading, setLocationsLoading] = useState(false);

  useEffect(() => {
    const fetchDropdownData = async () => {
      if (open) {
        setBusinessVerticalsLoading(true);
        setLocationsLoading(true);
        try {
          const [bvResponse, locResponse] = await Promise.all([
            userRequest.get("cpx/getBusinessVerticals", {
              params: { page: 1, limit: 100 },
            }),
            userRequest.get("cpx/getLocations", {
              params: { page: 1, limit: 100 },
            }),
          ]);

          const bvData = bvResponse.data.data?.items || bvResponse.data.data || [];
          const locData = locResponse.data.data?.items || locResponse.data.data || [];

          setBusinessVerticals(bvData);
          setLocations(locData);
        } catch (error) {
          console.error("Error fetching dropdown data:", error);
          showErrorMessage(error, "Error fetching dropdown data", swal);
        } finally {
          setBusinessVerticalsLoading(false);
          setLocationsLoading(false);
        }
      }
    };

    fetchDropdownData();
  }, [open]);

  useEffect(() => {
    if (open && !businessVerticalsLoading && !locationsLoading) {
      if (plantCodeData && businessVerticals.length > 0 && locations.length > 0) {
        setValue("plantCode", plantCodeData.plantCode || "");
        
        // Set Business Vertical
        const bvId = plantCodeData.businessVertical?._id || plantCodeData.businessVertical;
        if (bvId) {
          const bv = businessVerticals.find(
            (item) => item._id === bvId
          );
          if (bv) {
            setValue("businessVertical", bv);
          } else {
            setValue("businessVertical", null);
          }
        } else {
          setValue("businessVertical", null);
        }
        
        // Set Location
        const locId = plantCodeData.location?._id || plantCodeData.location;
        if (locId) {
          const loc = locations.find(
            (item) => item._id === locId
          );
          if (loc) {
            setValue("location", loc);
          } else {
            setValue("location", null);
          }
        } else {
          setValue("location", null);
        }
      } else if (!plantCodeData) {
        reset({
          plantCode: "",
          businessVertical: null,
          location: null,
        });
      }
    }
  }, [open, plantCodeData, setValue, reset, businessVerticals, locations, businessVerticalsLoading, locationsLoading]);

  const handleSaveData = async (data) => {
    setLoading(true);
    try {
      const formattedData = {
        plantCode: data.plantCode,
        businessVertical: data.businessVertical?._id || data.businessVertical,
        location: data.location?._id || data.location,
      };
      
      if (plantCodeData?._id) {
        await userRequest.put(`cpx/updatePlantCode/${plantCodeData._id}`, formattedData);
        swal("Updated!", "Plant Code data updated successfully!", "success");
      } else {
        await userRequest.post("cpx/createPlantCode", formattedData);
        swal("Success!", "Plant Code data saved successfully!", "success");
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
            {plantCodeData ? "Edit Plant Code" : "Add Plant Code"}
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
            id="plantCode"
            label="Plant Code"
            {...register("plantCode", { required: true })}
            fullWidth
            required
            InputLabelProps={{ shrink: true }}
          />
          
          <Controller
            name="businessVertical"
            control={control}
            rules={{ required: "Business Vertical is required" }}
            render={({ field, fieldState: { error } }) => (
              <Autocomplete
                {...field}
                value={field.value || null}
                options={businessVerticals}
                getOptionLabel={(option) => option?.name || ""}
                isOptionEqualToValue={(option, value) => {
                  if (!option || !value) return false;
                  return option._id === value._id;
                }}
                loading={businessVerticalsLoading}
                onChange={(event, newValue) => {
                  field.onChange(newValue);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Business Vertical *"
                    error={!!error}
                    helperText={error?.message}
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {businessVerticalsLoading ? (
                            <CircularProgress size={20} />
                          ) : null}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
              />
            )}
          />

          <Controller
            name="location"
            control={control}
            rules={{ required: "Location is required" }}
            render={({ field, fieldState: { error } }) => (
              <Autocomplete
                {...field}
                value={field.value || null}
                options={locations}
                getOptionLabel={(option) => {
                  if (!option) return "";
                  const parts = [
                    option.location,
                    option.deliveryAddress,
                    option.postalCode,
                    option.state
                  ].filter(Boolean);
                  return parts.join(", ") || "";
                }}
                isOptionEqualToValue={(option, value) => {
                  if (!option || !value) return false;
                  return option._id === value._id;
                }}
                loading={locationsLoading}
                onChange={(event, newValue) => {
                  field.onChange(newValue);
                }}
                renderOption={(props, option) => {
                  const parts = [
                    option.location,
                    option.deliveryAddress,
                    option.postalCode,
                    option.state
                  ].filter(Boolean);
                  return (
                    <Box component="li" {...props}>
                      <Typography variant="body2">
                        {parts.join(", ") || "-"}
                      </Typography>
                    </Box>
                  );
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Location *"
                    error={!!error}
                    helperText={error?.message}
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {locationsLoading ? (
                            <CircularProgress size={20} />
                          ) : null}
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
            disabled={loading}
          >
            {loading ? "Saving..." : plantCodeData ? "Update" : "Save"}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}

export default AddEditPlantCode;


