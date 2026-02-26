import React from 'react';
import { Snackbar, Alert, Slide } from '@mui/material';

/**
 * Slide transition for toast
 */
function SlideTransition(props) {
  return <Slide {...props} direction="up" />;
}

/**
 * Toast component for showing notifications
 */
const Toast = ({
  open,
  message,
  severity = 'info',
  duration = 3000,
  onClose,
  position = { vertical: 'bottom', horizontal: 'center' },
}) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={duration}
      onClose={onClose}
      anchorOrigin={position}
      TransitionComponent={SlideTransition}
      sx={{
        bottom: { xs: 80, sm: 24 },
      }}
    >
      <Alert
        onClose={onClose}
        severity={severity}
        variant="filled"
        sx={{
          width: '100%',
          borderRadius: 3,
          fontWeight: 500,
          boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
          '& .MuiAlert-icon': {
            fontSize: 24,
          },
        }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default Toast;
