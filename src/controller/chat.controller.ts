import { Response } from "express";
import type { AuthRequest } from "../middleware/auth";
import prisma from "../prismaclient";

// GET all messages between the logged-in user and another user
export const getMessages = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.userId;
    const { receiverId } = req.query; // pass ?receiverId=2

    if (!userId || !receiverId) {
      return res.status(400).json({ error: "Missing userId or receiverId" });
    }

    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId, receiverId: Number(receiverId) },
          { senderId: Number(receiverId), receiverId: userId }
        ]
      },
      orderBy: { createdAt: "asc" },
      include: {
        sender: { select: { id: true, username: true } },   // include sender details
        receiver: { select: { id: true, username: true } }  // include receiver details
      }
    });

    res.json(messages);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
};

// POST a new message 
export const postMessage = async (req: AuthRequest, res: Response) => {
  try {
    const { text, receiverId } = req.body;
    const senderId = req.userId;

    if (!senderId) return res.status(401).json({ error: "Unauthorized" });
    if (!text || !receiverId) return res.status(400).json({ error: "Text and receiverId required" });

    const newMessage = await prisma.message.create({
      data: { text, senderId, receiverId },
      include: {
        sender: { select: { id: true, username: true } },
        receiver: { select: { id: true, username: true } }
      }
    });

    res.status(201).json(newMessage);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save message" });
  }
};
