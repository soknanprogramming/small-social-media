// pages/Home.tsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts } from "../posts/postSlice";
import type { AppDispatch, RootState } from "../../app/store";
import PostGrid from "./../posts/components/PostGrid";

const SpinnerIcon = () => (
  <svg
    className="w-5 h-5 animate-spin text-gray-900"
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
  >
    <circle
      className="opacity-25"
      cx="12"
      cy="12"
      r="10"
      stroke="currentColor"
      strokeWidth="4"
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8v8H4z"
    />
  </svg>
);

const WarningIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    strokeWidth={1.8}
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
    />
  </svg>
);

export default function Home() {
  const dispatch = useDispatch<AppDispatch>();
  const { posts, loading, error } = useSelector(
    (state: RootState) => state.posts,
  );

  useEffect(() => {
    dispatch(fetchPosts({ page: 1, limit: 10 }));
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex-1 min-h-screen bg-gray-50 py-10 px-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex flex-col items-center justify-center py-20">
            <SpinnerIcon />
            <p className="text-sm text-gray-600 mt-4">Loading posts...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 min-h-screen bg-gray-50 py-10 px-6">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-start gap-2 px-4 py-3 rounded-lg bg-red-50 border border-red-100 text-red-600 text-sm">
            <WarningIcon className="w-5 h-5 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 min-h-screen bg-gray-50 py-10 px-6">
      <div className="max-w-2xl mx-auto">
        <PostGrid posts={posts} />
      </div>
    </div>
  );
}
