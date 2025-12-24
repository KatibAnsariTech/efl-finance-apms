import React, { useState, useEffect } from "react";
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Tooltip,
  Switch,
  Typography,
  TextField,
  Autocomplete,
  Button,
  CircularProgress,
  Fade,
} from "@mui/material";
import { Update as UpdateIcon } from "@mui/icons-material";
import Iconify from "src/components/iconify";
import { useTheme } from "@mui/material/styles";
import { userRequest } from "src/requestMethod";
import swal from "sweetalert";
import { showErrorMessage } from "src/utils/errorUtils";

export default function HierarchyTable({
  initiatorId,
  getData,
  initiatorsLoaded = true,
}) {
  const theme = useTheme();
  const [hierarchyData, setHierarchyData] = useState([]);
  const [approvers, setApprovers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingLevel, setEditingLevel] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [approvalTypeId, setApprovalTypeId] = useState(null);

  const fetchApprovers = async () => {
    try {
      const res = await userRequest.get("/jvm/getJVMUsersByUserType?userType=APPROVER&page=1&limit=1000");
      if (res?.data?.data?.data) {
        const approversData = res.data.data.data.map(item => ({
          userRoleId: item.userRoleId || item._id || item.userId,
          userId: item.userId,
          username: item.username || item.user?.username || "Unknown",
          email: item.email || item.user?.email || "Unknown",
          _id: item._id || item.userRoleId || item.userId,
        }));
        setApprovers(approversData);
      } else {
        setApprovers([]);
      }
    } catch (error) {
      console.error("Error fetching approvers:", error);
      setApprovers([]);
    }
  };

  const createDefaultLevels = () => {
    return [1, 2, 3].map((level) => ({
      id: `level-${level}`,
      _id: `level-${level}`,
      level: level,
      approver: null,
      status: true,
    }));
  };

  const fetchHierarchyData = async () => {
    if (!initiatorId) {
      setHierarchyData(createDefaultLevels());
      return;
    }

    try {
      setLoading(true);
      const res = await userRequest.get("/jvm/getApprovalTypes", {
        params: {
          requesterId: initiatorId,
        },
      });

      const approvalTypesData = res?.data?.data?.approvalTypes || [];
      // Find the approval type that matches the requesterId
      const approvalType = approvalTypesData.find(
        (item) => 
          item.requesterId?._id === initiatorId || 
          item.requesterId === initiatorId ||
          item.requesterId?.userId === initiatorId
      );
      
      const result = approvalType?.steps || [];
      
      if (approvalType && approvalType._id) {
        setApprovalTypeId(approvalType._id);
      }

      const levels = [1, 2, 3].map((level) => {
        const existingData = result.find((item) => item.level === level);
        if (existingData && existingData.approverId) {
          let approverDetails = null;
          
          // Handle approverId as string (single approver ID)
          if (typeof existingData.approverId === 'string') {
            // Find the approver details from the approvers list
            approverDetails = approvers.find(
              (app) => app._id === existingData.approverId || app.userRoleId === existingData.approverId
            );
          } else if (existingData.approverId && typeof existingData.approverId === 'object') {
            // If approverId is an object with user details (from API response)
            approverDetails = {
              userRoleId: existingData.approverId._id || existingData.approverId.userRoleId,
              userId: existingData.approverId.userId,
              username: existingData.approverId.user?.username || existingData.approverId.username || "Unknown",
              email: existingData.approverId.user?.email || existingData.approverId.email || "Unknown",
              _id: existingData.approverId._id,
            };
          }

          if (approverDetails) {
            return {
              id: `level-${level}`,
              _id: existingData._id,
              level: level,
              approver: approverDetails,
              status: existingData.status !== undefined ? existingData.status : true,
            };
          }
        }
        return {
          id: `level-${level}`,
          _id: `level-${level}`,
          level: level,
          approver: null,
          status: true,
        };
      });

      setHierarchyData(levels);
    } catch (error) {
      console.error("Error fetching approval types data:", error);
      setHierarchyData(createDefaultLevels());
      if (error?.response?.status !== 404) {
        showErrorMessage(error, "Error fetching approval types data", swal);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initiatorId && initiatorId.trim() !== "") {
      fetchApprovers();
      fetchHierarchyData();
    } else {
      setHierarchyData(createDefaultLevels());
    }
  }, [initiatorId]);

  useEffect(() => {
    if (initiatorsLoaded && initiatorId && initiatorId.trim() !== "") {
      fetchHierarchyData();
    }
  }, [initiatorsLoaded]);

  useEffect(() => {
    setEditingLevel(null);
    setHasChanges(false);
    setApprovalTypeId(null);
  }, [initiatorId]);

  const handleEdit = (levelData) => {
    if (editingLevel === levelData.level) {
      setEditingLevel(null);
    } else {
      setEditingLevel(levelData.level);
    }
  };

  const updateField = (level, field, value) => {
    setHierarchyData((prev) =>
      prev.map((item) =>
        item.level === level ? { ...item, [field]: value } : item
      )
    );
    setHasChanges(true);
  };

  const handleToggle = async (levelData) => {
    try {
      const newStatus = !levelData.status;

      const result = await swal({
        title: "Are you sure?",
        text: `Do you want to ${newStatus ? "activate" : "deactivate"} Level ${
          levelData.level
        }?`,
        icon: "warning",
        buttons: {
          cancel: "Cancel",
          confirm: {
            text: "Yes, change it!",
            value: true,
          },
        },
        dangerMode: true,
      });

      if (!result) return;

      const requestBody = {
        _id: approvalTypeId,
        level: levelData.level,
        status: newStatus,
      };

      await userRequest.put("/jvm/updateApprovalStepStatus", requestBody);

      fetchHierarchyData();
      swal(
        "Success!",
        `Level ${levelData.level} ${
          newStatus ? "activated" : "deactivated"
        } successfully!`,
        "success"
      );
    } catch (error) {
      console.error("Error toggling status:", error);
      showErrorMessage(
        error,
        "Error updating status. Please try again later.",
        swal
      );
    }
  };

  const handleUpdateAll = async () => {
    try {
      setLoading(true);

      const requestBody = {
        requesterId: initiatorId,
        steps: hierarchyData
          .filter(
            (levelData) =>
              levelData.approver &&
              (levelData.approver._id || levelData.approver.userRoleId)
          )
          .map((levelData) => ({
            level: levelData.level,
            approverId: levelData.approver._id || levelData.approver.userRoleId,
            status: levelData.status !== undefined ? levelData.status : true,
          })),
      };

      // Include _id if updating existing approval type
      if (approvalTypeId) {
        requestBody._id = approvalTypeId;
      }

      // Use same endpoint for both create and update
      await userRequest.post("/jvm/createApprovalType", requestBody);

      setHasChanges(false);
      setEditingLevel(null);
      fetchHierarchyData();
      swal("Success!", approvalTypeId ? "Approval type updated successfully!" : "Approval type created successfully!", "success");
    } catch (error) {
      console.error("Error saving approval type:", error);
      showErrorMessage(
        error,
        "Error saving approval type. Please try again later.",
        swal
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      {loading ? (
        <Fade in={loading} timeout={300}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              height: "250px",
              width: "100%",
              gap: 2,
            }}
          >
            <CircularProgress size={40} />
            <Typography variant="body2" color="text.secondary">
              Loading hierarchy data...
            </Typography>
          </Box>
        </Fade>
      ) : (
        <Fade in={!loading} timeout={300}>
          <TableContainer component={Paper}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell align="center" sx={{ width: "120px" }}>
                    Level
                  </TableCell>
                  <TableCell align="center" sx={{ width: "400px" }}>
                    Approvers
                  </TableCell>
                  <TableCell align="center" sx={{ width: "150px" }}>
                    Actions
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {hierarchyData.map((row) => (
                  <TableRow key={row.level}>
                    <TableCell align="center" sx={{ width: "120px" }}>
                      <Typography variant="body1">{row.level}</Typography>
                    </TableCell>

                    <TableCell align="center" sx={{ width: "400px" }}>
                      {editingLevel === row.level ? (
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            width: "100%",
                          }}
                        >
                          <Autocomplete
                            size="small"
                            options={approvers}
                            getOptionLabel={(option) =>
                              `${option.username} (${option.email})`
                            }
                            value={row.approver || null}
                            onChange={(event, newValue) =>
                              updateField(row.level, "approver", newValue)
                            }
                            isOptionEqualToValue={(option, value) =>
                              option._id === value?._id || option.userRoleId === value?.userRoleId
                            }
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                placeholder="Select approver..."
                                size="small"
                              />
                            )}
                            sx={{ width: "70%" }}
                          />
                        </Box>
                      ) : (
                        <Box
                          sx={{
                            display: "flex",
                            flexWrap: "wrap",
                            gap: 1,
                            justifyContent: "center",
                          }}
                        >
                          {row.approver ? (
                            <Chip
                              key={row.approver.userRoleId || row.approver.email}
                              label={row.approver.email}
                              size="small"
                              variant="outlined"
                              color="primary"
                            />
                          ) : (
                            <Typography variant="body2" color="text.secondary">
                              No approver assigned
                            </Typography>
                          )}
                        </Box>
                      )}
                    </TableCell>

                    <TableCell align="center" sx={{ width: "150px" }}>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 1,
                        }}
                      >
                        <Tooltip title="Edit Approvers">
                          <IconButton
                            size="small"
                            onClick={() => handleEdit(row)}
                            sx={{
                              color: theme.palette.primary.main,
                              backgroundColor:
                                editingLevel === row.level
                                  ? theme.palette.primary.lighter
                                  : "transparent",
                              "&:hover": {
                                backgroundColor: theme.palette.primary.lighter,
                              },
                            }}
                          >
                            <Iconify
                              icon="eva:edit-fill"
                              sx={{ color: "primary.main" }}
                            />
                          </IconButton>
                        </Tooltip>
                        <Tooltip
                          title={
                            row.status ? "Deactivate Level" : "Activate Level"
                          }
                        >
                          <Switch
                            checked={row.status}
                            onChange={() => handleToggle(row)}
                          />
                        </Tooltip>
                      </Box>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </Fade>
      )}

      {hasChanges && (
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
          <Button
            variant="contained"
            startIcon={<UpdateIcon />}
            onClick={handleUpdateAll}
            disabled={loading}
            sx={{ minWidth: 150, py: 1.5 }}
          >
            {loading ? "Updating..." : "Update"}
          </Button>
        </Box>
      )}
    </Box>
  );
}

