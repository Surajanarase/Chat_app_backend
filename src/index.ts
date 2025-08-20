import express from 'express';
import http from 'http';
import cors from 'cors';
import { Server } from 'socket.io';
import prisma from './prismaclient';   // import prisma

import authRoutes from './routes/auth.routes';
import chatRoutes from './routes/chat.routes';
import userRoutes from "./routes/user.routes";

const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173", // frontend (SvelteKit) URL
    methods: ["GET", "POST"]
  }
});

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/chat', chatRoutes);
app.use("/api/users", userRoutes);

// Socket.IO connection
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Join user-specific room
  socket.on("join", (userId: string) => {
    socket.join(userId);
    console.log(`User ${userId} joined their room`);
  });

  // Handle sending messages
  socket.on("sendMessage", async (messageData) => {
    const { senderId, receiverId, text } = messageData;

    try {
      // Save to DB
      const newMessage = await prisma.message.create({
        data: {
          senderId,
          receiverId,
          text
        }
      });

      // Emit to receiver
      io.to(receiverId.toString()).emit("receiveMessage", newMessage);

      // Also emit back to sender (so both see consistent data)
      io.to(senderId.toString()).emit("receiveMessage", newMessage);

    } catch (err) {
      console.error("Message save error:", err);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

// Run server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
