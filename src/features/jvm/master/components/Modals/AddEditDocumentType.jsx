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

function AddEditDocumentType({ handleClose, open, editData: documentTypeData, getData }) {
  const [loading, setLoading] = React.useState(false);
  const { register, handleSubmit, reset, setValue } = useForm();

  React.useEffect(() => {
    if (documentTypeData) {
      setValue("documentType", documentTypeData.documentType);
    } else {
      reset();
    }
  }, [documentTypeData, setValue, reset]);

  const handleSaveData = async (data) => {
    setLoading(true);
    try {
      const formattedData = {
        key: "DocumentType",
        value: data.documentType,
      };
      if (documentTypeData?._id) {
        await userRequest.put(`/jvm/updateMaster/${documentTypeData._id}`, formattedData);
        getData();
        swal("Updated!", "Document Type data updated successfully!", "success");
      } else {
        await userRequest.post("/jvm/createMasters", formattedData);
        getData();
        swal("Success!", "Document Type data saved successfully!", "success");
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
            {documentTypeData ? "Edit Document Type" : "Add Document Type"}
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
            id="documentType"
            label="Document Type"
            {...register("documentType", { required: true })}
            fullWidth
            required
            disabled={loading}
            placeholder="e.g., DR, CR, AB"
          />
          <Button
            sx={{ marginTop: "20px", height: "50px" }}
            variant="contained"
            color="primary"
            type="submit"
            disabled={loading}
            startIcon={loading && <CircularProgress size={20} color="inherit" />}
          >
            {loading ? (documentTypeData ? "Updating..." : "Saving...") : (documentTypeData ? "Update" : "Save")}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}

export default AddEditDocumentType;
