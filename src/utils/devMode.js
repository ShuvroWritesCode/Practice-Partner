/**
 * Utility functions for development mode
 * These functions help bypass subscription checks during development
 */

/**
 * Check if the application is running in development mode
 * @returns {boolean} True if in development mode
 */
const isDevMode = () => {
  return process.env.REACT_APP_DEV_MODE === "true";
};

/**
 * Check if the user is subscribed or if we're in development mode
 * @param {boolean} isUserSubscribed - Whether the user is subscribed
 * @returns {boolean} True if user is subscribed or we're in development mode
 */
const isSubscribedOrDevMode = (isUserSubscribed) => {
  return isUserSubscribed || isDevMode();
};

/**
 * For development testing, always return a high number of free prompts remaining
 * @param {number} currentPrompts - Current number of prompts used
 * @returns {number} Either the actual count or 999 if in development mode
 */
const getPromptsRemaining = (currentPrompts, maxPrompts = 12) => {
  if (isDevMode()) {
    return 999; // Always have plenty of prompts in dev mode
  }
  return Math.max(0, maxPrompts - currentPrompts);
};

export { isDevMode, isSubscribedOrDevMode, getPromptsRemaining };