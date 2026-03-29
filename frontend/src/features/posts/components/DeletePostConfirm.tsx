import React, { useState } from 'react'
import api from '../../../libs/axios'
import Modal from './Modal'
import { TrashIcon } from '../../../components/icons/TrashIcon'

interface DeletePostConfirmProps {
  postId: string;
  onClose: () => void;
  onPostDeleted: () => void;
}

const SpinnerIcon = () => (
  <svg className="w-4 h-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
  </svg>
)

export default function DeletePostConfirm({ postId, onClose, onPostDeleted }: DeletePostConfirmProps) {
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleDelete = async () => {
    console.log('Delete clicked for post ID:', postId)
    setIsDeleting(true)
    setError(null)

    try {
      console.log('Attempting to delete post:', `/api/posts/${postId}`)
      const response = await api.delete(`/api/posts/${postId}`)
      console.log('Delete successful:', response.data)
      onPostDeleted()
      onClose()
    } catch (err: any) {
      console.error('Delete error:', err)
      const data = err?.response?.data
      const errorMsg = data?.error ?? data?.message ?? 'Failed to delete post. Please try again.'
      console.error('Error message:', errorMsg)
      setError(errorMsg)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Modal onClose={onClose} maxWidth="max-w-sm">
      {/* Icon */}
      <div className="flex justify-center pt-6">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-red-50 text-red-600">
          <TrashIcon />
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-5 text-center">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Post</h3>
        <p className="text-sm text-gray-600">
          Are you sure you want to delete this post? This action cannot be undone.
        </p>

        {error && (
          <div className="mt-4 flex items-start gap-2 px-3 py-2 rounded-lg bg-red-50 border border-red-100 text-red-600 text-xs">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex items-center justify-end gap-3 rounded-b-xl">
        <button
          onClick={onClose}
          disabled={isDeleting}
          className="px-4 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-150"
        >
          Cancel
        </button>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-medium bg-red-500 text-white hover:bg-red-600 disabled:opacity-60 disabled:cursor-not-allowed transition-colors duration-150"
        >
          {isDeleting && <SpinnerIcon />}
          {isDeleting ? 'Deleting…' : 'Delete'}
        </button>
      </div>
    </Modal>
  )
}
