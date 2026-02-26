import React from 'react';
import { Snackbar, Alert, Slide } from '@mui/material';

function SlideTransition(props) {
  return <Slide {...props} direction="up" />;
}

const Toast = ({
  open = false,
  message = '',
  severity = 'info',
  duration = 3000,
  onClose = () => {},
}) => {
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    onClose();
  };

  return (
    <Snackbar
      open={open}
      autoHideDuration={duration}
      onClose={handleClose}
      anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      TransitionComponent={SlideTransition}
      sx={{
        bottom: { xs: 80, sm: 24 },
      }}
    >
      <Alert
        onClose={handleClose}
        severity={severity}
        variant="filled"
        sx={{
          width: '100%',
          borderRadius: 3,
          fontWeight: 500,
          boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
        }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default Toast;
