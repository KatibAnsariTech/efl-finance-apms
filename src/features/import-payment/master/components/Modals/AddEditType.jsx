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
import { FormControl,InputLabel,MenuItem, Select,OutlinedInput } from "@mui/material";

function AddEditType({ handleClose, open, editData: accountTypeData, getData }) {
  const [loading, setLoading] = React.useState(false);
  const { register, handleSubmit, reset, setValue, watch } = useForm();
  const [scopeOptions, setScopeOptions] = React.useState([]);

  const fetchScopeOptions = async () => {
    try {
      const response = await userRequest.get("/imt/getMasters?key=Scope&limit=1000");
      const scopes = response?.data?.data?.masters || [];
      setScopeOptions(scopes);
    }
    catch (error) {
      console.error("Error fetching scope options:", error);
      setScopeOptions([]);
    }
  };

  React.useEffect(() => {
    fetchScopeOptions();
  }, []); 


  React.useEffect(() => {
    if (accountTypeData) {
      const otherIds = accountTypeData.other?.map(o => o._id) || [];
      setValue("Scope", otherIds);
      setValue("type", accountTypeData.value);
    } else {
      reset();
    }
  }, [accountTypeData, setValue, reset]);

  const handleSaveData = async (data) => {
    setLoading(true);
    try {
      const formattedData = {
        key: "Type",
        value: data.type,
        other: data.Scope || []
      };
      if (accountTypeData?._id) {
        await userRequest.put(`/imt/updateMaster/${accountTypeData._id}`, formattedData);
        getData();
        swal("Updated!", "Account Type data updated successfully!", "success");
      } else {
        await userRequest.post("/imt/createMasters", formattedData);
        getData();
        swal("Success!", "Account Type data saved successfully!", "success");
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

  console.log("scopeOptions:", scopeOptions);

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
            {accountTypeData ? "Edit Type" : "Add Type"}
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
          <FormControl fullWidth>
            <InputLabel id="scope-label">Select Scope</InputLabel>

            <Select
              labelId="scope-label"
              id="Scope"
              multiple
              disabled={loading}
              value={watch("Scope") || []}
              input={<OutlinedInput label="Select Scope" />}
              onChange={(e) => setValue("Scope", e.target.value)}
              renderValue={(selected) => {
                if (selected.length === 0) return "Select Scope";
                return scopeOptions
                  .filter((s) => selected.includes(s._id))
                  .map((s) => s.value)
                  .join(", ");
              }}
            >
              {scopeOptions.map((dept) => (
                <MenuItem key={dept._id} value={dept._id}>
                  {dept.value}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField
            id="type"
            label="Type Name"
            {...register("type", { required: true })}
            fullWidth
            required
            disabled={loading}
            // placeholder="e.g., Asset, Liability, Equity"
          />
          <Button
            sx={{ marginTop: "20px", height: "50px" }}
            variant="contained"
            color="primary"
            type="submit"
            disabled={loading}
            startIcon={loading && <CircularProgress size={20} color="inherit" />}
          >
            {loading ? (accountTypeData ? "Updating..." : "Saving...") : (accountTypeData ? "Update" : "Save")}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}

export default AddEditType;
