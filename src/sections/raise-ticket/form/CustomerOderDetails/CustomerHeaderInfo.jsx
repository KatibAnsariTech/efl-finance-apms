import { Box, Typography, Stack, Button, Paper } from "@mui/material";
import { useAccount } from "src/hooks/use-account";
import CloseButton from "src/routes/components/CloseButton";

const CustomerHeaderInfo = ({ onCancel, formData, customerDetails }) => {
  const customerInfo =
    customerDetails?.dmsCustomerDetails?.IS_CUSTOMER_ORD_DET?.IS_ORDER_DETAIL ||
    {};
  const user = useAccount();

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
            <b>Requestor Code:</b> {user?.requesterNo || ""}
          </Typography>
          <Typography variant="body2" fontSize="0.75rem">
            |
          </Typography>
          <Typography variant="body2" fontSize="0.75rem">
            <b>Requestor Name:</b> {user?.username || ""}
          </Typography>
          <Typography variant="body2" fontSize="0.75rem">
            |
          </Typography>
          <Typography variant="body2" fontSize="0.75rem">
            <b>Designation:</b>{" "}
            {(user && user?.requestType && user?.requestType[0]?.value) || ""}
          </Typography>
        </Stack>
        <Stack direction="row" spacing={1} flexWrap="wrap">
          <Typography variant="body2" fontSize="0.75rem">
            <b>Channel:</b> {formData?.channelObj?.value || ""}
          </Typography>
          <Typography variant="body2" fontSize="0.75rem">
            |
          </Typography>
          <Typography variant="body2" fontSize="0.75rem">
            <b>Region:</b> {formData?.regionObj?.value || ""}
          </Typography>
          <Typography variant="body2" fontSize="0.75rem">
            |
          </Typography>
          <Typography variant="body2" fontSize="0.75rem">
            <b>Sales Office:</b> {formData?.salesOfficeObj?.value || ""}
          </Typography>
          <Typography variant="body2" fontSize="0.75rem">
            |
          </Typography>
          <Typography variant="body2" fontSize="0.75rem">
            <b>Sales Group:</b> {formData?.salesGroupObj?.value || ""}
          </Typography>
        </Stack>
        <Stack direction="row" spacing={1}>
          <Typography variant="body2" fontSize="0.75rem">
            <b>Customer Code:</b> {customerInfo?.CUSTOMER_CODE || ""}
          </Typography>
          <Typography variant="body2" fontSize="0.75rem">
            |
          </Typography>
          <Typography variant="body2" fontSize="0.75rem">
            <b>Customer Name:</b> {customerInfo?.CUSTOMER_NAME || ""}
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
