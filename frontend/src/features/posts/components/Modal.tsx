import React from 'react'

interface ModalProps {
  onClose: () => void;
  children: React.ReactNode;
  maxWidth?: string;
  maxHeight?: string;
  hideScrollbar?: boolean;
}

export default function Modal({ 
  onClose, 
  children, 
  maxWidth = 'max-w-2xl',
  maxHeight = 'max-h-[90vh]',
  hideScrollbar = false
}: ModalProps) {
  return (
    <>
      {/* Overlay - closes on click */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-black/50 z-50"
      />

      {/* Modal - prevents close when clicking inside */}
      <div 
        className="fixed inset-0 flex items-center justify-center z-50 px-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className={`bg-white rounded-xl shadow-lg ${maxWidth} w-full ${maxHeight} ${hideScrollbar ? 'scrollbar-hide' : ''} overflow-y-auto`}
          onClick={(e) => e.stopPropagation()}
          style={hideScrollbar ? {
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          } : undefined}
        >
          {hideScrollbar && (
            <style>{`
              div {
                scrollbar-width: none;
              }
              div::-webkit-scrollbar {
                display: none;
              }
            `}</style>
          )}
          {children}
        </div>
      </div>
    </>
  )
}
