import { useEffect, useRef, useState, useCallback } from "react";
import { WS_CONFIG } from "../config/constants";

/*
Custom hook for managing WebSocket connection to the lyrics server
- onLyrics - Callback when lyrics are received
- onSongInfo - Callback when song info is received
- onNoLyrics - Callback when no lyrics available
returns WebSocket state and methods
*/
export default function useWebSocket({ onLyrics, onSongInfo, onNoLyrics }) {
   const [isConnected, setIsConnected] = useState(false);
   const wsRef = useRef(null);
   const syncOffsetRef = useRef(0);

   // Send sync offset to extension
   const sendSyncOffset = useCallback((offset) => {
      syncOffsetRef.current = offset;
      if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
         wsRef.current.send(JSON.stringify({
            type: "syncOffset",
            offset: offset
         }));
      }
   }, []);

   // Handle incoming WebSocket messages
   const handleMessage = useCallback((event) => {
      try {
         const data = JSON.parse(event.data);

         switch (data.type) {
            case "lyrics":
               onLyrics?.(data, syncOffsetRef.current);
               break;
            case "songInfo":
               onSongInfo?.(data);
               break;
            case "noLyrics":
               onNoLyrics?.();
               break;
            default:
               break;
         }
      } catch (e) {
         // Silent fail for parse errors
      }
   }, [onLyrics, onSongInfo, onNoLyrics]);

   // Establish WebSocket connection
   useEffect(() => {
      let reconnectInterval = null;

      const connect = () => {
         if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) return;

         const ws = new WebSocket(WS_CONFIG.URL);
         wsRef.current = ws;

         ws.onopen = () => {
            setIsConnected(true);
         };

         ws.onmessage = handleMessage;

         ws.onclose = () => {
            setIsConnected(false);
            wsRef.current = null;
         };

         ws.onerror = () => {
            ws.close();
         };
      };

      connect();
      reconnectInterval = setInterval(() => {
         if (!wsRef.current || wsRef.current.readyState === WebSocket.CLOSED) {
            connect();
         }
      }, WS_CONFIG.RECONNECT_INTERVAL);

      return () => {
         clearInterval(reconnectInterval);
         if (wsRef.current) wsRef.current.close();
      };
   }, [handleMessage]);

   return {
      isConnected,
      sendSyncOffset
   };
}
