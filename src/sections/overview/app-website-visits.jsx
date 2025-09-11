/* eslint-disable no-unused-vars */
/* eslint-disable unused-imports/no-unused-imports */
/* eslint-disable perfectionist/sort-imports */
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';

import Chart, { useChart } from 'src/components/chart';

// import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { useState } from 'react';

// ----------------------------------------------------------------------

export default function AppWebsiteVisits({ title, subheader, chart, filter, setFilter, ...other }) {
  const { labels, colors, series, options } = chart;

  const handleChange = (event) => {
    setFilter(event.target && event.target.value);
  };

  const chartOptions = useChart({
    colors,
    plotOptions: {
      bar: {
        columnWidth: '30%',
      },
    },
    fill: {
      type: 'gradient', // Change to gradient for area chart
    },
    labels,
    xaxis: {
      type: 'string',
    },
    tooltip: {
      shared: true,
      intersect: false,
      y: {
        formatter: (value) => {
          if (typeof value !== 'undefined') {
            return `${value?.toFixed(0)}`;
          }
          return value;
        },
      },
    },
    ...options,
  });

  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} />

      <FormControl
        variant="standard"
        sx={{ m: 1, minWidth: 80, position: 'absolute', top: '2%', left: '82%' }}
      >
        <Select
          labelId="filter-data-with-time-label"
          id="filter-data-with-time"
          value={filter}
          onChange={handleChange}
          label="filter"
          sx={{ fontSize: 14 }}
        >
          <MenuItem value="weekly">Weekly</MenuItem>
          <MenuItem value="monthly">Monthly</MenuItem>
          <MenuItem value="yearly">Yearly</MenuItem>
        </Select>
      </FormControl>

      <Box sx={{ p: 3, pb: 1 }}>
        <Chart
          dir="ltr"
          type="area" // Set chart type to area
          series={series}
          options={chartOptions}
          width="100%"
          height={364}
        />
      </Box>
    </Card>
  );
}

AppWebsiteVisits.propTypes = {
  chart: PropTypes.object,
  subheader: PropTypes.string,
  title: PropTypes.string,
  filter: PropTypes.string,
  setFilter: PropTypes.func,
};
