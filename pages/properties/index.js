import PropertyCard from '../../components/PropertyCard'
import Link from 'next/link'
import propertiesService from '../../services/properties'
import { useAppContext } from '../../context/state'
import { Pagination, Loading } from '@nextui-org/react'

import { useEffect, useState } from 'react'

export default function Catalogue () {
  const { user } = useAppContext()
  const [totalPages, setTotalPages] = useState(1)
  const [properties, setProperties] = useState([])
  const [page, setPage] = useState(1)
  const [done, setDone] = useState(false)

  useEffect(() => {
    const fetchProperties = async () => {
      const fetchedProperties = await propertiesService.getAll(page)
      setProperties(fetchedProperties.properties)
      setTotalPages(Math.ceil(fetchedProperties.total / 8))
      setDone(true)
    }
    fetchProperties()
  }, [page])

  const handlePageChange = async (page) => {
    setDone(false)
    setPage(page)
    const fetchedProperties = await propertiesService.getAll(page)
    setProperties(fetchedProperties.properties)
    setTotalPages(Math.ceil(fetchedProperties.total / 8)) // in case the total number of properties has changed
    setDone(true)
  }

  return (
    <div className='w-full flex flex-col'>
      <h1 className='p-10 font-bold text-3xl text-center'>Inmuebles</h1>

      {user?.isOwner && (
        <div className='w-full flex items-center justify-center mb-6'>
          <Link href='/properties/new'>
            <button className='bg-green-400  hover:bg-green-800 hover:text-white transition-all text-black font-bold py-2 px-4 rounded-lg'>
              Crear nuevo anuncio
            </button>
          </Link>
        </div>
      )}

      {!done && <Loading color='primary' className='mb-10' />}

      {done && properties.total !== 0
        ? (
          <div className='flex items-center justify-center flex-col gap-5 mb-10'>
            <div className='flex items-center justify-center row gap-10 m-10 flex-wrap'>
              {properties.map(property => (
                <Link href={`/properties/${property.id}`} key={property.id}>
                  <PropertyCard key={property.id} property={property} title={property.title} />
                </Link>
              ))}
            </div>
            <Pagination total={totalPages} bordered shadow initialPage={1} page={page} onChange={handlePageChange} className='z-0' />
          </div>
          )
        : (
            done && <h1 className='text-2xl font-bold text-center'>No hay inmuebles disponibles</h1>
          )}

    </div>
  )
}

export async function getServerSideProps (context) {
  return {
    props: {
      title: 'Catálogo'
    }
  }
}
