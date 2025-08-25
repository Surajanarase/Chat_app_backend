import { Response } from "express";
import type { AuthRequest } from "../middleware/auth";
import { getMessagesService, postMessageService } from "../services/chat.service";

export const getMessages = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.userId || !req.query.receiverId) {
      return res.status(400).json({ error: "Missing userId or receiverId" });
    }
    const messages = await getMessagesService(req.userId, Number(req.query.receiverId));
    res.json(messages);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch messages" });
  }
};

export const postMessage = async (req: AuthRequest, res: Response) => {
  try {
    const { text, receiverId } = req.body;
    if (!req.userId) return res.status(401).json({ error: "Unauthorized" });
    if (!text || !receiverId) return res.status(400).json({ error: "Text and receiverId required" });

    const newMessage = await postMessageService(req.userId, receiverId, text);
    res.status(201).json(newMessage);
  } catch (err) {
    res.status(500).json({ error: "Failed to save message" });
  }
};
