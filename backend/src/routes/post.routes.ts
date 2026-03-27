import { Router } from "express";
import { authMiddleware } from "../middlewares/auth.middleware";
import { uploadSingle } from "../middlewares/upload.middleware";
import { createPost } from "../controllers/post.controller";

const router = Router();

// /api/posts/
router.post("/", authMiddleware, uploadSingle, createPost);

export default router;