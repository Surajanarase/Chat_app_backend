import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import authRoutes from "./routes/auth.routes";
import chatRoutes from "./routes/chat.routes";

dotenv.config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);

// Server
const PORT = process.env.PORT;//env
app.listen(PORT, () => {
  console.log(` Server is running on http://localhost:${PORT}`);
});
