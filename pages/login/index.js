import LoginForm from '../../components/LoginForm'
import Notification from '../../components/Notification'
import { useAppContext } from '../../context/state'
import { useRouter } from 'next/router'
export default function SignIn () {
  // FIXME: the notification message is not shown on the upper side of the page because of the justify center property (only in higher resolutions i.e. 4k)
  const { user, message } = useAppContext()
  const router = useRouter()
  if (user) {
    router.push('/')
  } else {
    return (
      <>
        <div className='flex flex-col justify-center w-full'>
          <Notification message={message[0]} type={message[1]} />

          <LoginForm />
        </div>
      </>
    )
  }
}

SignIn.getInitialProps = async (context) => {
  return { title: 'Iniciar sesión' }
}
