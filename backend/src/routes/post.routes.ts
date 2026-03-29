import { Router } from "express";
import { authMiddleware, optionalAuthMiddleware } from "../middlewares/auth.middleware";
import { uploadSingle } from "../middlewares/upload.middleware";
import * as postController from "../controllers/post.controller";

const router = Router();

// /api/posts/
// GET /api/posts/?page=1&limit=10
router.get("/", postController.getPostsByPage);
router.get("/:id", optionalAuthMiddleware, postController.getPostById);
// GET /api/posts/own?page=1&limit=10 - Get user's own posts with pagination
router.get("/own", authMiddleware, postController.getOwnPostsByPage);
router.post("/", authMiddleware, uploadSingle("photo"), postController.createPost);


export default router;