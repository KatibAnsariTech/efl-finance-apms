import React from "react";
import { FormControl, InputLabel, Select, FormHelperText } from "@mui/material";

const CustomSelect = ({ label, children, sx = {}, error, helperText, fullWidth = true, ...props }) => {
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
      {helperText && <FormHelperText>{helperText}</FormHelperText>}
    </FormControl>
  );
};

export default CustomSelect;


