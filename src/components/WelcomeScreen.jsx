import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  ToggleButtonGroup,
  ToggleButton,
  Paper,
  Container,
} from '@mui/material';
import {
  Restaurant as ChefIcon,
  ArrowForward as ArrowIcon,
  Language as LanguageIcon,
} from '@mui/icons-material';

/**
 * Welcome Screen Component
 */
const WelcomeScreen = ({ onStart, initialLanguage = 'english' }) => {
  const [language, setLanguage] = useState(initialLanguage);
  const [isAnimated, setIsAnimated] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setIsAnimated(true), 100);
    return () => clearTimeout(timer);
  }, []);

  const handleLanguageChange = (event, newLanguage) => {
    if (newLanguage !== null) {
      setLanguage(newLanguage);
    }
  };

  const handleStart = () => {
    console.log('Starting with language:', language);
    if (onStart && typeof onStart === 'function') {
      onStart(language);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100dvh',
        background: 'linear-gradient(180deg, #E8F5E9 0%, #C8E6C9 50%, #A5D6A7 100%)',
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Decorative Background */}
      <Box
        sx={{
          position: 'absolute',
          top: -100,
          right: -100,
          width: 300,
          height: 300,
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(46,125,50,0.1) 0%, transparent 70%)',
        }}
      />

      <Container maxWidth="sm" sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Logo Section */}
        <Box
          sx={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            pt: 8,
            pb: 4,
            opacity: isAnimated ? 1 : 0,
            transform: isAnimated ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 0.8s ease-out',
          }}
        >
          {/* Chef Icon */}
          <Box
            sx={{
              width: 120,
              height: 120,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #2E7D32 0%, #43A047 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 12px 40px rgba(46, 125, 50, 0.4)',
              mb: 4,
              animation: 'float 3s ease-in-out infinite',
              '@keyframes float': {
                '0%, 100%': { transform: 'translateY(0)' },
                '50%': { transform: 'translateY(-15px)' },
              },
            }}
          >
            <ChefIcon sx={{ fontSize: 64, color: 'white' }} />
          </Box>

          {/* App Title */}
          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              background: 'linear-gradient(135deg, #1B5E20 0%, #2E7D32 50%, #FF9800 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textAlign: 'center',
              mb: 1,
            }}
          >
            Chef Al-Smart
          </Typography>

          {/* Tagline */}
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{
              textAlign: 'center',
              fontWeight: 400,
              mb: 4,
            }}
          >
            Your Smart Recipe Companion
          </Typography>

          {/* Feature Pills */}
          <Box
            sx={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'center',
              gap: 1,
              mb: 4,
            }}
          >
            {['AI-Powered', 'Home & Restaurant', '100% Indian'].map((feature, index) => (
              <Paper
                key={feature}
                elevation={0}
                sx={{
                  px: 2,
                  py: 0.5,
                  borderRadius: 3,
                  backgroundColor: 'rgba(46, 125, 50, 0.1)',
                  border: '1px solid rgba(46, 125, 50, 0.2)',
                }}
              >
                <Typography
                  variant="caption"
                  sx={{ color: 'primary.dark', fontWeight: 500 }}
                >
                  {feature}
                </Typography>
              </Paper>
            ))}
          </Box>
        </Box>

        {/* Language Selection & Start Button */}
        <Box
          sx={{
            pb: 6,
            px: 2,
            opacity: isAnimated ? 1 : 0,
            transform: isAnimated ? 'translateY(0)' : 'translateY(30px)',
            transition: 'all 0.8s ease-out 0.4s',
          }}
        >
          {/* Language Toggle */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 4,
              backgroundColor: 'rgba(255, 255, 255, 0.9)',
              backdropFilter: 'blur(10px)',
              mb: 3,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <LanguageIcon color="primary" />
              <Typography variant="subtitle1" fontWeight={600} color="primary.dark">
                Select Language
              </Typography>
            </Box>

            <ToggleButtonGroup
              value={language}
              exclusive
              onChange={handleLanguageChange}
              fullWidth
              sx={{
                '& .MuiToggleButton-root': {
                  py: 1.5,
                  borderRadius: '12px !important',
                  mx: 0.5,
                  border: '2px solid',
                  borderColor: 'primary.light',
                  '&.Mui-selected': {
                    borderColor: 'primary.main',
                    backgroundColor: 'rgba(46, 125, 50, 0.1)',
                  },
                },
              }}
            >
              <ToggleButton value="english">
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="body1" fontWeight={600}>
                    English
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Professional
                  </Typography>
                </Box>
              </ToggleButton>
              <ToggleButton value="hinglish">
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="body1" fontWeight={600}>
                    Hinglish
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Desi Style
                  </Typography>
                </Box>
              </ToggleButton>
            </ToggleButtonGroup>
          </Paper>

          {/* Start Button */}
          <Button
            variant="contained"
            size="large"
            fullWidth
            onClick={handleStart}
            endIcon={<ArrowIcon />}
            sx={{
              py: 2,
              fontSize: '1.1rem',
              borderRadius: 4,
              background: 'linear-gradient(135deg, #2E7D32 0%, #43A047 100%)',
              boxShadow: '0 8px 24px rgba(46, 125, 50, 0.4)',
              '&:hover': {
                background: 'linear-gradient(135deg, #1B5E20 0%, #2E7D32 100%)',
                boxShadow: '0 12px 32px rgba(46, 125, 50, 0.5)',
              },
            }}
          >
            Start Cooking
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default WelcomeScreen;
