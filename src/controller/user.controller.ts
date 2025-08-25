import { Response } from "express";
import type { AuthRequest } from "../middleware/auth";
import { getAllUsersService } from "../services/user.service";

export const getAllUsers = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.userId) return res.status(401).json({ error: "Unauthorized" });
    const users = await getAllUsersService(req.userId);
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
};
