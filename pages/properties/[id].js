import Gallery from '../../components/Gallery'
import PropertyCard from '../../components/PropertyCard'
import Tag from '../../components/Tag'
import { useState } from 'react'

export default function PropertyDetails ({ property }) {
  const [showText, setShowText] = useState('Ver más imágenes')

  const handleShowGallery = () => {
    const gallery = document.querySelector('#gallery')
    const navbarHeight = document.querySelector('#navbar').offsetHeight // Obtiene la altura de la navbar

    if (gallery.classList.contains('hidden')) {
      gallery.classList.remove('hidden')
      gallery.classList.add('flex')
      setShowText('Ocultar imágenes')

      // Obtiene la posición actual del componente gallery
      const galleryPosition = gallery.getBoundingClientRect().top + window.scrollY

      // Calcula la posición a la que se debe desplazar el componente gallery
      const newPosition = galleryPosition - navbarHeight - 10

      // Desplaza la ventana hacia la nueva posición
      window.scrollTo({ top: newPosition, behavior: 'smooth' })
    } else {
      gallery.classList.remove('flex')
      gallery.classList.add('hidden')
      setShowText('Ver más imágenes')
    }
  }

  return (
    <div className='w-full flex flex-col items-center pb-10'>
      <h1 className='p-10 font-bold text-3xl text-center'>Detalles del inmueble</h1>
      <div className='w-5/6 flex flex-col md:flex-row items-center justify-around gap-10'>
        <div className='flex flex-col gap-5'>
          <PropertyCard property={property} />
          <button className='bg-slate-700 hover:bg-gray-200 text-white hover:text-black rounded-full p-1 duration-200 border-2 border-gray-200 font-bold' onClick={handleShowGallery}>
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
  const url = `${process.env.API_URL}/properties/${id}`
  const response = await fetch(url)

  const property = await response.json()
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
