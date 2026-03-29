import { useState } from 'react'
import type { PostResponse } from '../types/post'
import EditPostModal from './EditPostModal'
import DeletePostConfirm from './DeletePostConfirm'
import PostDetailsModal from './PostDetailsModal'

interface MyPostCardProps {
  post: PostResponse;
  onPostUpdated?: (updatedPost: PostResponse) => void;
  onPostDeleted?: (postId: string) => void;
}

const EyeIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
  </svg>
)

const PencilIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 9.75a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0Z" />
  </svg>
)

const TrashIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 2.991a1.5 1.5 0 0 0-1.34-1.822H7.18a1.5 1.5 0 0 0-1.338 1.822l2.192 12.334m13.074-2.294c.322.048.645.096.967.15M20.522 5.003c-1.635-.069-3.26-.123-4.884-.13V2.25A1.5 1.5 0 0 0 13.5.75h-3a1.5 1.5 0 0 0-1.5 1.5v2.623c-1.624.007-3.249.061-4.884.13" />
  </svg>
)

export default function MyPostCard({ post, onPostUpdated, onPostDeleted }: MyPostCardProps) {
  const [currentPost, setCurrentPost] = useState(post)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showDetailsModal, setShowDetailsModal] = useState(false)

  const handlePostUpdated = (updatedPost: PostResponse) => {
    setCurrentPost(updatedPost)
    if (onPostUpdated) onPostUpdated(updatedPost)
    setShowEditModal(false)
  }

  const handlePostDeleted = (postId: string) => {
    if (onPostDeleted) onPostDeleted(postId)
    setShowDeleteConfirm(false)
  }

  return (
    <>
      <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow duration-300">
        <div className="flex items-stretch">
          {/* Image Section */}
          <div className="flex-shrink-0">
            {currentPost.imageUrl ? (
              <img
                src={currentPost.imageUrl}
                alt={currentPost.title}
                className="w-32 h-32 object-cover"
              />
            ) : (
              <div className="w-32 h-32 bg-gray-50 flex items-center justify-center">
                <span className="text-gray-300 text-xs tracking-wide uppercase">
                  No image
                </span>
              </div>
            )}
          </div>

          {/* Content Section */}
          <div className="flex-1 flex flex-col justify-between px-6 py-4 min-w-0">
            {/* Title */}
            <h2 className="text-lg font-semibold text-gray-900 line-clamp-2 mb-2">
              {currentPost.title}
            </h2>

            {/* Description */}
            <p className="text-gray-500 text-sm line-clamp-2 leading-relaxed mb-3">
              {currentPost.content ?? 'No content available.'}
            </p>

            {/* Footer with Status and Actions */}
            <div className="flex items-center justify-between">
              <span className={`
                text-xs font-semibold px-2.5 py-1 rounded-full
                ${('published' in currentPost) && (currentPost as any).published
                  ? 'bg-green-50 text-green-700' 
                  : 'bg-yellow-50 text-yellow-700'
                }
              `}>
                {('published' in currentPost) && (currentPost as any).published ? 'Published' : 'Draft'}
              </span>

              <span className="text-xs text-gray-400">
                {new Date(currentPost.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 px-6 py-3 border-t border-gray-100 bg-gray-50">
          <button
            onClick={() => setShowDetailsModal(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-100 transition-colors duration-150"
          >
            <EyeIcon />
            View
          </button>
          <button
            onClick={() => setShowEditModal(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-gray-600 hover:bg-gray-100 transition-colors duration-150"
          >
            <PencilIcon />
            Edit
          </button>
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium text-red-500 hover:bg-red-50 transition-colors duration-150 ml-auto"
          >
            <TrashIcon />
            Delete
          </button>
        </div>
      </div>

      {/* Modals */}
      {showDetailsModal && (
        <PostDetailsModal
          post={currentPost}
          onClose={() => setShowDetailsModal(false)}
        />
      )}

      {showEditModal && (
        <EditPostModal
          post={currentPost}
          onClose={() => setShowEditModal(false)}
          onPostUpdated={handlePostUpdated}
        />
      )}

      {showDeleteConfirm && (
        <DeletePostConfirm
          postId={currentPost.id}
          onClose={() => setShowDeleteConfirm(false)}
          onPostDeleted={() => {
            handlePostDeleted(currentPost.id)
          }}
        />
      )}
    </>
  )
}
