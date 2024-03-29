import Link from 'next/link'
import { NextSeo } from 'next-seo'
import { BiErrorCircle } from 'react-icons/bi'

export default function Custom403 () {
  return (
    <>
      <NextSeo title='Página no encontrada' />
      <div className='flex flex-col justify-center items-center w-full my-10'>
        <h1 className='flex flex-row gap-5 text-6xl md:text-9xl'>
          <BiErrorCircle />
          403
        </h1>
        <h2 className='text-3xl md:text-4xl mb-14 mt-5 mx-5 text-center '>No tienes permisos suficientes para acceder a esta página</h2>
        <Link href='/' className='bg-gray-200 hover:bg-slate-600 text-black hover:text-white py-2 px-4 rounded-full text-xl md:text-2xl'>
          Volver a la página principal
        </Link>
      </div>
    </>

  )
}
