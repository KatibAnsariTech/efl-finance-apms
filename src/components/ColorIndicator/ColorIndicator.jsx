import PropTypes from 'prop-types';
import { Box, Tooltip } from '@mui/material';

// ColorIndicator component - A reusable color indicator with tooltip
const ColorIndicator = ({ 
  color, 
  label, 
  size = 18, 
  showBorder = true, 
  cursor = 'pointer',
  sx = {},
  ...props 
}) => (
  <Tooltip title={label} arrow>
    <Box
      sx={{
        width: size,
        height: size,
        backgroundColor: color,
        borderRadius: '50%',
        cursor: cursor,
        ...(showBorder && {
          border: '1px solid rgba(0, 0, 0, 0.2)',
        }),
        ...sx,
      }}
      {...props}
    />
  </Tooltip>
);

ColorIndicator.propTypes = {
  color: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  size: PropTypes.number,
  showBorder: PropTypes.bool,
  cursor: PropTypes.string,
  sx: PropTypes.object,
};

export default ColorIndicator;
