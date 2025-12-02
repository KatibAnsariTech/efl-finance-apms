// import * as React from "react";
// import { useForm } from "react-hook-form";
// import Box from "@mui/material/Box";
// import Typography from "@mui/material/Typography";
// import Modal from "@mui/material/Modal";
// import TextField from "@mui/material/TextField";
// import Button from "@mui/material/Button";
// import CircularProgress from "@mui/material/CircularProgress";
// import { RxCross2 } from "react-icons/rx";
// import swal from "sweetalert";
// import { userRequest } from "src/requestMethod";
// import { showErrorMessage } from "src/utils/errorUtils";
// import { MenuItem } from "@mui/material";

// function AddEditDocument({ handleClose, open, editData: accountTypeData, getData }) {
//   const [loading, setLoading] = React.useState(false);
//   const { register, handleSubmit, reset, setValue } = useForm();
//   const [departmentOptions, setDepartmentOptions ] = React.useState([]);

//   const fetchData = async () => {
//     setLoading(true);
//     try {
//       const response = await userRequest.get(
//         `/imt/getMasters?key=importtype&page=1&limit=1000`
//       );
//       console.log("Response:", response.data.data.masters);
//       if (response.data.success) {
//         const mappedData = response.data.data.masters.map((item) => ({
//           label: item.value,
//           value: item._id,
//         }));
//         setDepartmentOptions(mappedData);
//       }
//     } catch (error) {
//       console.error("Error fetching Department data:", error);
//       showErrorMessage(error, "Error fetching Department data", swal);
//     } finally {
//       setLoading(false);
//   };
// }

//    React.useEffect(() => {
//     fetchData();
//   }, []); 

//   React.useEffect(() => {
//     if (accountTypeData) {
//       setValue("importtype", accountTypeData.importtype || "");
//       setValue("document", accountTypeData.document || "");
//     } else {
//       reset();
//     }
//   }, [accountTypeData, setValue, reset]);

//   const handleSaveData = async (data) => {
//     setLoading(true);
//     try {
//         const formattedData = {
//           importType:data.importType,
//           name: data.document,
//           status:"ACTIVE",
//         }
          
//       if (accountTypeData?._id) {
//         await userRequest.put(`/imt/updateMaster/${accountTypeData._id}`, formattedData);
//         getData();
//         swal("Updated!", "Account Type data updated successfully!", "success");
//       } else {
//         await userRequest.post("/imt/createDocument", formattedData);
//         getData();
//         swal("Success!", "Account Type data saved successfully!", "success");
//       }

//       reset();
//       handleClose();
//     } catch (error) {
//       console.error("Error saving data:", error);
//       showErrorMessage(error, "Error saving data. Please try again later.", swal);
//     } finally {
//       setLoading(false);
//     }
//   };

//   console.log("departmentOptions:", departmentOptions);
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
//             {accountTypeData ? "Edit Document" : "Add Document"}
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
//             mt: 4,
//             width: "100%",
//           }}
//           onSubmit={handleSubmit(handleSaveData)}
//         >
//           <TextField
//             id="importtype"
//             label="Select Import Type"
//             select
//             fullWidth
//             required
//             disabled={loading}
//             {...register("importtype", { required: true })}
//           >
//             {departmentOptions.map((dept) => (
//               <MenuItem key={dept.value} value={dept._id}>
//                 {dept.label}
//               </MenuItem>
//             ))}
//           </TextField>
//           <TextField
//             id="document"
//             label="Document Name"
//             {...register("document", { required: true })}
//             fullWidth
//             required
//             disabled={loading}
//             // placeholder="e.g., Asset, Liability, Equity"
//           />
//           <Button
//             sx={{ marginTop: "20px", height: "50px" }}
//             variant="contained"
//             color="primary"
//             type="submit"
//             disabled={loading}
//             startIcon={loading && <CircularProgress size={20} color="inherit" />}
//           >
//             {loading ? (accountTypeData ? "Updating..." : "Saving...") : (accountTypeData ? "Update" : "Save")}
//           </Button>
//         </Box>
//       </Box>
//     </Modal>
//   );
// }

// export default AddEditDocument;

// import * as React from "react";
// import { useForm } from "react-hook-form";
// import Box from "@mui/material/Box";
// import Typography from "@mui/material/Typography";
// import Modal from "@mui/material/Modal";
// import TextField from "@mui/material/TextField";
// import Button from "@mui/material/Button";
// import CircularProgress from "@mui/material/CircularProgress";
// import { RxCross2 } from "react-icons/rx";
// import swal from "sweetalert";
// import { userRequest } from "src/requestMethod";
// import { showErrorMessage } from "src/utils/errorUtils";
// import { MenuItem } from "@mui/material";

// function AddEditDocument({ handleClose, open, editData: accountTypeData, getData }) {
//   const [loading, setLoading] = React.useState(false);
//   const { register, handleSubmit, reset, setValue } = useForm();
//   const [importTypeOptions, setImportTypeOptions] = React.useState([]);

//   // Fetch Import Type list
//   const fetchData = async () => {
//     setLoading(true);
//     try {
//       const response = await userRequest.get(
//         `/imt/getMasters?key=importtype&page=1&limit=1000`
//       );

//       if (response.data.success) {
//         const mappedData = response.data.data.masters.map((item) => ({
//           label: item.value,
//           value: item._id, // <-- Store ID here
//         }));

//         setImportTypeOptions(mappedData);
//       }
//     } catch (error) {
//       console.error("Error fetching import type data:", error);
//       showErrorMessage(error, "Error fetching import type data", swal);
//     } finally {
//       setLoading(false);
//     }
//   };

//   React.useEffect(() => {
//     fetchData();
//   }, []);

//   console.log("accountTypeData:", JSON.stringify(accountTypeData),"importTypeOptions", JSON.stringify(importTypeOptions));

//   // Set values on edit
//   React.useEffect(() => {
//     if (accountTypeData) {
//       setValue("importtype", accountTypeData.importType?._id || "");
//       setValue("document", accountTypeData.document || accountTypeData.name || "");
//     } else {
//       reset();
//     }
//   }, [accountTypeData, setValue, reset]);

//   // Save data
//   const handleSaveData = async (data) => {
//     setLoading(true);
//     try {
//       const formattedData = {
//         importType: data.importtype, // _id from dropdown
//         name: data.document,
//         status: "ACTIVE",
//       };

//       if (accountTypeData?._id) {
//         await userRequest.put(`/imt/updateMaster/${accountTypeData._id}`, formattedData);
//         swal("Updated!", "Document updated successfully!", "success");
//       } else {
//         await userRequest.post("/imt/createDocument", formattedData);
//         swal("Success!", "Document saved successfully!", "success");
//       }

//       getData();
//       reset();
//       handleClose();
//     } catch (error) {
//       console.error("Error saving data:", error);
//       showErrorMessage(error, "Error saving data. Please try again later.", swal);
//     } finally {
//       setLoading(false);
//     }
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
//             {accountTypeData ? "Edit Document" : "Add Document"}
//           </span>
//           <RxCross2
//             onClick={handleClose}
//             style={{
//               color: "#B22222",
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
//             mt: 4,
//             width: "100%",
//           }}
//           onSubmit={handleSubmit(handleSaveData)}
//         >
//           {/* IMPORT TYPE DROPDOWN */}
//           <TextField
//             id="importtype"
//             label="Select Import Type"
//             select
//             fullWidth
//             required
//             disabled={loading}
//             {...register("importtype", { required: true })}
//           >
//             {importTypeOptions.map((item) => (
//               <MenuItem key={item.value} value={item.value}>
//                 {item.label}
//               </MenuItem>
//             ))}
//           </TextField>

//           <TextField
//             id="document"
//             label="Document Name"
//             {...register("document", { required: true })}
//             fullWidth
//             required
//             disabled={loading}
//           />

//           <Button
//             sx={{ marginTop: "20px", height: "50px" }}
//             variant="contained"
//             color="primary"
//             type="submit"
//             disabled={loading}
//             startIcon={loading && <CircularProgress size={20} color="inherit" />}
//           >
//             {loading
//               ? accountTypeData
//                 ? "Updating..."
//                 : "Saving..."
//               : accountTypeData
//               ? "Update"
//               : "Save"}
//           </Button>
//         </Box>
//       </Box>
//     </Modal>
//   );
// }

// export default AddEditDocument;

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { RxCross2 } from "react-icons/rx";
import swal from "sweetalert";
import { userRequest } from "src/requestMethod";
import { showErrorMessage } from "src/utils/errorUtils";
import { MenuItem } from "@mui/material";

function AddEditDocument({ handleClose, open, editData: accountTypeData, getData }) {
  const [loading, setLoading] = React.useState(false);
  const [importTypeOptions, setImportTypeOptions] = React.useState([]);

  const { control, register, handleSubmit, reset, setValue } = useForm();

  // Fetch Import Type list
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await userRequest.get(
        `/imt/getMasters?key=importtype&page=1&limit=1000`
      );

      if (response.data.success) {
        const mappedData = response.data.data.masters.map((item) => ({
          label: item.value,
          value: item._id,
        }));
        setImportTypeOptions(mappedData);
      }
    } catch (error) {
      showErrorMessage(error, "Error fetching import type data", swal);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  // Pre-fill edit data
  React.useEffect(() => {
    if (accountTypeData) {
      setValue("importtype", accountTypeData.importType?._id || "");
      setValue("document", accountTypeData.document || accountTypeData.name || "");
    } else {
      reset();
    }
  }, [accountTypeData]);

  const handleSaveData = async (data) => {
    setLoading(true);

    try {
      const formattedData = {
        importType: data.importtype,
        name: data.document,
        status: "ACTIVE",
      };

      if (accountTypeData?._id) {
        await userRequest.put(`/imt/updateDocument/${accountTypeData._id}`, formattedData);
        swal("Updated!", "Document updated successfully!", "success");
      } else {
        await userRequest.post("/imt/createDocument", formattedData);
        swal("Success!", "Document saved successfully!", "success");
      }

      getData();
      reset();
      handleClose();
    } catch (error) {
      showErrorMessage(error, "Error saving data", swal);
    } finally {
      setLoading(false);
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
            {accountTypeData ? "Edit Document" : "Add Document"}
          </span>
          <RxCross2
            onClick={handleClose}
            style={{
              color: "#B22222",
              cursor: "pointer",
              height: "24px",
              width: "24px",
            }}
          />
        </Typography>

        <Box
          component="form"
          sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 4 }}
          onSubmit={handleSubmit(handleSaveData)}
        >

          {/* IMPORT TYPE DROPDOWN FIXED */}
          <Controller
            name="importtype"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <TextField
                select
                label="Select Import Type"
                fullWidth
                disabled={loading}
                {...field}
              >
                {importTypeOptions.map((item) => (
                  <MenuItem key={item.value} value={item.value}>
                    {item.label}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />

          <TextField
            label="Document Name"
            fullWidth
            disabled={loading}
            {...register("document", { required: true })}
          />

          <Button
            sx={{ marginTop: "20px", height: "50px" }}
            variant="contained"
            type="submit"
            disabled={loading}
            startIcon={loading && <CircularProgress size={20} color="inherit" />}
          >
            {loading
              ? accountTypeData
                ? "Updating..."
                : "Saving..."
              : accountTypeData
              ? "Update"
              : "Save"}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}

export default AddEditDocument;


