import { useEffect, useState } from 'react'
import { GoogleMap, LoadScript, MarkerF } from '@react-google-maps/api'
import Link from 'next/link'
import PropertyCard from './PropertyCard'

// Replace 'YOUR_API_KEY' with your actual Google Maps API key
const containerStyle = {
  width: '100%',
  height: '100%', // try with 100% looks great on desktop but does not even appear on mobile
  minHeight: '607px'
}

const center = {
  lat: 37.3453200,
  lng: -5.7420100
}

const GoogleMapComponent = ({ properties }) => {
  const [selectedProperty, setSelectedProperty] = useState(null)
  const [mapCenter, setMapCenter] = useState(center) // Manage map center

  // ask the user for permission to use their location
  // if we have it, center the map on their location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLatLng = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          }
          setMapCenter(userLatLng) // Update map center
        },
        (error) => {
          console.error('Error getting user location:', error)
        }
      )
    }
  }, [])

  const handleMarkerClick = (property) => {
    setSelectedProperty(property)
  }

  const handleCloseCard = () => {
    setSelectedProperty(null)
  }
  return (properties?.length > 0 &&
    <LoadScript googleMapsApiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={mapCenter}
        options={
          {
            maxZoom: 17,
            zoomControl: true,
            scaleControl: false
          }
        }
        zoom={14}
      >
        {properties.map(property => (
          <MarkerF
            key={property.id}
            position={{ lat: property.location.coordinates[0], lng: property.location.coordinates[1] }}
            onClick={() => handleMarkerClick(property)}
            visible

          />
        ))}
      </GoogleMap>
      {selectedProperty && (
        <PropertyCard property={selectedProperty} style='w-[300px] absolute bg-white' handleClose={handleCloseCard} />

      )}
    </LoadScript>
  )
}

export default GoogleMapComponent
