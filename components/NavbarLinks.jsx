import Link from 'next/link'
import Button from './Button'

export default function NavbarLinks ({ isOpen }) {
  const links = [
    { id: 1, name: 'Inmuebles', link: '/places' },
    { id: 2, name: 'Mapa', link: '/mapa' }
  ]

  return (

    <ul className={`flex flex-col md:flex-row items-center md:pb-0  absolute md:static bg-slate-900 md:z-auto z-[-1] left-0 w-full md:w-auto md:pl-0  transition-all duration-500 ease-in md:opacity-100  ${isOpen ? 'top-[60px] opacity-100 ' : 'top-[-490px] opacity-0'} `}>
      {links.map((link) => (
        <li key={link.id} className='md:ml-8 text-xl cursor-pointer md:my-0 my-7'>
          <Link href={link.link} className='text-gray-400 hover:text-gray-100 duration-500'>{link.name}</Link>
        </li>
      ))}
      <Button name='Registrarse' link='/signup' style='bg-slate-700 hover:bg-gray-200 text-white hover:text-black md:ml-8 my-7 md:my-0' />
      <Button name='Iniciar sesión' link='/login' style='bg-gray-200 hover:bg-slate-700 text-black hover:text-white md:ml-8 my-7 md:my-0' />
    </ul>
  )
}
