import React, { useState, useEffect, useCallback } from 'react';
import { Box, Fade } from '@mui/material';

// Components
import WelcomeScreen from './components/WelcomeScreen';
import IngredientInputScreen from './components/IngredientInputScreen';
import CookingStyleScreen from './components/CookingStyleScreen';
import LoadingScreen from './components/LoadingScreen';
import ResultScreen from './components/ResultScreen';
import Toast from './components/Toast';
import ExitDialog from './components/ExitDialog';

// Services
import { generateRecipe } from './services/aiService';

// Screen constants
const SCREENS = {
  WELCOME: 'welcome',
  INGREDIENTS: 'ingredients',
  COOKING_STYLE: 'cookingStyle',
  LOADING: 'loading',
  RESULT: 'result',
};

/**
 * Main App Component
 */
const App = () => {
  // Navigation state
  const [currentScreen, setCurrentScreen] = useState(SCREENS.WELCOME);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // App data state
  const [language, setLanguage] = useState('english');
  const [ingredientData, setIngredientData] = useState(null);
  const [recipeData, setRecipeData] = useState(null);
  const [generatedRecipe, setGeneratedRecipe] = useState(null);

  // Toast state
  const [toast, setToast] = useState({
    open: false,
    message: '',
    severity: 'info',
  });

  // Exit dialog state
  const [showExitDialog, setShowExitDialog] = useState(false);
  const [lastBackPress, setLastBackPress] = useState(0);

  /**
   * Navigate to a new screen
   */
  const navigateTo = useCallback((screen) => {
    console.log('Navigating to:', screen);
    setIsTransitioning(true);
    
    setTimeout(() => {
      setCurrentScreen(screen);
      setIsTransitioning(false);
    }, 200);
  }, []);

  /**
   * Handle back button
   */
  useEffect(() => {
    const handleBackButton = (event) => {
      event.preventDefault();
      
      if (currentScreen === SCREENS.WELCOME) {
        const now = Date.now();
        if (now - lastBackPress < 2000) {
          setShowExitDialog(true);
        } else {
          setToast({
            open: true,
            message: 'Press back again to exit',
            severity: 'info',
          });
          setLastBackPress(now);
        }
        window.history.pushState(null, '', window.location.href);
        return;
      }

      // Navigate back based on current screen
      switch (currentScreen) {
        case SCREENS.INGREDIENTS:
          navigateTo(SCREENS.WELCOME);
          break;
        case SCREENS.COOKING_STYLE:
          navigateTo(SCREENS.INGREDIENTS);
          break;
        case SCREENS.RESULT:
          navigateTo(SCREENS.WELCOME);
          break;
        default:
          break;
      }
    };

    window.history.pushState(null, '', window.location.href);
    window.addEventListener('popstate', handleBackButton);

    return () => {
      window.removeEventListener('popstate', handleBackButton);
    };
  }, [currentScreen, lastBackPress, navigateTo]);

  /**
   * Handle welcome screen start
   */
  const handleWelcomeStart = (selectedLanguage) => {
    console.log('Language selected:', selectedLanguage);
    setLanguage(selectedLanguage);
    navigateTo(SCREENS.INGREDIENTS);
  };

  /**
   * Handle ingredient input completion
   */
  const handleIngredientNext = (data) => {
    console.log('Ingredients:', data);
    setIngredientData(data);
    navigateTo(SCREENS.COOKING_STYLE);
  };

  /**
   * Handle cooking style selection
   */
  const handleCookingStyleNext = async (data) => {
    console.log('Recipe data:', data);
    setRecipeData(data);
    navigateTo(SCREENS.LOADING);

    try {
      const result = await generateRecipe({
        ingredients: data.ingredients,
        dietType: data.dietType,
        cookingStyle: data.cookingStyle,
        recipeDepth: data.recipeDepth,
        language: language,
      });

      console.log('API Result:', result);

      if (result.success) {
        setGeneratedRecipe(result.recipe);
        navigateTo(SCREENS.RESULT);
      } else {
        throw new Error(result.error || 'Failed to generate recipe');
      }
    } catch (err) {
      console.error('Recipe generation error:', err);
      setToast({
        open: true,
        message: err.message || 'Failed to generate recipe. Please try again.',
        severity: 'error',
      });
      navigateTo(SCREENS.COOKING_STYLE);
    }
  };

  /**
   * Handle new recipe
   */
  const handleNewRecipe = () => {
    setIngredientData(null);
    setRecipeData(null);
    setGeneratedRecipe(null);
    navigateTo(SCREENS.WELCOME);
  };

  /**
   * Close toast
   */
  const handleCloseToast = () => {
    setToast({ ...toast, open: false });
  };

  /**
   * Render current screen
   */
  const renderScreen = () => {
    try {
      switch (currentScreen) {
        case SCREENS.WELCOME:
          return (
            <WelcomeScreen
              onStart={handleWelcomeStart}
              initialLanguage={language}
            />
          );

        case SCREENS.INGREDIENTS:
          return (
            <IngredientInputScreen
              onNext={handleIngredientNext}
              onBack={() => navigateTo(SCREENS.WELCOME)}
              initialData={ingredientData || {}}
            />
          );

        case SCREENS.COOKING_STYLE:
          return (
            <CookingStyleScreen
              onNext={handleCookingStyleNext}
              onBack={() => navigateTo(SCREENS.INGREDIENTS)}
              ingredientData={ingredientData || { ingredients: [], dietType: 'vegetarian' }}
            />
          );

        case SCREENS.LOADING:
          return (
            <LoadingScreen
              recipeData={recipeData || { ingredients: [], cookingStyle: 'home' }}
            />
          );

        case SCREENS.RESULT:
          return (
            <ResultScreen
              recipe={generatedRecipe}
              recipeData={recipeData}
              onNewRecipe={handleNewRecipe}
            />
          );

        default:
          return (
            <WelcomeScreen
              onStart={handleWelcomeStart}
              initialLanguage={language}
            />
          );
      }
    } catch (error) {
      console.error('Render error:', error);
      return (
        <Box sx={{ p: 4, textAlign: 'center' }}>
          <h2>Something went wrong</h2>
          <button onClick={() => navigateTo(SCREENS.WELCOME)}>
            Go Home
          </button>
        </Box>
      );
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100dvh',
        width: '100%',
        overflow: 'hidden',
      }}
    >
      <Fade in={!isTransitioning} timeout={300}>
        <Box sx={{ minHeight: '100dvh' }}>
          {renderScreen()}
        </Box>
      </Fade>

      {/* Toast */}
      <Toast
        open={toast.open}
        message={toast.message}
        severity={toast.severity}
        duration={3000}
        onClose={handleCloseToast}
      />

      {/* Exit Dialog */}
      <ExitDialog
        open={showExitDialog}
        onClose={() => setShowExitDialog(false)}
        onConfirm={() => {
          setShowExitDialog(false);
          window.close();
        }}
      />
    </Box>
  );
};

export default App;
