import { GrMapLocation } from 'react-icons/gr'
import Link from 'next/link'
import { AiFillStar } from 'react-icons/ai'

export default function PropertyCard ({ property, style, handleClose, avgRating }) {
  const { id, title, price, location, features, images } = property

  // const freeRooms = features.numberOfBedrooms - tenants.length
  const status = features.availableRooms > 0 ? 'Disponible' : 'Ocupado'

  const cardSubtitle = location.town ? location.town + ', ' + location.city : location.city

  return (
    <div key={id} className={`flex flex-col border-2 w-[300px] items-center gap-4 ${handleClose ? 'pb-0' : 'pb-5'} border-black rounded-3xl ${style}`}>

      <img src={images[0] || '/static/images/room.jpg'} alt={title} className='object-cover  w-[300px]  h-[200px] rounded-t-3xl' />

      <div className='flex flex-col w-[300px] items-center gap-4 pb-5'>
        <h2 className='font-bold text-center '>{location.street}</h2>
        <h3 className='italic'>
          <GrMapLocation className='inline-block mr-1' />

          {cardSubtitle}
        </h3>
        <span> {features.availableRooms}/{features.numberOfBedrooms} habitaciones disponibles</span>
        <span>{features.numberOfBathrooms} {features.numberOfBathrooms === 1 ? 'baño' : 'baños'}</span>
        <span className='flex items-center gap-1'>{avgRating} <AiFillStar className='text-yellow-500' /></span>
        <div className='flex w-full items-center justify-around'>
          <span className='font-bold rounded-2xl bg-[#FFAA22] px-3 py-2'>{price} €/mes </span>
          <span className={`${status === 'Disponible' ? 'bg-green-500 ' : 'bg-red-500'} px-3 py-2 rounded-2xl font-bold`}>{status.toUpperCase()}</span>
        </div>
        {handleClose && (
          <div className='flex flex-row w-full items-center justify-center gap-3'>
            <Link href={`/properties/${property.id}`} className='px-2 border-2 rounded-md bg-blue-200 border-blue-700 hover:bg-blue-700 hover:text-white font-bold duration-200'>
              Ver detalles
            </Link>
            <button onClick={handleClose} className='px-2 border-2 rounded-md bg-red-200 border-red-700 hover:bg-red-700 hover:text-white font-bold duration-200 text-black'>Cerrar</button>

          </div>
        )}

      </div>

    </div>
  )
}
