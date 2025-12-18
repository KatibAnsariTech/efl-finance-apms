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
  requireUploadForLevel6,
}) => {
  const fileInputRef = useRef(null);

  const [approveLoading, setApproveLoading] = useState(false);
  const [rejectLoading, setRejectLoading] = useState(false);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [outPutDoc,setOutPutDoc] = useState(false);
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

  useEffect(() => {
    if (requireUploadForLevel6 === '' || requireUploadForLevel6 === undefined) {
      setOutPutDoc(true);
    } else {
      setOutPutDoc(false);
    }
  }, [requireUploadForLevel6]);

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

  // useEffect(() => {
  //   if (!uploadedFileData || !requestId) return;

  //   userRequest.put(`/imt/updateForm/${requestId}`, {
  //     outputDocument: uploadedFileData,
  //   }).catch((error) => {
  //     swal(
  //       "Update Failed",
  //       error.response?.data?.message || error.message,
  //       "error"
  //     );
  //   });
  // }, [uploadedFileData, requestId]);

    const callUpdateForm = async () => {
    if (!uploadedFileData || !requestId) return;

    try {
      await userRequest.put(`/imt/updateForm/${requestId}`, {
        outputDocument: uploadedFileData,
      });
    } catch (error) {
      swal(
        "Update Failed",
        error.response?.data?.message || error.message,
        "error"
      );
      throw error; // stop approval if update fails
    }
    };

  /* ================= APPROVAL ================= */

  // const handleApprovalAction = async (action) => {
  //   try {
  //     if (
  //       outPutDoc &&
  //       action === "approved" &&
  //       !uploadedFileData
  //     ) {
  //       swal(
  //         "Upload Required",
  //         "Please upload the document before approving.",
  //         "warning"
  //       );
  //       return;
  //     }

  //     action === "approved"
  //       ? setApproveLoading(true)
  //       : setRejectLoading(true);

  //     const payload = {
  //       requestNo,
  //       comment: commentValue || "No comment provided",
  //       uploadedFile: uploadedFileData || null,
  //     };

  //     const api =
  //       action === "approved" ? "/imt/acceptForm" : "/imt/declineForm";

  //     const response = await userRequest.post(api, payload);

  //     if (response.data?.success) {
  //       swal("Success", `Request ${action} successfully!`, "success");
  //       reset();
  //       setUploadedFileData(null);
  //       onActionComplete?.(action);
  //     } else {
  //       throw new Error(response.data?.message);
  //     }
  //   } catch (error) {
  //     swal(
  //       "Error",
  //       error.response?.data?.message || error.message,
  //       "error"
  //     );
  //   } finally {
  //     setApproveLoading(false);
  //     setRejectLoading(false);
  //   }
  // };

  const handleApprovalAction = async (action) => {
  try {
    if (outPutDoc && action === "approved" && !uploadedFileData) {
      swal(
        "Upload Required",
        "Please upload the document before approving.",
        "warning"
      );
      return;
    }

    setApproveLoading(true);

    // ✅ CALL UPDATE FORM FIRST
    if (uploadedFileData) {
      await callUpdateForm();
      swal("Success", "Request approved successfully!", "success");
    }

    // const payload = {
    //   requestNo,
    //   comment: "No comment provided",
    //   uploadedFile: uploadedFileData,
    // };

    // const response = await userRequest.post("/imt/acceptForm", payload);

    // if (response.data?.success) {
    //   swal("Success", "Request approved successfully!", "success");
    //   reset();
    //   setUploadedFileData(null);
    //   onActionComplete?.("approved");
    // } else {
    //   throw new Error(response.data?.message);
    // }
  } catch (error) {
    swal(
      "Error",
      error.response?.data?.message || error.message,
      "error"
    );
  } finally {
    setApproveLoading(false);
  }
};


  /* ================= UI ================= */

  return (
    <Box sx={{ mt: 3, p: 2, bgcolor: "#f8f9fa", borderRadius: 1 }}>
      {outPutDoc && (
        <>
        <Stack direction="row" justifyContent="space-between">
        <Typography variant="h5">Action</Typography>

        <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
          
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
          
        <Button
          variant="contained"
          color="success"
          disabled={
            approveLoading ||
            rejectLoading ||
            (outPutDoc && !uploadedFileData)
          }
          onClick={handleSubmit(() =>
            handleApprovalAction("approved")
          )}
          startIcon={approveLoading && <CircularProgress size={20} />}
        >
          {approveLoading ? "Processing..." : "Submit"}
        </Button>

        {/* <Button
          variant="contained"
          color="error"
          disabled={approveLoading || rejectLoading}
          onClick={handleSubmit(() =>
            handleApprovalAction("rejected")
          )}
          startIcon={rejectLoading && <CircularProgress size={20} />}
        >
          {rejectLoading ? "Processing..." : "Reject"}
        </Button> */}
        </Stack>
      </Stack>

      {/* <Typography sx={{ mt: 2 }}>
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
      /> */}
        </>
          )}
    </Box>
  );
};

export default ReportAction;

