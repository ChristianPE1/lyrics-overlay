

// Convert RGB object to hex string
// color - RGB color object with r, g, b properties
// returns Hex color string (e.g., "#ff0000")
export function rgbToHex(color) {
   return "#" + [color.r, color.g, color.b]
      .map(x => x.toString(16).padStart(2, "0"))
      .join("");
}

// Convert hex string to RGB object
// hex - Hex color string (e.g., "#ff0000")
// returns RGB color object or null if invalid
export function hexToRgb(hex) {
   const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
   return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
   } : null;
}


// Apply settings to CSS custom properties
// settings - Application settings object
export function applySettingsToCss(settings) {
   const root = document.documentElement;
   root.style.setProperty("--font-size-current", `${settings.fontSize}px`);
   root.style.setProperty("--font-size-next", `${settings.nextLineFontSize}px`);
   root.style.setProperty("--bg-opacity", settings.opacity);
   root.style.setProperty(
      "--bg-color",
      `rgba(${settings.bgColor.r}, ${settings.bgColor.g}, ${settings.bgColor.b}, ${settings.opacity})`
   );
   root.style.setProperty(
      "--text-primary",
      `rgb(${settings.textColor.r}, ${settings.textColor.g}, ${settings.textColor.b})`
   );
   root.style.setProperty(
      "--accent-color",
      `rgb(${settings.accentColor.r}, ${settings.accentColor.g}, ${settings.accentColor.b})`
   );
}
