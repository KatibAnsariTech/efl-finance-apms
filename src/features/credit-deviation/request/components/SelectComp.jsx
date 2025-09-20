// import React from "react";

// const SelectComp = ({ label, id, options = [], register, error, validation,disabled }) => {
//   return (
//     <div className="mb-6">
//       {label && (
//         <label htmlFor={id} className="block text-gray-600 font-medium mb-1">
//           {label}
//         </label>
//       )}
//       <select
//         id={id}
//         {...register(id, validation)}
//         className="w-full px-4 py-1 border-b border-gray-300 focus:outline-none bg-white text-black"
//         disabled={disabled}
//       >
//         <option value="">Select</option>
//         {options?.map((item) => (
//           <option key={item._id || item.value} value={item.value}>
//             {item.label || item.value}
//           </option>
//         ))}
//       </select>
//       {error && <p className="text-red-500 text-sm">{error.message}</p>}
//     </div>
//   );
// };

// export default SelectComp;

import React from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
} from "@mui/material";

const SelectComp = ({
  label,
  id,
  options = [],
  register,
  error,
  validation,
  disabled = false,
}) => {
  return (
    <FormControl
      fullWidth
      variant="standard"
      margin="normal"
      disabled={disabled}
      error={!!error}
      sx={{
        mb: 3, // margin bottom spacing, ~24px
        "& .MuiInputLabel-root": {
          color: "#555", // label text color
          fontWeight: 500,
        },
        "& .MuiInputLabel-root.Mui-focused": {
          color: "#1976d2", // label color on focus (MUI primary blue)
        },
        "& .MuiSelect-root": {
          color: "#000",
          paddingLeft: 1,
          paddingTop: 1.25,
          paddingBottom: 1.25,
          borderBottom: "1.5px solid #ccc",
          transition: "border-color 0.3s",
        },
        "& .MuiSelect-root:hover:not(.Mui-disabled)": {
          borderBottomColor: "#1976d2",
        },
        "& .MuiSelect-root.Mui-focused": {
          borderBottomColor: "#1976d2",
          borderBottomWidth: "2px",
        },
        "& .MuiFormHelperText-root": {
          color: "#d32f2f", // MUI error red
          fontSize: "0.8rem",
          marginTop: "4px",
        },
      }}
    >
      {label && <InputLabel htmlFor={id}>{label}</InputLabel>}
      <Select
        label={label}
        id={id}
        defaultValue=""
        {...register(id, validation)}
        displayEmpty
      >
        <MenuItem value="">
          <em>Select</em>
        </MenuItem>
        {options.map((item) => (
          <MenuItem key={item._id || item.value} value={item.value}>
            {item.label || item.value}
          </MenuItem>
        ))}
      </Select>
      {error && <FormHelperText>{error.message}</FormHelperText>}
    </FormControl>
  );
};

export default SelectComp;
