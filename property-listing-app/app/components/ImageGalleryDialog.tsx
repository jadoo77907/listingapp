import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { PropertyImageGallery } from './PropertyImageGallery'

interface ImageGalleryDialogProps {
  images: string[];
  isOpen: boolean;
  onClose: () => void;
}

export default function ImageGalleryDialog({ images, isOpen, onClose }: ImageGalleryDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl">
        <DialogTitle className="sr-only">Property Images</DialogTitle>
        <PropertyImageGallery images={images} />
      </DialogContent>
    </Dialog>
  )
}

