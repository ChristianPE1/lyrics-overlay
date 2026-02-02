# Contributing to Lyrics Overlay

Thank you for your interest in contributing to Lyrics Overlay! This document provides guidelines and information for contributors.

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 18 or higher
- [Rust](https://rustup.rs/) (latest stable)
- [Chrome](https://www.google.com/chrome/) or [Edge](https://www.microsoft.com/edge) browser
- [BetterLyrics](https://better-lyrics.boidu.dev/) browser extension

### Development Setup

1. Fork and clone the repository
2. Install dependencies:
   ```bash
   npm install
   cd server && npm install && cd ..
   ```
3. Generate extension icons:
   ```bash
   node extension/create-icons.js
   ```
4. Load the extension in Chrome (see README.md)

## Development Workflow

### Running in Development Mode

```bash
# Start both server and Tauri app in development mode
start-dev.bat

# Or manually:
# Terminal 1: Start the server
cd server && npm start

# Terminal 2: Start the Tauri app with hot reload
npm run tauri dev
```

### Project Structure Overview

| Directory | Purpose |
|-----------|---------|
| `src/` | React frontend (displayed in Tauri webview) |
| `extension/` | Chrome extension that extracts lyrics |
| `server/` | WebSocket server that bridges extension and app |
| `src-tauri/` | Tauri/Rust backend for the desktop app |

### Making Changes

1. Create a feature branch from `main`
2. Make your changes
3. Test with multiple languages (Japanese, Korean, Chinese, English)
4. Ensure no console errors in browser or app
5. Submit a pull request

## Code Guidelines

These are just friendly suggestions to keep things consistent and readable. Don't stress if your code doesn't follow them perfectly – we're all learning!

### General

- Try to use descriptive names for variables and functions (makes it easier for others to understand)
- Aim for functions that do one main thing.
- Add comments where the code might be confusing, but avoid over-commenting obvious stuff
- Skip emojis in comments – they can distract from the code

### JavaScript/React

- Go for functional components with hooks when it feels natural
- Use `const` instead of `let` where you can – it's a small win for clarity
- Template literals (`${}`) are handy for building strings
- Try to handle errors nicely with try-catch, but don't over-engineer it

### CSS

- CSS custom properties (variables) are great for themes – use them if it helps
- Keep selectors reasonably specific without making them too complicated
- Group similar properties together for better organization

## Testing

Before submitting a PR, test:

1. **Connection**: Extension connects to server, app receives lyrics
2. **Languages**: Japanese, Korean, Chinese lyrics display correctly
3. **Romanization**: Toggle works for all supported languages
4. **Settings**: All settings save and apply correctly
5. **Window**: Dragging, minimize, close work properly

## Pull Request Process

1. Update documentation if needed
2. Ensure all existing features still work
3. Describe what your PR does and why
4. Link any related issues

## Reporting Issues

When reporting bugs, please include:

- Operating system and version
- Browser and version
- Steps to reproduce
- Expected vs actual behavior
- Console logs if applicable

## Questions?

Feel free to open an issue for questions or discussion.
