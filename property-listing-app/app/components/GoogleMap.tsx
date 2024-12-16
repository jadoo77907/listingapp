'use client'

import { useEffect, useRef, useState } from 'react'
import { Loader } from '@googlemaps/js-api-loader'

interface Address {
  street: string
  suburb: string
  city: string
  province: string
  postalCode: string
}

interface GoogleMapProps {
  address: Address
}

export default function GoogleMap({ address }: GoogleMapProps) {
  const mapRef = useRef<HTMLDivElement>(null)
  const [error, setError] = useState<string | null>(null)

  console.log('GoogleMap component rendered')
  console.log('Address:', address)

  useEffect(() => {
    const initMap = async () => {
      try {
        const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
        if (!apiKey) {
          throw new Error('Google Maps API key is not set')
        }

        const loader = new Loader({
          apiKey,
          version: 'weekly',
          libraries: ['places']
        })

        const { Map } = await loader.importLibrary('maps')
        const { Geocoder } = await loader.importLibrary('geocoding') as google.maps.GeocodingLibrary

        const fullAddress = `${address.street}, ${address.suburb}, ${address.city}, ${address.province}, ${address.postalCode}, South Africa`
      
        const geocoder = new Geocoder()
        const results = await geocoder.geocode({ address: fullAddress })

        if (results.results.length > 0 && mapRef.current) {
          const map = new Map(mapRef.current, {
            center: results.results[0].geometry.location,
            zoom: 15,
          })

          new google.maps.Marker({
            map: map,
            position: results.results[0].geometry.location,
          })
        } else {
          throw new Error('No results found for the given address')
        }
      } catch (error) {
        console.error('Error initializing map:', error)
        setError(error instanceof Error ? error.message : 'Failed to load map')
      }
    }

    initMap()
  }, [address])

  if (error) {
    return (
      <div className="h-40 flex items-center justify-center bg-gray-200 text-red-500">
        <p>Error: {error}</p>
      </div>
    )
  }

  return <div ref={mapRef} className="h-40 bg-gray-200" />
}

