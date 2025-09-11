import { Box, Tooltip } from '@mui/material';

// Custom circle component for displaying each color with "Complete" on hover
const ColorCircle = ({ color, label }) => (
  <Tooltip title={label} arrow>
    {/* Showing "Complete" on hover */}
    <Box
      sx={{
        width: '18px',
        height: '18px',
        backgroundColor: color,
        borderRadius: '50%',
        cursor: 'pointer',
        border: '1px solid rgba(0, 0, 0, 0.2)', // Light black border
      }}
    />
  </Tooltip>
);

// Main component to render all color indicators
const ColorIndicators = () => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      gap: 1,
      marginLeft: 2,
    }}
  >
    <ColorCircle color="white" label="Not assigned" />
    <ColorCircle color="#DFEDFF" label="Acknowledge" />
    <ColorCircle color="#FFF4D3" label="Assigned" />
    <ColorCircle color="#EAFFEF" label="Complete" />
    <ColorCircle color="#FFE6E3" label="Pending" />
  </Box>
);

export default ColorIndicators;
