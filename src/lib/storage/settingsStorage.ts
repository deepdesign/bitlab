/**
 * Settings Storage Utilities
 * 
 * Manages user preferences and settings in localStorage
 */

const STORAGE_KEY = "pixli-settings";
const STORAGE_VERSION = 1;

export interface AppSettings {
  version: number;
  reducedMotion: boolean;
  // Future settings can be added here
  // defaultExportWidth?: number;
  // defaultExportHeight?: number;
  // performanceMode?: "quality" | "performance";
}

const DEFAULT_SETTINGS: AppSettings = {
  version: STORAGE_VERSION,
  reducedMotion: false,
};

/**
 * Get current settings from localStorage
 */
export function getSettings(): AppSettings {
  if (typeof window === "undefined") {
    return DEFAULT_SETTINGS;
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      return DEFAULT_SETTINGS;
    }

    const parsed = JSON.parse(stored) as AppSettings;
    
    // Migrate old versions if needed
    if (parsed.version !== STORAGE_VERSION) {
      return DEFAULT_SETTINGS;
    }

    return { ...DEFAULT_SETTINGS, ...parsed };
  } catch (error) {
    console.error("Failed to load settings:", error);
    return DEFAULT_SETTINGS;
  }
}

/**
 * Save settings to localStorage
 */
export function saveSettings(settings: Partial<AppSettings>): void {
  if (typeof window === "undefined") {
    return;
  }

  try {
    const current = getSettings();
    const updated: AppSettings = {
      ...current,
      ...settings,
      version: STORAGE_VERSION,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    
    // Apply reduced motion preference immediately
    if (settings.reducedMotion !== undefined) {
      const root = document.documentElement;
      if (settings.reducedMotion) {
        root.style.setProperty("--motion-reduce", "1");
      } else {
        root.style.removeProperty("--motion-reduce");
      }
    }
  } catch (error) {
    console.error("Failed to save settings:", error);
  }
}

/**
 * Get reduced motion preference
 */
export function getReducedMotion(): boolean {
  return getSettings().reducedMotion;
}

/**
 * Set reduced motion preference
 */
export function setReducedMotion(enabled: boolean): void {
  saveSettings({ reducedMotion: enabled });
}

/**
 * Apply reduced motion preference to document
 */
function applyReducedMotion(enabled: boolean): void {
  if (typeof window === "undefined") {
    return;
  }
  const root = document.documentElement;
  if (enabled) {
    root.style.setProperty("--motion-reduce", "1");
  } else {
    root.style.removeProperty("--motion-reduce");
  }
}

/**
 * Initialize settings on load
 */
export function initializeSettings(): void {
  const settings = getSettings();
  applyReducedMotion(settings.reducedMotion);
}

/**
 * Reset all settings to defaults
 */
export function resetSettings(): void {
  if (typeof window === "undefined") {
    return;
  }
  localStorage.removeItem(STORAGE_KEY);
  applyReducedMotion(false);
}

