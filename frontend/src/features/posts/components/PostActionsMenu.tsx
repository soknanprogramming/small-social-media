import React, { useState } from 'react'
import type { PostResponse } from '../types/post'
import EditPostModal from './EditPostModal'
import DeletePostConfirm from './DeletePostConfirm'
import PostDetailsModal from './PostDetailsModal'

interface PostActionsMenuProps {
  post: PostResponse;
  onPostUpdated?: (updatedPost: PostResponse) => void;
  onPostDeleted?: (postId: string) => void;
}

// Menu Icon
const MenuIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
  </svg>
)

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
              <EyeIcon />
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
