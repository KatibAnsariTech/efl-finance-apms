import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Modal,
  TextField,
  Button,
  Stack,
  CircularProgress,
  Alert,
  Autocomplete,
  Chip,
} from "@mui/material";
import { RxCross2 } from "react-icons/rx";
import { useForm } from "react-hook-form";
import swal from "sweetalert";
import { userRequest } from "src/requestMethod";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 500,
  height: "auto",
  minHeight: 400,
  maxHeight: "80vh",
  bgcolor: "background.paper",
  border: "2px solid #fff",
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
  overflow: "auto",
};

function EditHierarchyModal({ handleClose, open, editData, getData, region }) {
  const { register, handleSubmit, reset, setValue, watch } = useForm();
  const [loading, setLoading] = useState(false);
  const [userSearchLoading, setUserSearchLoading] = useState(false);
  const [foundUser, setFoundUser] = useState(null);
  const [userSearchError, setUserSearchError] = useState("");
  const [allUsers, setAllUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (open) {
      const fetchAllUsers = async () => {
        try {
          setUserSearchLoading(true);
          const res = await userRequest.get(
            "/admin/getAllAdmins?type=APPROVER&limit=1000&page=1"
          );
          let users = res?.data?.data?.admins || [];
          if (region) {
            users = users.filter((user) => {
              const inRegion = Array.isArray(user.region)
                ? user.region.some((r) => r._id === region)
                : user.region === region;

              return inRegion && user.status === true;
            });
          } else {
            users = users.filter((user) => user.status === true);
          }
          setAllUsers(users);
          setFilteredUsers(users);
        } catch (error) {
          console.error("Error fetching users:", error);
          setUserSearchError("Error loading users");
        } finally {
          setUserSearchLoading(false);
        }
      };
      fetchAllUsers();
    }
  }, [open, region]);

  useEffect(() => {
    if (!editData) {
      reset();
      setFoundUser(null);
      setUserSearchError("");
      setSearchQuery("");
      return;
    }

    const editUser = editData.users?.[0];
    if (editUser) {
      setValue("username", editUser.username || "");
      setValue("email", editUser.email || "");
      setSearchQuery(editUser.email || "");
      if (allUsers.length > 0) {
        const matched = allUsers.find((u) => u._id === editUser._id);
        setFoundUser(matched || editUser);
      } else {
        setFoundUser(editUser);
      }
    }
  }, [editData, setValue, reset, allUsers]);

  useEffect(() => {
    if (allUsers.length === 0) return;

    if (editData && foundUser) {
      return;
    }

    if (!searchQuery) {
      setFilteredUsers(allUsers);
      setFoundUser(null);
      setUserSearchError("");
      return;
    }

    const filtered = allUsers.filter((user) => {
      const query = searchQuery.toLowerCase();
      return (
        user.username?.toLowerCase().includes(query) ||
        user.email?.toLowerCase().includes(query) ||
        user.requesterNo?.toLowerCase().includes(query)
      );
    });

    setFilteredUsers(filtered);

    const exactMatch = allUsers.find(
      (user) => user.email?.toLowerCase() === searchQuery.toLowerCase()
    );

    if (exactMatch) {
      setFoundUser(exactMatch);
      setValue("username", exactMatch.username || "");
      setValue("email", exactMatch.email || "");
      setUserSearchError("");
    } else {
      setFoundUser(null);
      setUserSearchError(filtered.length === 0 ? "No users found" : "");
    }
  }, [searchQuery, allUsers, setValue, editData, foundUser]);

  const handleSaveData = async (data) => {
    try {
      setLoading(true);

      if (!foundUser) {
        swal(
          "Error!",
          "Please enter a valid email and wait for user to be found.",
          "error"
        );
        return;
      }

      if (foundUser.status === false) {
        swal("Error!", "Inactive user can not be added as approver", "error");
        return;
      }

      await userRequest.post("/admin/assignUserToApprovalType", {
        userId: foundUser._id,
        approvalTypeId: editData.id,
      });

      swal(
        "Success!",
        "User assigned to approval type successfully!",
        "success"
      );
      getData();
      handleClose();
    } catch (error) {
      console.error("Error assigning user to approval type:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Failed to assign user to approval type. Please try again.";
      swal("Error!", errorMessage, "error");
    } finally {
      setLoading(false);
    }
  };

  // Reset all state when modal closes
  useEffect(() => {
    if (!open) {
      reset();
      setFoundUser(null);
      setUserSearchError("");
      setSearchQuery("");
      setAllUsers([]);
      setFilteredUsers([]);
      setUserSearchLoading(false);
    }
  }, [open, reset]);

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {editData ? "Update Hierarchy" : "Assign Hierarchy"}
          </Typography>
          <Button onClick={handleClose} sx={{ minWidth: "auto", p: 1 }}>
            <RxCross2 size={20} />
          </Button>
        </Box>

        <form onSubmit={handleSubmit(handleSaveData)}>
          <Stack spacing={4}>
            <Autocomplete
              freeSolo
              options={filteredUsers}
              getOptionLabel={(option) => {
                if (typeof option === "string") return option;
                return option.email;
              }}
              value={searchQuery}
              onInputChange={(event, newInputValue) => {
                setSearchQuery(newInputValue);
              }}
              onChange={(event, newValue) => {
                if (newValue && typeof newValue === "object") {
                  setFoundUser(newValue);
                  setValue("username", newValue.username || "");
                  setValue("email", newValue.email || "");
                  setSearchQuery(newValue.email);
                  setUserSearchError("");
                }
              }}
              loading={userSearchLoading}
              sx={{
                "& .MuiAutocomplete-paper": {
                  maxHeight: 300,
                  boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
                  borderRadius: 2,
                },
                "& .MuiAutocomplete-listbox": {
                  padding: 0,
                },
                "& .MuiAutocomplete-option": {
                  padding: "12px 16px",
                  borderBottom: "1px solid #f0f0f0",
                  "&:last-child": {
                    borderBottom: "none",
                  },
                  "&:hover": {
                    backgroundColor: "#f8f9fa",
                  },
                  "&.Mui-focused": {
                    backgroundColor: "#e3f2fd",
                  },
                },
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Email"
                  placeholder="Type name, email, or requester number..."
                  error={!!userSearchError}
                  helperText={userSearchError || "Start typing to search users"}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {userSearchLoading ? (
                          <CircularProgress color="inherit" size={20} />
                        ) : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#1976d2",
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "#1976d2",
                        borderWidth: 2,
                      },
                    },
                  }}
                />
              )}
              renderOption={(props, option) => (
                <Box
                  component="li"
                  {...props}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                    py: 1.5,
                    px: 2,
                    "&:hover": {
                      backgroundColor: "#f8f9fa",
                    },
                  }}
                >
                  <Box sx={{ flex: 1 }}>
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        mb: 0.5,
                      }}
                    >
                      <Typography
                        variant="subtitle1"
                        fontWeight="600"
                        color="text.primary"
                      >
                        {option.username}
                      </Typography>
                    </Box>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 0.5 }}
                    >
                      {option.email}
                    </Typography>
                  </Box>
                </Box>
              )}
            />

            {/* {foundUser && (
              <Alert
                severity={foundUser?.status ? "success" : "warning"}
                sx={{
                  py: 1,
                  display: "flex",
                  flexDirection: "row",
                  gap: 1,
                  alignItems: "center",
                }}
              >
                <Typography variant="body2" sx={{ mt: 0.5 }}>
                  <strong>Status:</strong>{" "}
                  {foundUser && foundUser?.status ? "Active" : "Inactive"}
                </Typography>
              </Alert>
            )} */}

            {/* Username field (read-only, auto-populated) */}
            <TextField
              {...register("username")}
              label="Username"
              fullWidth
              disabled
              value={foundUser?.username || ""}
              helperText="Auto-populated from user search"
            />

            <Stack
              direction="row"
              spacing={2}
              justifyContent="flex-end"
              sx={{ mt: 2 }}
            >
              <Button
                variant="outlined"
                onClick={handleClose}
                disabled={loading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={loading || !foundUser}
              >
                {loading
                  ? "Saving..."
                  : editData
                  ? "Update Hierarchy"
                  : "Assign User"}
              </Button>
            </Stack>
          </Stack>
        </form>
      </Box>
    </Modal>
  );
}

export default EditHierarchyModal;
