import React, { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import { RxCross2 } from "react-icons/rx";
import swal from "sweetalert";
import { userRequest } from "src/requestMethod";
import { showErrorMessage } from "src/utils/errorUtils";

function AddEditApprovalAuthority({ handleClose, open, editData: authorityData, getData, selectedDepartment }) {
  const { register, handleSubmit, reset, setValue, control } = useForm();
  const [loading, setLoading] = useState(false);
  const [approverCategories, setApproverCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(false);

  // Fetch approver categories
  useEffect(() => {
    const fetchApproverCategories = async () => {
      setCategoriesLoading(true);
      try {
        const response = await userRequest.get("/cpx/getApproverPositions", {
          params: {
            page: 1,
            limit: 100,
          },
        });

        const categories = response.data.data.items || response.data.data.approverCategories || [];
        // Sort categories by ranking - lowest number will be shown last (descending order)
        const sortedCategories = [...categories].sort((a, b) => {
          const rankingA = typeof a.ranking === 'number' ? a.ranking : (parseInt(a.ranking) || 0);
          const rankingB = typeof b.ranking === 'number' ? b.ranking : (parseInt(b.ranking) || 0);
          return rankingB - rankingA; // Descending order (highest first, lowest last)
        });
        setApproverCategories(sortedCategories);
      } catch (error) {
        console.error("Error fetching Approver Categories:", error);
        showErrorMessage(error, "Error fetching Approver Categories", swal);
        setApproverCategories([]);
      } finally {
        setCategoriesLoading(false);
      }
    };

    if (open) {
      fetchApproverCategories();
    }
  }, [open]);

  useEffect(() => {
    if (authorityData && approverCategories.length > 0 && !categoriesLoading) {
      setValue("limitFrom", authorityData.limitFrom || authorityData.valueFrom || 0);
      setValue("limitTo", authorityData.limitTo || authorityData.valueTo || "");
      
      // Initialize all checkboxes to false first
      approverCategories.forEach((category) => {
        setValue(`approver_${category._id}`, false);
      });
      
      // Map approvers to form fields
      if (authorityData.approvers && Array.isArray(authorityData.approvers)) {
        authorityData.approvers.forEach((approver) => {
          const categoryId = approver.approverPosition?._id || approver.approverPosition || approver.approverCategory?._id || approver.approverCategory;
          if (categoryId) {
            setValue(`approver_${categoryId}`, approver.willApprove === true);
          }
        });
      }
    } else if (!authorityData) {
      // Reset form when not editing
      reset();
      // Initialize all checkboxes to false for new entries
      if (approverCategories.length > 0) {
        approverCategories.forEach((category) => {
          setValue(`approver_${category._id}`, false);
        });
      }
    }
  }, [authorityData, approverCategories, categoriesLoading, setValue, reset]);

  const handleSaveData = async (data) => {
    setLoading(true);
    try {
      // Build approvers array from form data
      const approvers = approverCategories.map((category) => {
        const categoryId = category._id;
        const willApprove = data[`approver_${categoryId}`] || false;
        
        return {
          approverPosition: categoryId,
          willApprove: willApprove,
        };
      });

      // Use selectedDepartment from props, or from editData if editing
      const departmentId = authorityData?.department?._id || authorityData?.department || selectedDepartment?._id || selectedDepartment || "";
      
      const formattedData = {
        department: departmentId,
        limitFrom: parseInt(data.limitFrom) || 0,
        limitTo: data.limitTo ? parseInt(data.limitTo) : null,
        approvers: approvers,
      };
      
      if (authorityData?._id) {
        await userRequest.put(`/cpx/updateApproverAuthority/${authorityData._id}`, formattedData);
        getData();
        swal("Updated!", "Approval Authority updated successfully!", "success");
      } else {
        await userRequest.post("/cpx/createApproverAuthority", formattedData);
        getData();
        swal("Success!", "Approval Authority saved successfully!", "success");
      }

      reset();
      handleClose();
    } catch (error) {
      console.error("Error saving data:", error);
      showErrorMessage(error, "Error saving data. Please try again later.", swal);
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
          display: "flex",
          flexDirection: "column",
          maxHeight: "90vh",
          overflow: "hidden",
        }}
      >
        <Box sx={{ p: 4, pb: 2, flexShrink: 0 }}>
          <Typography
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span style={{ fontSize: "24px", fontWeight: "bolder" }}>
              {authorityData ? "Edit Approval Authority" : "Add Approval Authority"}
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
        </Box>

        <Box
          component="form"
          onSubmit={handleSubmit(handleSaveData)}
          sx={{
            display: "flex",
            flexDirection: "column",
            flex: 1,
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 0,
              px: 4,
              flex: 1,
              overflow: "auto",
            }}
          >
            <Typography variant="subtitle1" sx={{ mb: 0.5, mt: 0, fontWeight: 600, fontSize: "0.95rem" }}>
              Project Value Range (INR)
            </Typography>
            <Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 1 }}>
              <TextField
                id="limitFrom"
                label="From Amount"
                {...register("limitFrom", { required: true })}
                type="number"
                fullWidth
                required
                disabled={loading || categoriesLoading}
                helperText="Enter minimum project value"
                InputLabelProps={{
                  shrink: true,
                }}
                sx={{ 
                  flex: 1,
                  "& .MuiInputBase-input": { fontSize: "0.875rem" },
                  "& .MuiInputLabel-root": { fontSize: "0.875rem" },
                  "& .MuiFormHelperText-root": { fontSize: "0.75rem" }
                }}
              />
              <Typography variant="body2" sx={{ color: "text.secondary", fontSize: "0.875rem" }}>
                to
              </Typography>
              <TextField
                id="limitTo"
                label="To Amount (Optional)"
                {...register("limitTo")}
                type="number"
                fullWidth
                disabled={loading || categoriesLoading}
                helperText="Leave empty for 'and above'"
                InputLabelProps={{
                  shrink: true,
                }}
                sx={{ 
                  flex: 1,
                  "& .MuiInputBase-input": { fontSize: "0.875rem" },
                  "& .MuiInputLabel-root": { fontSize: "0.875rem" },
                  "& .MuiFormHelperText-root": { fontSize: "0.75rem" }
                }}
              />
            </Box>

            <Typography variant="subtitle1" sx={{ mt: 2, mb: 0.5, fontWeight: 600, fontSize: "0.95rem" }}>
              Required Approvals
            </Typography>
            {categoriesLoading ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 3 }}>
                <CircularProgress size={24} />
              </Box>
            ) : (
              <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 0 }}>
                {approverCategories.map((category) => {
                  const categoryId = category._id;
                  const majorPosition = category.majorPosition?.name || (typeof category.majorPosition === 'string' ? category.majorPosition : category.management || "");
                  const fullLabel = majorPosition || "Unknown";
                  
                  return (
                    <FormControlLabel
                      key={categoryId}
                      control={
                        <Controller
                          name={`approver_${categoryId}`}
                          control={control}
                          defaultValue={false}
                          render={({ field }) => (
                            <Checkbox
                              {...field}
                              checked={field.value || false}
                              color="primary"
                              disabled={loading || categoriesLoading}
                              sx={{ "& .MuiSvgIcon-root": { fontSize: 20 } }}
                            />
                          )}
                        />
                      }
                      label={
                        <Typography variant="body2" sx={{ fontWeight: 600, fontSize: "0.875rem" }}>
                          {fullLabel}
                        </Typography>
                      }
                    />
                  );
                })}
              </Box>
            )}
          </Box>

          <Box sx={{ px: 4, pt: 2.5, pb: 4, flexShrink: 0 }}>
            <Button
              sx={{ width: "100%", height: "50px" }}
              variant="contained"
              color="primary"
              type="submit"
              disabled={loading || categoriesLoading}
              startIcon={
                loading && <CircularProgress size={20} color="inherit" />
              }
            >
              {loading
                ? authorityData
                  ? "Updating..."
                  : "Saving..."
                : authorityData
                ? "Update"
                : "Save"}
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  );
}

export default AddEditApprovalAuthority;
