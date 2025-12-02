// import * as React from "react";
// import { useForm, Controller } from "react-hook-form";
// import Box from "@mui/material/Box";
// import Typography from "@mui/material/Typography";
// import Modal from "@mui/material/Modal";
// import TextField from "@mui/material/TextField";
// import Button from "@mui/material/Button";
// import CircularProgress from "@mui/material/CircularProgress";
// import { Autocomplete, FormControl, InputLabel, Select, MenuItem, Chip, OutlinedInput, ListItemText } from "@mui/material";
// import { RxCross2 } from "react-icons/rx";
// import swal from "sweetalert";
// import { userRequest } from "src/requestMethod";
// import { showErrorMessage } from "src/utils/errorUtils";

// function AddApprover({ handleClose, open, editData, getData }) {
//   const { register, handleSubmit, reset, setValue, control } = useForm();
//   const [unassignedUsers, setUnassignedUsers] = React.useState([]);
//   const [selectedUser, setSelectedUser] = React.useState(null);
//   const [loading, setLoading] = React.useState(false);
//   const [saveLoading, setSaveLoading] = React.useState(false);
//   const [companies, setCompanies] = React.useState([]);
//   const [openCompanySelect, setOpenCompanySelect] = React.useState(false);

//   React.useEffect(() => {
//     if (editData) {
//       setValue("companies", editData.companyIds || []);
//       const currentUser = {
//         userRoleId: editData.userRoleId,
//         username: editData.username,
//         email: editData.email,
//       };
//       setSelectedUser(currentUser);
//       setValue("username", editData.username);
//       setValue("email", editData.email);
//       fetchCompanies();
//     } else {
//       reset();
//       setSelectedUser(null);
//       fetchUnassignedUsers();
//       fetchCompanies();
//     }
//   }, [editData, setValue, reset, open]);

//   const fetchUnassignedUsers = async () => {
//     try {
//       setLoading(true);
//       const response = await userRequest.get("/imt/getUnassignedUsers");
//       setUnassignedUsers(response?.data?.data?.unassignedUsers || []);
//     } catch (error) {
//       console.error("Error fetching unassigned users:", error);
//       setUnassignedUsers([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const fetchCompanies = async () => {
//     try {
//       const response = await userRequest.get("/custom/getCompanies", {
//         params: {
//           page: 1,
//           limit: 100,
//         },
//       });
//       const companiesData = response?.data?.data?.companies || response?.data?.data || [];
//       setCompanies(companiesData);
//     } catch (error) {
//       console.error("Error fetching companies:", error);
//       setCompanies([]);
//     }
//   };

//   const handleSaveData = async (data) => {
//     try {
//       setSaveLoading(true);
//       if (editData?.userRoleId) {
//         const updateData = {
//           userRoleId: editData.userRoleId,
//           companyIds: data.companies || [],
//           userType: "APPROVER",
//         };
//         await userRequest.put("/custom/updateUserRole", updateData);
//         getData();
//         swal("Updated!", "Approver data updated successfully!", "success");
//       } else {
//         if (!selectedUser) {
//           swal("Error!", "Please select a user to assign the role.", "error");
//           return;
//         }
        
//         const assignData = {
//           userRoleId: selectedUser.userRoleId,
//           companyIds: data.companies || [],
//           userType: "APPROVER",
//         };
//         await userRequest.put("/custom/updateUserRole", assignData);
//         getData();
//         swal("Success!", "Approver role assigned successfully!", "success");
//       }

//       reset();
//       setSelectedUser(null);
//       handleClose();
//     } catch (error) {
//       console.error("Error saving data:", error);
//       showErrorMessage(error, "Error saving data. Please try again later.", swal);
//     } finally {
//       setSaveLoading(false);
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
//             mt: 4,
//             width: "100%",
//           }}
//           onSubmit={handleSubmit(handleSaveData)}
//         >
//           <Autocomplete
//             options={editData ? [selectedUser].filter(Boolean) : unassignedUsers}
//             getOptionLabel={(option) => `${option.username} (${option.email})`}
//             value={selectedUser}
//             onChange={(event, newValue) => {
//               setSelectedUser(newValue);
//               if (newValue) {
//                 setValue("username", newValue.username);
//                 setValue("email", newValue.email);
//               }
//             }}
//             loading={loading}
//             disabled={!!editData}
//             renderInput={(params) => (
//               <TextField
//                 {...params}
//                 label="Select User"
//                 required
//               />
//             )}
//           />

//           <FormControl fullWidth>
//             <InputLabel id="companies-label">Companies</InputLabel>
//             <Controller
//               name="companies"
//               control={control}
//               defaultValue={[]}
//               render={({ field }) => (
//                 <Select
//                   labelId="companies-label"
//                   multiple
//                   input={<OutlinedInput label="Companies" />}
//                   open={openCompanySelect}
//                   onOpen={() => setOpenCompanySelect(true)}
//                   onClose={() => setOpenCompanySelect(false)}
//                   value={field.value || []}
//                   onChange={(e) => {
//                     field.onChange(e.target.value);
//                     setOpenCompanySelect(false);
//                   }}
//                   renderValue={(selected) => (
//                     <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
//                       {selected.map((value) => {
//                         const company = companies.find((c) => c._id === value);
//                         const companyLabel = company?.name || value;
//                         return (
//                           <Chip
//                             key={value}
//                             label={companyLabel}
//                             onDelete={() =>
//                               field.onChange(
//                                 field.value.filter((v) => v !== value)
//                               )
//                             }
//                             onMouseDown={(e) => e.stopPropagation()}
//                           />
//                         );
//                       })}
//                     </Box>
//                   )}
//                 >
//                   {companies.map((company) => (
//                     <MenuItem key={company._id} value={company._id}>
//                       <ListItemText primary={company.name} />
//                     </MenuItem>
//                   ))}
//                 </Select>
//               )}
//             />
//           </FormControl>
//           <Button
//             sx={{ marginTop: "20px", height: "50px" }}
//             variant="contained"
//             color="primary"
//             type="submit"
//             disabled={saveLoading}
//             startIcon={saveLoading ? <CircularProgress size={20} color="inherit" /> : null}
//           >
//             {saveLoading ? "Processing..." : (editData ? "Update" : "Save")}
//           </Button>
//         </Box>
//       </Box>
//     </Modal>
//   );
// }

// export default AddApprover;

import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import {
  Autocomplete,
  Chip,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { RxCross2 } from "react-icons/rx";
import swal from "sweetalert";
import { userRequest } from "src/requestMethod";
import { showErrorMessage } from "src/utils/errorUtils";

function AddApprover({ handleClose, open, editData, getData }) {
  // react-hook-form
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({ mode: "onBlur" });

  // options
  const [unassignedUsers, setUnassignedUsers] = React.useState([]);
  const [departments, setDepartments] = React.useState([]);
  const [types, setTypes] = React.useState([]);
  const [scopes, setScopes] = React.useState([]);
  const [importTypes, setImportTypes] = React.useState([]);

  // loading flags
  const [loadingUsers, setLoadingUsers] = React.useState(false);
  const [loadingMasters, setLoadingMasters] = React.useState(false);
  const [saveLoading, setSaveLoading] = React.useState(false);

  // helper to map id -> option object for prefill
  const findById = (list, id) => list.find((i) => i._id === id) || null;

  // fetch masters & users
  React.useEffect(() => {
    // always fetch masters when modal opens (so labels are available)
    if (open) {
      fetchAllMasters();
      if (!editData) fetchUnassignedUsers();
    }
  }, [open]);

  // when editData arrives, set form defaults (after masters fetched)
  React.useEffect(() => {
    if (!open) return;
    if (editData) {
      // set primitive fields: we'll set complex ones after masters load
      // set username/email via a controlled Autocomplete value instead of form default
      // We'll set controller values below after masters are loaded
      fetchUnassignedUsers(); // also fetch so user list includes this user if needed
    } else {
      reset();
    }
  }, [editData, open]);

  // fetch functions
  const fetchUnassignedUsers = async () => {
    try {
      setLoadingUsers(true);
      const res = await userRequest.get("/imt/getUnassignedUsers");
      setUnassignedUsers(res?.data?.data?.unassignedUsers || []);
    } catch (err) {
      console.error("fetchUnassignedUsers", err);
      setUnassignedUsers([]);
    } finally {
      setLoadingUsers(false);
    }
  };

  const fetchAllMasters = async () => {
    try {
      setLoadingMasters(true);
      const [deptRes, typeRes, scopeRes, impRes] = await Promise.all([
        userRequest.get("/imt/getMasters?key=Department&page=1&limit=100"),
        userRequest.get("/imt/getMasters?key=Type&page=1&limit=100"),
        userRequest.get("/imt/getMasters?key=Scope&page=1&limit=100"),
        userRequest.get("/imt/getMasters?key=importtype&page=1&limit=100"),
      ]);

      const deptData = deptRes?.data?.data?.masters || [];
      const typeData = typeRes?.data?.data?.masters || [];
      const scopeData = scopeRes?.data?.data?.masters || [];
      const importTypeData = impRes?.data?.data?.masters || [];

      setDepartments(deptData);
      setTypes(typeData);
      setScopes(scopeData);
      setImportTypes(importTypeData);

      // If editing, prefill fields mapping ids -> option objects (so Autocomplete shows labels)
      if (editData) {
        // companyIds, importTypeIds, typeIds, scopeIds are arrays of ids (assumption)
        setValue(
          "department",
          (editData.companyIds || []).map((id) => findById(deptData, id)).filter(Boolean)
        );
        setValue(
          "importType",
          (editData.importTypeIds || []).map((id) => findById(importTypeData, id)).filter(Boolean)
        );
        setValue(
          "type",
          (editData.typeIds || []).map((id) => findById(typeData, id)).filter(Boolean)
        );
        setValue(
          "scope",
          (editData.scopeIds || []).map((id) => findById(scopeData, id)).filter(Boolean)
        );

        // set selected user object for Autocomplete: if user not in unassigned list, create object from editData
        const userObj = {
          userRoleId: editData.userRoleId,
          username: editData.username,
          email: editData.email,
        };
        // put user into unassignedUsers list if not present so Autocomplete can display it
        setUnassignedUsers((prev) => {
          const exists = prev.some((u) => u.userRoleId === userObj.userRoleId);
          if (!exists) return [userObj, ...prev];
          return prev.map((u) => (u.userRoleId === userObj.userRoleId ? userObj : u));
        });
        // set hidden fields: username/email displayed by Autocomplete but we can store them as well if needed
        setValue("selectedUser", userObj);
      } else {
        // ensure form fields are empty for add mode
        setValue("department", []);
        setValue("importType", []);
        setValue("type", []);
        setValue("scope", []);
        setValue("selectedUser", null);
      }
    } catch (err) {
      console.error("fetchAllMasters", err);
      setDepartments([]);
      setTypes([]);
      setScopes([]);
      setImportTypes([]);
    } finally {
      setLoadingMasters(false);
    }
  };

  // on submit -> convert selected option objects to ids
  const onSubmit = async (formValues) => {
    try {
      setSaveLoading(true);

      // get ids from selected option objects
      const payload = {
        userRoleId: (editData && editData.userRoleId) || formValues.selectedUser?.userRoleId,
        departmentId: (formValues.department || ""),
        importType: (formValues.importType || []).map((o) => o._id),
        selectType: (formValues.type || ""),
        scope: (formValues.scope || []).map((o) => o._id),
        userType: "APPROVER",
      };

      // validation: ensure we have a userRoleId
      if (!payload.userRoleId) {
        swal("Error", "Please select a user to assign the role.", "error");
        setSaveLoading(false);
        return;
      }

      await userRequest.put("/imt/updateUserRole", payload);

      swal("Success", editData ? "Requester updated successfully" : "Requester assigned successfully", "success");
      getData?.();
      reset();
      handleClose();
    } catch (err) {
      console.error("save error", err);
      showErrorMessage(err, "Error saving data. Please try again later.", swal);
    } finally {
      setSaveLoading(false);
    }
  };

  // helpers for option labeling
  const optionLabelForUser = (u) => (u ? `${u.username} (${u.email || "no-email"})` : "");
  const optionLabelForMaster = (m) => (m ? m.value || m.name || "" : "");

  return (
    <Modal open={open} onClose={handleClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: { xs: "95%", md: "60%", lg: "50%" },
          bgcolor: "background.paper",
          borderRadius: 2,
          p: 4,
          boxShadow: 24,
        }}
      >
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
          <Typography sx={{ fontSize: 20, fontWeight: 700 }}>
            {editData ? "Edit Approver" : "Add Approver"}
          </Typography>
          <RxCross2 onClick={handleClose} style={{ cursor: "pointer", color: "#b22222" }} />
        </Box>

        <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: "grid", gap: 2 }}>
          {/* USER Autocomplete */}
          <FormControl fullWidth error={!!errors.selectedUser}>
            <Controller
              name="selectedUser"
              control={control}
              rules={{
                validate: (val) => {
                  // if edit mode, user is allowed to be prefilled and not changed; still required
                  return !!(val && val.userRoleId) || "User is required";
                },
              }}
              defaultValue={editData ? { userRoleId: editData.userRoleId, username: editData.username, email: editData.email } : null}
              render={({ field: { onChange, value } }) => (
                <Autocomplete
                  options={unassignedUsers || []}
                  getOptionLabel={optionLabelForUser}
                  value={value || null}
                  onChange={(e, newVal) => onChange(newVal)}
                  loading={loadingUsers || loadingMasters}
                  disabled={!!editData} // disable selection in edit mode
                  isOptionEqualToValue={(option, val) => option?.userRoleId === val?.userRoleId}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select User"
                      required
                      error={!!errors.selectedUser}
                      helperText={errors.selectedUser?.message}
                    />
                  )}
                />
              )}
            />
          </FormControl>

          {/* DEPARTMENT multi Autocomplete */}
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>Select Department</InputLabel>
            <Controller
              name="department"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <Select
                  label="Select Department"
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value)}
                >
                  {departments.map((d) => (
                    <MenuItem key={d._id} value={d._id}>
                      {d.value}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
          </FormControl>


          {/* IMPORT TYPE multi Autocomplete */}
          <FormControl fullWidth error={!!errors.importType}>
            <Controller
              name="importType"
              control={control}
              rules={{ validate: (v) => (v && v.length > 0) || "At least one import type is required" }}
              defaultValue={[]}
              render={({ field: { onChange, value } }) => (
                <Autocomplete
                  multiple
                  options={importTypes}
                  getOptionLabel={optionLabelForMaster}
                  value={value || []}
                  onChange={(e, newVal) => onChange(newVal)}
                  loading={loadingMasters}
                  isOptionEqualToValue={(opt, val) => opt._id === val._id}
                  renderInput={(params) => (
                    <TextField {...params} label="Select Import Type" placeholder="Search import types" />
                  )}
                  renderTags={(tagValue, getTagProps) =>
                    tagValue.map((option, index) => (
                      <Chip label={optionLabelForMaster(option)} {...getTagProps({ index })} key={option._id} />
                    ))
                  }
                />
              )}
            />
            <FormHelperText error>{errors.importType?.message}</FormHelperText>
          </FormControl>

          {/* TYPE multi Autocomplete */}
          <FormControl fullWidth sx={{ mb: 3 }}>
            <InputLabel>Select Type</InputLabel>
            <Controller
              name="type"
              control={control}
              defaultValue=""
              render={({ field }) => (
                <Select
                  label="Select Type"
                  value={field.value}
                  onChange={(e) => field.onChange(e.target.value)}
                >
                  {types.map((t) => (
                    <MenuItem key={t._id} value={t._id}>
                      {t.value}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
          </FormControl>


          {/* SCOPE multi Autocomplete */}
          <FormControl fullWidth error={!!errors.scope}>
            <Controller
              name="scope"
              control={control}
              rules={{ validate: (v) => (v && v.length > 0) || "At least one scope is required" }}
              defaultValue={[]}
              render={({ field: { onChange, value } }) => (
                <Autocomplete
                  multiple
                  options={scopes}
                  getOptionLabel={optionLabelForMaster}
                  value={value || []}
                  onChange={(e, newVal) => onChange(newVal)}
                  loading={loadingMasters}
                  isOptionEqualToValue={(opt, val) => opt._id === val._id}
                  renderInput={(params) => <TextField {...params} label="Select Scope" placeholder="Search scopes" />}
                  renderTags={(tagValue, getTagProps) =>
                    tagValue.map((option, index) => (
                      <Chip label={optionLabelForMaster(option)} {...getTagProps({ index })} key={option._id} />
                    ))
                  }
                />
              )}
            />
            <FormHelperText error>{errors.scope?.message}</FormHelperText>
          </FormControl>

          {/* Submit */}
          <Button
            variant="contained"
            type="submit"
            disabled={saveLoading || isSubmitting}
            startIcon={saveLoading ? <CircularProgress size={18} color="inherit" /> : null}
            sx={{ height: 48 }}
          >
            {saveLoading ? "Processing..." : editData ? "Update" : "Save"}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}

export default AddApprover;
