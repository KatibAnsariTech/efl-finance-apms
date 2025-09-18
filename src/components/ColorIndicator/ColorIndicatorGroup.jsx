import PropTypes from 'prop-types';
import { Box } from '@mui/material';
import ColorIndicator from './ColorIndicator';
import { getStatusColor, getStatusLabel, COLOR_GROUPS } from '../../constants/colors';

// ColorIndicatorGroup component - Renders a group of color indicators
const ColorIndicatorGroup = ({ 
  statuses = [], 
  groupName, 
  size = 18, 
  gap = 1, 
  justifyContent = 'center',
  marginLeft = 2,
  sx = {},
  ...props 
}) => {
  // If groupName is provided, use predefined color group
  const statusList = groupName ? 
    statuses.length > 0 ? statuses : COLOR_GROUPS[groupName]?.colors || [] :
    statuses;

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent,
        gap,
        marginLeft,
        ...sx,
      }}
      {...props}
    >
      {statusList.map((status, index) => (
        <ColorIndicator
          key={`${status}-${index}`}
          color={getStatusColor(status)}
          label={getStatusLabel(status)}
          size={size}
        />
      ))}
    </Box>
  );
};

ColorIndicatorGroup.propTypes = {
  statuses: PropTypes.arrayOf(PropTypes.string),
  groupName: PropTypes.oneOf(['approval', 'hierarchy', 'customDuty', 'alerts']),
  size: PropTypes.number,
  gap: PropTypes.number,
  justifyContent: PropTypes.string,
  marginLeft: PropTypes.number,
  sx: PropTypes.object,
};

export default ColorIndicatorGroup;
