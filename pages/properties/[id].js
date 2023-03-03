import PropertyCard from '../../components/PropertyCard'

export default function PropertyDetails ({ property }) {
  return (
    <div className='w-full flex flex-col items-center pb-10'>
      <h1 className='p-10 font-bold text-3xl text-center'>Detalles del inmueble</h1>
      <div className='w-5/6 flex flex-col md:flex-row items-center justify-around gap-10'>
        <PropertyCard property={property} />

        <div className='w-full md:w-3/6 xl:w-3/4 flex flex-col gap-4 p-10 bg-blue-100 rounded-3xl border-2 border-black'>
          <h2 className='font-bold text-2xl text-center w-full break-words whitespace-pre-wrap '>{property.title}</h2>
          <p className='text-xl'>{property.description}</p>

          <span className='text-xl font-bold w-full pt-4'>Características:</span>
          <div className='flex flex-wrap divide-y gap-y-4 w-full'>
            <span className='text-xl w-1/2 self-start'>{property.features.propertyType}</span>
            <span className='text-xl w-1/2 self-start'>{property.features.propertySize} m<super>2</super></span>
            <span className='text-xl w-1/2 self-start'>{property.features.numberOfBedrooms} habitaciones</span>
            <span className='text-xl w-1/2 self-start'>{property.features.numberOfBathrooms} baños</span>
            <span className='text-xl w-1/2 self-start'>{property.features.parking}</span>
            {property.features.floor && <span className='text-xl w-1/2'>Planta {property.features.floor}</span>}
            {property.features.elevator && <span className='text-xl w-1/2'>Ascensor</span>}
            <span className='text-xl w-1/2'>Aire acondicionado</span>
            <span className='text-xl w-1/2'>Calefacción</span>
            <span className='text-xl w-1/2'>{property.features.furniture}</span>
            {property.features.terrace && <span className='text-xl w-1/2'>Terraza</span>}
            {property.features.balcony && <span className='text-xl w-1/2'>Balcón</span>}
            {property.features.swimmingPool && <span className='text-xl w-1/2'>Piscina</span>}
            {property.features.garden && <span className='text-xl w-1/2'>Jardín</span>}
            {property.features.petsAllowed && <span className='text-xl w-1/2'>Se admiten mascotas</span>}
            {property.features.smokingAllowed && <span className='text-xl w-1/2'>Se permite fumar</span>}

          </div>
        </div>
      </div>

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
