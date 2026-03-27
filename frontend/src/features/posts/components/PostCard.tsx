// features/posts/components/PostCard.tsx
import type { PostResponse } from "../types/post";

interface PostCardProps {
  post: PostResponse;
}

export default function PostCard({ post }: PostCardProps) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
      {post.imageUrl ? (
        <img
          src={post.imageUrl}
          alt={post.title}
          className="w-full h-80 object-cover"
        />
      ) : (
        <div className="w-full h-80 bg-gray-50 flex items-center justify-center">
          <span className="text-gray-300 text-sm tracking-wide uppercase">No image</span>
        </div>
      )}

      <div className="px-6 py-5 flex items-end justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-1">
            {post.title}
          </h2>
          <p className="text-gray-400 text-sm line-clamp-2 leading-relaxed">
            {post.content ?? "No content available."}
          </p>
        </div>
        <span className="text-xs text-gray-300 whitespace-nowrap">
          {new Date(post.createdAt).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </span>
      </div>
    </div>
  );
}