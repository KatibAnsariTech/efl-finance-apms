// import React, { useEffect, useRef, useState } from "react";
// import {
//   Box,
//   Stack,
//   Button,
//   TextField,
//   Typography,
//   CircularProgress,
// } from "@mui/material";
// import { useForm, Controller } from "react-hook-form";
// import { userRequest } from "src/requestMethod";
// import swal from "sweetalert";

// const ReportAction = ({ requestNo, onActionComplete ,requireUploadForLevel6=false}) => {
//   const [approveLoading, setApproveLoading] = useState(false);
//   const [rejectLoading, setRejectLoading] = useState(false);
//   const [uploadedFile, setUploadedFile] = useState(null);
//   const fileInputRef = useRef(null);
//   const [uploadedFileData, setUploadedFileData] = useState(null);
//   const [uploadLoading, setUploadLoading] = useState(false);

//   const {
//     control,
//     handleSubmit,
//     formState: { errors },
//     reset,
//     watch,
//   } = useForm({
//     defaultValues: {
//       comment: "",
//     },
//   });

//   const commentValue = watch("comment");

//   const handleUploadFile = async () => {
//   if (!uploadedFile) {
//     swal("No File", "Please select a file first", "warning");
//     return;
//   }

//   try {
//     setUploadLoading(true);

//     const formData = new FormData();
//     formData.append("file", uploadedFile);

//     const response = await userRequest.post(
//       "/imt/upload",
//       formData,
//       { headers: { "Content-Type": "multipart/form-data" } }
//     );

//     if (response.data?.success) {
//       swal("Uploaded", "File uploaded successfully", "success");
//       setUploadedFileData(response.data);
//     } else {
//       throw new Error(response.data?.message || "Upload failed");
//     }
//   } catch (error) {
//     swal(
//       "Upload Failed",
//       error.response?.data?.message || error.message,
//       "error"
//     );
//   } finally {
//     setUploadLoading(false);
//   }
// };



//   const handleFileChange = (event) => {
//   const file = event.target.files?.[0];
//   if (file) {
//     setUploadedFile(file);
//   }
// };

//   const handleUploadClick = () => {
//     fileInputRef.current?.click();
//   };

//   useEffect(()=>{
//     if(uploadedFile){

//     }

//   },[uploadedFile])

//   const handleApprovalAction = async (action) => {
//     try {
//       if (requireUploadForLevel6 && !uploadedFile && action === "approved") {
//         swal("Upload Required", "Please upload a document before approving.", "warning");
//         return;
//       }

//       if (action === "approved") {
//         setApproveLoading(true);
//       } else {
//         setRejectLoading(true);
//       }

//       const requestData = {
//         requestNo: requestNo,
//         comment: commentValue || "No comment provided",
//       };

//       let response;
//       if (action === "approved") {
//         response = await userRequest.post(
//           `/imt/acceptForm`,
//           requestData
//         );
//       } else {
//         response = await userRequest.post(
//           `/imt/declineForm`,
//           requestData
//         );
//       }

//       if (response.data?.success) {
//         swal("Success", `Request ${action} successfully!`, "success");
//         reset();
//         setUploadedFile(null);
//         if (onActionComplete) {
//           onActionComplete(action);
//         }
//       } else {
//         throw new Error(
//           response.data?.message || `Failed to ${action} request`
//         );
//       }
//     } catch (error) {
//       console.error(`Error ${action} request:`, error);
//       const errorMessage =
//         error.response?.data?.message ||
//         error.message ||
//         `Failed to ${action} request`;
//       swal("Error", errorMessage, "error");
//     } finally {
//       setApproveLoading(false);
//       setRejectLoading(false);
//     }
//   };

//   return (
//     <Box sx={{ mt: 3, p: 2, backgroundColor: "#f8f9fa", borderRadius: 1 }}>
//       <Stack direction="row" justifyContent="space-between" alignItems="center">
//         <Box sx={{ pl: 0 }}>
//           <Typography variant="h5">Action</Typography>
//           <Box
//             sx={{
//               height: 2,
//               width: "100%",
//               background: "#12368d",
//               borderRadius: 1,
//               mb: 2,
//             }}
//           />
//         </Box>

//         <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
//           {requireUploadForLevel6 && (
//             <>
//               <input
//                 ref={fileInputRef}
//                 type="file"
//                 hidden
//                 onChange={handleFileChange}
//               />
//               <Button
//                 variant="outlined"
//                 color="primary"
//                 onClick={handleUploadFile}
//                 disabled={uploadLoading || approveLoading || rejectLoading}
//               >
//                 {uploadLoading ? "Uploading..." : uploadedFile ? "Upload Selected File" : "Choose File"}
//               </Button>
//              {uploadedFile && (
//               <Typography variant="body2">
//                 Selected: {uploadedFile.name}
//               </Typography>
//             )}
//             </>
//           )}
//           <Button
//             variant="contained"
//             color="success"
//             onClick={handleSubmit(() => handleApprovalAction("approved"))}
//             disabled={
//               approveLoading ||
//               rejectLoading ||
//               (requireUploadForLevel6 && !uploadedFile)
//             }
//             startIcon={approveLoading ? <CircularProgress size={20} /> : null}
//             sx={{ minWidth: 120 }}
//           >
//             {approveLoading ? "Processing..." : "Approved"}
//           </Button>
//           <Button
//             variant="contained"
//             color="error"
//             onClick={handleSubmit(() => handleApprovalAction("rejected"))}
//             disabled={approveLoading || rejectLoading}
//             startIcon={rejectLoading ? <CircularProgress size={20} /> : null}
//             sx={{ minWidth: 120 }}
//           >
//             {rejectLoading ? "Processing..." : "Rejected"}
//           </Button>
//         </Stack>
//       </Stack>

//       <Typography variant="body2" sx={{ mb: 2, color: "#666" }}>
//         Leave a comment with your response{" "}
//         <span style={{ color: "red" }}>*</span>
//       </Typography>

//       <Controller
//         name="comment"
//         control={control}
//         rules={{
//           required: "Comment is required",
//           minLength: {
//             value: 3,
//             message: "Comment must be at least 3 characters",
//           },
//         }}
//         render={({ field }) => (
//           <TextField
//             {...field}
//             fullWidth
//             multiline
//             rows={3}
//             placeholder="Enter your comment..."
//             sx={{ mb: 2, backgroundColor: "#fff" }}
//             error={!!errors.comment}
//             helperText={errors.comment?.message}
//           />
//         )}
//       />
//     </Box>
//   );
// };

// export default ReportAction;

// import React, { useEffect, useRef, useState } from "react";
// import {
//   Box,
//   Stack,
//   Button,
//   TextField,
//   Typography,
//   CircularProgress,
// } from "@mui/material";
// import { useForm, Controller } from "react-hook-form";
// import { userRequest } from "src/requestMethod";
// import swal from "sweetalert";

// const ReportAction = ({
//   requestNo,
//   requestId,
//   onActionComplete,
//   requireUploadForLevel6 = false,
// }) => {
//   const fileInputRef = useRef(null);

//   const [approveLoading, setApproveLoading] = useState(false);
//   const [rejectLoading, setRejectLoading] = useState(false);
//   const [uploadLoading, setUploadLoading] = useState(false);

//   const [selectedFile, setSelectedFile] = useState(null);
//   const [uploadedFileData, setUploadedFileData] = useState(null); // success flag

//   const {
//     control,
//     handleSubmit,
//     watch,
//     reset,
//     formState: { errors },
//   } = useForm({
//     defaultValues: { comment: "" },
//   });

//   const commentValue = watch("comment");

//   /* ================= FILE HANDLERS ================= */

//   const handleChooseFile = () => {
//     fileInputRef.current?.click();
//   };

//   const handleFileChange = (e) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       setSelectedFile(file);
//       setUploadedFileData(null); // reset upload status if file changes
//     }
//   };

//   const handleUploadFile = async () => {
//     if (!selectedFile) {
//       swal("No File", "Please select a file first", "warning");
//       return;
//     }

//     try {
//       setUploadLoading(true);

//       const formData = new FormData();
//       formData.append("file", selectedFile);

//       const response = await userRequest.post(
//         "/util/upload",
//         formData,
//         { headers: { "Content-Type": "multipart/form-data" } }
//       );

//       if (response.data?.success) {
//         swal("Uploaded", "File uploaded successfully", "success");
//         setUploadedFileData(response.data.data); // mark upload success
//       } else {
//         throw new Error(response.data?.message || "Upload failed");
//       }
//     } catch (error) {
//       swal(
//         "Upload Failed",
//         error.response?.data?.message || error.message,
//         "error"
//       );
//     } finally {
//       setUploadLoading(false);
//     }
//   };


//   /* ================= UPDATE REQUEST WITH FILE ================= */

//   useEffect(() => {
//     if (!uploadedFileData || !requestId) return;

//     const updateDocument = async () => {
//       try {
//         await userRequest.put(
//           `/imt/updateForm/${requestId}`,
//           { outputDocument: uploadedFileData }
//         );
//       } catch (error) {
//         swal(
//           "Update Failed",
//           error.response?.data?.message || error.message,
//           "error"
//         );
//       }
//     };

//     updateDocument();
//   }, [uploadedFileData, requestId]);

//   /* ================= APPROVAL HANDLERS ================= */

//   const handleApprovalAction = async (action) => {
//     try {
//       if (
//         requireUploadForLevel6 &&
//         action === "approved" &&
//         !uploadedFileData
//       ) {
//         swal(
//           "Upload Required",
//           "Please upload the document before approving.",
//           "warning"
//         );
//         return;
//       }

//       action === "approved"
//         ? setApproveLoading(true)
//         : setRejectLoading(true);

//       const payload = {
//         requestNo,
//         comment: commentValue || "No comment provided",
//         uploadedFile: uploadedFileData || null, // optional
//       };

//       const api =
//         action === "approved" ? "/imt/acceptForm" : "/imt/declineForm";

//       const response = await userRequest.post(api, payload);

//       if (response.data?.success) {
//         swal("Success", `Request ${action} successfully!`, "success");
//         reset();
//         setSelectedFile(null);
//         setUploadedFileData(null);
//         onActionComplete?.(action);
//       } else {
//         throw new Error(response.data?.message);
//       }
//     } catch (error) {
//       swal(
//         "Error",
//         error.response?.data?.message || error.message,
//         "error"
//       );
//     } finally {
//       setApproveLoading(false);
//       setRejectLoading(false);
//     }
//   };

//   /* ================= UI ================= */

//   return (
//     <Box sx={{ mt: 3, p: 2, bgcolor: "#f8f9fa", borderRadius: 1 }}>
//       <Stack direction="row" justifyContent="space-between">
//         <Typography variant="h5">Action</Typography>

//         <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
//           {requireUploadForLevel6 && (
//             <>
//               <input
//                 ref={fileInputRef}
//                 type="file"
//                 hidden
//                 onChange={handleFileChange}
//               />

//               <Button
//                 variant="outlined"
//                 onClick={handleChooseFile}
//                 disabled={uploadLoading}
//               >
//                 Choose File
//               </Button>

//               <Button
//                 variant="contained"
//                 color="primary"
//                 onClick={handleUploadFile}
//                 disabled={!selectedFile || uploadLoading}
//               >
//                 {uploadLoading ? "Uploading..." : "Upload File"}
//               </Button>
//               {uploadedFileData && (
//                 <Typography variant="body2" color="green">
//                   ✔ Uploaded
//                 </Typography>
//               )}
//             </>
//           )}

//           <Button
//             variant="contained"
//             color="success"
//             disabled={
//               approveLoading ||
//               rejectLoading ||
//               (requireUploadForLevel6 && !uploadedFileData)
//             }
//             onClick={handleSubmit(() =>
//               handleApprovalAction("approved")
//             )}
//             startIcon={approveLoading && <CircularProgress size={20} />}
//           >
//             {approveLoading ? "Processing..." : "Approve"}
//           </Button>

//           <Button
//             variant="contained"
//             color="error"
//             disabled={approveLoading || rejectLoading}
//             onClick={handleSubmit(() =>
//               handleApprovalAction("rejected")
//             )}
//             startIcon={rejectLoading && <CircularProgress size={20} />}
//           >
//             {rejectLoading ? "Processing..." : "Reject"}
//           </Button>
//         </Stack>
//       </Stack>

//       <Typography sx={{ mt: 2 }}>
//         Leave a comment <span style={{ color: "red" }}>*</span>
//       </Typography>

//       <Controller
//         name="comment"
//         control={control}
//         rules={{ required: "Comment is required" }}
//         render={({ field }) => (
//           <TextField
//             {...field}
//             fullWidth
//             multiline
//             rows={3}
//             error={!!errors.comment}
//             helperText={errors.comment?.message}
//             sx={{ mt: 1, bgcolor: "#fff" }}
//           />
//         )}
//       />
//     </Box>
//   );
// };

// export default ReportAction;

import React, { useEffect, useRef, useState } from "react";
import {
  Box,
  Stack,
  Button,
  TextField,
  Typography,
  CircularProgress,
} from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { userRequest } from "src/requestMethod";
import swal from "sweetalert";

const ReportAction = ({
  requestNo,
  requestId,
  onActionComplete,
  requireUploadForLevel6 = false,
}) => {
  const fileInputRef = useRef(null);

  const [approveLoading, setApproveLoading] = useState(false);
  const [rejectLoading, setRejectLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);

  const [uploadedFileData, setUploadedFileData] = useState(null);

  const {
    control,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: { comment: "" },
  });

  const commentValue = watch("comment");

  /* ================= SINGLE BUTTON UPLOAD ================= */

  const handleUploadButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChangeAndUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadLoading(true);
      setUploadedFileData(null);

      const formData = new FormData();
      formData.append("file", file);

      const response = await userRequest.post(
        "/util/upload",
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      if (response.data?.success) {
        swal("Uploaded", "File uploaded successfully", "success");
        setUploadedFileData(response.data.data);
      } else {
        throw new Error(response.data?.message || "Upload failed");
      }
    } catch (error) {
      swal(
        "Upload Failed",
        error.response?.data?.message || error.message,
        "error"
      );
    } finally {
      setUploadLoading(false);
      e.target.value = ""; // reset input
    }
  };

  /* ================= UPDATE FORM WITH FILE ================= */

  useEffect(() => {
    if (!uploadedFileData || !requestId) return;

    userRequest.put(`/imt/updateForm/${requestId}`, {
      outputDocument: uploadedFileData,
    }).catch((error) => {
      swal(
        "Update Failed",
        error.response?.data?.message || error.message,
        "error"
      );
    });
  }, [uploadedFileData, requestId]);

  /* ================= APPROVAL ================= */

  const handleApprovalAction = async (action) => {
    try {
      if (
        requireUploadForLevel6 &&
        action === "approved" &&
        !uploadedFileData
      ) {
        swal(
          "Upload Required",
          "Please upload the document before approving.",
          "warning"
        );
        return;
      }

      action === "approved"
        ? setApproveLoading(true)
        : setRejectLoading(true);

      const payload = {
        requestNo,
        comment: commentValue || "No comment provided",
        uploadedFile: uploadedFileData || null,
      };

      const api =
        action === "approved" ? "/imt/acceptForm" : "/imt/declineForm";

      const response = await userRequest.post(api, payload);

      if (response.data?.success) {
        swal("Success", `Request ${action} successfully!`, "success");
        reset();
        setUploadedFileData(null);
        onActionComplete?.(action);
      } else {
        throw new Error(response.data?.message);
      }
    } catch (error) {
      swal(
        "Error",
        error.response?.data?.message || error.message,
        "error"
      );
    } finally {
      setApproveLoading(false);
      setRejectLoading(false);
    }
  };

  /* ================= UI ================= */

  return (
    <Box sx={{ mt: 3, p: 2, bgcolor: "#f8f9fa", borderRadius: 1 }}>
      <Stack direction="row" justifyContent="space-between">
        <Typography variant="h5">Action</Typography>

        <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
          {requireUploadForLevel6 && (
            <>
              <input
                ref={fileInputRef}
                type="file"
                hidden
                onChange={handleFileChangeAndUpload}
              />

              <Button
                variant="contained"
                onClick={handleUploadButtonClick}
                disabled={uploadLoading}
              >
                {uploadLoading ? "Uploading..." : "Upload File"}
              </Button>

              {uploadedFileData && (
                <Typography variant="body2" color="green">
                  ✔ Uploaded
                </Typography>
              )}
            </>
          )}

          <Button
            variant="contained"
            color="success"
            disabled={
              approveLoading ||
              rejectLoading ||
              (requireUploadForLevel6 && !uploadedFileData)
            }
            onClick={handleSubmit(() =>
              handleApprovalAction("approved")
            )}
            startIcon={approveLoading && <CircularProgress size={20} />}
          >
            {approveLoading ? "Processing..." : "Approve"}
          </Button>

          <Button
            variant="contained"
            color="error"
            disabled={approveLoading || rejectLoading}
            onClick={handleSubmit(() =>
              handleApprovalAction("rejected")
            )}
            startIcon={rejectLoading && <CircularProgress size={20} />}
          >
            {rejectLoading ? "Processing..." : "Reject"}
          </Button>
        </Stack>
      </Stack>

      <Typography sx={{ mt: 2 }}>
        Leave a comment <span style={{ color: "red" }}>*</span>
      </Typography>

      <Controller
        name="comment"
        control={control}
        rules={{ required: "Comment is required" }}
        render={({ field }) => (
          <TextField
            {...field}
            fullWidth
            multiline
            rows={3}
            error={!!errors.comment}
            helperText={errors.comment?.message}
            sx={{ mt: 1, bgcolor: "#fff" }}
          />
        )}
      />
    </Box>
  );
};

export default ReportAction;

