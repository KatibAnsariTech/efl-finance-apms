import * as React from "react";
import { useForm } from "react-hook-form";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { RxCross2 } from "react-icons/rx";
import swal from "sweetalert";
import { userRequest } from "src/requestMethod";
import { showErrorMessage } from "src/utils/errorUtils";

function AddEditCompany({ handleClose, open, editData: companyData, getData }) {
  const { register, handleSubmit, reset, setValue } = useForm();

  React.useEffect(() => {
    if (companyData) {
      setValue("companyName", companyData.companyName);
      setValue("govtIdentifier", companyData.govtIdentifier);
      setValue("bankAccountNumber", companyData.bankAccountNumber);
      setValue("isActive", companyData.isActive);
    } else {
      reset();
    }
  }, [companyData, setValue, reset]);

  const handleSaveData = async (data) => {
    try {
      const formattedData = {
        key: "Company",
        ...data,
      };
      if (companyData?._id) {
        await userRequest.put(`/admin/updateMaster?id=${companyData._id}`, formattedData);
        getData();
        swal("Updated!", "Company data updated successfully!", "success");
      } else {
        await userRequest.post("/admin/createMasters", formattedData);
        getData();
        swal("Success!", "Company data saved successfully!", "success");
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
            {companyData ? "Edit Company" : "Add Company"}
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
          <TextField
            id="companyName"
            label="Company Name"
            {...register("companyName", { required: true })}
            fullWidth
            required
          />
          <TextField
            id="govtIdentifier"
            label="Govt Identifier (Code)"
            {...register("govtIdentifier", { required: true })}
            fullWidth
            required
            helperText="GST number or other government identifier"
          />
          <TextField
            id="bankAccountNumber"
            label="Bank Account Number"
            {...register("bankAccountNumber", { required: true })}
            fullWidth
            required
            type="number"
            inputProps={{ pattern: "[0-9]*" }}
          />
          <TextField
            id="isActive"
            label="Active Status"
            {...register("isActive")}
            select
            fullWidth
            SelectProps={{
              native: true,
            }}
          >
            <option value={true}>Active</option>
            <option value={false}>Inactive</option>
          </TextField>
          <Button
            sx={{ marginTop: "20px", height: "50px" }}
            variant="contained"
            color="primary"
            type="submit"
          >
            {companyData ? "Update" : "Save"}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}

export default AddEditCompany;
