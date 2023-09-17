import { Loading, Pagination } from '@nextui-org/react'
import { useState, useEffect } from 'react'
import { useAppContext } from '../context/state'
import userService from '../services/users'
import PropertyCard from '../components/PropertyCard'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { IoBookmark } from 'react-icons/io5'

export default function Saved () {
  const [savedProperties, setSavedProperties] = useState([])
  const [isLoading, setLoading] = useState(true)
  const { user, done } = useAppContext()
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const router = useRouter()

  useEffect(() => {
    if (done && !user) {
      router.push('/')
    } else if (done && user) {
      async function getSavedProperties () {
        const response = await userService.getSavedProperties(user?.username, 1)
        response.favorites.forEach(property => {
          property.location.street = property.location.street.split(',')[0]
          delete property.location?.coordinates
        })

        console.log(response.favorites)
        setSavedProperties(response.favorites)

        setTotalPages(Math.ceil(response.total / 8))
        setLoading(false)
      }
      getSavedProperties()
    }
  }, [router, done])

  const handlePageChange = async (page) => {
    setLoading(true)
    setPage(page)
    const response = await userService.getSavedProperties(user?.username, page)
    setSavedProperties(response.favorites)
    setTotalPages(Math.ceil(response.total / 8)) // in case the total number of properties has changed
    setLoading(false)
  }

  return (
    <div className='flex flex-col items-center justify-center w-full h-full'>
      {isLoading
        ? (
          <div className='flex flex-col items-center justify-center gap-3 my-5 md:my-10'>
            <Loading color='primary' />
            <span>Cargando...</span>
          </div>
          )
        : (
          <div className='w-full flex flex-col'>
            <div className='flex gap-2 my-5 md:my-10 font-bold text-3xl text-center items-center justify-center'>
              <IoBookmark className='text-green-600' />
              <h1 className='w-44 sm:w-fit'>Anuncios guardados</h1>
              <IoBookmark className='text-green-600' />
            </div>

            {savedProperties.length > 0
              ? (
                <div className='flex items-center justify-center flex-col gap-5 mb-10'>
                  <div className='flex items-center justify-center row gap-10 m-10 flex-wrap'>
                    {savedProperties.map(property => (
                      <Link href={`/properties/${property.id}`} key={property.id}>
                        <PropertyCard key={property.id} property={property} title={property.title} />
                      </Link>
                    ))}
                  </div>
                  <Pagination total={totalPages} bordered shadow initialPage={1} page={page} onChange={handlePageChange} className='z-0' />
                </div>
                )
              : (
                <div className='flex flex-col items-center justify-center gap-3 my-5 md:my-10'>
                  <span className='text-2xl text-center px-5'>No tienes propiedades guardadas</span>
                </div>
                )}

          </div>

          )}
    </div>

  )
}

export async function getServerSideProps (context) {
  return {
    props: {
      title: 'Anuncios guardados'
    }
  }
}
