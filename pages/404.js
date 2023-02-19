import Link from 'next/link'
import { NextSeo } from 'next-seo'

export default function Custom404 () {
  return (
    <>
      <NextSeo title='Página no encontrada' />
      <div className='flex flex-col justify-center items-center'>
        <h1 className='text-9xl'>404</h1>
        <h2 className='text-6xl mb-14'>Página no encontrada</h2>
        <Link href='/' className='bg-gray-200 hover:bg-slate-600 text-black hover:text-white py-2 px-4 rounded-full'>
          Volver a la página principal

        </Link>
      </div>
    </>

  )
}
