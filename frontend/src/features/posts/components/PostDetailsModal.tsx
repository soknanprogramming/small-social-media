import React from 'react'
import type { PostResponse } from '../types/post'
import Modal from './Modal'

interface PostDetailsModalProps {
  post: PostResponse;
  onClose: () => void;
}

const XIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
  </svg>
)

export default function PostDetailsModal({ post, onClose }: PostDetailsModalProps) {
  return (
    <Modal onClose={onClose} hideScrollbar>
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 sticky top-0 bg-white">
        <h2 className="text-lg font-semibold text-gray-900">Post Details</h2>
        <button
          onClick={onClose}
          className="p-1 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors duration-150"
        >
          <XIcon />
        </button>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col gap-6">
        {/* Image */}
        {post.imageUrl && (
          <div>
            <img
              src={post.imageUrl}
              alt={post.title}
              className="w-full h-96 object-cover rounded-lg"
            />
          </div>
        )}

        {/* Title */}
        <div>
          <h3 className="text-2xl font-semibold text-gray-900">{post.title}</h3>
        </div>

        {/* Meta */}
        <div className="flex items-center gap-3 text-xs text-gray-500">
          <span>Published at {new Date(post.createdAt).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
          })}</span>
          <span>•</span>
          <span>{post._count.likes} likes</span>
        </div>

        {/* Content */}
        {post.content && (
          <div>
            <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-wrap">
              {post.content}
            </p>
          </div>
        )}

        {/* Status Badge */}
        {('published' in post) && (
          <div className="flex items-center gap-2">
            <span className={`
              text-xs font-semibold px-3 py-1 rounded-full
              ${(post as any).published 
                ? 'bg-green-50 text-green-700' 
                : 'bg-yellow-50 text-yellow-700'
              }
            `}>
              {(post as any).published ? 'Published' : 'Draft'}
            </span>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="px-6 py-4 border-t border-gray-100 bg-gray-50 flex items-center justify-end">
        <button
          onClick={onClose}
          className="px-4 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-100 transition-colors duration-150"
        >
          Close
        </button>
      </div>
    </Modal>
  )
}
