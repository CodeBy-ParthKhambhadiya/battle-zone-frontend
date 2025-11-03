import { io } from "socket.io-client";

const SOCKET_URL = "https://battle-zone-backend.onrender.com";

export const socket = io(SOCKET_URL, {
  autoConnect: false, // connect manually
  transports: ["websocket"], // better stability
  reconnection: true, // 🔁 auto reconnect
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});
