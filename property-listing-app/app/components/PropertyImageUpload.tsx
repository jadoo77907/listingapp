import { useState } from 'react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { X } from 'lucide-react'

interface PropertyImageUploadProps {
  onMainImageChange: (file: File | null) => void;
  onAdditionalImagesChange: (files: File[]) => void;
}

export function PropertyImageUpload({ onMainImageChange, onAdditionalImagesChange }: PropertyImageUploadProps) {
  const [mainImageName, setMainImageName] = useState<string>('')
  const [additionalImageNames, setAdditionalImageNames] = useState<string[]>([])

  const handleMainImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      onMainImageChange(file)
      setMainImageName(file.name)
    }
  }

  const handleAdditionalImagesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files)
      onAdditionalImagesChange(filesArray)
      setAdditionalImageNames(filesArray.map(file => file.name))
    }
  }

  const removeMainImage = () => {
    onMainImageChange(null)
    setMainImageName('')
  }

  const removeAdditionalImage = (index: number) => {
    const newAdditionalImageNames = [...additionalImageNames]
    newAdditionalImageNames.splice(index, 1)
    setAdditionalImageNames(newAdditionalImageNames)
    onAdditionalImagesChange(newAdditionalImageNames.map(name => new File([], name)))
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="mainImage">Main Image</Label>
        <Input
          id="mainImage"
          type="file"
          onChange={handleMainImageUpload}
          accept="image/*"
          className="w-full"
        />
        {mainImageName && (
          <div className="flex items-center justify-between bg-gray-100 p-2 rounded">
            <span className="text-sm text-gray-600">{mainImageName}</span>
            <Button variant="ghost" size="sm" onClick={removeMainImage}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="additionalImages">Additional Images</Label>
        <Input
          id="additionalImages"
          type="file"
          onChange={handleAdditionalImagesUpload}
          multiple
          accept="image/*"
          className="w-full"
        />
        {additionalImageNames.length > 0 && (
          <div className="space-y-2">
            {additionalImageNames.map((name, index) => (
              <div key={index} className="flex items-center justify-between bg-gray-100 p-2 rounded">
                <span className="text-sm text-gray-600">{name}</span>
                <Button variant="ghost" size="sm" onClick={() => removeAdditionalImage(index)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

