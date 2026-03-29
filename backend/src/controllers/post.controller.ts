import { Request, Response } from "express";
import { AuthRequest } from "../types/auth.types";
import { postSchema } from "../validations/post.validation";
import { uploadToCloudinary } from "../utils/uploadToCloudinary";
import * as postService from "../services/post.service";

export const createPost = async (req: AuthRequest, res: Response) => {
  const require = postSchema.safeParse(req.body);
  // multipart/form-data: photo
  if (!require.success) {
    // console.error(require.error.issues);
    return res.status(400).json({
      error: require.error.issues.map((issue) => issue.message).join(", "),
    });
  }
  
  // if (!req.userId) {
  //   return res.status(401).json({ error: "Unauthorized" });
  // }

  const { title, content, published } = require.data;



  // console.log("Received post data:", { title, content, published });

  try {
    if (req.file) {
      const { buffer } = req.file;
      const folder = "posts"; // You can change this to any folder you want in Cloudinary
      const { url, public_id } = await uploadToCloudinary(buffer, folder);
      const post = await postService.createPost(
        req.userId!, // ! is used to assert that userId is not undefined,
        title,
        content,
        published,
        url,
        public_id,
      );
      const { authorId, public_id: _, ...postWithoutAuthor } = post;
      return res.status(201).json(postWithoutAuthor);
    } else {
      const post = await postService.createPost(
        req.userId!,
        title,
        content,
        published,
      );
      const { authorId, ...postWithoutAuthor } = post;
      return res.status(201).json(postWithoutAuthor);
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Example: GET /api/posts?page=1&limit=10
export const getPostsByPage = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  try {
    const posts = await postService.getPostsByPage(page, limit);
    return res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Example: GET /api/posts/own?page=1&limit=10
export const getOwnPostsByPage = async (req: AuthRequest, res: Response) => {
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;

  try {
    const posts = await postService.getOwnPostsByPage(
      req.userId!,
      page,
      limit,
    );
    return res.status(200).json(posts);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Example: GET /api/posts/:id - Get a single post with authorization check
export const getPostById = async (req: AuthRequest, res: Response) => {
  const { id } = req.params as { id: string };
  
  try {
    const post = await postService.getPostById(id, req.userId);
    
    if (!post) {
      return res.status(404).json({ error: "Post not found" });
    }

    if ("unauthorized" in post && post.unauthorized) {
      return res.status(403).json({ 
        error: "You don't have permission to view this post" 
      });
    }

    return res.status(200).json(post);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

