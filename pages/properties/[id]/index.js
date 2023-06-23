import Gallery from '../../../components/Gallery'
import PropertyCard from '../../../components/PropertyCard'
import Tag from '../../../components/Tag'
import propertiesService from '../../../services/properties'
import { useState } from 'react'
import { AiOutlineEdit } from 'react-icons/ai'
import { MdDeleteOutline } from 'react-icons/md'
import { useRouter } from 'next/router'
import { useAppContext } from '../../../context/state'

export default function PropertyDetails ({ property }) {
  const [showText, setShowText] = useState('Ver más imágenes')
  const { user } = useAppContext()
  const router = useRouter()

  const handleShowGallery = () => {
    const gallery = document.querySelector('#gallery')
    const navbarHeight = document.querySelector('#navbar').offsetHeight // Obtiene la altura de la navbar

    if (gallery.classList.contains('hidden')) {
      gallery.classList.remove('hidden')
      gallery.classList.add('flex')
      setShowText('Ocultar imágenes')
      const galleryPosition = gallery.getBoundingClientRect().top + window.scrollY
      const newPosition = galleryPosition - navbarHeight - 10
      window.scrollTo({ top: newPosition, behavior: 'smooth' })
    } else {
      gallery.classList.remove('flex')
      gallery.classList.add('hidden')
      setShowText('Ver más imágenes')
    }
  }

  const handleEdit = () => {
    router.push(`/properties/${property.id}/edit`)
  }

  const handleDelete = async () => {
    const confirm = window.confirm('¿Estás seguro de que quieres eliminar este inmueble?')
    if (confirm) {
      await propertiesService.removeProperty(property.id)
      router.push('/properties')
    }
  }

  return (
    <div className='w-full flex flex-col items-center pb-10'>
      <h1 className='p-10 font-bold text-3xl text-center'>Detalles del inmueble</h1>
      <div className='w-5/6 flex flex-col md:flex-row items-center justify-around gap-10'>
        <div className='flex flex-col gap-5 items-center'>
          {user?.id === property.owner && (
            <div className='flex gap-3 w-full justify-between'>
              <button className='bg-gray-200 hover:bg-red-700 px-5 self-center text-black hover:text-white rounded-full py-1 duration-200 border-2 border-slate-700 font-bold flex justify-center items-center gap-2 ' onClick={handleDelete}>
                <MdDeleteOutline />
                Eliminar
              </button>
              <button className='bg-gray-200 hover:bg-yellow-500 px-5 self-center text-black hover:text-black rounded-full py-1 duration-200 border-2 border-slate-700 font-bold flex justify-center items-center gap-2' onClick={handleEdit}>
                <AiOutlineEdit />
                Editar
              </button>
            </div>
          )}

          <PropertyCard property={property} />
          <button className='bg-slate-700 hover:bg-gray-200 text-white hover:text-black rounded-full p-1 duration-200 border-2 border-gray-200 font-bold w-full' onClick={handleShowGallery}>
            {showText}
          </button>
        </div>

        <div className='w-full md:w-3/6 xl:w-3/4 flex flex-col gap-4 p-10 bg-blue-100 rounded-3xl border-2 border-black'>
          <h2 className='font-bold text-2xl text-center w-full break-words whitespace-pre-wrap '>{property.title}</h2>
          <p className='text-xl'>{property.description}</p>

          <span className='text-xl font-bold w-full pt-4'>Características:</span>
          <div className='flex flex-row flex-wrap  gap-6 '>
            <Tag text={property.features.propertyType} />
            <Tag text={property.features.propertySize + ' m2'} />
            <Tag text={property.features.numberOfBedrooms + ' habitaciones'} />
            <Tag text={property.features.numberOfBathrooms + ' baños'} />
            <Tag text={property.features.parking} />

            {property.features.floor && <Tag text={'Planta ' + property.features.floor} />}
            {property.features.elevator && <Tag text='Ascensor' />}
            {property.features.airConditioning && <Tag text='Aire acondicionado' />}
            {property.features.heating && <Tag text='Calefacción' />}
            <Tag text={property.features.furniture} />

            {property.features.terrace && <Tag text='Terraza' />}
            {property.features.balcony && <Tag text='Balcón' />}
            {property.features.swimmingPool && <Tag text='Piscina' />}
            {property.features.garden && <Tag text='Jardín' />}
            {property.features.petsAllowed && <Tag text='Se admiten mascotas' />}
            {property.features.smokingAllowed && <Tag text='Se permite fumar' />}

          </div>
        </div>

      </div>

      <Gallery property={property} />

    </div>
  )
}

export async function getServerSideProps (context) {
  const id = context.params.id

  const property = await propertiesService.getProperty(id)
  if (property.error) {
    context.res.writeHead(302, { Location: '/404' })
    context.res.end()
  }

  return {
    props: {
      property,
      title: 'Detalles del inmueble'
    }
  }
}
