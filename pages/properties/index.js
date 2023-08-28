import PropertyCard from '../../components/PropertyCard'
import Link from 'next/link'
import propertiesService from '../../services/properties'
import { useAppContext } from '../../context/state'
import { Pagination, Loading } from '@nextui-org/react'
import { AiOutlineSearch } from 'react-icons/ai'
import { useEffect, useState } from 'react'
import { BsFillHouseAddFill } from 'react-icons/bs'

export default function Catalogue () {
  const { user } = useAppContext()
  const [totalPages, setTotalPages] = useState(1)
  const [properties, setProperties] = useState([])
  const [page, setPage] = useState(1)
  const [isLoading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [urlSearchParams, setParams] = useState({})
  // la búsqueda se hará tanto por título, como por población, ciudad o código postal ✅
  /*
  * Habrá además diferentes filtros:
  * - Tipo de inmueble (apartamento, casa, villa, estudio) ✅
  * - Precio (mínimo y máximo) ✅
  * - Superficie (mínima y máxima) (m2) ❌
  * - Número de habitaciones ✅
  * - Número de baños ✅
  * - Estado (amueblado, semi-amueblado, sin amueblar) ✅
  * - Aire acondicionado (sí, no) ❌
  * - Calefacción (sí, no) ❌
  */

  useEffect(() => {
    const fetchProperties = async () => {
      const fetchedProperties = await propertiesService.getAll(page, urlSearchParams, false)
      fetchedProperties.properties.forEach(property => {
        delete property.location?.coordinates
        property.location.street = property.location.street.split(',')[0]
      })

      setProperties(fetchedProperties.properties)
      setTotalPages(Math.ceil(fetchedProperties.total / 8))
      setLoading(false)
    }
    fetchProperties()
  }, [page, urlSearchParams])

  const handlePageChange = async (page) => {
    setLoading(true)
    setPage(page)
  }

  const handleSearchChange = (e) => {
    setSearch(e.target.value)
  }

  const handleReset = async (e) => {
    e.preventDefault()
    const searchInput = document.querySelector('#search-input')
    const propertyType = document.querySelector('#property-type')
    const minPrice = document.querySelector('#min-price')
    const maxPrice = document.querySelector('#max-price')
    const rooms = document.querySelector('#rooms')
    const bathrooms = document.querySelector('#bathrooms')
    const state = document.querySelector('#state')
    const available = document.querySelector('#available')

    propertyType.value = ''
    minPrice.value = ''
    maxPrice.value = ''
    rooms.value = ''
    bathrooms.value = ''
    state.value = ''
    searchInput.value = ''
    available.checked = false

    setLoading(true)
    setPage(1)
    setSearch('')
    setParams({})
  }

  const handleSearch = async (e) => {
    e.preventDefault()
    setLoading(true)
    const propertyType = document.querySelector('#property-type').value
    const minPrice = document.querySelector('#min-price').value
    const maxPrice = document.querySelector('#max-price').value
    const rooms = document.querySelector('#rooms').value
    const bathrooms = document.querySelector('#bathrooms').value
    const state = document.querySelector('#state').value
    const available = document.querySelector('#available').checked

    // only send to backend non empty values
    const searchParams = new URLSearchParams()
    if (search) searchParams.append('search', search)
    if (propertyType) searchParams.append('propertyType', propertyType)
    if (minPrice) searchParams.append('minPrice', minPrice)
    if (maxPrice) searchParams.append('maxPrice', maxPrice)
    if (rooms) searchParams.append('rooms', rooms)
    if (bathrooms) searchParams.append('bathrooms', bathrooms)
    if (state) searchParams.append('state', state)
    if (available) searchParams.append('available', available)

    setParams(searchParams)

    setPage(1)

    const fetchedProperties = await propertiesService.getAll(page, searchParams, false)
    fetchedProperties.properties.forEach(property => {
      delete property.location?.coordinates
      property.location.street = property.location.street.split(',')[0]
    })

    setProperties(fetchedProperties.properties)
    setTotalPages(Math.ceil(fetchedProperties.total / 8)) // in case the total number of properties has changed
    setLoading(false)
  }

  return (
    <div className='w-full flex flex-col'>
      <h1 className='p-10 font-bold text-3xl text-center'>Inmuebles</h1>

      {user?.isOwner && (
        <div className='w-full flex items-center justify-center mb-6'>
          <Link href='/properties/new'>
            <button className='flex gap-3 items-center justify-center bg-green-400  hover:bg-green-800 hover:text-white transition-all text-black font-bold py-2 px-4 rounded-lg'>
              Crear nuevo anuncio
              <BsFillHouseAddFill className='text-xl' />
            </button>
          </Link>
        </div>
      )}

      <div className='bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mx-[5%] mb-5 rounded' role='alert'>
        <p className='font-bold text-xl'>Atención</p>
        <p className='text-xl'>
          Para buscar por título, población, ciudad o código postal, introduzca la búsqueda en el campo de texto
        </p>
      </div>
      <div className='flex flex-col flex-wrap items-center justify-center px-4 w-full gap-4'>
        <div className='flex flex-wrap items-center justify-center gap-4'>
          <div className='flex flex-row items-center border-2 border-slate-300 rounded-xl w-60 px-2 '>
            <input type='text' id='search-input' className='h-10 w-[98%] outline-none' onChange={handleSearchChange} placeholder='Introduzca la búsqueda...' />
            <div className='ml-auto'>
              <AiOutlineSearch className='text-xl left-0' />
            </div>
          </div>

          <select className='border-2 border-slate-300 rounded-xl w-60 px-2 h-10 outline-none' id='property-type'>
            <option value=''>Tipo de inmueble</option>
            <option value='Apartamento'>Apartamento</option>
            <option value='Casa'>Casa</option>
            <option value='Villa'>Villa</option>
            <option value='Estudio'>Estudio</option>
          </select>

          {/* Para el precio vamos a poner un campo máximo y mínimo */}
          <div className='flex flex-row items-center border-2 border-slate-300 rounded-xl  px-2 '>
            <input type='number' id='min-price' className='h-10  outline-none' placeholder='Precio mínimo' />
          </div>
          <div className='flex flex-row items-center border-2 border-slate-300 rounded-xl  px-2 '>
            <input type='number' id='max-price' className='h-10  outline-none' placeholder='Precio máximo' />
          </div>

          <div className='flex flex-row items-center border-2 border-slate-300 rounded-xl px-2 '>
            <input type='number' id='rooms' className='h-10  outline-none' placeholder='Habitaciones (mín)' />
          </div>

          <div className='flex flex-row items-center border-2 border-slate-300 rounded-xl px-2 '>
            <input type='number' id='bathrooms' className='h-10  outline-none' placeholder='Baños (mín)' />
          </div>

          <select className='border-2 border-slate-300 rounded-xl w-60 px-2 h-10 outline-none' id='state'>
            <option value=''>Estado</option>
            <option value='Amueblado'>Amueblado</option>
            <option value='Semi-amueblado'>Semi-amueblado</option>
            <option value='Sin amueblar'>Sin amueblar</option>
          </select>

          {/* checkbox to show only available properties */}
          <div className='flex flex-row items-center justify-center gap-2 px-2 '>
            <input type='checkbox' id='available' />
            <label htmlFor='available'>Sólo disponibles</label>
          </div>

        </div>
        <div className='flex items-center justify-center gap-4 flex-wrap'>
          <button className='bg-green-200 hover:bg-green-700 hover:text-white transition-all text-black font-bold py-2 px-4 rounded-lg' onClick={handleSearch}>
            Aplicar
          </button>
          <button className='bg-red-200 hover:bg-red-700 hover:text-white transition-all text-black font-bold py-2 px-4 rounded-lg' onClick={handleReset}>
            Restablecer
          </button>
        </div>
      </div>

      {isLoading &&
        <div className='flex flex-col items-center justify-center gap-5 my-10'>
          <Loading color='primary' className='' />
          <span>Cargando...</span>
        </div>}

      {!isLoading && properties.total !== 0
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
            !isLoading && <h1 className='text-2xl font-bold text-center'>No hay inmuebles disponibles</h1>
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
