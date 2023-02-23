export default function Feature({ title, description, color }) {
  return (
    <div className='flex items-center justify-center'>
      <div className='flex flex-col md:flex-row bg-gray-200 rounded-2xl my-5 w-8/12 items-center p-5'>
        <div className='md:mr-2 mb-2 md:mb-0 '>
          <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill={color} className='w-6 h-6'>
            <path fillRule='evenodd' d='M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z' clipRule='evenodd' />
          </svg>
        </div>
        <div className='flex flex-col gap-1'>
          <h3 className='font-bold text-center md:text-start'>{title}</h3>
          <p className='text-gray-500'>{description}</p>
        </div>
      </div>
    </div>
  )
}
