import React from "react";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { RxCross2 } from "react-icons/rx";
import swal from "sweetalert";
import { userRequest } from "src/requestMethod";
import { showErrorMessage } from "src/utils/errorUtils";

const bankSchema = yup.object({
  bankName: yup.string().required("Bank name is required").min(2, "Bank name must be at least 2 characters"),
  accountNumber: yup.string().required("Account number is required").matches(/^\d+$/, "Account number must contain only digits"),
  iecCode: yup.string().required("IEC code is required").min(3, "IEC code must be at least 3 characters"),
  address1: yup.string().required("Address 1 is required").min(5, "Address must be at least 5 characters"),
  address2: yup.string(),
  address3: yup.string(),
});

function AddEditBank({ handleClose, open, editData: bankData, getData }) {
  const { 
    control, 
    handleSubmit, 
    reset, 
    formState: { errors, isSubmitting, isValid } 
  } = useForm({
    resolver: yupResolver(bankSchema),
    mode: "onChange",
    defaultValues: {
      bankName: bankData?.bankName || bankData?.name || "",
      accountNumber: bankData?.accountNumber || "",
      iecCode: bankData?.iecCode || "",
      address1: bankData?.address1 || "",
      address2: bankData?.address2 || "",
      address3: bankData?.address3 || "",
    }
  });

  const handleSaveData = async (data) => {
    try {
      const formattedData = {
        bankName: data.bankName,
        accountNumber: data.accountNumber,
        iecCode: data.iecCode,
        address1: data.address1,
        address2: data.address2,
        address3: data.address3,
      };
      
      if (bankData?._id) {
        await userRequest.put(`/custom/updateBank/${bankData._id}`, formattedData);
        getData();
        swal("Updated!", "Bank data updated successfully!", "success");
      } else {
        await userRequest.post("/custom/createBank", formattedData);
        getData();
        swal("Success!", "Bank data saved successfully!", "success");
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
          width: "60%",
          maxWidth: "800px",
          bgcolor: "background.paper",
          borderRadius: 5,
          maxHeight: "90vh",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
        }}
      >
        <Box sx={{ p: 4 }}>
          <Typography
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <span style={{ fontSize: "24px", fontWeight: "bolder" }}>
              {bankData ? "Edit Bank" : "Add Bank"}
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
          sx={{
            flex: 1,
            overflow: "auto",
            p: 4,
            pt: 0,
            pb: 0,
          }}
        >
          <Box
            component="form"
            id="bank-form"
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: 2,
              width: "100%",
              pb: 2,
            }}
            onSubmit={handleSubmit(handleSaveData)}
          >
          <Controller
            name="bankName"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                label="Bank Name"
                fullWidth
                required
                error={!!error}
                helperText={error?.message}
              />
            )}
          />
          
          <Controller
            name="accountNumber"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                label="Account Number"
                fullWidth
                required
                error={!!error}
                helperText={error?.message}
                inputProps={{ pattern: "[0-9]*" }}
              />
            )}
          />
          
          <Controller
            name="iecCode"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                label="IEC Code"
                fullWidth
                required
                error={!!error}
                helperText={error?.message}
              />
            )}
          />
          
          <Controller
            name="address1"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                label="Address 1"
                fullWidth
                required
                error={!!error}
                helperText={error?.message}
              />
            )}
          />
          
          <Controller
            name="address2"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                label="Address 2"
                fullWidth
                error={!!error}
                helperText={error?.message}
              />
            )}
          />
          
          <Controller
            name="address3"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                label="Address 3"
                fullWidth
                error={!!error}
                helperText={error?.message}
              />
            )}
          />
          </Box>
        </Box>
        
        <Box
          sx={{
            p: 2,
            pt: 1,
            borderTop: "1px solid #e0e0e0",
            bgcolor: "background.paper",
          }}
        >
          <Button
            sx={{ height: "50px", width: "100%" }}
            variant="contained"
            color="primary"
            type="submit"
            form="bank-form"
            disabled={!isValid || isSubmitting}
          >
            {isSubmitting ? "Saving..." : (bankData ? "Update" : "Save")}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}

export default AddEditBank;
