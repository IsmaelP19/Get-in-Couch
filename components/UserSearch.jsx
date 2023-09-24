import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { useAppContext } from '../context/state'
import usersService from '../services/users'
import { showMessage } from '../utils/utils'
import UserCard from './UserCard'
import { Loading, Pagination } from '@nextui-org/react'
import { AiOutlineSearch } from 'react-icons/ai'

export default function UsersSearch ({ tenants, setTenants, onlyTenants }) {
  const { user, done, setMessage } = useAppContext()
  const [users, setUsers] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(false)
  const [totalPages, setTotalPages] = useState(1)
  const [currentPage, setCurrentPage] = useState(1)
  const router = useRouter()

  useEffect(() => {
    if (done && !user) {
      router.push('/403')
    }
  }, [done])

  const handleSearchChange = (e) => {
    setSearch(e.target.value)
    setLoading(true)
  }

  useEffect(() => {
    if (onlyTenants) {
      usersService.search(search, 1, 5, true)
        .then(response => {
          setUsers(response.users)
          setTotalPages(Math.ceil(response.total / 5))
          setLoading(false)
        }).catch(error => {
          showMessage(error.response.data.error, 'error', setMessage, 4000, true)
        })
    } else {
      usersService.search(search, 1, 5)
        .then(response => {
          setUsers(response.users)
          setTotalPages(Math.ceil(response.total / 5))
          setLoading(false)
        }).catch(error => {
          showMessage(error.response.data.error, 'error', setMessage, 4000, true)
        })
    }
  }, [search])

  const handlePageChange = async (page) => {
    setLoading(true)
    window.scrollTo(0, 0)
    setCurrentPage(page)

    let fetchedUsers
    if (onlyTenants) {
      fetchedUsers = await usersService.search(search, page, 5, true)
    } else {
      fetchedUsers = await usersService.search(search, page, 5)
    }

    setUsers(fetchedUsers.users)
    setTotalPages(Math.ceil(fetchedUsers.total / 5))
    setLoading(false)
  }

  return (

    <div className='flex flex-col w-full h-full my-10 gap-3 items-center justify-center'>
      {!setTenants && <h1 className='text-3xl font-bold'>Usuarios</h1>}
      <div className='flex px-8 md:px-0 w-full md:w-2/3 xl:w-2/4 2xl:w-1/3'>
        <div className='flex flex-row items-center border-2 border-slate-300 rounded-xl w-full px-2 '>
          <input type='text' className='h-10 w-[98%] outline-none' onChange={handleSearchChange} placeholder={setTenants ? 'Busca a tu nuevo inquilino' : 'Introduzca la búsqueda...'} />
          <div className='ml-auto'>
            <AiOutlineSearch className='text-xl left-0' />
          </div>
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
