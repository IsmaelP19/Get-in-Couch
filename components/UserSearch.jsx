import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useAppContext } from '../context/state'
import usersService from '../services/users'
import UserCard from './UserCard'
import { Loading, Pagination } from '@nextui-org/react'
import { AiOutlineSearch } from 'react-icons/ai'
import { LuMap } from 'react-icons/lu'

export default function UsersSearch ({ tenants, setTenants, onlyTenants, followers, following }) {
  const { user, done } = useAppContext()
  const [totalPages, setTotalPages] = useState(1)
  const [users, setUsers] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [urlSearchParams, setParams] = useState({})
  const router = useRouter()

  // La búsqueda se hará por nombre, apelidos, nombre de usuario, etc.
  // En otro campo se hará por ubicación (si la tiene, si no la tiene no aparecerá en esta búsqueda).
  // En otro campo se hará por valoración global media. Esto habría que añadirlo al perfil de usuario, de momento tenemos estadísticas medias con cada atributo, pero no una puntuación media global.

  useEffect(() => {
    if (done && !user) {
      router.push('/403')
    }
  }, [done])

  useEffect(() => {
    const fetchUsers = async () => {
      let fetchedUsers
      let username
      if (onlyTenants) {
        fetchedUsers = await usersService.search(urlSearchParams, currentPage, 5, true)
      } else if (following) {
        username = router.query.username
        fetchedUsers = await usersService.getFollowing(username, urlSearchParams, currentPage, 5)
      } else if (followers) {
        username = router.query.username
        fetchedUsers = await usersService.getFollowers(username, urlSearchParams, currentPage, 5)
      } else {
        fetchedUsers = await usersService.search(urlSearchParams, currentPage, 5)
      }

      console.log(fetchedUsers)

      setUsers(fetchedUsers.users)
      setTotalPages(Math.ceil(fetchedUsers.total / 5))
      setLoading(false)
    }

    fetchUsers()
  }, [currentPage, urlSearchParams])

  const handlePageChange = async (page) => {
    setLoading(true)
    window.scrollTo(0, 0)
    setCurrentPage(page)
  }
  const handleSearchChange = (e) => {
    setSearch(e.target.value)
  }

  const handleReset = async (e) => {
    e.preventDefault()
    document.querySelector('#search-input').value = ''
    document.querySelector('#ubication-input').value = ''
    document.querySelector('#avgRating').value = ''
    document.querySelector('#type').value = ''
    setLoading(true)
    setCurrentPage(1)
    setSearch('')
    setParams({})
  }

  const handleSearch = async (e) => {
    e.preventDefault()
    setLoading(true)

    const ubication = document.querySelector('#ubication-input').value.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    const avgRating = document.querySelector('#avgRating').value
    const type = document.querySelector('#type').value

    console.log(type)

    const searchParams = new URLSearchParams()
    if (search) searchParams.append('search', search)
    if (ubication) searchParams.append('ubication', ubication)
    if (avgRating) searchParams.append('avgRating', avgRating)
    if (type) searchParams.append('type', type)

    setParams(searchParams)
    setCurrentPage(1)

    let fetchedUsers
    let username
    if (onlyTenants) {
      fetchedUsers = await usersService.search(searchParams, 1, 5, true)
    } else if (following) {
      username = router.query.username
      fetchedUsers = await usersService.getFollowing(username, urlSearchParams, 1, 5)
    } else if (followers) {
      username = router.query.username
      fetchedUsers = await usersService.getFollowers(username, urlSearchParams, 1, 5)
    } else {
      fetchedUsers = await usersService.search(searchParams, 1, 5)
    }

    setUsers(fetchedUsers.users)
    setTotalPages(Math.ceil(fetchedUsers.total / 5))
    setLoading(false)
  }

  return (

    <div className='flex flex-col w-full h-full my-10 gap-3 items-center justify-center'>
      {!setTenants && <h1 className='text-3xl font-bold'>Usuarios</h1>}
      <div className='bg-blue-100 border-l-4 border-blue-500 text-blue-700 p-4 mx-[5%] mb-5 rounded' role='alert'>
        <p className='font-bold text-xl'>Atención</p>
        <p className='text-xl'>
          Para buscar por nombre, apellidos, nombre de usuario o descripción, introduzca la búsqueda en el campo de texto
        </p>
      </div>

      <div className='flex flex-col flex-wrap items-center justify-center px-4 w-full gap-4 md:px-0  md:w-2/3 xl:w-2/4 2xl:w-1/3'>
        <div className='flex flex-wrap items-center justify-center gap-4'>
          <div className='flex flex-row items-center border-2 border-slate-300 rounded-xl w-72 px-2 '>
            <input type='text' id='search-input' className='h-10 w-[98%] outline-none' onChange={handleSearchChange} placeholder='Introduzca la búsqueda...' />
            <div className='ml-auto'>
              <AiOutlineSearch className='text-xl left-0' />
            </div>
          </div>

          <div className='flex flex-row items-center border-2 border-slate-300 rounded-xl px-2 '>
            <input type='number' min={0} step={0.1} id='avgRating' className='h-10  outline-none' placeholder='Valoración media (mín)' />
          </div>

          <div className='flex flex-row items-center border-2 border-slate-300 rounded-xl w-60 px-2 '>
            <input type='text' id='ubication-input' className='h-10 w-[98%] outline-none' placeholder='Introduzca la ubicación...' />
            <div className='ml-auto'>
              <LuMap className='text-xl left-0' />
            </div>
          </div>

          {/* The following filter should not be rendered on the /tenants page.  */}
          {!onlyTenants && (
            <div className='flex flex-row items-center border-2 border-slate-300 rounded-xl px-2 '>
              <select id='type' className='h-10 w-full outline-none'>
                <option value=''>Tipo de usuario</option>
                <option value='tenantRelated'>Inquilino</option>
                <option value='owner'>Propietario</option>ç
                <option value='tenant'>Inquilino en busca de inmueble</option>
              </select>
            </div>
          )}
        </div>
        <div className='flex items-center justify-center gap-4 flex-wrap'>
          <button className='bg-green-200 hover:bg-green-700 hover:text-white transition-all text-black font-bold py-2 px-4 rounded-lg' onClick={handleSearch}>
            Aplicar
          </button>
          <button className='bg-red-200 hover:bg-red-700 hover:text-white transition-all text-black font-bold py-2 px-4 rounded-lg' onClick={handleReset}>
            Restablecer
          </button>
        </div>
      </div>

      <div className='flex flex-col px-2 md:px-0 items-center gap-3 w-full'>
        {!loading && users
          ? (
            <>
              {users?.map(user => (
                <UserCard user={user} key={user.id} setTenants={setTenants} tenants={tenants} />
              ))}

              {users.length === 0 && <span className='text-xl'>No se han encontrado usuarios</span>}

            </>
            )
          : <Loading color='primary' className='h-full ' />}

      </div>
      <Pagination
        initialPage={1}
        page={currentPage}
        total={totalPages}
        onChange={handlePageChange}
        shadow bordered loop
        className='z-0'
      />
    </div>

  )
}
