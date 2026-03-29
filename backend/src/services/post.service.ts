import prisma from "../config/prisma";
import { deleteFromCloudinary } from "../utils/deleteFromCloudinary";

export const createPost = async (
  userId: string,
  title: string,
  content?: string,
  published: boolean = true,
  imageUrl?: string,
  public_id?: string,
) => {
  return prisma.post.create({
    data: {
      title,
      content,
      published,
      imageUrl,
      public_id,
      authorId: userId,
    },
  });
};

export const getPostsByPage = async (page: number, limit: number) => {
  const offset = (page - 1) * limit;
  return prisma.post.findMany({
    skip: offset,
    take: limit,
    where: {
      published: true,
    },
    select: {
      id: true,
      title: true,
      content: true,
      imageUrl: true,
      createdAt: true,
      _count: {
        select: {
          likes: true, // Returns { likes: number }
        },
      },
    },
  });
};

export const getOwnPostsByPage = async (
  userId: string,
  page: number,
  limit: number,
) => {
  const offset = (page - 1) * limit;
  return prisma.post.findMany({
    skip: offset,
    take: limit,
    where: {
      authorId: userId,
    },
    select: {
      id: true,
      title: true,
      content: true,
      imageUrl: true,
      published: true,
      createdAt: true,
      _count: {
        select: {
          likes: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
};

export const getPostById = async (
  postId: string,
  userId?: string,
) => {
  const post = await prisma.post.findUnique({
    where: {
      id: postId,
    },
    select: {
      id: true,
      title: true,
      content: true,
      imageUrl: true,
      published: true,
      createdAt: true,
      authorId: true,
      _count: {
        select: {
          likes: true,
        },
      },
    },
  });

  if (!post) {
    return null;
  }

  // Check authorization for unpublished posts
  if (!post.published) {
    if (!userId || userId !== post.authorId) {
      return { unauthorized: true };
    }
  }

  // Remove authorId from response
  const { authorId, ...postData } = post;
  return postData;
};

export const updatePost = async (
  postId: string,
  userId: string,
  updateData: {
    title?: string;
    content?: string;
    published?: boolean;
    imageUrl?: string;
    public_id?: string;
  },
) => {
  // const { deleteFromCloudinary } = await import("../utils/deleteFromCloudinary");

  // First, check if post exists and belongs to user
  const post = await prisma.post.findUnique({
    where: {
      id: postId,
    },
    select: {
      id: true,
      authorId: true,
      public_id: true,
    },
  });

  if (!post) {
    return null;
  }

  // Check ownership
  if (post.authorId !== userId) {
    return { unauthorized: true };
  }

  // Delete old image if new image is provided
  if (updateData.imageUrl && post.public_id) {
    try {
      await deleteFromCloudinary(post.public_id);
    } catch (error) {
      console.error("Failed to delete old image from Cloudinary:", error);
      // Continue with update even if deletion fails
    }
  }

  // Update the post
  const updatedPost = await prisma.post.update({
    where: {
      id: postId,
    },
    data: updateData,
    select: {
      id: true,
      title: true,
      content: true,
      imageUrl: true,
      published: true,
      createdAt: true,
      updatedAt: true,
      authorId: true,
      public_id: true,
    },
  });

  return updatedPost;
};
