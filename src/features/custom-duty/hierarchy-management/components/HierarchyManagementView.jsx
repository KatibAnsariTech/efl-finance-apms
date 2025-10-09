import { useState, useEffect } from "react";
import {
  Box,
  Card,
  Container,
  Typography,
  Autocomplete,
  TextField,
  Fade,
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
      
      if (companiesArray.length > 0 && !selectedCompany) {
        setSelectedCompany(companiesArray[0]._id);
      }
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
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="outlined"
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
          
          {companiesLoading ? (
            <Fade in={companiesLoading} timeout={300}>
              <Box sx={{ 
                display: 'flex', 
                flexDirection: 'column',
                justifyContent: 'center', 
                alignItems: 'center', 
                height: '300px',
                width: '100%',
                gap: 2
              }}>
                <CircularIndeterminate />
                <Typography variant="body2" color="text.secondary">
                  Loading companies...
                </Typography>
              </Box>
            </Fade>
          ) : (
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
          )}
        </Card>
      </Box>
    </Container>
  );
}