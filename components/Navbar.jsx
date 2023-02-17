import Link from 'next/link'
import { useState, useEffect } from 'react'
import NavbarLinks from './NavbarLinks'
import Hamburger from './Hamburger'
import userService from '../services/users'

export default function Navbar () {
  const [isOpen, setOpenDrawer] = useState(false)
  const [done, setDone] = useState(false)

  const [user, setUser] = useState(null)
  async function getUser () {
    const loggedUser = localStorage.getItem('loggedUser')
    if (loggedUser) {
      const username = JSON.parse(loggedUser).username
      const user = await userService.getUser(username)
      setUser(user)
    }
    setDone(true) // whether user is logged or not, we want to render the navbar links
  }

  useEffect(() => {
    getUser()
  }, [])

  return (
    <nav className='shadow-2xl md:shadow-md w-full sticky top-0 left-0'>
      <div className='md:flex items-center justify-between bg-slate-900 py-4 md:px-10 px-7'>
        <div className='font-bold text-2xl cursor-pointer flex items-center text-gray-800'>
          <Link href='/' className='flex items-center'>
            <svg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth='1.5' stroke='currentColor' className='w-6 h-6  text-gray-100 mx-2'>
              <path strokeLinecap='round' strokeLinejoin='round' d='M8.25 21v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21m0 0h4.5V3.545M12.75 21h7.5V10.75M2.25 21h1.5m18 0h-18M2.25 9l4.5-1.636M18.75 3l-1.5.545m0 6.205l3 1m1.5.5l-1.5-.5M6.75 7.364V3h-3v18m3-13.636l10.5-3.819' />
            </svg>
            <span className='self-center text-xl font-semibold whitespace-nowrap text-white tracking-widest'>Get in Couch</span>
          </Link>
        </div>
        <Hamburger isOpen={isOpen} setOpenDrawer={setOpenDrawer} />
        {done && <NavbarLinks isOpen={isOpen} user={user} />}
      </div>
    </nav>

  )
}
