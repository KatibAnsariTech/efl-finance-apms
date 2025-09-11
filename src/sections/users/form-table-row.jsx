import { useState } from 'react';
import PropTypes from 'prop-types';

import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';

import Iconify from 'src/components/iconify';
import { fDate, fDateTime } from 'src/utils/format-time';
import ActionButtons from './action-table-row';

const statusColors = {
  pending: '#DFEDFF',
  complete: '#EAFFEF',
  assigned: '#FFF4D3',
  'not assigned': 'white',
  cancelled: '#FFE6E3',
};

export default function FormTableRow({sno,username,email,userId, onDelete }) {
  const [open, setOpen] = useState(null);

  const handleCloseMenu = () => {
    setOpen(null);
  };

  return (
    <>
      <TableRow tabIndex={-1} >
        <TableCell sx={{textAlign:'center'}}>{sno}</TableCell>
        <TableCell>{username}</TableCell>
        <TableCell>{email}</TableCell>
        <TableCell>
          <ActionButtons userId={userId} onDelete={onDelete} />
        </TableCell>
      </TableRow>

      {/* Popover Menu */}
      <Popover
        open={!!open}
        anchorEl={open}
        onClose={handleCloseMenu}
        anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        PaperProps={{
          sx: { width: 140 },
        }}
      >
        <MenuItem onClick={handleCloseMenu}>
          <Iconify icon="eva:edit-fill" sx={{ mr: 2 }} />
          Edit
        </MenuItem>

        <MenuItem onClick={handleCloseMenu} sx={{ color: 'error.main' }}>
          <Iconify icon="eva:trash-2-outline" sx={{ mr: 2 }} />
          Delete
        </MenuItem>
      </Popover>
    </>
  );
}

FormTableRow.propTypes = {
  sno: PropTypes.string,
  username: PropTypes.string,
  email: PropTypes.string,
  // onClick: PropTypes.func,
  // tab: PropTypes.string,
};
