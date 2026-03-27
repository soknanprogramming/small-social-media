import { Request, Response } from "express";
import { AuthRequest } from "../types/auth.types";
import { postSchema } from "../validations/post.validation";
import { uploadToCloudinary } from "../utils/uploadToCloudinary";
import * as postService from "../services/post.service";

export const createPost = async (req: AuthRequest, res: Response) => {
  const require = postSchema.safeParse(req.body);
  // multipart/form-data: photo
  if (!require.success) {
    console.error(require.error.issues);
    return res.status(400).json({
      error: require.error.issues.map((issue) => issue.message).join(", "),
    });
  }

  const { title, content, published } = require.data;

//   console.log("Received post data:", { title, content, published });

  try {
    if (req.file) {
      const { buffer } = req.file;
      const folder = "posts"; // You can change this to any folder you want in Cloudinary
      const { url, public_id } = await uploadToCloudinary(buffer, folder);
        const post = await postService.createPost(
          req.userId!,
          title,
          content,
          published,
          url,
          public_id
        );
        const { authorId, public_id: _, ...postWithoutAuthor } = post;
        return res.status(201).json(postWithoutAuthor);
    }

    const post = await postService.createPost(
      req.userId!,
      title,
      content,
      published
    );
    const { authorId, ...postWithoutAuthor } = post;
    return res.status(201).json(postWithoutAuthor);

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }

};
