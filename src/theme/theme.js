import { createTheme, alpha } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2E7D32',
      light: '#4CAF50',
      dark: '#1B5E20',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#81C784',
      light: '#A5D6A7',
      dark: '#66BB6A',
      contrastText: '#1B5E20',
    },
    accent: {
      main: '#FF9800',
      light: '#FFB74D',
      dark: '#F57C00',
      saffron: '#FF6F00',
    },
    background: {
      default: '#F1F8E9',
      paper: '#FFFFFF',
      gradient: 'linear-gradient(135deg, #F1F8E9 0%, #E8F5E9 100%)',
    },
    text: {
      primary: '#1B5E20',
      secondary: '#388E3C',
      disabled: '#A5D6A7',
    },
    success: {
      main: '#43A047',
      light: '#66BB6A',
      dark: '#2E7D32',
    },
    warning: {
      main: '#FF9800',
      light: '#FFB74D',
      dark: '#F57C00',
    },
    error: {
      main: '#D32F2F',
      light: '#EF5350',
      dark: '#C62828',
    },
    divider: 'rgba(46, 125, 50, 0.12)',
    action: {
      active: '#2E7D32',
      hover: 'rgba(46, 125, 50, 0.08)',
      selected: 'rgba(46, 125, 50, 0.14)',
      disabled: 'rgba(46, 125, 50, 0.26)',
      disabledBackground: 'rgba(46, 125, 50, 0.12)',
    },
  },
  typography: {
    fontFamily: '"Poppins", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2.5rem',
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: '-0.01562em',
    },
    h2: {
      fontSize: '2rem',
      fontWeight: 600,
      lineHeight: 1.3,
      letterSpacing: '-0.00833em',
    },
    h3: {
      fontSize: '1.75rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    h5: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.5,
    },
    h6: {
      fontSize: '1rem',
      fontWeight: 600,
      lineHeight: 1.6,
    },
    subtitle1: {
      fontSize: '1rem',
      fontWeight: 500,
      lineHeight: 1.75,
    },
    subtitle2: {
      fontSize: '0.875rem',
      fontWeight: 500,
      lineHeight: 1.57,
    },
    body1: {
      fontSize: '1rem',
      fontWeight: 400,
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      fontWeight: 400,
      lineHeight: 1.5,
    },
    button: {
      fontSize: '0.9375rem',
      fontWeight: 600,
      textTransform: 'none',
      letterSpacing: '0.02857em',
    },
    caption: {
      fontSize: '0.75rem',
      fontWeight: 400,
      lineHeight: 1.66,
    },
    overline: {
      fontSize: '0.75rem',
      fontWeight: 600,
      textTransform: 'uppercase',
      letterSpacing: '0.08333em',
    },
  },
  shape: {
    borderRadius: 16,
  },
  shadows: [
    'none',
    '0px 2px 4px rgba(46, 125, 50, 0.08)',
    '0px 4px 8px rgba(46, 125, 50, 0.08)',
    '0px 6px 12px rgba(46, 125, 50, 0.1)',
    '0px 8px 16px rgba(46, 125, 50, 0.1)',
    '0px 10px 20px rgba(46, 125, 50, 0.12)',
    '0px 12px 24px rgba(46, 125, 50, 0.12)',
    '0px 14px 28px rgba(46, 125, 50, 0.14)',
    '0px 16px 32px rgba(46, 125, 50, 0.14)',
    '0px 18px 36px rgba(46, 125, 50, 0.16)',
    '0px 20px 40px rgba(46, 125, 50, 0.16)',
    '0px 22px 44px rgba(46, 125, 50, 0.18)',
    '0px 24px 48px rgba(46, 125, 50, 0.18)',
    ...Array(12).fill('0px 24px 48px rgba(46, 125, 50, 0.18)'),
  ],
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarColor: '#81C784 #E8F5E9',
          '&::-webkit-scrollbar, & *::-webkit-scrollbar': {
            width: 6,
          },
          '&::-webkit-scrollbar-track, & *::-webkit-scrollbar-track': {
            background: '#E8F5E9',
            borderRadius: 3,
          },
          '&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb': {
            background: '#81C784',
            borderRadius: 3,
          },
        },
      },
    },
    MuiButton: {
      defaultProps: {
        disableElevation: false,
      },
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '12px 24px',
          fontSize: '1rem',
          fontWeight: 600,
          transition: 'all 0.3s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
          },
          '&:active': {
            transform: 'translateY(0)',
          },
        },
        contained: {
          boxShadow: '0px 4px 12px rgba(46, 125, 50, 0.3)',
          '&:hover': {
            boxShadow: '0px 6px 16px rgba(46, 125, 50, 0.4)',
          },
        },
        containedPrimary: {
          background: 'linear-gradient(135deg, #2E7D32 0%, #43A047 100%)',
          '&:hover': {
            background: 'linear-gradient(135deg, #1B5E20 0%, #2E7D32 100%)',
          },
        },
        outlined: {
          borderWidth: 2,
          '&:hover': {
            borderWidth: 2,
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 20,
          boxShadow: '0px 8px 24px rgba(46, 125, 50, 0.12)',
          background: 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(10px)',
          transition: 'all 0.3s ease',
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
        elevation1: {
          boxShadow: '0px 4px 12px rgba(46, 125, 50, 0.1)',
        },
        elevation2: {
          boxShadow: '0px 6px 16px rgba(46, 125, 50, 0.12)',
        },
        elevation3: {
          boxShadow: '0px 8px 24px rgba(46, 125, 50, 0.14)',
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 12,
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            transition: 'all 0.3s ease',
            '&:hover': {
              backgroundColor: 'rgba(255, 255, 255, 1)',
            },
            '&.Mui-focused': {
              backgroundColor: 'rgba(255, 255, 255, 1)',
              boxShadow: '0px 4px 12px rgba(46, 125, 50, 0.15)',
            },
            '& fieldset': {
              borderWidth: 2,
              borderColor: 'rgba(46, 125, 50, 0.2)',
            },
            '&:hover fieldset': {
              borderColor: '#81C784',
            },
            '&.Mui-focused fieldset': {
              borderColor: '#2E7D32',
            },
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          fontWeight: 500,
          transition: 'all 0.2s ease',
        },
        filled: {
          '&:hover': {
            transform: 'scale(1.02)',
          },
        },
        outlined: {
          borderWidth: 2,
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          transition: 'all 0.2s ease',
          '&:hover': {
            transform: 'scale(1.1)',
          },
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 24,
          padding: 8,
        },
      },
    },
    MuiSnackbar: {
      styleOverrides: {
        root: {
          '& .MuiSnackbarContent-root': {
            borderRadius: 12,
            fontWeight: 500,
          },
        },
      },
    },
    MuiAlert: {
      styleOverrides: {
        root: {
          borderRadius: 12,
        },
        standardSuccess: {
          backgroundColor: alpha('#2E7D32', 0.1),
          color: '#1B5E20',
        },
      },
    },
    MuiToggleButton: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          borderWidth: 2,
          fontWeight: 600,
          transition: 'all 0.3s ease',
          '&.Mui-selected': {
            background: 'linear-gradient(135deg, #2E7D32 0%, #43A047 100%)',
            color: '#FFFFFF',
            '&:hover': {
              background: 'linear-gradient(135deg, #1B5E20 0%, #2E7D32 100%)',
            },
          },
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          height: 8,
          backgroundColor: 'rgba(46, 125, 50, 0.1)',
        },
        bar: {
          borderRadius: 8,
          background: 'linear-gradient(90deg, #2E7D32 0%, #66BB6A 100%)',
        },
      },
    },
  },
});

export default theme;
