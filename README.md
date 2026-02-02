# Lyrics Overlay

A floating always-on-top window that displays synchronized lyrics from YouTube Music using BetterLyrics.

## Features

- **Always on top**: Window stays visible over other applications
- **Customizable appearance**: Adjust font size, colors, and transparency
- **Sync offset adjustment**: Fine-tune lyrics timing (+/- 2 seconds)
- **Show romanization**: Display romanized text for Korean, Japanese, Chinese, and other languages
- **Draggable window**: Move the window anywhere on screen
- **Current and next line**: Shows upcoming lyrics

## Downloads

### Windows
- **Installer (MSI)**: Recommended for most users
- **NSIS Installer**: Alternative Windows installer

**Note**: Currently, only Windows installers are built automatically. For macOS and Linux, users need to build on their respective platforms or use cross-compilation tools. Download installers from the releases page.

## Important Requirements

1. **BetterLyrics Extension**: Install from [better-lyrics.boidu.dev](https://better-lyrics.boidu.dev/)
2. **Keep YouTube Music on the Lyrics tab**: The extension reads lyrics from the visible lyrics panel
3. **Node.js**: Required to run the WebSocket server bridge

## Architecture

```
+------------------+     WebSocket      +------------------+     WebSocket      +------------------+
|  YouTube Music   | -----------------> |      Server      | <----------------> |    Tauri App     |
|  + BetterLyrics  |    (extension)     |    (Node.js)     |     (lyrics)       |  (overlay window)|
|  + Extension     |                    |    port 9876     |                    |                  |
+------------------+                    +------------------+                    +------------------+
```

The system consists of three components:

1. **Chrome Extension** (`extension/`): Extracts lyrics from BetterLyrics on YouTube Music
2. **WebSocket Server** (`server/`): Acts as a bridge between the extension and the Tauri app  
3. **Tauri App** (`src/` + `src-tauri/`): Desktop application that displays the floating lyrics

## Installation (Development)

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/lyrics-overlay.git
cd lyrics-overlay
```

### 2. Install dependencies

```bash
# Main folder (Tauri app)
npm install

# Server folder
cd server
npm install
cd ..
```

### 3. Load the extension in Chrome

1. Open `chrome://extensions/`
2. Enable "Developer mode" (top right corner)
3. Click "Load unpacked"
4. Select the `extension/` folder from this repository

## Usage

### Using the app

1. **Start the WebSocket server first**:
   ```bash
   cd server
   npm start
   ```

2. **Start the Tauri app**:
   ```bash
   npm run tauri dev
   ```

3. **Open YouTube Music** in Chrome
4. **Navigate to the Lyrics tab** (important!)
5. **Enable BetterLyrics** if not already active
6. **Play a song** with lyrics

Lyrics will appear in the floating window!


## Settings

Click the gear icon in the window to access settings:

| Setting | Description |
|---------|-------------|
| Font Size | Main lyrics text size (12-48px) |
| Next Line Size | Upcoming line text size (8-32px) |
| Background Opacity | Window transparency (10-100%) |
| Background Color | Window background color |
| Text Color | Lyrics text color |
| Accent Color | Connection indicator and accent color |
| Show Romanization | Show romanized text (Korean, Japanese, etc.) |
| Sync Offset | Adjust lyrics timing (-2s to +2s) |

Settings are saved automatically. Sync offset resets on each new song.

## Project Structure

```
lyrics-overlay/
├── src/                      # React frontend (Tauri webview)
│   ├── components/          # UI components
│   │   ├── ConnectionStatus.jsx
│   │   ├── LyricsDisplay.jsx
│   │   ├── SettingsPanel.jsx
│   │   ├── SongInfo.jsx
│   │   └── WindowControls.jsx
│   ├── hooks/               # Custom React hooks
│   │   ├── useSettings.js
│   │   ├── useWebSocket.js
│   │   └── useWindowControls.js
│   ├── utils/               # Utility functions
│   │   ├── colors.js
│   │   ├── lyrics.js
│   │   └── storage.js
│   ├── config/              # Configuration
│   │   └── constants.js
│   ├── App.jsx              # Main app component
│   └── main.jsx             # Entry point
├── extension/                # Chrome extension
│   ├── content.js           # Lyrics extraction
│   └── manifest.json      # Extension manifest
├── server/                   # WebSocket bridge server
│   ├── server.js            # Node.js server
│   └── package.json         # Server dependencies
├── src-tauri/                # Tauri backend (Rust)
│   ├── src/
│   │   ├── main.rs          # Entry point
│   │   └── lib.rs           # Library code
│   ├── tauri.conf.json      # Configuration
│   └── icons/               # App icons
├── scripts/                  # Build scripts
│   └── build-portable.mjs   # Portable package builder
├── package.json             # Main dependencies
└── vite.config.js           # Vite configuration
```

## Build

### Standard build (installers)

```bash
npm run tauri:build
```

Installers will be created in:
- `src-tauri/target/release/bundle/msi/` (Windows MSI)
- `src-tauri/target/release/bundle/nsis/` (Windows NSIS)

**Note**: Cross-platform builds (macOS DMG, Linux DEB/AppImage) require building on the respective platforms or using Tauri CLI with cross-compilation tools.

## Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Development Guidelines

1. **Code organization**: Keep components small and focused
2. **Hooks**: Use custom hooks for reusable logic
3. **Comments**: Keep comments specific and helpful
4. **Testing**: Test with various languages (Japanese, Korean, Chinese, English)

## Troubleshooting

### Lyrics not appearing

1. Make sure the server is running (`cd server && npm start`)
2. Check that the extension is loaded in Chrome
3. Verify YouTube Music is on the **Lyrics tab**
4. Ensure BetterLyrics is active
5. Check the connection indicator (green = connected)

### Romanization not working

1. Enable romanization in BetterLyrics settings
2. Enable "Show romanization" in Lyrics Overlay settings
3. Make sure the song has romanization available
4. If issues persist, send us a snippet of the lyrics from BetterLyrics along with the song name so we can review and fix it in the code

### Connection issues

- The server runs on port 9876
- Make sure no firewall is blocking the connection
- Try restarting both the server and the app

## License

This project is licensed under the [GNU GPLv3 License](LICENSE). As long as you attribute me or **Lyrics Overlay** as the original creator and comply with the rest of the license terms, you can use this project for personal or commercial purposes.


## Acknowledgments

- [BetterLyrics](https://github.com/better-lyrics/better-lyrics) - Synchronized lyrics on YouTube Music
