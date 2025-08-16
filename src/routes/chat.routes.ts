import { Router } from "express";
import { getMessages, postMessage } from "../controller/chat.controller";
import { auth } from "../middleware/auth";

const router = Router();

// Protected routes → must be logged in
router.get("/", auth, getMessages);
router.post("/", auth, postMessage);

export default router;
