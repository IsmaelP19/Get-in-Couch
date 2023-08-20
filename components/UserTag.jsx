import Link from 'next/link'
import Image from 'next/image'
import { AiFillDelete } from 'react-icons/ai'

export default function UserTag ({ user, link, action }) {
  return (link
    ? (
      <Link href={`/profile/${user.username}`} className='flex items-center rounded-full px-2 py-1 border border-slate-700 max-w-fit bg-blue-200 hover:bg-slate-700 hover:text-white hover:border-slate-200 ease-in-out duration-150 transition-all'>
        <Image src={user.profilePicture || '/static/images/default_avatar.png'} alt='profile picture' width={200} height={200} className='rounded-full border border-black w-10 h-10 object-cover' />
        <span className='ml-2'>{user.name} {user.surname}</span>
      </Link>
      )
    : (
      <div className='flex items-center rounded-full px-2 py-1 border border-slate-700 max-w-fit bg-blue-200 gap-2'>
        <Image src={user.profilePicture || '/static/images/default_avatar.png'} alt='profile picture' width={200} height={200} className='rounded-full border border-black w-10 h-10 object-cover' />
        <span>{user.name} {user.surname}</span>
        <button className='ease-in-out duration-150 transition-all hover:text-red-600 text-2xl' onClick={action}>
          <AiFillDelete />
        </button>
      </div>
      )
  )
}
