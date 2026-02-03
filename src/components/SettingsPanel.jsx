import { rgbToHex, hexToRgb } from "../utils/colors";

export default function SettingsPanel({ 
  settings, 
  syncOffset, 
  onUpdateSetting, 
  onAdjustSyncOffset, 
  onResetSyncOffset, 
  onResetSettings, 
  onClose 
}) {
  const syncBtnBase = "flex-1 py-1 px-1.5 text-sm border-none rounded cursor-pointer transition-all duration-200 text-[color:var(--text-primary)]";

  return (
    <div 
      className="absolute top-8 right-2 left-2 bottom-2 border border-[--border-color] rounded-lg shadow-2xl z-200 overflow-hidden cursor-default flex flex-col"
      style={{ backgroundColor: 'var(--panel-bg)' }}
      onMouseDown={(e) => e.stopPropagation()}
    >
      {/* Header */}
      <div className="flex justify-between items-center px-3 py-2.5 border-b border-[--border-color] text-[13px] font-semibold" style={{ color: 'var(--text-primary)' }}>
        <span>Settings</span>
        <button 
          className="bg-transparent border-none cursor-pointer p-0.5 flex items-center justify-center rounded transition-all duration-200 hover:bg-[--control-hover]"
          style={{ color: 'var(--text-secondary)' }}
          onClick={onClose}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
        </button>
      </div>
      
      {/* Content */}
      <div className="p-3 flex-1 overflow-y-auto custom-scrollbar space-y-3.5">
        {/* Font Size */}
        <div>
          <label className="block text-base mb-1.5" style={{ color: 'var(--text-secondary)' }}>
            Font Size: {settings.fontSize}px
          </label>
          <input 
            type="range" 
            min="12" 
            max="48" 
            value={settings.fontSize}
            onChange={(e) => onUpdateSetting("fontSize", parseInt(e.target.value))}
          />
        </div>

        {/* Next Line Font Size */}
        <div>
          <label className="block text-base mb-1.5" style={{ color: 'var(--text-secondary)' }}>
            Next Line Size: {settings.nextLineFontSize}px
          </label>
          <input 
            type="range" 
            min="8" 
            max="32" 
            value={settings.nextLineFontSize}
            onChange={(e) => onUpdateSetting("nextLineFontSize", parseInt(e.target.value))}
          />
        </div>

        {/* Opacity */}
        <div>
          <label className="block text-base mb-1.5" style={{ color: 'var(--text-secondary)' }}>
            Background Opacity: {Math.round(settings.opacity * 100)}%
          </label>
          <input 
            type="range" 
            min="10" 
            max="100" 
            value={settings.opacity * 100}
            onChange={(e) => onUpdateSetting("opacity", parseInt(e.target.value) / 100)}
          />
        </div>

        {/* Background Color */}
        <div className="flex items-center justify-between">
          <label className="text-base" style={{ color: 'var(--text-secondary)' }}>Background Color</label>
          <input 
            className="border-2"
            style={{color: 'var(--text-primary)'}}
            type="color" 
            value={rgbToHex(settings.bgColor)}
            onChange={(e) => {
              const rgb = hexToRgb(e.target.value);
              if (rgb) onUpdateSetting("bgColor", rgb);
            }}
          />
        </div>

        {/* Text Color */}
        <div className="flex items-center justify-between">
          <label className="text-base" style={{ color: 'var(--text-secondary)' }}>Text Color</label>
          <input 
            className="border-2"
            style={{color: 'var(--text-primary)'}}
            type="color"
            value={rgbToHex(settings.textColor)}
            onChange={(e) => {
              const rgb = hexToRgb(e.target.value);
              if (rgb) onUpdateSetting("textColor", rgb);
            }}
          />
        </div>

        {/* Accent Color */}
        <div className="flex items-center justify-between">
          <label className="text-sm" style={{ color: 'var(--text-secondary)' }}>Accent Color</label>
          <input 
            className="border-2"
            style={{color: 'var(--text-primary)'}}
            type="color" 
            value={rgbToHex(settings.accentColor)}
            onChange={(e) => {
              const rgb = hexToRgb(e.target.value);
              if (rgb) onUpdateSetting("accentColor", rgb);
            }}
          />
        </div>

        {/* Show Romanization */}
        <div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input 
              type="checkbox" 
              checked={settings.showRomanization}
              onChange={(e) => onUpdateSetting("showRomanization", e.target.checked)}
            />
            <span className="text-sm" style={{ color: 'var(--text-primary)' }}>Show romanization only</span>
          </label>
          <p className="text-xs mt-1 opacity-70" style={{ color: 'var(--text-secondary)' }}>
            Shows romanized text when available from BetterLyrics
          </p>
        </div>

        {/* Sync Offset */}
        <div>
          <label className="block text-base mb-1.5" style={{ color: 'var(--text-secondary)' }}>
            Sync Offset: {syncOffset >= 0 ? "+" : ""}{syncOffset}ms
          </label>
          <div className="flex gap-1 mt-1.5">
            <button className={`${syncBtnBase} bg-[--border-color] hover:bg-[--accent-color]`} onClick={() => onAdjustSyncOffset(-500)}>-0.5s</button>
            <button className={`${syncBtnBase} bg-[--border-color] hover:bg-[--accent-color]`} onClick={() => onAdjustSyncOffset(-100)}>-0.1s</button>
            <button className={`${syncBtnBase} bg-transparent border border-[--border-color] hover:bg-[--control-hover]`} onClick={onResetSyncOffset}>Reset</button>
            <button className={`${syncBtnBase} bg-[--border-color] hover:bg-[--accent-color]`} onClick={() => onAdjustSyncOffset(100)}>+0.1s</button>
            <button className={`${syncBtnBase} bg-[--border-color] hover:bg-[--accent-color]`} onClick={() => onAdjustSyncOffset(500)}>+0.5s</button>
          </div>
          <p className="text-xs mt-1 opacity-70" style={{ color: 'var(--text-secondary)' }}>Resets on next song</p>
        </div>

        {/* Reset All */}
        <div>
          <button 
            className="w-full py-2 text-base bg-transparent border border-red-500 rounded text-red-500 cursor-pointer transition-all duration-200 hover:bg-red-500 hover:text-white"
            onClick={onResetSettings}
          >
            Reset All Settings
          </button>
        </div>
      </div>
    </div>
  );
}
