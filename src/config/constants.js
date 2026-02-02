// Default application settings
export const DEFAULT_SETTINGS = {
   fontSize: 22,
   nextLineFontSize: 14,
   opacity: 0.85,
   bgColor: { r: 15, g: 15, b: 15 },
   textColor: { r: 255, g: 255, b: 255 },
   accentColor: { r: 29, g: 185, b: 84 },
   showRomanization: false,
   syncOffset: 0,
};

// WebSocket configuration
export const WS_CONFIG = {
   URL: "ws://127.0.0.1:9876",
   RECONNECT_INTERVAL: 3000,
};

// Window size configuration
export const WINDOW_CONFIG = {
   DEFAULT_WIDTH: 600,
   DEFAULT_HEIGHT: 150,
   SETTINGS_HEIGHT: 400,
};
