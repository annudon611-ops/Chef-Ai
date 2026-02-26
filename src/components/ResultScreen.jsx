import React, { useState, useRef } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Container,
  IconButton,
  Divider,
  Chip,
  Grid,
  Fade,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  Home as HomeIcon,
  ContentCopy as CopyIcon,
  WhatsApp as WhatsAppIcon,
  AccessTime as TimeIcon,
  LocalFireDepartment as CaloriesIcon,
  FitnessCenter as ProteinIcon,
  Grain as CarbsIcon,
  WaterDrop as FatsIcon,
  Restaurant as ChefIcon,
  Lightbulb as TipIcon,
  ShoppingBasket as IngredientsIcon,
  MenuBook as MethodIcon,
  Share as ShareIcon,
} from '@mui/icons-material';
import { formatRecipeForSharing } from '../services/aiService';
import { APP_LINK, WHATSAPP_SHARE_URL } from '../utils/constants';

/**
 * Nutrition Card Component
 */
const NutritionCard = ({ icon: Icon, label, value, color }) => (
  <Paper
    elevation={0}
    sx={{
      p: 1.5,
      borderRadius: 3,
      backgroundColor: `${color}15`,
      border: `1px solid ${color}30`,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 0.5,
    }}
  >
    <Icon sx={{ fontSize: 24, color }} />
    <Typography variant="body2" fontWeight={600} color="text.primary">
      {value}
    </Typography>
    <Typography variant="caption" color="text.secondary">
      {label}
    </Typography>
  </Paper>
);

/**
 * Section Header Component
 */
const SectionHeader = ({ icon: Icon, title }) => (
  <Box
    sx={{
      display: 'flex',
      alignItems: 'center',
      gap: 1.5,
      mb: 2,
    }}
  >
    <Box
      sx={{
        width: 36,
        height: 36,
        borderRadius: 2,
        background: 'linear-gradient(135deg, #2E7D32 0%, #43A047 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Icon sx={{ fontSize: 20, color: 'white' }} />
    </Box>
    <Typography variant="h6" fontWeight={600} color="primary.dark">
      {title}
    </Typography>
  </Box>
);

/**
 * Result Screen Component
 * Displays the generated recipe with copy and share options
 */
const ResultScreen = ({ recipe, recipeData, onNewRecipe }) => {
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
  const [isAnimated, setIsAnimated] = useState(false);
  const recipeRef = useRef(null);

  React.useEffect(() => {
    setTimeout(() => setIsAnimated(true), 100);
  }, []);

  const handleCopyToClipboard = async () => {
    try {
      const recipeText = formatRecipeForSharing(recipe);
      await navigator.clipboard.writeText(recipeText);
      setSnackbar({
        open: true,
        message: 'Recipe copied to clipboard!',
        severity: 'success',
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: 'Failed to copy recipe',
        severity: 'error',
      });
    }
  };

  const handleShareWhatsApp = () => {
    const recipeText = formatRecipeForSharing(recipe);
    const shareText = encodeURIComponent(recipeText + '\n\n' + APP_LINK);
    window.open(`${WHATSAPP_SHARE_URL}${shareText}`, '_blank');
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        const recipeText = formatRecipeForSharing(recipe);
        await navigator.share({
          title: recipe.title,
          text: recipeText,
          url: APP_LINK,
        });
      } catch (error) {
        if (error.name !== 'AbortError') {
          handleShareWhatsApp();
        }
      }
    } else {
      handleShareWhatsApp();
    }
  };

  const closeSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box
      sx={{
        minHeight: '100dvh',
        background: 'linear-gradient(180deg, #F1F8E9 0%, #E8F5E9 100%)',
        pb: 4,
      }}
    >
      {/* Header */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #2E7D32 0%, #43A047 100%)',
          color: 'white',
          px: 2,
          py: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'sticky',
          top: 0,
          zIndex: 100,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ChefIcon />
          <Typography variant="h6" fontWeight={600}>
            Your Recipe
          </Typography>
        </Box>
        <IconButton onClick={onNewRecipe} sx={{ color: 'white' }}>
          <HomeIcon />
        </IconButton>
      </Box>

      <Container maxWidth="sm" sx={{ py: 3, px: 2 }} ref={recipeRef}>
        {/* Recipe Title Card */}
        <Fade in={isAnimated} timeout={500}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 4,
              background: 'linear-gradient(135deg, #2E7D32 0%, #43A047 100%)',
              color: 'white',
              mb: 3,
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Decorative Pattern */}
            <Box
              sx={{
                position: 'absolute',
                top: -50,
                right: -50,
                width: 150,
                height: 150,
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.1)',
              }}
            />

            <Typography variant="h5" fontWeight={700} mb={2}>
              {recipe.title || 'Delicious Recipe'}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TimeIcon fontSize="small" />
              <Typography variant="body1">
                {recipe.cookingTime || '30-40 minutes'}
              </Typography>
            </Box>

            {/* Tags */}
            <Box sx={{ display: 'flex', gap: 1, mt: 2, flexWrap: 'wrap' }}>
              <Chip
                label={recipeData.dietType === 'vegetarian' ? '🥬 Veg' : '🍖 Non-Veg'}
                size="small"
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  fontWeight: 500,
                }}
              />
              <Chip
                label={recipeData.cookingStyle === 'home' ? '🏠 Home Style' : '🍽️ Restaurant'}
                size="small"
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  fontWeight: 500,
                }}
              />
            </Box>
          </Paper>
        </Fade>

        {/* Nutrition Info */}
        <Fade in={isAnimated} timeout={700}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 4,
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              mb: 3,
            }}
          >
            <Typography variant="subtitle1" fontWeight={600} color="primary.dark" mb={2}>
              📊 Nutrition Information
            </Typography>
            <Grid container spacing={1.5}>
              <Grid item xs={3}>
                <NutritionCard
                  icon={CaloriesIcon}
                  label="Calories"
                  value={recipe.nutrition?.calories || 'N/A'}
                  color="#FF5722"
                />
              </Grid>
              <Grid item xs={3}>
                <NutritionCard
                  icon={ProteinIcon}
                  label="Protein"
                  value={recipe.nutrition?.protein || 'N/A'}
                  color="#2196F3"
                />
              </Grid>
              <Grid item xs={3}>
                <NutritionCard
                  icon={CarbsIcon}
                  label="Carbs"
                  value={recipe.nutrition?.carbs || 'N/A'}
                  color="#FF9800"
                />
              </Grid>
              <Grid item xs={3}>
                <NutritionCard
                  icon={FatsIcon}
                  label="Fats"
                  value={recipe.nutrition?.fats || 'N/A'}
                  color="#9C27B0"
                />
              </Grid>
            </Grid>
          </Paper>
        </Fade>

        {/* Ingredients */}
        <Fade in={isAnimated} timeout={900}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 4,
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              mb: 3,
            }}
          >
            <SectionHeader icon={IngredientsIcon} title="Ingredients" />
            <Box
              component="ul"
              sx={{
                listStyle: 'none',
                p: 0,
                m: 0,
                '& li': {
                  py: 1,
                  px: 2,
                  mb: 1,
                  borderRadius: 2,
                  backgroundColor: 'rgba(46, 125, 50, 0.05)',
                  display: 'flex',
                  alignItems: 'center',
                  '&::before': {
                    content: '"•"',
                    color: 'primary.main',
                    fontWeight: 'bold',
                    fontSize: '1.2em',
                    mr: 1.5,
                  },
                },
              }}
            >
              {recipe.ingredients?.map((ingredient, index) => (
                <li key={index}>
                  <Typography variant="body2">{ingredient}</Typography>
                </li>
              ))}
            </Box>
          </Paper>
        </Fade>

        {/* Method */}
        <Fade in={isAnimated} timeout={1100}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 4,
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              mb: 3,
            }}
          >
            <SectionHeader icon={MethodIcon} title="Method" />
            <Box
              component="ol"
              sx={{
                p: 0,
                m: 0,
                listStyle: 'none',
                counterReset: 'step-counter',
              }}
            >
              {recipe.method?.map((step, index) => (
                <Box
                  component="li"
                  key={index}
                  sx={{
                    display: 'flex',
                    gap: 2,
                    mb: 2,
                    pb: 2,
                    borderBottom:
                      index < recipe.method.length - 1
                        ? '1px solid rgba(46, 125, 50, 0.1)'
                        : 'none',
                  }}
                >
                  <Box
                    sx={{
                      minWidth: 32,
                      height: 32,
                      borderRadius: '50%',
                      background: 'linear-gradient(135deg, #2E7D32 0%, #43A047 100%)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: 600,
                      fontSize: '0.875rem',
                      flexShrink: 0,
                    }}
                  >
                    {index + 1}
                  </Box>
                  <Typography variant="body2" sx={{ pt: 0.5 }}>
                    {step}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Paper>
        </Fade>

        {/* Chef Tips */}
        {recipe.chefTips?.length > 0 && (
          <Fade in={isAnimated} timeout={1300}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 4,
                background: 'linear-gradient(135deg, #FFF8E1 0%, #FFECB3 100%)',
                border: '1px solid rgba(255, 152, 0, 0.3)',
                mb: 3,
              }}
            >
              <SectionHeader icon={TipIcon} title="Chef Tips"
