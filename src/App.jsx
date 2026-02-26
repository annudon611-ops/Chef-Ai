import React, { useState, useCallback, useEffect } from 'react';
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

// Constants
import { SCREENS, LANGUAGES } from './utils/constants';

/**
 * Main App Component
 * Manages navigation and app state
 */
const App = () => {
  // Navigation state
  const [currentScreen, setCurrentScreen] = useState(SCREENS.WELCOME);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // App data state
  const [language, setLanguage] = useState(LANGUAGES.ENGLISH);
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
  const [backPressCount, setBackPressCount] = useState(0);
  const [lastBackPress, setLastBackPress] = useState(0);

  // Error state
  const [error, setError] = useState(null);

  /**
   * Navigate to a new screen with transition
   */
  const navigateTo = useCallback((screen) => {
    setIsTransitioning(true);
    setTimeout(() => {
      setCurrentScreen(screen);
      setIsTransitioning(false);
      // Update browser history
      window.history.pushState({ screen }, '', `#${screen}`);
    }, 150);
  }, []);

  /**
   * Handle back navigation
   */
  const handleBack = useCallback(() => {
    const screenOrder = [
      SCREENS.WELCOME,
      SCREENS.INGREDIENTS,
      SCREENS.COOKING_STYLE,
      SCREENS.LOADING,
      SCREENS.RESULT,
    ];

    const currentIndex = screenOrder.indexOf(currentScreen);

    if (currentIndex > 0 && currentScreen !== SCREENS.LOADING) {
      navigateTo(screenOrder[currentIndex - 1]);
      return true;
    }
    return false;
  }, [currentScreen, navigateTo]);

  /**
   * Handle hardware back button and browser back
   */
  useEffect(() => {
    const handlePopState = (event) => {
      // Prevent default behavior on welcome screen
      if (currentScreen === SCREENS.WELCOME) {
        const now = Date.now();
        
        if (now - lastBackPress < 2000) {
          // Second press within 2 seconds - show exit dialog
          setShowExitDialog(true);
        } else {
          // First press - show toast
          setToast({
            open: true,
            message: 'Press back again to exit',
            severity: 'info',
          });
          setLastBackPress(now);
        }
        
        // Push state back to prevent actual navigation
        window.history.pushState({ screen: SCREENS.WELCOME }, '', '#welcome');
        return;
      }

      // For other screens, navigate back
      if (currentScreen === SCREENS.LOADING) {
        // Don't allow back during loading
        window.history.pushState({ screen: SCREENS.LOADING }, '', '#loading');
        return;
      }

      handleBack();
    };

    // Initialize history state
    window.history.pushState({ screen: currentScreen }, '', `#${currentScreen}`);

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [currentScreen, lastBackPress, handleBack]);

  /**
   * Reset back press counter when toast closes
   */
  useEffect(() => {
    if (!toast.open) {
      const timer = setTimeout(() => {
        setBackPressCount(0);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [toast.open]);

  /**
   * Handle welcome screen start
   */
  const handleWelcomeStart = (selectedLanguage) => {
    setLanguage(selectedLanguage);
    navigateTo(SCREENS.INGREDIENTS);
  };

  /**
   * Handle ingredient input completion
   */
  const handleIngredientNext = (data) => {
    setIngredientData(data);
    navigateTo(SCREENS.COOKING_STYLE);
  };

  /**
   * Handle cooking style selection and start recipe generation
   */
  const handleCookingStyleNext = async (data) => {
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

      if (result.success) {
        setGeneratedRecipe(result.recipe);
        setError(null);
        navigateTo(SCREENS.RESULT);
      } else {
        throw new Error(result.error || 'Failed to generate recipe');
      }
    } catch (err) {
      console.error('Recipe generation error:', err);
      setError(err.message);
      setToast({
        open: true,
        message: err.message || 'Failed to generate recipe. Please try again.',
        severity: 'error',
      });
      // Go back to cooking style screen
      navigateTo(SCREENS.COOKING_STYLE);
    }
  };

  /**
   * Handle new recipe creation - reset to start
   */
  const handleNewRecipe = () => {
    setIngredientData(null);
    setRecipeData(null);
    setGeneratedRecipe(null);
    setError(null);
    navigateTo(SCREENS.WELCOME);
  };

  /**
   * Close toast
   */
  const handleCloseToast = () => {
    setToast({ ...toast, open: false });
  };

  /**
   * Handle exit dialog close
   */
  const handleExitDialogClose = () => {
    setShowExitDialog(false);
    setBackPressCount(0);
    setLastBackPress(0);
  };

  /**
   * Handle exit confirmation
   */
  const handleExitConfirm = () => {
    setShowExitDialog(false);
    // Attempt to close the app/tab
    window.close();
    // If window.close() doesn't work (most browsers block it), 
    // show a message or redirect
    setTimeout(() => {
      setToast({
        open: true,
        message: 'Please close this tab manually',
        severity: 'info',
      });
    }, 100);
  };

  /**
   * Render current screen
   */
  const renderScreen = () => {
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
            initialData={ingredientData}
          />
        );

      case SCREENS.COOKING_STYLE:
        return (
          <CookingStyleScreen
            onNext={handleCookingStyleNext}
            onBack={() => navigateTo(SCREENS.INGREDIENTS)}
            ingredientData={ingredientData}
          />
        );

      case SCREENS.LOADING:
        return (
          <LoadingScreen
            recipeData={recipeData}
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
  };

  return (
    <Box
      sx={{
        minHeight: '100dvh',
        width: '100%',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Screen Content with Transition */}
      <Fade in={!isTransitioning} timeout={300}>
        <Box sx={{ minHeight: '100dvh' }}>
          {renderScreen()}
        </Box>
      </Fade>

      {/* Toast Notification */}
      <Toast
        open={toast.open}
        message={toast.message}
        severity={toast.severity}
        duration={3000}
        onClose={handleCloseToast}
      />

      {/* Exit Confirmation Dialog */}
      <ExitDialog
        open={showExitDialog}
        onClose={handleExitDialogClose}
        onConfirm={handleExitConfirm}
      />
    </Box>
  );
};

export default App;
