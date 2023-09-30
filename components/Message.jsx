import Image from 'next/image'
import { useAppContext } from '../context/state'
import Link from 'next/link'
export default function Message ({ message }) {
  const { user } = useAppContext()

  const profilePicture = message.author.profilePicture || '/static/images/default_avatar.png'

  return (
    <div className={`flex flex-col w-fit gap-2 p-3 rounded-3xl border-2 ${message.author.id === user.id ? 'border-blue-300 bg-blue-400 text-white self-end rounded-ee-none ml-[10%]' : 'border-gray-200 bg-gray-300 rounded-es-none mr-[10%]'}`}>
      <div className='flex '>
        <Link href={`/profile/${message.author.username}`} className={`flex flex-row items-center justify-start gap-3 text-base hover:underline ${message.author.id === user.id ? 'hover:text-black' : 'hover:text-blue-600'}`}>
          <Image src={profilePicture} width={30} height={30} alt={message.author.username} className='object-cover rounded-full w-8 h-8' />
          {`${message.author.name} ${message.author.surname}`}
        </Link>
      </div>

      <div className='flex flex-col items-start justify-center gap-3 text-base '>
        <span className=' text-base'>
          {message.message}
        </span>
        <span className='self-end '>
          {message.date}
        </span>
      </div>
    </div>

  )
}
