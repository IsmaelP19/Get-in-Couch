import LoginForm from '../../components/LoginForm'
import Notification from '../../components/Notification'
import { useAppContext } from '../../context/state'
import { useEffect } from 'react'
import { useRouter } from 'next/router'
export default function SignIn () {
  // FIXME: the notification message is not shown on the upper side of the page because of the justify center property (only in higher resolutions i.e. 4k)
  const { user, message, done } = useAppContext()

  const router = useRouter()

  // INFO: the error on the console is not a real problem, it is just a warning that the redirection is not done again,
  // because it has already been done before on the LoginForm component (when logged in)
  useEffect(() => {
    if (done && user) {
      router.push('/')
    }
  }, [user, router, done])

  return (done && !user &&
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
