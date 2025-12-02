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

// function AddEditVendor({ handleClose, open, editData: accountTypeData, getData }) {
//   const [loading, setLoading] = React.useState(false);
//   const { register, handleSubmit, reset, setValue } = useForm();

//   React.useEffect(() => {
//     if (accountTypeData) {
//       setValue("vendorname", accountTypeData.vendorname || "");
//       setValue("banknumber", accountTypeData.banknumber || "");
//       setValue("swiftcode", accountTypeData.swiftCode || "");
//     } else {
//       reset();
//     }
//   }, [accountTypeData, setValue, reset]);

//   const handleSaveData = async (data) => {
//     setLoading(true);
//     try {
//       const formattedData = {
//         name: data.vendorname,
//         email: data.email,
//         swiftCode: data.swiftcode,
//         bank:{
//           accountNumber:data.banknumber
//         } 
//       };
//       if (accountTypeData?._id) {
//         await userRequest.put(`/imt/updateVendor/${accountTypeData._id}`, formattedData);
//         getData();
//         swal("Updated!", "Account Type data updated successfully!", "success");
//       } else {
//         await userRequest.post("/imt/createVendor", formattedData);
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
//             {accountTypeData ? "Edit Vendor" : "Add Vendor"}
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
//             id="vendorname"
//             label="Vendor Name"
//             {...register("vendorname", { required: true })}
//             fullWidth
//             required
//             disabled={loading}
//             // placeholder="e.g., Asset, Liability, Equity"
//           />
//            <TextField
//             id="banknumber"
//             label="Bank Number"
//             {...register("banknumber", { required: true })}
//             fullWidth
//             required
//             disabled={loading}
//             // placeholder="e.g., Asset, Liability, Equity"
//           />
//           <TextField
//             id="swiftcode"
//             label="Swift Code"
//             {...register("swiftcode", { required: true })}
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

// export default AddEditVendor;

import * as React from "react";
import { useForm } from "react-hook-form";
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

function AddEditVendor({ handleClose, open, editData: vendorData, getData }) {
  const [loading, setLoading] = React.useState(false);
  const { register, handleSubmit, reset, setValue } = useForm();

  React.useEffect(() => {
    if (vendorData) {
      setValue("name", vendorData.name || "");
      setValue("email", vendorData.email || "");
      setValue("swiftCode", vendorData.swiftCode || "");

      // BANK FIELDS
      setValue("bankName", vendorData.bank?.bankName || "");
      setValue("accountNumber", vendorData.bank?.accountNumber || "");
      setValue("ifscCode", vendorData.bank?.ifscCode || "");
      setValue("branchName", vendorData.bank?.branchName || "");
      setValue("address", vendorData.bank?.address || "");
    } else {
      reset();
    }
  }, [vendorData, setValue, reset]);

  const handleSaveData = async (data) => {
    setLoading(true);
    try {
      const formattedData = {
        name: data.name,
        email: data.email,
        bank: {
          bankName: data.bankName,
          accountNumber: data.accountNumber,
          ifscCode: data.ifscCode,
          branchName: data.branchName,
          address: data.address,
          swiftCode: data.swiftCode,
        }
      };

      if (vendorData?._id) {
        await userRequest.put(`/imt/updateVendor/${vendorData._id}`, formattedData);
        swal("Updated!", "Vendor updated successfully!", "success");
      } else {
        await userRequest.post("/imt/createVendor", formattedData);
        swal("Success!", "Vendor created successfully!", "success");
      }

      getData();
      reset();
      handleClose();
    } catch (error) {
      console.error("Error saving vendor:", error);
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
            {vendorData ? "Edit Vendor" : "Add Vendor"}
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
          sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 4 }}
          onSubmit={handleSubmit(handleSaveData)}
        >
          {/* BASIC INFO */}
          <TextField label="Vendor Name" {...register("name", { required: true })} fullWidth required disabled={loading} />
          <TextField label="Email" {...register("email", { required: true })} fullWidth required disabled={loading} />

          {/* BANK DETAILS */}
          <TextField label="Bank Name" {...register("bankName", { required: true })} fullWidth required disabled={loading} />
          <TextField label="Account Number" {...register("accountNumber", { required: true })} fullWidth required disabled={loading} />
          <TextField label="IFSC Code" {...register("ifscCode", { required: true })} fullWidth required disabled={loading} />
          <TextField label="Branch Name" {...register("branchName", { required: true })} fullWidth required disabled={loading} />
          <TextField label="Address" {...register("address", { required: true })} fullWidth required disabled={loading} />

          {/* SWIFT */}
          <TextField label="Swift Code" {...register("swiftCode")} fullWidth disabled={loading} />

          {/* SUBMIT BUTTON */}
          <Button
            sx={{ marginTop: "20px", height: "50px" }}
            variant="contained"
            color="primary"
            type="submit"
            disabled={loading}
            startIcon={loading && <CircularProgress size={20} color="inherit" />}
          >
            {loading ? (vendorData ? "Updating..." : "Saving...") : vendorData ? "Update" : "Save"}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}

export default AddEditVendor;
