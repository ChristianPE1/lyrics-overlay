/**
Lyrics Overlay

A floating window that displays synchronized lyrics from YouTube Music.
Receives lyrics data via WebSocket from a browser extension.
*/

import { useState, useCallback } from "react";
import { ConnectionStatus, LyricsDisplay, SettingsPanel, SongInfo, WindowControls } from "./components";
import { useSettings, useWebSocket, useWindowControls } from "./hooks";
import { processLyrics } from "./utils/lyrics";

function App() {
  // Lyrics state
  const [currentLyric, setCurrentLyric] = useState("Waiting for lyrics...");
  const [nextLyric, setNextLyric] = useState("");
  const [songInfo, setSongInfo] = useState({ title: "", artist: "" });
  
  // UI state
  const [showSettings, setShowSettings] = useState(false);

  // Custom hooks
  const { 
    settings, 
    syncOffset, 
    updateSetting, 
    resetSettings, 
    adjustSyncOffset, 
    resetSyncOffset,
    setSyncOffset 
  } = useSettings();

  const { startDrag, handleClose, handleMinimize, toggleSettingsWithResize } = useWindowControls();

  // Handle lyrics received from WebSocket
  const handleLyrics = useCallback((data, offset) => {
    const current = processLyrics(
      data.current, 
      data.currentRomanized, 
      settings.showRomanization
    );
    const next = processLyrics(
      data.next, 
      data.nextRomanized, 
      settings.showRomanization
    );

    if (offset === 0) {
      setCurrentLyric(current || "");
      setNextLyric(next || "");
    } else if (offset > 0) {
      // Delay lyrics display
      setTimeout(() => {
        setCurrentLyric(current || "");
        setNextLyric(next || "");
      }, offset);
    } else {
      setCurrentLyric(current || "");
      setNextLyric(next || "");
    }
  }, [settings.showRomanization]);

  // Handle song info received from WebSocket
  const handleSongInfo = useCallback((data) => {
    setSongInfo({ title: data.title || "", artist: data.artist || "" });
    setSyncOffset(0);
  }, [setSyncOffset]);

  // Handle no lyrics available
  const handleNoLyrics = useCallback(() => {
    setCurrentLyric("No lyrics available");
    setNextLyric("");
  }, []);

  // WebSocket connection
  const { isConnected, sendSyncOffset } = useWebSocket({
    onLyrics: handleLyrics,
    onSongInfo: handleSongInfo,
    onNoLyrics: handleNoLyrics
  });

  // Settings panel toggle
  const handleToggleSettings = useCallback((e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleSettingsWithResize(showSettings, setShowSettings);
  }, [showSettings, toggleSettingsWithResize]);

  // Sync offset handlers
  const handleAdjustSyncOffset = useCallback((delta) => {
    adjustSyncOffset(delta, sendSyncOffset);
  }, [adjustSyncOffset, sendSyncOffset]);

  const handleResetSyncOffset = useCallback(() => {
    resetSyncOffset(sendSyncOffset);
  }, [resetSyncOffset, sendSyncOffset]);

  return (
    <div 
      className="h-full w-full bg-[--bg-color] rounded-xl flex flex-col justify-center items-center py-3 px-5 cursor-grab active:cursor-grabbing select-none relative border border-[--border-color] shadow-[0_8px_32px_rgba(0,0,0,0.4)]"
      onMouseDown={startDrag}
    >
      <ConnectionStatus isConnected={isConnected} />
      
      <WindowControls 
        onSettings={handleToggleSettings}
        onMinimize={handleMinimize}
        onClose={handleClose}
      />

      {showSettings && (
        <SettingsPanel
          settings={settings}
          syncOffset={syncOffset}
          onUpdateSetting={updateSetting}
          onAdjustSyncOffset={handleAdjustSyncOffset}
          onResetSyncOffset={handleResetSyncOffset}
          onResetSettings={resetSettings}
          onClose={handleToggleSettings}
        />
      )}

      <SongInfo title={songInfo.title} artist={songInfo.artist} />
      
      <LyricsDisplay currentLyric={currentLyric} nextLyric={nextLyric} />
    </div>
  );
}

export default App;
