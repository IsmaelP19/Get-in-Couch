import { useState, useEffect } from 'react'
import GoogleMapComponent from '../components/GoogleMap'
import propertiesService from '../services/properties'
import { Loading } from '@nextui-org/react'

export default function MapPage () {
  const [properties, setProperties] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProperties = async () => {
      const fetchedProperties = await propertiesService.getAll(1, '', true)

      fetchedProperties.properties.forEach(property => {
        // delete property.location?.coordinates
        property.location.street = property.location.street.split(',')[0]
      })
      setProperties(fetchedProperties.properties)
      setLoading(false)
    }
    fetchProperties()
  }, [])

  return (
    <div className='flex flex-col items-center justify-center w-full'>
      {loading
        ? (
          <>
            <Loading color='primary' />
            <span className='text-center'>Cargando...</span>
          </>
          )
        : (
          <GoogleMapComponent properties={properties} />

          )}

    </div>
  )
}

export async function getServerSideProps () {
  return {
    props: {
      title: 'Mapa'
    }
  }
}
