// import React, { useEffect, useState } from "react";
// import { useForm, Controller } from "react-hook-form";
// import Box from "@mui/material/Box";
// import Typography from "@mui/material/Typography";
// import Modal from "@mui/material/Modal";
// import TextField from "@mui/material/TextField";
// import Button from "@mui/material/Button";
// import { RxCross2 } from "react-icons/rx";
// import swal from "sweetalert";
// import { userRequest } from "src/requestMethod";
// import { Checkbox, FormControlLabel } from "@mui/material";

// function AddApprover({ handleClose, open, editData, getData }) {
//   const {
//     register,
//     handleSubmit,
//     reset,
//     setValue,
//     control,
//     formState: { errors },
//   } = useForm();

//   // Fetch channels from API and set as options
//   const [channelOptions, setChannelOptions] = useState([]);

//   useEffect(() => {
//     async function fetchChannels() {
//       try {
//         const res = await userRequest.get("/admin/getMasters?key=Channel");
//         setChannelOptions(res?.data?.data?.map((c) => c.value) || []);
//       } catch (err) {
//         setChannelOptions([]);
//       }
//     }
//     fetchChannels();
//   }, []);

//   useEffect(() => {
//     if (editData) {
//       setValue("value", editData.region);
//       setValue("others", editData.others || []);
//     } else {
//       reset();
//     }
//   }, [editData, setValue, reset]);

//   const [analyticsForAll, setAnalyticsForAll] = useState(
//     editData?.analyticsForAll || false
//   );
//   const [showAllRequests, setShowAllRequests] = useState(
//     editData?.showAllRequests || false
//   );

//   const handleSaveData = async (data) => {
//     const formattedData = {
//       userType: "APPROVER",
//       password: "password123",
//       ...data,
//     };
//     try {
//       if (editData?._id) {
//         await userRequest.put(
//           `/admin/updateAdmin?id=${editData?._id}`,
//           data
//         );
//         getData();
//         swal("Updated!", "Approver updated successfully!", "success");
//       } else {
//         await userRequest.post("/admin/createAdmin", formattedData);
//         getData();
//         swal("Success!", "Approver saved successfully!", "success");
//       }
//       reset();
//       handleClose();
//     } catch (error) {
//       console.error("Error saving data:", error);
//       swal("Error", "Error saving data. Please try again later.", "error");
//     }

//     console.log("Data to be saved:", data);
//   };

//   return (
//     <Modal open={open} onClose={handleClose}>
//       <Box
//         sx={{
//           position: "absolute",
//           top: "50%",
//           left: "50%",
//           transform: "translate(-50%, -50%)",
//           width: "50%",
//           bgcolor: "background.paper",
//           borderRadius: 5,
//           p: 4,
//         }}
//       >
//         <Typography
//           sx={{
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "space-between",
//           }}
//         >
//           <span style={{ fontSize: "24px", fontWeight: "bolder" }}>
//             {editData ? "Edit Approver" : "Add Approver"}
//           </span>
//           <RxCross2
//             onClick={handleClose}
//             style={{
//               color: "#B22222",
//               fontWeight: "bolder",
//               cursor: "pointer",
//               height: "24px",
//               width: "24px",
//             }}
//           />
//         </Typography>
//         <Box
//           component="form"
//           sx={{
//             display: "flex",
//             flexDirection: "column",
//             gap: 2,
//             mt: 2,
//             width: "100%",
//           }}
//           onSubmit={handleSubmit((data) =>
//             handleSaveData({
//               ...data,
//               // analyticsForAll,
//               // showAllRequests,
//             })
//           )}
//           noValidate
//         >
//           <TextField
//             id="username"
//             label="Name"
//             {...register("username", { required: true })}
//             error={!!errors.username}
//             helperText={errors.username ? "Name is required" : ""}
//             defaultValue={editData ? editData.username : ""}
//             fullWidth
//           />
//           <TextField
//             id="email"
//             label="Email"
//             {...register("email", { required: true })}
//             error={!!errors.email}
//             helperText={errors.email ? "Email is required" : ""}
//             defaultValue={editData ? editData.email : ""}
//             fullWidth
//           />
//           {/* New checkboxes */}
//           <FormControlLabel
//             control={
//               <Checkbox
//                 checked={analyticsForAll}
//                 onChange={(e) => setAnalyticsForAll(e.target.checked)}
//               />
//             }
//             label="Analytics for All"
//           />
//           <FormControlLabel
//             control={
//               <Checkbox
//                 checked={showAllRequests}
//                 onChange={(e) => setShowAllRequests(e.target.checked)}
//               />
//             }
//             label="Show All Requests"
//           />
//           <Button
//             sx={{ marginTop: "20px", height: "50px" }}
//             variant="contained"
//             color="primary"
//             type="submit"
//           >
//             {editData ? "Update" : "Save"}
//           </Button>
//         </Box>
//       </Box>
//     </Modal>
//   );
// }

// export default AddApprover;

import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { RxCross2 } from "react-icons/rx";
import swal from "sweetalert";
import { userRequest } from "src/requestMethod";
import {
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  OutlinedInput,
  Select,
} from "@mui/material";
import { showErrorMessage } from "src/utils/errorUtils";

function AddApprover({ handleClose, open, editData: editData, getData }) {
  const { register, handleSubmit, reset, setValue, control } = useForm({
    defaultValues: {
      region: [],
    },
  });
  const [regionOptions, setRegionOptions] = useState([]);
  const [channelOptions, setChannelOptions] = useState([]);

  useEffect(() => {
    async function fetchRegion() {
      try {
        const res = await userRequest.get("/admin/getMasters?key=Region");
        setRegionOptions(res?.data?.data?.masters || []);
      } catch (err) {
        setRegionOptions([]);
      }
    }
    fetchRegion();
  }, []);

  useEffect(() => {
    const prefill = async () => {
      if (editData) {
        setValue("username", editData.username || "");
        setValue("email", editData.email || "");
        const regionIds = Array.isArray(editData.region)
          ? editData.region.map((r) => r._id)
          : [];
        setValue("region", regionIds);
      } else {
        reset();
      }
    };
    prefill();
  }, [editData, setValue, reset]);

  const handleSaveData = async (data) => {
    try {
      const formattedData = {
        userType: "APPROVER",
        password: "password123",
        ...data,
      };

      if (editData?._id) {
        await userRequest.put(`/admin/updateAdmin?id=${editData._id}`, data);
        getData();
        swal("Updated!", "Approver data updated successfully!", "success");
      } else {
        await userRequest.post("/admin/createAdmin", formattedData);
        getData();
        swal("Success!", "Approver data saved successfully!", "success");
      }

      reset();
      handleClose();
    } catch (error) {
      console.error("Error saving data:", error);
      showErrorMessage(error, "Error saving data. Please try again later.", swal);
    }
  };
  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "50%",
          bgcolor: "background.paper",
          borderRadius: 5,
          p: 4,
        }}
      >
        <Typography
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span style={{ fontSize: "24px", fontWeight: "bolder" }}>
            {editData ? "Edit Approver" : "Add Approver"}
          </span>
          <RxCross2
            onClick={handleClose}
            style={{
              color: "#B22222",
              fontWeight: "bolder",
              cursor: "pointer",
              height: "24px",
              width: "24px",
            }}
          />
        </Typography>
        <Box
          component="form"
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 2,
            mt: 4,
            width: "100%",
          }}
          onSubmit={handleSubmit(handleSaveData)}
        >
          <FormControl fullWidth>
            <InputLabel id="region-label">Region</InputLabel>
            <Controller
              name="region"
              control={control}
              defaultValue={[]}
              render={({ field }) => (
                <Select
                  labelId="region-label"
                  multiple
                  value={field.value || []}
                  onChange={(event) => {
                    const value = event.target.value;
                    field.onChange(Array.isArray(value) ? value : [value]);
                  }}
                  label="Region"
                  renderValue={(selected) =>
                    regionOptions
                      .filter((option) => selected.includes(option._id))
                      .map((option) => option.value)
                      .join(', ')
                  }
                >
                  {regionOptions.map((option) => (
                    <MenuItem key={option._id} value={option._id}>
                      {option.value}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
          </FormControl>

          <TextField id="username" label="Name" {...register("username")} fullWidth />

          <TextField
            id="email"
            label="Email"
            {...register("email")}
            fullWidth
          />

          <Button
            sx={{ marginTop: "20px", height: "50px" }}
            variant="contained"
            color="primary"
            type="submit"
          >
            {editData ? "Update" : "Save"}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}

export default AddApprover;
