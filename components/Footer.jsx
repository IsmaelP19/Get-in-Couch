import Link from 'next/link'
import Column from './Column'

export default function Footer () {
  const company = [
    { id: 1, name: 'Inicio', link: '/' },
    { id: 2, name: 'Más información', link: '/about' },
    { id: 3, name: 'Contacto', link: '/contact' }
  ]

  const support = [
    { id: 1, name: 'Preguntas frecuentes', link: '/faq' },
    { id: 2, name: 'Guía de uso', link: '/guide' }
  ]

  const legal = [
    { id: 1, name: 'Términos y condiciones', link: '/terms' },
    { id: 2, name: 'Política de privacidad', link: '/privacy' }
  ]

  return (
    <footer className='shadow-md w-full bottom-0 bg-slate-900 text-gray-100 md:px-10'>
      <div className='flex md:flex-row flex-col md:items-start items-center justify-around p-8'>
        <Column header='Compañía' links={company} />
        <Column header='Soporte' links={support} />
        <Column header='Legal' links={legal} />
      </div>
      <hr className='border-solid border-x border-gray-600 w-10/12 m-auto mb-7' />
      <div className='flex md:flex-row flex-col gap-4 items-center justify-between md:px-16 px-5 pb-4 '>
        <span className='text-gray-300 font-semibold'>
          © 2023 Get in Couch, Inc. Todos los derechos reservados.
        </span>
        <span className='text-gray-300 font-semibold'>
          Hecho con ❤️ por <Link href='https://www.github.com/IsmaelP19' className=' hover:text-[#0099ff] duration-100 hover:underline'>Ismael</Link>
        </span>
      </div>

    </footer>
  )
}
