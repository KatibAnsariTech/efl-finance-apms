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

  const handleDeleteClick = (index) => {
    const newItems = capexItems.filter((_, i) => i !== index);
    setValue("capexItems", newItems);
    calculateTotal(newItems);
  };

  const handleModalSave = (itemData, index) => {
    const newItems = [...capexItems];
    if (index !== null && index !== undefined) {
      newItems[index] = itemData;
    } else {
      newItems.push(itemData);
    }
    setValue("capexItems", newItems);
    calculateTotal(newItems);
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
            CAPEX Details
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={handleAddClick}
            size="small"
          >
            ADD
          </Button>
        </Box>

        <TableContainer component={Paper} variant="outlined">
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
              {capexItems.map((item, index) => (
                <TableRow key={index}>
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
                        }}
                      >
                        {item.description || "-"}
                      </Typography>
                    </Tooltip>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">
                      {item.quantity || "-"}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{item.uom || "-"}</Typography>
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
                    <Typography variant="body2">
                      {item.costPerUnit
                        ? parseFloat(item.costPerUnit).toLocaleString()
                        : "-"}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {item.totalCost
                        ? parseFloat(item.totalCost).toLocaleString(undefined, {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2,
                          })
                        : "-"}
                    </Typography>
                  </TableCell>
                  <TableCell>
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
                  </TableCell>
                </TableRow>
              ))}
              {capexItems.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7} align="center" sx={{ py: 3 }}>
                    <Typography variant="body2" color="text.secondary">
                      Click "ADD" to add
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
      />

      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <CustomTextField
            name="applicationDetails"
            label="Application Details *"
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            error={!!errors.applicationDetails}
            helperText={errors.applicationDetails?.message}
            onChange={(e) => setValue("applicationDetails", e.target.value)}
            value={watch("applicationDetails") || ""}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <CustomTextField
            name="acceptanceCriteria"
            label="Acceptance Criteria *"
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            error={!!errors.acceptanceCriteria}
            helperText={errors.acceptanceCriteria?.message}
            onChange={(e) => setValue("acceptanceCriteria", e.target.value)}
            value={watch("acceptanceCriteria") || ""}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <CustomTextField
            name="currentScenario"
            label="Current Scenario *"
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            error={!!errors.currentScenario}
            helperText={errors.currentScenario?.message}
            onChange={(e) => setValue("currentScenario", e.target.value)}
            value={watch("currentScenario") || ""}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <CustomTextField
            name="proposedAfterScenario"
            label="Proposed / After Scenario *"
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            error={!!errors.proposedAfterScenario}
            helperText={errors.proposedAfterScenario?.message}
            onChange={(e) => setValue("proposedAfterScenario", e.target.value)}
            value={watch("proposedAfterScenario") || ""}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <CustomTextField
            name="capacityAlignment"
            label="Capacity Alignment with Current Production Target and Future Plan *"
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            error={!!errors.capacityAlignment}
            helperText={errors.capacityAlignment?.message}
            onChange={(e) => setValue("capacityAlignment", e.target.value)}
            value={watch("capacityAlignment") || ""}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <CustomTextField
            name="alternateMakeTechnology"
            label="Alternate Make / Technology Evaluation *"
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            error={!!errors.alternateMakeTechnology}
            helperText={errors.alternateMakeTechnology?.message}
            onChange={(e) =>
              setValue("alternateMakeTechnology", e.target.value)
            }
            value={watch("alternateMakeTechnology") || ""}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <Controller
            name="expectedImplementationDate"
            control={control}
            render={({ field }) => (
              <DatePicker
                {...field}
                label="Expected Date of Implementation"
                slotProps={{
                  textField: {
                    fullWidth: true,
                    variant: "outlined",
                    sx: {
                      "& .MuiInputLabel-root": {
                        fontSize: "0.875rem",
                      },
                    },
                  },
                }}
              />
            )}
          />
        </Grid>
      </Grid>
    </Box>
  );
}
