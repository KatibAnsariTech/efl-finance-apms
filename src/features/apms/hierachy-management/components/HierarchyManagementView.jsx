import { useState, useEffect } from "react";
import {
  Box,
  Card,
  Container,
  Typography,
  Autocomplete,
  TextField,
  CircularProgress,
} from "@mui/material";
import { Business as BusinessIcon } from "@mui/icons-material";
import { userRequest } from "src/requestMethod";
import HierarchyTable from "./HierarchyTable";
import swal from "sweetalert";
import { showErrorMessage } from "src/utils/errorUtils";

export default function HierarchyManagementView() {
  const [importTypeList, setImportTypeList] = useState([]);
  const [scopeList, setScopeList] = useState([]);

  const [selectedImportType, setSelectedImportType] = useState(null);
  const [selectedScope, setSelectedScope] = useState(null);

  const [tableData, setTableData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [tableLoading, setTableLoading] = useState(false);

  /* ---------------- FETCH IMPORT TYPE ---------------- */
  const fetchImportTypeDropdownData = async () => {
    try {
      setLoading(true);
      const res = await userRequest.get(
        "/imt/getMasters?key=importtype&limit=100"
      );

      const raw = res?.data?.data?.masters || [];

      // Normalize response
      const mapped = raw.map(item => ({
        ...item,
        name: item.value, // FIX: add name field
      }));

      setImportTypeList(mapped);
    } catch (err) {
      console.error("Error fetching import types:", err);
      setImportTypeList([]);
      showErrorMessage(err);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- FETCH SCOPE ---------------- */
  const fetchScopeDropdownData = async () => {
    try {
      setLoading(true);
      const res = await userRequest.get(
        "/imt/getMasters?key=Scope&limit=100"
      );

      const raw = res?.data?.data?.masters || [];

      // Normalize response
      const mapped = raw.map(item => ({
        ...item,
        name: item.value, // FIX: add name field
      }));

      setScopeList(mapped);
    } catch (err) {
      console.error("Error fetching scope:", err);
      setScopeList([]);
      showErrorMessage(err);
    } finally {
      setLoading(false);
    }
  };

  /* ---------------- FETCH TABLE DATA WITH PARAMS ---------------- */
  // const fetchTableData = async (importTypeId, scopeId) => {
  //   try {
  //     setTableLoading(true);

  //     const res = await userRequest.get(
  //       `/imt/getHierarchies?importTypeId=${importTypeId}&scopeId=${scopeId}`
  //     );
  //     console.log("Hierarchy Table Data Response:", res.data.data.hierarchies);
  //     const data = res?.data?.data.hierarchies || [];
  //     setTableData(data);
  //   } catch (err) {
  //     console.error("Error fetching table:", err);
  //     setTableData([]);
  //     showErrorMessage(err);
  //   } finally {
  //     setTableLoading(false);
  //   }
  // };

  /* ---------------- TRIGGER TABLE LOAD WHEN BOTH SELECTED ---------------- */
  // useEffect(() => {
  //   if (selectedImportType && selectedScope) {
  //     fetchTableData(selectedImportType._id, selectedScope._id);
  //   }
  // }, [selectedImportType, selectedScope]);

  /* ---------------- INIT DROPDOWNS ---------------- */
  useEffect(() => {
    fetchImportTypeDropdownData();
    fetchScopeDropdownData();
  }, []);

  return (
    <Container maxWidth="xl">
      <Box sx={{ mb: 4 }}>
        <Card sx={{ p: 3 }}>
          <Box
            sx={{
              display: "flex",
              gap: 4,
              mb: 3,
              flexWrap: "wrap",
              alignItems: "center",
            }}
          >
            {/* IMPORT TYPE */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <BusinessIcon />
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                Select Import Type
              </Typography>

              <Autocomplete
                sx={{ minWidth: 250 }}
                options={importTypeList}
                getOptionLabel={(opt) => opt?.name || ""} // FIXED
                value={selectedImportType}
                onChange={(e, value) => setSelectedImportType(value)}
                loading={loading}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Select"
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {loading && <CircularProgress size={20} />}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
              />
            </Box>

            {/* SCOPE */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <BusinessIcon />
              <Typography variant="body1" sx={{ fontWeight: 500 }}>
                Select Scope
              </Typography>

              <Autocomplete
                sx={{ minWidth: 250 }}
                options={scopeList}
                getOptionLabel={(opt) => opt?.name || ""} // FIXED
                value={selectedScope}
                onChange={(e, value) => setSelectedScope(value)}
                loading={loading}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Select"
                    InputProps={{
                      ...params.InputProps,
                      endAdornment: (
                        <>
                          {loading && <CircularProgress size={20} />}
                          {params.InputProps.endAdornment}
                        </>
                      ),
                    }}
                  />
                )}
              />
            </Box>
          </Box>

          {/* TABLE */}
          <Box>
            {selectedImportType && selectedScope ? (
              <HierarchyTable
                data={tableData}
                loading={tableLoading}
                importTypeId={selectedImportType._id}
                scopeId={selectedScope._id}
              />
            ) : (
              <Box sx={{ textAlign: "center", py: 4 }}>
                <Typography variant="body1" color="text.secondary">
                  Please select Import Type & Scope to view hierarchy levels
                </Typography>
              </Box>
            )}
          </Box>
        </Card>
      </Box>
    </Container>
  );
}

