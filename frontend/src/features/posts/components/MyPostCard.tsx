import type { PostResponse } from "../types/post";

interface MyPostCardProps {
  post: PostResponse;
}

export default function MyPostCard({ post }: MyPostCardProps) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
      {/* Title */}
      <div className="px-6 pt-5 pb-3">
        <h2 className="text-xl font-semibold text-gray-900 line-clamp-1">
          {post.title}
        </h2>
      </div>

      {/* Image */}
      {post.imageUrl ? (
        <img
          src={post.imageUrl}
          alt={post.title}
          className="w-full h-80 object-cover"
        />
      ) : (
        <div className="w-full h-80 bg-gray-50 flex items-center justify-center">
          <span className="text-gray-300 text-sm tracking-wide uppercase">
            No image
          </span>
        </div>
      )}

      {/* Description */}
      <div className="px-6 pt-4 pb-3 min-w-0">
        <p className="text-gray-400 text-sm line-clamp-2 leading-relaxed">
          {post.content ?? "No content available."}
        </p>
      </div>

      {/* Status + Date */}
      <div className="px-6 pb-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className={`
            text-xs font-semibold px-3 py-1 rounded-full
            ${post.published 
              ? 'bg-green-50 text-green-700' 
              : 'bg-yellow-50 text-yellow-700'
            }
          `}>
            {post.published ? 'Published' : 'Draft'}
          </span>
        </div>

        <span className="text-xs text-gray-300">
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
