import { Box, Button, Typography, FormControl, Select, MenuItem, CircularProgress } from "@mui/material";

const Footer = ({
  autoReversal,
  setAutoReversal,
  reversalReason,
  setReversalReason,
  onSubmitRequest,
  submitting,
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexDirection: { xs: "column", sm: "row" },
        gap: { xs: 2, sm: 0 },
        minHeight: { xs: "auto", sm: "60px" },
        mt: { xs: 1, xl: 2 },
      }}
    >
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          width: { xs: "100%", sm: "auto" },
          justifyContent: { xs: "center", sm: "flex-start" },
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography
              variant="body2"
              sx={{
                fontSize: { xs: "0.8rem", sm: "0.875rem" },
                whiteSpace: "nowrap",
                fontWeight: 500,
              }}
            >
              Auto-reversal this transaction:
            </Typography>
            <FormControl
              sx={{
                minWidth: 80,
                "& .MuiOutlinedInput-root": {
                  height: "40px",
                },
              }}
            >
              <Select
                value={autoReversal}
                onChange={(e) => setAutoReversal(e.target.value)}
                displayEmpty
                sx={{
                  fontSize: { xs: "0.8rem", sm: "0.875rem" },
                }}
              >
                <MenuItem value="Yes">Yes</MenuItem>
                <MenuItem value="No">No</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {autoReversal === "Yes" && (
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                minWidth: 300,
              }}
            >
              <Typography
                variant="body2"
                sx={{
                  fontSize: { xs: "0.8rem", sm: "0.875rem" },
                  whiteSpace: "nowrap",
                  fontWeight: 500,
                }}
              >
                Reversal Reason:
              </Typography>
              <FormControl
                sx={{
                  minWidth: 120,
                  "& .MuiOutlinedInput-root": {
                    height: "40px",
                  },
                }}
              >
                <Select
                  value={reversalReason}
                  onChange={(e) => setReversalReason(e.target.value)}
                  displayEmpty
                  sx={{
                    fontSize: { xs: "0.8rem", sm: "0.875rem" },
                  }}
                >
                  <MenuItem value="">Select Reason</MenuItem>
                  <MenuItem value="01">01 - Existing Posting</MenuItem>
                  <MenuItem value="02">02 - New Posting Date</MenuItem>
                </Select>
              </FormControl>
            </Box>
          )}
        </Box>
      </Box>

      <Button
        variant="contained"
        color="primary"
        onClick={onSubmitRequest}
        disabled={submitting}
        sx={{
          px: { xs: 2, sm: 3 },
          py: { xs: 1.5, sm: 1 },
          fontSize: { xs: "0.8rem", sm: "0.875rem" },
          fontWeight: "bold",
          width: { xs: "100%", sm: "auto" },
          minWidth: { xs: "auto", sm: "240px" },
        }}
      >
        {submitting ? (
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <CircularProgress size={16} color="inherit" />
            Submitting...
          </Box>
        ) : (
          "Submit Request"
        )}
      </Button>
    </Box>
  );
};

export default Footer;
