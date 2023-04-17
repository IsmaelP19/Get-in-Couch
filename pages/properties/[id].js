import Gallery from '../../components/Gallery'
import PropertyCard from '../../components/PropertyCard'
import Tag from '../../components/Tag'

export default function PropertyDetails ({ property }) {
  const handleShowGallery = () => {
    const gallery = document.querySelector('#gallery')
    // the gallery is not visible, so we change the display of it to flex
    if (gallery.classList.contains('hidden')) {
      gallery.classList.remove('hidden')
      gallery.classList.add('flex')
      // we scroll to the gallery
      gallery.scrollIntoView({ behavior: 'smooth' })
    } else {
      gallery.classList.remove('flex')
      gallery.classList.add('hidden')
    }
  }

  return (
    <div className='w-full flex flex-col items-center pb-10'>
      <h1 className='p-10 font-bold text-3xl text-center'>Detalles del inmueble</h1>
      <div className='w-5/6 flex flex-col md:flex-row items-center justify-around gap-10'>
        <div className='flex flex-col gap-5'>
          <PropertyCard property={property} />
          {/* <Button name='Ver más imágenes' style='flex justify-center w-full  ' /> */}
          <button className='bg-slate-700 hover:bg-gray-200 text-white hover:text-black rounded-full p-1 duration-200 border-2 border-gray-200 font-bold' onClick={handleShowGallery}>
            Ver más imágenes
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

  return {
    props: {
      property,
      title: 'Detalles del inmueble'
    }
  }
}
