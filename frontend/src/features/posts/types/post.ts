export interface PostResponse {
  id: string;
  title: string;
  content: string | null;
  imageUrl: string | null;
  isLiked?: boolean;
  createdAt: string;
  _count: {
    likes: number;
  };
}