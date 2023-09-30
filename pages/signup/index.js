import SignUpForm from '../../components/SignUpForm'
import Notification from '../../components/Notification'
import { useAppContext } from '../../context/state'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

export default function SignUp () {
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
        <SignUpForm />
      </div>
    </>
  )
}

SignUp.getInitialProps = async (context) => {
  return { title: 'Registrarse' }
}
