import { useState, useEffect } from "react";
import {
  Box,
  Card,
  Container,
  Typography,
  Autocomplete,
  TextField,
  Fade,
  CircularProgress,
} from "@mui/material";
import {
  Person as PersonIcon,
} from "@mui/icons-material";
import { userRequest } from "src/requestMethod";
import CircularIndeterminate from "src/utils/loader";
import HierarchyTable from "./HierarchyTable";
import swal from "sweetalert";
import { showErrorMessage } from "src/utils/errorUtils";

export default function HierarchyManagementView() {
  const [initiators, setInitiators] = useState([]);
  const [selectedInitiator, setSelectedInitiator] = useState("");
  const [initiatorsLoading, setInitiatorsLoading] = useState(true);

  const fetchDropdownData = async () => {
    try {
      setInitiatorsLoading(true);
      const res = await userRequest.get("/jvm/getJVMUsersByUserType?userType=REQUESTER&page=1&limit=1000");
      const initiatorsData = res?.data?.data?.data || [];
      const initiatorsArray = Array.isArray(initiatorsData) ? initiatorsData : [];
      const mapped = initiatorsArray.map(item => ({
        _id: item._id || item.userRoleId || item.userId,
        userRoleId: item.userRoleId,
        userId: item.userId,
        username: item.username || item.user?.username || "-",
        email: item.email || item.user?.email || "-",
        name: item.username || item.user?.username || "-",
      }));
      setInitiators(mapped);
    } catch (err) {
      console.error("Error fetching initiators:", err);
      setInitiators([]);
      showErrorMessage(err);
    } finally {
      setInitiatorsLoading(false);
    }
  };

  const fetchTableData = async () => {
  };

  const handleInitiatorChange = (event, newValue) => {
    setSelectedInitiator(newValue?._id || newValue?.userRoleId || newValue?.userId || "");
  };

  const handleExport = () => {
    swal("Export", "Export functionality will be implemented", "info");
  };

  useEffect(() => {
    fetchDropdownData();
  }, []);

  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 4 }}>
        <Card sx={{ p: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
            <PersonIcon />
            <Typography variant="body1" sx={{ fontWeight: 500 }}>Select Initiator</Typography>
            <Autocomplete
              sx={{ minWidth: 300 }}
              options={Array.isArray(initiators) ? initiators : []}
              getOptionLabel={(option) => {
                const name = option.name || option.username || "";
                const email = option.email || "";
                return email ? `${name} (${email})` : name;
              }}
              value={initiators.find(initiator => 
                initiator._id === selectedInitiator || 
                initiator.userRoleId === selectedInitiator || 
                initiator.userId === selectedInitiator
              ) || null}
              onChange={handleInitiatorChange}
              loading={initiatorsLoading}
              loadingText="Loading initiators..."
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  placeholder="Select"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {initiatorsLoading ? <CircularProgress color="inherit" size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  }}
                  sx={{
                    "& .MuiInputBase-input": {
                      color: "rgba(0, 0, 0, 0.87)",
                    },
                    "& .MuiInputBase-input::placeholder": {
                      color: "rgba(0, 0, 0, 0.6)",
                    },
                    "& .MuiOutlinedInput-notchedOutline": {
                      borderColor: "rgba(0, 0, 0, 0.23)",
                    },
                    "& .MuiOutlinedInput-root": {
                      "&:hover .MuiOutlinedInput-notchedOutline": {
                        borderColor: "rgba(0, 0, 0, 0.87)",
                      },
                      "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                        borderColor: "primary.main",
                        borderWidth: 2,
                      },
                    },
                  }}
                />
              )}
            />
          </Box>
          
          <Box>
            {selectedInitiator ? (
              <HierarchyTable
                initiatorId={selectedInitiator}
                getData={fetchTableData}
                initiatorsLoaded={!initiatorsLoading}
              />
            ) : (
              <Box sx={{ textAlign: "center", py: 4 }}>
                <Typography variant="body1" color="text.secondary">
                  Please select an initiator to view hierarchy levels
                </Typography>
              </Box>
            )}
          </Box>
        </Card>
      </Box>
    </Container>
  );
}

