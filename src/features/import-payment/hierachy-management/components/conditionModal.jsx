import { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Button,
  IconButton,
  TextField,
  Select,
  MenuItem,
  Typography,
  Grid,
  Divider,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";

export function ConditionModal({
  open,
  onClose,
  onSave,
  initialConditions = [],
  levelNumber,
}) {
  const [conditions, setConditions] = useState([]);

  useEffect(() => {
    if (initialConditions.length === 0) {
      setConditions([
        {
        //   id: crypto.randomUUID(),
          field: "",
          operator: "",
          value: "",
        },
      ]);
    } else {
      setConditions(initialConditions);
    }
  }, [initialConditions]);

  const addCondition = () => {
    setConditions((prev) => [
      ...prev,
      {
        field: "",
        operator: "",
        value: "",
      },
    ]);
  };

  const removeCondition = (id) => {
    if (conditions.length > 1) {
      setConditions((prev) => prev.filter((c) => c.id !== id));
    }
  };

  const updateCondition = (id, key, value) => {
    setConditions((prev) =>
      prev.map((c) => (c.id === id ? { ...c, [key]: value } : c))
    );
  };

  const handleSave = () => {
    onSave(conditions);
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      {/* Header */}
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between" }}>
        <Typography variant="h6">
          Condition Settings – Level {levelNumber}
        </Typography>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <Divider />

      {/* Content */}
      <DialogContent dividers>
        {conditions.map((condition, index) => (
          <Box
            key={condition.id}
            sx={{
              border: "1px solid #ddd",
              borderRadius: 2,
              p: 2,
              mb: 2,
              backgroundColor: "#fafafa",
            }}
          >
            <Box
              display="flex"
              justifyContent="space-between"
              alignItems="center"
              mb={2}
            >
              <Typography variant="subtitle2">
                Condition {index + 1}
              </Typography>

              {conditions.length > 1 && (
                <IconButton
                  color="error"
                  size="small"
                  onClick={() => removeCondition(condition.id)}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              )}
            </Box>

            {/* Field */}
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="body2" mb={1}>
                  Select Field
                </Typography>
                <Select
                  fullWidth
                  size="small"
                  value={condition.field}
                  onChange={(e) =>
                    updateCondition(condition.id, "field", e.target.value)
                  }
                >
                  <MenuItem value="">Select field</MenuItem>
                  <MenuItem value="poAmount">PO Amount</MenuItem>
                  <MenuItem value="po_percentage">PO Percentage</MenuItem>
                </Select>
              </Grid>

              {/* Operator & Value */}
              {condition.field && (
                <>
                  <Grid item xs={6}>
                    <Typography variant="body2" mb={1}>
                      Operator
                    </Typography>
                    <Select
                      fullWidth
                      size="small"
                      value={condition.operator}
                      onChange={(e) =>
                        updateCondition(
                          condition.id,
                          "operator",
                          e.target.value
                        )
                      }
                    >
                      <MenuItem value="">Select operator</MenuItem>
                      {/* <MenuItem value="<">&lt; (Less than)</MenuItem> */}
                      <MenuItem value="greater_than">&gt; (Greater than)</MenuItem>
                      {/* <MenuItem value="=">= (Equal to)</MenuItem> */}
                    </Select>
                  </Grid>

                  <Grid item xs={6}>
                    <Typography variant="body2" mb={1}>
                      {condition.field === "poAmount"
                        ? "Amount"
                        : "Percentage"}
                    </Typography>
                    <TextField
                      type="number"
                      size="small"
                      fullWidth
                      value={condition.value}
                      onChange={(e) =>
                        updateCondition(
                          condition.id,
                          "value",
                          e.target.value
                        )
                      }
                      placeholder={
                        condition.field === "po_amount"
                          ? "Enter amount"
                          : "Enter percentage"
                      }
                    />
                  </Grid>
                </>
              )}
            </Grid>
          </Box>
        ))}

        <Button
          fullWidth
          variant="outlined"
          startIcon={<AddIcon />}
          onClick={addCondition}
        >
          Add Another Condition
        </Button>
      </DialogContent>

      {/* Footer */}
      <DialogActions>
        <Button variant="outlined" onClick={onClose}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSave}>
          Save Conditions
        </Button>
      </DialogActions>
    </Dialog>
  );
}
