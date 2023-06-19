import { useEffect } from 'react'
import PropertyForm from '../../../components/PropertyForm'
import Notification from '../../../components/Notification'
import { useRouter } from 'next/router'
import { useAppContext } from '../../../context/state'

export default function CreateProperty () {
  const { user, message, done } = useAppContext()
  const router = useRouter()

  useEffect(() => {
    if (done && !user?.isOwner) {
      router.push('/403')
    }
  }, [user, router, done])

  return (user?.isOwner &&
    <>
      <div className='flex flex-col justify-center w-full'>
        <Notification message={message[0]} type={message[1]} />
        <PropertyForm />
      </div>
    </>
  )
}

CreateProperty.getInitialProps = async (context) => {
  return { title: 'Nuevo anuncio' }
}
