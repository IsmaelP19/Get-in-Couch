import PropertyCard from '../../components/PropertyCard'
import Link from 'next/link'
import propertiesService from '../../services/properties'
import { useAppContext } from '../../context/state'

export default function Catalogue ({ properties, title }) {
  const { user } = useAppContext()
  return (
    <div className='w-full flex flex-col'>
      <h1 className='p-10 font-bold text-3xl text-center'>Inmuebles</h1>

      {user?.isOwner && (
        <div className='w-full flex items-center justify-center'>
          <Link href='/properties/new'>
            <button className='bg-green-400  hover:bg-green-800 hover:text-white transition-all text-black font-bold py-2 px-4 rounded-lg'>
              Crear nuevo anuncio
            </button>
          </Link>
        </div>
      )}

      <div className='flex items-center justify-center row gap-40 m-10 flex-wrap'>
        {properties.message === 'properties succesfully retrieved'
          ? (properties.properties.map(property => (
            <Link href={`/properties/${property.id}`} key={property.id}>
              <PropertyCard key={property.id} property={property} title={title} />
            </Link>
            )))
          : (<h1 className='text-2xl font-bold text-center'>No hay inmuebles disponibles</h1>)}

      </div>

    </div>
  )
}

export async function getServerSideProps (context) {
  const page = context.query.page || 1

  const properties = await propertiesService.getAll(page)

  return {
    props: {
      properties,
      title: 'Catálogo'
    }
  }
}
