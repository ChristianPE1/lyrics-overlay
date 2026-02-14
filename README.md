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

Go to the [**Releases Page**](../../releases) to download the latest version.

### For Windows Users
Download **`LyricsOverlay_Windows_x64.zip`**.
* Contains the Installer (`.exe`), the Server, and the Startup Script.

### For Linux Users
Download **`LyricsOverlay_Linux_x64.zip`**.
* Contains the Debian Package (`.deb`) for Ubuntu/Debian/Mint, the Server, and the Startup Script.
* *Note for Arch/Manjaro users:* You can extract the `.deb`, build from source or run the server and app directly from the source code.

### For macOS Users
Currently without a prebuilt release. But you can build from source or run the server and app directly from the source code.

### Run from source

Follow the instructions in the [Contributing Guide](CONTRIBUTING.md) to set up a development environment and run the app from source.

## Requirements

1. **BetterLyrics Extension**: Install from [better-lyrics.boidu.dev](https://better-lyrics.boidu.dev/)
2. **Keep YouTube Music on the Lyrics tab**: The extension reads lyrics from the visible lyrics panel
3. **Node.js**: Required to run the WebSocket server bridge

## Installation & Usage (For users)

### Step 1: Install the App
1. **Windows:** Run the `Lyrics Overlay_0.1.0_x64-setup.exe` inside the downloaded ZIP.
2. **Linux:** Install the `.deb` file (`sudo dpkg -i filename.deb` or double-click).

### Step 2: Install the Connector Extension
*Since this project is new, the connector extension is not yet in the Chrome Web Store.*

1. Extract the `extension` folder from the ZIP or source code.
2. Open Chrome/Edge and go to `chrome://extensions/`.
3. Enable **Developer mode** (top right toggle).
4. Click **Load unpacked**.
5. Select the `extension` folder you extracted.

### Step 3: Run the Server
The app needs a small local server to talk to the browser.
1. Go to the `server` folder inside your download.
2. **Windows:** Double-click `start-server.bat`.
3. **Linux:** Open a terminal, give permissions (`chmod +x start-server.sh`) and run `./start-server.sh`.
4. **Keep this window open** (you can minimize it).

### Step 4: Enjoy!
1. Open the **Lyrics Overlay** app.
2. Open **YouTube Music** in your browser.
3. **Crucial:** Go to the **Lyrics Tab** in YouTube Music so Better Lyrics is active.
4. Play a song!

---

## Linux Specifics (Wayland / GNOME)

If you are using Wayland (default on modern Ubuntu/Fedora/Arch with GNOME), the "Always on Top" feature might be blocked by the OS security.

**Solution:**
1. Focus the Lyrics Overlay window.
2. Press `Alt` + `Space` to open the window menu.
3. Select **"Always on Top"**.

---

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

## Contributing

Contributions are welcome! Please read [CONTRIBUTING.md](CONTRIBUTING.md) for guidelines.

### Development Guidelines

1. **Code organization**: Keep components small and focused
2. **Hooks**: Use custom hooks for reusable logic
3. **Comments**: Keep comments specific and helpful
4. **Testing**: Test with various languages (Japanese, Korean, Chinese, English)

## Troubleshooting

### Connection issues

- The server runs on port 9876
- Make sure no firewall is blocking the connection
- Try restarting both the server and the app
- Ensure your AdBlocker (uBlock Origin, AdBlock Plus, Brave AdBlock, etc.) is **disabled** for `music.youtube.com`. Some privacy extensions block the WebSocket connection to `localhost`.

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

### Unsynced or Unavailable lyrics

- Some songs may don't have synced lyrics available. In that case, only the current line will show without timing.
- Some song may not have lyrics at all, in that case the app will show "No lyrics found" and wait for the next song (*You can try to add the lyrics to one of the supported lyrics providers by BetterLyrics*).

## License

This project is licensed under the [GNU GPLv3 License](LICENSE). As long as you attribute me or **Lyrics Overlay** as the original creator and comply with the rest of the license terms, you can use this project for personal or commercial purposes.


## Acknowledgments

- [BetterLyrics](https://github.com/better-lyrics/better-lyrics) - Synchronized lyrics on YouTube Music
