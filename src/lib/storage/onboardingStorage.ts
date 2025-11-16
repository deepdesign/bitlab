/**
 * Onboarding Storage Utilities
 * 
 * Manages onboarding state in localStorage to track:
 * - Whether user has seen welcome screen
 * - Which tabs have been onboarded
 * - Whether user has completed the tour
 */

const STORAGE_KEY = "pixli-onboarding";
const STORAGE_VERSION = 1;

interface OnboardingState {
  version: number;
  hasSeenWelcome: boolean;
  onboardedTabs: {
    sprites: boolean;
    motion: boolean;
    fx: boolean;
    canvas: boolean;
  };
  hasCompletedTour: boolean;
  dismissedHelp: boolean;
}

const DEFAULT_STATE: OnboardingState = {
  version: STORAGE_VERSION,
  hasSeenWelcome: false,
  onboardedTabs: {
    sprites: false,
    motion: false,
    fx: false,
    canvas: false,
  },
  hasCompletedTour: false,
  dismissedHelp: false,
};

/**
 * Get current onboarding state from localStorage
 */
export function getOnboardingState(): OnboardingState {
  if (typeof window === "undefined") {
    return DEFAULT_STATE;
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return DEFAULT_STATE;
    }

    const parsed = JSON.parse(stored) as OnboardingState;
    
    // Migrate old versions if needed
    if (parsed.version !== STORAGE_VERSION) {
      return DEFAULT_STATE;
    }

    return parsed;
  } catch (error) {
    console.error("Failed to load onboarding state:", error);
    return DEFAULT_STATE;
  }
}

/**
 * Save onboarding state to localStorage
 */
export function saveOnboardingState(state: OnboardingState): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error("Failed to save onboarding state:", error);
  }
}

/**
 * Mark welcome screen as seen
 */
export function markWelcomeSeen(): void {
  const state = getOnboardingState();
  state.hasSeenWelcome = true;
  saveOnboardingState(state);
}

/**
 * Mark a tab as onboarded
 */
export function markTabOnboarded(tab: keyof OnboardingState["onboardedTabs"]): void {
  const state = getOnboardingState();
  state.onboardedTabs[tab] = true;
  saveOnboardingState(state);
}

/**
 * Check if a tab needs onboarding
 */
export function needsTabOnboarding(tab: keyof OnboardingState["onboardedTabs"]): boolean {
  const state = getOnboardingState();
  return !state.onboardedTabs[tab];
}

/**
 * Mark tour as completed
 */
export function markTourCompleted(): void {
  const state = getOnboardingState();
  state.hasCompletedTour = true;
  saveOnboardingState(state);
}

/**
 * Reset all onboarding (for testing or user preference)
 */
export function resetOnboarding(): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.error("Failed to reset onboarding state:", error);
  }
}

/**
 * Check if user has seen welcome screen
 */
export function hasSeenWelcome(): boolean {
  return getOnboardingState().hasSeenWelcome;
}

/**
 * Check if user has completed tour
 */
export function hasCompletedTour(): boolean {
  return getOnboardingState().hasCompletedTour;
}

