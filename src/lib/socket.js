import { io } from "socket.io-client";

// ✅ Read from .env file
const SOCKET_URL = process.env.SOCKET_URL;
console.log(SOCKET_URL);

export const socket = io(SOCKET_URL, {
  autoConnect: false,          // connect manually
  transports: ["websocket"],   // better stability
  reconnection: true,          // 🔁 auto reconnect
  reconnectionAttempts: 5,
  reconnectionDelay: 1000,
});
