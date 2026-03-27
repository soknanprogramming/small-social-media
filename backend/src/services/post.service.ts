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
    },
  });
};
