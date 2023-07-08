import Link from 'next/link'
import Tag from './Tag'
import { AiOutlineEdit, AiOutlineCheckCircle } from 'react-icons/ai'
import { TfiAnnouncement } from 'react-icons/tfi'

export default function PropertyInfo ({ property }) {
  const date = property?.lastEdited
    ? new Date(property.lastEdited).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })
    : property?.publishDate

  return (
    <div className='w-full md:w-3/6 xl:w-3/4 flex flex-col gap-4 p-7 bg-blue-100 rounded-3xl border-2 border-black'>
      <h2 className='font-bold text-2xl text-center w-full break-words whitespace-pre-wrap '>{property.title}</h2>
      <p className='text-xl'>{property.description}</p>

      <span className='text-xl font-bold w-full pt-4'>
        <AiOutlineCheckCircle className='inline-block mr-2 mb-1' />
        Características:
      </span>
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
      <div className='flex flex-col'>
        <span className='text-xl font-bold w-full pt-4 justify-center'>
          <TfiAnnouncement className='inline-block mr-2 mb-1' />
          Anuncio publicado por <Link href={'/profile/' + property.owner?.username} className='hover:underline hover:text-blue-600'>{property.owner?.name} {property.owner?.surname}</Link>
        </span>
        <span className='text-xl font-bold w-full pt-2'>
          <AiOutlineEdit className='inline-block mr-2 mb-1' />
          Fecha de última edición: {date}
        </span>
      </div>

    </div>
  )
}
