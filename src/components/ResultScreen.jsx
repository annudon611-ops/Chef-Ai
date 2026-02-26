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
  Refresh as RefreshIcon,
} from '@mui/icons-material';
import { formatRecipeForSharing } from '../services/aiService';

// Constants
const APP_LINK = 'https://chef-al-smart.app';
const WHATSAPP_SHARE_URL = 'https://wa.me/?text=';

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
      transition: 'transform 0.2s ease',
      '&:hover': {
        transform: 'scale(1.05)',
      },
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
    // Scroll to top when recipe loads
    window.scrollTo({ top: 0, behavior: 'smooth' });
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
      // Fallback for older browsers
      try {
        const textArea = document.createElement('textarea');
        textArea.value = formatRecipeForSharing(recipe);
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        document.body.appendChild(textArea);
        textArea.select();
        document.execCommand('copy');
        document.body.removeChild(textArea);
        setSnackbar({
          open: true,
          message: 'Recipe copied to clipboard!',
          severity: 'success',
        });
      } catch (fallbackError) {
        setSnackbar({
          open: true,
          message: 'Failed to copy recipe',
          severity: 'error',
        });
      }
    }
  };

  const handleShareWhatsApp = () => {
    const recipeText = formatRecipeForSharing(recipe);
    const shareText = encodeURIComponent(recipeText + '\n\n🔗 Download App: ' + APP_LINK);
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
        setSnackbar({
          open: true,
          message: 'Recipe shared successfully!',
          severity: 'success',
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

  // Handle case where recipe generation failed or returned empty
  if (!recipe || (!recipe.title && !recipe.ingredients?.length)) {
    return (
      <Box
        sx={{
          minHeight: '100dvh',
          background: 'linear-gradient(180deg, #F1F8E9 0%, #E8F5E9 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          px: 3,
        }}
      >
        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: 4,
            textAlign: 'center',
            maxWidth: 400,
          }}
        >
          <Typography variant="h6" color="error" mb={2}>
            Oops! Something went wrong
          </Typography>
          <Typography variant="body2" color="text.secondary" mb={3}>
            We couldn't generate the recipe. Please try again.
          </Typography>
          <Button
            variant="contained"
            onClick={onNewRecipe}
            startIcon={<RefreshIcon />}
            sx={{ borderRadius: 3 }}
          >
            Try Again
          </Button>
        </Paper>
      </Box>
    );
  }

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
          boxShadow: '0 4px 20px rgba(46, 125, 50, 0.3)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <ChefIcon />
          <Typography variant="h6" fontWeight={600}>
            Your Recipe
          </Typography>
        </Box>
        <IconButton 
          onClick={onNewRecipe} 
          sx={{ 
            color: 'white',
            backgroundColor: 'rgba(255,255,255,0.1)',
            '&:hover': {
              backgroundColor: 'rgba(255,255,255,0.2)',
            }
          }}
        >
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
            <Box
              sx={{
                position: 'absolute',
                bottom: -30,
                left: -30,
                width: 100,
                height: 100,
                borderRadius: '50%',
                background: 'rgba(255, 255, 255, 0.05)',
              }}
            />

            <Typography variant="h5" fontWeight={700} mb={2} sx={{ position: 'relative' }}>
              {recipe.title || 'Delicious Recipe'}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, position: 'relative' }}>
              <TimeIcon fontSize="small" />
              <Typography variant="body1">
                {recipe.cookingTime || '30-40 minutes'}
              </Typography>
            </Box>

            {/* Tags */}
            <Box sx={{ display: 'flex', gap: 1, mt: 2, flexWrap: 'wrap', position: 'relative' }}>
              <Chip
                label={recipeData?.dietType === 'vegetarian' ? '🥬 Veg' : '🍖 Non-Veg'}
                size="small"
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  fontWeight: 500,
                  backdropFilter: 'blur(10px)',
                }}
              />
              <Chip
                label={recipeData?.cookingStyle === 'home' ? '🏠 Home Style' : '🍽️ Restaurant'}
                size="small"
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.2)',
                  color: 'white',
                  fontWeight: 500,
                  backdropFilter: 'blur(10px)',
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
              backdropFilter: 'blur(10px)',
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
              backdropFilter: 'blur(10px)',
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
                  py: 1.5,
                  px: 2,
                  mb: 1,
                  borderRadius: 2,
                  backgroundColor: 'rgba(46, 125, 50, 0.05)',
                  display: 'flex',
                  alignItems: 'flex-start',
                  transition: 'all 0.2s ease',
                  '&:hover': {
                    backgroundColor: 'rgba(46, 125, 50, 0.1)',
                    transform: 'translateX(4px)',
                  },
                  '&::before': {
                    content: '"✓"',
                    color: 'primary.main',
                    fontWeight: 'bold',
                    fontSize: '1em',
                    mr: 1.5,
                    mt: 0.1,
                  },
                },
              }}
            >
              {recipe.ingredients?.length > 0 ? (
                recipe.ingredients.map((ingredient, index) => (
                  <li key={index}>
                    <Typography variant="body2">{ingredient}</Typography>
                  </li>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No ingredients available
                </Typography>
              )}
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
              backdropFilter: 'blur(10px)',
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
              {recipe.method?.length > 0 ? (
                recipe.method.map((step, index) => (
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
                        boxShadow: '0 2px 8px rgba(46, 125, 50, 0.3)',
                      }}
                    >
                      {index + 1}
                    </Box>
                    <Typography variant="body2" sx={{ pt: 0.5, lineHeight: 1.7 }}>
                      {step}
                    </Typography>
                  </Box>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">
                  No method available
                </Typography>
              )}
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
                    background: 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <TipIcon sx={{ fontSize: 20, color: 'white' }} />
                </Box>
                <Typography variant="h6" fontWeight={600} color="#E65100">
                  Chef Tips
                </Typography>
              </Box>
              <Box
                component="ul"
                sx={{
                  listStyle: 'none',
                  p: 0,
                  m: 0,
                  '& li': {
                    py: 1,
                    display: 'flex',
                    alignItems: 'flex-start',
                    '&::before': {
                      content: '"💡"',
                      mr: 1.5,
                    },
                  },
                }}
              >
                {recipe.chefTips.map((tip, index) => (
                  <li key={index}>
                    <Typography variant="body2" color="text.primary">
                      {tip}
                    </Typography>
                  </li>
                ))}
              </Box>
            </Paper>
          </Fade>
        )}

        {/* Action Buttons */}
        <Fade in={isAnimated} timeout={1500}>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {/* Copy & Share Row */}
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                variant="outlined"
                fullWidth
                onClick={handleCopyToClipboard}
                startIcon={<CopyIcon />}
                sx={{
                  py: 1.5,
                  borderRadius: 3,
                  borderWidth: 2,
                  fontWeight: 600,
                  '&:hover': {
                    borderWidth: 2,
                  },
                }}
              >
                Copy
              </Button>
              <Button
                variant="contained"
                fullWidth
                onClick={handleShareWhatsApp}
                startIcon={<WhatsAppIcon />}
                sx={{
                  py: 1.5,
                  borderRadius: 3,
                  fontWeight: 600,
                  background: 'linear-gradient(135deg, #25D366 0%, #128C7E 100%)',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #128C7E 0%, #075E54 100%)',
                  },
                }}
              >
                WhatsApp
              </Button>
            </Box>

            {/* Share Button - Native Share API */}
            <Button
              variant="outlined"
              fullWidth
              onClick={handleNativeShare}
              startIcon={<ShareIcon />}
              sx={{
                py: 1.5,
                borderRadius: 3,
                borderWidth: 2,
                fontWeight: 600,
                borderColor: 'primary.main',
                '&:hover': {
                  borderWidth: 2,
                  backgroundColor: 'rgba(46, 125, 50, 0.05)',
                },
              }}
            >
              Share Recipe
            </Button>

            {/* Divider */}
            <Divider sx={{ my: 1 }}>
              <Typography variant="caption" color="text.secondary">
                or
              </Typography>
            </Divider>

            {/* New Recipe Button */}
            <Button
              variant="contained"
              fullWidth
              onClick={onNewRecipe}
              startIcon={<RefreshIcon />}
              sx={{
                py: 2,
                borderRadius: 3,
                fontWeight: 600,
                fontSize: '1rem',
                background: 'linear-gradient(135deg, #2E7D32 0%, #43A047 100%)',
                boxShadow: '0 6px 20px rgba(46, 125, 50, 0.35)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #1B5E20 0%, #2E7D32 100%)',
                  boxShadow: '0 8px 25px rgba(46, 125, 50, 0.45)',
                },
              }}
            >
              Create New Recipe
            </Button>
          </Box>
        </Fade>

        {/* Footer */}
        <Fade in={isAnimated} timeout={1700}>
          <Box sx={{ textAlign: 'center', mt: 4, mb: 2 }}>
            <Typography variant="caption" color="text.secondary">
              Made with ❤️ by Chef Al-Smart
            </Typography>
            <Typography variant="caption" display="block" color="text.secondary" sx={{ mt: 0.5 }}>
              Your Smart Recipe Companion
            </Typography>
          </Box>
        </Fade>
      </Container>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        sx={{ bottom: { xs: 24, sm: 24 } }}
      >
        <Alert
          onClose={closeSnackbar}
          severity={snackbar.severity}
          variant="filled"
          sx={{
            width: '100%',
            borderRadius: 3,
            fontWeight: 500,
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default ResultScreen;
