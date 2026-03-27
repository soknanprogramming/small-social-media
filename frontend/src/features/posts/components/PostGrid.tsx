// features/posts/components/PostGrid.tsx
import type { PostResponse } from "../types/post";
import PostCard from "./PostCard";

interface PostGridProps {
  posts: PostResponse[];
}

// features/posts/components/PostGrid.tsx
export default function PostGrid({ posts }: PostGridProps) {
  return (
    <div className="flex flex-col gap-4">
      {posts.map((post) => (
        <PostCard key={post.id} post={post} />
      ))}
    </div>
  );
}