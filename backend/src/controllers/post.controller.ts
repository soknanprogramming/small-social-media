import { Request, Response } from "express";
import { AuthRequest } from "../types/auth.types";
import { postSchema, updatePostSchema } from "../validations/post.validation";
import { uploadToCloudinary } from "../utils/uploadToCloudinary";
// import { deleteFromCloudinary } from "../utils/deleteFromCloudinary";
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
      const { authorId, ...postWithoutAuthorId } = post;
      return res.status(201).json(postWithoutAuthorId);
    } else {
      const post = await postService.createPost(
        req.userId!,
        title,
        content,
        published,
      );
      const { authorId, ...postWithoutAuthorId } = post;
      return res.status(201).json(postWithoutAuthorId);
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
  // Try to get userId from auth header or cookies if user is logged in
  const userId = (req as any).userId;
  
  try {
    const posts = await postService.getPostsByPage(page, limit, userId);
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

// Example: PUT /api/posts/:id - Update a post (requires auth and ownership)
// Request:
// - Body: { title?, content?, published? }
// - Optional file upload: photo
export const updatePost = async (req: AuthRequest, res: Response) => {
  const { id } = req.params as { id: string };
  
  // Validate request body with Zod
  const validation = updatePostSchema.safeParse(req.body);
  if (!validation.success) {
    return res.status(400).json({
      error: validation.error.issues.map((issue) => issue.message).join(", "),
    });
  }

  const { title, content, published } = validation.data;

  try {
    let imageUrl: string | undefined;
    let public_id: string | undefined;

    // Handle file upload if provided
    if (req.file) {
      const { buffer } = req.file;
      const folder = "posts";
      const uploadedImage = await uploadToCloudinary(buffer, folder);
      imageUrl = uploadedImage.url;
      public_id = uploadedImage.public_id;
    }

    // Check if post exists and belongs to user
    const result = await postService.updatePost(id, req.userId!, {
      title,
      content,
      published,
      imageUrl,
      public_id,
    });

    if (!result) {
      return res.status(404).json({ error: "Post not found" });
    }

    if ("unauthorized" in result && result.unauthorized) {
      return res.status(403).json({
        error: "You don't have permission to edit this post",
      });
    }

    if ("error" in result) {
      return res.status(500).json(result);
    }

    const { authorId, public_id: _ } = result as any;
    const postWithoutSensitive = Object.entries(result as any).reduce((acc, [key, value]) => {
      if (key !== 'authorId' && key !== 'public_id') {
        Object.assign(acc, { [key]: value });
      }
      return acc;
    }, {});
    return res.status(200).json(postWithoutSensitive);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Example: DELETE /api/posts/:id - Delete a post (requires auth and ownership)
export const deletePost = async (req: AuthRequest, res: Response) => {
  const { id } = req.params as { id: string };

  try {
    const result = await postService.deletePost(id, req.userId!);

    if (!result) {
      return res.status(404).json({ error: "Post not found" });
    }

    if ("unauthorized" in result && result.unauthorized) {
      return res.status(403).json({
        error: "You don't have permission to delete this post",
      });
    }

    return res.status(200).json(result);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Example: POST /api/posts/:id/like - Like a post (requires auth)
export const likePost = async (req: AuthRequest, res: Response) => {
  const { id } = req.params as { id: string };

  try {
    const result = await postService.likePost(id, req.userId!);

    if (!result) {
      return res.status(404).json({ error: "Post not found" });
    }

    if ("alreadyLiked" in result && result.alreadyLiked) {
      return res.status(400).json({ error: "You already liked this post" });
    }

    return res.status(200).json({ success: true, message: "Post liked successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Example: DELETE /api/posts/:id/like - Unlike a post (requires auth)
export const unlikePost = async (req: AuthRequest, res: Response) => {
  const { id } = req.params as { id: string };

  try {
    const result = await postService.unlikePost(id, req.userId!);

    if (!result) {
      return res.status(404).json({ error: "Post not found" });
    }

    if ("notLiked" in result && result.notLiked) {
      return res.status(400).json({ error: "You haven't liked this post" });
    }

    return res.status(200).json({ success: true, message: "Post unliked successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

