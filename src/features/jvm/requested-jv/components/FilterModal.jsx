import * as React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import { RxCross2 } from 'react-icons/rx';

function FilterModal({
  handleClose,
  open,
  setStartDate,
  setEndDate,
}) {
  const style = {
    position: 'absolute',
    top: 0,
    right: 0,
    height: '100vh',
    width: 400,
    maxWidth: '90vw',
    bgcolor: 'background.paper',
    borderRadius: '16px 0 0 16px',
    boxShadow: 24,
    pt: 4,
    pb: 4,
    pl: 4,
    pr: 4,
    outline: 'none',
    display: 'flex',
    flexDirection: 'column',
  };

  const [startDateInput, setStartDateInput] = React.useState();
  const [endDateInput, setEndDateInput] = React.useState();

  const handleApplyFilters = () => {
    // Only validate date range if both dates are provided
    if (startDateInput && endDateInput && new Date(startDateInput) > new Date(endDateInput)) {
      alert('Start date cannot be later than end date.');
      return;
    }

    setStartDate(startDateInput);
    setEndDate(endDateInput);

    handleClose(); // Close the modal
  };

  const handleClearFilters = () => {
    setStartDate('');
    setEndDate('');
    setStartDateInput('');
    setEndDateInput('');
    handleClose();
  };


  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        sx={{
          display: 'flex',
          alignItems: 'stretch',
          justifyContent: 'flex-end',
        }}
      >
        <Box sx={style}>
          <Typography
            id="modal-modal-title"
            variant="h5"
            component="h2"
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              mb: 3,
              fontWeight: 600,
              color: 'text.primary',
            }}
          >
            Filter
            <IconButton
              onClick={handleClose}
              sx={{
                color: 'text.secondary',
                '&:hover': {
                  color: 'error.main',
                  backgroundColor: 'error.light',
                },
                p: 1,
              }}
            >
              <RxCross2 size={20} />
            </IconButton>
          </Typography>
          <Box
            component="form"
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              flex: 1,
              overflow: 'auto',
            }}
            noValidate
            autoComplete="off"
          >
            <Box sx={{ 
              display: 'flex', 
              alignItems: 'flex-start', 
              gap: 2,
              mb: 3,
              mt: 2,
            }}>
              <TextField
                id="start-date"
                label="Start Date"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={startDateInput}
                onChange={(e) => setStartDateInput(e.target.value)}
                fullWidth
                size="small"
                helperText={startDateInput && endDateInput && new Date(startDateInput) > new Date(endDateInput) ? "Start date cannot be later than end date" : ""}
                error={startDateInput && endDateInput && new Date(startDateInput) > new Date(endDateInput)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
              />

              <TextField
                id="end-date"
                label="End Date"
                type="date"
                InputLabelProps={{ shrink: true }}
                value={endDateInput}
                onChange={(e) => setEndDateInput(e.target.value)}
                fullWidth
                size="small"
                helperText={startDateInput && endDateInput && new Date(startDateInput) > new Date(endDateInput) ? "End date cannot be earlier than start date" : ""}
                error={startDateInput && endDateInput && new Date(startDateInput) > new Date(endDateInput)}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  },
                }}
              />
            </Box>

            <Box sx={{ 
              display: 'flex', 
              gap: 2, 
              justifyContent: 'flex-end',
              mt: 'auto',
              pt: 3,
            }}>
              <Button
                variant="outlined"
                onClick={handleClearFilters}
                sx={{
                  minWidth: 120,
                  height: 40,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 500,
                }}
              >
                Clear
              </Button>
              <Button
                variant="contained"
                onClick={handleApplyFilters}
                sx={{
                  minWidth: 120,
                  height: 40,
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 500,
                }}
              >
                Apply Filters
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
    </div>
  );
}

export default FilterModal;
