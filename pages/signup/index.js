import SignUpForm from '../../components/SignUpForm'
import Notification from '../../components/Notification'
import { useAppContext } from '../../context/state'

export default function SignUp () {
  const { message } = useAppContext()

  // FIXME: the notification message is not shown on the upper side of the page because of the justify center property (only in higher resolutions i.e. 4k)

  return (
    <>
      <div className='flex flex-col justify-center w-full'>
        <Notification message={message[0]} type={message[1]} />
        <SignUpForm />
      </div>
    </>
  )
}

SignUp.getInitialProps = async (context) => {
  return { title: 'Registrarse' }
}
