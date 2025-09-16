import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  DialogContentText,
  Box,
  Typography,
  Button,
  Card,
  Grid,
} from '@mui/material';
import Iconify from './iconify/iconify';

const ConfirmationModal = ({
  open,
  onClose,
  onConfirm,
  data,
  autoReversal,
  loading = false
}) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      PaperProps={{
        sx: {
          borderRadius: 3,
          boxShadow: 3,
          minHeight: 300,
          maxHeight: 350,
          width: "80%",
        }
      }}
    >
      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ p: 3 }}>
          <Typography 
            variant="h6" 
            sx={{ 
              fontSize: "1rem", 
              fontWeight: 500, 
              color: "text.primary",
              mb: 3
            }}
          >
            User Name:
          </Typography>

          <Card sx={{ 
            backgroundColor: "#f5f5f5", 
            borderRadius: 2, 
            p: 2.5, 
            mb: 3,
            boxShadow: "none"
          }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={3}>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontWeight: 500, 
                    mb: 1.5, 
                    color: "text.primary",
                    fontSize: "0.875rem"
                  }}
                >
                  Initiated Date
                </Typography>
                <Box sx={{ 
                  backgroundColor: "white", 
                  borderRadius: 1, 
                  p: 2,
                  border: "1px solid #e0e0e0",
                  minHeight: 40,
                  display: "flex",
                  alignItems: "center"
                }}>
                  <Typography variant="body2" color="text.secondary">
                    {new Date().toLocaleDateString()}
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={12} sm={3}>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontWeight: 500, 
                    mb: 1.5, 
                    color: "text.primary",
                    fontSize: "0.875rem"
                  }}
                >
                  Total Debit
                </Typography>
                <Box sx={{ 
                  backgroundColor: "white", 
                  borderRadius: 1, 
                  p: 2,
                  border: "1px solid #e0e0e0",
                  minHeight: 40,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between"
                }}>
                  <Typography variant="body2" color="text.secondary">
                    ₹{data.reduce((sum, item) => sum + (item.amount || 0), 0).toLocaleString()}
                  </Typography>
                  <Iconify icon="eva:arrow-ios-downward-fill" sx={{ fontSize: 16, color: "text.secondary" }} />
                </Box>
              </Grid>

              <Grid item xs={12} sm={3}>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontWeight: 500, 
                    mb: 1.5, 
                    color: "text.primary",
                    fontSize: "0.875rem"
                  }}
                >
                  Total Credit
                </Typography>
                <Box sx={{ 
                  backgroundColor: "white", 
                  borderRadius: 1, 
                  p: 2,
                  border: "1px solid #e0e0e0",
                  minHeight: 40,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between"
                }}>
                  <Typography variant="body2" color="text.secondary">
                    ₹{data.reduce((sum, item) => sum + (item.amount || 0), 0).toLocaleString()}
                  </Typography>
                  <Iconify icon="eva:arrow-ios-downward-fill" sx={{ fontSize: 16, color: "text.secondary" }} />
                </Box>
              </Grid>

              <Grid item xs={12} sm={3}>
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontWeight: 500, 
                    mb: 1.5, 
                    color: "text.primary",
                    fontSize: "0.875rem"
                  }}
                >
                  Auto Reversal
                </Typography>
                <Box sx={{ 
                  backgroundColor: "white", 
                  borderRadius: 1, 
                  p: 2,
                  border: "1px solid #e0e0e0",
                  minHeight: 40,
                  display: "flex",
                  alignItems: "center"
                }}>
                  <Typography variant="body2" color="text.secondary">
                    {autoReversal}
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </Card>

          <Box sx={{ 
            display: "flex", 
            justifyContent: "space-between", 
            alignItems: "center",
            mt: 2
          }}>
            <Typography 
              variant="body1" 
              sx={{ 
                fontSize: "1rem", 
                fontWeight: 500, 
                color: "text.primary" 
              }}
            >
              Please confirm your submission:
            </Typography>
            <Button
              onClick={onConfirm}
              variant="contained"
              disabled={loading}
              sx={{ 
                backgroundColor: "#4caf50",
                color: "white",
                borderRadius: 2,
                px: 4,
                py: 1.5,
                fontSize: "0.875rem",
                fontWeight: 600,
                textTransform: "none",
                minWidth: 200,
                "&:hover": {
                  backgroundColor: "#45a049",
                }
              }}
            >
              {loading ? "Submitting..." : "Submit Record: Confirmed"}
            </Button>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default ConfirmationModal;
