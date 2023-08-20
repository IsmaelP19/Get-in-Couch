import Link from 'next/link'
import { NextSeo } from 'next-seo'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { BiErrorCircle } from 'react-icons/bi'

export default function Custom404 () {
  const router = useRouter()
  useEffect(() => {
    router.push('/404')
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // the dependency array must be empty, otherwise it will be executed every time the router changes
  return (
    <>
      <NextSeo title='Página no encontrada' />
      <div className='flex flex-col justify-center items-center w-full my-10'>
        <h1 className='flex flex-row gap-5 text-6xl md:text-9xl'>
          <BiErrorCircle />
          404
        </h1>
        <h2 className='text-3xl md:text-4xl mb-14 mt-5 mx-5 text-center '>Página no encontrada</h2>
        <Link href='/' className='bg-gray-200 hover:bg-slate-600 text-black hover:text-white py-2 px-4 rounded-full text-xl md:text-2xl'>
          Volver a la página principal

        </Link>
      </div>
    </>

  )
}
