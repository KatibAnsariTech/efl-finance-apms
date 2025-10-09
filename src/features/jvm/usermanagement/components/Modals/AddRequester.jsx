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
import { showErrorMessage } from "src/utils/errorUtils";

function AddRequester({ handleClose, open, editData, getData }) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    watch,
    formState: { errors },
  } = useForm();

  const [requestTypeOptions, setRequestTypeOptions] = useState([]);
  const [regionOptions, setRegionOptions] = useState([]);
  const [salesOfficeOptions, setSalesOfficeOptions] = useState([]);
  const [salesGroupOptions, setSalesGroupOptions] = useState([]);

  const [openRequestTypeSelect, setOpenRequestTypeSelect] = useState(false);
  const [openRegionSelect, setOpenRegionSelect] = useState(false);
  const [openSalesOfficeSelect, setOpenSalesOfficeSelect] = useState(false);
  const [openSalesGroupSelect, setOpenSalesGroupSelect] = useState(false);

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


  const selectedRegions = watch("region") || [];
  const selectedSalesOffices = watch("salesOffice") || [];

  // Fetch Sales Offices based on selected Region
  useEffect(() => {
    if (selectedRegions.length) {
      const fetchSalesOffices = async () => {
        try {
          const res = await userRequest.get(
            `/admin/getMastersByArray?keys=SalesOffice&others=${selectedRegions.join(
              ","
            )}`
          );
          setSalesOfficeOptions(
            res?.data?.data?.masters?.map((item) => ({
              value: item._id,
              label: item.label || item.value || item._id,
            })) || []
          );
        } catch (err) {
          setSalesOfficeOptions([]);
        }
      };
      fetchSalesOffices();
    } else {
      setSalesOfficeOptions([]);
    }
    // Clear dependent selections
    setValue("salesOffice", []);
    setValue("salesGroup", []);
  }, [selectedRegions, setValue]);

  // Fetch Sales Groups based on selected Sales Office
  useEffect(() => {
    if (selectedSalesOffices.length) {
      const fetchSalesGroups = async () => {
        try {
          const res = await userRequest.get(
            `/admin/getMastersByArray?keys=SalesGroup&others=${selectedSalesOffices.join(
              ","
            )}`
          );
          setSalesGroupOptions(
            res?.data?.data?.masters?.map((item) => ({
              value: item._id,
              label: item.label || item.value || item._id,
            })) || []
          );
        } catch (err) {
          setSalesGroupOptions([]);
        }
      };
      fetchSalesGroups();
    } else {
      setSalesGroupOptions([]);
    }
    // Clear dependent selection
    setValue("salesGroup", []);
  }, [selectedSalesOffices, setValue]);

  // Pre-fill for edit, and ensure dependent options are loaded before setting values
  useEffect(() => {
    const prefill = async () => {
      if (editData) {
        setValue("username", editData.username || "");
        setValue("email", editData.email || "");
        setValue("requesterNo", editData.requesterNo || "");
        const regionIds = (editData.region || []).map((r) => r._id);
        setValue("region", regionIds);
        setValue("requestType", (editData.requestType || []).map((r) => r._id));

        // Fetch and set sales offices for regions
        if (regionIds.length) {
          try {
            const res = await userRequest.get(
              `/admin/getMastersByArray?keys=SalesOffice&others=${regionIds.join(",")}`
            );
            setSalesOfficeOptions(
              res?.data?.data?.masters?.map((item) => ({
                value: item._id,
                label: item.label || item.value || item._id,
              })) || []
            );
          } catch {
            setSalesOfficeOptions([]);
          }
        }
        const salesOfficeIds = (editData.salesOffice || []).map((r) => r);
        setValue("salesOffice", salesOfficeIds);

        // Fetch and set sales groups for sales offices
        if (salesOfficeIds.length) {
          try {
            const res = await userRequest.get(
              `/admin/getMastersByArray?keys=SalesGroup&others=${salesOfficeIds.join(",")}`
            );
            setSalesGroupOptions(
              res?.data?.data?.masters?.map((item) => ({
                value: item._id,
                label: item.label || item.value || item._id,
              })) || []
            );
          } catch {
            setSalesGroupOptions([]);
          }
        }
        setValue("salesGroup", (editData.salesGroup || []).map((r) => r));
      } else {
        reset();
      }
    };
    prefill();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [editData, setValue, reset]);

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
            height: "65dvh",
            overflowY: "auto",
            px: 2,
            p: 1,
          }}
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
          <TextField
            id="requesterNo"
            label="Requester No"
            {...register("requesterNo", { required: true })}
            error={!!errors.requesterNo}
            helperText={
              errors.requesterNo ? "Requestor number is required" : ""
            }
            fullWidth
          />

          {/* Request Type */}
          <FormControl fullWidth>
            <InputLabel id="requestType-label">Request Type</InputLabel>
            <Controller
              name="requestType"
              control={control}
              defaultValue={[]}
              render={({ field }) => (
                <Select
                  labelId="requestType-label"
                  multiple
                  input={<OutlinedInput label="Request Type" />}
                  open={openRequestTypeSelect}
                  onOpen={() => setOpenRequestTypeSelect(true)}
                  onClose={() => setOpenRequestTypeSelect(false)}
                  value={field.value || []}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                    setOpenRequestTypeSelect(false);
                  }}
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                      {selected.map((value) => {
                        const optionLabel =
                          requestTypeOptions.find((o) => o.value === value)
                            ?.label || value;
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

          {/* Sales Office */}
          <FormControl fullWidth>
            <InputLabel id="salesOffice-label">Sales Office</InputLabel>
            <Controller
              name="salesOffice"
              control={control}
              defaultValue={[]}
              render={({ field }) => (
                <Select
                  labelId="salesOffice-label"
                  multiple
                  input={<OutlinedInput label="Sales Office" />}
                  open={openSalesOfficeSelect}
                  onOpen={() => setOpenSalesOfficeSelect(true)}
                  onClose={() => setOpenSalesOfficeSelect(false)}
                  value={field.value || []}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                    setOpenSalesOfficeSelect(false);
                  }}
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                      {selected.map((value) => {
                        const optionLabel =
                          salesOfficeOptions.find((o) => o.value === value)
                            ?.label || value;
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
                  {salesOfficeOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      <ListItemText primary={option.label} />
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
          </FormControl>

          {/* Sales Group */}
          <FormControl fullWidth>
            <InputLabel id="salesGroup-label">Sales Group</InputLabel>
            <Controller
              name="salesGroup"
              control={control}
              defaultValue={[]}
              render={({ field }) => (
                <Select
                  labelId="salesGroup-label"
                  multiple
                  input={<OutlinedInput label="Sales Group" />}
                  open={openSalesGroupSelect}
                  onOpen={() => setOpenSalesGroupSelect(true)}
                  onClose={() => setOpenSalesGroupSelect(false)}
                  value={field.value || []}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                    setOpenSalesGroupSelect(false);
                  }}
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                      {selected.map((value) => {
                        const optionLabel =
                          salesGroupOptions.find((o) => o.value === value)
                            ?.label || value;
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
                  {salesGroupOptions.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      <ListItemText primary={option.label} />
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
          </FormControl>

          <Button
            sx={{ marginTop: "20px", height: "80px", py: 1.5 }}
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
