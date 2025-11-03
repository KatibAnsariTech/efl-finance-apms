import React from "react";
import { FormControl, InputLabel, Select } from "@mui/material";

const CustomSelect = ({ label, children, sx = {}, error, fullWidth = true, ...props }) => {
  return (
    <FormControl
      fullWidth={fullWidth}
      error={error}
      sx={{
        "& .MuiInputLabel-root": {
          fontSize: "0.875rem",
        },
        ...sx,
      }}
    >
      <InputLabel>{label}</InputLabel>
      <Select {...props} label={label}>
        {children}
      </Select>
    </FormControl>
  );
};

export default CustomSelect;


