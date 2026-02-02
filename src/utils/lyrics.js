/*
Process lyrics text based on romanization preference

When showRomanization is enabled and romanized text is available,
use the romanized version. Otherwise use the original.
- original - Original lyrics text
- romanized - Romanized version of the text
- showRomanization - Whether to prefer romanized text
*/
export function processLyrics(original, romanized, showRomanization) {
   if (!original) return "";

   // If romanization is enabled and available, use it
   if (showRomanization && romanized && romanized.trim()) {
      return romanized.trim();
   }

   return original.trim();
}
