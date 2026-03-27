import prisma from "../config/prisma";

export const createPost = async (userId: string, title: string, content?: string, published: boolean = true, imageUrl?: string, public_id?: string) => {
    return prisma.post.create({
        data: {
            title,
            content,
            published,
            imageUrl,
            public_id,
            authorId: userId,
        }
    })
}