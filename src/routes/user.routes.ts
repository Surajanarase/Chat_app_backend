import { Router } from "express";
import { getAllUsers } from "../controller/user.controller";
import { auth } from "../middleware/auth"; 

const router = Router();

// Protected route to get all users
router.get("/", auth, getAllUsers);

export default router;
