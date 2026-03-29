import { useState } from "react";
import type { PostResponse } from "../types/post";
import ThumbsUpIcon from "../../../components/icons/ThumbsUpIcon";

interface PostCardProps {
  post: PostResponse;
}

export default function PostCard({ post }: PostCardProps) {
  const [liked, setLiked] = useState(post.isLiked);
  const [likeCount, setLikeCount] = useState(post._count.likes);
  const [loading, setLoading] = useState(false);

  async function handleLike() {
    if (loading) return;

    // Optimistic update
    setLiked((prev) => !prev);
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1));

    setLoading(true);
    try {
      // TODO: replace with your actual API call
      // await api.post(`/posts/${post.id}/like`)   <- if not liked
      // await api.delete(`/posts/${post.id}/like`) <- if already liked
      await new Promise((res) => setTimeout(res, 500)); // placeholder
    } catch {
      // Revert on failure
      setLiked((prev) => !prev);
      setLikeCount((prev) => (liked ? prev + 1 : prev - 1));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
      {/* Author Info */}
      <div className="px-6 pt-4 pb-3 flex items-center gap-3">
        {post.author.avatarUrl ? (
          <img
            src={post.author.avatarUrl}
            alt={post.author.name || "Author"}
            className="w-10 h-10 rounded-full object-cover"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center text-white font-semibold text-sm">
            {(post.author.name?.[0] || "?").toUpperCase()}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-900 truncate">
            {post.author.name || "Anonymous"}
          </p>
          <p className="text-xs text-gray-400">
            {new Date(post.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })}
          </p>
        </div>
      </div>

      {/* Title */}
      <div className="px-6 pb-3">
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

      {/* Like Count */}
      <div className="px-6 pb-5 flex items-center gap-2">
        <button
          onClick={handleLike}
          disabled={loading}
          className={`
          p-2 rounded-full transition-all duration-200
          ${
            liked
              ? "text-blue-500 bg-blue-50 hover:bg-blue-100"
              : "text-gray-300 hover:text-blue-400 hover:bg-blue-50"
          }
          disabled:opacity-50 disabled:cursor-not-allowed
        `}
          aria-label={liked ? "Unlike" : "Like"}
        >
          <ThumbsUpIcon className="w-5 h-5" filled={liked} />
        </button>
        <span className="text-xs text-gray-400 tabular-nums">
          {likeCount} {likeCount === 1 ? "like" : "likes"}
        </span>
      </div>
    </div>
  );
}
