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
      fetchUsers();
    }
  }, [open]);

  React.useEffect(() => {
    if (hierarchyData) {
      // Handle new data structure from getApprovalTypes API
      const requesterUsername = hierarchyData.requester || hierarchyData.requesterId?.user?.username || "";
      const approver1Username = hierarchyData.approver1 || hierarchyData.steps?.[0]?.approverId?.user?.username || "";
      const approver2Username = hierarchyData.approver2 || hierarchyData.steps?.[1]?.approverId?.user?.username || "";
      
      setValue("requester", requesterUsername);
      setValue("approver1", approver1Username);
      setValue("approver2", approver2Username);
    } else {
      reset();
      setSelectedRequester(null);
      setSelectedApprover1(null);
      setSelectedApprover2(null);
    }
  }, [hierarchyData, setValue, reset]);

  React.useEffect(() => {
    if (hierarchyData && requesters.length > 0 && approvers.length > 0) {
      // Handle new data structure from getApprovalTypes API
      const requesterUsername = hierarchyData.requester || hierarchyData.requesterId?.user?.username;
      const approver1Username = hierarchyData.approver1 || hierarchyData.steps?.[0]?.approverId?.user?.username;
      const approver2Username = hierarchyData.approver2 || hierarchyData.steps?.[1]?.approverId?.user?.username;
      
      const requesterOption = requesters.find(user => user.username === requesterUsername);
      const approver1Option = approvers.find(user => user.username === approver1Username);
      const approver2Option = approvers.find(user => user.username === approver2Username);
      
      setSelectedRequester(requesterOption ? { value: requesterOption.userRoleId, label: requesterOption.username } : null);
      setSelectedApprover1(approver1Option ? { value: approver1Option.userRoleId, label: approver1Option.username } : null);
      setSelectedApprover2(approver2Option ? { value: approver2Option.userRoleId, label: approver2Option.username } : null);
    }
  }, [hierarchyData, requesters, approvers]);


  // Fetch all users with a single API call
  const fetchUsers = async () => {
    try {
      // Make both API calls in parallel
      const [requesterResponse, approverResponse] = await Promise.all([
        userRequest.get("/jvm/getJVMUsersWithEmptyUserType?for=Requester"),
        userRequest.get("/jvm/getJVMUsersWithEmptyUserType?for=Approver")
      ]);

      if (requesterResponse.data.success) {
        setRequesters(requesterResponse.data.data || []);
      }
      if (approverResponse.data.success) {
        setApprovers(approverResponse.data.data || []);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      showErrorMessage(error, "Error fetching users", swal);
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
      // Validate that all required fields are selected
      if (!selectedRequester?.value) {
        swal("Error!", "Please select a requester", "error");
        setLoading(false);
        return;
      }
      if (!selectedApprover1?.value) {
        swal("Error!", "Please select approver 1", "error");
        setLoading(false);
        return;
      }
      if (!selectedApprover2?.value) {
        swal("Error!", "Please select approver 2", "error");
        setLoading(false);
        return;
      }

      // Format data according to your required structure
      const formattedData = {
        requesterId: selectedRequester.value, // Requester user ID
        steps: [
          {
            level: 1,
            approverId: selectedApprover1.value // First approver user ID
          },
          {
            level: 2,
            approverId: selectedApprover2.value // Second approver user ID
          }
        ]
      };

      console.log("Sending data:", formattedData); // Debug log

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
    value: user.userRoleId,
    label: user.username,
  }));

  // Create options for approvers dropdown
  const approverOptions = approvers?.map((user) => ({
    value: user.userRoleId,
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
              console.log("Selected Requester:", newValue); // Debug log
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
