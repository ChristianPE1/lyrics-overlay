import { useCallback, useRef } from "react";
import { getCurrentWindow } from "@tauri-apps/api/window";
import { WINDOW_CONFIG } from "../config/constants";

// Custom hook for window control operations
export default function useWindowControls() {
   const originalSizeRef = useRef({
      width: WINDOW_CONFIG.DEFAULT_WIDTH,
      height: WINDOW_CONFIG.DEFAULT_HEIGHT
   });

   // Start window dragging
   const startDrag = useCallback(async (e) => {
      if (e.button !== 0) return;

      // Don't drag if clicking on interactive elements
      if (e.target.closest(".window-controls") ||
         e.target.closest(".settings-panel") ||
         e.target.tagName === "BUTTON" ||
         e.target.tagName === "INPUT" ||
         e.target.tagName === "LABEL") {
         return;
      }

      e.preventDefault();

      try {
         const appWindow = getCurrentWindow();
         await appWindow.startDragging();
      } catch (err) {
         // Silent fail
      }
   }, []);

   // Close window
   const handleClose = useCallback(async (e) => {
      e.preventDefault();
      e.stopPropagation();
      try {
         const appWindow = getCurrentWindow();
         await appWindow.close();
      } catch (err) {
         // Silent fail
      }
   }, []);

   // Minimize window
   const handleMinimize = useCallback(async (e) => {
      e.preventDefault();
      e.stopPropagation();
      try {
         const appWindow = getCurrentWindow();
         await appWindow.minimize();
      } catch (err) {
         // Silent fail
      }
   }, []);

   // Toggle settings panel and resize window accordingly
   const toggleSettingsWithResize = useCallback(async (showSettings, setShowSettings) => {
      try {
         const appWindow = getCurrentWindow();
         const currentSize = await appWindow.innerSize();

         if (!showSettings) {
            // Opening settings: save current size and expand
            originalSizeRef.current = { width: currentSize.width, height: currentSize.height };
            const targetHeight = Math.max(WINDOW_CONFIG.SETTINGS_HEIGHT, currentSize.height);
            await appWindow.setSize({ width: currentSize.width, height: targetHeight, type: "Logical" });
         } else {
            // Closing settings: restore original size
            await appWindow.setSize({
               width: originalSizeRef.current.width,
               height: originalSizeRef.current.height,
               type: "Logical"
            });
         }
      } catch (err) {
         // Silent fail
      }

      setShowSettings(prev => !prev);
   }, []);

   return {
      startDrag,
      handleClose,
      handleMinimize,
      toggleSettingsWithResize
   };
}
