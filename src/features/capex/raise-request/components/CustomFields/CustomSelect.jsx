import React from "react";
import { Autocomplete, TextField, CircularProgress } from "@mui/material";

const CustomSelect = ({ 
  label, 
  options = [], 
  getOptionLabel,
  isOptionEqualToValue,
  renderOption,
  sx = {}, 
  error, 
  helperText, 
  fullWidth = true,
  loading = false,
  onChange,
  value,
  disabled = false,
  ...props 
}) => {
  // Default getOptionLabel - handles both string and object options
  const defaultGetOptionLabel = (option) => {
    if (!option) return "";
    if (typeof option === "string") return option;
    if (typeof option === "object") {
      // Try common property names in order of preference
      if (option.label) return option.label;
      if (option.name) return option.name;
      if (option.plantCode) return option.plantCode;
      if (option.location) return option.location;
      if (option.unit) return option.unit;
      if (option.value) return option.value;
    }
    return String(option);
  };

  // Default isOptionEqualToValue - handles string and object comparisons
  const defaultIsOptionEqualToValue = (option, value) => {
    if (!option || !value) return false;
    
    // Both are strings
    if (typeof option === "string" && typeof value === "string") {
      return option === value;
    }
    
    // Both are objects
    if (typeof option === "object" && typeof value === "object") {
      // Compare by _id if both have it (most common case for database objects)
      if (option._id && value._id) {
        return option._id === value._id;
      }
      // Compare by value property if both have it
      if (option.value && value.value) {
        return option.value === value.value;
      }
      // Direct object reference comparison
      return option === value;
    }
    
    // Mixed types - try to compare string value with object's _id or string property
    if (typeof option === "string" && typeof value === "object") {
      return option === value._id || option === value.value || option === value.name;
    }
    if (typeof option === "object" && typeof value === "string") {
      return option._id === value || option.value === value || option.name === value;
    }
    
    return false;
  };

  return (
    <Autocomplete
      {...props}
      value={value}
      onChange={onChange}
      options={options}
      getOptionLabel={getOptionLabel || defaultGetOptionLabel}
      isOptionEqualToValue={isOptionEqualToValue || defaultIsOptionEqualToValue}
      renderOption={renderOption}
      loading={loading}
      fullWidth={fullWidth}
      disabled={disabled}
      renderInput={(params) => (
        <TextField
          {...params}
          label={label}
          error={error}
          helperText={helperText}
          disabled={disabled}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <>
                {loading ? <CircularProgress size={20} /> : null}
                {params.InputProps.endAdornment}
              </>
            ),
          }}
          sx={{
            "& .MuiInputLabel-root": {
              fontSize: "0.875rem",
            },
            ...sx,
          }}
        />
      )}
    />
  );
};

export default CustomSelect;
