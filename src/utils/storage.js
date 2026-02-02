/**
 * Settings persistence utilities
 */

const STORAGE_KEY = "lyricsOverlaySettings";

/**
 * Load settings from localStorage
 * Handles migration from old setting names
 * @param {Object} defaultSettings - Default settings to use if none saved
 * @returns {Object} Loaded settings merged with defaults
 */
export function loadSettings(defaultSettings) {
   try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
         const parsed = JSON.parse(saved);

         // Migrate old hideKanji setting to showRomanization
         if ("hideKanji" in parsed && !("showRomanization" in parsed)) {
            parsed.showRomanization = parsed.hideKanji;
            delete parsed.hideKanji;
         }

         return { ...defaultSettings, ...parsed };
      }
   } catch (e) {
      console.error("Failed to load settings:", e);
   }
   return defaultSettings;
}

/**
 * Save settings to localStorage
 * @param {Object} settings - Settings object to save
 */
export function saveSettings(settings) {
   try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
   } catch (e) {
      console.error("Failed to save settings:", e);
   }
}
