import { Box, Tooltip } from "@mui/material";

// Custom circle component for displaying each color with "Complete" on hover
const ColorCircle = ({ color, label }) => (
  <Tooltip title={label} arrow>
    {/* Showing "Complete" on hover */}
    <Box
      sx={{
        width: "18px",
        height: "18px",
        backgroundColor: color,
        borderRadius: "50%",
        cursor: "pointer",
        border: "1px solid rgba(0, 0, 0, 0.2)", // Light black border
      }}
    />
  </Tooltip>
);

// Main component to render all color indicators
const ColorIndicators = () => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "center",
      gap: 1,
      marginLeft: 2,
    }}
  >
    {/* Status color legend based on statusColorMap */}
    <ColorCircle color="#baf5c2" label="Approved" />
    <ColorCircle color="#f4f5ba" label="Pending" />
    <ColorCircle color="#9be7fa" label="Clarification Needed" />
    <ColorCircle color="#e6b2aa" label="Declined" />
  </Box>
);

export default ColorIndicators;
