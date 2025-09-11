import React from 'react';
import {
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,
  Button, Table, TableBody, TableCell, TableRow, Box, Typography, CircularProgress, Paper
} from '@mui/material';
import Lottie from 'lottie-react';

const warningAnimation = '/assets/lottie/warning.json';
const checkmarkAnimation = '/assets/lottie/checkmark.json';

export default function ConfirmDialog({
  open, onClose, onConfirm, selectedFY, selectedMonth, amount, region,channel,amountInWords, loading, status = "warning", requestType,channelLabel,regionLabel
}) {
  const animation = status === "success" ? checkmarkAnimation : warningAnimation;
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          minWidth: 500,
          borderRadius: 4,
          background: 'linear-gradient(135deg, #f0fdfa 0%, #e0e7ff 100%)',
          boxShadow: 12,
          p: 2
        }
      }}
    >
      <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 700, fontSize: '1.2rem'}}>
        <Lottie
          autoplay
          loop={false}
          path={animation}
          style={{ height: 35, width: 35 }}
        />
        Confirm Submission
      </DialogTitle>
      <DialogContent sx={{ overflow: 'hidden' }}>
        <DialogContentText sx={{ mb: 1, fontSize: '0.9rem', color: 'text.secondary' ,mb:2 }}>
          Please review your submission details below:
        </DialogContentText>
        <Paper elevation={2} sx={{ mb: 2, borderRadius: 2, background: '#f8fafc', boxShadow: 1, overflow: 'hidden' }}>
          <Table size="small">
            <TableBody>
                <TableRow>
                  <TableCell component="th" scope="row" sx={{ fontWeight: 600, fontSize: '0.8rem', background: '#f1f5f9', border: 0, minWidth: 180, verticalAlign: 'middle', p: 1, pl: 2, borderTopLeftRadius: 12 }}>
                    Request Type
                  </TableCell>
                  <TableCell sx={{ border: 0, verticalAlign: 'middle', p: 1, fontSize: '0.8rem', borderTopRightRadius: 12 }}>{requestType}</TableCell>
              </TableRow>
              <TableRow>
                  <TableCell component="th" scope="row" sx={{ fontWeight: 600, background: '#f1f5f9', border: 0, minWidth: 180, verticalAlign: 'middle', p: 1, pl: 2, fontSize: '0.8rem' }}>
                    Channel
                  </TableCell>
                  <TableCell sx={{ border: 0, verticalAlign: 'middle', p: 1, fontSize: '0.8rem' }}>{channelLabel}</TableCell>
              </TableRow>
              <TableRow>
                  <TableCell component="th" scope="row" sx={{ fontWeight: 600, background: '#f1f5f9', border: 0, minWidth: 180, verticalAlign: 'middle', p: 1, pl: 2, fontSize: '0.8rem' }}>
                    Region
                  </TableCell>
                  <TableCell sx={{ border: 0, verticalAlign: 'middle', p: 1, fontSize: '0.8rem' }}>{regionLabel}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row" sx={{ fontWeight: 600, background: '#f1f5f9', border: 0, minWidth: 180, verticalAlign: 'middle', p: 1, pl: 2, fontSize: '0.8rem' }}>
                  Financial Year
                </TableCell>
                <TableCell sx={{ border: 0, verticalAlign: 'middle', p: 1, fontSize: '0.8rem' }}>{selectedFY}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row" sx={{ fontWeight: 600, background: '#f1f5f9', border: 0, minWidth: 180, verticalAlign: 'middle', p: 1, pl: 2, fontSize: '0.8rem' }}>
                  Month
                </TableCell>
                <TableCell sx={{ border: 0, verticalAlign: 'middle', p: 1, fontSize: '0.8rem' }}>{selectedMonth}</TableCell>
              </TableRow>
              <TableRow>
                <TableCell component="th" scope="row" sx={{ fontWeight: 600, background: '#f1f5f9', border: 0, minWidth: 180, verticalAlign: 'middle', p: 1, pl: 2, fontSize: '0.8rem', borderBottomLeftRadius: 12 }}>
                  Amount
                </TableCell>
                <TableCell sx={{ border: 0, fontWeight: 700, fontSize: '1rem', color: '#0ea5e9', verticalAlign: 'middle', p: 1, fontSize: '0.8rem', borderBottomRightRadius: 12 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    ₹ {amount}
                    {amountInWords && (
                      <Typography
                        variant="caption"
                        sx={{ display: 'block', fontWeight: 400, fontSize: '0.85rem', color: '#64748b', mt: 0.5 }}
                      >
                        {`(${amountInWords})`}
                      </Typography>
                    )}
                  </Box>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </Paper>
      </DialogContent>
      <DialogActions sx={{ p: 1, justifyContent: 'flex-end', gap: 2,mt: 1 }}>
        <Button onClick={onClose} sx={{minHeight:50, borderRadius: 3, px: 4, fontWeight: 500, fontSize: '1rem', color: '#64748b', background: '#f1f5f9', '&:hover': { background: '#e2e8f0' } }}>Cancel</Button>
        <Button variant="contained" disabled={loading} onClick={onConfirm} sx={{minHeight:50, width:140, borderRadius: 3, fontWeight: 600, fontSize: '1.1rem', background: '#1878f3', color: '#fff', boxShadow: 2, '&:hover': { background: '#1878f3', boxShadow: 4 } }}>
          {loading ? <CircularProgress size={24} color="inherit" /> : 'Confirm'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}