import React from "react";
import { TextField } from "@mui/material";

const CustomTextField = ({ sx = {}, ...props }) => {
  return (
    <TextField
      {...props}
      sx={{
        "& .MuiInputLabel-root": {
          fontSize: "0.875rem",
        },
        ...sx,
      }}
    />
  );
};

export default CustomTextField;


