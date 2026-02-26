import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Button,
  Paper,
  Container,
  IconButton,
  Grid,
  Fade,
  Chip,
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  Home as HomeIcon,
  StorefrontOutlined as RestaurantIcon,
  Timer as QuickIcon,
  MenuBook as DetailedIcon,
  AutoAwesome as GenerateIcon,
} from '@mui/icons-material';
import { COOKING_STYLES, RECIPE_DEPTH } from '../utils/constants';

/**
 * Style Selection Card Component
 */
const StyleCard = ({ selected, onClick, icon: Icon, title, description, color }) => (
  <Paper
    elevation={selected ? 4 : 1}
    onClick={onClick}
    sx={{
      p: 3,
      borderRadius: 4,
      cursor: 'pointer',
      border: '2px solid',
      borderColor: selected ? color : 'transparent',
      backgroundColor: selected ? `${color}15` : 'rgba(255, 255, 255, 0.95)',
      transition: 'all 0.3s ease',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
      },
      '&:active': {
        transform: 'translateY(0)',
      },
    }}
  >
    <Box
      sx={{
        width: 56,
        height: 56,
        borderRadius: '50%',
        backgroundColor: selected ? color : 'rgba(46, 125, 50, 0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        mb: 2,
        mx: 'auto',
        transition: 'all 0.3s ease',
      }}
    >
      <Icon
        sx={{
          fontSize: 28,
          color: selected ? 'white' : 'primary.main',
        }}
      />
    </Box>
    <Typography
      variant="h6"
      fontWeight={600}
      textAlign="center"
      color={selected ? 'primary.dark' : 'text.primary'}
    >
      {title}
    </Typography>
    <Typography
      variant="body2"
      textAlign="center"
      color="text.secondary"
      sx={{ mt: 1 }}
    >
      {description}
    </Typography>
    {selected && (
      <Chip
        label="Selected"
        size="small"
        color="primary"
        sx={{ mt: 2, mx: 'auto', display: 'flex', width: 'fit-content' }}
      />
    )}
  </Paper>
);

/**
 * Cooking Style Screen Component
 * Allows users to select cooking style and recipe depth
 */
const CookingStyleScreen = ({ onNext, onBack, ingredientData }) => {
  const [cookingStyle, setCookingStyle] = useState(COOKING_STYLES.HOME);
  const [recipeDepth, setRecipeDepth] = useState(RECIPE_DEPTH.DETAILED);
  const [isAnimated, setIsAnimated] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsAnimated(true), 100);
  }, []);

  const handleGenerate = () => {
    onNext({
      ...ingredientData,
      cookingStyle,
      recipeDepth,
    });
  };

  return (
    <Box
      sx={{
        minHeight: '100dvh',
        background: 'linear-gradient(180deg, #F1F8E9 0%, #E8F5E9 100%)',
        display: 'flex',
        flexDirection: 'column',
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
          gap: 2,
        }}
      >
        <IconButton onClick={onBack} sx={{ color: 'white' }}>
          <BackIcon />
        </IconButton>
        <Typography variant="h6" fontWeight={600}>
          Cooking Style
        </Typography>
      </Box>

      <Container
        maxWidth="sm"
        sx={{
          flex: 1,
          py: 3,
          px: 2,
          display: 'flex',
          flexDirection: 'column',
          gap: 3,
        }}
      >
        {/* Ingredients Summary */}
        <Fade in={isAnimated} timeout={300}>
          <Paper
            elevation={0}
            sx={{
              p: 2,
              borderRadius: 3,
              backgroundColor: 'rgba(46, 125, 50, 0.08)',
              border: '1px solid rgba(46, 125, 50, 0.2)',
            }}
          >
            <Typography variant="body2" color="text.secondary" mb={1}>
              Your Ingredients:
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {ingredientData.ingredients.map((ing, index) => (
                <Chip
                  key={index}
                  label={ing}
                  size="small"
                  color="primary"
                  variant="outlined"
                />
              ))}
            </Box>
          </Paper>
        </Fade>

        {/* Cooking Style Selection */}
        <Fade in={isAnimated} timeout={500}>
          <Box>
            <Typography variant="subtitle1" fontWeight={600} color="primary.dark" mb={2}>
              How would you like it cooked?
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <StyleCard
                  selected={cookingStyle === COOKING_STYLES.HOME}
                  onClick={() => setCookingStyle(COOKING_STYLES.HOME)}
                  icon={HomeIcon}
                  title="Home Style"
                  description="Simple, everyday cooking with moderate spices"
                  color="#2E7D32"
                />
              </Grid>
              <Grid item xs={6}>
                <StyleCard
                  selected={cookingStyle === COOKING_STYLES.RESTAURANT}
                  onClick={() => setCookingStyle(COOKING_STYLES.RESTAURANT)}
                  icon={RestaurantIcon}
                  title="Restaurant"
                  description="Rich, indulgent flavors with professional flair"
                  color="#FF9800"
                />
              </Grid>
            </Grid>
          </Box>
        </Fade>

        {/* Recipe Depth Selection */}
        <Fade in={isAnimated} timeout={700}>
          <Box>
            <Typography variant="subtitle1" fontWeight={600} color="primary.dark" mb={2}>
              Recipe Detail Level
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <StyleCard
                  selected={recipeDepth === RECIPE_DEPTH.QUICK}
                  onClick={() => setRecipeDepth(RECIPE_DEPTH.QUICK)}
                  icon={QuickIcon}
                  title="Quick"
                  description="Essential steps, fast overview"
                  color="#00BCD4"
                />
              </Grid>
              <Grid item xs={6}>
                <StyleCard
                  selected={recipeDepth === RECIPE_DEPTH.DETAILED}
                  onClick={() => setRecipeDepth(RECIPE_DEPTH.DETAILED)}
                  icon={DetailedIcon}
                  title="Detailed"
                  description="Step-by-step with tips & techniques"
                  color="#9C27B0"
                />
              </Grid>
            </Grid>
          </Box>
        </Fade>

        {/* Summary */}
        <Fade in={isAnimated} timeout={900}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 4,
              backgroundColor: 'rgba(255, 255, 255, 0.95)',
              border: '1px solid rgba(46, 125, 50, 0.2)',
            }}
          >
            <Typography variant="subtitle2" color="text.secondary" mb={2}>
              Recipe Summary
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">
                  Diet Type:
                </Typography>
                <Typography variant="body2" fontWeight={600}>
                  {ingredientData.dietType === 'vegetarian' ? '🥬 Vegetarian' : '🍖 Non-Vegetarian'}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">
                  Cooking Style:
                </Typography>
                <Typography variant="body2" fontWeight={600}>
                  {cookingStyle === COOKING_STYLES.HOME ? '🏠 Home Style' : '🍽️ Restaurant Style'}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography variant="body2" color="text.secondary">
                  Recipe Detail:
                </Typography>
                <Typography variant="body2" fontWeight={600}>
                  {recipeDepth === RECIPE_DEPTH.QUICK ? '⚡ Quick' : '📖 Detailed'}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Fade>

        {/* Spacer */}
        <Box sx={{ flex: 1 }} />

        {/* Generate Button */}
        <Fade in={isAnimated} timeout={1100}>
          <Button
            variant="contained"
            size="large"
            fullWidth
            onClick={handleGenerate}
            startIcon={<GenerateIcon />}
            sx={{
              py: 2,
              borderRadius: 4,
              fontSize: '1.1rem',
              mb: 2,
              background: 'linear-gradient(135deg, #FF9800 0%, #F57C00 100%)',
              boxShadow: '0 8px 24px rgba(255, 152, 0, 0.4)',
              '&:hover': {
                background: 'linear-gradient(135deg, #F57C00 0%, #E65100 100%)',
                boxShadow: '0 12px 32px rgba(255, 152, 0, 0.5)',
              },
            }}
          >
            Generate Recipe
          </Button>
        </Fade>
      </Container>
    </Box>
  );
};

export default CookingStyleScreen;
