// src/server.ts
import http from "http";
import { Server } from "socket.io";
import app from "./app";
import { registerChatHandlers } from "./sockets/chat.socket";

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // frontend URL
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  registerChatHandlers(io, socket); //  call the socket handler
});

const PORT = process.env.PORT ;
server.listen(PORT, () => {
  console.log(` Server running on port ${PORT}`);
});
