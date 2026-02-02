// WebSocket server

const WebSocket = require("ws");

const PORT = 9876;

// Current state
let currentData = {
   type: "lyrics",
   current: "Waiting for lyrics...",
   next: ""
};

// Connected clients
const clients = new Set();

// Create WebSocket server
const server = new WebSocket.Server({ port: PORT });

// Broadcasts data to all connected clients except the sender
function broadcast(data, sender = null) {
   const message = JSON.stringify(data);
   clients.forEach(client => {
      if (client !== sender && client.readyState === WebSocket.OPEN) {
         client.send(message);
      }
   });
}

// Handles incoming messages from clients
function handleMessage(ws, message) {
   try {
      const data = JSON.parse(message.toString());

      switch (data.type) {
         case "lyrics":
         case "songInfo":
         case "noLyrics":
            // Store current state and broadcast to other clients
            currentData = data;
            broadcast(data, ws);
            break;

         case "syncOffset":
            // Forward sync offset to extension
            broadcast(data, ws);
            break;

         default:
            // Unknown message type, forward anyway
            broadcast(data, ws);
      }
   } catch (e) {
      console.error("Error processing message:", e.message);
   }
}

// Connection handler
server.on("connection", (ws, req) => {
   const clientIP = req.socket.remoteAddress;
   console.log(`Client connected: ${clientIP}`);

   clients.add(ws);

   // Send current state to new client
   ws.send(JSON.stringify(currentData));

   // Message handler
   ws.on("message", (message) => {
      handleMessage(ws, message);
   });

   // Disconnect handler
   ws.on("close", () => {
      console.log(`Client disconnected: ${clientIP}`);
      clients.delete(ws);
   });

   // Error handler
   ws.on("error", (err) => {
      console.error(`Client error (${clientIP}):`, err.message);
      clients.delete(ws);
   });
});

// Server startup
server.on("listening", () => {
   console.log(`Lyrics Overlay Server running on port ${PORT}`);
   console.log("Waiting for connections...");
});

// Graceful shutdown
process.on("SIGINT", () => {
   console.log("\nShutting down server...");
   server.close(() => {
      process.exit(0);
   });
});

process.on("SIGTERM", () => {
   server.close(() => {
      process.exit(0);
   });
});
