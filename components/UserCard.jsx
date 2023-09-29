import Link from 'next/link'
import Image from 'next/image'
import { AiFillStar } from 'react-icons/ai'

export default function UserCard ({ user, tenants, setTenants }) {
  const handleUserClick = () => {
    if (tenants.find(tenant => tenant.id === user.id)) {
      setTenants(tenants.filter(tenant => tenant.id !== user.id))
    } else {
      setTenants([...tenants, user])
    }
  }

  return (
    setTenants === undefined
      ? (
        <Link href={`/profile/${user.username}`} key={user.id} className='flex flex-row gap-2 px-4 py-2 w-full md:w-2/3 xl:w-2/4 2xl:w-1/3 border-2 rounded-3xl hover:shadow-md hover:bg-slate-50 transition-all duration-100 ease-in items-center'>
          <User user={user} />
        </Link>
        )
      : (
        <div className='flex flex-row gap-2 px-4 py-2 w-full md:w-3/5 xl:w-2/4 2xl:w-1/3 border-2 rounded-3xl hover:shadow-md hover:bg-slate-50 transition-all duration-100 ease-in items-center cursor-pointer' onClick={handleUserClick}>
          <User user={user} />
        </div>
        )

  )
}

const User = ({ user }) => {
  return (
    <>
      <div className='flex items-center justify-center w-2/5 md:w-1/4'>
        <Image src={user.profilePicture || '/static/images/default_avatar.png'} alt='profile picture' width={200} height={200} className='rounded-full w-24 md:w-28 h-24 md:h-28 object-cover border-2 border-slate-800' />
      </div>
      <div className='flex flex-col items-start justify-center gap-2 w-2/3 md:w-3/4 '>
        <span className='text-lg'> {user.name} {user.surname}</span>
        <div className='flex flex-row flex-wrap gap-5'>
          <span className='italic text-base'> @{user.username}</span>
          <span className='flex gap-1 items-center justify-center bg-blue-100 px-2 rounded-xl font-bold'>{Math.floor(user?.avgRating * 100) / 100} <AiFillStar className='text-yellow-500' /></span>
          <span className='flex gap-1 items-center justify-center bg-blue-100 px-2 rounded-xl font-bold'>{user.numberOfEvaluations} {user.numberOfEvaluations === 1 ? 'valoración' : 'valoraciones'}</span>
        </div>
        <span className='hidden md:flex text-base'>{user.description}</span>
      </div>
    </>
  )
}
