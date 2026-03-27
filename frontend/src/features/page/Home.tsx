// pages/Home.tsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPosts } from "../posts/postSlice";
import type { AppDispatch, RootState } from "../../app/store";
import PostGrid from "./../posts/components/PostGrid";

export default function Home() {
  const dispatch = useDispatch<AppDispatch>();
  const { posts, loading, error } = useSelector(
    (state: RootState) => state.posts,
  );

  useEffect(() => {
    dispatch(fetchPosts({ page: 1, limit: 10 }));
  }, [dispatch]);

  if (loading) return <p className="text-center mt-10">Loading...</p>;
  if (error)
    return <p className="text-center mt-10 text-red-500">Error: {error}</p>;

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <PostGrid posts={posts} />
    </div>
  );
}
