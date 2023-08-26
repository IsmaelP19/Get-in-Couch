import Link from 'next/link'
import LinkButton from './LinkButton'
import { useAppContext } from '../context/state'
import { useState, useEffect } from 'react'

export default function NavbarLinks () {
  const { user, done, isOpen, setOpenDrawer } = useAppContext()
  const [links, setLinks] = useState([
    { id: 1, name: 'Inmuebles', link: '/properties' },
    { id: 2, name: 'Mapa', link: '/map' }
  ])
  // const links = [
  //   { id: 1, name: 'Inmuebles', link: '/properties' },
  //   { id: 2, name: 'Mapa', link: '/map' }
  // ]

  useEffect(() => {
    if (done && user) {
      const newLinks = [
        { id: 1, name: 'Inmuebles', link: '/properties' },
        { id: 2, name: 'Mapa', link: '/map' },
        { id: 3, name: 'Usuarios', link: '/users' },
        { id: 4, name: 'Chats', link: '/chats' }
      ]
      setLinks([...newLinks])
    }
  }, [done, user])

  const handleClick = () => {
    isOpen &&
    setOpenDrawer(!isOpen)
  }

  const roundLinks = () => {
    if (user) {
      return (
        <>
          <LinkButton name='Mi perfil' link={`/profile/${user.username}`} style='bg-slate-700 hover:bg-gray-200 text-white hover:text-black md:ml-8 my-7 md:my-0' drawer />
        </>

      )
    } else {
      return (
        <>
          <LinkButton name='Registrarse' link='/signup' style='bg-slate-700 hover:bg-gray-200 text-white hover:text-black md:ml-8 my-7 md:my-0' drawer />
          <LinkButton name='Iniciar sesión' link='/login' style='bg-gray-200 hover:bg-slate-700 text-black hover:text-white md:ml-8 my-7 md:my-0' drawer />
        </>
      )
    }
  }

  return (done &&

    <ul className={`flex flex-col md:flex-row items-center md:pb-0  absolute md:static bg-slate-900 md:z-auto z-[-1] left-0 w-full md:w-auto md:pl-0  transition-all duration-500 ease-in md:opacity-100 border-b border-white md:border-0 ${isOpen ? 'top-[60px] opacity-100' : 'top-[-490px] opacity-0'} `}>
      {links.map((link) => (
        <li key={link.id} className='md:ml-8 text-xl cursor-pointer md:my-0 my-7'>
          <Link href={link.link} className='text-gray-400 hover:text-gray-100 duration-500' onClick={handleClick}>{link.name}</Link>

        </li>
      ))}

      {roundLinks()}

    </ul>
  )
}
