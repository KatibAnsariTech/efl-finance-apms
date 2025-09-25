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
  const [requesters, setRequesters] = React.useState([]);
  const [approvers, setApprovers] = React.useState([]);
  const [selectedRequester, setSelectedRequester] = React.useState(null);
  const [selectedApprover1, setSelectedApprover1] = React.useState(null);
  const [selectedApprover2, setSelectedApprover2] = React.useState(null);
  const { register, handleSubmit, reset, setValue } = useForm();

  React.useEffect(() => {
    if (open) {
      fetchRequesters();
      fetchApprovers();
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
    if (hierarchyData && requesters.length > 0 && approvers.length > 0) {
      const requesterOption = requesters.find(user => user.username === hierarchyData.requester);
      const approver1Option = approvers.find(user => user.username === hierarchyData.approver1);
      const approver2Option = approvers.find(user => user.username === hierarchyData.approver2);
      
      setSelectedRequester(requesterOption ? { value: requesterOption._id, label: requesterOption.username } : null);
      setSelectedApprover1(approver1Option ? { value: approver1Option._id, label: approver1Option.username } : null);
      setSelectedApprover2(approver2Option ? { value: approver2Option._id, label: approver2Option.username } : null);
    }
  }, [hierarchyData, requesters, approvers]);


  // Fetch requesters from API
  const fetchRequesters = async () => {
    try {
      const response = await userRequest.get("/jvm/getJVMUsersWithEmptyUserType?for=Requester");
      if (response.data.success) {
        setRequesters(response.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching requester users:", error);
      showErrorMessage(error, "Error fetching requester users", swal);
    }
  };

  // Fetch approvers from API
  const fetchApprovers = async () => {
    try {
      const response = await userRequest.get("/jvm/getJVMUsersWithEmptyUserType?for=Approver");
      if (response.data.success) {
        setApprovers(response.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching approver users:", error);
      showErrorMessage(error, "Error fetching approver users", swal);
    }
  };

  // Create approval type
  const createApprovalType = async (approvalTypeData) => {
    try {
      const formattedData = {
        key: "ApprovalType",
        name: approvalTypeData.name,
        description: approvalTypeData.description,
        isActive: approvalTypeData.isActive || true,
      };
      
      const response = await userRequest.post("/jvm/createApprovalType", formattedData);
      return response.data;
    } catch (error) {
      console.error("Error creating approval type:", error);
      showErrorMessage(error, "Error creating approval type", swal);
      throw error;
    }
  };

  const handleSaveData = async (data) => {
    setLoading(true);
    try {
      // Format data according to your required structure
      const formattedData = {
        userId: selectedRequester?.value, // Requester user ID
        steps: [
          {
            level: 1,
            userId: selectedApprover1?.value // First approver user ID
          },
          {
            level: 2,
            userId: selectedApprover2?.value // Second approver user ID
          }
        ]
      };

      if (hierarchyData?._id) {
        await userRequest.put(`/jvm/updateMasters?id=${hierarchyData._id}`, formattedData);
        getData();
        swal("Updated!", "Hierarchy data updated successfully!", "success");
      } else {
        // Use createApprovalType API for creating
        await userRequest.post("/jvm/createApprovalType", formattedData);
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


  // Create options for requesters dropdown
  const requesterOptions = requesters?.map((user) => ({
    value: user._id,
    label: user.username,
  }));

  // Create options for approvers dropdown
  const approverOptions = approvers?.map((user) => ({
    value: user._id,
    label: user.username,
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
            options={requesterOptions || []}
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
            options={approverOptions || []}
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
            options={approverOptions || []}
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
