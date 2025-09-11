import React from "react";
import { TextField, Typography } from "@mui/material";

const InputComp = ({
  label,
  id,
  type = "text",
  register,
  error,
  placeholder,
  validation,
  readOnly,
}) => {
  return (
    <div style={{ marginBottom: "1.5rem" }}>
      <TextField
        id={id}
        label={label}
        type={type}
        placeholder={placeholder}
        fullWidth
        variant="standard"
        InputLabelProps={{ shrink: !!placeholder }}
        InputProps={{ readOnly }}
        error={!!error}
        helperText={error?.message}
        {...register(id, validation)}
      />
    </div>
  );
};

export default InputComp;
