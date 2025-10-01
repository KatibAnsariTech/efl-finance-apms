import { Paper, Typography } from "@mui/material";
import Iconify from "src/components/iconify/iconify";

const EmptyState = () => {
  return (
    <Paper
      sx={{
        p: 6,
        textAlign: "center",
        backgroundColor: "#fafafa",
        borderRadius: 2,
        m: 2,
      }}
    >
      <Iconify
        icon="eva:folder-outline"
        sx={{
          width: 48,
          height: 48,
          color: "text.disabled",
        }}
      />
      <Typography
        variant="h6"
        color="text.secondary"
        gutterBottom
        sx={{ fontSize: "1rem" }}
      >
        No Data
      </Typography>
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ fontSize: "0.875rem" }}
      >
        No journal voucher entries found. Click "Add Manual" or
        "Upload File" to get started.
      </Typography>
    </Paper>
  );
};

export default EmptyState;
