import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'

export default function Roommate ({ user, days, lastEvaluated, myTenant, myLandlord }) {
  const router = useRouter()

  const handleEvaluate = () => {
    if (days >= 30) router.push(`/evaluate/${user.username}`)
  }

  const lastEdit = Math.floor((new Date() - new Date(lastEvaluated)) / (1000 * 60 * 60 * 24))

  return (
    <div className='flex flex-col rounded-2xl shadow-md bg-blue-100 items-center justify-center py-3 px-4 w-80 border-2 border-slate-700  text-xl gap-3'>
      <div className='flex gap-2 w-full'>
        <div className='w-1/3 self-center '>
          <Image src={user.profilePicture || '/static/images/default_avatar.png'} alt='profile picture' width={200} height={200} className='rounded-full border border-black w-20 h-20 object-cover m-auto' />
        </div>
        <div className='flex flex-row items-center gap-2 w-2/3'>
          <div className='flex flex-col'>
            <span>{user.name} {user.surname}</span>
            <span className='italic text-base'> @{user.username}</span>
            {days >= 0 && (

              <span className={`italic text-base font-bold ${days >= 30 ? 'text-green-700 ' : 'text-red-600'} `}> {days} días {myTenant ? 'viviendo en mi inmueble' : (myLandlord ? 'siendo mi casero' : 'viviendo conmigo')} </span>
            )}

            {lastEvaluated && (
              <span className={`italic text-base font-bold ${lastEdit >= 7 ? 'text-green-700 ' : 'text-red-600'} `}> {lastEdit} días desde la última evaluación</span>
            )}
          </div>
        </div>
      </div>

      <div className='flex items-center justify-center gap-2 text-base'>
        <Link href={`/profile/${user.username}`} className='rounded-full bg-slate-700 hover:bg-gray-200 text-white hover:text-black duration-200 border-2 border-gray-200 hover:border-slate-700  px-5 py-1 '>
          Perfil
        </Link>
        {days >= 0 && (
          <button className={`rounded-full duration-200 border-2  px-5 py-1 ${days >= 30 ? 'bg-green-300 hover:bg-green-700 border-green-700  text-black hover:text-white' : 'cursor-not-allowed text-gray-500 bg-gray-200 border-gray-300 '}`} disabled={days < 30} onClick={handleEvaluate}>
            Evaluar
          </button>
        )}

      </div>
    </div>

  )
}
