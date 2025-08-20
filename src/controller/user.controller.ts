import { Response } from "express";
import prisma from "../prismaclient";
import type { AuthRequest } from "../middleware/auth";

export const getAllUsers = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.userId) return res.status(401).json({ error: "Unauthorized" });

    // Get all users except the logged-in one
    const users = await prisma.user.findMany({
      where: { NOT: { id: req.userId } },
      select: { id: true, username: true, email: true }
    });

    return res.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    return res.status(500).json({ error: "Server error" });
  }
};
