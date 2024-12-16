import React, { useEffect, useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, DollarSign, Edit, ImageIcon, Bed, Bath, Square, Layers, Eye, Home } from 'lucide-react'
import GoogleMap from './GoogleMap'
import { Button } from "@/components/ui/button"
import { Property } from '../types/property'
import { getSupabase } from '../../lib/supabaseClient'
import Image from 'next/image'

interface PropertyCardProps extends Property {
  onEdit: (id: string) => void;
  onViewImages: (id: string) => void;
}

export default function PropertyCard({
  id,
  title,
  description,
  price,
  street_address,
  suburb,
  city,
  province,
  postal_code,
  bedrooms,
  bathrooms,
  floor_size_sqm,
  erf_size_sqm,
  main_image,
  additional_images,
  has_pool,
  has_built_in_braai,
  has_balcony,
  has_security_post,
  has_aircon,
  view_type,
  level_count,
  status,
  hide_address,
  is_published,
  property_type,
  rates_and_taxes,
  levy,
  onEdit,
  onViewImages
}: PropertyCardProps) {
  const [mainImageUrl, setMainImageUrl] = useState<string | null>(null)
  const supabase = getSupabase()

  useEffect(() => {
    const fetchMainImage = async () => {
      const { data, error } = await supabase
        .from('properties')
        .select('main_image')
        .eq('id', id)
        .single();

      if (error) {
        console.error('Error fetching main image:', error);
        setMainImageUrl(null);
      } else if (data && data.main_image) {
        setMainImageUrl(data.main_image);
      }
    }

    fetchMainImage()
  }, [id])

  const fullAddress = hide_address
    ? `${suburb}, ${city}, ${province}`
    : `${street_address}, ${suburb}, ${city}, ${province}, ${postal_code}`;

  return (
    <Card className="overflow-hidden transition-all duration-300 ease-in-out hover:shadow-lg">
      <CardHeader className="p-0">
        <div className="relative w-full h-48">
          {mainImageUrl ? (
            <Image
              src={mainImageUrl}
              alt={title}
              layout="fill"
              objectFit="cover"
              onError={() => {
                console.error('Error loading image:', mainImageUrl);
                setMainImageUrl('/placeholder.svg?height=192&width=384');
              }}
            />
          ) : (
            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
              <span className="text-gray-400">No image available</span>
            </div>
          )}
          <div className="absolute top-2 right-2 flex space-x-2">
            <Badge variant="secondary" className="bg-white text-black">
              <DollarSign className="w-4 h-4 mr-1" />
              {typeof price === 'number' ? `R ${price.toLocaleString()}` : 'Price on request'}
            </Badge>
            <Badge variant="outline" className="bg-white text-black">
              {status}
            </Badge>
            {!is_published && (
              <Badge variant="destructive">Draft</Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <CardTitle className="text-lg font-semibold line-clamp-1 mb-2">{title}</CardTitle>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">{description}</p>
        <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
          <MapPin className="w-4 h-4 mr-1" />
          <span className="line-clamp-1">{fullAddress}</span>
        </div>
        <div className="grid grid-cols-3 gap-2 mb-4">
          <div className="flex items-center">
            <Bed className="w-4 h-4 mr-1" />
            <span>{bedrooms} bed</span>
          </div>
          <div className="flex items-center">
            <Bath className="w-4 h-4 mr-1" />
            <span>{bathrooms} bath</span>
          </div>
          <div className="flex items-center">
            <Square className="w-4 h-4 mr-1" />
            <span>{floor_size_sqm} m²</span>
          </div>
        </div>
        <div className="flex items-center mb-2 text-sm">
          <Home className="w-4 h-4 mr-1" />
          <span>{property_type}</span>
        </div>
        <div className="flex items-center mb-2 text-sm">
          <Square className="w-4 h-4 mr-1" />
          <span>Erf Size: {erf_size_sqm} m²</span>
        </div>
        <div className="flex flex-wrap gap-2 mb-4">
          {has_pool && <Badge variant="outline">Pool</Badge>}
          {has_built_in_braai && <Badge variant="outline">Built-in Braai</Badge>}
          {has_balcony && <Badge variant="outline">Balcony</Badge>}
          {has_security_post && <Badge variant="outline">Security Post</Badge>}
          {has_aircon && <Badge variant="outline">Air Conditioning</Badge>}
        </div>
        {view_type && (
          <div className="flex items-center mb-2 text-sm">
            <Eye className="w-4 h-4 mr-1" />
            <span>{view_type} View</span>
          </div>
        )}
        <div className="flex items-center mb-4 text-sm">
          <Layers className="w-4 h-4 mr-1" />
          <span>{level_count} {level_count === 1 ? 'Level' : 'Levels'}</span>
        </div>
        <div className="grid grid-cols-2 gap-2 mb-4">
          <div className="text-sm">
            <span className="font-semibold">Rates & Taxes:</span> 
            {typeof rates_and_taxes === 'number' 
              ? `R ${rates_and_taxes.toLocaleString()} /month`
              : 'N/A'}
          </div>
          <div className="text-sm">
            <span className="font-semibold">Levy:</span> 
            {typeof levy === 'number'
              ? `R ${levy.toLocaleString()} /month`
              : 'N/A'}
          </div>
        </div>
        <div className="h-40 rounded-md overflow-hidden mb-4">
          <GoogleMap address={{
            street: street_address,
            suburb,
            city,
            province,
            postalCode: postal_code
          }} />
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex justify-between">
        <Button variant="outline" size="sm" onClick={() => onViewImages(id)}>
          <ImageIcon className="w-4 h-4 mr-2" />
          View Images
        </Button>
        <Button variant="outline" size="sm" onClick={() => onEdit(id)}>
          <Edit className="w-4 h-4 mr-2" />
          Edit
        </Button>
      </CardFooter>
    </Card>
  )
}

