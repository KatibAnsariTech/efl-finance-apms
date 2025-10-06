import * as React from "react";
import { useForm, Controller } from "react-hook-form";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { Autocomplete, FormControl, InputLabel, Select, MenuItem, Chip, OutlinedInput, ListItemText } from "@mui/material";
import { RxCross2 } from "react-icons/rx";
import swal from "sweetalert";
import { userRequest } from "src/requestMethod";
import { showErrorMessage } from "src/utils/errorUtils";

function AddRequester({ handleClose, open, editData, getData }) {
  const { register, handleSubmit, reset, setValue, control } = useForm();
  const [unassignedUsers, setUnassignedUsers] = React.useState([]);
  const [selectedUser, setSelectedUser] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [saveLoading, setSaveLoading] = React.useState(false);
  const [companies, setCompanies] = React.useState([]);
  const [openCompanySelect, setOpenCompanySelect] = React.useState(false);

  React.useEffect(() => {
    if (editData) {
      setValue("companies", editData.companyIds || []);
      const currentUser = {
        userRoleId: editData.userRoleId,
        username: editData.username,
        email: editData.email,
      };
      setSelectedUser(currentUser);
      setValue("username", editData.username);
      setValue("email", editData.email);
      fetchCompanies();
    } else {
      reset();
      setSelectedUser(null);
      fetchUnassignedUsers();
      fetchCompanies();
    }
  }, [editData, setValue, reset, open]);

  const fetchUnassignedUsers = async () => {
    try {
      setLoading(true);
      const response = await userRequest.get("/custom/getUnassignedUsers");
      setUnassignedUsers(response?.data?.data?.unassignedUsers || []);
    } catch (error) {
      console.error("Error fetching unassigned users:", error);
      setUnassignedUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCompanies = async () => {
    try {
      const response = await userRequest.get("/custom/getCompanies", {
        params: {
          page: 1,
          limit: 100,
        },
      });
      const companiesData = response?.data?.data?.companies || response?.data?.data || [];
      setCompanies(companiesData);
    } catch (error) {
      console.error("Error fetching companies:", error);
      setCompanies([]);
    }
  };

  const handleSaveData = async (data) => {
    try {
      setSaveLoading(true);
      if (editData?.userRoleId) {
        const updateData = {
          userRoleId: editData.userRoleId,
          companyIds: data.companies || [],
          userType: "REQUESTER",
        };
        await userRequest.put("/custom/updateUserRole", updateData);
        getData();
        swal("Updated!", "Requester data updated successfully!", "success");
      } else {
        if (!selectedUser) {
          swal("Error!", "Please select a user to assign the role.", "error");
          return;
        }
        
        const assignData = {
          userRoleId: selectedUser.userRoleId,
          companyIds: data.companies || [],
          userType: "REQUESTER",
        };
        await userRequest.put("/custom/updateUserRole", assignData);
        getData();
        swal("Success!", "Requester role assigned successfully!", "success");
      }

      reset();
      setSelectedUser(null);
      handleClose();
    } catch (error) {
      console.error("Error saving data:", error);
      showErrorMessage(error, "Error saving data. Please try again later.", swal);
    } finally {
      setSaveLoading(false);
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
            {editData ? "Edit Requester" : "Add Requester"}
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
            options={editData ? [selectedUser].filter(Boolean) : unassignedUsers}
            getOptionLabel={(option) => `${option.username} (${option.email})`}
            value={selectedUser}
            onChange={(event, newValue) => {
              setSelectedUser(newValue);
              if (newValue) {
                setValue("username", newValue.username);
                setValue("email", newValue.email);
              }
            }}
            loading={loading}
            disabled={!!editData}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Select User"
                required
              />
            )}
          />

          <FormControl fullWidth>
            <InputLabel id="companies-label">Companies</InputLabel>
            <Controller
              name="companies"
              control={control}
              defaultValue={[]}
              render={({ field }) => (
                <Select
                  labelId="companies-label"
                  multiple
                  input={<OutlinedInput label="Companies" />}
                  open={openCompanySelect}
                  onOpen={() => setOpenCompanySelect(true)}
                  onClose={() => setOpenCompanySelect(false)}
                  value={field.value || []}
                  onChange={(e) => {
                    field.onChange(e.target.value);
                    setOpenCompanySelect(false);
                  }}
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                      {selected.map((value) => {
                        const company = companies.find((c) => c._id === value);
                        const companyLabel = company?.name || value;
                        return (
                          <Chip
                            key={value}
                            label={companyLabel}
                            onDelete={() =>
                              field.onChange(
                                field.value.filter((v) => v !== value)
                              )
                            }
                            onMouseDown={(e) => e.stopPropagation()}
                          />
                        );
                      })}
                    </Box>
                  )}
                >
                  {companies.map((company) => (
                    <MenuItem key={company._id} value={company._id}>
                      <ListItemText primary={company.name} />
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
          </FormControl>
          <Button
            sx={{ marginTop: "20px", height: "50px" }}
            variant="contained"
            color="primary"
            type="submit"
            disabled={saveLoading}
            startIcon={saveLoading ? <CircularProgress size={20} color="inherit" /> : null}
          >
            {saveLoading ? "Processing..." : (editData ? "Update" : "Save")}
          </Button>
        </Box>
      </Box>
    </Modal>
  );
}

export default AddRequester;
