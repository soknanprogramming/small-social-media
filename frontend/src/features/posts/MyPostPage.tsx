import React, { useEffect, useState, useRef, useCallback } from 'react'
import { useAppDispatch, useAppSelector } from '../../app/hooks'
import { fetchOwnPosts, resetOwnPosts } from './postSlice'
import type { PostResponse } from './types/post'
import MyPostCard from './components/MyPostCard'

const POSTS_PER_PAGE = 10

// Spinner Icon Component
const SpinnerIcon = () => (
  <svg
    className="w-5 h-5 animate-spin"
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
)

const MyPostPage: React.FC = () => {
  const dispatch = useAppDispatch()
  const [currentPage, setCurrentPage] = useState(1)
  const [displayPosts, setDisplayPosts] = useState<PostResponse[]>([])
  const observerTarget = useRef<HTMLDivElement>(null)

  const { ownPosts, ownPostsLoading, ownPostsError, ownPostsHasMore } = useAppSelector(state => state.posts)

  // Sync displayPosts with Redux ownPosts
  useEffect(() => {
    setDisplayPosts(ownPosts)
  }, [ownPosts])

  // Initial load on mount
  useEffect(() => {
    dispatch(resetOwnPosts())
    dispatch(fetchOwnPosts({ page: 1, limit: POSTS_PER_PAGE }))
  }, [dispatch])

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !ownPostsLoading && ownPostsHasMore) {
          setCurrentPage(prev => prev + 1)
        }
      },
      { threshold: 0.1 }
    )

    if (observerTarget.current) {
      observer.observe(observerTarget.current)
    }

    return () => observer.disconnect()
  }, [ownPostsLoading, ownPostsHasMore])

  // Load more when page changes
  useEffect(() => {
    if (currentPage > 1) {
      dispatch(fetchOwnPosts({ page: currentPage, limit: POSTS_PER_PAGE }))
    }
  }, [currentPage, dispatch])

  const handlePostDeleted = useCallback((postId: string) => {
    setDisplayPosts(prev => prev.filter(post => post.id !== postId))
  }, [])

  return (
    <div className="flex-1 min-h-screen bg-gray-50 py-10 px-6">
      <div className="max-w-2xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-xl font-semibold text-gray-900">My Posts</h1>
          <p className="text-sm text-gray-500 mt-1">Manage and view all your posts</p>
        </div>

        {/* Error State */}
        {ownPostsError && (
          <div className="flex items-start gap-2 px-4 py-3 rounded-lg bg-red-50 border border-red-100 text-red-600 text-sm mb-6">
            <span>⚠️</span>
            <span>{ownPostsError}</span>
          </div>
        )}

        {/* Empty State */}
        {displayPosts.length === 0 && !ownPostsLoading && !ownPostsError && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-sm">You haven't created any posts yet.</p>
            <p className="text-gray-400 text-xs mt-2">Start creating posts to see them here!</p>
          </div>
        )}

        {/* Posts List */}
        {displayPosts.length > 0 && (
          <div className="flex flex-col gap-4">
            {displayPosts.map((post) => (
              <MyPostCard 
                key={post.id} 
                post={post}
                onPostDeleted={handlePostDeleted}
              />
            ))}
          </div>
        )}

        {/* Intersection Observer Target for Infinite Scroll */}
        <div ref={observerTarget} className="pt-8" />

        {/* Loading Indicator (shown while fetching more) */}
        {ownPostsLoading && displayPosts.length > 0 && (
          <div className="flex flex-col items-center justify-center py-8 gap-3">
            <SpinnerIcon />
            <p className="text-xs text-gray-400">Loading more posts...</p>
          </div>
        )}

        {/* Initial Loading State */}
        {ownPostsLoading && displayPosts.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <SpinnerIcon />
            <p className="text-sm text-gray-500">Loading your posts...</p>
          </div>
        )}

        {/* End of Posts Message */}
        {!ownPostsLoading && displayPosts.length > 0 && !ownPostsHasMore && (
          <div className="text-center py-8">
            <p className="text-xs text-gray-400">You've reached the end of your posts</p>
          </div>
        )}

      </div>
    </div>
  )
}

export default MyPostPage