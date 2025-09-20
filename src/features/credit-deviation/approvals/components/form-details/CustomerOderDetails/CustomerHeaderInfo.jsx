import { Box, Typography, Stack, Button, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useAccount } from "src/hooks/use-account";
import CloseButton from "src/routes/components/CloseButton";

const CustomerHeaderInfo = ({ data }) => {
  const navigate = useNavigate();
  const onCancel = () => {
    navigate(-1);
  };
  return (
    <Paper
      elevation={6}
      sx={{
        p: 2,
        mb: 3,
        borderRadius: 2,
        display: "flex",
        justifyContent: "space-between",
        flexWrap: "wrap",
      }}
    >
      <Box sx={{ display: "flex", flexDirection: "column", width: "60%" }}>
        <Stack direction="row" spacing={1} flexWrap="wrap">
          <Typography variant="body2" fontSize="0.75rem">
            <b>Requestor Code:</b> {data?.requesterId?.requesterNo || ""}
          </Typography>
          <Typography variant="body2" fontSize="0.75rem">
            |
          </Typography>
          <Typography variant="body2" fontSize="0.75rem">
            <b>Requestor Name:</b> {data?.requesterId?.username || ""}
          </Typography>
          <Typography variant="body2" fontSize="0.75rem">
            |
          </Typography>
          <Typography variant="body2" fontSize="0.75rem">
            <b>Designation:</b> {data?.requesterId?.requestType[0]?.value || ""}
          </Typography>
        </Stack>
        <Stack direction="row" spacing={1} flexWrap="wrap">
          <Typography variant="body2" fontSize="0.75rem">
            <b>Channel:</b> {data?.formId?.channel?.value || ""}
          </Typography>
          <Typography variant="body2" fontSize="0.75rem">
            |
          </Typography>
          <Typography variant="body2" fontSize="0.75rem">
            <b>Region:</b> {data?.formId?.region?.value || ""}
          </Typography>
          <Typography variant="body2" fontSize="0.75rem">
            |
          </Typography>
          <Typography variant="body2" fontSize="0.75rem">
            <b>Sales Office:</b> {data?.formId?.salesOffice?.value || ""}
          </Typography>
          <Typography variant="body2" fontSize="0.75rem">
            |
          </Typography>
          <Typography variant="body2" fontSize="0.75rem">
            <b>Sales Group:</b> {data?.formId?.salesGroup?.value || ""}
          </Typography>
        </Stack>
        <Stack direction="row" spacing={1}>
          <Typography variant="body2" fontSize="0.75rem">
            <b>Customer Code:</b> {data?.formId?.otherData?.CUSTOMER_CODE || ""}
          </Typography>
          <Typography variant="body2" fontSize="0.75rem">
            |
          </Typography>
          <Typography variant="body2" fontSize="0.75rem">
            <b>Customer Name:</b> {data?.formId?.otherData?.CUSTOMER_NAME || ""}
          </Typography>
        </Stack>
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", mr: 2 }}>
        <CloseButton onClick={onCancel} tooltip="Close" />
      </Box>
    </Paper>
  );
};

export default CustomerHeaderInfo;
