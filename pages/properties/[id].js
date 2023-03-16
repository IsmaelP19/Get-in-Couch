import PropertyCard from '../../components/PropertyCard'
import Tag from '../../components/Tag'

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
          <div className='flex flex-row flex-wrap  gap-6 '>
            <Tag text={property.features.propertyType} />
            <Tag text={property.features.propertySize + ' m2'} />
            <Tag text={property.features.numberOfBedrooms + ' habitaciones'} />
            <Tag text={property.features.numberOfBathrooms + ' baños'} />
            <Tag text={property.features.parking} />

            {property.features.floor && <Tag text={'Planta ' + property.features.floor} />}
            {property.features.elevator && <Tag text='Ascensor' />}
            <Tag text='Aire acondicionado' />
            <Tag text='Calefacción' />
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
