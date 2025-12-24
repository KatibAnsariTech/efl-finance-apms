// import React, { useState, useEffect } from "react";
// import {
//   Box,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Chip,
//   IconButton,
//   Tooltip,
//   Switch,
//   Typography,
//   TextField,
//   Autocomplete,
//   Button,
//   CircularProgress,
//   Fade,
// } from "@mui/material";
// import { Update as UpdateIcon } from "@mui/icons-material";
// import Iconify from "src/components/iconify";
// import { useTheme } from "@mui/material/styles";
// import { userRequest } from "src/requestMethod";
// import swal from "sweetalert";
// import { showErrorMessage } from "src/utils/errorUtils";

// export default function HierarchyTable({
//   companyId,
//   importTypeId,
//   scopeId,
//   getData,
//   companiesLoaded = true,
// }) {
//   const theme = useTheme();
//   const [hierarchyData, setHierarchyData] = useState([]);
//   const [approvers, setApprovers] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [editingLevel, setEditingLevel] = useState(null);
//   const [hasChanges, setHasChanges] = useState(false);
//   const [approvalTypeId, setApprovalTypeId] = useState(null);

//   const fetchApprovers = async () => {
//     try {
//       const response = await userRequest.get(
//         `/imt/getApproversByImportTypeAndScope?importTypeId=${importTypeId}&scopeId=${scopeId}&page=1&limit=10&search=`
//       );
//       if (response?.data?.statusCode === 200 && response?.data?.data) {
//         const approversData = response.data.data.approvers || [];
//         setApprovers(approversData);
//       } else {
//         setApprovers([]);
//       }
//     } catch (error) {
//       console.error("Error fetching approvers:", error);
//       setApprovers([]);
//     }
//   };

//   const createDefaultLevels = () => {
//     return [1, 2, 3, 4, 5, 6].map((level) => ({
//       id: `level-${level}`,
//       _id: `level-${level}`,
//       level: level,
//       approvers: [],
//       status: true,
//     }));
//   };

//   const fetchHierarchyData = async () => {
//   try {
//     setLoading(true);
//     const res = await userRequest.get("/imt/getHierarchiesByImportTypeAndScope", {
//       params: {
//         importTypeId,
//         scopeId,
//       },
//     });

//     const approvalTypesData = res?.data?.data || [];
//     const approvalType = approvalTypesData.find(
//       (item) =>
//         item.importTypeId._id === importTypeId &&
//         item.scopeId._id === scopeId
//     );

//     const result = approvalType?.steps || [];
//     setApprovalTypeId(approvalType?._id || null);

//     // Make levels dynamic
//     const apiLevels = result.map((item) => item.level);
//     const maxLevel = Math.max(...apiLevels, 6);
//     const levelsArray = Array.from({ length: maxLevel }, (_, i) => i + 1);

//     const levels = levelsArray.map((level) => {
//       const existing = result.find((step) => step.level === level);

//       if (existing) {
//         return {
//           id: existing._id,
//           _id: existing._id,
//           level,
//           approvers: existing.approverId.map((a) => ({
//             userRoleId: a._id,
//             username: a.user?.username,
//             email: a.user?.email,
//             userId: a.userId,
//             _id: a._id,
//           })),
//           status: existing.status,
//         };
//       }

//       return {
//         id: `level-${level}`,
//         _id: `level-${level}`,
//         level,
//         approvers: [],
//         status: true,
//       };
//     });

//     setHierarchyData(levels);
//   } catch (error) {
//     console.error("Error fetching approval hierarchy:", error);
//   } finally {
//     setLoading(false);
//   }
// };


//   useEffect(() => {
//     if (importTypeId && scopeId && scopeId.trim() !== "" && importTypeId.trim() !== "") {
//       fetchApprovers();
//       fetchHierarchyData();
//     } else {
//       setHierarchyData(createDefaultLevels());
//     }
//   }, [importTypeId, scopeId]);

//   useEffect(() => {
//     if (companiesLoaded && importTypeId && scopeId.trim() !== "") {
//       fetchHierarchyData();
//     }
//   }, [companiesLoaded]);

//   useEffect(() => {
//     setEditingLevel(null);
//     setHasChanges(false);
//     setApprovalTypeId(null);
//   }, [companyId]);

//   const handleEdit = (levelData) => {
//     if (editingLevel === levelData.level) {
//       setEditingLevel(null);
//     } else {
//       setEditingLevel(levelData.level);
//     }
//   };

//   const handleToggle = async (levelData) => {
//     try {
//       const newStatus = !levelData.status;

//       const result = await swal({
//         title: "Are you sure?",
//         text: `Do you want to ${newStatus ? "activate" : "deactivate"} Level ${
//           levelData.level
//         }?`,
//         icon: "warning",
//         buttons: {
//           cancel: "Cancel",
//           confirm: {
//             text: "Yes, change it!",
//             value: true,
//           },
//         },
//         dangerMode: true,
//       });

//       if (!result) return;

//       const requestBody = {
//         _id: approvalTypeId,
//         level: levelData.level,
//         status: newStatus,
//       };

//       await userRequest.put("/imt/updateHierarchyStepStatus", requestBody);

//       fetchHierarchyData();
//       swal(
//         "Success!",
//         `Level ${levelData.level} ${
//           newStatus ? "activated" : "deactivated"
//         } successfully!`,
//         "success"
//       );
//     } catch (error) {
//       console.error("Error toggling status:", error);
//       showErrorMessage(
//         error,
//         "Error updating status. Please try again later.",
//         swal
//       );
//     }
//   };

//   const updateField = (level, field, value) => {
//     setHierarchyData((prev) =>
//       prev.map((item) =>
//         item.level === level ? { ...item, [field]: value } : item
//       )
//     );
//     setHasChanges(true);
//   };

//   const handleUpdateAll = async () => {
//     try {
//       setLoading(true);

//       const requestBody = {
//         importTypeId: importTypeId,
//         scopeId: scopeId,
//         steps: hierarchyData
//           .filter(
//             (levelData) =>
//               levelData.approvers &&
//               levelData.approvers.length > 0
//           )
//           .map((levelData) => ({
//             level: levelData.level,
//             approverId: levelData.approvers.map(
//               (approver) => approver._id || approver.userRoleId
//             ),
//           })),
//       };

//       await userRequest.put(`/imt/updateHierarchy?id=${approvalTypeId}`, requestBody);

//       setHasChanges(false);
//       setEditingLevel(null);
//       fetchHierarchyData();
//       swal("Success!", "Approval type updated successfully!", "success");
//     } catch (error) {
//       console.error("Error updating approval type:", error);
//       showErrorMessage(
//         error,
//         "Error updating approval type. Please try again later.",
//         swal
//       );
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Box>
//       {loading ? (
//         <Fade in={loading} timeout={300}>
//           <Box
//             sx={{
//               display: "flex",
//               flexDirection: "column",
//               justifyContent: "center",
//               alignItems: "center",
//               height: "250px",
//               width: "100%",
//               gap: 2,
//             }}
//           >
//             <CircularProgress size={40} />
//             <Typography variant="body2" color="text.secondary">
//               Loading hierarchy data...
//             </Typography>
//           </Box>
//         </Fade>
//       ) : (
//         <Fade in={!loading} timeout={300}>
//           <TableContainer component={Paper}>
//             <Table>
//               <TableHead>
//                 <TableRow>
//                   <TableCell align="center" sx={{ width: "120px" }}>
//                     Level
//                   </TableCell>
//                   <TableCell align="center" sx={{ width: "400px" }}>
//                     Approvers
//                   </TableCell>
//                   <TableCell align="center" sx={{ width: "150px" }}>
//                     Actions
//                   </TableCell>
//                 </TableRow>
//               </TableHead>
//               <TableBody>
//                 {hierarchyData.map((row) => (
//                   <TableRow key={row.level}>
//                     <TableCell align="center" sx={{ width: "120px" }}>
//                       <Typography variant="body1">{row.level}</Typography>
//                     </TableCell>

//                     <TableCell align="center" sx={{ width: "400px" }}>
//                       {editingLevel === row.level ? (
//                         <Box
//                           sx={{
//                             display: "flex",
//                             justifyContent: "center",
//                             width: "100%",
//                           }}
//                         >
//                           <Autocomplete
//                             size="small"
//                             multiple
//                             options={approvers}
//                             getOptionLabel={(option) =>
//                               `${option.username} (${option.email})`
//                             }
//                             value={row.approvers || []}
//                             onChange={(event, newValue) =>
//                               updateField(row.level, "approvers", newValue)
//                             }
//                             renderTags={(value, getTagProps) =>
//                               value.map((option, index) => (
//                                 <Chip
//                                   variant="filled"
//                                   label={option.email}
//                                   size="small"
//                                   color="primary"
//                                   {...getTagProps({ index })}
//                                   key={option.userRoleId}
//                                 />
//                               ))
//                             }
//                             renderInput={(params) => (
//                               <TextField
//                                 {...params}
//                                 placeholder="Select approvers..."
//                                 size="small"
//                               />
//                             )}
//                             sx={{ width: "70%" }}
//                           />
//                         </Box>
//                       ) : (
//                         <Box
//                           sx={{
//                             display: "flex",
//                             flexWrap: "wrap",
//                             gap: 1,
//                             justifyContent: "center",
//                           }}
//                         >
//                           {row.approvers && row.approvers.length > 0 ? (
//                             row.approvers.map((approver) => (
//                               <Chip
//                                 key={approver.userRoleId || approver.email}
//                                 label={approver.email}
//                                 size="small"
//                                 variant="outlined"
//                                 color="primary"
//                               />
//                             ))
//                           ) : (
//                             <Typography variant="body2" color="text.secondary">
//                               No approvers assigned
//                             </Typography>
//                           )}
//                         </Box>
//                       )}
//                     </TableCell>

//                     <TableCell align="center" sx={{ width: "150px" }}>
//                       <Box
//                         sx={{
//                           display: "flex",
//                           alignItems: "center",
//                           justifyContent: "center",
//                           gap: 1,
//                         }}
//                       >
//                         <Tooltip title="Edit Approvers">
//                           <IconButton
//                             size="small"
//                             onClick={() => handleEdit(row)}
//                             sx={{
//                               color: theme.palette.primary.main,
//                               backgroundColor:
//                                 editingLevel === row.level
//                                   ? theme.palette.primary.lighter
//                                   : "transparent",
//                               "&:hover": {
//                                 backgroundColor: theme.palette.primary.lighter,
//                               },
//                             }}
//                           >
//                             <Iconify
//                               icon="eva:edit-fill"
//                               sx={{ color: "primary.main" }}
//                             />
//                           </IconButton>
//                         </Tooltip>
//                         <Tooltip
//                           title={
//                             row.status ? "Deactivate Level" : "Activate Level"
//                           }
//                         >
//                           <Switch
//                             checked={row.status}
//                             onChange={() => handleToggle(row)}
//                           />
//                         </Tooltip>
//                       </Box>
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </TableContainer>
//         </Fade>
//       )}

//       {hasChanges && (
//         <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
//           <Button
//             variant="contained"
//             startIcon={<UpdateIcon />}
//             onClick={handleUpdateAll}
//             disabled={loading}
//             sx={{ minWidth: 150, py: 1.5 }}
//           >
//             {loading ? "Updating..." : "Update"}
//           </Button>
//         </Box>
//       )}
//     </Box>
//   );
// }


// import React, { useState, useEffect } from "react";
// import {
//   Box,
//   Table,
//   TableBody,
//   TableCell,
//   TableContainer,
//   TableHead,
//   TableRow,
//   Paper,
//   Chip,
//   IconButton,
//   Tooltip,
//   Switch,
//   Typography,
//   TextField,
//   Autocomplete,
//   Button,
//   CircularProgress,
//   Fade,
// } from "@mui/material";
// import { Update as UpdateIcon } from "@mui/icons-material";
// import { useTheme } from "@mui/material/styles";
// import Iconify from "src/components/iconify";
// import { userRequest } from "src/requestMethod";
// import swal from "sweetalert";
// import { showErrorMessage } from "src/utils/errorUtils";
// import { ConditionModal } from "./ConditionModal";

// export default function HierarchyTable({
//   companyId,
//   importTypeId,
//   scopeId,
//   companiesLoaded = true,
// }) {
//   const theme = useTheme();

//   const [hierarchyData, setHierarchyData] = useState([]);
//   const [approvers, setApprovers] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [editingLevel, setEditingLevel] = useState(null);
//   const [hasChanges, setHasChanges] = useState(false);
//   const [approvalTypeId, setApprovalTypeId] = useState(null);

//   const [conditionModalOpen, setConditionModalOpen] = useState(false);
//   const [selectedLevel, setSelectedLevel] = useState(null);

//   const createDefaultLevels = () =>
//     [1, 2, 3, 4, 5].map((level) => ({
//       id: `level-${level}`,
//       level,
//       approvers: [],
//       status: true,
//       conditionEnabled: false,
//       condition: [],
//     }));

//   const fetchApprovers = async () => {
//     try {
//       const res = await userRequest.get(
//         "/imt/getApproversByImportTypeAndScope",
//         { params: { importTypeId, scopeId } }
//       );
//       setApprovers(res?.data?.data?.approvers || []);
//     } catch {
//       setApprovers([]);
//     }
//   };

//   const fetchHierarchyData = async () => {
//     try {
//       setLoading(true);

//       const res = await userRequest.get(
//         "/imt/getHierarchiesByImportTypeAndScope",
//         { params: { importTypeId, scopeId } }
//       );

//       const approvalType = res?.data?.data?.[0];
//       setApprovalTypeId(approvalType?._id || null);

//       const steps = approvalType?.steps || [];

//       const levels = createDefaultLevels().map((level) => {
//         const existing = steps.find((s) => s.level === level.level);
//         if (!existing) return level;

//         return {
//           ...level,
//           id: existing._id,
//           approvers: existing.approverId.map((a) => ({
//             _id: a._id,
//             email: a.user?.email,
//           })),
//           status: existing.status,
//           conditionEnabled: existing.isConditionMet || false,
//           condition: existing.conditions || [],
//         };
//       });

//       setHierarchyData(levels);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (importTypeId && scopeId) {
//       fetchApprovers();
//       fetchHierarchyData();
//     } else {
//       setHierarchyData(createDefaultLevels());
//     }
//   }, [importTypeId, scopeId]);

//   useEffect(() => {
//     if (companiesLoaded) fetchHierarchyData();
//   }, [companiesLoaded]);

//   useEffect(() => {
//     setEditingLevel(null);
//     setHasChanges(false);
//   }, [companyId]);

//   const updateField = (level, field, value) => {
//     setHierarchyData((prev) =>
//       prev.map((row) =>
//         row.level === level ? { ...row, [field]: value } : row
//       )
//     );
//     setHasChanges(true);
//   };

//   const handleStatusToggle = async (row) => {
//     try {
//       const newStatus = !row.status;

//       const confirm = await swal({
//         title: "Are you sure?",
//         text: `Do you want to ${
//           newStatus ? "activate" : "deactivate"
//         } Level ${row.level}?`,
//         icon: "warning",
//         buttons: true,
//         dangerMode: true,
//       });

//       if (!confirm) return;

//       await userRequest.put("/imt/updateHierarchyStepStatus", {
//         _id: approvalTypeId,
//         level: row.level,
//         status: newStatus,
//       });

//       fetchHierarchyData();
//       swal("Success", "Status updated successfully", "success");
//     } catch (e) {
//       showErrorMessage(e, "Status update failed", swal);
//     }
//   };

//   const handleConditionToggle = async (row) => {
//     try {
//       const newStatus = !row.conditionEnabled;

//       const confirm = await swal({
//         title: "Are you sure?",
//         text: `Do you want to ${
//           newStatus ? "enable" : "disable"
//         } condition for Level ${row.level}?`,
//         icon: "warning",
//         buttons: true,
//         dangerMode: true,
//       });

//       if (!confirm) return;

//       await userRequest.put("/imt/updateHierarchyStepIsConditionMet", {
//         _id: approvalTypeId,
//         level: row.level,
//         isConditionMet: newStatus,
//       });

//       fetchHierarchyData();
//       swal("Success", "Condition status updated", "success");
//     } catch (e) {
//       showErrorMessage(e, "Condition toggle failed", swal);
//     }
//   };

//   const handleSaveConditions = async (conditions) => {
//     try {
//       await userRequest.put("/imt/updateHierarchyStepConditions", {
//         _id: approvalTypeId,
//         level: selectedLevel.level,
//         conditions,
//       });

//       setConditionModalOpen(false);
//       fetchHierarchyData();
//     } catch (e) {
//       showErrorMessage(e, "Failed to save conditions", swal);
//     }
//   };

//   const handleUpdateApprovers = async () => {
//     try {
//       setLoading(true);

//       const currentLevel = hierarchyData.find(
//         (l) => l.level === editingLevel
//       );

//       await userRequest.put("/imt/updateHierarchyStepApproverId", {
//         _id: approvalTypeId,
//         level: currentLevel.level,
//         approverId: currentLevel.approvers.map((a) => a._id),
//       });

//       swal("Success", "Approvers updated successfully", "success");
//       setHasChanges(false);
//       setEditingLevel(null);
//       fetchHierarchyData();
//     } catch (e) {
//       showErrorMessage(e, "Approver update failed", swal);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <Box>
//       {loading ? (
//         <Fade in>
//           <Box
//             sx={{
//               display: "flex",
//               flexDirection: "column",
//               justifyContent: "center",
//               alignItems: "center",
//               height: "250px",
//               width: "100%",
//               gap: 2,
//             }}
//           >
//             <CircularProgress size={40} />
//             <Typography variant="body2" color="text.secondary">
//               Loading hierarchy data...
//             </Typography>
//           </Box>
//         </Fade>
//       ) : (
//         <Fade in>
//           <TableContainer component={Paper}>
//             <Table>
//               <TableHead>
//                 <TableRow>
//                   <TableCell align="center" sx={{ width: "120px" }}>
//                     Level
//                   </TableCell>
//                   <TableCell align="center" sx={{ width: "400px" }}>
//                     Approvers
//                   </TableCell>
//                   <TableCell align="center" sx={{ width: "120px" }}>
//                     Condition
//                   </TableCell>
//                   <TableCell align="center" sx={{ width: "300px" }}>
//                     Condition Details
//                   </TableCell>
//                   <TableCell align="center" sx={{ width: "180px" }}>
//                     Actions
//                   </TableCell>
//                 </TableRow>
//               </TableHead>

//               <TableBody>
//                 {hierarchyData.map((row) => (
//                   <TableRow key={row.level}>
//                     <TableCell align="center">
//                       <Typography variant="body1">{row.level}</Typography>
//                     </TableCell>

//                     <TableCell align="center">
//                       {editingLevel === row.level ? (
//                         <Box
//                           sx={{
//                             display: "flex",
//                             justifyContent: "center",
//                             width: "100%",
//                           }}
//                         >
//                           <Autocomplete
//                             multiple
//                             size="small"
//                             options={approvers}
//                             value={row.approvers}
//                             getOptionLabel={(o) => o.email}
//                             onChange={(_, v) =>
//                               updateField(row.level, "approvers", v)
//                             }
//                             renderInput={(params) => (
//                               <TextField
//                                 {...params}
//                                 placeholder="Select approvers..."
//                                 size="small"
//                               />
//                             )}
//                             sx={{ width: "70%" }}
//                           />
//                         </Box>
//                       ) : (
//                         <Box
//                           sx={{
//                             display: "flex",
//                             flexWrap: "wrap",
//                             gap: 1,
//                             justifyContent: "center",
//                           }}
//                         >
//                           {row.approvers.length ? (
//                             row.approvers.map((a) => (
//                               <Chip
//                                 key={a._id}
//                                 label={a.email}
//                                 size="small"
//                                 variant="outlined"
//                                 color="primary"
//                               />
//                             ))
//                           ) : (
//                             <Typography
//                               variant="body2"
//                               color="text.secondary"
//                             >
//                               No approvers assigned
//                             </Typography>
//                           )}
//                         </Box>
//                       )}
//                     </TableCell>

//                     <TableCell align="center">
//                       <Switch
//                         checked={row.conditionEnabled}
//                         onChange={() => handleConditionToggle(row)}
//                       />
//                     </TableCell>

//                     <TableCell align="center">
//                       {row.conditionEnabled && row.condition.length ? (
//                         <Box
//                           sx={{
//                             display: "flex",
//                             flexDirection: "column",
//                             gap: 0.5,
//                           }}
//                         >
//                           {row.condition.map((c, i) => (
//                             <Typography key={i} variant="body2">
//                               {c.field}{" "}
//                               {c.operator.replace("_", " ")} {c.value}
//                             </Typography>
//                           ))}
//                         </Box>
//                       ) : (
//                         <Typography
//                           variant="body2"
//                           color="text.secondary"
//                         >
//                           No Condition
//                         </Typography>
//                       )}
//                     </TableCell>

//                     <TableCell align="center">
//                       <Box
//                         sx={{
//                           display: "flex",
//                           alignItems: "center",
//                           justifyContent: "center",
//                           gap: 1,
//                         }}
//                       >
//                         {row.conditionEnabled && (
//                           <Tooltip title="Condition Settings">
//                             <IconButton
//                               size="small"
//                               sx={{
//                                 color: theme.palette.primary.main,
//                                 "&:hover": {
//                                   backgroundColor:
//                                     theme.palette.primary.lighter,
//                                 },
//                               }}
//                               onClick={() => {
//                                 setSelectedLevel(row);
//                                 setConditionModalOpen(true);
//                               }}
//                             >
//                               <Iconify icon="mdi:cog-outline" />
//                             </IconButton>
//                           </Tooltip>
//                         )}

//                         <Tooltip title="Edit Approvers">
//                           <IconButton
//                             size="small"
//                             onClick={() =>
//                               setEditingLevel(
//                                 editingLevel === row.level
//                                   ? null
//                                   : row.level
//                               )
//                             }
//                             sx={{
//                               color: theme.palette.primary.main,
//                               backgroundColor:
//                                 editingLevel === row.level
//                                   ? theme.palette.primary.lighter
//                                   : "transparent",
//                               "&:hover": {
//                                 backgroundColor:
//                                   theme.palette.primary.lighter,
//                               },
//                             }}
//                           >
//                             <Iconify icon="eva:edit-fill" />
//                           </IconButton>
//                         </Tooltip>

//                         <Tooltip
//                           title={
//                             row.status
//                               ? "Deactivate Level"
//                               : "Activate Level"
//                           }
//                         >
//                           <Switch
//                             checked={row.status}
//                             onChange={() => handleStatusToggle(row)}
//                           />
//                         </Tooltip>
//                       </Box>
//                     </TableCell>
//                   </TableRow>
//                 ))}
//               </TableBody>
//             </Table>
//           </TableContainer>
//         </Fade>
//       )}

//       {hasChanges && (
//         <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
//           <Button
//             variant="contained"
//             startIcon={<UpdateIcon />}
//             onClick={handleUpdateApprovers}
//             sx={{ minWidth: 150, py: 1.5 }}
//           >
//             Update Approvers
//           </Button>
//         </Box>
//       )}

//       {conditionModalOpen && selectedLevel && (
//         <ConditionModal
//           open={conditionModalOpen}
//           onClose={() => setConditionModalOpen(false)}
//           onSave={handleSaveConditions}
//           initialConditions={selectedLevel.condition}
//           levelNumber={selectedLevel.level}
//         />
//       )}
//     </Box>
//   );
// }


import React, { useState, useEffect } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Tooltip,
  Switch,
  Typography,
  TextField,
  Autocomplete,
  Button,
  CircularProgress,
  Fade,
} from "@mui/material";
import { Update as UpdateIcon } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import Iconify from "src/components/iconify";
import { userRequest } from "src/requestMethod";
import swal from "sweetalert";
import { showErrorMessage } from "src/utils/errorUtils";
import ConditionModal from "./conditionModal";

export default function HierarchyTable({
  companyId,
  importTypeId,
  scopeId,
  companiesLoaded = true,
}) {
  const theme = useTheme();

  const [hierarchyData, setHierarchyData] = useState([]);
  const [approvers, setApprovers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingLevel, setEditingLevel] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [approvalTypeId, setApprovalTypeId] = useState(null);

  const [conditionModalOpen, setConditionModalOpen] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState(null);

  const createDefaultLevels = () =>
    [1, 2, 3, 4, 5].map((level) => ({
      id: `level-${level}`,
      level,
      approvers: [],
      status: true,
      conditionEnabled: false,
      condition: [],
    }));

  const fetchApprovers = async () => {
    try {
      const res = await userRequest.get(
        "/imt/getApproversByImportTypeAndScope",
        { params: { importTypeId, scopeId } }
      );
      setApprovers(res?.data?.data?.approvers || []);
    } catch {
      setApprovers([]);
    }
  };

  const fetchHierarchyData = async () => {
    try {
      setLoading(true);

      const res = await userRequest.get(
        "/imt/getHierarchiesByImportTypeAndScope",
        { params: { importTypeId, scopeId } }
      );

      const approvalType = res?.data?.data?.[0];
      setApprovalTypeId(approvalType?._id || null);

      const steps = approvalType?.steps || [];

      const levels = createDefaultLevels().map((level) => {
        const existing = steps.find((s) => s.level === level.level);
        if (!existing) return level;

        return {
          ...level,
          id: existing._id,
          approvers: existing.approverId.map((a) => ({
            _id: a._id,
            email: a.user?.email,
            username: a.user?.username,
            userId: a.userId,
            userRoleId: a._id, // REQUIRED FOR MULTIPLE APPROVER UPDATE
          })),
          status: existing.status,
          conditionEnabled: existing.isConditionMet || false,
          condition: existing.conditions || [],
        };
      });

      setHierarchyData(levels);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (importTypeId && scopeId) {
      fetchApprovers();
      fetchHierarchyData();
    } else {
      setHierarchyData(createDefaultLevels());
    }
  }, [importTypeId, scopeId]);

  useEffect(() => {
    if (companiesLoaded) fetchHierarchyData();
  }, [companiesLoaded]);

  useEffect(() => {
    setEditingLevel(null);
    setHasChanges(false);
  }, [companyId]);

  const updateField = (level, field, value) => {
    setHierarchyData((prev) =>
      prev.map((row) =>
        row.level === level ? { ...row, [field]: value } : row
      )
    );
    setHasChanges(true);
  };

  const handleStatusToggle = async (row) => {
    try {
      const newStatus = !row.status;

      const confirm = await swal({
        title: "Are you sure?",
        text: `Do you want to ${
          newStatus ? "activate" : "deactivate"
        } Level ${row.level}?`,
        icon: "warning",
        buttons: true,
        dangerMode: true,
      });

      if (!confirm) return;

      await userRequest.put("/imt/updateHierarchyStepStatus", {
        _id: approvalTypeId,
        level: row.level,
        status: newStatus,
      });

      fetchHierarchyData();
      swal("Success", "Status updated successfully", "success");
    } catch (e) {
      showErrorMessage(e, "Status update failed", swal);
    }
  };

  const handleConditionToggle = async (row) => {
    try {
      const newStatus = !row.conditionEnabled;

      const confirm = await swal({
        title: "Are you sure?",
        text: `Do you want to ${
          newStatus ? "enable" : "disable"
        } condition for Level ${row.level}?`,
        icon: "warning",
        buttons: true,
        dangerMode: true,
      });

      if (!confirm) return;

      await userRequest.put("/imt/updateHierarchyStepIsConditionMet", {
        _id: approvalTypeId,
        level: row.level,
        isConditionMet: newStatus,
      });

      fetchHierarchyData();
      swal("Success", "Condition status updated", "success");
    } catch (e) {
      showErrorMessage(e, "Condition toggle failed", swal);
    }
  };

  const handleSaveConditions = async (conditions) => {
    try {
      await userRequest.put("/imt/updateHierarchyStepConditions", {
        _id: approvalTypeId,
        level: selectedLevel.level,
        conditions,
      });

      setConditionModalOpen(false);
      fetchHierarchyData();
    } catch (e) {
      showErrorMessage(e, "Failed to save conditions", swal);
    }
  };

  const handleUpdateApprovers = async () => {
    try {
      setLoading(true);

      const currentLevel = hierarchyData.find(
        (l) => l.level === editingLevel
      );

      await userRequest.put("/imt/updateHierarchyStepApproverId", {
        _id: approvalTypeId,
        level: currentLevel.level,
        approverId: currentLevel.approvers.map(
          (a) => a._id || a.userRoleId
        ),
      });

      swal("Success", "Approvers updated successfully", "success");
      setHasChanges(false);
      setEditingLevel(null);
      fetchHierarchyData();
    } catch (e) {
      showErrorMessage(e, "Approver update failed", swal);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      {loading ? (
        <Fade in>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              height: "250px",
              width: "100%",
              gap: 2,
            }}
          >
            <CircularProgress size={40} />
            <Typography variant="body2" color="text.secondary">
              Loading hierarchy data...
            </Typography>
          </Box>
        </Fade>
      ) : (
        <Fade in>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="center" sx={{ width: "120px" }}>
                    Level
                  </TableCell>
                  <TableCell align="center" sx={{ width: "400px" }}>
                    Approvers
                  </TableCell>
                  <TableCell align="center" sx={{ width: "120px" }}>
                    Condition
                  </TableCell>
                  <TableCell align="center" sx={{ width: "300px" }}>
                    Condition Details
                  </TableCell>
                  <TableCell align="center" sx={{ width: "180px" }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {hierarchyData.map((row) => (
                  <TableRow key={row.level}>
                    <TableCell align="center">
                      <Typography variant="body1">{row.level}</Typography>
                    </TableCell>

                    <TableCell align="center">
                      {editingLevel === row.level ? (
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            width: "100%",
                          }}
                        >
                          <Autocomplete
                            multiple
                            size="small"
                            options={approvers}
                            value={row.approvers}
                            getOptionLabel={(o) =>
                              `${o.username || ""} (${o.email})`
                            }
                            onChange={(_, v) =>
                              updateField(row.level, "approvers", v)
                            }
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                placeholder="Select approvers..."
                                size="small"
                              />
                            )}
                            sx={{ width: "70%" }}
                          />
                        </Box>
                      ) : (
                        <Box
                          sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 1,
                            justifyContent: "center",
                          }}
                        >
                          {row.approvers.length ? (
                            row.approvers.map((a) => (
                              <Chip
                                key={a._id}
                                label={a.email}
                                size="small"
                                variant="outlined"
                                color="primary"
                              />
                            ))
                          ) : (
                            <Typography
                              variant="body2"
                              color="text.secondary"
                            >
                              No approvers assigned
                            </Typography>
                          )}
                        </Box>
                      )}
                    </TableCell>

                    <TableCell align="center">
                      <Switch
                        checked={row.conditionEnabled}
                        onChange={() => handleConditionToggle(row)}
                      />
                    </TableCell>

                    <TableCell align="center">
                      {row.conditionEnabled && row.condition.length ? (
                        <Box
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            gap: 0.5,
                          }}
                        >
                          {row.condition.map((c, i) => (
                            <Typography key={i} variant="body2">
                              {c.field}{" "}
                              {c.operator.replace("_", " ")} {c.value}
                            </Typography>
                          ))}
                        </Box>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          No Condition
                        </Typography>
                      )}
                    </TableCell>

                    <TableCell align="center">
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 1,
                        }}
                      >
                        {row.conditionEnabled && (
                          <Tooltip title="Condition Settings">
                            <IconButton
                              size="small"
                              sx={{
                                color: theme.palette.primary.main,
                                "&:hover": {
                                  backgroundColor:
                                    theme.palette.primary.lighter,
                                },
                              }}
                              onClick={() => {
                                setSelectedLevel(row);
                                setConditionModalOpen(true);
                              }}
                            >
                              <Iconify icon="mdi:cog-outline" />
                            </IconButton>
                          </Tooltip>
                        )}

                        <Tooltip title="Edit Approvers">
                          <IconButton
                            size="small"
                            onClick={() =>
                              setEditingLevel(
                                editingLevel === row.level
                                  ? null
                                  : row.level
                              )
                            }
                            sx={{
                              color: theme.palette.primary.main,
                              backgroundColor:
                                editingLevel === row.level
                                  ? theme.palette.primary.lighter
                                  : "transparent",
                              "&:hover": {
                                backgroundColor:
                                  theme.palette.primary.lighter,
                              },
                            }}
                          >
                            <Iconify icon="eva:edit-fill" />
                          </IconButton>
                        </Tooltip>

                        <Tooltip
                          title={
                            row.status
                              ? "Deactivate Level"
                              : "Activate Level"
                          }
                        >
                          <Switch
                            checked={row.status}
                            onChange={() => handleStatusToggle(row)}
                          />
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Fade>
      )}

      {hasChanges && (
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
          <Button
            variant="contained"
            startIcon={<UpdateIcon />}
            onClick={handleUpdateApprovers}
            sx={{ minWidth: 150, py: 1.5 }}
          >
            Update 
          </Button>
        </Box>
      )}

      {conditionModalOpen && selectedLevel && (
        <ConditionModal
          open={conditionModalOpen}
          onClose={() => setConditionModalOpen(false)}
          onSave={handleSaveConditions}
          initialConditions={selectedLevel.condition}
          levelNumber={selectedLevel.level}
        />
      )}
    </Box>
  );
}

