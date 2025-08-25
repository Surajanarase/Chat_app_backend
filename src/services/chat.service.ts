// src/services/chat.service.ts
import prisma from "../database/prismaclient";

export const getMessagesService = async (userId: number, receiverId: number) => {
  return prisma.message.findMany({
    where: {
      OR: [
        { senderId: userId, receiverId },
        { senderId: receiverId, receiverId: userId }
      ]
    },
    orderBy: { createdAt: "asc" },
    include: {
      sender: { select: { id: true, username: true } },
      receiver: { select: { id: true, username: true } }
    }
  });
};

export const postMessageService = async (senderId: number, receiverId: number, text: string) => {
  return prisma.message.create({
    data: { text, senderId, receiverId },
    include: {
      sender: { select: { id: true, username: true } },
      receiver: { select: { id: true, username: true } }
    }
  });
};
