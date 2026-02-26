import { useState, useCallback, useEffect, useRef } from 'react';
import { TOAST_DURATION } from '../utils/constants';

/**
 * Custom hook for handling double-back-to-exit functionality
 * @param {function} goBack - Navigation goBack function
 * @param {function} isHome - Function to check if on home screen
 * @returns {object} - Back handler state and methods
 */
const useBackHandler = (goBack, isHome) => {
  const [showExitToast, setShowExitToast] = useState(false);
  const [showExitDialog, setShowExitDialog] = useState(false);
  const lastBackPressRef = useRef(0);
  const backPressCountRef = useRef(0);
  const timeoutRef = useRef(null);

  // Reset back press state
  const resetBackPress = useCallback(() => {
    backPressCountRef.current = 0;
    lastBackPressRef.current = 0;
    setShowExitToast(false);
  }, []);

  // Handle back button press
  const handleBackPress = useCallback(() => {
    const now = Date.now();
    const timeSinceLastPress = now - lastBackPressRef.current;

    // If not on home screen, navigate back
    if (!isHome()) {
      const didGoBack = goBack();
      if (didGoBack) {
        resetBackPress();
        return true;
      }
    }

    // On home screen - implement double back to exit
    if (timeSinceLastPress < 2000) {
      // Second press within 2 seconds
      backPressCountRef.current += 1;

      if (backPressCountRef.current >= 2) {
        // Show exit confirmation dialog
        setShowExitToast(false);
        setShowExitDialog(true);
        return false;
      }
    } else {
      // First press or too much time passed
      backPressCountRef.current = 1;
      setShowExitToast(true);

      // Clear existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // Auto-hide toast and reset after 2 seconds
      timeoutRef.current = setTimeout(() => {
        resetBackPress();
      }, 2000);
    }

    lastBackPressRef.current = now;
    return false;
  }, [goBack, isHome, resetBackPress]);

  // Handle hardware back button
  useEffect(() => {
    const handlePopState = (event) => {
      if (isHome()) {
        // Prevent default back navigation on home
        event.preventDefault();
        handleBackPress();

        // Push state back to prevent navigation
        window.history.pushState(null, '', window.location.href);
      }
    };

    // Push initial state
    window.history.pushState(null, '', window.location.href);

    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [handleBackPress, isHome]);

  // Close exit dialog
  const closeExitDialog = useCallback(() => {
    setShowExitDialog(false);
    resetBackPress();
  }, [resetBackPress]);

  // Confirm exit
  const confirmExit = useCallback(() => {
    // Close the PWA / window
    if (window.navigator.standalone || window.matchMedia('(display-mode: standalone)').matches) {
      // For PWA, we can't actually close, but we can navigate away
      window.close();
      // Fallback: go to a blank page
      window.location.href = 'about:blank';
    } else {
      // For browser, attempt to close
      window.close();
      // If close doesn't work (most browsers), navigate away
      window.location.href = 'about:blank';
    }
  }, []);

  // Hide toast
  const hideExitToast = useCallback(() => {
    setShowExitToast(false);
  }, []);

  return {
    showExitToast,
    showExitDialog,
    handleBackPress,
    closeExitDialog,
    confirmExit,
    hideExitToast,
    resetBackPress,
  };
};

export default useBackHandler;
