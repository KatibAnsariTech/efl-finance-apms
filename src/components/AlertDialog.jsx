import React, { useEffect, useRef, useState } from 'react';
import {
  Dialog, DialogActions, DialogContent, DialogTitle,
  Button, Box, Typography, LinearProgress, IconButton
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Lottie from 'lottie-react';

const ANIMATIONS = {
  success: '/assets/lottie/checkmark.json',
  warning: '/assets/lottie/warning.json',
  fail: '/assets/lottie/warning.json', // fallback to warning
};

const STATUS_LABELS = {
  success: 'Success',
  warning: 'Warning',
  fail: 'Failed',
};

const STATUS_COLORS = {
  success: '#22c55e',
  warning: '#f59e42',
  fail: '#ef4444',
};

export default function AlertDialog({
  open,
  status = 'warning',
  message = '',
  onClose,
  autoClose = true,
  duration = 4000,
}) {
  const [progress, setProgress] = useState(100);
  const timerRef = useRef();

  // Fix: always autoclose, and fix fail color
  useEffect(() => {
    if (!open) return;
    setProgress(100);
    // Always autoclose
    const start = Date.now();
    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - start;
      const percent = Math.max(0, 100 - (elapsed / duration) * 100);
      setProgress(percent);
      if (elapsed >= duration) {
        clearInterval(timerRef.current);
        onClose?.();
      }
    }, 50);
    return () => clearInterval(timerRef.current);
  }, [open, duration]);

  const handleClose = () => {
    clearInterval(timerRef.current);
    onClose?.();
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 4,
          background: 'linear-gradient(135deg, #f0fdfa 0%, #e0e7ff 100%)',
          boxShadow: 12,
          p: 2,
        },
      }}
    >
      <DialogTitle
        sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          fontWeight: 700,
          fontSize: '1.3rem',
          mb: 1,
          pb: 0,
          pt: 1,
          gap: 2,
        }}
      >
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 100, width: 100, flexShrink: 0 }}>
          <Lottie
            autoplay
            loop={true}
            path={ANIMATIONS[status]}
            style={{ height: 100, width: 100 }}
          />
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            width: '100%',
            justifyContent: 'flex-start',
            mt: 0,
            mb: 0,
            ml: 0,
          }}
        >
          <Typography sx={{ fontWeight: 700, fontSize: '2rem' }}>
            {STATUS_LABELS[status]}
          </Typography>
          <Box sx={{ flexGrow: 1 }} />
          {/* <IconButton onClick={handleClose} size="small" sx={{ ml: 1 }}>
            <CloseIcon />
          </IconButton> */}
        </Box>
      </DialogTitle>
      <DialogContent>
        <Typography sx={{ fontSize: '1.05rem', color: 'text.secondary', mb: 1 }}>{message}</Typography>
      </DialogContent>
      <DialogActions sx={{ p: 2, pt: 0, flexDirection: 'column', alignItems: 'stretch' }}>
        <Box sx={{ position: 'relative', width: '100%' }}>
          <Button
            onClick={handleClose}
            fullWidth
            sx={{
              borderRadius: 3,
              px: 4,
              py: 1.2,
              fontWeight: 600,
              fontSize: '1rem',
              background: status === 'fail'
                ? `linear-gradient(to left, #ef4444 ${progress}%, #ef4444 ${progress}%)`
                : `linear-gradient(to left, ${STATUS_COLORS[status]} ${progress}%, #17db14 ${progress}%)`,
              color: '#fff',
              boxShadow: 2,
              overflow: 'hidden',
              position: 'relative',
              transition: 'background 0.2s linear',
              '&:hover': {
                opacity: 0.85,
              },
            }}
          >
            Close {autoClose !== false && (
              <Typography component="span" sx={{ ml: 1, fontSize: '0.9em', fontWeight: 400 }}>
                ({Math.ceil((progress / 100) * (duration / 1000))}s)
              </Typography>
            )}
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
}