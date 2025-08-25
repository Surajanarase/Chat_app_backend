import { Request, Response } from "express";
import { registerUserService, loginUserService, meService } from "../services/auth.service";
import type { AuthRequest } from "../middleware/auth";

export const registerUser = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body;
    const { newUser, token } = await registerUserService(username, email, password);
    res.status(201).json({ message: "User registered", token });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await loginUserService(email, password);
    res.json({ message: "Login successful", token, user: { id: user.id, username: user.username, email: user.email } });
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
};

export const me = async (req: AuthRequest, res: Response) => {
  try {
    const user = await meService(req.userId!);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch {
    res.status(500).json({ error: "Server error" });
  }
};
