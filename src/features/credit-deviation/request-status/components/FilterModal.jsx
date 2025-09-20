import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { MenuItem } from '@mui/material';
import { RxCross2 } from 'react-icons/rx';

function FilterModal({
  handleClose,
  open,
  setRegion,
  setStatus,
  setRefund,
  setStartDate,
  setEndDate,
  regionData,
}) {
  const style = {
    position: 'absolute',
    top: '50%',
    right: '-12%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    borderRadius: 5,
    pt: 10,
    pb: 10,
    pl: 4,
    pr: 4,
  };

  const [region, setRegionInput] = React.useState('');
  const [status, setStatusInput] = React.useState('');
  const [refundInput, setRefundInput] = React.useState('');
  const [startDateInput, setStartDateInput] = React.useState();
  const [endDateInput, setEndDateInput] = React.useState();

  const handleApplyFilters = () => {
    setRegion(region); // Update the parent component with the region value
    setStatus(status);
    setRefund(refundInput);
    setStartDate(startDateInput);
    setEndDate(endDateInput);

    handleClose(); // Close the modal
  };

  const handleClearFilters = () => {
    setRegion('');
    setRefund('');
    setStatus('');
    setStartDate('');
    setEndDate('');
    setRegionInput('');
    setStatusInput('');
    setRefundInput('');
    setStartDateInput('');
    setEndDateInput('');
    handleClose();
  };

  const statusData = [
    { id: 1, label: 'Pending', value: 'Pending' },
    { id: 2, label: 'Approved', value: 'Approved' },
    { id: 3, label: 'Declined', value: 'Declined' },
  ];

  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography
            id="modal-modal-title"
            sx={{
              display: 'flex',
              alignItems: 'center',
              textAlign: 'center',
              justifyContent: 'space-between',
            }}
          >
            <span style={{ fontSize: '40px', fontWeight: 'bolder' }}>Filter</span>
            <RxCross2
              onClick={handleClearFilters}
              style={{
                color: '#B22222',
                fontWeight: 'bolder',
                cursor: 'pointer',
                height: '40px',
                width: '10%',
              }}
            />
          </Typography>
          <Box
            component="form"
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              mt: 2,
            }}
            noValidate
            autoComplete="off"
          >
            <Typography sx={{ fontSize: '13px' }} id="modal-modal-title">
              Date range for request raise
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '5px', gap: '10px' }}>
              {/* Start Date Input */}
              <TextField
                id="start-date"
                label="Start Date"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={startDateInput}
                onChange={(e) => setStartDateInput(e.target.value)} // Update startDate state
                fullWidth
              />

              {/* End Date Input */}
              <TextField
                id="end-date"
                label="End Date"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={endDateInput}
                onChange={(e) => setEndDateInput(e.target.value)} // Update endDate state
                fullWidth
              />
            </Box>
            {/* Status */}
            <TextField
              id="status"
              label="Status"
              select
              value={status}
              onChange={(e) => setStatusInput(e.target.value)}
              fullWidth
            >
              {statusData?.map((item) => (
                <MenuItem key={item.id} value={item.value}>
                  {item.label}
                </MenuItem>
              ))}
            </TextField>

            {/* Region Input */}
            <TextField
              id="region"
              label="Region"
              select
              value={region}
              onChange={(e) => setRegionInput(e.target.value)}
              fullWidth
            >
              {regionData?.map((regionItem) => (
                <MenuItem key={regionItem._id} value={regionItem.value}>
                  {regionItem.value}
                </MenuItem>
              ))}
            </TextField>

            {/* Request-wise Input */}
            <TextField
              id="refund"
              label="Refund"
              select
              placeholder="Enter refund"
              value={refundInput}
              onChange={(e) => setRefundInput(e.target.value)}
              fullWidth
            >
              <MenuItem value="other">Other</MenuItem>
              <MenuItem value="online">Online</MenuItem>
            </TextField>

            {/* Submit Button */}
            <Button
              sx={{ marginTop: '30px', height: '50px' }}
              variant="contained"
              color="primary"
              onClick={handleApplyFilters} // Call the handler on button click
            >
              Apply Filters
            </Button>
            <Button
              sx={{ height: '50px' }}
              variant="outlined"
              color="secondary"
              onClick={handleClearFilters} // Reset all states
            >
              Clear Filters
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}

export default FilterModal;
