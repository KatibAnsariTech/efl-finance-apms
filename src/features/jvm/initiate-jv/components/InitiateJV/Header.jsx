import { Box, Button, IconButton } from "@mui/material";
import Iconify from "src/components/iconify/iconify";

const Header = ({ 
  showInfoText, 
  onToggleInfoText, 
  onAddManual, 
  onUploadFile 
}) => {
  return (
    <Box sx={{ mb: 0 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          alignItems: "center",
          gap: 0.2,
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
  );
};

export default Header;
