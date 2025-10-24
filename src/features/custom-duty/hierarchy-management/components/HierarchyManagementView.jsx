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
  Business as BusinessIcon,
} from "@mui/icons-material";
import { userRequest } from "src/requestMethod";
import CircularIndeterminate from "src/utils/loader";
import HierarchyTable from "./HierarchyTable";
import swal from "sweetalert";
import { showErrorMessage } from "src/utils/errorUtils";

export default function HierarchyManagementView() {
  const [companies, setCompanies] = useState([]);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [companiesLoading, setCompaniesLoading] = useState(true);

  const fetchDropdownData = async () => {
    try {
      setCompaniesLoading(true);
      const res = await userRequest.get("/custom/getCompanies?limit=100");
      const companiesData = res?.data?.data?.companies || res?.data?.data || res?.data || [];
      const companiesArray = Array.isArray(companiesData) ? companiesData : [];
      setCompanies(companiesArray);
    } catch (err) {
      console.error("Error fetching companies:", err);
      setCompanies([]);
      showErrorMessage(err);
    } finally {
      setCompaniesLoading(false);
    }
  };

  const fetchTableData = async () => {
  };

  const handleCompanyChange = (event, newValue) => {
    setSelectedCompany(newValue?._id || "");
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
            <BusinessIcon />
            <Typography variant="body1" sx={{ fontWeight: 500 }}>Select Company</Typography>
            <Autocomplete
              sx={{ minWidth: 300 }}
              options={Array.isArray(companies) ? companies : []}
              getOptionLabel={(option) => option.name || ""}
              value={companies.find(company => company._id === selectedCompany) || null}
              onChange={handleCompanyChange}
              loading={companiesLoading}
              loadingText="Loading companies..."
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
                  placeholder="Select"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <>
                        {companiesLoading ? <CircularProgress color="inherit" size={20} /> : null}
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
            {selectedCompany ? (
              <HierarchyTable
                companyId={selectedCompany}
                getData={fetchTableData}
                companiesLoaded={!companiesLoading}
              />
            ) : (
              <Box sx={{ textAlign: "center", py: 4 }}>
                <Typography variant="body1" color="text.secondary">
                  Please select a company to view hierarchy levels
                </Typography>
              </Box>
            )}
          </Box>
        </Card>
      </Box>
    </Container>
  );
}