import { useState, useEffect } from "react";
import {
  Box,
  Card,
  Container,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TablePagination,
  IconButton,
  Switch,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Stack,
  Chip,
} from "@mui/material";
import { Add as AddIcon, Edit as EditIcon } from "@mui/icons-material";
import { userRequest } from "src/requestMethod";
import CircularIndeterminate from "src/utils/loader";
import excel from "../../../../public/assets/excel.svg";
import EditHierarchyModal from "../EditHierarchyModal";
import swal from "sweetalert";

export default function HierarchyManagementView() {
  // State for dropdowns
  const [channels, setChannels] = useState([]);
  const [regions, setRegions] = useState([]);
  const [selectedChannel, setSelectedChannel] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");

  // State for table data
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [totalCount, setTotalCount] = useState(0);

  // State for modal
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  // Fetch channels and regions on component mount
  useEffect(() => {
    const fetchDropdownData = async () => {
      try {
        // Fetch channels
        const channelRes = await userRequest.get(
          "/admin/getMasters?key=Channel"
        );
        const channelsData = channelRes?.data?.data?.masters || [];
        setChannels(channelsData);

        // Fetch regions
        const regionRes = await userRequest.get("/admin/getMasters?key=Region");
        const regionsData = regionRes?.data?.data?.masters || [];
        setRegions(regionsData);

        // Auto-select first channel and region if available
        if (channelsData.length > 0 && regionsData.length > 0) {
          setSelectedChannel(channelsData[0]._id);
          setSelectedRegion(regionsData[0]._id);
        }
      } catch (error) {
        console.error("Error fetching dropdown data:", error);
      }
    };

    fetchDropdownData();
  }, []);

  // Fetch table data based on selected channel and region
  const fetchTableData = async () => {
    if (!selectedChannel || !selectedRegion) {
      setData([]);
      setTotalCount(0);
      return;
    }

    try {
      setLoading(true);
      const res = await userRequest.get("/admin/getHierarchyLevels", {
        params: {
          channel: selectedChannel,
          region: selectedRegion,
          page: page + 1,
          limit: rowsPerPage,
        },
      });

      const result = res?.data?.data?.levelWiseHierarchy || [];
      const startIndex = page * rowsPerPage;
      const dataWithSno = result.map((item, index) => ({
        ...item,
        sno: startIndex + index + 1,
      }));

      setData(dataWithSno);
      setTotalCount(res?.data?.data?.pagination?.total || 0);
    } catch (error) {
      console.error("Error fetching table data:", error);
      setData([]);
      setTotalCount(0);
    } finally {
      setLoading(false);
    }
  };

  // Fetch data when channel, region, or pagination changes
  useEffect(() => {
    if (selectedChannel && selectedRegion) {
      fetchTableData();
    }
  }, [selectedChannel, selectedRegion, page, rowsPerPage]);

  const handleChannelChange = (event) => {
    setSelectedChannel(event.target.value);
    setPage(0); // Reset to first page when filter changes
  };

  const handleRegionChange = (event) => {
    setSelectedRegion(event.target.value);
    setPage(0); // Reset to first page when filter changes
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleEdit = (row) => {
    setEditData(row);
    setModalOpen(true);
  };

  const handleToggle = async (row) => {
    try {
      // Get the approval type ID from the user's approval type
      const approvalTypeId = row?.id;

      if (!approvalTypeId) {
        swal("Error!", "No approval type found for this user. Please assign an approval type first.", "error");
        return;
      }

      // For now, we'll toggle based on user status since approval type status is not directly available
      const newStatus = !row?.status;
      const currentStatus = row?.status ? "Active" : "Inactive";
      const newStatusText = newStatus ? "Active" : "Inactive";

      // Show confirmation dialog
      const result = await swal({
        title: "Are you sure?",
        text: `Do you want to mark status from "${currentStatus}" to "${newStatusText}"?`,
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

      if (!result) {
        return; // User cancelled
      }

      await userRequest.patch(
        `/admin/updateApprovalTypeStatus/${approvalTypeId}`,
        {
          status: newStatus,
        }
      );

      // Refresh data
      fetchTableData();

      // Show success message
      swal("Success!", `Approval type ${newStatus ? "activated" : "deactivated"} successfully!`, "success");
    } catch (error) {
      console.error("Error toggling approval type status:", error);
      const errorMessage =
        error.response?.data?.message ||
        "Failed to update approval type status. Please try again.";
      swal("Error!", errorMessage, "error");
    }
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setEditData(null);
  };

  const handleAddNew = () => {
    setEditData(null);
    setModalOpen(true);
  };

  const handleExport = async () => {
    if (!selectedChannel || !selectedRegion) {
      alert("Please select both Channel and Region before exporting");
      return;
    }

    try {
      const exportResponse = await userRequest.get(
        `/admin/exportHierarchyManagement?channel=${selectedChannel}&region=${selectedRegion}`,
        {
          responseType: "blob",
        }
      );

      const blob = new Blob([exportResponse.data], {
        type: "application/octet-stream",
      });

      const downloadUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = "Hierarchy_Management.xlsx";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (error) {
      console.error("Error exporting data:", error);
      alert("Error exporting data. Please try again later.");
    }
  };

  return (
    <Container>
      <Box sx={{ mb: 3 }}>
        <Card>
          <Box sx={{ p: 2 }}>
            <Stack direction="row" spacing={3} alignItems="center">
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography
                  variant="body1"
                  sx={{ fontWeight: "bold", minWidth: "60px" }}
                >
                  Channel:
                </Typography>
                <FormControl sx={{ minWidth: 120 }}>
                  <Select
                    value={selectedChannel}
                    onChange={handleChannelChange}
                    variant="standard"
                    displayEmpty
                  >
                    <MenuItem value="" disabled>
                      Select Channel
                    </MenuItem>
                    {channels.map((channel) => (
                      <MenuItem key={channel._id} value={channel._id}>
                        {channel.value || channel.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>

              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography
                  variant="body1"
                  sx={{ fontWeight: "bold", minWidth: "60px" }}
                >
                  Region:
                </Typography>
                <FormControl sx={{ minWidth: 120 }}>
                  <Select
                    value={selectedRegion}
                    onChange={handleRegionChange}
                    variant="standard"
                    displayEmpty
                  >
                    <MenuItem value="" disabled>
                      Select Region
                    </MenuItem>
                    {regions.map((region) => (
                      <MenuItem key={region._id} value={region._id}>
                        {region.value || region.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            </Stack>
          </Box>
          <Box
            sx={{
              p: 2,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography variant="h6">Hierarchy</Typography>
              {/* {selectedChannel && selectedRegion && (
                <Chip
                  label={`${
                    channels.find((c) => c._id === selectedChannel)?.value ||
                    selectedChannel
                  } - ${
                    regions.find((r) => r._id === selectedRegion)?.value ||
                    selectedRegion
                  }`}
                  color="primary"
                  variant="outlined"
                />
              )} */}
            </Box>
            <Stack direction="row" spacing={2} alignItems="center">
              {/* <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAddNew}
                disabled={!selectedChannel || !selectedRegion}
                sx={{
                  backgroundColor: "#1877F2",
                  "&:hover": { backgroundColor: "#166FE5" },
                }}
              >
                Add New
              </Button> */}

              <span
                onClick={handleExport}
                style={{
                  color: "#167beb",
                  fontSize: "0.8rem",
                  fontWeight: "bold",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                Export{" "}
                <img
                  src={excel}
                  style={{ width: "1.2rem", marginLeft: "5px" }}
                />
              </span>
            </Stack>
          </Box>

          {loading && (
            <Box
              sx={{ display: "flex", justifyContent: "center", height: 220 }}
            >
              <CircularIndeterminate />
            </Box>
          )}

          {!loading && selectedChannel && selectedRegion && (
            <TableContainer>
              <Table sx={{ minWidth: 650 }}>
                <TableHead>
                  <TableRow>
                    <TableCell>H.No.</TableCell>
                    <TableCell>Level</TableCell>
                    <TableCell>Username</TableCell>
                    <TableCell>Email</TableCell>
                    {/* <TableCell>Approval Type</TableCell> */}
                    <TableCell align="center">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {data.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} align="center">
                        No data available
                      </TableCell>
                    </TableRow>
                  ) : (
                    data.map((row) => (
                      <TableRow key={row._id || row.sno}>
                        <TableCell>{row?.sno}</TableCell>
                        <TableCell>{row?.value || "-"}</TableCell>
                        <TableCell>{row?.users[0]?.username || "-"}</TableCell>
                        <TableCell>{row?.users[0]?.email || "-"}</TableCell>
                        {/* <TableCell>{row?.label || "-"}</TableCell> */}
                        <TableCell align="center">
                          <Stack
                            direction="row"
                            spacing={1}
                            justifyContent="center"
                          >
                            <IconButton
                              size="small"
                              onClick={() => handleEdit(row)}
                              sx={{ color: "#1877F2" }}
                            >
                              <EditIcon />
                            </IconButton>
                            <Switch
                              checked={row?.status !== false}
                              onChange={() => handleToggle(row)}
                              color="error"
                            />
                          </Stack>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          )}

          {selectedChannel && selectedRegion && (
            <TablePagination
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={totalCount}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
          )}
        </Card>
      </Box>

      {/* Edit Modal */}
      <EditHierarchyModal
        open={modalOpen}
        handleClose={handleCloseModal}
        editData={editData}
        getData={fetchTableData}
        region={selectedRegion}
      />
    </Container>
  );
}
