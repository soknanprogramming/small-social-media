import { useState } from 'react'
import type { PostResponse } from '../types/post'
import { EyeIcon } from '../../../components/icons/EyeIcon'
import { PencilIcon } from '../../../components/icons/PencilIcon'
import { TrashIcon } from '../../../components/icons/TrashIcon'
import EditPostModal from './EditPostModal'
import DeletePostConfirm from './DeletePostConfirm'
import PostDetailsModal from './PostDetailsModal'

interface MyPostCardProps {
  post: PostResponse;
  onPostUpdated?: (updatedPost: PostResponse) => void;
  onPostDeleted?: (postId: string) => void;
}

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
            <EyeIcon open={true} />
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
