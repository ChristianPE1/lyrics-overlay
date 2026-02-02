/*
Lyrics Overlay Connector - Content Script

Extracts synchronized lyrics from BetterLyrics on YouTube Music
and sends them to the Lyrics Overlay application via WebSocket.
*/

(function () {
   "use strict";

   // Prevent multiple executions
   if (window.__lyricsOverlayLoaded) return;
   window.__lyricsOverlayLoaded = true;

   // Configuration
   const CONFIG = {
      WS_URL: "ws://127.0.0.1:9876",
      RECONNECT_INTERVAL: 3000,
      LYRICS_POLL_INTERVAL: 200,
      SONG_CHECK_INTERVAL: 800,
      DEBUG: false
   };

   // DOM Selectors for BetterLyrics
   const SELECTORS = {
      LYRICS_WRAPPER: "#blyrics-wrapper",
      LYRICS_CONTAINER: ".blyrics-container",
      ACTIVE_LINE: [
         ".blyrics--line.blyrics--animating",
         ".blyrics--active",
         ".blyrics--line[data-active='true']"
      ],
      WORD: ".blyrics--word",
      ROMANIZED: ".blyrics--romanized",
      TRANSLATED: ".blyrics--translated",
      SONG_TITLE: ".title.ytmusic-player-bar",
      SONG_ARTIST: ".byline.ytmusic-player-bar a",
      PLAYER_BAR: "ytmusic-player-bar"
   };

   // State management
   const state = {
      socket: null,
      lastLyric: "",
      lastSongTitle: "",
      lastSongArtist: "",
      syncOffset: 0,
      isConnected: false
   };

   // Debug logging
   function log(...args) {
      if (CONFIG.DEBUG) {
         console.log("[LyricsOverlay]", ...args);
      }
   }

   // WebSocket connection
   function connect() {
      if (state.socket && state.socket.readyState === WebSocket.OPEN) return;

      try {
         state.socket = new WebSocket(CONFIG.WS_URL);

         state.socket.onopen = () => {
            state.isConnected = true;
            log("Connected to server");
            sendSongInfo();
         };

         state.socket.onmessage = (event) => {
            try {
               const data = JSON.parse(event.data);
               handleServerMessage(data);
            } catch (e) {
               log("Error parsing server message:", e);
            }
         };

         state.socket.onclose = () => {
            state.isConnected = false;
            state.socket = null;
            log("Disconnected from server");
         };

         state.socket.onerror = () => {
            state.socket.close();
         };
      } catch (e) {
         log("Connection error:", e);
      }
   }

   // Handle incoming server messages
   function handleServerMessage(data) {
      if (data.type === "syncOffset") {
         state.syncOffset = data.offset || 0;
         log("Sync offset updated:", state.syncOffset);
      }
   }

   // Send data to WebSocket server
   function send(data) {
      if (state.socket && state.socket.readyState === WebSocket.OPEN) {
         state.socket.send(JSON.stringify(data));
         log("Sent:", data.type);
      }
   }

   // Extract and send song information
   function sendSongInfo() {
      const titleEl = document.querySelector(SELECTORS.SONG_TITLE);
      const artistEl = document.querySelector(SELECTORS.SONG_ARTIST);

      if (!titleEl) return;

      const title = titleEl.textContent?.trim() || "";
      const artist = artistEl?.textContent?.trim() || "";

      if (title !== state.lastSongTitle || artist !== state.lastSongArtist) {
         state.lastSongTitle = title;
         state.lastSongArtist = artist;
         state.lastLyric = "";

         send({
            type: "songInfo",
            title: title,
            artist: artist
         });

         log("Song changed:", title, "-", artist);
      }
   }

   // Get text from word spans in an element
   function getWordsText(element) {
      if (!element) return "";

      const words = element.querySelectorAll(SELECTORS.WORD);
      if (words.length > 0) {
         return Array.from(words)
            .map(w => w.textContent)
            .join("")
            .trim();
      }

      return element.textContent?.trim() || "";
   }

   // Get romanization text from a line element
   function getRomanization(lineElement) {
      if (!lineElement) return "";

      const romanizedEl = lineElement.querySelector(SELECTORS.ROMANIZED);
      if (romanizedEl) {
         return romanizedEl.textContent?.trim() || "";
      }

      return "";
   }

   // Get translation text from a line element
   function getTranslation(lineElement) {
      if (!lineElement) return "";

      const translatedEl = lineElement.querySelector(SELECTORS.TRANSLATED);
      if (translatedEl) {
         return translatedEl.textContent?.trim() || "";
      }

      return "";
   }

   // Extract lyrics data from a line element
   function extractLineData(lineElement) {
      if (!lineElement) return null;

      const original = getWordsText(lineElement);
      const romanized = getRomanization(lineElement);
      const translated = getTranslation(lineElement);

      return {
         original: original,
         romanized: romanized,
         translated: translated
      };
   }

   // Find the currently active lyric line
   function findActiveLyric() {
      // Method 1: Find by active/animating class
      for (const selector of SELECTORS.ACTIVE_LINE) {
         const activeEl = document.querySelector(selector);
         if (activeEl) {
            const currentData = extractLineData(activeEl);
            if (currentData && currentData.original) {
               const nextEl = activeEl.nextElementSibling;
               const nextData = nextEl ? extractLineData(nextEl) : null;

               return {
                  current: currentData,
                  next: nextData
               };
            }
         }
      }

      // Method 2: Find by computed styles
      const wrapper = document.querySelector(SELECTORS.LYRICS_WRAPPER);
      if (wrapper) {
         const lines = wrapper.querySelectorAll(".blyrics--line");

         for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const computed = window.getComputedStyle(line);
            const transform = computed.transform;
            const opacity = parseFloat(computed.opacity);

            const isActive = (
               line.classList.contains("blyrics--animating") ||
               (transform && transform !== "none" && !transform.includes("0.95")) ||
               opacity >= 0.9
            );

            if (isActive) {
               const currentData = extractLineData(line);
               if (currentData && currentData.original) {
                  const nextLine = lines[i + 1];
                  const nextData = nextLine ? extractLineData(nextLine) : null;

                  return {
                     current: currentData,
                     next: nextData
                  };
               }
            }
         }
      }

      // Method 3: Find centered line
      const container = document.querySelector(SELECTORS.LYRICS_CONTAINER);
      if (container) {
         const containerRect = container.getBoundingClientRect();
         const centerY = containerRect.top + containerRect.height / 2;

         const lines = container.querySelectorAll(".blyrics--line");
         let closestLine = null;
         let closestDistance = Infinity;
         let closestIndex = -1;

         for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            const text = getWordsText(line);
            if (!text) continue;

            const rect = line.getBoundingClientRect();
            const lineCenter = rect.top + rect.height / 2;
            const distance = Math.abs(lineCenter - centerY);

            if (distance < closestDistance) {
               closestDistance = distance;
               closestLine = line;
               closestIndex = i;
            }
         }

         if (closestLine && closestDistance < 100) {
            const currentData = extractLineData(closestLine);
            const nextLine = lines[closestIndex + 1];
            const nextData = nextLine ? extractLineData(nextLine) : null;

            return {
               current: currentData,
               next: nextData
            };
         }
      }

      return null;
   }

   // Process and send lyrics updates
   function processLyrics() {
      const lyrics = findActiveLyric();

      if (lyrics && lyrics.current && lyrics.current.original !== state.lastLyric) {
         state.lastLyric = lyrics.current.original;

         send({
            type: "lyrics",
            current: lyrics.current.original,
            currentRomanized: lyrics.current.romanized || "",
            currentTranslated: lyrics.current.translated || "",
            next: lyrics.next?.original || "",
            nextRomanized: lyrics.next?.romanized || "",
            nextTranslated: lyrics.next?.translated || ""
         });
      }
   }

   // Check for lyrics availability
   function checkLyricsAvailable() {
      const wrapper = document.querySelector(SELECTORS.LYRICS_WRAPPER);
      const container = document.querySelector(SELECTORS.LYRICS_CONTAINER);

      if (!wrapper && !container) {
         if (state.lastLyric !== "__NO_LYRICS__") {
            state.lastLyric = "__NO_LYRICS__";
            send({ type: "noLyrics" });
         }
         return false;
      }

      const noLyricsAttr = container?.dataset.noLyrics;
      if (noLyricsAttr === "true") {
         if (state.lastLyric !== "__NO_LYRICS__") {
            state.lastLyric = "__NO_LYRICS__";
            send({ type: "noLyrics" });
         }
         return false;
      }

      return true;
   }

   // Setup mutation observer for DOM changes
   function setupObserver() {
      const observer = new MutationObserver(() => {
         if (checkLyricsAvailable()) {
            processLyrics();
         }
      });

      observer.observe(document.body, {
         childList: true,
         subtree: true,
         attributes: true,
         characterData: true,
         attributeFilter: ["class", "style", "data-active"]
      });

      // Polling as backup
      setInterval(() => {
         if (checkLyricsAvailable()) {
            processLyrics();
         }
      }, CONFIG.LYRICS_POLL_INTERVAL);

      log("Observer initialized");
   }

   // Setup song change detection
   function setupSongObserver() {
      setInterval(() => {
         sendSongInfo();
      }, CONFIG.SONG_CHECK_INTERVAL);
   }

   // Main initialization
   function init() {
      log("Initializing...");

      connect();

      // Reconnection loop
      setInterval(() => {
         if (!state.socket || state.socket.readyState === WebSocket.CLOSED) {
            connect();
         }
      }, CONFIG.RECONNECT_INTERVAL);

      // Wait for player to load
      const waitForPlayer = setInterval(() => {
         if (document.querySelector(SELECTORS.PLAYER_BAR)) {
            clearInterval(waitForPlayer);
            log("Player detected");
            setupObserver();
            setupSongObserver();
            sendSongInfo();
            processLyrics();
         }
      }, 500);
   }

   // Start initialization
   if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", init);
   } else {
      init();
   }
})();
