import { Box, Button, IconButton, FormControl, InputLabel, Select, MenuItem, CircularProgress } from "@mui/material";
import Iconify from "src/components/iconify/iconify";
import { useState, useEffect } from "react";
import { userRequest } from "src/requestMethod";

const Header = ({ 
  showInfoText, 
  onToggleInfoText, 
  onAddManual, 
  onUploadFile,
  selectedCompany,
  setSelectedCompany,
  onCompanyChange
}) => {
  const [companies, setCompanies] = useState([]);
  const [companiesLoading, setCompaniesLoading] = useState(false);

  useEffect(() => {
    const fetchCompanies = async () => {
      setCompaniesLoading(true);
      try {
        const response = await userRequest.get("/jvm/getUserCompanies");
        if (response.data.statusCode === 200 && response.data.data) {
          setCompanies(response.data.data || []);
        }
      } catch (error) {
        console.error("Error fetching companies:", error);
      } finally {
        setCompaniesLoading(false);
      }
    };
    fetchCompanies();
  }, []);

  const handleCompanyChange = (e) => {
    const selected = companies.find(c => c._id === e.target.value);
    if (onCompanyChange) {
      onCompanyChange(selected || null);
    } else {
      setSelectedCompany(selected || null);
    }
  };

  return (
    <Box sx={{ mb: 2 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 2,
        }}
      >
        <FormControl size="small" sx={{ minWidth: 250 }}>
          <InputLabel sx={{ fontSize: "0.875rem" }}>Company *</InputLabel>
          <Select
            value={selectedCompany?._id || ""}
            onChange={handleCompanyChange}
            label="Company *"
            disabled={companiesLoading}
            sx={{
              fontSize: "0.875rem",
              height: "40px",
              "& .MuiSelect-select": {
                fontSize: "0.875rem",
                padding: "10px 14px",
              },
            }}
          >
            {companiesLoading ? (
              <MenuItem disabled>
                <CircularProgress size={20} />
                Loading...
              </MenuItem>
            ) : (
              companies.map((company) => (
                <MenuItem key={company._id} value={company._id}>
                  {company.name}
                </MenuItem>
              ))
            )}
          </Select>
        </FormControl>
        
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "center",
            gap: 0.2,
            flex: 1,
          }}
        >
        {showInfoText && (
          <span
            style={{
              fontSize: "0.75rem",
              color: "red",
              marginRight: "4px",
              fontWeight: "500",
            }}
          >
            use a unique serial number for each SAP debit and credit entry
          </span>
        )}
        <IconButton
          size="small"
          color="error"
          sx={{ p: 0, mr: 0.5 }}
          onClick={onToggleInfoText}
        >
          <Iconify icon="eva:info-fill" />
        </IconButton>
        <span
          style={{
            fontSize: "0.875rem",
            fontWeight: "bold",
            color: "#2c72d8",
          }}
        >
          |
        </span>
        <Button
          variant="text"
          size="small"
          onClick={onAddManual}
          disabled={!selectedCompany}
          sx={{
            fontSize: "0.875rem",
            "&:hover": {
              backgroundColor: "transparent",
            },
          }}
        >
          Add Manual
        </Button>
        <span
          style={{
            fontSize: "0.875rem",
            fontWeight: "bold",
            color: "#2c72d8",
          }}
        >
          |
        </span>
        <Button
          variant="text"
          size="small"
          onClick={onUploadFile}
          disabled={!selectedCompany}
          sx={{
            fontSize: "0.875rem",
            "&:hover": {
              backgroundColor: "transparent",
            },
          }}
        >
          Upload File
        </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default Header;
