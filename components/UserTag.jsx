import Link from 'next/link'
import Image from 'next/image'

export default function UserTag ({ user }) {
  return (
    <Link href={`/profile/${user.username}`} className='flex items-center rounded-full px-2 py-1 border border-slate-700 max-w-fit hover:bg-slate-700 hover:text-white hover:border-slate-200 ease-in-out duration-150 transition-all'>
      <Image src={user.profilePicture} alt='profile picture' width={50} height={50} className='rounded-full w-10 h-10 object-cover' />
      <span className='ml-2 '>{user.name} {user.surname}</span>
    </Link>
  )
}
