'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'

interface SidePanelProps {
  isOpen: boolean
  onClose: () => void
  children: React.ReactNode
}

export function SidePanel({ isOpen, onClose, children }: SidePanelProps) {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true)
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />
        <section className={`absolute inset-y-0 right-0 pl-10 max-w-full flex transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="relative w-screen max-w-md">
            <div className="h-full flex flex-col py-6 bg-white shadow-xl overflow-y-scroll">
              <div className="px-4 sm:px-6">
                <div className="flex items-start justify-between">
                  <h2 className="text-lg font-medium text-gray-900">Edit Property</h2>
                  <div className="ml-3 h-7 flex items-center">
                    <button
                      onClick={onClose}
                      className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <span className="sr-only">Close panel</span>
                      <X className="h-6 w-6" aria-hidden="true" />
                    </button>
                  </div>
                </div>
              </div>
              <div className="mt-6 relative flex-1 px-4 sm:px-6">
                {children}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

