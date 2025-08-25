// src/sockets/chat.socket.ts
import { Server, Socket } from "socket.io";
import prisma from "../database/prismaclient";

export function registerChatHandlers(io: Server, socket: Socket) {
  console.log("A user connected:", socket.id);

  socket.on("join", (userId: string) => {
    socket.join(userId);
    console.log(`User ${userId} joined room`);
  });

  socket.on("sendMessage", async (messageData) => {
    const { senderId, receiverId, text } = messageData;

    try {
      const newMessage = await prisma.message.create({
        data: {
          senderId,
          receiverId,
          text
        },
        include: {
          sender: { select: { id: true, username: true, email: true } },
          receiver: { select: { id: true, username: true, email: true } }
        }
      });

      // Emit to both sender and receiver
      io.to(receiverId.toString()).emit("receiveMessage", newMessage);
      io.to(senderId.toString()).emit("receiveMessage", newMessage);

    } catch (err) {
      console.error("Message save error:", err);
    }
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
}
