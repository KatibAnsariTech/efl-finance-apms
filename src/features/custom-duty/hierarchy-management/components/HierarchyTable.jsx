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
} from "@mui/material";
import {
  Update as UpdateIcon,
} from "@mui/icons-material";
import Iconify from "src/components/iconify";
import { useTheme } from "@mui/material/styles";
import { userRequest } from "src/requestMethod";
import swal from "sweetalert";
import { showErrorMessage } from "src/utils/errorUtils";

export default function HierarchyTable({ companyId, getData }) {
  const theme = useTheme();
  const [hierarchyData, setHierarchyData] = useState([]);
  const [approvers, setApprovers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editingLevel, setEditingLevel] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);

  const fetchApprovers = async () => {
    try {
      const response = await userRequest.get("/custom/getAllUsersWithRoles?userType=APPROVER");
      const approversData = response?.data?.data?.users || [];
      setApprovers(approversData);
    } catch (error) {
      console.error("Error fetching approvers:", error);
      setApprovers([]);
    }
  };

  const createDefaultLevels = () => {
    return [1, 2, 3, 4].map(level => ({
      id: `level-${level}`,
      level: level,
      approvers: [],
      status: true,
    }));
  };

  const fetchHierarchyData = async () => {
    if (!companyId) {
      setHierarchyData(createDefaultLevels());
      return;
    }

    try {
      setLoading(true);
      const res = await userRequest.get("/custom/getHierarchyLevels", {
        params: {
          companyId: companyId,
        },
      });

      const result = res?.data?.data?.hierarchyLevels || [];
      
      const levels = [1, 2, 3, 4].map(level => {
        const existingData = result.find(item => item.level === level);
        return existingData || {
          id: `level-${level}`,
          level: level,
          approvers: [],
          status: true,
        };
      });

      setHierarchyData(levels);
    } catch (error) {
      console.error("Error fetching hierarchy data:", error);
      setHierarchyData(createDefaultLevels());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApprovers();
    setHierarchyData(createDefaultLevels());
  }, []);

  useEffect(() => {
    fetchHierarchyData();
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
        text: `Do you want to ${newStatus ? "activate" : "deactivate"} Level ${levelData.level}?`,
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
        level: levelData.level,
        status: newStatus,
        companyId: companyId
      };

      await userRequest.put("/custom/updateHierarchyLevelStatus", requestBody);

      fetchHierarchyData();
      swal("Success!", `Level ${levelData.level} ${newStatus ? "activated" : "deactivated"} successfully!`, "success");
    } catch (error) {
      console.error("Error toggling status:", error);
      showErrorMessage(error, "Error updating status. Please try again later.", swal);
    }
  };

  const updateField = (level, field, value) => {
    setHierarchyData(prev => prev.map(item => 
      item.level === level ? { ...item, [field]: value } : item
    ));
    setHasChanges(true);
  };

  const handleUpdateAll = async () => {
    try {
      setLoading(true);
      
      const requestBody = {
        companyId: companyId,
        hierarchyLevels: hierarchyData.map(levelData => ({
          level: levelData.level,
          approvers: levelData.approvers,
          status: levelData.status,
          id: levelData.id
        }))
      };

      await userRequest.post("/custom/updateAllHierarchyLevels", requestBody);

      setHasChanges(false);
      setEditingLevel(null);
      fetchHierarchyData();
      swal("Success!", "All hierarchy levels updated successfully!", "success");
    } catch (error) {
      console.error("Error updating all data:", error);
      showErrorMessage(error, "Error updating data. Please try again later.", swal);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell align="center" sx={{ width: "120px" }}>Level</TableCell>
              <TableCell align="center" sx={{ width: "400px" }}>Approvers</TableCell>
              <TableCell align="center" sx={{ width: "150px" }}>Actions</TableCell>
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
                    <Box sx={{ display: "flex", justifyContent: "center", width: "100%" }}>
                      <Autocomplete
                        size="small"
                        multiple
                        options={approvers}
                        getOptionLabel={(option) => `${option.username} (${option.email})`}
                        value={row.approvers || []}
                        onChange={(event, newValue) => updateField(row.level, 'approvers', newValue)}
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
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, justifyContent: "center" }}>
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
                  <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 1 }}>
                    <Tooltip title="Edit Approvers">
                      <IconButton
                        size="small"
                        onClick={() => handleEdit(row)}
                        sx={{
                          color: theme.palette.primary.main,
                          backgroundColor: editingLevel === row.level ? theme.palette.primary.lighter : "transparent",
                          "&:hover": {
                            backgroundColor: theme.palette.primary.lighter,
                          },
                        }}
                      >
                        <Iconify icon="eva:edit-fill" sx={{ color: "primary.main" }} />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title={row.status ? "Deactivate Level" : "Activate Level"}>
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

      {hasChanges && (
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 3 }}>
          <Button
            variant="contained"
            // startIcon={<UpdateIcon />}
            onClick={handleUpdateAll}
            // disabled={loading}
            disabled={true}
            sx={{ minWidth: 150, py: 1.5 }}
          >
            {loading ? "Updating..." : "Update"}
          </Button>
        </Box>
      )}
    </Box>
  );
}