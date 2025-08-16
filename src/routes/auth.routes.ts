import { Router } from "express";
import { registerUser, loginUser, me } from "../controller/auth.controller";
import { auth } from "../middleware/auth";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);

//  protected
router.get("/me", auth, me);

export default router;
