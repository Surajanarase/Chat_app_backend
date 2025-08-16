import { Response } from "express";
import type { AuthRequest } from "../middleware/auth";

// Dummy in-memory messages (later we replace with DB)
let messages: { id: number; userId: number; text: string }[] = [];
let idCounter = 1;

// GET all messages
export const getMessages = (req: AuthRequest, res: Response) => {
  return res.json(messages);
};

// POST a new message
export const postMessage = (req: AuthRequest, res: Response) => {
  const { text } = req.body;
  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized: userId missing" });
  }

  if (!text) {
    return res.status(400).json({ error: "Message text is required" });
  }

  const newMessage = { id: idCounter++, userId, text };
  messages.push(newMessage);

  return res.status(201).json(newMessage);
};
