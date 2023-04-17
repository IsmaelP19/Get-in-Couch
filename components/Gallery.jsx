import { useState } from 'react'

export default function Gallery ({ property }) {
  const [index, setIndex] = useState(0)

  const handlePrev = () => {
    console.log(index)
    setIndex(index === 0 ? property.images.length - 1 : index - 1)
  }

  const handleNext = () => { // modular arithmetic
    setIndex((index + 1) % property.images.length)
  }

  return (
    <div className='hidden w-5/6 md:w-3/6 xl:w-3/4 mt-3 flex-col gap-4 p-10 bg-blue-100 rounded-3xl border-2 border-black items-center' id='gallery'>

      <div className='flex w-full items-center justify-around gap-3 p-6'>

        {property.images.length > 1 && (
          <button onClick={handlePrev}>
            <span className='font-bold text-4xl bg-gray-200 rounded-full px-2 border-2 border-black hover:bg-gray-700 hover:text-white transition-all duration-200'>{'<'}</span>
          </button>
        )}

        <img src={property.images[index] || '/static/images/room.jpg'} alt={property.title} className='' />

        {property.images.length > 1 && (
          <button onClick={handleNext}>
            <span className='font-bold text-4xl bg-gray-200 rounded-full px-2 border-2 border-black hover:bg-gray-700 hover:text-white transition-all duration-200'>{'>'}</span>
          </button>
        )}

      </div>

    </div>
  )
}
