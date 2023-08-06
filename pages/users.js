import UserSearch from '../components/UserCard'
import { useState, useEffect } from 'react'
import usersService from '../services/users'
import { Loading, Pagination } from '@nextui-org/react'
import { AiOutlineSearch } from 'react-icons/ai'
import { showMessage } from '../utils/utils'
import { useAppContext } from '../context/state'
import { useRouter } from 'next/router'

export default function Users () {
  const { user, done, setMessage } = useAppContext()
  const [users, setUsers] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [totalPages, setTotalPages] = useState(1)
  const [page, setPage] = useState(1)
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
    usersService.search(search, 1, 5)
      .then(response => {
        setUsers(response.users)
        // if (response.total === 0) setTotalPages(1)
        setTotalPages(Math.ceil(response.total / 5))
        setLoading(false)
      }).catch(error => {
        showMessage(error.response.data.error, 'error', setMessage, 4000, true)
      })
  }, [search])

  const handlePageChange = async (page) => {
    setLoading(true)
    window.scrollTo(0, 0)
    setPage(page)
    const fetchedUsers = await usersService.search(search, page, 5)
    setUsers(fetchedUsers.users)
    setTotalPages(Math.ceil(fetchedUsers.total / 5))
    setLoading(false)
  }

  return (

    <div className='flex flex-col w-full h-full my-10 gap-3 items-center justify-center'>
      <h1 className='text-3xl font-bold'>Usuarios</h1>
      <div className='flex  px-8 md:px-0 w-full md:w-1/3'>
        <div className='flex flex-row items-center border-2 border-slate-300 rounded-xl w-full px-2 '>
          <input type='text' className='h-10 w-[98%] outline-none' onChange={handleSearchChange} placeholder='Introduzca la búsqueda...' />
          <div className='ml-auto'>
            <AiOutlineSearch className='text-xl left-0' />
          </div>
        </div>
      </div>

      <div className='flex flex-col px-8 md:px-0 items-center gap-3 w-full'>
        {!loading && users
          ? (
            <>
              {users?.map(user => (
                <UserSearch user={user} key={user.id} />
              ))}

              {users.length === 0 && <span className='text-xl'>No se han encontrado usuarios</span>}

            </>
            )
          : <Loading color='primary' className='h-full ' />}

      </div>
      <Pagination
        initialPage={1}
        page={page}
        total={totalPages}
        onChange={handlePageChange}
        shadow bordered loop
        className='z-0'
      />
    </div>

  )
}

export async function getServerSideProps () {
  return {
    props: {
      title: 'Buscar usuarios'
    }
  }
}
