import React from 'react';
import PropTypes from 'prop-types';
import Toolbar from '@mui/material/Toolbar';
import { Input } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';

import Iconify from 'src/components/iconify';

function FormTableToolbar({ search, onFilterChange }) {
  return (
    <Toolbar>
      <Input
        value={search}
        onChange={(e) => onFilterChange('search', e.target.value)}
        placeholder="Search"
        startAdornment={
          <InputAdornment position="start">
            <Iconify icon="eva:search-fill" />
          </InputAdornment>
        }
      /> 
    </Toolbar>
  );
}

FormTableToolbar.propTypes = {
  search: PropTypes.string.isRequired,
  onFilterChange: PropTypes.func.isRequired,
};

export default FormTableToolbar;
