import Image from 'next/image'
import { useAppContext } from '../context/state'
import Link from 'next/link'
export default function Message ({ message }) {
  const { user } = useAppContext()
  /*
  * We will have to show the message, the date and the user who sent it along with his/her profile picture and name and surname
  * We will have to show the message in a different way if the user who sent it is the same as the user who is logged in
  * If the user who has logged in is the author, the message will appear on the right and have a different background color (blue for example)
  * If the user who has logged in is not the receiver, the message will appear on the left and have a different background color (gray for example)
  *
  * we have the following info inside the message object:
  * author: {id, name, surname, username, profilePhoto}
  * receiver: {id, name, surname, username, profilePhoto} //TODO: we won't need this actually
  * message: string
  * date: string (in the format dd/mm/yyyy hh:mm:ss)
  * read: boolean //TODO: not sure if I am going to use this yet
  */

  return (
    <div className={`flex flex-col w-fit gap-2 p-2 rounded-2xl border-2 ${message.author.id === user.id ? 'border-blue-300 bg-blue-400 text-white self-end rounded-ee-none' : 'border-gray-200 bg-gray-300 rounded-es-none'}`}>

      <Link href={`/profile/${message.author.username}`} className={`flex flex-row items-center justify-start gap-3 text-base hover:underline ${message.author.id === user.id ? 'hover:text-black' : 'hover:text-blue-600'}`}>
        <Image src={message.author.profilePhoto || '/static/images/default_avatar.png'} width={30} height={30} alt={message.author.username} />
        {`${message.author.name} ${message.author.surname}`}
      </Link>

      <div className='flex flex-col items-start justify-center gap-3 text-base '>
        <span className=' text-base'>
          {message.message}
        </span>
        <span className='self-end'>
          {message.date}
        </span>
      </div>
    </div>

  )
}
