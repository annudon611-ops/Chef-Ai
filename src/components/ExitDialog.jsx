import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
} from '@mui/material';
import {
  ExitToApp as ExitIcon,
  Restaurant as ChefIcon,
} from '@mui/icons-material';

/**
 * Exit confirmation dialog component
 */
const ExitDialog = ({ open, onClose, onConfirm }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          borderRadius: 4,
          padding: 2,
          maxWidth: 340,
          mx: 2,
        },
      }}
    >
      <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
            mb: 2,
          }}
        >
          <Box
            sx={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #2E7D32 0%, #66BB6A 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ChefIcon sx={{ fontSize: 32, color: 'white' }} />
          </Box>
        </Box>
        <Typography variant="h6" fontWeight={600} color="primary.dark">
          Leaving So Soon?
        </Typography>
      </DialogTitle>

      <DialogContent sx={{ textAlign: 'center', pb: 2 }}>
        <Typography variant="body1" color="text.secondary">
          Are you sure you want to exit Chef Al-Smart? Your unsaved progress
          will be lost.
        </Typography>
      </DialogContent>

      <DialogActions sx={{ justifyContent: 'center', gap: 2, pb: 2 }}>
        <Button
          variant="outlined"
          onClick={onClose}
          sx={{
            minWidth: 120,
            borderRadius: 3,
            borderWidth: 2,
            '&:hover': {
              borderWidth: 2,
            },
          }}
        >
          Stay
        </Button>
        <Button
          variant="contained"
          color="error"
          onClick={onConfirm}
          startIcon={<ExitIcon />}
          sx={{
            minWidth: 120,
            borderRadius: 3,
            background: 'linear-gradient(135deg, #D32F2F 0%, #F44336 100%)',
          }}
        >
          Exit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ExitDialog;
