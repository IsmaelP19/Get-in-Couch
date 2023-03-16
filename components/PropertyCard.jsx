import { useState, useEffect } from 'react'

export default function PropertyCard ({ property, style }) {
  const { id, title, price, location, features, images, tenants } = property
  const [actualUrl, setActualUrl] = useState('')
  const [index, setIndex] = useState(0)

  const handlePrev = () => {
    console.log(index)
    setIndex(index === 0 ? images.length - 1 : index - 1)
  }

  const handleNext = () => { // modular arithmetic
    setIndex((index + 1) % images.length)
  }

  useEffect(() => {
    setActualUrl(window.location.href.split('/properties')[1])
  }, [])

  const freeRooms = features.numberOfBedrooms - tenants.length
  const status = freeRooms > 0 ? 'Disponible' : 'Ocupado'

  const cardTitle = location.street.split(',')[0]
  const cardSubtitle = location.town ? location.town + ', ' + location.city : location.city

  return (
    <div key={id} className={`flex flex-col border-2 w-[300px] items-center gap-4 pb-5 border-black rounded-3xl ${style}`}>

      <img src={images[index] || '/static/images/room.jpg'} alt={title} className='object-cover  w-[300px]  h-[200px] rounded-t-3xl' />
      {images.length > 1 && actualUrl !== ''
        ? (
          <div className='flex items-center justify-around w-full px-5 '>
            <button onClick={handlePrev}>
              <span className='font-bold text-4xl bg-gray-200 rounded-full px-2 '>{'<'}</span>
            </button>
            <button onClick={handleNext}>
              <span className='font-bold text-4xl bg-gray-200 rounded-full px-2 '>{'>'}</span>
            </button>
          </div>)
        : null}

      <div className='flex flex-col w-[300px] items-center gap-4 pb-5'>
        <h2 className='font-bold text-center '>{cardTitle}</h2>
        <h3 className='italic'> {cardSubtitle} </h3>
        <span>{freeRooms}/{features.numberOfBedrooms} habitaciones disponibles</span>
        <span>{features.numberOfBathrooms} {features.numberOfBathrooms === 1 ? 'baño' : 'baños'}</span>
        <div className='flex w-full items-center justify-around'>
          <span className='font-bold rounded-2xl bg-[#FFAA22]  px-3 py-2'>{price} €/mes </span>
          <span className={`${status === 'Disponible' ? 'bg-green-500' : 'bg-red-500'} px-3 py-2 rounded-2xl font-bold `}>{status.toUpperCase()}</span>
        </div>
      </div>

    </div>
  )
}
