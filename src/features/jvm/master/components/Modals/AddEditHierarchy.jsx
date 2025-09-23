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

function AddEditHierarchy({ handleClose, open, editData: hierarchyData, getData }) {
  const [loading, setLoading] = React.useState(false);
  const [users, setUsers] = React.useState([]);
  const [selectedRequester, setSelectedRequester] = React.useState(null);
  const [selectedApprover1, setSelectedApprover1] = React.useState(null);
  const [selectedApprover2, setSelectedApprover2] = React.useState(null);
  const { register, handleSubmit, reset, setValue } = useForm();

  React.useEffect(() => {
    if (open) {
      fetchUsers();
    }
  }, [open]);

  React.useEffect(() => {
    if (hierarchyData) {
      setValue("requester", hierarchyData.requester || "");
      setValue("approver1", hierarchyData.approver1 || "");
      setValue("approver2", hierarchyData.approver2 || "");
    } else {
      reset();
      setSelectedRequester(null);
      setSelectedApprover1(null);
      setSelectedApprover2(null);
    }
  }, [hierarchyData, setValue, reset]);

  React.useEffect(() => {
    if (hierarchyData && users.length > 0) {
      const requesterOption = users.find(user => user.username === hierarchyData.requester);
      const approver1Option = users.find(user => user.username === hierarchyData.approver1);
      const approver2Option = users.find(user => user.username === hierarchyData.approver2);
      
      setSelectedRequester(requesterOption ? { value: requesterOption.username, label: requesterOption.username } : null);
      setSelectedApprover1(approver1Option ? { value: approver1Option.username, label: approver1Option.username } : null);
      setSelectedApprover2(approver2Option ? { value: approver2Option.username, label: approver2Option.username } : null);
    }
  }, [hierarchyData, users]);

  const fetchUsers = async () => {
    try {
      const response = await userRequest.get("/admin/getAllAdmins?limit=1000&page=1");
      if (response.data.success) {
        setUsers(response.data.data.admins || []);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      showErrorMessage(error, "Error fetching users", swal);
    }
  };

  const handleSaveData = async (data) => {
    setLoading(true);
    try {
      const formattedData = {
        key: "Hierarchy",
        requester: data.requester,
        approver1: data.approver1,
        approver2: data.approver2,
      };
      if (hierarchyData?._id) {
        await userRequest.put(`/jvm/updateMasters?id=${hierarchyData._id}`, formattedData);
        getData();
        swal("Updated!", "Hierarchy data updated successfully!", "success");
      } else {
        await userRequest.post("/jvm/createMasters", formattedData);
        getData();
        swal("Success!", "Hierarchy data saved successfully!", "success");
      }

      reset();
      setSelectedRequester(null);
      setSelectedApprover1(null);
      setSelectedApprover2(null);
      handleClose();
    } catch (error) {
      console.error("Error saving data:", error);
      showErrorMessage(error, "Error saving data. Please try again later.", swal);
    } finally {
      setLoading(false);
    }
  };

  const userOptions = users?.map((user) => ({
    value: user.username,
    // label: `${user.username} (${user.userType})`,
    label: `${user.username}`,
  }));

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
            {hierarchyData ? "Edit Hierarchy" : "Add Hierarchy"}
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
          <Autocomplete
            options={userOptions || []}
            getOptionLabel={(option) => option?.label || option || ""}
            value={selectedRequester}
            onChange={(_, newValue) => {
              setSelectedRequester(newValue);
              setValue("requester", newValue?.value || "");
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Requester"
                {...register("requester", { required: true })}
                fullWidth
                required
                disabled={loading}
                placeholder="Select Requester"
              />
            )}
            disabled={loading}
            isOptionEqualToValue={(option, value) => option?.value === value?.value}
          />

          <Autocomplete
            options={userOptions || []}
            getOptionLabel={(option) => option?.label || option || ""}
            value={selectedApprover1}
            onChange={(_, newValue) => {
              setSelectedApprover1(newValue);
              setValue("approver1", newValue?.value || "");
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Approver 1"
                {...register("approver1", { required: true })}
                fullWidth
                required
                disabled={loading}
                placeholder="Select Approver 1"
              />
            )}
            disabled={loading}
            isOptionEqualToValue={(option, value) => option?.value === value?.value}
          />

          <Autocomplete
            options={userOptions || []}
            getOptionLabel={(option) => option?.label || option || ""}
            value={selectedApprover2}
            onChange={(_, newValue) => {
              setSelectedApprover2(newValue);
              setValue("approver2", newValue?.value || "");
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Approver 2"
                {...register("approver2", { required: true })}
                fullWidth
                required
                disabled={loading}
                placeholder="Select Approver 2"
              />
            )}
            disabled={loading}
            isOptionEqualToValue={(option, value) => option?.value === value?.value}
          />

          <Button
            sx={{ marginTop: "20px", height: "50px" }}
            variant="contained"
            color="primary"
            type="submit"
            disabled={loading}
            startIcon={loading && <CircularProgress size={20} color="inherit" />}
          >
            {loading ? (hierarchyData ? "Updating..." : "Saving...") : (hierarchyData ? "Update" : "Save")}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}

export default AddEditHierarchy;
