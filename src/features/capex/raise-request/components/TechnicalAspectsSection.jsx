import React, { useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Tooltip,
  Alert,
} from "@mui/material";
import { Add, Delete, Edit } from "@mui/icons-material";
import { Controller } from "react-hook-form";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { CustomTextField } from "./CustomFields";
import CapexItemModal from "./CapexItemModal";

export default function TechnicalAspectsSection({
  control,
  setValue,
  watch,
  errors,
  trigger,
  measurementUnits = [],
  unitsMap = {},
  readOnly = false,
}) {
  const capexItems = watch("capexItems") || [];
  const totalCost = watch("totalCost") || 0;
  const [modalOpen, setModalOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingItem, setEditingItem] = useState(null);

  const calculateTotal = (items) => {
    const total = items.reduce((sum, item) => {
      return sum + (parseFloat(item.totalCost) || 0);
    }, 0);
    setValue("totalCost", total);
  };

  const handleAddClick = () => {
    setEditingIndex(null);
    setEditingItem(null);
    setModalOpen(true);
  };

  const handleEditClick = (index) => {
    setEditingIndex(index);
    setEditingItem(capexItems[index]);
    setModalOpen(true);
  };

  const handleDeleteClick = async (index) => {
    const newItems = capexItems.filter((_, i) => i !== index);
    setValue("capexItems", newItems);
    calculateTotal(newItems);
    // Trigger validation to clear errors if items are valid
    await trigger("capexItems");
  };

  const handleModalSave = async (itemData, index) => {
    const newItems = [...capexItems];
    if (index !== null && index !== undefined) {
      newItems[index] = itemData;
    } else {
      newItems.push(itemData);
    }
    setValue("capexItems", newItems);
    calculateTotal(newItems);
    // Trigger validation to clear errors if items are valid
    await trigger("capexItems");
    setModalOpen(false);
    setEditingIndex(null);
    setEditingItem(null);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    setEditingIndex(null);
    setEditingItem(null);
  };

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 3, fontWeight: "bold" }}>
        Technical Aspects
      </Typography>

      <Box sx={{ mb: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 2,
          }}
        >
          <Typography variant="subtitle1" sx={{ fontWeight: "bold" }}>
            CAPEX Details *
          </Typography>
          {!readOnly && (
            <Button
              variant="contained"
              startIcon={<Add />}
              onClick={handleAddClick}
              size="small"
            >
              ADD
            </Button>
          )}
        </Box>

        {errors.capexItems && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {errors.capexItems.message || "At least one CAPEX item is required"}
          </Alert>
        )}

        {capexItems.length > 0 && errors.capexItems && typeof errors.capexItems === 'object' && !errors.capexItems.message && (
          <Alert severity="error" sx={{ mb: 2 }}>
            Please check all CAPEX items for missing required fields
          </Alert>
        )}

        <TableContainer 
          component={Paper} 
          variant="outlined"
          sx={{
            border: errors.capexItems ? '2px solid #d32f2f' : '1px solid rgba(0, 0, 0, 0.23)',
          }}
        >
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: "grey.100" }}>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    whiteSpace: "nowrap",
                    minWidth: 200,
                  }}
                >
                  Capex Description / Equipment
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    whiteSpace: "nowrap",
                    minWidth: 100,
                  }}
                >
                  Quantity
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    whiteSpace: "nowrap",
                    minWidth: 80,
                  }}
                >
                  UOM
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    whiteSpace: "nowrap",
                    minWidth: 200,
                  }}
                >
                  Specification Details
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    whiteSpace: "nowrap",
                    minWidth: 120,
                  }}
                >
                  Cost Per Unit
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    whiteSpace: "nowrap",
                    minWidth: 140,
                  }}
                >
                  Total Cost in INR
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: "bold",
                    whiteSpace: "nowrap",
                    minWidth: 100,
                  }}
                >
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {capexItems.map((item, index) => {
                const itemErrors = errors.capexItems?.[index];
                const hasItemError = itemErrors && (
                  itemErrors.description || 
                  itemErrors.quantity || 
                  itemErrors.uom ||
                  itemErrors.costPerUnit ||
                  itemErrors.totalCost
                );
                
                return (
                <TableRow 
                  key={index}
                  sx={{
                    backgroundColor: hasItemError ? 'rgba(211, 47, 47, 0.08)' : 'inherit',
                  }}
                >
                  <TableCell>
                    <Tooltip
                      title={item.description || "-"}
                      arrow
                      placement="top"
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          maxWidth: 200,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          cursor: "help",
                          color: itemErrors?.description ? '#d32f2f' : 'inherit',
                        }}
                      >
                        {item.description || "-"}
                      </Typography>
                      {itemErrors?.description && (
                        <Typography variant="caption" color="error" sx={{ display: 'block', mt: 0.5 }}>
                          {itemErrors.description.message}
                        </Typography>
                      )}
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    <Typography 
                      variant="body2"
                      sx={{ color: itemErrors?.quantity ? '#d32f2f' : 'inherit' }}
                    >
                      {item.quantity || "-"}
                    </Typography>
                    {itemErrors?.quantity && (
                      <Typography variant="caption" color="error" sx={{ display: 'block', mt: 0.5 }}>
                        {itemErrors.quantity.message}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Typography 
                      variant="body2"
                      sx={{ color: itemErrors?.uom ? '#d32f2f' : 'inherit' }}
                    >
                      {item.uom && unitsMap[item.uom] ? unitsMap[item.uom].abbr : (item.uom || "-")}
                    </Typography>
                    {itemErrors?.uom && (
                      <Typography variant="caption" color="error" sx={{ display: 'block', mt: 0.5 }}>
                        {itemErrors.uom.message}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Tooltip
                      title={item.specification || "-"}
                      arrow
                      placement="top"
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          maxWidth: 200,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          cursor: "help",
                        }}
                      >
                        {item.specification || "-"}
                      </Typography>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    <Typography 
                      variant="body2"
                      sx={{ color: itemErrors?.costPerUnit ? '#d32f2f' : 'inherit' }}
                    >
                      {item.costPerUnit
                        ? parseFloat(item.costPerUnit).toLocaleString()
                        : "-"}
                    </Typography>
                    {itemErrors?.costPerUnit && (
                      <Typography variant="caption" color="error" sx={{ display: 'block', mt: 0.5 }}>
                        {itemErrors.costPerUnit.message}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    <Typography 
                      variant="body2" 
                      sx={{ 
                        fontWeight: 500,
                        color: itemErrors?.totalCost ? '#d32f2f' : 'inherit'
                      }}
                    >
                      {item.totalCost
                        ? parseFloat(item.totalCost).toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })
                        : "-"}
                    </Typography>
                    {itemErrors?.totalCost && (
                      <Typography variant="caption" color="error" sx={{ display: 'block', mt: 0.5 }}>
                        {itemErrors.totalCost.message}
                      </Typography>
                    )}
                  </TableCell>
                  <TableCell>
                    {!readOnly && (
                      <Box sx={{ display: "flex", gap: 0.5 }}>
                        <Tooltip title="Edit">
                          <IconButton
                            color="primary"
                            onClick={() => handleEditClick(index)}
                            size="small"
                          >
                            <Edit fontSize="small" />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            color="error"
                            onClick={() => handleDeleteClick(index)}
                            size="small"
                          >
                            <Delete fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    )}
                  </TableCell>
                </TableRow>
              )})}
              {capexItems.length === 0 && (
                <TableRow>
                  <TableCell 
                    colSpan={7} 
                    align="center" 
                    sx={{ 
                      py: 3,
                      backgroundColor: errors.capexItems ? 'rgba(211, 47, 47, 0.08)' : 'inherit',
                    }}
                  >
                    <Typography 
                      variant="body2" 
                      color={errors.capexItems ? 'error' : 'text.secondary'}
                      sx={{ fontWeight: errors.capexItems ? 'bold' : 'normal' }}
                    >
                      {errors.capexItems 
                        ? errors.capexItems.message || "At least one CAPEX item is required. Click 'ADD' to add an item."
                        : "Click 'ADD' to add an item"}
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        <Box sx={{ mt: 6, display: "flex", justifyContent: "flex-start" }}>
          <CustomTextField
            label="Total Cost of INR"
            value={totalCost.toFixed(2)}
            disabled
            sx={{ width: '48.5%' }}
          />
        </Box>
      </Box>

      <CapexItemModal
        open={modalOpen}
        handleClose={handleModalClose}
        onSave={handleModalSave}
        editItem={editingItem}
        index={editingIndex}
        measurementUnits={measurementUnits}
      />

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Controller
            name="applicationDetails"
            control={control}
            rules={{ required: "Application Details is required" }}
            render={({ field, fieldState: { error } }) => (
              <CustomTextField
                {...field}
                label="Application Details *"
                fullWidth
                multiline
                rows={3}
                variant="outlined"
                error={!!error}
                helperText={error?.message}
                disabled={readOnly}
              />
            )}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Controller
            name="acceptanceCriteria"
            control={control}
            rules={{ required: "Acceptance Criteria is required" }}
            render={({ field, fieldState: { error } }) => (
              <CustomTextField
                {...field}
                label="Acceptance Criteria *"
                fullWidth
                multiline
                rows={3}
                variant="outlined"
                error={!!error}
                helperText={error?.message}
                disabled={readOnly}
              />
            )}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Controller
            name="currentScenario"
            control={control}
            rules={{ required: "Current Scenario is required" }}
            render={({ field, fieldState: { error } }) => (
              <CustomTextField
                {...field}
                label="Current Scenario *"
                fullWidth
                multiline
                rows={3}
                variant="outlined"
                error={!!error}
                helperText={error?.message}
                disabled={readOnly}
              />
            )}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Controller
            name="proposedAfterScenario"
            control={control}
            rules={{ required: "Proposed / After Scenario is required" }}
            render={({ field, fieldState: { error } }) => (
              <CustomTextField
                {...field}
                label="Proposed / After Scenario *"
                fullWidth
                multiline
                rows={3}
                variant="outlined"
                error={!!error}
                helperText={error?.message}
                disabled={readOnly}
              />
            )}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <Controller
            name="capacityAlignment"
            control={control}
            rules={{ required: "Capacity Alignment is required" }}
            render={({ field, fieldState: { error } }) => (
              <CustomTextField
                {...field}
                label="Capacity Alignment with Current Production Target and Future Plan *"
                fullWidth
                multiline
                rows={3}
                variant="outlined"
                error={!!error}
                helperText={error?.message}
                disabled={readOnly}
              />
            )}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Controller
            name="alternateMakeTechnology"
            control={control}
            rules={{ required: "Technology Evaluation is required" }}
            render={({ field, fieldState: { error } }) => (
              <CustomTextField
                {...field}
                label="Alternate Make / Technology Evaluation *"
                fullWidth
                multiline
                rows={3}
                variant="outlined"
                error={!!error}
                helperText={error?.message}
                disabled={readOnly}
              />
            )}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Controller
            name="expectedImplementationDate"
            control={control}
            render={({ field }) => {
              // Set minDate to today (start of day) to disable past dates
              const today = new Date();
              today.setHours(0, 0, 0, 0);
              
              return (
                <DatePicker
                  {...field}
                  label="Expected Date of Implementation"
                  disabled={readOnly}
                  minDate={today}
                  slotProps={{
                    textField: {
                      fullWidth: true,
                      variant: "outlined",
                      disabled: readOnly,
                      sx: {
                        "& .MuiInputLabel-root": {
                          fontSize: "0.875rem",
                        },
                      },
                    },
                  }}
                />
              );
            }}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
