/**
 * Triggers a subtle haptic feedback using the Vibration API.
 * @param pattern - The vibration pattern (default is 10ms for a subtle tap).
 */
export const triggerHaptic = (pattern: number | number[] = 10) => {
  if (typeof window !== 'undefined' && window.navigator && window.navigator.vibrate) {
    try {
      window.navigator.vibrate(pattern);
    } catch (e) {
      // Ignore errors if vibration is blocked or unsupported
    }
  }
};
