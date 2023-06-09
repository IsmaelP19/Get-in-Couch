import Link from 'next/link'
import { NextSeo } from 'next-seo'
import { useRouter } from 'next/router'
import { useEffect } from 'react'

export default function Custom404 () {
  const router = useRouter()
  useEffect(() => {
    router.replace('/404')
  }, [router])
  return (
    <>
      <NextSeo title='Página no encontrada' />
      <div className='flex flex-col justify-center items-center w-full my-10'>
        <h1 className='text-6xl md:text-9xl'>404</h1>
        <h2 className='text-3xl md:text-6xl mb-14'>Página no encontrada</h2>
        <Link href='/' className='bg-gray-200 hover:bg-slate-600 text-black hover:text-white py-2 px-4 rounded-full text-xl md:text-2xl'>
          Volver a la página principal

        </Link>
      </div>
    </>

  )
}
