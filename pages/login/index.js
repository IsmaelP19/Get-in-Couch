import LoginForm from '../../components/LoginForm'
import Notification from '../../components/Notification'
import { useAppContext } from '../../context/state'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
export default function SignIn () {
  // FIXME: the notification message is not shown on the upper side of the page because of the justify center property (only in higher resolutions i.e. 4k)
  const { user, message } = useAppContext()
  const [done, setDone] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (user) {
      router.push('/')
    } else {
      setDone(true)
    }
  }, [user, router])

  return (!user && done &&
    <>
      <div className='flex flex-col justify-center w-full'>
        <Notification message={message[0]} type={message[1]} />
        <LoginForm />
      </div>
    </>
  )
}

SignIn.getInitialProps = async (context) => {
  return { title: 'Iniciar sesión' }
}
