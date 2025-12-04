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
  companyId,
  importTypeId,
  scopeId,
  getData,
  companiesLoaded = true,
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
      const response = await userRequest.get(
        `/imt/getApproversByImportTypeAndScope?importTypeId=${importTypeId}&scopeId=${scopeId}&page=1&limit=10&search=`
      );
      if (response?.data?.statusCode === 200 && response?.data?.data) {
        const approversData = response.data.data.approvers || [];
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
    return [1, 2, 3, 4].map((level) => ({
      id: `level-${level}`,
      _id: `level-${level}`,
      level: level,
      approvers: [],
      status: true,
    }));
  };

  const fetchHierarchyData = async () => {
    if (!importTypeId && !scopeId) {
      setHierarchyData(createDefaultLevels());
      return;
    }

    try {
      setLoading(true);
      const res = await userRequest.get("/imt/getHierarchiesByImportTypeAndScope", {
        params: {
          importTypeId: importTypeId,
          scopeId: scopeId,
        },
      });

      const approvalTypesData = res?.data?.data || [];
      const approvalType = approvalTypesData.find(
        (item) => item.importTypeId._id === importTypeId && item.scopeId._id === scopeId
      );
      const result = approvalType?.steps || [];
      console.log("approvalTypesData:", approvalType); 
      if (approvalType && approvalType._id) {
        setApprovalTypeId(approvalType._id);
      }

      const levels = [1, 2, 3, 4].map((level) => {
        const existingData = result.find((item) => item.level === level);
        if (existingData) {
          const approversWithDetails = existingData.approverId.map(
            (approver) => ({
              userRoleId: approver._id,
              username: approver.user?.username || "Unknown",
              email: approver.user?.email || "Unknown",
              userId: approver.userId,
              _id: approver._id,
            })
          );
          return {
            id: `level-${level}`,
            _id: existingData._id,
            level: level,
            approvers: approversWithDetails,
            status: existingData.status,
          };
        }
        return {
          id: `level-${level}`,
          _id: `level-${level}`,
          level: level,
          approvers: [],
          status: true,
        };
      });

      setHierarchyData(levels);
    } catch (error) {
      console.error("Error fetching approval types data:", error);
      setHierarchyData(createDefaultLevels());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (importTypeId && scopeId && scopeId.trim() !== "" && importTypeId.trim() !== "") {
      fetchApprovers();
      fetchHierarchyData();
    } else {
      setHierarchyData(createDefaultLevels());
    }
  }, [importTypeId, scopeId]);

  useEffect(() => {
    if (companiesLoaded && importTypeId && scopeId.trim() !== "") {
      fetchHierarchyData();
    }
  }, [companiesLoaded]);

  useEffect(() => {
    setEditingLevel(null);
    setHasChanges(false);
    setApprovalTypeId(null);
  }, [companyId]);

  const handleEdit = (levelData) => {
    if (editingLevel === levelData.level) {
      setEditingLevel(null);
    } else {
      setEditingLevel(levelData.level);
    }
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

      await userRequest.put("/imt/updateHierarchyStepStatus", requestBody);

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

  const updateField = (level, field, value) => {
    setHierarchyData((prev) =>
      prev.map((item) =>
        item.level === level ? { ...item, [field]: value } : item
      )
    );
    setHasChanges(true);
  };

  const handleUpdateAll = async () => {
    try {
      setLoading(true);

      const requestBody = {
        importTypeId: importTypeId,
        scopeId: scopeId,
        steps: hierarchyData
          .filter(
            (levelData) =>
              levelData.approvers &&
              levelData.approvers.length > 0
          )
          .map((levelData) => ({
            level: levelData.level,
            approverId: levelData.approvers.map(
              (approver) => approver._id || approver.userRoleId
            ),
          })),
      };

      await userRequest.put(`/imt/updateHierarchy?id=${approvalTypeId}`, requestBody);

      setHasChanges(false);
      setEditingLevel(null);
      fetchHierarchyData();
      swal("Success!", "Approval type updated successfully!", "success");
    } catch (error) {
      console.error("Error updating approval type:", error);
      showErrorMessage(
        error,
        "Error updating approval type. Please try again later.",
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
                            multiple
                            options={approvers}
                            getOptionLabel={(option) =>
                              `${option.username} (${option.email})`
                            }
                            value={row.approvers || []}
                            onChange={(event, newValue) =>
                              updateField(row.level, "approvers", newValue)
                            }
                            renderTags={(value, getTagProps) =>
                              value.map((option, index) => (
                                <Chip
                                  variant="filled"
                                  label={option.email}
                                  size="small"
                                  color="primary"
                                  {...getTagProps({ index })}
                                  key={option.userRoleId}
                                />
                              ))
                            }
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                placeholder="Select approvers..."
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
                          {row.approvers && row.approvers.length > 0 ? (
                            row.approvers.map((approver) => (
                              <Chip
                                key={approver.userRoleId || approver.email}
                                label={approver.email}
                                size="small"
                                variant="outlined"
                                color="primary"
                              />
                            ))
                          ) : (
                            <Typography variant="body2" color="text.secondary">
                              No approvers assigned
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
