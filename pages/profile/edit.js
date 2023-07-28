import SignUpForm from '../../components/SignUpForm'
import Notification from '../../components/Notification'
import { useAppContext } from '../../context/state'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { Loading } from '@nextui-org/react'
import usersService from '../../services/users'
export default function EditProfile () {
  const { user, setUser, done, message } = useAppContext()
  const router = useRouter()

  useEffect(() => {
    if (done && !user) {
      router.push('/')
    } else if (done && user) {
      // then we will fetch again our data to update the context
      async function fetchUser () {
        const userObject = await usersService.getUser(user.username)
        setUser(userObject)
      }
      fetchUser()
    }
  }, [router, done]) // if we add the user to the dependencies, it will be an infinite loop because of the setUser

  return (
    <div className='flex flex-col w-full items-center justify-center'>

      {!done && <Loading color='primary' />}
      {done && user && (
        <>
          <Notification message={message[0]} type={message[1]} />
          <SignUpForm userObject={user} />
        </>

      )}
    </div>
  )
}
export async function getServerSideProps () {
  return {
    props: { title: 'Mi cuenta' }
  }
}
