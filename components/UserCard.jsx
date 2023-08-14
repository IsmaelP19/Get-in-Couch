import Link from 'next/link'
import Image from 'next/image'

export default function UserCard ({ user }) {
  return (
    <Link href={`/profile/${user.username}`} key={user.id} className='flex flex-row gap-7 px-5 py-2 w-full md:w-1/3 border-2 rounded-3xl hover:shadow-md hover:bg-slate-50 transition-all duration-100 ease-in items-center'>
      <div className='w-1/4'>
        <Image src={user.profilePicture || '/static/images/default_avatar.png'} alt='profile picture' width={200} height={200} className='rounded-full w-28 h-28 object-cover border-2 border-slate-800' />
      </div>
      <div className='flex flex-col items-start justify-center gap-2 w-3/4'>
        <span className='text-lg'> {user.name} {user.surname}</span>
        <span className='italic text-base'> @{user.username}</span>
        <span className='text-base'>{user.description}</span>
      </div>
    </Link>
  )
}
