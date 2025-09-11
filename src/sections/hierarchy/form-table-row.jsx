import { useState } from 'react';
import PropTypes from 'prop-types';

import Popover from '@mui/material/Popover';
import TableRow from '@mui/material/TableRow';
import MenuItem from '@mui/material/MenuItem';
import TableCell from '@mui/material/TableCell';

import Iconify from 'src/components/iconify';
import { fDate } from 'src/utils/format-time';

const statusColors = {
  pending: '#DFEDFF',
  complete: '#EAFFEF',
  assigned: '#FFF4D3',
  'not assigned': 'white',
  cancelled: '#FFE6E3',
};

export default function FormTableRow({
  createdAt,
  slNo,
  status,
  requesterEmail,
  totalRecipients,
  recipientOne,
  recipientOneStatus,
  recipientOneIssueDate,
  recipientOneResponseDate,
  recipientOneComment,
  recipientTwo,
  recipientTwoStatus,
  recipientTwoIssueDate,
  recipientTwoResponseDate,
  recipientTwoComment,
  recipientThree,
  recipientThreeStatus,
  recipientThreeIssueDate,
  recipientThreeResponseDate,
  recipientThreeComment,
  recipientFour,
  recipientFourStatus,
  recipientFourIssueDate,
  recipientFourResponseDate,
  recipientFourComment,
  recipientFive,
  recipientFiveStatus,
  recipientFiveIssueDate,
  recipientFiveResponseDate,
  recipientFiveComment,
  recipientSix,
  recipientSixStatus,
  recipientSixIssueDate,
  recipientSixResponseDate,
  recipientSixComment,

  onClick,
  tab,
}) {
  const [open, setOpen] = useState(null);

  const handleCloseMenu = () => {
    setOpen(null);
  };

  return (
    <>
      <TableRow tabIndex={-1} sx={{ cursor: 'pointer' }}>
        <TableCell>{fDate(createdAt)}</TableCell>
        <TableCell>{slNo}</TableCell>
        <TableCell>{status}</TableCell>
        <TableCell>{requesterEmail}</TableCell>
        <TableCell>{totalRecipients}</TableCell>
        <TableCell>{recipientOne}</TableCell>
        <TableCell>{recipientOneStatus}</TableCell>
        <TableCell>{fDate(recipientOneIssueDate)}</TableCell>
        <TableCell>{fDate(recipientOneResponseDate)}</TableCell>
        <TableCell>{recipientOneComment}</TableCell>
        <TableCell>{recipientTwo}</TableCell>
        <TableCell>{recipientTwoStatus}</TableCell>
        <TableCell>{fDate(recipientTwoIssueDate)}</TableCell>
        <TableCell>{fDate(recipientTwoResponseDate)}</TableCell>
        <TableCell>{recipientTwoComment}</TableCell>
        <TableCell>{recipientThree}</TableCell>
        <TableCell>{recipientThreeStatus}</TableCell>
        <TableCell>{fDate(recipientThreeIssueDate)}</TableCell>
        <TableCell>{fDate(recipientThreeResponseDate)}</TableCell>
        <TableCell>{recipientThreeComment}</TableCell>
        <TableCell>{recipientFour}</TableCell>
        <TableCell>{recipientFourStatus}</TableCell>
        <TableCell>{fDate(recipientFourIssueDate)}</TableCell>
        <TableCell>{fDate(recipientFourResponseDate)}</TableCell>
        <TableCell>{recipientFourComment}</TableCell>
        <TableCell>{recipientFive}</TableCell>
        <TableCell>{recipientFiveStatus}</TableCell>
        <TableCell>{fDate(recipientFiveIssueDate)}</TableCell>
        <TableCell>{fDate(recipientFiveResponseDate)}</TableCell>
        <TableCell>{recipientFiveComment}</TableCell>
        <TableCell>{recipientSix}</TableCell>
        <TableCell>{recipientSixStatus}</TableCell>
        <TableCell>{fDate(recipientSixIssueDate)}</TableCell>
        <TableCell>{fDate(recipientSixResponseDate)}</TableCell>
        <TableCell>{recipientSixComment}</TableCell>
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
  createdAt: PropTypes.string,
  slNo: PropTypes.string,
  requesterEmail: PropTypes.string,
  totalRecipients: PropTypes.string,
  recipientOne: PropTypes.string,
  recipientOneStatus: PropTypes.string,
  recipientOneIssueDate: PropTypes.string,
  recipientOneResponseDate: PropTypes.string,
  recipientOneComment: PropTypes.string,
  recipientTwo: PropTypes.string,
  recipientTwoStatus: PropTypes.string,
  recipientTwoIssueDate: PropTypes.string,
  recipientTwoResponseDate: PropTypes.string,
  recipientTwoComment: PropTypes.string,
  recipientThree: PropTypes.string,
  recipientThreeStatus: PropTypes.string,
  recipientThreeIssueDate: PropTypes.string,
  recipientThreeResponseDate: PropTypes.string,
  recipientThreeComment: PropTypes.string,
  recipientFour: PropTypes.string,
  recipientFourStatus: PropTypes.string,
  recipientFourIssueDate: PropTypes.string,
  recipientFourResponseDate: PropTypes.string,
  recipientFourComment: PropTypes.string,
  recipientFive: PropTypes.string,
  recipientFiveStatus: PropTypes.string,
  recipientFiveIssueDate: PropTypes.string,
  recipientFiveResponseDate: PropTypes.string,
  recipientFiveComment: PropTypes.string,
  recipientSix: PropTypes.string,
  recipientSixStatus: PropTypes.string,
  recipientSixIssueDate: PropTypes.string,
  recipientSixResponseDate: PropTypes.string,
  recipientSixComment: PropTypes.string,

  // onClick: PropTypes.func,
  // tab: PropTypes.string,
};
