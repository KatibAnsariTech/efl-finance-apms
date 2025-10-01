import * as React from "react";
import { useForm } from "react-hook-form";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { Autocomplete } from "@mui/material";
import { RxCross2 } from "react-icons/rx";
import swal from "sweetalert";
import { userRequest } from "src/requestMethod";
import { showErrorMessage } from "src/utils/errorUtils";

function AddEditSpecialGL({ handleClose, open, editData: specialGLData, getData }) {
  const [loading, setLoading] = React.useState(false);
  const { register, handleSubmit, reset, setValue } = useForm();
  const [accountTypes, setAccountTypes] = React.useState([]);
  const [selectedAccountType, setSelectedAccountType] = React.useState(null);

  // Fetch Account Types master list
  const fetchAccountTypes = async () => {
    try {
      const res = await userRequest.get(`/jvm/getMasters?key=AccountType&page=1&limit=1000`);
      if (res?.data?.success) {
        const list = res.data.data?.masters || [];
        setAccountTypes(list.map((m) => ({ id: m._id, label: m.value })));
      }
    } catch (error) {
      console.error("Error fetching Account Types:", error);
      showErrorMessage(error, "Error fetching Account Types", swal);
    }
  };

  React.useEffect(() => {
    if (open) {
      fetchAccountTypes();
    }
  }, [open]);

  React.useEffect(() => {
    if (specialGLData) {
      setValue("specialGLIndication", specialGLData.specialGLIndication);
      // Initialize account type from other[0] which can be id or object
      let savedId = "";
      if (Array.isArray(specialGLData.other) && specialGLData.other[0]) {
        const first = specialGLData.other[0];
        savedId = typeof first === "object" ? (first._id || "") : first;
      }
      setValue("accountTypeId", savedId);
      if (savedId && accountTypes.length > 0) {
        const match = accountTypes.find((a) => a.id === savedId) || null;
        setSelectedAccountType(match);
      }
    } else {
      reset();
      setSelectedAccountType(null);
      setValue("accountTypeId", "");
    }
  }, [specialGLData, setValue, reset, accountTypes]);

  const handleSaveData = async (data) => {
    setLoading(true);
    try {
      const glVal = (data.specialGLIndication || "").trim().toUpperCase();
      if (glVal.length !== 1) {
        swal("Error!", "Special GL Indication must be exactly 1 character.", "error");
        setLoading(false);
        return;
      }

      const formattedData = {
        key: "SpecialGLIndication",
        value: glVal,
        // Save selected Account Type id in other
        other: data.accountTypeId ? [data.accountTypeId] : [],
      };
      if (specialGLData?._id) {
        await userRequest.put(`/jvm/updateMaster/${specialGLData._id}`, formattedData);
        getData();
        swal("Updated!", "Special GL Indication data updated successfully!", "success");
      } else {
        await userRequest.post("/jvm/createMasters", formattedData);
        getData();
        swal("Success!", "Special GL Indication data saved successfully!", "success");
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
            {specialGLData ? "Edit Special GL Indication" : "Add Special GL Indication"}
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
            id="specialGLIndication"
            label="Special GL Indication"
            {...register("specialGLIndication", { required: "Required", minLength: { value: 1, message: "Must be 1 character" }, maxLength: { value: 1, message: "Must be 1 character" } })}
            fullWidth
            required
            disabled={loading}
            // placeholder="e.g., Special Account, GL Account"
            inputProps={{ maxLength: 1, style: { textTransform: 'uppercase' } }}
            onChange={(e) => setValue('specialGLIndication', e.target.value.toUpperCase(), { shouldValidate: true })}
          />
          {/* Hidden field to store selected Account Type id */}
          <input type="hidden" {...register("accountTypeId")} />
          <Autocomplete
            options={accountTypes}
            getOptionLabel={(option) => option?.label || ""}
            value={selectedAccountType}
            onChange={(_, newValue) => {
              setSelectedAccountType(newValue);
              setValue("accountTypeId", newValue?.id || "");
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Account Type"
                placeholder="Select Account Type"
                fullWidth
                disabled={loading}
              />
            )}
            isOptionEqualToValue={(option, value) => option?.id === value?.id}
            disabled={loading}
          />
          <Button
            sx={{ marginTop: "20px", height: "50px" }}
            variant="contained"
            color="primary"
            type="submit"
            disabled={loading}
            startIcon={loading && <CircularProgress size={20} color="inherit" />}
          >
            {loading ? (specialGLData ? "Updating..." : "Saving...") : (specialGLData ? "Update" : "Save")}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}

export default AddEditSpecialGL;
