import prisma from "../config/prisma";

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
