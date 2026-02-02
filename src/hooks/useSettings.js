import { useEffect, useState, useCallback } from "react";
import { DEFAULT_SETTINGS } from "../config/constants";
import { loadSettings, saveSettings } from "../utils/storage";
import { applySettingsToCss } from "../utils/colors";


// Custom hook for managing application settings
// returns Settings state and methods
export default function useSettings() {
   const [settings, setSettings] = useState(() => loadSettings(DEFAULT_SETTINGS));
   const [syncOffset, setSyncOffset] = useState(0);

   // Persist settings and apply CSS when settings change
   useEffect(() => {
      saveSettings(settings);
      applySettingsToCss(settings);
   }, [settings]);

   // Update a single setting
   const updateSetting = useCallback((key, value) => {
      setSettings(prev => ({ ...prev, [key]: value }));
   }, []);

   // Reset all settings to defaults
   const resetSettings = useCallback(() => {
      setSettings(DEFAULT_SETTINGS);
      setSyncOffset(0);
   }, []);

   // Adjust sync offset with bounds checking
   const adjustSyncOffset = useCallback((delta, onSyncChange) => {
      setSyncOffset(prev => {
         const newOffset = Math.max(-2000, Math.min(2000, prev + delta));
         onSyncChange?.(newOffset);
         return newOffset;
      });
   }, []);

   // Reset sync offset
   const resetSyncOffset = useCallback((onSyncChange) => {
      setSyncOffset(0);
      onSyncChange?.(0);
   }, []);

   return {
      settings,
      syncOffset,
      updateSetting,
      resetSettings,
      adjustSyncOffset,
      resetSyncOffset,
      setSyncOffset
   };
}
