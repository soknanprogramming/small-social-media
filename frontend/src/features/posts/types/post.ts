export interface Author {
  id: string;
  name: string | null;
  avatarUrl: string | null;
}

export interface PostResponse {
  id: string;
  title: string;
  content: string | null;
  imageUrl: string | null;
  isLiked?: boolean;
  createdAt: string;
  author: Author;
  _count: {
    likes: number;
  };
}