import React, { useState, useEffect } from "react";
import {
  Modal,
  Box,
  Typography,
  Button,
  Grid,
  Tooltip,
  InputAdornment,
  CircularProgress,
  MenuItem,
} from "@mui/material";
import { HelpOutline } from "@mui/icons-material";
import { RxCross2 } from "react-icons/rx";
import { useForm, Controller } from "react-hook-form";
import { CustomTextField, CustomSelect } from "./CustomFields";

export default function CapexItemModal({ open, handleClose, onSave, editItem, index, measurementUnits = [] }) {
  const [loading, setLoading] = useState(false);
  const { control, handleSubmit, reset, watch, setValue, formState: { errors } } = useForm({
    defaultValues: editItem || {
      description: "",
      quantity: "",
      uom: "",
      specification: "",
      costPerUnit: "",
      totalCost: "",
    },
  });

  useEffect(() => {
    if (editItem) {
      reset(editItem);
    } else {
      reset({
        description: "",
        quantity: "",
        uom: "",
        specification: "",
        costPerUnit: "",
        totalCost: "",
      });
    }
  }, [editItem, reset]);


  const quantity = watch("quantity");
  const costPerUnit = watch("costPerUnit");

  useEffect(() => {
    const qty = parseFloat(quantity) || 0;
    const cost = parseFloat(costPerUnit) || 0;
    const total = (qty * cost).toFixed(2);
    setValue("totalCost", total);
  }, [quantity, costPerUnit, setValue]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const itemData = {
        ...data,
        quantity: data.quantity ? parseFloat(data.quantity) : "",
        costPerUnit: data.costPerUnit ? parseFloat(data.costPerUnit) : "",
        totalCost: data.totalCost ? parseFloat(data.totalCost) : 0,
      };
      onSave(itemData, index);
      handleClose();
      reset();
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    handleClose();
    reset();
  };

  return (
    <Modal open={open} onClose={handleCancel}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "90%", md: "60%" },
          maxWidth: "900px",
          bgcolor: "background.paper",
          borderRadius: 5,
          display: "flex",
          flexDirection: "column",
          maxHeight: "90vh",
          overflow: "hidden",
        }}
      >
        <Box sx={{ p: 4, pb: 2, flexShrink: 0 }}>
          <Typography
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span style={{ fontSize: "24px", fontWeight: "bolder" }}>
              {editItem ? "Edit CAPEX Item" : "Add CAPEX Item"}
            </span>
            <RxCross2
              onClick={handleCancel}
              style={{
                color: "#B22222",
                fontWeight: "bolder",
                cursor: "pointer",
                height: "24px",
                width: "24px",
              }}
            />
          </Typography>
        </Box>

        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 0,
              px: 4,
              pt: 2,
              flex: 1,
              overflow: "auto",
            }}
          >
            <Grid container spacing={3}>
            <Grid item xs={12}>
              <Controller
                name="description"
                control={control}
                rules={{ required: "Capex Description / Equipment is required" }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    label="Capex Description / Equipment *"
                    fullWidth
                    multiline
                    rows={2}
                    variant="outlined"
                    error={!!errors.description}
                    helperText={errors.description?.message}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="quantity"
                control={control}
                rules={{ required: "Quantity is required" }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    label="Quantity *"
                    type="number"
                    fullWidth
                    variant="outlined"
                    error={!!errors.quantity}
                    helperText={errors.quantity?.message}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <Tooltip title="Enter the quantity">
                            <HelpOutline sx={{ fontSize: 16, cursor: "help" }} />
                          </Tooltip>
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="uom"
                control={control}
                rules={{ required: "UOM is required" }}
                render={({ field, fieldState: { error } }) => (
                  <CustomSelect
                    {...field}
                    label="UOM *"
                    error={!!error}
                    helperText={error?.message}
                  >
                    <MenuItem value="">
                      <em>Select UOM</em>
                    </MenuItem>
                    {measurementUnits.map((unit) => (
                      <MenuItem key={unit._id} value={unit._id}>
                        {unit.unit} ({unit.abbr})
                      </MenuItem>
                    ))}
                  </CustomSelect>
                )}
              />
            </Grid>

            <Grid item xs={12}>
              <Controller
                name="specification"
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    label="Specification Details"
                    fullWidth
                    multiline
                    rows={2}
                    variant="outlined"
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="costPerUnit"
                control={control}
                rules={{ required: "Cost Per Unit is required" }}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    label="Cost Per Unit *"
                    type="number"
                    fullWidth
                    variant="outlined"
                    error={!!errors.costPerUnit}
                    helperText={errors.costPerUnit?.message}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <Tooltip title="Enter cost per unit">
                            <HelpOutline sx={{ fontSize: 16, cursor: "help" }} />
                          </Tooltip>
                        </InputAdornment>
                      ),
                    }}
                  />
                )}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <Controller
                name="totalCost"
                control={control}
                render={({ field }) => (
                  <CustomTextField
                    {...field}
                    label="Total Cost in INR"
                    fullWidth
                    variant="outlined"
                    disabled
                  />
                )}
              />
            </Grid>
          </Grid>
          </Box>

          <Box sx={{ px: 4, pt: 2.5, pb: 4, flexShrink: 0 }}>
            <Button
              sx={{ width: "100%", height: "50px" }}
              variant="contained"
              color="primary"
              type="submit"
              disabled={loading}
              startIcon={
                loading && <CircularProgress size={20} color="inherit" />
              }
            >
              {loading
                ? editItem
                  ? "Updating..."
                  : "Saving..."
                : editItem
                ? "Update"
                : "Save"}
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
}

