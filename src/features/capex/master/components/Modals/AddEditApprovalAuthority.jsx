import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
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

function AddEditApprovalAuthority({ handleClose, open, editData: authorityData, getData }) {
  const { register, handleSubmit, reset, setValue } = useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (authorityData) {
      setValue("valueFrom", authorityData.valueFrom || 0);
      setValue("valueTo", authorityData.valueTo || "");
      setValue("functionalSpoc", authorityData.functionalSpoc || false);
      setValue("exCom", authorityData.exCom || false);
      setValue("headOfFinanceOps", authorityData.headOfFinanceOps || false);
      setValue("financeController", authorityData.financeController || false);
      setValue("cfo", authorityData.cfo || false);
      setValue("ceoMd", authorityData.ceoMd || false);
    } else {
      reset();
    }
  }, [authorityData, setValue, reset]);

  const handleSaveData = async (data) => {
    setLoading(true);
    try {
      const formattedData = {
        valueFrom: parseInt(data.valueFrom) || 0,
        valueTo: data.valueTo ? parseInt(data.valueTo) : null,
        functionalSpoc: data.functionalSpoc || false,
        exCom: data.exCom || false,
        headOfFinanceOps: data.headOfFinanceOps || false,
        financeController: data.financeController || false,
        cfo: data.cfo || false,
        ceoMd: data.ceoMd || false,
      };
      
      if (authorityData?._id) {
        await userRequest.put(`/capex/updateApprovalAuthority/${authorityData._id}`, formattedData);
        getData();
        swal("Updated!", "Approval Authority updated successfully!", "success");
      } else {
        await userRequest.post("/capex/createApprovalAuthority", formattedData);
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
                id="valueFrom"
                label="From Amount"
                {...register("valueFrom", { required: true })}
                type="number"
                fullWidth
                required
                disabled={loading}
                helperText="Enter minimum project value"
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
                id="valueTo"
                label="To Amount (Optional)"
                {...register("valueTo")}
                type="number"
                fullWidth
                disabled={loading}
                helperText="Leave empty for 'and above'"
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
            <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: 0 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    {...register("functionalSpoc")}
                    color="primary"
                    disabled={loading}
                    sx={{ "& .MuiSvgIcon-root": { fontSize: 20 } }}
                  />
                }
                label={
                  <Typography variant="body2" sx={{ fontWeight: 600, fontSize: "0.875rem" }}>
                    Functional SPOC
                  </Typography>
                }
              />
              <FormControlLabel
                control={
                  <Checkbox
                    {...register("exCom")}
                    color="primary"
                    disabled={loading}
                    sx={{ "& .MuiSvgIcon-root": { fontSize: 20 } }}
                  />
                }
                label={
                  <Typography variant="body2" sx={{ fontWeight: 600, fontSize: "0.875rem" }}>
                    Executive Committee
                  </Typography>
                }
              />
              <FormControlLabel
                control={
                  <Checkbox
                    {...register("headOfFinanceOps")}
                    color="primary"
                    disabled={loading}
                    sx={{ "& .MuiSvgIcon-root": { fontSize: 20 } }}
                  />
                }
                label={
                  <Typography variant="body2" sx={{ fontWeight: 600, fontSize: "0.875rem" }}>
                    Head of Finance Operations
                  </Typography>
                }
              />
              <FormControlLabel
                control={
                  <Checkbox
                    {...register("financeController")}
                    color="primary"
                    disabled={loading}
                    sx={{ "& .MuiSvgIcon-root": { fontSize: 20 } }}
                  />
                }
                label={
                  <Typography variant="body2" sx={{ fontWeight: 600, fontSize: "0.875rem" }}>
                    Finance Controller
                  </Typography>
                }
              />
              <FormControlLabel
                control={
                  <Checkbox
                    {...register("cfo")}
                    color="primary"
                    disabled={loading}
                    sx={{ "& .MuiSvgIcon-root": { fontSize: 20 } }}
                  />
                }
                label={
                  <Typography variant="body2" sx={{ fontWeight: 600, fontSize: "0.875rem" }}>
                    Chief Financial Officer
                  </Typography>
                }
              />
              <FormControlLabel
                control={
                  <Checkbox
                    {...register("ceoMd")}
                    color="primary"
                    disabled={loading}
                    sx={{ "& .MuiSvgIcon-root": { fontSize: 20 } }}
                  />
                }
                label={
                  <Typography variant="body2" sx={{ fontWeight: 600, fontSize: "0.875rem" }}>
                    CEO / Managing Director
                  </Typography>
                }
              />
            </Box>
          </Box>

          <Box sx={{ px: 4, pt: 2.5, pb: 4, flexShrink: 0 }}>
            <Button
              sx={{ width: "100%", height: "50px" }}
              variant="contained"
              color="primary"
              type="submit"
              disabled={loading}
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
