import React from 'react';
import PropTypes from 'prop-types';

import Card from '@mui/material/Card';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import CardHeader from '@mui/material/CardHeader';
import FormControl from '@mui/material/FormControl';
import { styled, useTheme } from '@mui/material/styles';
import CircularProgress from '@mui/material/CircularProgress';

import { fNumber } from 'src/utils/format-number';

import Chart, { useChart } from 'src/components/chart';

const CHART_HEIGHT = 400;
const LEGEND_HEIGHT = 72;

const StyledChart = styled(Chart)(({ theme }) => ({
  height: CHART_HEIGHT,
  '& .apexcharts-canvas, .apexcharts-inner, svg, foreignObject': {
    height: `100% !important`,
  },
  '& .apexcharts-legend': {
    height: LEGEND_HEIGHT,
    borderTop: `dashed 1px ${theme.palette.divider}`,
    top: `calc(${CHART_HEIGHT - LEGEND_HEIGHT}px) !important`,
  },
}));

export default function AppCurrentVisits({
  title,
  subheader,
  chart,
  filter,
  setFilter,
  loading,
  ...other
}) {
  const theme = useTheme();
  const { colors, series, options } = chart;

  const handleChange = (event) => {
    setFilter(event.target && event.target.value);
  };

  const chartSeries = series?.map((i) => i?.value);

  const chartOptions = useChart({
    chart: {
      sparkline: {
        enabled: true,
      },
    },
    colors,
    labels: series?.map((i) => i.label),
    stroke: {
      colors: [theme.palette.background.paper],
    },
    legend: {
      floating: true,
      position: 'bottom',
      horizontalAlign: 'center',
    },
    dataLabels: {
      enabled: true,
      dropShadow: {
        enabled: false,
      },
    },
    tooltip: {
      fillSeriesColor: false,
      y: {
        formatter: (value) => fNumber(value),
        title: {
          formatter: (seriesName) => `${seriesName}`,
        },
      },
    },
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: false,
          },
        },
      },
    },
    ...options,
  });

  return (
    <Card {...other}>
      <FormControl
        variant="standard"
        sx={{ m: 1, minWidth: 80, position: 'absolute', top: '2%', left: '70%' }}
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
      <CardHeader title={title} subheader={subheader} sx={{ mb: 5, maxWidth: '78%' }} />
      {loading ? (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: CHART_HEIGHT,
          }}
        >
          <CircularProgress />
        </div>
      ) : (
        <>
          {chartSeries.every((value) => value === 0) ? (
            <div style={{ textAlign: 'center', padding: '20px' }}>No data available</div>
          ) : (
            <StyledChart
              dir="ltr"
              type="pie"
              series={chartSeries}
              options={chartOptions}
              width="100%"
              height={280}
            />
          )}
        </>
      )}
    </Card>
  );
}

AppCurrentVisits.propTypes = {
  chart: PropTypes.object,
  subheader: PropTypes.string,
  title: PropTypes.string,
  filter: PropTypes.string,
  setFilter: PropTypes.func,
  loading: PropTypes.bool,
};
