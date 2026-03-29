import { Router } from "express";
import { authMiddleware, optionalAuthMiddleware } from "../middlewares/auth.middleware";
import { uploadSingle } from "../middlewares/upload.middleware";
import * as postController from "../controllers/post.controller";

const router = Router();

// GET /api/posts/?page=1&limit=10 - Optional auth to track user likes
router.get("/", optionalAuthMiddleware, postController.getPostsByPage);
// GET /api/posts/own?page=1&limit=10 - Get user's own posts with pagination
router.get("/own", authMiddleware, postController.getOwnPostsByPage);
// GET /api/posts/:id - Get a single post with optional auth (to check if user can view unpublished post)
router.get("/:id", optionalAuthMiddleware, postController.getPostById);
// POST /api/posts/ - Create a new post (requires auth and optional image upload)
router.post("/", authMiddleware, uploadSingle("photo"), postController.createPost);
// PUT /api/posts/:id - Update a post (requires auth and ownership, supports image upload)
router.put("/:id", authMiddleware, uploadSingle("photo"), postController.updatePost);
// DELETE /api/posts/:id - Delete a post (requires auth and ownership, only post owner can delete)
router.delete("/:id", authMiddleware, postController.deletePost);
// POST /api/posts/:id/like - Like a post (requires auth)
router.post("/:id/like", authMiddleware, postController.likePost);
// DELETE /api/posts/:id/like - Unlike a post (requires auth)
router.delete("/:id/like", authMiddleware, postController.unlikePost);

export default router;