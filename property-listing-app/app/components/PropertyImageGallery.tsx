'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'

interface PropertyImageGalleryProps {
  images: string[]
}

export function PropertyImageGallery({ images = [] }: PropertyImageGalleryProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const validImages = images.filter(img => img && img.trim() !== '')

  const nextImage = () => {
    if (validImages.length > 1) {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % validImages.length)
    }
  }

  const prevImage = () => {
    if (validImages.length > 1) {
      setCurrentImageIndex((prevIndex) => (prevIndex - 1 + validImages.length) % validImages.length)
    }
  }

  if (validImages.length === 0) {
    return <div className="text-center text-gray-500">No images available</div>
  }

  return (
    <div className="space-y-4">
      <div className="relative w-full h-[70vh]">
        <Image
          src={validImages[currentImageIndex]}
          alt={`Property image ${currentImageIndex + 1}`}
          layout="fill"
          objectFit="contain"
          onError={() => {
            console.error('Error loading image:', validImages[currentImageIndex]);
            // You might want to set a state here to show a placeholder image
          }}
        />
        {validImages.length > 1 && (
          <>
            <Button
              variant="outline"
              size="icon"
              className="absolute top-1/2 left-2 transform -translate-y-1/2"
              onClick={prevImage}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="absolute top-1/2 right-2 transform -translate-y-1/2"
              onClick={nextImage}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </>
        )}
      </div>
      <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2">
        {validImages.map((image, index) => (
          <Button
            key={index}
            variant="outline"
            className={`p-0 w-full aspect-square overflow-hidden ${
              index === currentImageIndex ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => setCurrentImageIndex(index)}
          >
            <div className="relative w-full h-full">
              <Image
                src={image}
                alt={`Property image ${index + 1}`}
                layout="fill"
                objectFit="cover"
                onError={() => {
                  console.error('Error loading thumbnail:', image);
                  // You might want to set a state here to show a placeholder image
                }}
              />
            </div>
          </Button>
        ))}
      </div>
    </div>
  )
}

