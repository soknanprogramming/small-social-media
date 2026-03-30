import "dotenv/config"; // Loads environment variables from a .env file into process.env
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import userRoutes from "./routes/user.routes";
import postRoutes from "./routes/post.routes";

const app = express();

app.use(
  cors({
    origin: [
      "https://small-social.poch-soknan.workers.dev",
      "http://localhost:3000",
      "http://localhost:5173",
      process.env.FRONTEND_URL || "http://localhost:8000",
    ],
    credentials: true,
  }),
);
app.use(express.json()); // Parses incoming JSON payloads in the request body (populates req.body)
app.use(cookieParser()); // Parses incoming Cookie headers (populates req.cookies)

app.get("/", (req, res) => res.send("Hello World!"));
app.get("/health", (req, res) => res.json({ status: "ok" }));
app.use("/api/users", userRoutes);
app.use("/api/posts", postRoutes);

export default app;
