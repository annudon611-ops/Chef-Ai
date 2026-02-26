import { useState, useCallback, useEffect } from 'react';
import { SCREENS } from '../utils/constants';

/**
 * Custom hook for managing app navigation using History API
 * @returns {object} - Navigation methods and current screen
 */
const useNavigation = () => {
  const [currentScreen, setCurrentScreen] = useState(SCREENS.WELCOME);
  const [navigationHistory, setNavigationHistory] = useState([SCREENS.WELCOME]);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Initialize navigation state from URL
  useEffect(() => {
    const handlePopState = (event) => {
      if (event.state?.screen) {
        setCurrentScreen(event.state.screen);
        setNavigationHistory((prev) => {
          const newHistory = [...prev];
          newHistory.pop();
          return newHistory.length > 0 ? newHistory : [SCREENS.WELCOME];
        });
      }
    };

    window.addEventListener('popstate', handlePopState);

    // Initialize history state
    if (!window.history.state?.screen) {
      window.history.replaceState(
        { screen: SCREENS.WELCOME },
        '',
        window.location.pathname
      );
    }

    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, []);

  /**
   * Navigate to a new screen
   * @param {string} screen - Target screen name
   * @param {object} data - Optional data to pass
   */
  const navigateTo = useCallback(
    (screen, data = {}) => {
      if (isTransitioning) return;

      setIsTransitioning(true);

      // Short delay for exit animation
      setTimeout(() => {
        setCurrentScreen(screen);
        setNavigationHistory((prev) => [...prev, screen]);

        window.history.pushState(
          { screen, data },
          '',
          `${window.location.pathname}#${screen}`
        );

        setIsTransitioning(false);
      }, 150);
    },
    [isTransitioning]
  );

  /**
   * Navigate back to previous screen
   * @returns {boolean} - True if navigated back, false if at root
   */
  const goBack = useCallback(() => {
    if (navigationHistory.length <= 1) {
      return false;
    }

    if (isTransitioning) return false;

    setIsTransitioning(true);

    setTimeout(() => {
      window.history.back();
      setIsTransitioning(false);
    }, 150);

    return true;
  }, [navigationHistory, isTransitioning]);

  /**
   * Navigate to home screen
   */
  const goHome = useCallback(() => {
    if (isTransitioning) return;

    setIsTransitioning(true);

    setTimeout(() => {
      setCurrentScreen(SCREENS.WELCOME);
      setNavigationHistory([SCREENS.WELCOME]);

      window.history.pushState(
        { screen: SCREENS.WELCOME },
        '',
        window.location.pathname
      );

      setIsTransitioning(false);
    }, 150);
  }, [isTransitioning]);

  /**
   * Check if user can go back
   * @returns {boolean}
   */
  const canGoBack = useCallback(() => {
    return navigationHistory.length > 1;
  }, [navigationHistory]);

  /**
   * Check if current screen is home
   * @returns {boolean}
   */
  const isHome = useCallback(() => {
    return currentScreen === SCREENS.WELCOME;
  }, [currentScreen]);

  /**
   * Get navigation state data
   * @returns {object}
   */
  const getStateData = useCallback(() => {
    return window.history.state?.data || {};
  }, []);

  return {
    currentScreen,
    navigationHistory,
    isTransitioning,
    navigateTo,
    goBack,
    goHome,
    canGoBack,
    isHome,
    getStateData,
  };
};

export default useNavigation;
