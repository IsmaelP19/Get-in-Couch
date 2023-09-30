import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { AiOutlineSearch } from 'react-icons/ai'
import { Pagination, Loading } from '@nextui-org/react'
import UserCard from '../../../components/UserCard'
import usersService from '../../../services/users'

export default function Followers () {
  const router = useRouter()
  const [username, setUsername] = useState(null)
  const [followers, setFollowers] = useState([])
  const [isLoading, setLoading] = useState(true)
  const [page, setPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [search, setSearch] = useState('')

  const LIMIT = 8

  useEffect(() => {
    if (!router.isReady) return
    const username = router.query.username
    setUsername(username)
    async function getFollowers () {
      const response = await usersService.getFollowers(username, search, page, LIMIT)
      setFollowers(response.followers)
      if (response.total === 0) setTotalPages(1)
      else setTotalPages(Math.ceil(response.total / LIMIT))
      setLoading(false)
    }
    getFollowers()
  }, [router, search])

  const handlePageChange = async (page) => {
    setLoading(true)
    setPage(page)
    const response = await usersService.getFollowers(username, search, page, LIMIT)
    setFollowers(response.followers)
    if (response.total === 0) setTotalPages(1)
    else setTotalPages(Math.ceil(response.total / LIMIT)) // in case the total number of properties has changed
    setLoading(false)
  }

  const handleSearchChange = (e) => {
    setSearch(e.target.value)
    console.log(e.target.value)
    setLoading(true)
  }

  return (
    <div className='flex flex-col w-full h-full my-10 gap-3 items-center justify-center'>
      <h1 className='text-3xl font-bold'>Seguidores</h1>
      <div className='flex  px-8 md:px-0 w-full md:w-1/3'>
        <div className='flex flex-row items-center border-2 border-slate-300 rounded-xl w-full px-2 '>
          <input type='text' className='h-10 w-[98%] outline-none' onChange={handleSearchChange} placeholder='Introduzca la búsqueda...' />
          <div className='ml-auto'>
            <AiOutlineSearch className='text-xl left-0' />
          </div>
        </div>
      </div>

      <div className='flex flex-col px-8 md:px-0 items-center gap-3 w-full'>
        {!isLoading && followers
          ? (
            <>
              {followers?.map(user => (
                <UserCard user={user} key={user.username} />
              ))}

              {followers.length === 0 && <span className='text-xl'>No se han encontrado usuarios</span>}

            </>
            )
          : <Loading color='primary' className='h-full ' />}

      </div>
      <Pagination
        initialPage={1}
        page={page}
        total={totalPages}
        onChange={handlePageChange}
        shadow bordered
        className='z-0'
      />
    </div>
  )
}

export async function getServerSideProps () {
  return {
    props: { title: 'Seguidores...' }
  }
}
