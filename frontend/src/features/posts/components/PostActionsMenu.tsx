import React, { useState } from 'react'
import type { PostResponse } from '../types/post'
import { MenuIcon } from '../../../components/icons/MenuIcon'
import { EyeIcon } from '../../../components/icons/EyeIcon'
import { PencilIcon } from '../../../components/icons/PencilIcon'
import { TrashIcon } from '../../../components/icons/TrashIcon'
import EditPostModal from './EditPostModal'
import DeletePostConfirm from './DeletePostConfirm'
import PostDetailsModal from './PostDetailsModal'

interface PostActionsMenuProps {
  post: PostResponse;
  onPostUpdated?: (updatedPost: PostResponse) => void;
  onPostDeleted?: (postId: string) => void;
}

export default function PostActionsMenu({ post, onPostUpdated, onPostDeleted }: PostActionsMenuProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showDetailsModal, setShowDetailsModal] = useState(false)

  const handleView = () => {
    setIsMenuOpen(false)
    setShowDetailsModal(true)
  }

  const handleEdit = () => {
    setIsMenuOpen(false)
    setShowEditModal(true)
  }

  const handleDelete = () => {
    setIsMenuOpen(false)
    setShowDeleteConfirm(true)
  }

  return (
    <>
      {/* Menu Button */}
      <div className="relative">
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors duration-150"
          aria-label="Post actions"
        >
          <MenuIcon />
        </button>

        {/* Dropdown Menu */}
        {isMenuOpen && (
          <div className="absolute top-full right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-sm z-50 min-w-max">
            <button
              onClick={handleView}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors duration-150 rounded-t-lg"
            >
              <EyeIcon open={true} />
              View Details
            </button>
            <button
              onClick={handleEdit}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-600 hover:bg-gray-50 transition-colors duration-150"
            >
              <PencilIcon />
              Edit
            </button>
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors duration-150 rounded-b-lg"
            >
              <TrashIcon />
              Delete
            </button>
          </div>
        )}

        {/* Close menu when clicking outside */}
        {isMenuOpen && (
          <div
            className="fixed inset-0 z-40"
            onClick={() => setIsMenuOpen(false)}
          />
        )}
      </div>

      {/* Modals */}
      {showDetailsModal && (
        <PostDetailsModal
          post={post}
          onClose={() => setShowDetailsModal(false)}
        />
      )}

      {showEditModal && (
        <EditPostModal
          post={post}
          onClose={() => setShowEditModal(false)}
          onPostUpdated={(updatedPost) => {
            if (onPostUpdated) onPostUpdated(updatedPost)
            setShowEditModal(false)
          }}
        />
      )}

      {showDeleteConfirm && (
        <DeletePostConfirm
          postId={post.id}
          onClose={() => setShowDeleteConfirm(false)}
          onPostDeleted={() => {
            if (onPostDeleted) onPostDeleted(post.id)
            setShowDeleteConfirm(false)
          }}
        />
      )}
    </>
  )
}
