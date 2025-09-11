import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import { fShortenNumber } from 'src/utils/format-number';

// ----------------------------------------------------------------------

export default function AppWidgetSummary({ title, total, icon, color = 'primary', sx, ...other }) {
  return (
    <Card
      component={Stack}
      spacing={0}
      direction="row"
      sx={{
        px: 3,
        py: 2,
        borderRadius: 2,
        height: 120,
        cursor:"pointer",
        ...sx,
      }}
      {...other}
    >
      {icon && <Box sx={{ width: 64, height: 64 }}>{icon}</Box>}

      <Stack spacing={0.5}>
        <Typography variant="h4">{total>0 ? fShortenNumber(total): total}</Typography>

        <Typography
          variant="body1"
          sx={{ color: 'text.disabled', fontSize: '0.8rem', fontWeight: '600' }}
        >
          {title}
        </Typography>
      </Stack>
    </Card>
  );
}

AppWidgetSummary.propTypes = {
  color: PropTypes.string,
  icon: PropTypes.oneOfType([PropTypes.element, PropTypes.string]),
  sx: PropTypes.object,
  title: PropTypes.string,
  total: PropTypes.number,
};
