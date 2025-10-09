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
      setValue("name", companyData.companyName || companyData.name);
      setValue("govId", companyData.govtIdentifier || companyData.govId);
      setValue("bankAccount", companyData.bankAccountNumber || companyData.bankAccount);
      setValue("status", companyData.status || (companyData.isActive ? "ACTIVE" : "INACTIVE"));
    } else {
      reset();
    }
  }, [companyData, setValue, reset]);

  const handleSaveData = async (data) => {
    try {
      const formattedData = {
        name: data.name,
        govId: data.govId,
        bankAccount: data.bankAccount,
        status: data.status,
      };
      
      if (companyData?._id) {
        // Update existing company
        await userRequest.put(`/custom/updateCompany/${companyData._id}`, formattedData);
        getData();
        swal("Updated!", "Company data updated successfully!", "success");
      } else {
        // Create new company
        await userRequest.post("/custom/createCompany", formattedData);
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
            id="name"
            label="Company Name"
            {...register("name", { required: true })}
            fullWidth
            required
          />
          <TextField
            id="govId"
            label="Govt Identifier (Code)"
            {...register("govId", { required: true })}
            fullWidth
            required
            helperText="GST number or other government identifier"
          />
          <TextField
            id="bankAccount"
            label="Bank Account Number"
            {...register("bankAccount", { required: true })}
            fullWidth
            required
            type="number"
            inputProps={{ pattern: "[0-9]*" }}
          />
          <TextField
            id="status"
            label="Status"
            {...register("status", { required: true })}
            select
            fullWidth
            required
            SelectProps={{
              native: true,
            }}
          >
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
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
