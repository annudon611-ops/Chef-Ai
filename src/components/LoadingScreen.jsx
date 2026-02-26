import React, { useState, useEffect } from 'react';
import { Box, Typography, LinearProgress, Container } from '@mui/material';
import { Restaurant as ChefIcon } from '@mui/icons-material';

/**
 * Loading tips to show while generating recipe
 */
const LOADING_TIPS = [
  'Selecting the finest spices...',
  'Preparing the ingredients...',
  'Heating up the kadhai...',
  'Adding the secret masala...',
  'Simmering to perfection...',
  'Garnishing with fresh coriander...',
  'Plating your dish...',
  'Almost ready to serve...',
];

/**
 * Steam Animation Component
 */
const SteamAnimation = () => (
  <Box
    sx={{
      position: 'absolute',
      top: -60,
      left: '50%',
      transform: 'translateX(-50%)',
      width: 100,
      height: 80,
      pointerEvents: 'none',
    }}
  >
    {[1, 2, 3].map((i) => (
      <Box
        key={i}
        sx={{
          position: 'absolute',
          left: `${20 + i * 20}%`,
          bottom: 0,
          width: 8,
          height: 60,
          background: `linear-gradient(
            to top,
            transparent 0%,
            rgba(255, 255, 255, 0.6) 50%,
            transparent 100%
          )`,
          borderRadius: '50%',
          filter: 'blur(4px)',
          animation: `steam 2s ease-out infinite`,
          animationDelay: `${i * 0.4}s`,
          '@keyframes steam': {
            '0%': {
              opacity: 0,
              transform: 'translateY(0) scaleX(1)',
            },
            '50%': {
              opacity: 1,
              transform: 'translateY(-30px) scaleX(1.3)',
            },
            '100%': {
              opacity: 0,
              transform: 'translateY(-60px) scaleX(0.8)',
            },
          },
        }}
      />
    ))}
  </Box>
);

/**
 * Cooking Pot Component
 */
const CookingPot = () => (
  <Box
    sx={{
      position: 'relative',
      width: 160,
      height: 160,
      mx: 'auto',
    }}
  >
    {/* Steam */}
    <SteamAnimation />

    {/* Pot Body */}
    <Box
      sx={{
        position: 'absolute',
        bottom: 0,
        left: '50%',
        transform: 'translateX(-50%)',
        width: 120,
        height: 80,
        background: 'linear-gradient(180deg, #5D4037 0%, #3E2723 100%)',
        borderRadius: '0 0 60px 60px',
        boxShadow: 'inset 0 -10px 20px rgba(0,0,0,0.3), 0 10px 30px rgba(0,0,0,0.3)',
        overflow: 'hidden',
        '&::before': {
          content: '""',
          position: 'absolute',
          top: 5,
          left: 10,
          right: 10,
          height: 30,
          background: 'linear-gradient(180deg, rgba(255,183,77,0.6) 0%, rgba(255,152,0,0.3) 100%)',
          borderRadius: '50%',
          animation: 'simmer 1.5s ease-in-out infinite',
          '@keyframes simmer': {
            '0%, 100%': { transform: 'scale(1)', opacity: 0.6 },
            '50%': { transform: 'scale(1.05)', opacity: 1 },
          },
        },
      }}
    />

    {/* Pot Rim */}
    <Box
      sx={{
        position: 'absolute',
        bottom: 80,
        left: '50%',
        transform: 'translateX(-50%)',
        width: 130,
        height: 15,
        background: 'linear-gradient(180deg, #6D4C41 0%, #4E342E 100%)',
        borderRadius: '50%',
        boxShadow: '0 3px 10px rgba(0,0,0,0.3)',
      }}
    />

    {/* Handles */}
    {[-1, 1].map((side) => (
      <Box
        key={side}
        sx={{
          position: 'absolute',
          bottom: 70,
          [side === -1 ? 'left' : 'right']: -5,
          width: 25,
          height: 10,
          background: 'linear-gradient(180deg, #5D4037 0%, #3E2723 100%)',
          borderRadius: '5px',
          boxShadow: '0 2px 5px rgba(0,0,0,0.3)',
        }}
      />
    ))}

    {/* Lid */}
    <Box
      sx={{
        position: 'absolute',
        bottom: 90,
        left: '50%',
        transform: 'translateX(-50%)',
        animation: 'lidBounce 2s ease-in-out infinite',
        '@keyframes lidBounce': {
          '0%, 100%': { transform: 'translateX(-50%) translateY(0) rotate(0deg)' },
          '25%': { transform: 'translateX(-50%) translateY(-5px) rotate(-2deg)' },
          '75%': { transform: 'translateX(-50%) translateY(-3px) rotate(2deg)' },
        },
      }}
    >
      {/* Lid Dome */}
      <Box
        sx={{
          width: 100,
          height: 35,
          background: 'linear-gradient(180deg, #757575 0%, #424242 100%)',
          borderRadius: '50px 50px 0 0',
          boxShadow: '0 -3px 10px rgba(0,0,0,0.2)',
        }}
      />
      {/* Lid Handle */}
      <Box
        sx={{
          position: 'absolute',
          top: -10,
          left: '50%',
          transform: 'translateX(-50%)',
          width: 20,
          height: 15,
          background: 'linear-gradient(180deg, #8D6E63 0%, #5D4037 100%)',
          borderRadius: '5px',
          boxShadow: '0 2px 5px rgba(0,0,0,0.3)',
        }}
      />
    </Box>
  </Box>
);

/**
 * Loading Screen Component
 * Shows animated cooking pot with steam while recipe is being generated
 */
const LoadingScreen = ({ recipeData }) => {
  const [progress, setProgress] = useState(0);
  const [tipIndex, setTipIndex] = useState(0);

  useEffect(() => {
    // Progress animation
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 95) {
          clearInterval(progressInterval);
          return 95;
        }
        return prev + Math.random() * 15;
      });
    }, 800);

    // Tip rotation
    const tipInterval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % LOADING_TIPS.length);
    }, 2500);

    return () => {
      clearInterval(progressInterval);
      clearInterval(tipInterval);
    };
  }, []);

  return (
    <Box
      sx={{
        minHeight: '100dvh',
        background: 'linear-gradient(180deg, #2E7D32 0%, #1B5E20 50%, #0D3311 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Background Particles */}
      {[...Array(20)].map((_, i) => (
        <Box
          key={i}
          sx={{
            position: 'absolute',
            width: Math.random() * 10 + 5,
            height: Math.random() * 10 + 5,
            borderRadius: '50%',
            background: 'rgba(255, 255, 255, 0.1)',
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animation: `float ${3 + Math.random() * 4}s ease-in-out infinite`,
            animationDelay: `${Math.random() * 2}s`,
            '@keyframes float': {
              '0%, 100%': { transform: 'translateY(0)' },
              '50%': { transform: 'translateY(-20px)' },
            },
          }}
        />
      ))}

      <Container
        maxWidth="sm"
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          px: 4,
        }}
      >
        {/* Chef Icon */}
        <Box
          sx={{
            mb: 2,
            animation: 'bounce 2s ease-in-out infinite',
            '@keyframes bounce': {
              '0%, 100%': { transform: 'translateY(0)' },
              '50%': { transform: 'translateY(-10px)' },
            },
          }}
        >
          <Box
            sx={{
              width: 60,
              height: 60,
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ChefIcon sx={{ fontSize: 32, color: 'white' }} />
          </Box>
        </Box>

        {/* Title */}
        <Typography
          variant="h5"
          fontWeight={600}
          color="white"
          sx={{ mb: 4 }}
        >
          Chef Al-Smart is Cooking
        </Typography>

        {/* Cooking Pot Animation */}
        <Box sx={{ mb: 4 }}>
          <CookingPot />
        </Box>

        {/* Loading Tip */}
        <Typography
          variant="h6"
          color="rgba(255, 255, 255, 0.9)"
          sx={{
            mb: 4,
            minHeight: 32,
            animation: 'fadeInOut 2.5s ease-in-out infinite',
            '@keyframes fadeInOut': {
              '0%, 100%': { opacity: 0.5 },
              '50%': { opacity: 1 },
            },
          }}
        >
          {LOADING_TIPS[tipIndex]}
        </Typography>

        {/* Progress Bar */}
        <Box sx={{ width: '100%', maxWidth: 300 }}>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{
              height: 8,
              borderRadius: 4,
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              '& .MuiLinearProgress-bar': {
                borderRadius: 4,
                background: 'linear-gradient(90deg, #FFB74D 0%, #FF9800 50%, #F57C00 100%)',
              },
            }}
          />
          <Typography
            variant="body2"
            color="rgba(255, 255, 255, 0.7)"
            sx={{ mt: 1 }}
          >
            {Math.round(progress)}% Complete
          </Typography>
        </Box>

        {/* Recipe Info */}
        <Box
          sx={{
            mt: 4,
            p: 2,
            borderRadius: 3,
            background: 'rgba(255, 255, 255, 0.1)',
            backdropFilter: 'blur(10px)',
          }}
        >
          <Typography variant="body2" color="rgba(255, 255, 255, 0.8)">
            Creating {recipeData.cookingStyle === 'home' ? 'Home Style' : 'Restaurant Style'}{' '}
            recipe with{' '}
            <strong style={{ color: '#FFB74D' }}>
              {recipeData.ingredients.join(', ')}
            </strong>
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default LoadingScreen;
