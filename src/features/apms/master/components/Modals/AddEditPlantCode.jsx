import * as React from "react";
import { useForm, Controller } from "react-hook-form";
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
import { MenuItem } from "@mui/material";

function AddEditPlantCode({ handleClose, open, editData: accountTypeData, getData }) {
  const [loading, setLoading] = React.useState(false);
  const [importTypeOptions, setImportTypeOptions] = React.useState([]);

  const { control, register, handleSubmit, reset, setValue } = useForm();

  // Fetch Import Type list
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await userRequest.get(
        `/apms/getMasters?key=importtype&page=1&limit=1000`
      );

      if (response.data.success) {
        const mappedData = response.data.data.masters.map((item) => ({
          label: item.value,
          value: item._id,
        }));
        setImportTypeOptions(mappedData);
      }
    } catch (error) {
      showErrorMessage(error, "Error fetching import type data", swal);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  // Pre-fill edit data
  React.useEffect(() => {
    if (accountTypeData) {
      setValue("importtype", accountTypeData.importType?._id || "");
      setValue("document", accountTypeData.document || accountTypeData.name || "");
    } else {
      reset();
    }
  }, [accountTypeData]);

  const handleSaveData = async (data) => {
    setLoading(true);

    try {
      const formattedData = {
        importType: data.importtype,
        name: data.document,
        status: "ACTIVE",
      };

      if (accountTypeData?._id) {
        await userRequest.put(`/apms/updateDocument/${accountTypeData._id}`, formattedData);
        swal("Updated!", "Document updated successfully!", "success");
      } else {
        await userRequest.post("/apms/createDocument", formattedData);
        swal("Success!", "Document saved successfully!", "success");
      }

      getData();
      reset();
      handleClose();
    } catch (error) {
      showErrorMessage(error, "Error saving data", swal);
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
            {accountTypeData ? "Edit Plant Code" : "Add Plant Code"}
          </span>
          <RxCross2
            onClick={handleClose}
            style={{
              color: "#B22222",
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

          {/* IMPORT TYPE DROPDOWN FIXED */}
          <Controller
            name="location"
            control={control}
            rules={{ required: true }}
            render={({ field }) => (
              <TextField
                select
                label="Select Location"
                fullWidth
                disabled={loading}
                {...field}
              >
                {importTypeOptions.map((item) => (
                  <MenuItem key={item.value} value={item.value}>
                    {item.label}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />

          <TextField
            label="Plant Code"
            fullWidth
            disabled={loading}
            {...register("document", { required: true })}
          />

          <Button
            sx={{ marginTop: "20px", height: "50px" }}
            variant="contained"
            type="submit"
            disabled={loading}
            startIcon={loading && <CircularProgress size={20} color="inherit" />}
          >
            {loading
              ? accountTypeData
                ? "Updating..."
                : "Saving..."
              : accountTypeData
              ? "Update"
              : "Save"}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}

export default AddEditPlantCode;


