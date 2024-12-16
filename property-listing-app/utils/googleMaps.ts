import { Loader } from '@googlemaps/js-api-loader'

export const createMapLoader = (apiKey: string) => {
  console.log('Creating map loader with API key:', apiKey.substring(0, 5) + '...')
  return new Loader({
    apiKey,
    version: 'weekly',
    libraries: ['places', 'marker']
  })
}

export const geocodeAddress = async (geocoder: google.maps.Geocoder, address: string): Promise<google.maps.GeocoderResult> => {
  console.log('Geocoding address:', address)
  return new Promise((resolve, reject) => {
    geocoder.geocode({ address }, (results, status) => {
      console.log('Geocoding status:', status)
      if (status === google.maps.GeocoderStatus.OK && results && results[0]) {
        resolve(results[0])
      } else {
        reject(new Error(`Geocoding failed: ${status}`))
      }
    })
  })
}

export const createMap = (
  container: HTMLElement,
  center: google.maps.LatLng,
  zoom: number,
  mapId: string
): google.maps.Map => {
  console.log('Creating map with mapId:', mapId)
  return new google.maps.Map(container, {
    center,
    zoom,
    mapId
  })
}

export const addMarkerToMap = (
  map: google.maps.Map,
  position: google.maps.LatLng,
  AdvancedMarkerElement: typeof google.maps.marker.AdvancedMarkerElement
): google.maps.marker.AdvancedMarkerElement => {
  console.log('Adding marker to map at position:', position.toString())
  return new AdvancedMarkerElement({
    map,
    position,
  })
}

